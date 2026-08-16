import amqp, {
  type ChannelModel,
  type ConfirmChannel,
  type ConsumeMessage,
} from "amqplib";
import pg from "pg";
import { z } from "zod";

const { Client } = pg;

const QUEUE =
  "document-processing.scan-document.q";

const RETRY_EXCHANGE =
  "gd.retry";

const DEAD_EXCHANGE =
  "gd.dead";


const RETRY_5S_ROUTING_KEY =
  "processing.scan-document.retry.5s";

const RETRY_30S_ROUTING_KEY =
  "processing.scan-document.retry.30s";

const RETRY_5M_ROUTING_KEY =
  "processing.scan-document.retry.5m";

const DEAD_ROUTING_KEY =
  "processing.scan-document.dead";

const MAX_MESSAGE_BYTES =
  256 * 1024;

const DISPOSITION_FATAL_EXIT_CODE =
  87;

class OversizedMessageError extends Error {
  constructor(
    readonly actualBytes: number,
    readonly maxBytes: number
  ) {
    super(
      `MESSAGE TOO LARGE actual=${actualBytes} max=${maxBytes}`
    );

    this.name =
      "OversizedMessageError";
  }
}

type FailureDisposition =
  | {
      kind: "retry";
      routingKey: string;
      level: "5s" | "30s" | "5m";
    }
  | {
      kind: "dead";
      reason: string;
    };

function getRetryStage(
  message: ConsumeMessage
): number {
  const rawStage =
    message.properties.headers?.[
      "sgd-retry-stage"
    ];

  if (
    typeof rawStage === "number" &&
    Number.isInteger(rawStage) &&
    rawStage >= 0
  ) {
    return rawStage;
  }

  return 0;
}

function classifyFailure(
  message: ConsumeMessage,
  error: unknown
): FailureDisposition {
  if (
    error instanceof OversizedMessageError
  ) {
    return {
      kind: "dead",
      reason: "message-too-large",
    };
  }

  if (
    error instanceof SyntaxError ||
    error instanceof z.ZodError
  ) {
    return {
      kind: "dead",
      reason: "invalid-contract",
    };
  }

  const retryStage =
    getRetryStage(message);

  if (retryStage >= 3) {
    return {
      kind: "dead",
      reason: "retry-exhausted",
    };
  }

  if (retryStage === 2) {
    return {
      kind: "retry",
      routingKey: RETRY_5M_ROUTING_KEY,
      level: "5m",
    };
  }

  if (retryStage === 1) {
    return {
      kind: "retry",
      routingKey: RETRY_30S_ROUTING_KEY,
      level: "30s",
    };
  }

  return {
    kind: "retry",
    routingKey: RETRY_5S_ROUTING_KEY,
    level: "5s",
  };
}

async function publishDisposition(
  channel: ConfirmChannel,
  message: ConsumeMessage,
  disposition: FailureDisposition
): Promise<void> {
  const exchange =
    disposition.kind === "retry"
      ? RETRY_EXCHANGE
      : DEAD_EXCHANGE;

  const routingKey =
    disposition.kind === "retry"
      ? disposition.routingKey
      : DEAD_ROUTING_KEY;

  let returned = false;

  const onReturn = (
    returnedMessage: ConsumeMessage
  ): void => {
    if (
      returnedMessage.properties.messageId ===
      message.properties.messageId
    ) {
      returned = true;
    }
  };

  channel.on(
    "return",
    onReturn
  );

  try {
    channel.publish(
      exchange,
      routingKey,
      message.content,
      {
        persistent: true,
        mandatory: true,
        contentType:
          message.properties.contentType ??
          "application/json",
        contentEncoding:
          message.properties.contentEncoding,
        messageId:
          message.properties.messageId,
        correlationId:
          message.properties.correlationId,
        type:
          message.properties.type,
        timestamp:
          message.properties.timestamp,
        headers: {
          ...(message.properties.headers ?? {}),
          "sgd-retry-stage":
            disposition.kind === "retry"
              ? getRetryStage(message) + 1
              : getRetryStage(message),
          "x-sgd-disposition":
            disposition.kind,
          "x-sgd-disposition-reason":
            disposition.kind === "dead"
              ? disposition.reason
              : `retry-${disposition.level}`,
        },
      }
    );

    await channel.waitForConfirms();

    await new Promise<void>(
      (resolve) =>
        setTimeout(resolve, 25)
    );

    if (returned) {
      throw new Error(
        `Disposition message was unroutable: ${exchange}/${routingKey}`
      );
    }
  } finally {
    channel.removeListener(
      "return",
      onReturn
    );
  }
}

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
  if (
    message.content.length >
    MAX_MESSAGE_BYTES
  ) {
    throw new OversizedMessageError(
      message.content.length,
      MAX_MESSAGE_BYTES
    );
  }

  const parsedJson: unknown =
    JSON.parse(message.content.toString("utf8"));

  const envelope: ScanCommandEnvelope =
    EnvelopeSchema.parse(parsedJson);

  const forceTransientFailureMessageId =
    process.env[
      "POC_FORCE_TRANSIENT_FAILURE_MESSAGE_ID"
    ];

  if (
    forceTransientFailureMessageId ===
    envelope.messageId
  ) {
    throw new Error(
      `POC FORCED TRANSIENT FAILURE ${envelope.messageId}`
    );
  }

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

    const activeConnection =
      connection;

    const channel =
      await activeConnection.createConfirmChannel();

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

          const disposition =
            classifyFailure(
              message,
              error
            );

          console.error(
            `CONSUME FAILED: ${detail}`
          );

          try {
            await publishDisposition(
              channel,
              message,
              disposition
            );

            channel.ack(message);

            if (
              disposition.kind === "retry"
            ) {
              console.log(
                `RETRY ${disposition.level} ${message.properties.messageId ?? "unknown"}`
              );
            } else {
              console.log(
                `DLQ ${disposition.reason} ${message.properties.messageId ?? "unknown"}`
              );
            }
          } catch (
            dispositionError
          ) {
            const dispositionDetail =
              dispositionError instanceof Error
                ? dispositionError.message
                : String(
                    dispositionError
                  );

            console.error(
              `DISPOSITION FAILED: ${dispositionDetail}`
            );

            console.error(
              "DISPOSITION FAILURE IS FATAL; CLOSING AMQP CONNECTION"
            );

            await activeConnection
              .close()
              .catch(() => undefined);

            console.error(
              `CONSUMER EXIT ${DISPOSITION_FATAL_EXIT_CODE}`
            );

            process.exit(
              DISPOSITION_FATAL_EXIT_CODE
            );
          }
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
