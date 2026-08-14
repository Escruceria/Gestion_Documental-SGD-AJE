import amqp, { type ChannelModel, type ConfirmChannel } from "amqplib";
import pg from "pg";

const { Client } = pg;

const EXCHANGE = "gd.events";
const ROUTING_KEY = process.env.POC_ROUTING_KEY ?? "document.version.registered.v1";

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
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main(): Promise<void> {
  const postgresPassword = requireEnv("POC_DOCUMENT_CORE_DB_PASSWORD");
  const rabbitPassword = requireEnv("POC_RABBITMQ_PASSWORD");

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

  try {
    const result = await db.query<OutboxRow>(`
      SELECT
        message_id,
        tenant_id,
        message_type,
        message_version,
        kind,
        aggregate_id,
        correlation_id,
        causation_id,
        producer,
        payload,
        occurred_at
      FROM outbox_messages
      WHERE published_at IS NULL
      ORDER BY created_at
      LIMIT 1
    `);

    const row = result.rows[0];

    if (!row) {
      console.log("No pending outbox messages.");
      return;
    }

    const rabbitUrl =
      `amqp://sgd_poc:${encodeURIComponent(rabbitPassword)}` +
      `@127.0.0.1:5673/%2Fsgd-poc002`;

    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createConfirmChannel();

    let returned = false;

    channel.on("return", (message) => {
      returned = true;

      console.error(
        `Message returned by RabbitMQ: ${message.properties.messageId ?? "unknown"}`
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

    await channel.waitForConfirms();

    await new Promise((resolve) => setImmediate(resolve));

    if (returned) {
      throw new Error(
        `RabbitMQ returned message ${row.message_id}; outbox remains pending.`
      );
    }

    const update = await db.query(
      `
        UPDATE outbox_messages
        SET published_at = now()
        WHERE message_id = $1
          AND published_at IS NULL
      `,
      [row.message_id]
    );

    if (update.rowCount !== 1) {
      throw new Error(
        `Outbox row ${row.message_id} was not marked as published.`
      );
    }

    console.log(`PUBLISHED ${row.message_id}`);
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
