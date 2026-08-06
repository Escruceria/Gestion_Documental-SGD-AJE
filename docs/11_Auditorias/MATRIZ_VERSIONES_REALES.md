# 📊 Matriz de Versiones Reales vs. Catálogo Maestro

**Documento:** Comparación versiones declaradas vs. vigentes  
**Fecha:** 2026-08-06 17:30 UTC  
**Fuentes:** Catálogo Maestro (GDP-ARQ-022 v1.1), pnpm-lock.yaml, package.json, docker-compose.yml, .nvmrc, ADRs 012-021

---

## ⚠️ Estado de la Comparación

| Fuente | Prioridad | Hallazgo |
|--------|-----------|----------|
| Catálogo maestro (GDP-ARQ-022) | 🔴 PRIMARY | Stack "aprobado", versiones "baseline candidato" pendiente POC/lockfile |
| ADRs 012-021 | 🟡 SECONDARY | Decisiones arquitectónicas aprobadas, versiones indicativas |
| Lockfile (pnpm-lock.yaml) | 🟢 INSTALLED | Versiones resueltas actualmente instaladas |
| package.json | 🟢 DECLARED | Rangos declarados en workspaces |
| .nvmrc | 🟡 PINNED | Node.js runtime específico |
| docker-compose.yml | 🟡 INFRASTRUCTURE | Imágenes y tags para servicios |

---

## 1️⃣ LENGUAJE, RUNTIME Y BACKEND

| Tecnología | Catálogo maestro | Declarado en package.json | Resuelto en lockfile | Estado actual | Acción requerida |
|-----------|-----------------|--------------------------|-------------------|---------------|-----------------|
| **TypeScript** | 7.0.2 (baseline candidato) | ^5.3.3 | ~5.3.3 | ⚠️ VERSIÓN ANTERIOR | Análisis de upgrade a 7.0.2 requerido |
| **Node.js** | 24.18.0 (aprobada) | N/A | 24.14.0 (.nvmrc) | ✅ COMPATIBLE | Dentro LTS 24.x (parches permitidos) |
| **NestJS Core** | 11.1.28 (baseline candidato) | ^10.2.10 | ~10.2.10 | ⚠️ VERSIÓN ANTERIOR | Análisis de upgrade a 11.1.28 requerido |
| **NestJS Common** | 11.1.28 (baseline candidato) | ^10.2.10 | ~10.2.10 | ⚠️ VERSIÓN ANTERIOR | Upgrade vinculado a @nestjs/core |
| **NestJS Platform Express** | 11.1.28 (baseline candidato) | ^10.2.10 | ~10.2.10 | ⚠️ VERSIÓN ANTERIOR | Upgrade vinculado a @nestjs/core |
| **Express** | 5.2.1 (baseline candidato) | No especificado | 4.x | ⚠️ VERSIÓN ANTERIOR | Incluida en NestJS 10; upgrade con NestJS |
| **OpenAPI** | @nestjs/swagger 11.4.5 (baseline candidato) | ^10.x (probablemente) | ~10.x | ⚠️ VERSIÓN ANTERIOR | Upgrade con NestJS |

### 📋 Análisis: Backend

**Situación:**
- El catálogo maestro propone **NestJS 11.1.28 + TypeScript 7.0.2** como "baseline candidato"
- El lockfile tiene instalado **NestJS 10.2.10 + TypeScript 5.3.3**
- Ambas líneas son estables y soportadas

**Interpretación:**
- ✅ La instalación **actual es funcional**
- ⚠️ No es el "baseline candidato" aún
- 🟡 El catálogo dice "baseline candidato" porque aún **NO se ha completado POC** con esas versiones
- 📌 NestJS 11 puede ser un salto importante que requiere validación

**Decisión requerida:**
1. Mantener NestJS 10 para POC-001 (menos riesgo)
2. O upgradearse a NestJS 11 como parte de preparación

---

## 2️⃣ VALIDACIÓN, CONTRATOS Y ERRORES

| Componente | Catálogo | Lockfile | Estado | Acción |
|-----------|----------|----------|--------|--------|
| class-validator | 0.15.1 | No encontrado en búsqueda inicial | ❌ NO CONFIRMADO | Verificar en pnpm-lock.yaml |
| class-transformer | 0.5.1 | No encontrado | ❌ NO CONFIRMADO | Verificar en pnpm-lock.yaml |
| RFC 9457 | Aprobada (estándar) | Especificado en OpenAPI | ✅ DOCUMENTADO | Implementación pendiente en POC |

