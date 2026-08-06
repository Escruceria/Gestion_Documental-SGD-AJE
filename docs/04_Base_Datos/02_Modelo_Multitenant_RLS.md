# Modelo Multitenant con PostgreSQL RLS

| Campo | Valor |
|---|---|
| Código | GDP-DAT-002 |
| Versión | 1.0 |
| Estado | Aprobado (ADR-015) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | David Ernesto Antequera Martínez (QA), Álvaro Patiño Cruz (PO) |

## Propósito

Garantizar aislamiento lógico completo entre tenants (organizaciones) a nivel base de datos mediante Row-Level Security (RLS) PostgreSQL. Previene leaks cross-tenant bajo cualquier circunstancia (bugs, ataques, error humano).

---

## 1. Estrategia: Tenant ID en cada tabla + RLS

**No es multi-schema ni multi-base de datos.** Es single-database, single-schema con RLS obligatorio.

**Ventajas:**
- Operación y backup simplificados
- Escalamiento horizontal sin provisioning per-tenant
- Crecimiento gradual de 1 a 1.000+ tenants en misma BD
- Recuperación de datos fácil (un tenant no bloquea otros)

**Riesgos mitigados:**
- Bug en JOIN → RLS previene leaks (no alcanza)
- Olvido de filtro tenant_id → RLS previene leaks
- Admin BD intentando acceso cross-tenant → RLS lo bloquea
- SQL injection → Parámetros + RLS en capas

---

## 2. Implementación RLS (PostgreSQL 10+)

**Paso 1: Habilitar RLS en tabla**
```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

**Paso 2: Crear política de lectura**
```sql
CREATE POLICY documents_tenant_read ON documents
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Paso 3: Crear política de escritura**
```sql
CREATE POLICY documents_tenant_write ON documents
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY documents_tenant_update ON documents
  FOR UPDATE USING (tenant_id = current_setting('app.current_tenant_id')::UUID)
               WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY documents_tenant_delete ON documents
  FOR DELETE USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Paso 4: Definir roles y permitir bypass (si aplica)**
```sql
-- Rol de aplicación (respeta RLS)
CREATE ROLE app_user WITH LOGIN;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;

-- Rol de admin-tenant (respeta RLS pero puede ver admin tables)
CREATE ROLE app_admin WITH LOGIN NOINHERIT;

-- Rol de superadmin (bypass RLS, solo para emergencias auditadas)
CREATE ROLE app_superadmin WITH LOGIN BYPASSRLS;
```

---

## 3. Context propagation (sesión → RLS)

**En la aplicación (Node.js):**

```typescript
// middleware/set-tenant-context.ts
export async function setTenantContext(req, res, next) {
  const tenantId = req.user.tenant_id; // De Keycloak JWT
  
  if (!tenantId) {
    throw new AuthorizationError('No tenant in token');
  }
  
  // Establecer contexto para TODA la sesión DB
  await db.query(
    "SET app.current_tenant_id = $1",
    [tenantId]
  );
  
  next();
}

// Usar en cada request autenticado
app.use(authenticate);
app.use(setTenantContext);
```

**Variables session en PostgreSQL:**
- Existen solo durante la conexión actual
- Se pierden al cerrar conexión (seguro)
- Pool de conexiones reutiliza, pero middleware resetting antes de cada request

---

## 4. Flujo de consulta seguro

```
REQUEST
  │
  ├─ JWT validado (Keycloak)
  ├─ tenant_id extraído
  │
  ├─ MIDDLEWARE: SET app.current_tenant_id = 'xyz'
  │
  ├─ SELECT * FROM documents;
  │
  └─ PostgreSQL RLS automáticamente agrega:
     WHERE tenant_id = 'xyz'
     
  RESULTADO: Solo documentos del tenant xyz
```

**Garantías:**
- ✅ Incluso si app-dev olvida tenant_id filter, RLS lo impone
- ✅ Incluso si SQL inyectado, RLS sesión-local lo impide
- ✅ Incluso si admin BD curioso, no puede leer otros tenants sin BYPASSRLS

---

## 5. Índices para RLS performance

```sql
-- Índice compuesto para acceso rápido con RLS
CREATE INDEX idx_documents_tenant_id_pk 
  ON documents(tenant_id, id);

CREATE INDEX idx_correspondences_tenant_type 
  ON correspondences(tenant_id, correspondence_type, created_at DESC);

CREATE INDEX idx_audit_logs_tenant_entity 
  ON audit_logs(tenant_id, entity_type, entity_id, performed_at DESC);

