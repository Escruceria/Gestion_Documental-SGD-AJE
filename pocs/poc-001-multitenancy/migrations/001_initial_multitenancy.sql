BEGIN;

CREATE TABLE tenants (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE documents (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    title text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_tenant_id
    ON documents (tenant_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY documents_tenant_isolation
ON documents
USING (
    tenant_id = NULLIF(
        current_setting('app.current_tenant_id', true),
        ''
    )::uuid
)
WITH CHECK (
    tenant_id = NULLIF(
        current_setting('app.current_tenant_id', true),
        ''
    )::uuid
);

GRANT USAGE ON SCHEMA public TO sgd_poc_app;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE documents
    TO sgd_poc_app;

COMMIT;