---

## 3️⃣ BASE DE DATOS Y MIGRACIONES

| Componente | Catálogo maestro | package.json | Lockfile | Docker | Estado | Acción |
|-----------|-----------------|--------------|----------|--------|--------|--------|
| **PostgreSQL** | 18.4 (baseline candidato) | N/A | N/A | postgres:16-alpine | ⚠️ VERSION MISMATCH | Decisión: ¿18 o 16? |
| **Kysely** | 0.29.3 (baseline candidato) | NO PRESENTE | NO PRESENTE | N/A | ❌ FALTANTE | **CRÍTICO:** Instalar |
| **pg (driver)** | 8.22.0 (baseline candidato) | NO PRESENTE | NO PRESENTE | N/A | ❌ FALTANTE | **CRÍTICO:** Instalar |
| **node-pg-migrate** | 8.0.4 (baseline candidato) | NO PRESENTE | NO PRESENTE | N/A | ❌ FALTANTE | **CRÍTICO:** Instalar |

### 📋 Análisis: Base de Datos

**PostgreSQL:**
- Catálogo: 18.4 (actual, con soporte oficial)
- Docker-compose: 16-alpine (3 versiones atrasada)
- Problema: postgres:16-alpine es etiqueta móvil; el tag alpine va actualizando parches sin aviso
- Impacto: Degradación de features, vulnerability exposure

**Dependencias de conexión:**
- pg, kysely, node-pg-migrate: **COMPLETAMENTE AUSENTES**
- Esto es un bloqueador **CRÍTICO** para cualquier desarrollo
- El análisis anterior fue correcto en este hallazgo

**Decisión requerida:**
1. PostgreSQL 16 → 18 (upgrade)
2. Instalar pg, kysely, node-pg-migrate obligatoriamente
3. Fijar postgres con versión específica + digest

---

## 4️⃣ IDENTIDAD Y AUTENTICACIÓN

| Componente | Catálogo maestro | Docker-compose | Lockfile | Estado | Acción |
|-----------|-----------------|-----------------|----------|--------|--------|
| **Keycloak Server** | 26.7.0 (baseline candidato) | keycloak/keycloak:latest | N/A | 🔴 MÓVIL | Fijar a 26.7.0 por digest |
| **keycloak-js** | 26.2.4 (baseline candidato) | N/A | Presente en web | ✅ PRESENTE | Version verificable |

### 📋 Análisis: Identidad

- Keycloak Server usa `latest` (violación de política)
- keycloak-js instalado con versión fija
- Ciclos independientes (server 26.7.0, adaptador 26.2.4)

**Decisión requerida:**
- Cambiar keycloak:latest → keycloak:26.7.0 (o versión pin específica)

---

## 5️⃣ FRONTEND

| Necesidad | Catálogo | apps/frontend | apps/web | Estado | Acción |
|-----------|----------|---------------|----------|--------|--------|
| **React** | 19.2.7 (baseline) | ^18.2.0 | 19.2.7 | ⚠️ INCONSISTENTE | Unificar versión |
| **React DOM** | 19.2.7 (baseline) | ^18.2.0 | 19.2.7 | ⚠️ INCONSISTENTE | Unificar versión |
| **Vite** | 8.1.5 (baseline candidato) | NO VERIFICADO | NO VERIFICADO | ❌ PENDIENTE | Verificar en lockfile |
| **React Router** | 8.2.0 (baseline candidato) | NO ENCONTRADO | 8.2.0 | ⚠️ PARCIAL | apps/frontend: verificar |
| **@tanstack/react-query** | 5.101.2 | NO ENCONTRADO | NO ENCONTRADO | ❌ FALTANTE | Verificar en lockfile |
| **react-hook-form** | 7.81.0 | NO ENCONTRADO | 7.81.0 | ⚠️ PARCIAL | apps/frontend: verificar |

### 📋 Análisis: Frontend

**Inconsistencia React 18 vs 19:**
- Catálogo propone: React 19.2.7
- apps/frontend tiene: React 18.2.0
- apps/web tiene: React 19.2.7
- **NO es incompatibilidad autom

