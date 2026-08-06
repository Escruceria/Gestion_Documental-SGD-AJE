# DDL PostgreSQL — POC-001 (Multitenancy, RLS, Keycloak)

| Campo | Valor |
|---|---|
| Código | GDP-DAT-003 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A2) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Validación requerida | Tests integración (Testcontainers) |
| Aplicable | POC-001: pasos 1-6 + búsqueda + auditoría |

## Propósito

Script SQL completo para crear esquema inicial POC-001: tablas multitenant, índices, constraints, RLS policies. Ejecutable vía `node-pg-migrate`.

---

## 1. Extensiones y configuración

```sql
-- postgresql/migrations/001_base_extensions.sql

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsqueda full-text
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configuración sesión
SET app.setting = 'app';

-- Función para verificar tenant en RLS
CREATE OR REPLACE FUNCTION check_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Tablas — D01 Identidad y Acceso (MS-01)

```sql
-- postgresql/migrations/002_iam_tables.sql

-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL,  -- = id (reference)
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(50),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT organizations_unique_name UNIQUE (name)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY organizations_tenant_select ON organizations
  FOR SELECT USING (id = check_tenant_id());
CREATE POLICY organizations_tenant_update ON organizations
  FOR UPDATE USING (id = check_tenant_id())
  WITH CHECK (id = check_tenant_id());

CREATE INDEX idx_organizations_tenant_id ON organizations(tenant_id);

-- Headquarters (sedes)
CREATE TABLE headquarters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  manager_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT headquarters_tenant_name UNIQUE (tenant_id, name)
);

ALTER TABLE headquarters ENABLE ROW LEVEL SECURITY;
CREATE POLICY headquarters_tenant_rls ON headquarters
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_headquarters_tenant_id ON headquarters(tenant_id, id);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  parent_id UUID REFERENCES departments(id),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  manager_id UUID,
  classification_level VARCHAR(20) DEFAULT 'internal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT departments_tenant_code UNIQUE (tenant_id, code)
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY departments_tenant_rls ON departments
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_departments_tenant_id ON departments(tenant_id, id);
CREATE INDEX idx_departments_parent ON departments(tenant_id, parent_id);

-- Users (profiles, no auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  keycloak_id UUID,  -- Vinculación Keycloak
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  document_id VARCHAR(20),  -- Cédula/pasaporte
  phone VARCHAR(20),
  department_id UUID REFERENCES departments(id),
  enabled BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_tenant_email UNIQUE (tenant_id, email)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_tenant_rls ON users
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_users_tenant_id ON users(tenant_id, id);
CREATE INDEX idx_users_keycloak_id ON users(keycloak_id);
CREATE INDEX idx_users_email ON users(tenant_id, email);

-- Memberships
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  status VARCHAR(20) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT memberships_unique UNIQUE (user_id, tenant_id)
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY memberships_tenant_rls ON memberships
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_memberships_tenant_id ON memberships(tenant_id, user_id);

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  CONSTRAINT roles_tenant_code UNIQUE (tenant_id, code)
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_tenant_rls ON roles
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_roles_tenant_id ON roles(tenant_id, code);

-- User Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  CONSTRAINT user_roles_unique UNIQUE (user_id, role_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_tenant_rls ON user_roles
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = user_roles.user_id 
    AND users.tenant_id = check_tenant_id()
  ));

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  CONSTRAINT permissions_tenant_unique UNIQUE (tenant_id, resource, action)
);

ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY permissions_tenant_rls ON permissions
  USING (tenant_id = check_tenant_id());

-- Role Permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  CONSTRAINT role_permissions_unique UNIQUE (role_id, permission_id)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY role_permissions_tenant_rls ON role_permissions
  USING (EXISTS (
    SELECT 1 FROM roles WHERE roles.id = role_permissions.role_id 
    AND roles.tenant_id = check_tenant_id()
  ));
```

---

## 3. Tablas — D02 Núcleo Documental (MS-02)

```sql
-- postgresql/migrations/003_document_core_tables.sql

