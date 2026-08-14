import amqp, {
  type ChannelModel,
  type ConsumeMessage,
} from "amqplib";
import pg from "pg";
import { z } from "zod";

const { Client } = pg;

const QUEUE =
  "document-processing.scan-document.q";

const EnvelopeSchema = z.object({
  messageId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{20,64}$/),

  messageType: z.literal(
    "processing.scan-document"
  ),

  messageVersion: z.literal(1),

  kind: z.literal("command"),

  occurredAt: z
    .string()
    .datetime(),

  tenantId: z
    .string()
    .uuid(),

  correlationId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{20,64}$/),

  causationId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{20,64}$/)
    .nullable()
    .optional(),

  producer: z
    .string()
    .min(1),

  contentType: z.literal(
    "application/json"
  ),

  payload: z.object({
    versionId: z
      .string()
      .uuid(),

    objectRef: z
      .string()
      .min(1),

    scanPolicyVersion: z
      .string()
      .min(1),
  }).strict(),
}).strict();

type ScanCommandEnvelope =
  z.infer<typeof EnvelopeSchema>;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

async function processMessage(
  db: pg.Client,
  message: ConsumeMessage
): Promise<"processed" | "duplicate"> {
  const parsedJson: unknown =
    JSON.parse(message.content.toString("utf8"));

  const envelope: ScanCommandEnvelope =
    EnvelopeSchema.parse(parsedJson);

  await db.query("BEGIN");

  try {
    const inboxInsert = await db.query(
      `
        INSERT INTO inbox_messages (
          message_id,
          tenant_id,
          message_type,
          message_version,
          correlation_id
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        ON CONFLICT (message_id)
        DO NOTHING
        RETURNING message_id
      `,
      [
        envelope.messageId,
        envelope.tenantId,
        envelope.messageType,
        envelope.messageVersion,
        envelope.correlationId,
      ]
    );

    if (inboxInsert.rowCount === 0) {
      await db.query("COMMIT");
      return "duplicate";
    }

    await db.query(
      `
        INSERT INTO processing_jobs (
          id,
          tenant_id,
          source_message_id,
          target_version_id,
          target_object_ref,
          job_type,
          policy_version,
          status,
          attempt_count
        )
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          $4,
          'MALWARE_SCAN',
          $5,
          'PENDING',
          0
        )
      `,
      [
        envelope.tenantId,
        envelope.messageId,
        envelope.payload.versionId,
        envelope.payload.objectRef,
        envelope.payload.scanPolicyVersion,
      ]
    );

    await db.query(
      `
        UPDATE inbox_messages
        SET processed_at = now()
        WHERE message_id = $1
      `,
      [envelope.messageId]
    );

    await db.query("COMMIT");

    return "processed";
  } catch (error) {
    await db
      .query("ROLLBACK")
      .catch(() => undefined);

    throw error;
  }
}

async function main(): Promise<void> {
  const processingPassword =
    requireEnv(
      "POC_PROCESSING_DB_PASSWORD"
    );

  const rabbitPassword =
    requireEnv(
      "POC_RABBITMQ_PASSWORD"
    );

  const db = new Client({
    host: "127.0.0.1",
    port: 5434,
    database: "sgd_poc_processing",
    user: "sgd_poc_processing",
    password: processingPassword,
  });

  await db.connect();

  let connection:
    | ChannelModel
    | undefined;

  try {
    const rabbitUrl =
      `amqp://sgd_poc:${encodeURIComponent(
        rabbitPassword
      )}` +
      `@127.0.0.1:5673/%2Fsgd-poc002`;

    connection =
      await amqp.connect(rabbitUrl);

    const channel =
      await connection.createChannel();

    await channel.prefetch(1);

    await channel.consume(
      QUEUE,
      async (message) => {
        if (!message) {
          return;
        }

        try {
          const result =
            await processMessage(
              db,
              message
            );

          const crashAfterCommitMessageId =
            process.env[
              "POC_CRASH_AFTER_COMMIT_MESSAGE_ID"
            ];

          if (
            result === "processed" &&
            crashAfterCommitMessageId ===
              message.properties.messageId
          ) {
            console.log(
              `POC CRASH AFTER COMMIT ${message.properties.messageId ?? "unknown"}`
            );

            process.exit(86);
          }

          channel.ack(message);

          console.log(
            result === "processed"
              ? `PROCESSED ${message.properties.messageId ?? "unknown"}`
              : `DUPLICATE ACK ${message.properties.messageId ?? "unknown"}`
          );
        } catch (error) {
          const detail =
            error instanceof Error
              ? error.message
              : String(error);

          console.error(
            `CONSUME FAILED: ${detail}`
          );

          channel.nack(
            message,
            false,
            true
          );
        }
      },
      {
        noAck: false,
      }
    );

    console.log(
      `CONSUMER READY ${QUEUE}`
    );

    await new Promise<void>(
      () => undefined
    );
  } finally {
    if (connection) {
      await connection
        .close()
        .catch(() => undefined);
    }

    await db
      .end()
      .catch(() => undefined);
  }
}

main().catch(
  (error: unknown) => {
    const detail =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      `CONSUMER START FAILED: ${detail}`
    );

    process.exitCode = 1;
  }
);
