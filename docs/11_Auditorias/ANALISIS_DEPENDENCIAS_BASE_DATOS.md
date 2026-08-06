# 📊 Análisis de Dependencias de Base de Datos

**Documento:** Análisis de libs/database y cambios requeridos  
**Fecha:** 2026-08-06 22:25 America/Bogota  
**Estado:** PROPUESTO  
**Bloqueador:** NO-GO sin pg, kysely, node-pg-migrate

---

## Estado Actual

### libs/database/package.json
```json
{
  "name": "@lib/database",
  "version": "0.1.0",
  "description": "Shared library for SGD",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src",
    "test": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  }
}
```

### Problemas Identificados

| Problema | Severidad | Impacto |
|----------|-----------|---------|
| **NO HAY:** `pg` en dependencies | 🔴 CRÍTICO | Imposible conectar a PostgreSQL |
| **NO HAY:** `kysely` en dependencies | 🔴 CRÍTICO | Imposible construir queries type-safe |
| **NO HAY:** `node-pg-migrate` en dependencies | 🔴 CRÍTICO | Imposible ejecutar migraciones |
| **NO HAY:** Script `migrate` | 🔴 CRÍTICO | `pnpm db:migrate` falla (línea 12 root) |
| **NO HAY:** Script `seed` | 🔴 CRÍTICO | `pnpm db:seed` falla (línea 13 root) |
| **NO HAY:** Tipos de Node.js | 🟡 ALTO | TypeScript warnings en código |
| **NO HAY:** Tipos de pg | 🟡 ALTO | TypeScript warnings con driver |

---

## Cambio Propuesto

### Opción A: Agregar dependencias (RECOMENDADO)

**Archivo:** `libs/database/package.json`

**ANTES:**
```json
{
  "name": "@lib/database",
  "version": "0.1.0",
  "description": "Shared library for SGD",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src",
    "test": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  }
}
```

**DESPUÉS:**
```json
{
  "name": "@lib/database",
  "version": "0.1.0",
  "description": "Shared library for SGD",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src",
    "test": "vitest",
    "migrate": "node-pg-migrate",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "pg": "^8.22.0",
    "kysely": "^0.29.3",
    "node-pg-migrate": "^8.0.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "@types/node": "^20.10.0",
    "@types/pg": "^8.10.9",
    "tsx": "^4.7.0"
  }
}
```

### Justificación de Cambios

#### Dependencies

| Paquete | Versión | Fuente | Propósito |
|---------|---------|--------|----------|
| **pg** | ^8.22.0 | Catálogo maestro GDP-ARQ-022 | Driver PostgreSQL nativo para Node.js |
| **kysely** | ^0.29.3 | Catálogo maestro GDP-ARQ-022 | Query builder type-safe para SQL |
| **node-pg-migrate** | ^8.0.4 | Catálogo maestro GDP-ARQ-022 | Herramienta de migraciones de BD |
| **dotenv** | ^16.3.1 | Estándar Node.js | Variables de entorno desde .env |

#### DevDependencies

| Paquete | Versión | Propósito |
|---------|---------|----------|
| **@types/node** | ^20.10.0 | Types para APIs Node.js (compatible con Node 24) |
| **@types/pg** | ^8.10.9 | Types para pg driver |
| **tsx** | ^4.7.0 | Ejecutor TypeScript (alternativa a ts-node/ts-node-dev) |

#### Scripts

| Script | Comando | Propósito |
|--------|---------|----------|
| **migrate** | `node-pg-migrate` | Ejecutar migraciones (llamado por `pnpm db:migrate`) |
| **seed** | `tsx scripts/seed.ts` | Ejecutar seeds TypeScript (llamado por `pnpm db:seed`) |

---

## Verificación de Compatibilidad

### Node.js 24 y @types/node

```bash
# Verificar compatibilidad:
# Node.js 24: Soportado por @types/node@^20.10.0 y superiores
# @types/node@^20.10.0: Proporciona tipos hasta Node 20.x+
# Conclusión: ✅ Compatible
```

### pg y Kysely

```bash
# pg@^8.22.0:
#   - Soporta Node.js 14+
#   - Compatible con Node 24 ✅
#
# kysely@^0.29.3:
#   - Soporta Node.js 16+
#   - Compatible con Node 24 ✅
```

---

## Archivos Relacionados

### scripts/seed.ts (Necesario crear)

Ubicación prevista: `libs/database/scripts/seed.ts`

Contenido ejemplo (SCAFFOLD SOLO):
```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Seeds not yet implemented');
    // TODO: Implementar seeds después de POC
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
```

**Nota:** El script de seed es SCAFFOLD; la implementación real viene después de POC-002.

---

## Variables de Entorno Necesarias

Para que `db:migrate` y `db:seed` funcionen:

```env
# .env o variables de entorno:
DATABASE_URL=postgresql://dev:dev@localhost:5432/sgd_dev
# o específicamente:
PGHOST=localhost
PGPORT=5432
PGUSER=dev
PGPASSWORD=dev
PGDATABASE=sgd_dev
```

**Nota:** `.env` debe estar en GITIGNORE (actual `.gitignore` ya lo incluye)

---

## Impacto en Lockfile

Agregar estas dependencias modificará `pnpm-lock.yaml`:
- Se agregará sección `pg@8.22.0`
- Se agregará sección `kysely@0.29.3`
- Se agregará sección `node-pg-migrate@8.0.4`
- Se agregará sección `dotenv@16.3.1`
- Se agregará sección `tsx@4.7.0` (devDep)
- Se agregarán tipos de ambos

**Tamaño estimado:** pnpm-lock.yaml crecerá ~500KB - 1MB (estimación preliminar)

**Reproducibilidad:** Después de cambio, ejecutar:
```bash
pnpm install --frozen-lockfile  # Debe ser idempotente
```

---

## Gates de Aceptación

Para considerar este cambio APLICADO:

- [ ] libs/database/package.json modificado correctamente
- [ ] pnpm install ejecutado exitosamente
- [ ] `pnpm -r run build` compila sin errores
- [ ] `pnpm --filter database run migrate --help` retorna output (sin error)
- [ ] `pnpm --filter database run seed` no falla (script scaffold OK)
- [ ] pnpm-lock.yaml actualizado y reproducible

---

## Estado del Cambio

**Status:** PROPUESTO (sin aplicar aún)

**Bloqueador:** NO-GO sin este cambio

**Aprobador:** Arquitecto

**Plazo:** Antes de cualquier validación de POC-001

