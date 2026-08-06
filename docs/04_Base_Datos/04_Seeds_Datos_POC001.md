# Seeds — Datos de Desarrollo POC-001

| Campo | Valor |
|---|---|
| Código | GDP-DAT-004 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A2) |
| Fecha | 2026-08-06 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Archivo SQL | `libs/database/seeds/001_poc001_base.sql` |
| Ejecutar después | Todas las migraciones completadas |

---

## Propósito

Datos de prueba reproducibles para POC-001. Carga de una organización completa con usuarios, series, documentos, radicaciones y auditoria.

---

## 1. Tenant y Organización

```sql
-- Tenant Venus Ingeniería (POC-001)
INSERT INTO organizations (id, tenant_id, name, sector, enabled, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  'Venus Ingeniería de Software Ltda',
  'technology',
  TRUE,
  CURRENT_TIMESTAMP
);

-- Headquarter
INSERT INTO headquarters (tenant_id, name, city, address)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Oficina Principal',
  'Bogotá',
  'Cra 7 # 100-50'
);

-- Departments
INSERT INTO departments (tenant_id, code, name, classification_level)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'DPTO-001', 'Recursos Humanos', 'confidential'),
  ('550e8400-e29b-41d4-a716-446655440000', 'DPTO-002', 'Operaciones', 'internal'),
  ('550e8400-e29b-41d4-a716-446655440000', 'DPTO-003', 'Desarrollo', 'internal'),
  ('550e8400-e29b-41d4-a716-446655440000', 'DPTO-004', 'Asuntos Legales', 'confidential');
```

---

## 2. Usuarios de Prueba

