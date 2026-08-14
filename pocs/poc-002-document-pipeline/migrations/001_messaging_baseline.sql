BEGIN;

CREATE TABLE document_versions (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    status varchar(30) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT document_versions_status_check
        CHECK (status IN ('QUARANTINED', 'PROCESSING', 'AVAILABLE', 'REJECTED'))
);

CREATE TABLE outbox_messages (
    message_id varchar(64) PRIMARY KEY,
    tenant_id uuid NOT NULL,
    message_type varchar(150) NOT NULL,
    message_version integer NOT NULL,
    kind varchar(10) NOT NULL,
    aggregate_id uuid NOT NULL,
    correlation_id varchar(64) NOT NULL,
    causation_id varchar(64),
    producer varchar(100) NOT NULL,
    payload jsonb NOT NULL,
    occurred_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    published_at timestamptz,

    CONSTRAINT outbox_message_version_check
        CHECK (message_version >= 1),

    CONSTRAINT outbox_kind_check
        CHECK (kind IN ('event', 'command')),

    CONSTRAINT outbox_message_id_check
        CHECK (message_id ~ '^[A-Za-z0-9_-]{20,64}$'),

    CONSTRAINT outbox_correlation_id_check
        CHECK (correlation_id ~ '^[A-Za-z0-9_-]{20,64}$'),

    CONSTRAINT outbox_causation_id_check
        CHECK (
            causation_id IS NULL
            OR causation_id ~ '^[A-Za-z0-9_-]{20,64}$'
        )
);

CREATE INDEX idx_outbox_messages_pending
    ON outbox_messages (created_at)
    WHERE published_at IS NULL;

CREATE INDEX idx_outbox_messages_tenant
    ON outbox_messages (tenant_id, created_at);

CREATE TABLE inbox_messages (
    message_id varchar(64) PRIMARY KEY,
    tenant_id uuid NOT NULL,
    message_type varchar(150) NOT NULL,
    message_version integer NOT NULL,
    correlation_id varchar(64) NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now(),
    processed_at timestamptz,

    CONSTRAINT inbox_message_version_check
        CHECK (message_version >= 1),

    CONSTRAINT inbox_message_id_check
        CHECK (message_id ~ '^[A-Za-z0-9_-]{20,64}$'),

    CONSTRAINT inbox_correlation_id_check
        CHECK (correlation_id ~ '^[A-Za-z0-9_-]{20,64}$')
);

CREATE INDEX idx_inbox_messages_tenant
    ON inbox_messages (tenant_id, received_at);

CREATE TABLE processing_jobs (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    source_message_id varchar(64) NOT NULL,
    document_version_id uuid NOT NULL,
    job_type varchar(50) NOT NULL,
    status varchar(30) NOT NULL,
    attempt_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,

    CONSTRAINT processing_jobs_source_message_unique
        UNIQUE (source_message_id),

    CONSTRAINT processing_jobs_source_message_fk
        FOREIGN KEY (source_message_id)
        REFERENCES inbox_messages(message_id),

    CONSTRAINT processing_jobs_document_version_fk
        FOREIGN KEY (document_version_id)
        REFERENCES document_versions(id),

    CONSTRAINT processing_jobs_status_check
        CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),

    CONSTRAINT processing_jobs_attempt_count_check
        CHECK (attempt_count >= 0)
);

CREATE INDEX idx_processing_jobs_tenant_status
    ON processing_jobs (tenant_id, status);

COMMIT;