-- Series
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES series(id),
  default_classification VARCHAR(20) DEFAULT 'internal',
  requires_approval BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT series_tenant_code UNIQUE (tenant_id, code)
);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;
CREATE POLICY series_tenant_rls ON series
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_series_tenant_id ON series(tenant_id, code);
CREATE INDEX idx_series_parent ON series(tenant_id, parent_id);

-- Document Types
CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  series_id UUID NOT NULL REFERENCES series(id),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mime_types_allowed TEXT[],  -- JSON array ["application/pdf", "image/jpeg"]
  max_file_size BIGINT DEFAULT 104857600,  -- 100 MB
  requires_signature BOOLEAN DEFAULT FALSE,
  CONSTRAINT document_types_tenant_code UNIQUE (tenant_id, code)
);

ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_types_tenant_rls ON document_types
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_document_types_tenant_id ON document_types(tenant_id, series_id);

-- Retention Schedules
CREATE TABLE retention_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active_years SMALLINT NOT NULL,
  inactive_years SMALLINT,
  disposition_action VARCHAR(50),  -- delete, transfer, archive, destroy_certified
  legal_basis TEXT,
  requires_approval BOOLEAN DEFAULT FALSE,
  CONSTRAINT retention_schedules_tenant_name UNIQUE (tenant_id, name)
);

ALTER TABLE retention_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY retention_schedules_tenant_rls ON retention_schedules
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_retention_schedules_tenant_id ON retention_schedules(tenant_id);

-- Documents (lógicos)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  series_id UUID NOT NULL REFERENCES series(id),
  document_type_id UUID REFERENCES document_types(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft',  -- draft, active, archived, disposed
  classification VARCHAR(20) DEFAULT 'internal',
  expires_at TIMESTAMP,
  retention_schedule_id UUID REFERENCES retention_schedules(id),
  CONSTRAINT documents_title_check CHECK (char_length(title) >= 3)
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_tenant_rls ON documents
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_documents_tenant_id ON documents(tenant_id, id);
CREATE INDEX idx_documents_series ON documents(tenant_id, series_id);
CREATE INDEX idx_documents_status ON documents(tenant_id, status);
CREATE INDEX idx_documents_created ON documents(tenant_id, created_at DESC);
-- Full-text search index
CREATE INDEX idx_documents_title_fts ON documents 
  USING GIN (to_tsvector('spanish', title || ' ' || COALESCE(description, '')));

-- Document Versions
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id),
  version_number SMALLINT NOT NULL,
  file_id UUID,  -- Reference to document_files
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  change_summary TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  CONSTRAINT document_versions_unique UNIQUE (document_id, version_number)
);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_versions_tenant_rls ON document_versions
  USING (EXISTS (
    SELECT 1 FROM documents WHERE documents.id = document_versions.document_id 
    AND documents.tenant_id = check_tenant_id()
  ));

CREATE INDEX idx_document_versions_document ON document_versions(document_id, version_number DESC);

-- Document Files (blobs reference)
CREATE TABLE document_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  storage_path VARCHAR(500) NOT NULL,  -- s3://bucket/tenant-id/doc-id/v1.pdf
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  hash_sha256 VARCHAR(64) NOT NULL,  -- WORM: immutable
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scanned_for_virus BOOLEAN DEFAULT FALSE,
  virus_scan_result VARCHAR(20),  -- clean, infected, unknown
  requires_ocr BOOLEAN DEFAULT FALSE,
  ocr_status VARCHAR(20),  -- pending, in_progress, completed, failed
  CONSTRAINT document_files_hash_unique UNIQUE (tenant_id, hash_sha256)
);

ALTER TABLE document_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_files_tenant_rls ON document_files
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_document_files_tenant_id ON document_files(tenant_id, id);
CREATE INDEX idx_document_files_hash ON document_files(hash_sha256);

-- Expedients (agrupadores)
CREATE TABLE expedients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  code VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  series_id UUID NOT NULL REFERENCES series(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'open',  -- open, closed, disposed
  responsible_id UUID REFERENCES users(id),
  start_date DATE,
  estimated_end_date DATE,
  closed_date DATE,
  CONSTRAINT expedients_tenant_code UNIQUE (tenant_id, code)
);

