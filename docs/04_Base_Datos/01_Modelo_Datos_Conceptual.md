# Modelo de Datos Conceptual — SGD Gestión Documental

| Campo | Valor |
|---|---|
| Código | GDP-DAT-001 |
| Versión | 1.0 |
| Estado | Aprobado conceptual (Fase 3-A2) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto, Datos) |
| Revisores | Álvaro Patiño Cruz (PO), David Ernesto Antequera Martínez (QA) |

## Propósito

Modelo entidades-relaciones conceptual que soporta flujo vertical 12-paso para Venus Ingeniería, con aislamiento multitenant y cumplimiento normativo.

---

## 1. Principios de diseño

1. **Multitenant lógico:** Cada tenant ve solo sus datos (RLS PostgreSQL)
2. **Propiedad exclusiva:** Cada macroservicio propietario de su esquema
3. **Integridad referencial:** Solo dentro del mismo dominio
4. **Auditoría obligatoria:** Toda operación escrita se registra
5. **Cascadas seguras:** Borrado lógico, nunca físico sin autorización
6. **Versionado:** Documentos inmutables, solo agregar versiones

---

## 2. Entidades core (D01 — Identidad y Acceso)

**Tablas propias de identity-access-service:**

```sql
-- Organización (tenant)
organizations {
  id: UUID PK
  tenant_id: UUID (=id, clave única)
  name: string
  sector: string (Ej: "Tecnología")
  headquarters_id: UUID FK departments
  created_at: timestamp
  created_by: UUID FK users
}

-- Sedes (en caso de multi-sede)
headquarters {
  id: UUID PK
  tenant_id: UUID FK organizations
  name: string
  city: string
  address: string
  manager_id: UUID FK users
}

-- Dependencias/Departamentos
departments {
  id: UUID PK
  tenant_id: UUID FK organizations
  parent_id: UUID FK departments (nullable, para recursión)
  code: string (Ej: "DPTO-001")
  name: string
  manager_id: UUID FK users
  classification_level: enum (público, interno, confidencial, secreto)
}

-- Usuarios (profile aplicación, no Keycloak)
users {
  id: UUID PK
  tenant_id: UUID FK organizations
  keycloak_id: UUID (ID externo de Keycloak)
  email: string
  full_name: string
  document_id: string (cédula)
  phone: string
  department_id: UUID FK departments
  enabled: boolean
  last_login: timestamp
  created_at: timestamp
  updated_at: timestamp
}

-- Membresías (asignación usuario → tenant)
memberships {
  id: UUID PK
  user_id: UUID FK users
  tenant_id: UUID FK organizations
  status: enum (active, inactive, suspended)
  start_date: date
  end_date: date (nullable)
  created_at: timestamp
}

-- Roles globales
roles {
  id: UUID PK
  tenant_id: UUID FK organizations
  code: string (Ej: "ADMIN", "EDITOR", "VIEWER")
  name: string
  description: text
}

-- Permisos
permissions {
  id: UUID PK
  tenant_id: UUID FK organizations
  resource: string (Ej: "document:create", "correspondence:approve")
  action: enum (create, read, update, delete, execute)
  description: text
}

-- Asignación roles a usuarios
user_roles {
  id: UUID PK
  user_id: UUID FK users
  role_id: UUID FK roles
  assigned_at: timestamp
  assigned_by: UUID FK users
}

-- Asignación permisos a roles
role_permissions {
  id: UUID PK
  role_id: UUID FK roles
  permission_id: UUID FK permissions
}

-- Delegaciones (usuario A delega función a B)
delegations {
  id: UUID PK
  tenant_id: UUID FK organizations
  delegated_by: UUID FK users
  delegated_to: UUID FK users
  permission_id: UUID FK permissions
  start_date: date
  end_date: date
  reason: text
  status: enum (active, expired, revoked)
}
```

---

## 3. Entidades Núcleo Documental (D02)

**Tablas propias de document-core-service:**

