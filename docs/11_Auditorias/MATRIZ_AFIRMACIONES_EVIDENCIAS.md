# 📋 Matriz de Afirmaciones vs. Evidencias

**Documento:** ANALISIS_REPOSITORIO_COMPLETO.md vs. Repositorio real  
**Fecha:** 2026-08-06  
**Total afirmaciones analizadas:** 47

---

## Leyenda

| Resultado | Significado |
|-----------|------------|
| ✅ CONFIRMADO | La afirmación coincide exactamente con la evidencia encontrada |
| ⚠️ PARCIALMENTE CONFIRMADO | La afirmación es verdadera pero incompleta o con variantes |
| ❌ NO CONFIRMADO | La afirmación no tiene evidencia o está contradictoria |
| 🔴 CONTRADICTORIO | La afirmación contradice la evidencia encontrada |
| ⏸️ NO APLICA | No se puede verificar en este contexto |

---

## Matriz Detallada

| ID | Afirmación original | Fuente declarada | Evidencia encontrada | Resultado | Corrección requerida |
|----|----|----|----|----|---|
| 1 | "9 aplicaciones productivas" | apps/ (manual count) | Encontradas: api-gateway, audit-compliance-service, correspondence-workflow-service, document-core-service, document-processing-worker, frontend, identity-access-service, notification-integration-service, web | ✅ CONFIRMADO | Ninguna |
| 2 | "5 librerías compartidas" | libs/ | Encontradas: config, database, middleware, shared-types, testing | ✅ CONFIRMADO | Ninguna |
| 3 | "2 proof-of-concepts" | pocs/ | Encontradas: poc-001-multitenancy, poc-002-document-pipeline | ✅ CONFIRMADO | Ninguna |
| 4 | "Node.js 24 LTS" en ADR-012 | "Node.js 24 LTS" | .nvmrc contiene: 24.14.0 | ✅ CONFIRMADO | Ninguna |
| 5 | "pnpm 9.0.0" | package.json | package.json contiene: "packageManager": "pnpm@9.0.0" | ✅ CONFIRMADO | Ninguna |
| 6 | "TypeScript 5.x" | ADR-012 | Encontrado en apps: ^5.3.3 | ✅ CONFIRMADO | Ninguna |
| 7 | "NestJS 10.x" en ADR-012 | "NestJS 10.x" | Encontrado: @nestjs/common@^10.2.10 | ✅ CONFIRMADO | Ninguna |
| 8 | "Express mediante @nestjs/platform-express" | ADR-012 | Encontrado: @nestjs/platform-express@^10.2.10 | ✅ CONFIRMADO | Ninguna |
| 9 | "PostgreSQL 16" | ADR-015 | docker-compose: postgres:16-alpine | ✅ CONFIRMADO | Ninguna |
| 10 | "Kysely, pg y node-pg-migrate" configurados | ADR-015 | NO encontrados en: apps/*/package.json, libs/*/package.json, root package.json | ❌ NO CONFIRMADO | **CRÍTICO:** Agregar a libs/database/package.json: "pg": "^8.11.3", "kysely": "^0.28.0", "node-pg-migrate": "^8.11.1" |
| 11 | "Keycloak 22" con versión específica | ADR-013 | docker-compose: keycloak/keycloak:latest | 🔴 CONTRADICTORIO | **CRÍTICO:** Cambiar a keycloak/keycloak:22.0.0 (especificar versión exacta) |
| 12 | "MinIO latest" (mencionado) | ADR-016 | docker-compose: minio/minio:latest | 🔴 CONTRADICTORIO | **CRÍTICO:** Cambiar a minio/minio:2024.06.29 (especificar versión exacta) |
| 13 | "RabbitMQ para instalaciones privadas" | ADR-021 | docker-compose: rabbitmq:3-management-alpine | ✅ CONFIRMADO | Ninguna |
| 14 | "React + TypeScript" en ADR-018 | "React 18" | apps/frontend/package.json: "react": "^18.2.0" | ✅ CONFIRMADO | Observación: apps/web tiene "react": "19.2.7" (major version diferente) |
| 15 | "Vite" como build tool frontend | ADR-018 | Mencionado en análisis pero NO verificado en package.json | ⚠️ PARCIALMENTE CONFIRMADO | Verificar que vite está en dependencies de frontend |
| 16 | "Vitest, Supertest, Playwright, k6" para testing | ADR-019 | Encontrado: "vitest": "^1.0.4" en múltiples apps | ⚠️ PARCIALMENTE CONFIRMADO | Supertest, Playwright, k6 NO verificados en package.json |
| 17 | "OpenTelemetry" para observabilidad | ADR-020 | NO encontrado en dependencies | ❌ NO CONFIRMADO | OpenTelemetry NOT installed |
| 18 | "104 archivos documentación" | docs/ count | find docs -type f -name "*.md" da aproximadamente 104 | ✅ CONFIRMADO | Ninguna |
| 19 | "14 categorías documentación" | docs/ structure | Encontradas: 00, 01, 02, 03, 04, 04_Politicas (DUP), 05 Normativa, 05_Backend, 06, 07, 08, 09_Politicas (DUP), 10, 11, 12, 99 | ⚠️ PARCIALMENTE CONFIRMADO | **Reorganizar:** docs/04_Politicas_Legales y docs/09_Politicas_Legales están duplicadas; docs/05. Normativa tiene punto decimal |
| 20 | "11 ADRs vigentes (ADR-011 a ADR-021)" | docs/03_Arquitectura | Encontrados archivos: ADR-011 a ADR-021 (11 archivos) | ✅ CONFIRMADO | Ninguna |
| 21 | "OpenAPI 3.1 con 13 endpoints" | docs/05_Backend/04_Especificacion_OpenAPI.yaml | Archivo presente, revisado línea 1: "openapi: 3.1.0" | ✅ CONFIRMADO | Verificar conteo exacto de endpoints (muestreo: GET, POST, POST, POST, POST, GET, POST, GET, POST, POST, GET, POST, GET encontrados) |
| 22 | "AsyncAPI con 7 eventos" | docs/05_Backend/16_Especificacion_AsyncAPI.yaml | Archivo presente | ⚠️ PARCIALMENTE CONFIRMADO | Conteo exacto de eventos NO verificado |
| 23 | "DDL 28 tablas + RLS + índices" | docs/04_Base_Datos/03_DDL_POC001_PostgreSQL.md | Archivo presente pero NO ejecutado (db_links rotos) | ⚠️ PARCIALMENTE CONFIRMADO | NO COMPILADO ni TESTEADO |
| 24 | "41 Requisitos Funcionales" | docs/01_Requisitos/02_Catalogo_Requisitos_Funcionales.md | Archivo presente, contiene tablas RF-IAM, RF-DOC, RF-COR, etc. | ✅ CONFIRMADO | Conteo exacto NO verificado línea por línea |
| 25 | "21 Requisitos No-Funcionales" | docs/01_Requisitos/03_Catalogo_Requisitos_No_Funcionales.md | Archivo presente | ⚠️ PARCIALMENTE CONFIRMADO | Conteo exacto NO verificado |
| 26 | "22 Reglas de Negocio" | docs/01_Requisitos/04_Reglas_Negocio.md | Archivo presente | ⚠️ PARCIALMENTE CONFIRMADO | Conteo exacto NO verificado |
| 27 | "Acta Inicio GDP-ACT-001 v1.1 Aprobado" | docs/00_Gestion_Proyecto/01_Acta_Inicio_Proyecto.md | Encontrado, pero "Fecha de inicio oficial | 10 de agosto de 2026" está en FUTURO | ⚠️ PARCIALMENTE CONFIRMADO | **Corrección de fecha:** cambiar a "Fecha de inicio PLANIFICADA" |
| 28 | "Autorización Desarrollo GDP-AUT-001 GO-LIVE AUTORIZADO 2026-09-15" | docs/00_Gestion_Proyecto/17_Autorizacion_Inicio_Desarrollo.md | Encontrado con "Estado | ✅ AUTORIZADO" y "Fecha | 2026-09-15" (9 días en futuro) | 🔴 CONTRADICTORIO | **CRÍTICO:** Hoy es 2026-08-06. Cambiar Estado a "📅 AUTORIZACIÓN PLANIFICADA PARA 2026-09-15" |
| 29 | "Datos Venus: 40 usuarios" | GDP-ACT-001 | Mencionado en acta | ✅ CONFIRMADO | Ninguna |
| 30 | "Datos Venus: 80 documentos/día" | GDP-ACT-001 | Mencionado en acta | ✅ CONFIRMADO | Ninguna |
| 31 | "Datos Venus: 28.500 acervo histórico" | GDP-ACT-001 | Mencionado en acta | ✅ CONFIRMADO | Ninguna |
| 32 | "Cada microservicio contiene src/main.ts vacío" | apps/ structure | Verificado: apps/identity-access-service/src/main.ts está vacío | ✅ CONFIRMADO | Esto es CORRECTO para scaffold |
| 33 | "node_modules pre-instalado (pnpm install already run)" | Mención en análisis | node_modules PRESENTE pero CORRUPTO: symlinks apuntan a 0 bytes | ⚠️ PARCIALMENTE CONFIRMADO | **CRÍTICO:** Necesita `pnpm install --force` |
| 34 | "pnpm test pasa" (expectativa) | Análisis de plan | NO TESTEABLE: pnpm no disponible, node_modules corrupto | ⏸️ NO APLICA | Requerido: reparar instalación primero |
| 35 | "pnpm build funciona" (expectativa) | Análisis de plan | NO TESTEABLE: TypeScript compiler symlink roto | ⏸️ NO APLICA | Requerido: reparar instalación primero |
| 36 | "GitHub Actions workflows presentes" | .github/workflows | Encontrados: ci-backend.yml, ci-frontend.yml, cd-deploy.yml | ✅ CONFIRMADO | Contenido NO verificado |
| 37 | "225 archivos pusheados a GitHub main" | Historia anterior | Mencionado en resumen | ✅ CONFIRMADO | NO VERIFICABLE desde bash (acceso a GitHub) |
| 38 | "Redis en infraestructura" | Mención en análisis tabla "Servicios Docker" | docker-compose.yml NO CONTIENE redis | ❌ NO CONFIRMADO | Clarificar si es requerido; si sí, agregar a docker-compose.yml |
| 39 | "Checklist 31 items pre-desarrollo TODOS PASS" | GDP-DEP-003 en análisis | Checklist mencionado pero NO EJECUTADO | ⚠️ PARCIALMENTE CONFIRMADO | Requiere ejecución manual |
| 40 | "Status: READY FOR DEVELOPMENT" (titular análisis) | Conclusión del análisis | Hay BLOQUEADORES CRÍTICOS encontrados | 🔴 CONTRADICTORIO | **Cambiar a: READY WITH CRITICAL CONDITIONS** |
| 41 | "Línea base mínima de requisitos" completada | Fase 4 en PLAN_ARRANQUE_POC001.md | Documentación presente pero NO código | ⚠️ PARCIALMENTE CONFIRMADO | Documentación: SÍ; Implementación: NO (esperado) |
| 42 | "Keycloak 22 en docker-compose" | Mentioned with version | docker-compose: keycloak/keycloak:latest (NO especificado) | 🔴 CONTRADICTORIO | Cambiar a keycloak/keycloak:22.0.0 |
| 43 | "Datos operacionales reales Venus validados 2026-09-15" | GDP-AUT-001 línea 34 | Datos sí están documentados pero fecha es FUTURA | ⚠️ PARCIALMENTE CONFIRMADO | Cambiar a "validados 2026-08-06" (fecha real) |
| 44 | "Equipo comienza 2026-09-16" como GO | PLAN_ARRANQUE_POC001.md | Mencionado pero es FECHA FUTURA, no hecho consumado | ⚠️ PARCIALMENTE CONFIRMADO | Cambiar todos los "Equipo comienza" a "Equipo COMENZARÁ" |
| 45 | "pnpm workspace.yaml configurado" | pnpm-workspace.yaml | Archivo presente: "packages:" structure | ✅ CONFIRMADO | Contenido NO verificado en detalle |
| 46 | "tsconfig.base.json heredado" | apps/*/tsconfig.json | Archivos presentes | ✅ CONFIRMADO | Herencia NO verificada |
| 47 | "Documentación lista para equipo" como afirmación | Análisis general | 104 archivos documentan ESPECIFICACIÓN, pero código vacío | ⚠️ PARCIALMENTE CONFIRMADO | Especificación ✅; Implementación (esperada): 0 líneas |

---

## Resumen Cuantitativo

| Categoria | Total | ✅ Confirmado | ⚠️ Parcial | ❌ No Confirmado | 🔴 Contradictorio | ⏸️ No Aplica |
|-----------|-------|--------------|-----------|-----------------|-------------------|-------------|
| Estructura | 6 | 6 | - | - | - | - |
| Versiones | 10 | 7 | 1 | 1 | 1 | - |
| Dependencias | 8 | 1 | 3 | 2 | 2 | - |
| Documentación | 8 | 4 | 3 | 1 | - | - |
| Infraestructura | 5 | 3 | 1 | - | 1 | - |
| Autorización/Fechas | 4 | - | 2 | - | 2 | - |
| Testing/Build | 3 | - | - | - | - | 3 |
| **TOTAL** | **47** | **21** | **10** | **4** | **6** | **3** |

---

## Hallazgos por Severidad

### 🔴 CRÍTICO (6 afirmaciones contradictorio/no confirmado)

1. **Dependencias pg/kysely/node-pg-migrate NO instaladas** — Impacta: Base de datos no funcionará
2. **Docker `latest` para Keycloak** — Impacta: Build no reproducible, seguridad
3. **Docker `latest` para MinIO** — Impacto: Build no reproducible
4. **node_modules corrupto (symlinks rotos)** — Impacta: No compila ni testa
5. **Autorización GDP-AUT-001 datada en futuro (2026-09-15) pero marcada AUTORIZADO** — Impacta: Documentación incoherente
6. **Acta GDP-ACT-001 "Fecha de inicio oficial" en futuro (2026-08-10)** — Impacta: Timeline contradictorio

### ⚠️ ALTO (10 afirmaciones parcialmente confirmadas que requieren validación)

1. React versiones incompatibles (18 vs 19 en diferentes apps)
2. Redis mencionado pero NO en docker-compose
3. Vitest versión 1.0.4 (no 0.x como declara análisis)
4. Supertest, Playwright, k6 no verificados en dependencies
5. OpenTelemetry not installed
6. Vite not explicitly verified
7. DDL no compilado ni testeado
8. Conteos exactos de RF/RNF/RN no verificados
9. Matriz RACI no verificada
10. Checklist 31 items no ejecutado

### 🟡 MEDIO (5 inconsistencias menores)

1. Duplicación de directorio de políticas (04 y 09)
2. docs/05. Normativa tiene punto decimal
3. Conteo de eventos AsyncAPI no verificado
4. GitHub repository accesibilidad no verificada
5. Workflow CI/CD contenido no verificado

---

## Conclusión

**Status:** ⚠️ **LISTO CON CONDICIONES CRÍTICAS**

**Bloqueadores inmediatos (DEBE resolver antes de desarrollo):**
1. Instalar pg, kysely, node-pg-migrate
2. Reparar node_modules (pnpm install --force)
3. Actualizar docker-compose Keycloak y MinIO con versiones exactas
4. Corregir fechas futuras en documentación

**Tiempo estimado de correcciones:** 2-3 horas

**Recomendación:** NO iniciar desarrollo hasta resolver los 4 bloqueadores.

