\set ON_ERROR_STOP on

\echo '===== TEST 06 - INSERT CRUZADO DEBE FALLAR ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    operation_blocked boolean := false;
BEGIN
    BEGIN
        INSERT INTO documents (
            id,
            tenant_id,
            title
        )
        VALUES (
            'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
            '22222222-2222-4222-8222-222222222222',
            'Intento ilegal Alfa sobre Beta'
        );

    EXCEPTION
        WHEN insufficient_privilege THEN
            IF position(
                'row-level security policy'
                IN SQLERRM
            ) > 0 THEN
                operation_blocked := true;
            ELSE
                RAISE;
            END IF;
    END;

    IF NOT operation_blocked THEN
        RAISE EXCEPTION
            'TEST 06 FAIL: RLS no bloqueo el INSERT cruzado';
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 06 PASS'


\echo '===== TEST 07 - UPDATE CRUZADO DEBE FALLAR ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    operation_blocked boolean := false;
BEGIN
    BEGIN
        UPDATE documents
        SET tenant_id = '22222222-2222-4222-8222-222222222222'
        WHERE id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';

    EXCEPTION
        WHEN insufficient_privilege THEN
            IF position(
                'row-level security policy'
                IN SQLERRM
            ) > 0 THEN
                operation_blocked := true;
            ELSE
                RAISE;
            END IF;
    END;

    IF NOT operation_blocked THEN
        RAISE EXCEPTION
            'TEST 07 FAIL: RLS no bloqueo el UPDATE cruzado';
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 07 PASS'


\echo '===== TEST 08 - VERIFICAR INTEGRIDAD POSTERIOR ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    alfa_count integer;
    illegal_count integer;
BEGIN
    SELECT COUNT(*)
    INTO alfa_count
    FROM documents;

    SELECT COUNT(*)
    INTO illegal_count
    FROM documents
    WHERE id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1';

    IF alfa_count <> 2 THEN
        RAISE EXCEPTION
            'TEST 08 FAIL: Alfa debe conservar 2 documentos, encontro %',
            alfa_count;
    END IF;

    IF illegal_count <> 0 THEN
        RAISE EXCEPTION
            'TEST 08 FAIL: existe el documento del INSERT ilegal';
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 08 PASS'

\echo '===== RLS WRITE PROTECTION TESTS COMPLETADOS ====='