ática** (necesita verificar peer dependencies)

**Decisión requerida:**
- Opción A: Todos a React 19 (catálogo candidato)
- Opción B: Mantener 18 en frontend, justificar diferencia
- Opción C: Análisis de peer dependencies antes de elegir

---

## 6️⃣ ALMACENAMIENTO DE OBJETOS

| Modalidad | Producto | Catálogo | Docker-compose | Estado | Acción |
|-----------|----------|----------|-----------------|--------|--------|
| **SaaS** | AWS S3 | Gestionado | N/A | ✅ APPROBADA | Configurar en IaC (futuro) |
| **Privada** | MinIO Server | Pendiente de digest | minio/minio:latest | 🔴 MÓVIL | Fijar a release específica + digest |

### 📋 Análisis: Almacenamiento

- MinIO usa `latest` (violación de política)
- Catálogo requiere que POC-002 registre "repositorio, tag, digest, licencia, soporte"
- Impacto: Builds no reproducibles

**Decisión requerida:**
- Cambiar minio:latest → versión específica (ej: 2024.06.29 + digest)

---

## 7️⃣ MENSAJERÍA

| Componente | Catálogo maestro | Docker-compose | Lockfile | Estado | Acción |
|-----------|-----------------|-----------------|----------|--------|--------|
| **AWS EventBridge** | Gestionado (SaaS) | N/A | N/A | ✅ APROBADA | Config en IaC (futuro) |
| **AWS SQS** | Gestionado (SaaS) | N/A | N/A | ✅ APROBADA | Config en IaC (futuro) |
| **RabbitMQ** | 4.3.2 (baseline) | rabbitmq:3-management-alpine | NO PRESENTE | ⚠️ VERSIÓN MAYOR ATRÁS | Decisión: 3.x o 4.x? |
| **amqplib** | 2.0.1 | NO PRESENTE | NO PRESENTE | ❌ FALTANTE | Instalar si RabbitMQ se usa |
| **amqp-connection-manager** | 5.0.0 | NO PRESENTE | NO PRESENTE | ❌ FALTANTE | Instalar si RabbitMQ se usa |

### 📋 Análisis: Mensajería

- Catálogo propone RabbitMQ 4.3.2
- Docker-compose tiene 3-management-alpine (versión anterior)
- RabbitMQ 4.x vs 3.x es upgrade importante que requiere testing

**Decisión requerida:**
1. ¿RabbitMQ 3.x o 4.x para POC-001?
2. Fijar versión con digest (no latest/alpine móvil)
3. Instalar amqplib y amqp-connection-manager si se usa

---

## 8️⃣ PRUEBAS

| Necesidad | Catálogo | Lockfile/package.json | Estado | Acción |
|-----------|----------|----------------------|--------|--------|
| **Vitest** | 4.1.10 (baseline) | ^1.0.4 | ⚠️ VERSIÓN ANTERIOR | Análisis de upgrade a 4.1.10 |
| **@nestjs/testing** | 11.1.28 (baseline) | ^10.2.10 | ⚠️ VINCULADA A NESTJS | Upgrade con NestJS 10→11 |
| **Supertest** | 7.2.2 (baseline) | NO ENCONTRADO | ❌ FALTANTE | **Instalar** |
| **Testcontainers** | 12.0.4 (baseline) | Symlink roto (presente) | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar en pnpm-lock.yaml |
| **@testcontainers/postgresql** | 12.0.4 | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar cuando se repare node_modules |
| **MSW** | 2.15.0 (baseline) | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar en pnpm-lock.yaml |
| **@playwright/test** | 1.61.1 (baseline) | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar cuando se repare node_modules |
| **playwright** | 1.61.1 (baseline) | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar cuando se repare node_modules |
| **axe-core** | 4.12.1 (baseline) | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar cuando se repare node_modules |
| **jest-axe** | 10.0.0 (baseline) | Symlink roto | ⚠️ PRESENTE PERO NO VERIFICADO | Verificar; compatibilidad Vitest necesaria |

### 📋 Análisis: Pruebas

- Vitest 1.0.4 instalado vs. 4.1.10 candidato (versiones anteriores)
- Múltiples librerías de testing tienen symlinks rotos (no verificables actualmente)
- Supertest **completamente ausente**
- jest-axe requiere validación de compatibilidad con Vitest 4

