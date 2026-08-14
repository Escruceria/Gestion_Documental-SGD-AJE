\set ON_ERROR_STOP on

\echo '===== LIMPIEZA CONTROLADA ====='

DELETE FROM outbox_messages
WHERE message_id IN (
    'poc002_atomic_rollback_001',
    'poc002_atomic_commit_0001'
);

DELETE FROM document_versions
WHERE id IN (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'
);

\echo '===== TEST 01 - ROLLBACK NEGOCIO + OUTBOX ====='

BEGIN;

INSERT INTO document_versions (
    id,
    tenant_id,
    status
)
VALUES (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'QUARANTINED'
);

INSERT INTO outbox_messages (
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
)
VALUES (
    'poc002_atomic_rollback_001',
    '11111111-1111-4111-8111-111111111111',
    'document.version.registered',
    1,
    'event',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'poc002_correlation_rollback_01',
    NULL,
    'document-core-service',
    '{"test":"rollback"}'::jsonb,
    now()
);

ROLLBACK;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM document_versions
        WHERE id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
    ) THEN
        RAISE EXCEPTION
            'TEST 01 FAIL: document_version sobrevivio al rollback';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM outbox_messages
        WHERE message_id = 'poc002_atomic_rollback_001'
    ) THEN
        RAISE EXCEPTION
            'TEST 01 FAIL: outbox sobrevivio al rollback';
    END IF;
END
$$;

\echo 'TEST 01 PASS - rollback elimino negocio y outbox'

\echo '===== TEST 02 - COMMIT NEGOCIO + OUTBOX ====='

BEGIN;

INSERT INTO document_versions (
    id,
    tenant_id,
    status
)
VALUES (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '11111111-1111-4111-8111-111111111111',
    'QUARANTINED'
);

INSERT INTO outbox_messages (
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
)
VALUES (
    'poc002_atomic_commit_0001',
    '11111111-1111-4111-8111-111111111111',
    'document.version.registered',
    1,
    'event',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'poc002_correlation_commit_0001',
    NULL,
    'document-core-service',
    '{"test":"commit"}'::jsonb,
    now()
);

COMMIT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM document_versions
        WHERE id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'
          AND status = 'QUARANTINED'
    ) THEN
        RAISE EXCEPTION
            'TEST 02 FAIL: document_version no fue confirmada';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM outbox_messages
        WHERE message_id = 'poc002_atomic_commit_0001'
          AND published_at IS NULL
    ) THEN
        RAISE EXCEPTION
            'TEST 02 FAIL: outbox pendiente no fue confirmada';
    END IF;
END
$$;

\echo 'TEST 02 PASS - negocio y outbox quedaron confirmados'

\echo '===== EVIDENCIA FINAL ====='

SELECT
    d.id AS document_version_id,
    d.status,
    o.message_id,
    o.message_type,
    o.published_at
FROM document_versions d
JOIN outbox_messages o
    ON o.aggregate_id = d.id
WHERE d.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2';