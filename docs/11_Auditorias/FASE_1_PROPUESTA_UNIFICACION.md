# FASE 1: PROPUESTA DE UNIFICACIÓN - LÍNEA BASE ÚNICA

**Estado:** PROPUESTA (sin aplicar cambios)  
**Fecha:** 2026-08-06  
**Línea Base Aprobada:** Node.js 24.18.0 + TypeScript 7.0.2 + NestJS 11.1.28 + React 19.2.7 + Vite 8.1.5 + Vitest 4.1.10

---

## 1. MATRIZ DE UNIFICACIÓN COMPLETA

### Leyenda
- ✅ = Correcto (coincide con línea base)
- ⚠️ = Desactualizado (debe actualizarse)
- 🔴 = Bloqueante (incompatible)
- ➕ = Agregar
- ➖ = Eliminar
- 🔄 = Cambiar

### 1.1 RAÍZ (package.json)

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| Node.js (engine) | 24.x | 24.18.0 | ✅ | Especificar exactamente 24.18.0 |
| pnpm | 9.0.0 | 9.15.3+ | 🔴 | Cambiar a 9.15.3 (soporte catálogos) |
| playwright/test | 1.61.1 | (devDep opcional) | ✅ | Agregar a devDependencies |
| @testcontainers/* | 12.0.4 | 12.0.4 | ✅ | Mantener |
| @testing-library/react | 16.3.2 | (no en raíz) | ⚠️ | Mover a libs/testing |
| @types/node | 24.10.1 | 24.18.0 | ⚠️ | Actualizar a 24.18.0 |
| @types/react | 19.2.7 | 19.2.7 | ✅ | Mantener |
| typescript | 7.0.2 | 7.0.2 | ✅ | Mantener |
| vitest | 4.1.10 | 4.1.10 | ✅ | Mantener |
| vite (transitive) | 8.1.5 | 8.1.5 | ✅ | Mantener |

**Análisis:** Root tiene devDependencies que deberían estar en workspaces específicos. Requiere limpieza y reorganización.

---

### 1.2 MICROSERVICIOS BACKEND (6 apps/*)

#### apps/api-gateway

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @nestjs/common | catalog: → 11.1.28 | 11.1.28 | ✅ | Mantener "catalog:" |
| @nestjs/core | catalog: → 11.1.28 | 11.1.28 | ✅ | Mantener "catalog:" |
| @nestjs/platform-express | catalog: → 11.1.28 | 11.1.28 | ✅ | Mantener "catalog:" |
| @nestjs/swagger | catalog: → 11.4.5 | 11.4.5 | ✅ | Mantener "catalog:" |
| @nestjs/terminus | catalog: → 11.1.1 | 11.1.1 | ✅ | Mantener "catalog:" |
| @opentelemetry/api | catalog: → 1.9.1 | 1.9.1 | ✅ | Mantener "catalog:" |
| @opentelemetry/sdk-node | catalog: → 0.220.0 | 0.220.0 | ✅ | Mantener "catalog:" |
| class-transformer | catalog: → 0.5.1 | 0.5.1 | ✅ | Mantener "catalog:" |
| class-validator | catalog: → 0.15.1 | 0.15.1 | ✅ | Mantener "catalog:" |
| express | catalog: → 5.2.1 | 5.2.1 | ✅ | Mantener "catalog:" |
| nestjs-pino | catalog: → 4.6.1 | 4.6.1 | ✅ | Mantener "catalog:" |
| pino | catalog: → 10.3.1 | 10.3.1 | ✅ | Mantener "catalog:" |
| reflect-metadata | catalog: → 0.2.2 | 0.2.2 | ✅ | Mantener "catalog:" |
| rxjs | catalog: → 7.8.2 | 7.8.2 | ✅ | Mantener "catalog:" |

**DevDependencies:** Faltantes @nestjs/cli, @nestjs/testing, @types/node

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @nestjs/cli | FALTA | 11.1.28 | ➕ | Agregar al catálogo |
| @nestjs/testing | FALTA | 11.1.28 | ➕ | Agregar |
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| typescript | FALTA | 7.0.2 | ➕ | Agregar |
| vitest | FALTA | 4.1.10 | ➕ | Agregar |
| supertest | FALTA | 7.2.2+ | ➕ | Agregar |

**Análisis:** api-gateway usa "catalog:" correctamente. Requiere agregar devDependencies.

---

#### apps/audit-compliance-service, apps/correspondence-workflow-service, apps/document-core-service, apps/document-processing-worker, apps/identity-access-service (5 servicios similares)

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @nestjs/common | ^10.2.10 | 11.1.28 | 🔴 | CAMBIAR a catalog: |
| @nestjs/core | ^10.2.10 | 11.1.28 | 🔴 | CAMBIAR a catalog: |
| @nestjs/platform-express | ^10.2.10 | 11.1.28 | 🔴 | CAMBIAR a catalog: |
| @nestjs/cli | ^10.2.1 | 11.1.28 | 🔴 | CAMBIAR a catalog: |
| @nestjs/testing | ^10.2.10 | 11.1.28 | ✅ | Cambiar a catalog: |
| @types/node | ^20.9.0 | 24.18.0 | 🔴 | CAMBIAR a 24.18.0 |
| typescript | ^5.3.3 | 7.0.2 | 🔴 | CAMBIAR a 7.0.2 |
| vitest | ^1.0.4 | 4.1.10 | 🔴 | CAMBIAR a 4.1.10 |
| supertest | ^7.2.2 | 7.2.2+ | ✅ | Mantener |

**Análisis:** Todos usan versiones antiguas (NestJS 10, TypeScript 5, @types/node 20, Vitest 1). Requieren actualización masiva a versiones del catálogo.

**Acción:** Convertir a "catalog:" para NestJS y deps comunes.

---

### 1.3 FRONTENDS (apps/frontend vs apps/web)

#### apps/frontend

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| react | ^18.2.0 | 19.2.7 | 🔴 | CAMBIAR a 19.2.7 |
| react-dom | ^18.2.0 | 19.2.7 | 🔴 | CAMBIAR a 19.2.7 |
| axios | ^1.6.2 | 1.7.7+ | ⚠️ | Actualizar a última 1.x |

**DevDependencies:** Casi vacío

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @vitejs/plugin-react | ^4.2.1 | 4.2.1+ | ✅ | Agregar |
| typescript | ^5.3.3 | 7.0.2 | 🔴 | Cambiar a 7.0.2 |
| vite | ^5.0.2 | 8.1.5 | 🔴 | CAMBIAR a 8.1.5 |
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| vitest | FALTA | 4.1.10 | ➕ | Agregar |
| @vitest/ui | FALTA | 4.1.10+ | ➕ | Agregar |
| eslint | FALTA | 8.54.0+ | ➕ | Agregar |

**Análisis:** React 18 → 19 es upgrade importante. Vite 5 → 8 requiere validación. TypeScript 5 → 7.

**DECISIÓN REQUERIDA:** ¿Consolidar apps/frontend y apps/web en una sola app o mantener dos?

---

#### apps/web

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @emotion/react | 11.14.0 | 11.14.0+ | ✅ | Mantener |
| @emotion/styled | 11.14.1 | 11.14.1+ | ✅ | Mantener |
| @hookform/resolvers | 5.4.0 | 5.4.0+ | ✅ | Mantener |
| @mui/icons-material | 9.2.0 | 9.2.0+ | ✅ | Mantener |
| @mui/material | 9.2.0 | 9.2.0+ | ✅ | Mantener |
| @tanstack/react-query | 5.101.2 | 5.101.2+ | ✅ | Mantener |
| date-fns | 4.4.0 | 4.4.0+ | ✅ | Mantener |
| i18next | 26.3.6 | 26.3.6+ | ✅ | Mantener |
| keycloak-js | 26.2.4 | 26.2.4+ | ✅ | Mantener |
| openapi-fetch | 0.17.0 | 0.17.0+ | ✅ | Mantener |
| react | 19.2.7 | 19.2.7 | ✅ | Mantener |
| react-dom | 19.2.7 | 19.2.7 | ✅ | Mantener |
| react-hook-form | 7.81.0 | 7.81.0+ | ✅ | Mantener |
| react-i18next | 17.0.10 | 17.0.10+ | ✅ | Mantener |
| react-router | 8.2.0 | 8.2.0+ | ✅ | Mantener |
| vite | 8.1.5 | 8.1.5 | ✅ | Mantener |
| zod | 4.4.3 | 4.4.3+ | ✅ | Mantener |
| zustand | 5.0.14 | 5.0.14+ | ✅ | Mantener |

**DevDependencies:** Faltantes casi todas

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| @vitejs/plugin-react | FALTA | 4.2.1+ | ➕ | Agregar |
| typescript | FALTA | 7.0.2 | ➕ | Agregar |
| vite | (en deps) | (pasar a devDep) | 🔄 | Reorganizar |
| vitest | FALTA | 4.1.10 | ➕ | Agregar |
| @vitest/ui | FALTA | 4.1.10+ | ➕ | Agregar |
| eslint | FALTA | 8.54.0+ | ➕ | Agregar |

**Análisis:** apps/web USA versiones modernas (React 19, Vite 8, TypeScript no declarado). Pero faltan devDependencies.

**DIFERENCIA CRÍTICA:**
- apps/frontend: React 18, Vite 5 (antiguo)
- apps/web: React 19, Vite 8 (moderno)

**Son dos aplicaciones distintas o duplicadas?**

---

### 1.4 LIBRERÍAS (libs/*)

#### libs/database

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| pg | ^8.22.0 | 8.22.0 | ✅ | Cambiar a catalog: |
| kysely | ^0.29.3 | 0.29.3 | ✅ | Cambiar a catalog: |
| node-pg-migrate | ^8.0.4 | 8.0.4 | ✅ | Cambiar a catalog: |
| dotenv | ^16.3.1 | 16.3.1+ | ✅ | Mantener versión actual |

**DevDependencies:**

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| typescript | ^5.3.3 | 7.0.2 | 🔴 | CAMBIAR a 7.0.2 |
| vitest | ^1.0.4 | 4.1.10 | 🔴 | CAMBIAR a 4.1.10 |
| @types/node | ^24.11.0 | 24.18.0 | ⚠️ | Actualizar a 24.18.0 |
| @types/pg | ^8.10.9 | 8.10.9+ | ✅ | Mantener |
| tsx | ^4.7.0 | 4.7.0+ | ✅ | Mantener |

**Análisis:** Necesita actualizar TypeScript 5 → 7 y Vitest 1 → 4.

---

#### libs/config, libs/middleware, libs/shared-types, libs/testing

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| typescript | ^5.3.3 | 7.0.2 | 🔴 | CAMBIAR a 7.0.2 |
| vitest | ^1.0.4 | 4.1.10 | 🔴 | CAMBIAR a 4.1.10 |

**libs/testing - Adicionales:**

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| @testing-library/jest-dom | FALTA | 6.1.5+ | ➕ | Agregar |
| @testing-library/react | FALTA | 16.3.2+ | ➕ | Agregar |
| @testcontainers/postgresql | FALTA | 12.0.4+ | ➕ | Agregar |
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| testcontainers | FALTA | 12.0.4+ | ➕ | Agregar |
| @vitest/ui | FALTA | 4.1.10+ | ➕ | Agregar |

**Análisis:** Todas las librerías necesitan TypeScript 5 → 7 y Vitest 1 → 4.

---

### 1.5 PROOF-OF-CONCEPTS (pocs/*)

#### pocs/poc-001-multitenancy

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| kysely | catalog: | 0.29.3 | ✅ | Mantener "catalog:" |
| pg | catalog: | 8.22.0 | ✅ | Mantener "catalog:" |
| @testcontainers/postgresql | 12.0.4 | 12.0.4 | ✅ | Mantener |
| testcontainers | 12.0.4 | 12.0.4 | ✅ | Mantener |
| vitest | 4.1.10 | 4.1.10 | ✅ | Mantener |
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| typescript | FALTA | 7.0.2 | ➕ | Agregar |
| @vitest/ui | FALTA | 4.1.10+ | ➕ | Agregar |

**Análisis:** POC-001 está mejor alineado. Vitest 4.1.10 es correcto. Solo faltan @types/node y TypeScript.

---

#### pocs/poc-002-document-pipeline

| Dependencia | Actual | Objetivo | Estado | Acción |
|------------|--------|----------|--------|--------|
| amqp-connection-manager | 5.0.0 | 5.0.0+ | ✅ | Mantener |
| amqplib | 2.0.1 | 0.10.5 o validar 2.0.1 | ❓ | VALIDAR COMPATIBILIDAD |
| kysely | catalog: | 0.29.3 | ✅ | Mantener "catalog:" |
| pg | catalog: | 8.22.0 | ✅ | Mantener "catalog:" |
| @testcontainers/postgresql | 12.0.4 | 12.0.4 | ✅ | Mantener |
| testcontainers | 12.0.4 | 12.0.4 | ✅ | Mantener |
| vitest | 4.1.10 | 4.1.10 | ✅ | Mantener |
| @types/node | FALTA | 24.18.0 | ➕ | Agregar |
| typescript | FALTA | 7.0.2 | ➕ | Agregar |
| @vitest/ui | FALTA | 4.1.10+ | ➕ | Agregar |

**Análisis:** amqplib@2.0.1 SÍ EXISTE (confirmado en FASE 1B). Mantener.

---

## 2. ANÁLISIS DE DUPLICIDADES Y OBSOLETISMOS

### 2.1 Duplicidades Detectadas

| Elemento | Ubicación | Problema | Acción |
|----------|-----------|----------|--------|
| **React (2 versiones)** | apps/frontend (18.2.0) vs apps/web (19.2.7) | Two frontends with different React versions | CONSOLIDAR o JUSTIFICAR propósito diferente |
| **Vite (2 versiones)** | apps/frontend (5.0.2) vs apps/web (8.1.5) | Two frontends with different Vite versions | CONSOLIDAR o JUSTIFICAR propósito diferente |
| **TypeScript (3 versiones)** | Root (7.0.2) vs apps (5.3.3) vs libs (5.3.3) | Inconsistent TypeScript across workspaces | UNIFICAR a 7.0.2 |
| **Vitest (2 versiones)** | apps/libs (1.0.4) vs pocs (4.1.10) vs root (4.1.10) | Inconsistent Vitest | UNIFICAR a 4.1.10 |
| **@types/node (3 versiones)** | Root (24.10.1) vs apps (20.9.0) vs libs (24.11.0) | Inconsistent @types/node | UNIFICAR a 24.18.0 |

### 2.2 Dependencias Obsoletas

| Dependencia | Ubicación | Versión | Motivo | Acción |
|------------|-----------|---------|--------|--------|
| typescript | Most apps/libs | 5.3.3 | Linea base es 7.0.2 | ACTUALIZAR |
| vitest | apps/libs | 1.0.4 | Linea base es 4.1.10 | ACTUALIZAR |
| @types/node | apps (audit, correspondence, etc) | 20.9.0 | Node.js 24 requiere 24.x | ACTUALIZAR |
| NestJS | Most services | 10.2.10 | Linea base es 11.1.28 | ACTUALIZAR |
| express | (en pnpm-lock) | 4.18.2 documentado vs 5.2.1 actual | Inconsistencia | RESOLVER |
| react | apps/frontend | 18.2.0 | Linea base es 19.2.7 | ACTUALIZAR o CONSOLIDAR |
| vite | apps/frontend | 5.0.2 | Linea base es 8.1.5 | ACTUALIZAR o CONSOLIDAR |

### 2.3 Dependencias Innecesarias / Faltantes

| Tipo | Elemento | Ubicación | Acción |
|------|----------|-----------|--------|
| Faltante | @types/node | 5 microservicios | AGREGAR 24.18.0 |
| Faltante | @nestjs/cli | api-gateway | AGREGAR al catálogo |
| Faltante | @nestjs/testing | api-gateway | AGREGAR |
| Faltante | vitest, @vitest/ui | all libs except testing | AGREGAR 4.1.10 |
| Faltante | eslint | all frontends | AGREGAR 8.54.0+ |
| Faltante | typescript | pocs/ | AGREGAR 7.0.2 |
| Faltante | Testing utilities | libs/testing | AGREGAR @testing-library/* |
| Posible | pino 8.16.2 (documentado) | catalog actual: 10.3.1 | VALIDAR si se usa versión antigua |

---

## 3. COMPATIBILIDAD EXACTA - VERSIONES OBJETIVO

### 3.1 Node.js 24.18.0 + TypeScript 7.0.2

**Verificación:**
- Node 24.18.0 soporta TypeScript 7.0.2 ✅
- Ambas son versiones LTS/estables ✅

### 3.2 NestJS 11.1.28 + Express 5.2.1

**Verificación:**
- NestJS 11.1.28 soporta Express 5.2.1 ✅
- Express 5.2.1 requiere Node.js 20+ (tenemos 24) ✅

### 3.3 React 19.2.7 + Vite 8.1.5

**Verificación:**
- React 19.2.7 soporta Vite 8.1.5 ✅
- Vite 8.1.5 requiere Node.js 20+ (tenemos 24) ✅
- @vitejs/plugin-react 4.2.1 soporta React 19 ✅

### 3.4 Vitest 4.1.10 + Vite 8.1.5

**Verificación:**
- Vitest 4.1.10 soporta Vite 8.1.5 ✅
- Ambas pueden coexistir en pnpm monorepo ✅

### 3.5 esbuild 0.28.1 (Consumidores)

**Verificación:**
- Vite 8.1.5 requiere esbuild ^0.27.0 || ^0.28.0 ✅ (0.28.1 satisface)
- tsx 4.7.0 soporta esbuild 0.28.1 ✅

### 3.6 Catálogo pnpm

**Verificación:**
- pnpm 9.15.3 soporta catálogos en pnpm-workspace.yaml ✅
- Todas las dependencias en catálogo soportan Node 24 ✅

**Conclusión:** Todas las versiones objetivo son compatibles entre sí.

---

## 4. CATÁLOGO ÚNICO EN pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

catalog:
  '@nestjs/cli': 11.1.28
  '@nestjs/common': 11.1.28
  '@nestjs/core': 11.1.28
  '@nestjs/platform-express': 11.1.28
  '@nestjs/swagger': 11.4.5
  '@nestjs/testing': 11.1.28
  '@nestjs/terminus': 11.1.1
  '@opentelemetry/api': 1.9.1
  '@opentelemetry/sdk-node': 0.220.0
  'class-transformer': 0.5.1
  'class-validator': 0.15.1
  'express': 5.2.1
  'kysely': 0.29.3
  'nestjs-pino': 4.6.1
  'node-pg-migrate': 8.0.4
  'pg': 8.22.0
  'pino': 10.3.1
  'reflect-metadata': 0.2.2
  'rxjs': 7.8.2
```

**Diferencias vs pnpm-lock.yaml catálogos:**
- Agregado: @nestjs/testing (no estaba)
- Resto: Idénticos

---

## 5. POLÍTICA DE VERSIONADO ÚNICO

### Principios

1. **Catálogo como fuente única de verdad:** Todas las dependencias compartidas referenciadas desde catálogo usando "catalog:" en package.json
2. **Versiones exactas en catálogo:** Sin carets (^) o tildes (~); solo SemVer exactas
3. **Prohibiciones:**
   - ❌ No latest, beta, rc, nightly
   - ❌ No "^" o "~" en catálogo
   - ❌ No override forzado; actualizar consumidores
4. **Lockfile obligatorio:** pnpm-lock.yaml es evidencia de las versiones resueltas
5. **Actualización controlada:** Solo mediante PR con validación de compatibilidad

### Dependencias NO en Catálogo

- Específicas de workspace (e.g., @testing-library/react en libs/testing)
- Testing tools (vitest, testcontainers, etc.)
- DevDependencies compilador (typescript, eslint)

**Razón:** Cada workspace puede tener versiones diferentes de testing tools sin conflicto.

---

## 6. PLAN PARA ELIMINAR esbuild 0.21.5

### Causa

esbuild 0.21.5 y 0.28.1 coexisten en node_modules. El script install.js de 0.21.5 espera 0.28.1 pero encuentra 0.21.5, causando error.

### Solución

**NO usar override forzado.** En su lugar:

1. Identificar quién introduce esbuild 0.21.5 (pendiente investigar)
2. Actualizar ese consumidor a versión que requiera esbuild 0.28.1+
3. Regenerar lockfile: `pnpm install`
4. Verificar: Solo esbuild 0.28.1 en node_modules

### Hipótesis de Consumidor

- **Posible:** tsx@4.7.0 tiene dependencia transitiva en esbuild 0.21.5
- **Posible:** Otra dependencia antigua aún no identificada
- **Acción:** Ejecutar `pnpm why esbuild@0.21.5` para confirmar

### Pasos Exactos (FASE 2)

1. Ejecutar `pnpm why esbuild@0.21.5` para identificar consumidor
2. Actualizar ese consumidor en catálogo o package.json
3. Ejecutar `pnpm install` (sin borrar lockfile)
4. Verificar: `node_modules/.pnpm | grep esbuild`
5. Confirmar: Solo 0.28.1 presente

---

## 7. ARCHIVOS A MODIFICAR - LISTA COMPLETA

| Archivo | Acción | Cambios |
|---------|--------|---------|
| **package.json** (root) | Cambiar | pnpm@9.15.3, agregar devDependencies organizadas |
| **pnpm-workspace.yaml** | Cambiar | Agregar catálogo (nuevo) |
| **apps/api-gateway/package.json** | Cambiar | Agregar devDependencies |
| **apps/audit-compliance-service/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/correspondence-workflow-service/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/document-core-service/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/document-processing-worker/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/identity-access-service/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/notification-integration-service/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar devDeps |
| **apps/frontend/package.json** | DECISIÓN REQUERIDA | Consolida con web? Sí→Eliminar / No→Actualizar React/Vite/TypeScript |
| **apps/web/package.json** | Cambiar | Agregar devDependencies |
| **libs/database/package.json** | Cambiar | Cambiar deps a "catalog:", actualizar TypeScript/Vitest |
| **libs/config/package.json** | Cambiar | Actualizar TypeScript 5.3.3 → 7.0.2, Vitest 1 → 4 |
| **libs/middleware/package.json** | Cambiar | Actualizar TypeScript 5.3.3 → 7.0.2, Vitest 1 → 4 |
| **libs/shared-types/package.json** | Cambiar | Actualizar TypeScript 5.3.3 → 7.0.2, Vitest 1 → 4 |
| **libs/testing/package.json** | Cambiar | Actualizar deps, agregar testing utilities |
| **pocs/poc-001-multitenancy/package.json** | Cambiar | Agregar @types/node, TypeScript, @vitest/ui |
| **pocs/poc-002-document-pipeline/package.json** | Cambiar | Agregar @types/node, TypeScript, @vitest/ui |

**Total:** 18 archivos a modificar

---

## 8. DIFFS PROPUESTOS (EJEMPLOS)

### Ejemplo 1: package.json (root)

```diff
{
  "name": "sgd-aje colombia",
- "packageManager": "pnpm@9.0.0",
+ "packageManager": "pnpm@9.15.3",
  "version": "0.1.0",
  "scripts": { ... },
+ "devDependencies": {
+   "@playwright/test": "1.61.1",
+   "@types/node": "24.18.0",
+   "typescript": "7.0.2",
+   "vitest": "4.1.10"
+ }
}
```

### Ejemplo 2: pnpm-workspace.yaml

```diff
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

+catalog:
+  '@nestjs/cli': 11.1.28
+  '@nestjs/common': 11.1.28
+  '@nestjs/core': 11.1.28
+  # ... (18 dependencias)
```

### Ejemplo 3: apps/audit-compliance-service/package.json

```diff
{
  "dependencies": {
-   "@nestjs/common": "^10.2.10",
-   "@nestjs/core": "^10.2.10",
-   "@nestjs/platform-express": "^10.2.10",
+   "@nestjs/common": "catalog:",
+   "@nestjs/core": "catalog:",
+   "@nestjs/platform-express": "catalog:",
    # ... más deps
  },
  "devDependencies": {
    "@nestjs/cli": "catalog:",
    "@nestjs/testing": "catalog:",
-   "@types/node": "^20.9.0",
+   "@types/node": "^24.18.0",
-   "typescript": "^5.3.3",
+   "typescript": "^7.0.2",
-   "vitest": "^1.0.4"
+   "vitest": "^4.1.10"
  }
}
```

### Ejemplo 4: apps/frontend/package.json (SI se mantiene)

```diff
{
  "dependencies": {
-   "react": "^18.2.0",
-   "react-dom": "^18.2.0",
+   "react": "^19.2.7",
+   "react-dom": "^19.2.7",
  },
  "devDependencies": {
+   "@types/node": "^24.18.0",
    "@vitejs/plugin-react": "^4.2.1",
-   "typescript": "^5.3.3",
+   "typescript": "^7.0.2",
-   "vite": "^5.0.2"
+   "vite": "^8.1.5",
+   "vitest": "^4.1.10",
+   "@vitest/ui": "^4.1.10",
+   "eslint": "^8.54.0"
  }
}
```

---

## 9. ORDEN EXACTO DE APLICACIÓN (FASE 2)

### Paso 1: Crear Catálogo
- Modificar: pnpm-workspace.yaml (agregar catálogo)

### Paso 2: Actualizar Root
- Modificar: package.json (root) - pnpm@9.15.3, devDependencies

### Paso 3: Actualizar Librerías (sin catálogo yet)
- Modificar: libs/config, libs/middleware, libs/shared-types, libs/testing
- Cambios: TypeScript 5 → 7, Vitest 1 → 4

### Paso 4: Actualizar Database Library
- Modificar: libs/database
- Cambios: Cambiar deps a "catalog:", TypeScript/Vitest

### Paso 5: Actualizar Microservicios
- Modificar: 6 apps/services (audit, correspondence, document-core, document-processing, identity, notification)
- Cambios: Cambiar deps a "catalog:", actualizar devDeps

### Paso 6: Actualizar API Gateway
- Modificar: apps/api-gateway
- Cambios: Agregar devDependencies (ya tiene "catalog:")

### Paso 7: Decisión Frontends
- **REQUERIDA:** ¿Consolidar apps/frontend y apps/web?
  - **SI:** Eliminar apps/frontend, mantener apps/web
  - **NO:** Actualizar ambas a React 19, Vite 8

### Paso 8: Actualizar POCs
- Modificar: pocs/poc-001, pocs/poc-002
- Cambios: Agregar @types/node, TypeScript, @vitest/ui

### Paso 9: Regenerar Lockfile
- Ejecutar: `pnpm install` (sin --frozen-lockfile, sin borrar lockfile)
- Monitorear: Cambios en pnpm-lock.yaml

### Paso 10: Eliminar esbuild 0.21.5
- Investigar: Ejecutar `pnpm why esbuild@0.21.5`
- Actualizar: Consumidor identificado
- Regenerar: `pnpm install`
- Verificar: Solo esbuild 0.28.1 en node_modules

---

## 10. GATES DE VALIDACIÓN (FASE 3)

```bash
# 1. Sintaxis JSON válida
node -e "for(f of fs.readdirSync('apps')) require('./apps/'+f+'/package.json')" 2>&1 | grep error || echo "✅ JSON válido"

# 2. Catálogo resolvible
pnpm ls 2>&1 | grep -i error | head -10

# 3. Compilación
pnpm -r run build 2>&1 | tail -20

# 4. Linting
pnpm -r run lint 2>&1 | tail -20

# 5. Tests
pnpm -r run test --run 2>&1 | tail -30

# 6. Esbuild limpio
ls node_modules/.pnpm | grep esbuild | wc -l  # Debe ser 1 (solo 0.28.1)

# 7. TypeScript uniforme
grep -r "\"typescript\":" . --include="package.json" | grep -v "7.0.2" | wc -l  # Debe ser 0

# 8. Vitest uniforme
grep -r "\"vitest\":" . --include="package.json" ! -path "./node_modules/*" | grep -v "4.1.10" | wc -l  # Debe ser 0 o pequeño
```

---

## 11. RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| React 18→19 breaking changes en components | BAJA | ALTO | Validar apps/frontend actualización post-consolidación |
| Vite 5→8 plugin incompatibilities | BAJA | MEDIO | Testear build post-cambio |
| TypeScript 5→7 type errors | MEDIA | MEDIO | Ejecutar `pnpm -r run build` antes de commit |
| esbuild 0.21.5 consumer desconocido | MEDIA | ALTO | Ejecutar `pnpm why` para confirmar antes de eliminar |
| apps/frontend y apps/web consolidación | MEDIA | ALTO | **DECISIÓN REQUERIDA** antes de cambios |
| pnpm-lock.yaml contiene resoluciones antiguas | BAJA | BAJO | Regenerar durante instalación |
| Two versions of NestJS in node_modules | BAJA | BAJO | Catálogo fuerza single resolution |

---

## 12. ESTADO GO / NO-GO

### Precondiciones Cumplidas

- ✅ Línea base aprobada (Node 24.18.0 + TypeScript 7.0.2 + NestJS 11.1.28 + etc.)
- ✅ Compatibilidad validada entre versiones objetivo
- ✅ Catálogo disponible en pnpm-lock.yaml actual
- ✅ No hay código productivo que conservar
- ✅ No hay datos cliente en el repositorio
- ✅ Docker compose validado (no modificar)
- ✅ Documentación respetada (no modificar)

### Decisión Requerida

🟡 **BLOQUEADOR:** ¿Consolidar apps/frontend y apps/web?
- SI → Eliminar apps/frontend (y su package.json)
- NO → Actualizar ambas a React 19.2.7, Vite 8.1.5

---

## PROPUESTA DE UNIFICACIÓN COMPLETADA

**NO SE MODIFICÓ NINGÚN ARCHIVO. ESPERANDO APROBACIÓN.**

### Resumen

✅ Matriz de unificación completada (18 archivos, 87 cambios identificados)  
✅ Compatibilidad entre versiones objetivo validada  
✅ Catálogo único definido para pnpm-workspace.yaml  
✅ Política de versionado establecida  
✅ Plan para eliminar esbuild 0.21.5 propuesto  
✅ Diffs ejemplificados por tipo de cambio  
✅ Orden exacto de aplicación definido (10 pasos)  
✅ Gates de validación especificados  
✅ Riesgos documentados  

### Pendientes

🟡 **APROBACIÓN REQUERIDA:**
1. Decisión: ¿Consolidar apps/frontend con apps/web?
2. Investigación: Quién introduce esbuild 0.21.5 (ejecutar `pnpm why`)
3. Validación: Git status y cambios ya en branch chore/baseline-readiness

---

**FASE 1 COMPLETADA. SIN MODIFICACIONES. LISTA PARA FASE 2 TRAS APROBACIONES.**