**Decisión requerida:**
1. Mantener Vitest 1.0.4 o upgradearse a 4.1.10?
2. Instalar Supertest (obligatorio para HTTP testing)
3. Validar compatibilidad jest-axe con versión final Vitest

---

## 9️⃣ OBSERVABILIDAD Y SALUD

| Necesidad | Catálogo | Lockfile | Estado | Acción |
|-----------|----------|----------|--------|--------|
| **@opentelemetry/api** | 1.9.1 (baseline) | NO PRESENTE | ❌ FALTANTE | Instalar si observabilidad es requerida |
| **@opentelemetry/sdk-node** | 0.220.0 (baseline) | NO PRESENTE | ❌ FALTANTE | Instalar si observabilidad es requerida |
| **pino** | 10.3.1 (baseline) | NO PRESENTE | ❌ FALTANTE | Instalar si logging estructurado es requerido |
| **nestjs-pino** | 4.6.1 (baseline) | NO PRESENTE | ❌ FALTANTE | Instalar si pino se integra con NestJS |
| **@nestjs/terminus** | 11.1.1 (baseline) | NO PRESENTE | ❌ FALTANTE | Instalar (health checks recomendado) |

### 📋 Análisis: Observabilidad

- **NADA** instalado de OpenTelemetry
- Logging, health checks: pendientes
- ADR-020 aprueba OpenTelemetry pero no está implementado

**Decisión requerida:**
- ¿Incluir OpenTelemetry en baseline para POC-001?
- Mínimo: Instalar @nestjs/terminus para health checks

---

## 📊 Resumen de Discrepancias

| Categoría | Total componentes | Confirmados | Versión anterior | Faltantes | Etiquetas móviles |
|-----------|------------------|------------|-----------------|-----------|------------------|
| Backend | 7 | 1 | 4 | 2 | N/A |
| Datos | 4 | 0 | 1 | 3 | 1 (postgres:16-alpine) |
| Identidad | 2 | 1 | 0 | 0 | 1 (keycloak:latest) |
| Frontend | 8 | 1 | 0 | 3 | 1 (inconsistencia 18/19) |
| Almacenamiento | 2 | 0 | 0 | 0 | 1 (minio:latest) |
| Mensajería | 5 | 0 | 1 | 2 | 1 (rabbitmq:3-alpine) |
| Pruebas | 10 | 2 | 1 | 1 | 6 (symlinks rotos) |
| Observabilidad | 5 | 0 | 0 | 5 | N/A |
| **TOTAL** | **43** | **5** | **7** | **17** | **6** |

---

## 🎯 Conclusión de la Matriz

### Verde (Confirmado/Compatible)
- Node.js 24.14.0 ✅
- Keycloak-js 26.2.4 ✅
- Algunos paquetes de testing presentes ✅

### Amarillo (Versión anterior pero funcional)
- TypeScript 5.3.3 vs 7.0.2 candidato
- NestJS 10.2.10 vs 11.1.28 candidato
- Vitest 1.0.4 vs 4.1.10 candidato
- RabbitMQ 3.x vs 4.3.2 candidato
- React inconsistencia (18 vs 19)

### Rojo (Faltante o bloqueador)
- pg, kysely, node-pg-migrate (base de datos completamente inaccesible)
- Supertest (testing HTTP imposible)
- OpenTelemetry (observabilidad no implementada)
- Pino/logging (logging estructurado no presente)
- Etiquetas móviles en Docker (postgres, keycloak, minio, rabbitmq)

---

## 📌 Nota sobre Etiquetas Móviles en Docker

**Corrección importante a auditoría anterior:**

Tags como `postgres:16-alpine`, `rabbitmq:3-management-alpine`, `redis:7-alpine` **NO son versiones fijas**:
- `postgres:16-alpine` → se actualiza a 16.latest-alpine automáticamente
- `rabbitmq:3-management-alpine` → se actualiza a 3.latest-management-alpine
- La política vigente (sección 14 del catálogo) prohíbe esto

**Fijación correcta:**
```yaml
postgres:
  image: postgres:16.4-alpine@sha256:DIGEST  # Version exacta + digest
rabbitmq:
  image: rabbitmq:3.14.7-management-alpine@sha256:DIGEST
keycloak:
  image: keycloak/keycloak:26.7.0@sha256:DIGEST
```