ALTER TABLE expedients ENABLE ROW LEVEL SECURITY;
CREATE POLICY expedients_tenant_rls ON expedients
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_expedients_tenant_id ON expedients(tenant_id, code);
CREATE INDEX idx_expedients_status ON expedients(tenant_id, status);

-- Expedient Documents (composición)
CREATE TABLE expedient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expedient_id UUID NOT NULL REFERENCES expedients(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  sequence_number SMALLINT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  added_by UUID NOT NULL REFERENCES users(id),
  CONSTRAINT expedient_documents_unique UNIQUE (expedient_id, document_id)
);

ALTER TABLE expedient_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY expedient_documents_tenant_rls ON expedient_documents
  USING (EXISTS (
    SELECT 1 FROM expedients WHERE expedients.id = expedient_documents.expedient_id 
    AND expedients.tenant_id = check_tenant_id()
  ));

CREATE INDEX idx_expedient_documents_expedient ON expedient_documents(expedient_id);
```

---

## 4. Tablas — D03 Correspondencia (MS-03)

```sql
-- postgresql/migrations/004_correspondence_tables.sql

-- Sequences (generadores de consecutivos)
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  type VARCHAR(20) NOT NULL,  -- incoming, outgoing, internal
  prefix VARCHAR(20),  -- RAD-, OUT-, INT-
  current_number BIGINT DEFAULT 0,
  reset_period VARCHAR(20),  -- daily, monthly, yearly, never
  last_reset_date DATE,
  department_id UUID REFERENCES departments(id),
  locked_until TIMESTAMP,  -- Para concurrencia
  CONSTRAINT sequences_tenant_unique UNIQUE (tenant_id, type, COALESCE(department_id, '00000000-0000-0000-0000-000000000000'::uuid))
);

ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY sequences_tenant_rls ON sequences
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_sequences_tenant_type ON sequences(tenant_id, type);

-- Correspondences (radicaciones)
CREATE TABLE correspondences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  correspondence_type VARCHAR(20) NOT NULL,  -- incoming, outgoing, internal
  number VARCHAR(50) NOT NULL,  -- RAD-2026-00001
  document_id UUID NOT NULL REFERENCES documents(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  subject VARCHAR(500) NOT NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  received_date TIMESTAMP,
  sent_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'registered',  -- registered, in_review, approved, sent, archived
  priority VARCHAR(20) DEFAULT 'normal',  -- normal, high, urgent
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  CONSTRAINT correspondences_tenant_number UNIQUE (tenant_id, number)
);

ALTER TABLE correspondences ENABLE ROW LEVEL SECURITY;
CREATE POLICY correspondences_tenant_rls ON correspondences
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_correspondences_tenant_id ON correspondences(tenant_id, number);
CREATE INDEX idx_correspondences_type ON correspondences(tenant_id, correspondence_type);
CREATE INDEX idx_correspondences_status ON correspondences(tenant_id, status);
CREATE INDEX idx_correspondences_created ON correspondences(tenant_id, created_at DESC);

-- Channels (canales de entrada)
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),  -- email, postal, personal, electronic
  description TEXT,
  CONSTRAINT channels_tenant_name UNIQUE (tenant_id, name)
);

ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY channels_tenant_rls ON channels
  USING (tenant_id = check_tenant_id());

-- Workflow Steps
CREATE TABLE workflow_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  correspondence_id UUID NOT NULL REFERENCES correspondences(id),
  step_number SMALLINT NOT NULL,
  action VARCHAR(50),  -- review, approve, sign, archive, forward
  assigned_to UUID NOT NULL REFERENCES users(id),
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMP,
  comments TEXT,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, completed, rejected
  CONSTRAINT workflow_steps_unique UNIQUE (correspondence_id, step_number)
);

ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY workflow_steps_tenant_rls ON workflow_steps
  USING (EXISTS (
    SELECT 1 FROM correspondences WHERE correspondences.id = workflow_steps.correspondence_id 
    AND correspondences.tenant_id = check_tenant_id()
  ));