```sql
-- Series documentales (clasificación)
series {
  id: UUID PK
  tenant_id: UUID FK organizations
  code: string (Ej: "SER-001")
  name: string
  description: text
  parent_id: UUID FK series (nullable, para sub-series)
  retention_schedule_id: UUID FK retention_schedules
  default_classification: enum (público, interno, confidencial, secreto)
  requires_approval: boolean
  enabled: boolean
}

-- Tipos de documento
document_types {
  id: UUID PK
  tenant_id: UUID FK organizations
  series_id: UUID FK series
  code: string (Ej: "TIP-001")
  name: string
  mime_types_allowed: array[string] (Ej: ["application/pdf", "image/jpeg"])
  max_file_size: bigint (bytes)
  requires_signature: boolean
}

-- Cronogramas de retención
retention_schedules {
  id: UUID PK
  tenant_id: UUID FK organizations
  name: string
  description: text
  active_years: integer
  inactive_years: integer
  disposition_action: enum (delete, transfer, archive, destroy_certified)
  legal_basis: text (referencia normativa)
  requires_approval: boolean
}

-- Documentos (lógicos)
documents {
  id: UUID PK
  tenant_id: UUID FK organizations
  series_id: UUID FK series
  document_type_id: UUID FK document_types
  title: string
  description: text
  created_by: UUID FK users
  created_at: timestamp
  updated_at: timestamp
  status: enum (draft, active, archived, disposed)
  classification: enum (público, interno, confidencial, secreto)
  expires_at: timestamp (nullable)
  retention_schedule_id: UUID FK retention_schedules
  expedient_id: UUID FK expedients (nullable)
}

-- Versiones de documento
document_versions {
  id: UUID PK
  document_id: UUID FK documents
  version_number: integer
  file_id: UUID FK document_files
  created_by: UUID FK users
  created_at: timestamp
  change_summary: text
  is_current: boolean
}

-- Archivos (blobs, referencias a S3/MinIO)
document_files {
  id: UUID PK
  tenant_id: UUID FK organizations
  storage_path: string (Ej: "s3://bucket/tenant-id/doc-id/v1.pdf")
  original_name: string
  mime_type: string
  size_bytes: bigint
  hash_sha256: string (WORM-safe)
  uploaded_by: UUID FK users
  uploaded_at: timestamp
  scanned_for_virus: boolean
  virus_scan_result: enum (clean, infected, unknown)
  requires_ocr: boolean
  ocr_status: enum (pending, in_progress, completed, failed)
}

-- Expedientes (agrupadores)
expedients {
  id: UUID PK
  tenant_id: UUID FK organizations
  code: string (Ej: "EXP-2026-001")
  title: string
  description: text
  series_id: UUID FK series
  created_by: UUID FK users
  created_at: timestamp
  status: enum (open, closed, disposed)
  responsible_id: UUID FK users
  start_date: date
  estimated_end_date: date (nullable)
  closed_date: date (nullable)
}

-- Índices de expedientes (documentos dentro de expediente)
expedient_documents {
  id: UUID PK
  expedient_id: UUID FK expedients
  document_id: UUID FK documents
  sequence_number: integer
  added_at: timestamp
  added_by: UUID FK users
}

-- Transferencias
transfers {
  id: UUID PK
  tenant_id: UUID FK organizations
  expedient_id: UUID FK expedients
  transfer_type: enum (temporary, permanent, archive)
  from_department: UUID FK departments
  to_department: UUID FK departments (nullable)
  to_archive: boolean
  transfer_date: date
  authorized_by: UUID FK users
  status: enum (pending, received, rejected)
}

-- Disposiciones
dispositions {
  id: UUID PK
  tenant_id: UUID FK organizations
  expedient_id: UUID FK expedients
  disposition_type: enum (destroy, archive, transfer)
  authorized_by: UUID FK users
  authorized_date: date
  executed_date: date (nullable)
  certification_number: string (para destrucción certificada)
  status: enum (pending, executed, cancelled)
}
```

---

## 4. Entidades Correspondencia (D03)

**Tablas propias de correspondence-workflow-service:**

