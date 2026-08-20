BEGIN;

ALTER TABLE outbox_messages
    ADD COLUMN claim_token uuid,
    ADD COLUMN claimed_by varchar(128),
    ADD COLUMN claimed_at timestamptz,
    ADD COLUMN claim_expires_at timestamptz,
    ADD COLUMN attempt_count integer NOT NULL DEFAULT 0,
    ADD COLUMN next_attempt_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE outbox_messages
    ADD CONSTRAINT outbox_attempt_count_check
        CHECK (attempt_count >= 0),

    ADD CONSTRAINT outbox_claim_state_check
        CHECK (
            (
                claim_token IS NULL
                AND claimed_by IS NULL
                AND claimed_at IS NULL
                AND claim_expires_at IS NULL
            )
            OR
            (
                claim_token IS NOT NULL
                AND claimed_by IS NOT NULL
                AND claimed_at IS NOT NULL
                AND claim_expires_at IS NOT NULL
                AND claim_expires_at > claimed_at
            )
        );

DROP INDEX idx_outbox_messages_pending;

CREATE INDEX idx_outbox_messages_dispatch
    ON outbox_messages (
        next_attempt_at,
        claim_expires_at,
        created_at
    )
    WHERE published_at IS NULL;

COMMIT;