CREATE INDEX idx_workflow_steps_correspondence ON workflow_steps(correspondence_id);
CREATE INDEX idx_workflow_steps_assigned ON workflow_steps(tenant_id, assigned_to, status);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  correspondence_id UUID REFERENCES correspondences(id),
  assigned_to UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'pending',  -- pending, in_progress, completed, overdue
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_tenant_rls ON tasks
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id, assigned_to, status);
CREATE INDEX idx_tasks_due_date ON tasks(tenant_id, due_date);

-- Approvals
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  correspondence_id UUID NOT NULL REFERENCES correspondences(id),
  requested_by UUID NOT NULL REFERENCES users(id),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approver_id UUID NOT NULL REFERENCES users(id),
  decision VARCHAR(20) DEFAULT 'pending',  -- approved, rejected, pending
  decision_date TIMESTAMP,
  comments TEXT
);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY approvals_tenant_rls ON approvals
  USING (EXISTS (
    SELECT 1 FROM correspondences WHERE correspondences.id = approvals.correspondence_id 
    AND correspondences.tenant_id = check_tenant_id()
  ));

CREATE INDEX idx_approvals_correspondence ON approvals(correspondence_id);
CREATE INDEX idx_approvals_approver ON approvals(tenant_id, approver_id, decision);
```

---

## 5. Tablas — D05 Auditoría (MS-05)

```sql
-- postgresql/migrations/005_audit_tables.sql

-- Audit Logs (immutable)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  event_type VARCHAR(50) NOT NULL,  -- create, read, update, delete, approve, sign
  entity_type VARCHAR(50) NOT NULL,  -- document, correspondence, expedient, user
  entity_id UUID NOT NULL,
  performed_by UUID NOT NULL REFERENCES users(id),
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  status VARCHAR(20) DEFAULT 'success',  -- success, failure
  error_message TEXT,
  trace_id UUID,
  CONSTRAINT audit_logs_immutable CHECK (FALSE)  -- Opcional: prevenir actualizaciones
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_tenant_rls ON audit_logs
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id, entity_type, entity_id);
CREATE INDEX idx_audit_logs_performed_at ON audit_logs(tenant_id, performed_at DESC);
CREATE INDEX idx_audit_logs_trace_id ON audit_logs(trace_id);

-- Consent Logs (LSRPD)
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  user_id UUID NOT NULL REFERENCES users(id),
  consent_type VARCHAR(50),  -- data_processing, profiling, marketing
  granted BOOLEAN NOT NULL,
  granted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  granted_by_ip INET,
  withdrawal_date TIMESTAMP,
  document_version VARCHAR(20),
  CONSTRAINT consent_logs_immutable CHECK (FALSE)
);

ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY consent_logs_tenant_rls ON consent_logs
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_consent_logs_tenant_user ON consent_logs(tenant_id, user_id);

-- Privacy Requests
CREATE TABLE privacy_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  requester_email VARCHAR(255) NOT NULL,
  request_type VARCHAR(50),  -- access, rectification, deletion, portability
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, in_progress, completed, rejected
  completed_at TIMESTAMP,
  reason_for_rejection TEXT,
  assigned_to UUID REFERENCES users(id)
);

ALTER TABLE privacy_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY privacy_requests_tenant_rls ON privacy_requests
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_privacy_requests_tenant ON privacy_requests(tenant_id, status);

-- Incidents
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  incident_type VARCHAR(50),  -- unauthorized_access, data_breach, virus_detected
  reported_by UUID NOT NULL REFERENCES users(id),
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  affected_records INTEGER,
  severity VARCHAR(20),  -- low, medium, high, critical
  status VARCHAR(20) DEFAULT 'open',  -- open, investigating, resolved, closed
  remediation_notes TEXT
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY incidents_tenant_rls ON incidents
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_incidents_tenant ON incidents(tenant_id, severity, status);
```

---

## 6. Tablas de soporte — Processing Jobs (MS-04, básico para POC)

```sql
-- postgresql/migrations/006_processing_jobs.sql