```sql
-- Usuarios (sin keycloak_id inicialmente; vinculados en POC-001 paso 3)
INSERT INTO users (tenant_id, email, full_name, document_id, phone, department_id, enabled, created_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@venus.com',
    'Administrador Sistema',
    '1234567890',
    '3115555555',
    (SELECT id FROM departments WHERE code = 'DPTO-001'),
    TRUE,
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'secretaria@venus.com',
    'Secretaria General',
    '0987654321',
    '3116666666',
    (SELECT id FROM departments WHERE code = 'DPTO-001'),
    TRUE,
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'gestor@venus.com',
    'Gestor Documental',
    '1111111111',
    '3117777777',
    (SELECT id FROM departments WHERE code = 'DPTO-002'),
    TRUE,
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'usuario@venus.com',
    'Usuario Operativo',
    '2222222222',
    '3118888888',
    (SELECT id FROM departments WHERE code = 'DPTO-003'),
    TRUE,
    CURRENT_TIMESTAMP
  );

-- Memberships (todos en tenant Venus)
INSERT INTO memberships (user_id, tenant_id, status, start_date)
SELECT id, '550e8400-e29b-41d4-a716-446655440000', 'active', CURRENT_DATE
FROM users WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## 3. Roles y Permisos

```sql
-- Roles
INSERT INTO roles (tenant_id, code, name, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'ADMIN_ORG', 'Administrador Organización', 'Acceso total'),
  ('550e8400-e29b-41d4-a716-446655440000', 'GESTOR_DOC', 'Gestor Documental', 'Gestión de documentos y expedientes'),
  ('550e8400-e29b-41d4-a716-446655440000', 'EDITOR', 'Editor', 'Crear y editar documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'VIEWER', 'Visualizador', 'Lectura de documentos');

-- Permisos (ej. básicos para POC)
INSERT INTO permissions (tenant_id, resource, action, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'users', 'create', 'Crear usuarios'),
  ('550e8400-e29b-41d4-a716-446655440000', 'documents', 'create', 'Crear documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'documents', 'read', 'Leer documentos'),
  ('550e8400-e29b-41d4-a716-446655440000', 'correspondences', 'create', 'Radicar comunicaciones'),
  ('550e8400-e29b-41d4-a716-446655440000', 'audit_logs', 'read', 'Leer auditoría');

-- Asignar roles a usuarios (de forma manual, ej)
INSERT INTO user_roles (user_id, role_id, assigned_at)
SELECT 
  u.id,
  (SELECT id FROM roles WHERE code = 'ADMIN_ORG' AND tenant_id = u.tenant_id),
  CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'admin@venus.com' AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000';

INSERT INTO user_roles (user_id, role_id, assigned_at)
SELECT 
  u.id,
  (SELECT id FROM roles WHERE code = 'GESTOR_DOC' AND tenant_id = u.tenant_id),
  CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'gestor@venus.com' AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000';

INSERT INTO user_roles (user_id, role_id, assigned_at)
SELECT 
  u.id,
  (SELECT id FROM roles WHERE code = 'EDITOR' AND tenant_id = u.tenant_id),
  CURRENT_TIMESTAMP
FROM users u
WHERE u.email IN ('secretaria@venus.com', 'usuario@venus.com') 
  AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## 4. Series y Tipos de Documentos

```sql
-- Series documentales base
INSERT INTO series (tenant_id, code, name, description, default_classification)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'RH-NOMI', 'Recursos Humanos - Nómina', 'Documentos de nómina y pagos', 'confidential'),
  ('550e8400-e29b-41d4-a716-446655440000', 'ADMIN-FACT', 'Administración - Facturas', 'Facturas y comprobantes', 'internal'),
  ('550e8400-e29b-41d4-a716-446655440000', 'LEGAL-CONTR', 'Legal - Contratos', 'Contratos y acuerdos', 'confidential'),
  ('550e8400-e29b-41d4-a716-446655440000', 'PROJ-DES', 'Proyectos - Desarrollo', 'Documentos de proyectos TI', 'internal');

-- Tipos de documento
INSERT INTO document_types (tenant_id, series_id, code, name, mime_types_allowed, max_file_size)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  id,
  'PDF',
  'PDF Document',
  '{"application/pdf"}',
  104857600
FROM series
WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';

INSERT INTO document_types (tenant_id, series_id, code, name, mime_types_allowed, max_file_size)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  id,
  'WORD',
  'Documento Word',
  '{"application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}',
  52428800
FROM series
WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## 5. Documentos de Prueba

```sql
-- Documentos (algunos de prueba)
INSERT INTO documents (tenant_id, series_id, title, description, created_by, status, classification)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  s.id,
  'Documento Prueba 1: ' || s.name,
  'Documento creado como fixture para testing',
  u.id,
  'active',
  'internal'
FROM series s, users u
WHERE s.tenant_id = '550e8400-e29b-41d4-a716-446655440000'
  AND u.email = 'gestor@venus.com'
  AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000'
LIMIT 4;
```

---

## 6. Expedientes de Prueba

```sql
-- Expedientes
INSERT INTO expedients (tenant_id, code, title, series_id, created_by, status, responsible_id, start_date)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  'EXP-2026-' || LPAD(ROW_NUMBER()::TEXT, 3, '0'),
  'Expediente ' || s.name || ' 2026',
  s.id,
  u.id,
  'open',
  u.id,
  CURRENT_DATE
FROM (
  SELECT DISTINCT id FROM series 
  WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000'
) s,
users u
WHERE u.email = 'gestor@venus.com' 
  AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## 7. Radicaciones de Prueba

```sql
-- Sequences (generadores consecutivos)
INSERT INTO sequences (tenant_id, type, prefix, reset_period, department_id)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'incoming', 'RAD-', 'yearly', NULL),
  ('550e8400-e29b-41d4-a716-446655440000', 'outgoing', 'SALIDA-', 'yearly', NULL),
  ('550e8400-e29b-41d4-a716-446655440000', 'internal', 'INT-', 'yearly', NULL);

-- Correspondences (radicaciones)
INSERT INTO correspondences (
  tenant_id, correspondence_type, number, document_id, subject,
  sender_name, created_by, status, created_at
)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  'incoming',
  'RAD-2026-00001',
  d.id,
  'Solicitud de información - Prueba',
  'Cliente ABC',
  u.id,
  'registered',
  CURRENT_TIMESTAMP
FROM documents d
LIMIT 1,
users u
WHERE u.email = 'secretaria@venus.com' 
  AND u.tenant_id = '550e8400-e29b-41d4-a716-446655440000'
LIMIT 1;
```

---

## 8. Script de carga (Node.js)

```typescript
// libs/database/seeds/load-poc001.ts

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function loadSeeds() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://dev:dev@localhost:5432/sgd_dev',
  });

  try {
    console.log('Loading POC-001 seeds...');
    
    const sql = readFileSync(join(__dirname, '001_poc001_base.sql'), 'utf-8');
    
    await pool.query(sql);
    
    console.log('✅ POC-001 seeds loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load seeds:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

loadSeeds();
```

**Ejecutar:**
```bash
pnpm --filter database run seed
```

---

## 9. Verificación post-seed

```sql
-- Verificar que seeds se cargaron correctamente

-- Contar registros
SELECT 'organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'series', COUNT(*) FROM series
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'expedients', COUNT(*) FROM expedients
UNION ALL
SELECT 'correspondences', COUNT(*) FROM correspondences;

-- Verificar RLS: consultar desde contexto de tenant específico
SET app.current_tenant_id = '550e8400-e29b-41d4-a716-446655440000';
SELECT COUNT(*) FROM documents;  -- Debe retornar documentos del tenant
RESET app.current_tenant_id;

-- Verificar sin contexto
SELECT COUNT(*) FROM documents;  -- Debe retornar 0 (RLS activo)
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-06 | Seeds POC-001: tenant Venus, 4 usuarios, roles, permisos, series, documentos, radicaciones. | Antonio José Escrucería Uribe |