-- Sin estos índices, RLS filtra post-búsqueda (lento)
-- Con índices, PostgreSQL puede accesar directamente rango tenant
```

---

## 6. Tablas sin tenant_id (si existen)

**NO PERMITIDAS.** Excepto:

1. **Tablas de sistema:**
   - `pg_*` (sistema PostgreSQL)
   - Migraciones (`knex_migrations`)

2. **Configuración global (bootstrap):**
   ```sql
   CREATE TABLE config_global (
     key: string PK
     value: json
     -- Sin tenant_id porque afecta a TODOS
   );
   ```
   Política: Solo acceso BYPASSRLS.

**Regla:** Si no tiene tenant_id, require arquitecto aprobación en ADR.

---

## 7. Operaciones administrativas

### Backup tenant específico
```bash
pg_dump \
  --data-only \
  -T knex_migrations \
  -t 'public.*' \
  --where "tenant_id = 'xyz'" \
  mydb > backup_tenant_xyz.sql
```

### Restore tenant
```bash
# Validar integridad primero
psql mydb < backup_tenant_xyz.sql
```

### Auditoría: Ver actividad de tenant
```sql
SELECT event_type, entity_type, performed_by, performed_at
FROM audit_logs
WHERE tenant_id = 'xyz'
ORDER BY performed_at DESC
LIMIT 100;
-- RLS automáticamente asegura solo 'xyz'
```

### Eliminación segura de tenant
```sql
BEGIN;
  -- Paso 1: Marcar como disabled (no DELETE aún)
  UPDATE organizations SET enabled = FALSE WHERE id = 'xyz';
  
  -- Paso 2: Auditar decisión
  INSERT INTO audit_logs (tenant_id, event_type, entity_type, entity_id, ...)
  VALUES ('xyz', 'delete', 'organization', 'xyz', ...);
  
  -- Paso 3: Esperar 30 días (período legal)
  
  -- Paso 4: DELETE físico (irreversible)
  DELETE FROM documents WHERE tenant_id = 'xyz';
  DELETE FROM correspondences WHERE tenant_id = 'xyz';
  DELETE FROM organizations WHERE id = 'xyz';
COMMIT;
```

---

## 8. Testing multitenant

**Escenario 1: Aislamiento lectura**
```typescript
it('User A cannot read User B tenant docs', async () => {
  const db1 = await getConnection(TENANT_A_ID);
  const db2 = await getConnection(TENANT_B_ID);
  
  // Insert en tenant A
  await db1.query('INSERT INTO documents (...) VALUES (...)');
  
  // Query desde tenant B
  const result = await db2.query('SELECT * FROM documents');
  
  // Debe retornar 0 (RLS lo filtró)
  expect(result.rows).toHaveLength(0);
});
```

**Escenario 2: RLS previene bypass**
```typescript
it('RLS prevents direct SQL bypass', async () => {
  const db = await getConnection(TENANT_A_ID);
  
  // Intento de bypass:
  // SELECT * FROM documents WHERE tenant_id = 'different-tenant'
  const result = await db.query(
    'SELECT * FROM documents WHERE tenant_id = $1',
    ['different-tenant-id']
  );
  
  // Debe retornar 0 (RLS políticamente bloquea)
  expect(result.rows).toHaveLength(0);
});
```

**Escenario 3: Desempeño con RLS**
```typescript
it('RLS + indexed queries perform well', async () => {
  const start = Date.now();
  const result = await db.query(
    'SELECT COUNT(*) FROM documents WHERE series_id = $1',
    [seriesId]
  );
  const elapsed = Date.now() - start;
  
  // Debe ser < 100ms (índice lo hace eficiente)
  expect(elapsed).toBeLessThan(100);
});
```

---

## 9. Configuración por macroservicio

**Cada macroservicio**: Conexión DB con RLS middleware propio.

```
┌─────────────────────────────────┐
│ Keycloak (autenticación)        │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────────────┐  │
│ identity-access  │  │
│ -service         │  │
│                  │  │
│ SET tenant_id    │  │
│ (RLS context)    │  │
└──────────────────┘  │
                      │
┌─────────────────────▼──────┐
│ PostgreSQL DB (shared)      │
│ • organizations             │
│ • users                     │
│ • documents (RLS enabled)   │
│ • correspondences (RLS)     │
│ • audit_logs (RLS)          │
└────────────────────────────┘
```

---

## 10. Validaciones de seguridad

**Pre-POC checklist:**

- [ ] Todas las tablas con tenant_id
- [ ] RLS habilitado en 15+ tablas críticas
- [ ] Políticas SELECT, INSERT, UPDATE, DELETE por tabla
- [ ] Índices (tenant_id, PK) creados
- [ ] Middleware SetTenantContext probado
- [ ] Tests: aislamiento, bypass prevention, perf
- [ ] Auditoría: acceso cruzado detectado
- [ ] Documentación: runbook emergencia bypass

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Modelo multitenant RLS, contexto sesión, testing, operación. | Antonio José Escrucería Uribe |
