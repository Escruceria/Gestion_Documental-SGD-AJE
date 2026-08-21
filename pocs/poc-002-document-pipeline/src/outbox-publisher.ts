import { randomUUID } from "node:crypto";
import { hostname } from "node:os";

import amqp, { type ChannelModel, type ConfirmChannel } from "amqplib";
import pg from "pg";

const { Client } = pg;

const EXCHANGE = "gd.events";
const ROUTING_KEY =
  process.env.POC_ROUTING_KEY ?? "document.version.registered.v1";

const CLAIM_LEASE_MS = 60_000;
const CONFIRM_TIMEOUT_MS = 30_000;

type OutboxRow = {
  message_id: string;
  tenant_id: string;
  message_type: string;
  message_version: number;
  kind: "event" | "command";
  aggregate_id: string;
  correlation_id: string;
  causation_id: string | null;
  producer: string;
  payload: unknown;
  occurred_at: Date;
  attempt_count: number;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function publisherId(): string {
  const configured = process.env.POC_OUTBOX_PUBLISHER_ID?.trim();

  if (configured) {
    return configured.slice(0, 128);
  }

  return `${hostname()}:${process.pid}`.slice(0, 128);
}

function publishBackoffMs(attemptCount: number): number {
  if (attemptCount <= 1) {
    return 5_000;
  }

  if (attemptCount === 2) {
    return 30_000;
  }

  return 300_000;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  description: string
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `${description} timed out after ${timeoutMs} ms`
            )
          );
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function releaseClaim(
  db: pg.Client,
  row: OutboxRow,
  claimToken: string,
  delayMs: number
): Promise<void> {
  const update = await db.query(
    `
      UPDATE outbox_messages
      SET
        claim_token = NULL,
        claimed_by = NULL,
        claimed_at = NULL,
        claim_expires_at = NULL,
        next_attempt_at =
          now() + ($3::integer * interval '1 millisecond')
      WHERE message_id = $1
        AND claim_token = $2::uuid
        AND claim_expires_at > now()
        AND published_at IS NULL
    `,
    [
      row.message_id,
      claimToken,
      delayMs,
    ]
  );

  if (update.rowCount === 1) {
    console.error(
      `RETRY SCHEDULED ${row.message_id} ` +
        `attempt=${row.attempt_count} delayMs=${delayMs}`
    );

    return;
  }

  console.error(
    `CLAIM RELEASE SKIPPED ${row.message_id}; ` +
      "ownership was already lost or message was published."
  );
}

async function main(): Promise<void> {
  const postgresPassword =
    requireEnv("POC_DOCUMENT_CORE_DB_PASSWORD");

  const rabbitPassword =
    requireEnv("POC_RABBITMQ_PASSWORD");

  const owner = publisherId();
  const claimToken = randomUUID();

  const db = new Client({
    host: "127.0.0.1",
    port: 5434,
    database: "sgd_poc_document_core",
    user: "sgd_poc_document_core",
    password: postgresPassword,
  });

  await db.connect();

  let connection: ChannelModel | undefined;
  let channel: ConfirmChannel | undefined;
  let row: OutboxRow | undefined;

  try {
    const result = await db.query<OutboxRow>(
      `
        WITH candidate AS (
          SELECT message_id
          FROM outbox_messages
          WHERE published_at IS NULL
            AND next_attempt_at <= now()
            AND (
              claim_expires_at IS NULL
              OR claim_expires_at <= now()
            )
          ORDER BY
            next_attempt_at,
            created_at,
            message_id
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        UPDATE outbox_messages AS o
        SET
          claim_token = $1::uuid,
          claimed_by = $2,
          claimed_at = now(),
          claim_expires_at =
            now() + ($3::integer * interval '1 millisecond'),
          attempt_count = o.attempt_count + 1
        FROM candidate AS c
        WHERE o.message_id = c.message_id
        RETURNING
          o.message_id,
          o.tenant_id,
          o.message_type,
          o.message_version,
          o.kind,
          o.aggregate_id,
          o.correlation_id,
          o.causation_id,
          o.producer,
          o.payload,
          o.occurred_at,
          o.attempt_count
      `,
      [
        claimToken,
        owner,
        CLAIM_LEASE_MS,
      ]
    );

    row = result.rows[0];

    if (!row) {
      console.log("No eligible pending outbox messages.");
      return;
    }

    console.log(
      `CLAIMED ${row.message_id} ` +
        `owner=${owner} attempt=${row.attempt_count}`
    );

    try {
      const rabbitUrl =
        `amqp://sgd_poc:${encodeURIComponent(rabbitPassword)}` +
        `@127.0.0.1:5673/%2Fsgd-poc002`;

      connection = await amqp.connect(rabbitUrl);
      channel = await connection.createConfirmChannel();

      let returned = false;

      channel.on("return", (message) => {
        returned = true;

        console.error(
          `Message returned by RabbitMQ: ` +
            `${message.properties.messageId ?? "unknown"}`
        );
      });

      const envelope = {
        messageId: row.message_id,
        messageType: row.message_type,
        messageVersion: row.message_version,
        kind: row.kind,
        occurredAt: row.occurred_at.toISOString(),
        tenantId: row.tenant_id,
        correlationId: row.correlation_id,
        causationId: row.causation_id,
        producer: row.producer,
        contentType: "application/json",
        payload: row.payload,
      };

      const accepted = channel.publish(
        EXCHANGE,
        ROUTING_KEY,
        Buffer.from(JSON.stringify(envelope)),
        {
          persistent: true,
          mandatory: true,
          contentType: "application/json",
          messageId: row.message_id,
          correlationId: row.correlation_id,
          type: row.message_type,
          timestamp: Math.floor(Date.now() / 1000),
        }
      );

      if (!accepted) {
        await new Promise<void>((resolve) => {
          channel!.once("drain", resolve);
        });
      }

      await withTimeout(
        channel.waitForConfirms(),
        CONFIRM_TIMEOUT_MS,
        `Publisher confirm for ${row.message_id}`
      );

      await new Promise((resolve) => setImmediate(resolve));

      if (returned) {
        throw new Error(
          `RabbitMQ returned message ${row.message_id}; ` +
            "outbox remains pending."
        );
      }

      const update = await db.query(
        `
          UPDATE outbox_messages
          SET
            published_at = now(),
            claim_token = NULL,
            claimed_by = NULL,
            claimed_at = NULL,
            claim_expires_at = NULL
          WHERE message_id = $1
            AND claim_token = $2::uuid
            AND claim_expires_at > now()
            AND published_at IS NULL
        `,
        [
          row.message_id,
          claimToken,
        ]
      );

      if (update.rowCount !== 1) {
        throw new Error(
          `Outbox claim for ${row.message_id} ` +
            "was lost before publication could be finalized."
        );
      }

      console.log(`PUBLISHED ${row.message_id}`);
    } catch (error) {
      const delayMs =
        publishBackoffMs(row.attempt_count);

      try {
        await releaseClaim(
          db,
          row,
          claimToken,
          delayMs
        );
      } catch (releaseError) {
        const releaseMessage =
          releaseError instanceof Error
            ? releaseError.message
            : String(releaseError);

        console.error(
          `CLAIM RELEASE FAILED ${row.message_id}: ` +
            releaseMessage
        );
      }

      throw error;
    }
  } finally {
    if (channel) {
      await channel.close().catch(() => undefined);
    }

    if (connection) {
      await connection.close().catch(() => undefined);
    }

    await db.end().catch(() => undefined);
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(`PUBLISH FAILED: ${message}`);
  process.exitCode = 1;
});