```sql
-- Secuencias (generadores de consecutivos)
sequences {
  id: UUID PK
  tenant_id: UUID FK organizations
  type: enum (incoming, outgoing, internal)
  prefix: string (Ej: "RAD-")
  current_number: bigint
  reset_period: enum (daily, monthly, yearly, never)
  last_reset_date: date
  department_id: UUID FK departments (nullable, para sequences por dpto)
  locked_until: timestamp (para concurrencia)
}

-- Correspondencias (radicaciones)
correspondences {
  id: UUID PK
  tenant_id: UUID FK organizations
  correspondence_type: enum (incoming, outgoing, internal)
  number: string (Ej: "RAD-2026-00001")
  document_id: UUID FK documents (D02)
  created_at: timestamp
  created_by: UUID FK users
  subject: string
  sender_name: string (si entrada externa)
  sender_email: string (si entrada externa)
  recipient_name: string (si salida)
  recipient_email: string (si salida)
  received_date: timestamp (para entrada)
  sent_date: timestamp (para salida)
  status: enum (registered, in_review, approved, sent, archived)
  priority: enum (normal, urgent, high)
  assigned_to: UUID FK users (nullable)
  due_date: date (nullable)
}

-- Canales de entrada
channels {
  id: UUID PK
  tenant_id: UUID FK organizations
  name: string (Ej: "email", "physical_mail", "portal")
  type: enum (email, postal, personal, electronic)
  description: text
}

-- Workflow steps (pasos en un proceso)
workflow_steps {
  id: UUID PK
  tenant_id: UUID FK organizations
  correspondence_id: UUID FK correspondences
  step_number: integer
  action: enum (review, approve, sign, archive, forward)
  assigned_to: UUID FK users
  completed_by: UUID FK users (nullable)
  completed_at: timestamp (nullable)
  comments: text
  status: enum (pending, completed, rejected)
}

-- Tareas
tasks {
  id: UUID PK
  tenant_id: UUID FK organizations
  correspondence_id: UUID FK correspondences
  assigned_to: UUID FK users
  title: string
  description: text
  due_date: date
  priority: enum (normal, high, urgent)
  status: enum (pending, in_progress, completed, overdue)
  created_at: timestamp
}

-- Aprobaciones
approvals {
  id: UUID PK
  tenant_id: UUID FK organizations
  correspondence_id: UUID FK correspondences
  requested_by: UUID FK users
  requested_at: timestamp
  approver_id: UUID FK users
  decision: enum (approved, rejected, pending)
  decision_date: timestamp (nullable)
  comments: text
}
```

---

## 5. Entidades Procesamiento (D04)

**Tablas propias de document-processing-worker:**

```sql
-- Trabajos de procesamiento
processing_jobs {
  id: UUID PK
  tenant_id: UUID FK organizations
  document_file_id: UUID FK document_files (D02)
  job_type: enum (scan_virus, validate_format, extract_text_ocr, convert_format)
  status: enum (pending, in_progress, completed, failed)
  started_at: timestamp (nullable)
  completed_at: timestamp (nullable)
  retry_count: integer (para reintentos)
  error_message: text (nullable)
  result_path: string (nullable, si hay output)
}

-- Resultados de antivirus
scan_results {
  id: UUID PK
  document_file_id: UUID FK document_files (D02)
  scanner_name: string (Ej: "ClamAV")
  scan_date: timestamp
  status: enum (clean, infected, suspicious)
  threat_names: array[string] (si infecciones detectadas)
  quarantine_path: string (si infected)
}

-- Resultados OCR
ocr_results {
  id: UUID PK
  document_file_id: UUID FK document_files (D02)
  text_content: text
  extracted_at: timestamp
  confidence_score: numeric (0-1)
  pages_processed: integer
  language: string
}

-- Validaciones de integridad
integrity_checks {
  id: UUID PK
  document_file_id: UUID FK document_files (D02)
  hash_calculated: string (SHA-256)
  hash_stored: string (SHA-256 original)
  is_valid: boolean
  checked_at: timestamp
  check_method: enum (hash_comparison, file_read)
}
```

---

## 6. Entidades Auditoría (D05)

**Tablas propias de audit-compliance-service:**

```sql
-- Logs de auditoría
audit_logs {
  id: UUID PK
  tenant_id: UUID FK organizations
  event_type: enum (create, read, update, delete, approve, sign, archive)
  entity_type: string (Ej: "document", "correspondence")
  entity_id: UUID
  performed_by: UUID FK users
  performed_at: timestamp
  ip_address: string
  user_agent: string
  action: string (descripción detallada)
  old_value: json (nullable, para updates)
  new_value: json (nullable, para updates)
  status: enum (success, failure)
  error_message: text (nullable)
  trace_id: string (correlación con eventos)
}

-- Consentimientos (LSRPD)
consent_logs {
  id: UUID PK
  tenant_id: UUID FK organizations
  user_id: UUID FK users
  consent_type: enum (data_processing, profiling, marketing)
  granted: boolean
  granted_date: timestamp
  granted_by_ip: string
  withdrawal_date: timestamp (nullable)
  document_version: string
}

-- Solicitudes de derechos de titulares
privacy_requests {
  id: UUID PK
  tenant_id: UUID FK organizations
  requester_email: string
  request_type: enum (access, rectification, deletion, portability)
  requested_at: timestamp
  status: enum (pending, in_progress, completed, rejected)
  completed_at: timestamp (nullable)
  reason_for_rejection: text (nullable)
  assigned_to: UUID FK users
}

-- Incidentes de seguridad/privacidad
incidents {
  id: UUID PK
  tenant_id: UUID FK organizations
  incident_type: enum (unauthorized_access, data_breach, virus_detected)
  reported_by: UUID FK users
  reported_at: timestamp
  description: text
  affected_records: integer
  severity: enum (low, medium, high, critical)
  status: enum (open, investigating, resolved, closed)
  remediation_notes: text
}

-- Evidencias de cumplimiento
compliance_evidence {
  id: UUID PK
  tenant_id: UUID FK organizations
  evidence_type: enum (backup_verification, audit_report, retention_certificate)
  created_at: timestamp
  created_by: UUID FK users
  description: text
  document_path: string
  related_entity: string
}
```

