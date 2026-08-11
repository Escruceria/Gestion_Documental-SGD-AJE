\set ON_ERROR_STOP on

\echo '===== TEST 01 - SIN CONTEXTO ====='

DO $$
DECLARE
    visible_count integer;
BEGIN
    SELECT COUNT(*)
    INTO visible_count
    FROM documents;

    IF visible_count <> 0 THEN
        RAISE EXCEPTION
            'TEST 01 FAIL: se esperaban 0 documentos sin contexto, se encontraron %',
            visible_count;
    END IF;
END
$$;

\echo 'TEST 01 PASS'


\echo '===== TEST 02 - ALFA SOLO VE ALFA ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    visible_count integer;
    foreign_count integer;
BEGIN
    SELECT COUNT(*)
    INTO visible_count
    FROM documents;

    SELECT COUNT(*)
    INTO foreign_count
    FROM documents
    WHERE tenant_id = '22222222-2222-4222-8222-222222222222';

    IF visible_count <> 2 THEN
        RAISE EXCEPTION
            'TEST 02 FAIL: Alfa debe ver 2 documentos, encontro %',
            visible_count;
    END IF;

    IF foreign_count <> 0 THEN
        RAISE EXCEPTION
            'TEST 02 FAIL: Alfa pudo ver % documentos de Beta',
            foreign_count;
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 02 PASS'


\echo '===== TEST 03 - LECTURA POR UUID DE BETA ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    visible_count integer;
BEGIN
    SELECT COUNT(*)
    INTO visible_count
    FROM documents
    WHERE id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';

    IF visible_count <> 0 THEN
        RAISE EXCEPTION
            'TEST 03 FAIL: Alfa pudo leer un documento de Beta por UUID';
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 03 PASS'


\echo '===== TEST 04 - DELETE CRUZADO ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    affected_count integer;
BEGIN
    DELETE FROM documents
    WHERE id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';

    GET DIAGNOSTICS affected_count = ROW_COUNT;

    IF affected_count <> 0 THEN
        RAISE EXCEPTION
            'TEST 04 FAIL: Alfa pudo eliminar % documentos de Beta',
            affected_count;
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 04 PASS'


\echo '===== TEST 05 - DOCUMENTOS ORIGINALES INTACTOS ====='

BEGIN;

SELECT set_config(
    'app.current_tenant_id',
    '11111111-1111-4111-8111-111111111111',
    true
);

DO $$
DECLARE
    visible_count integer;
BEGIN
    SELECT COUNT(*)
    INTO visible_count
    FROM documents;

    IF visible_count <> 2 THEN
        RAISE EXCEPTION
            'TEST 05 FAIL: Alfa debe seguir viendo 2 documentos, encontro %',
            visible_count;
    END IF;
END
$$;

ROLLBACK;

\echo 'TEST 05 PASS'

\echo '===== RLS READ/DELETE TESTS COMPLETADOS ====='
