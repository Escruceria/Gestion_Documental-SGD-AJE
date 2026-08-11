BEGIN;

INSERT INTO tenants (id, name)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'Empresa Alfa'),
    ('22222222-2222-4222-8222-222222222222', 'Empresa Beta');

INSERT INTO documents (id, tenant_id, title)
VALUES
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
        '11111111-1111-4111-8111-111111111111',
        'Documento Alfa 1'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
        '11111111-1111-4111-8111-111111111111',
        'Documento Alfa 2'
    ),
    (
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        '22222222-2222-4222-8222-222222222222',
        'Documento Beta 1'
    ),
    (
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
        '22222222-2222-4222-8222-222222222222',
        'Documento Beta 2'
    );

COMMIT;