---

## 7. Modelo Multitenant

**Aislamiento en cada tabla:**

```sql
-- Principio: TODA tabla tiene tenant_id como columna
-- Indices: (tenant_id, other_key) para acceso rápido
-- RLS Policy:
CREATE POLICY tenant_isolation ON any_table
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Contexto en sesión:**
```sql
-- Al iniciar sesión, el BFF establece:
SET app.current_tenant_id = 'tenant-uuid-xxx';
-- Todas las queries heredan este contexto automáticamente
```

---

## 8. Diagrama ER Simplificado

```
Organizations (tenant raíz)
  ├─ Users (identidades en app)
  ├─ Departments (estructura)
  ├─ Roles, Permissions (control acceso)
  │
  ├─ Series (clasificación documental)
  │  └─ Documents (entidades lógicas)
  │     ├─ Document_Versions (inmutabilidad)
  │     └─ Document_Files (blobs, S3/MinIO)
  │
  ├─ Expedients (agrupadores)
  │  └─ Expedient_Documents (composición)
  │
  ├─ Correspondences (radicaciones)
  │  ├─ Workflow_Steps (flujo)
  │  ├─ Tasks (asignación)
  │  └─ Approvals (cadena aprobación)
  │
  ├─ Sequences (consecutivos)
  ├─ Channels (canales entrada)
  ├─ Transfers, Dispositions (ciclo vida)
  │
  ├─ Processing_Jobs (workers)
  │  ├─ Scan_Results
  │  ├─ OCR_Results
  │  └─ Integrity_Checks
  │
  └─ Audit_Logs, Consent_Logs, Privacy_Requests, Incidents
```

---

## 9. Flujo vertical 12-paso — Entidades involucradas

| Paso | Proceso | Entidades | Servicio |
|---|---|---|---|
| 1 | Crear organización | organizations | identity-access-service |
| 2 | Invitar usuarios | users, memberships | identity-access-service |
| 3 | Vincular Keycloak | users (keycloak_id) | identity-access-service |
| 4 | Cambio tenant | memberships (context) | identity-access-service |
| 5 | Series/Tipos | series, document_types | document-core-service |
| 6 | Crear documento | documents | document-core-service |
| 7 | Solicitar carga | document_files (pending) | document-processing-worker |
| 8 | Confirmar carga | document_files (verified) | document-processing-worker |
| 9 | Procesar archivo | processing_jobs, scan_results | document-processing-worker |
| 10 | Registrar versión | document_versions | document-core-service |
| 11 | Radicar entrada | correspondences, sequences | correspondence-workflow-service |
| 12 | Auditar evento | audit_logs | audit-compliance-service |

---

## 10. Índices críticos

```sql
-- Performance y seguridad
CREATE INDEX idx_org_tenant ON organizations(tenant_id);
CREATE INDEX idx_docs_tenant_series ON documents(tenant_id, series_id);
CREATE INDEX idx_corresp_tenant_type ON correspondences(tenant_id, correspondence_type);
CREATE INDEX idx_audit_tenant_entity ON audit_logs(tenant_id, entity_type, entity_id);
CREATE INDEX idx_files_hash ON document_files(hash_sha256);
CREATE INDEX idx_sequences_tenant_type ON sequences(tenant_id, type);
```

---

## 11. Validaciones requeridas

**Taller Venus (2026-09-15):**
- [ ] Validar estructura de series actual
- [ ] Confirmar tipos de documento
- [ ] Validar división de departamentos
- [ ] Confirmar roles/permisos existentes

**Arquitectura (antes POC):**
- [ ] Revisión ADR-015 (PostgreSQL)
- [ ] Finalizar política RLS
- [ ] Diseño índices (carga test)
- [ ] Estrategia backup/restore

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Modelo conceptual inicial, 6 dominios, flujo vertical 12-paso, multitenant con RLS. | Antonio José Escrucería Uribe |