-- Processing Jobs
CREATE TABLE processing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  document_file_id UUID,
  job_type VARCHAR(50),  -- scan_virus, validate_format, extract_text_ocr
  status VARCHAR(20) DEFAULT 'pending',  -- pending, in_progress, completed, failed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  retry_count SMALLINT DEFAULT 0,
  error_message TEXT,
  result_path VARCHAR(500)
);

ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY processing_jobs_tenant_rls ON processing_jobs
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_processing_jobs_tenant ON processing_jobs(tenant_id, status);

-- Outbox (publicar eventos de forma durables)
CREATE TABLE outbox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  aggregate_id UUID NOT NULL,
  aggregate_type VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  CONSTRAINT outbox_immutable CHECK (FALSE)
);

ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY outbox_tenant_rls ON outbox
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_outbox_tenant ON outbox(tenant_id, published_at);

-- Inbox (idempotencia en eventos)
CREATE TABLE inbox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES organizations(tenant_id),
  event_id UUID NOT NULL UNIQUE,
  aggregate_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  CONSTRAINT inbox_immutable CHECK (FALSE)
);

ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY inbox_tenant_rls ON inbox
  USING (tenant_id = check_tenant_id());

CREATE INDEX idx_inbox_tenant ON inbox(tenant_id, processed_at);
```

---

## 7. Datos iniciales — Roles y permisos base

```sql
-- postgresql/seeds/001_base_roles_permissions.sql

-- Roles base para POC-001
INSERT INTO roles (tenant_id, code, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'ADMIN', 'Administrador de Organización', 'Acceso completo a configuración y usuarios'),
  ('550e8400-e29b-41d4-a716-446655440000', 'EDITOR', 'Editor de Documentos', 'Crear, editar y radicar documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'VIEWER', 'Visualizador', 'Lectura de documentos autorizados'),
  ('550e8400-e29b-41d4-a716-446655440000', 'AUDITOR', 'Auditor', 'Lectura de logs y trazabilidad');

-- Permisos base
INSERT INTO permissions (tenant_id, resource, action, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'users', 'create', 'Crear usuarios'),
  ('550e8400-e29b-41d4-a716-446655440000', 'documents', 'create', 'Crear documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'documents', 'read', 'Leer documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'documents', 'delete', 'Eliminar documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'audit_logs', 'read', 'Leer logs de auditoría');

-- Asignar permisos a roles
-- ADMIN: todos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.code = 'ADMIN' AND r.tenant_id = p.tenant_id;

-- EDITOR: create, read, delete documents
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.code = 'EDITOR' 
  AND r.tenant_id = p.tenant_id 
  AND p.resource = 'documents';

-- VIEWER: read documents
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.code = 'VIEWER' 
  AND r.tenant_id = p.tenant_id 
  AND p.resource = 'documents' 
  AND p.action = 'read';

-- AUDITOR: read audit logs
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.code = 'AUDITOR' 
  AND r.tenant_id = p.tenant_id 
  AND p.resource = 'audit_logs';
```

---

## 8. Comentarios y restricciones importantes

```sql
-- Validaciones críticas para RLS
-- Cada tabla DEBE tener:
-- 1. tenant_id como FK a organizations(tenant_id)
-- 2. ROW LEVEL SECURITY habilitado
-- 3. Policy USING (tenant_id = check_tenant_id())

-- IMPORTANTE: En aplicación, SIEMPRE hacer antes de queries:
-- SET app.current_tenant_id = <tenant-uuid>;

-- Índices críticos para performance:
-- - (tenant_id, id) en todas las tablas
-- - (tenant_id, status) en documentos, correspondences
-- - Full-text search en documents.title
-- - (tenant_id, created_at) para auditoría

-- Constraints CHECK para validaciones básicas:
-- - Longitud mínima de strings
-- - Valores ENUM restringidos
-- - Relaciones de integridad

-- Outbox e Inbox para event sourcing:
-- - Garantiza entrega de eventos 1+ veces
-- - Consumer aplica idempotencia con inbox
-- - Permite replay de eventos si falla persistencia
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | DDL POC-001: 20 tablas, RLS policies, índices, seeds base. Pasos 1-6 flujo vertical. | Antonio José Escrucería Uribe |
