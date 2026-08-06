# Autorización de Inicio — Desarrollo POC-001 + MVP

| Campo | Valor |
|---|---|
| Código | GDP-AUT-001 |
| Versión | 1.0 |
| Estado | **✅ AUTORIZADO** |
| Fecha | 2026-09-15 |
| Autorizado por | Wilmar Betancur Valencia (Patrocinador) |
| Validado por | Antonio José Escrucería Uribe (Arquitecto) |
| Aprobado por | Álvaro Patiño Cruz (Product Owner) |

---

## Propósito

Formalizar la **AUTORIZACIÓN INMEDIATA** del inicio de desarrollo POC-001 y MVP del Sistema de Gestión Documental, basado en validación completa de:
- ✅ Análisis de requisitos
- ✅ Especificación técnica
- ✅ Datos reales Venus
- ✅ Infraestructura scaffold
- ✅ Convenciones desarrollo
- ✅ Plan testing

---

## Validación Previa (100% Completada)

### 1. Información de Entrada ✅

| Aspecto | Documento | Estado |
|---------|-----------|--------|
| **Análisis AS-IS Venus** | GDP-ANA-001 a 005 | ✅ Aprobado v1.0 |
| **Datos Operacionales Reales** | GDP-ACT-001 v1.1 + GDP-CHK-001 | ✅ Validado 2026-09-15 |
| **Requisitos Funcionales** | GDP-REQ-002 (41 RF) | ✅ Aprobado v1.0 |
| **Requisitos No Funcionales** | GDP-REQ-003 (21 RNF) | ✅ Aprobado v1.0 |
| **Reglas de Negocio** | GDP-REQ-004 (22 RN) | ✅ Aprobado v1.0 |
| **Modelos Datos Conceptual** | GDP-DAT-001 | ✅ Aprobado v1.0 |
| **Modelo Multitenant RLS** | GDP-DAT-002 | ✅ Aprobado v1.0 |
| **Vistas C4** | GDP-ARQ-003, 004, 005 | ✅ Aprobado v1.0 |
| **Arquitectura Detallada** | GDP-ARQ-015 (amenazas) | ✅ Aprobado v1.0 |
| **ADRs Técnicas** | ADR-011 a ADR-021 | ✅ Aprobadas |

### 2. Especificación Técnica ✅

| Documento | Componentes | Status |
|-----------|-------------|--------|
| **Workspace (GDP-DEP-001)** | Monorepo 6 MS + frontend + libs | ✅ Scaffolded |
| **Convenciones (GDP-DEP-002)** | Hexagonal, error handling, multitenant, eventos | ✅ Documentadas |
| **Setup (GDP-DEP-003)** | Checklist 31 items, scripts, troubleshooting | ✅ Reproducible |
| **DDL PostgreSQL (GDP-DAT-003)** | 28 tablas, RLS, índices, constraints | ✅ Validado SQL |
| **TypeScript Interfaces (GDP-BKD-002)** | Branded types, DTOs, eventos, errores RFC 9457 | ✅ Type-safe |
| **OpenAPI 3.1 (GDP-BKD-001)** | 13 endpoints flujo vertical 12-pasos | ✅ Contracts definidos |
| **Seeds Datos (GDP-DAT-004)** | 4 usuarios + 4 series + 10 documentos | ✅ Reproducibles |
| **Plan Testing (GDP-TST-001, 002)** | Pirámide 60-25-10-5, gates POC, k6 scenarios | ✅ Definido |

### 3. Validación Técnica Fase 4 ✅

| Rubro | Validación | Status |
|-------|-----------|--------|
| **Estructura workspace** | 28/28 criterios verificados | ✅ VÁLIDO |
| **CI/CD pipeline** | GitHub Actions workflows | ✅ VÁLIDO |
| **Docker-compose local** | 4 servicios (DB, Keycloak, MinIO, RabbitMQ) | ✅ VÁLIDO |
| **Arquitectura hexagonal** | Ejemplos capas domain/app/infra/interface | ✅ VÁLIDO |
| **Error handling** | RFC 9457 ProblemDetail + GlobalExceptionFilter | ✅ VÁLIDO |
| **Multitenant context** | SetTenantMiddleware + RLS policies | ✅ VÁLIDO |
| **RLS en 28 tablas** | Policies + indexed lookups | ✅ VÁLIDO |
| **Índices performance** | Composite, full-text, hash, keycloak_id | ✅ VÁLIDO |
| **DTO ↔ DDL alignment** | 7 DTOs mapeados a tablas | ✅ VÁLIDO |
| **Eventos dominio** | 7 eventos + type union AllDomainEvents | ✅ VÁLIDO |
| **Checklist pre-desarrollo** | 31 items verificables | ✅ VÁLIDO |

**Resultado:** ✅ **100% VALIDACIÓN TÉCNICA EXITOSA**

### 4. Datos Reales Venus ✅

| Métrica | Real | Validado |
|---------|------|----------|
| Usuarios activos | 40 (35 + 5 externos) | ✅ |
| Documentos/día | 80 (vs. 1.000 asumido) | ✅ |
| Radicaciones/día | 49 (23 entrada, 16 salida, 10 internas) | ✅ |
| Acervo histórico | 28.500 documentos | ✅ |
| Tamaño promedio | 1.8 MB | ✅ |
| Expedientes abiertos | 420 | ✅ |
| SLA/RPO/RTO | 99.5% / 4h / 8h | ✅ |
| Crecimiento anual | 20-25% (vs. 30% asumido) | ✅ |

**Fuente:** Formulario completado 15-09-2026, aprobado por Wilmar Betancur Valencia

---

## Alcance Autorizado

### ✅ AUTORIZADO AHORA (2026-09-16)

**POC-001 + POC-002 + MVP COMPLETO**
- Desarrollo en ambiente DEV (ficticios)
- 6 macroservicios: identity-access, document-core, correspondence-workflow, document-processing, audit-compliance, notification-integration
- Frontend React + Vite
- PostgreSQL con RLS multitenancy
- Keycloak OIDC/OAuth2/PKCE
- AWS SQS / RabbitMQ messaging
- S3 / MinIO almacenamiento
- OpenTelemetry observability
- Vitest + Supertest + Playwright testing
- OWASP ZAP security scanning

**Flujo vertical 12-pasos:**
1. Crear organización (tenant)
2. Invitar usuario
3. Vincular identidad Keycloak
4. Cambiar contexto tenant
5. Crear documento
6. Solicitar carga archivo
7. Confirmar carga + validación
8. Procesar archivo (antivirus + MIME + hash)
9. Registrar versión
10. Crear expediente
11. Radicar comunicación entrada
12. Registrar auditoría + eventos

---

## Restricciones y Condiciones

### 🔴 Restricciones de DEV

- ❌ **NO datos reales de Venus** — 100% ficticios anonimizados
- ❌ **NO conexión a Keycloak Venus** — Mock o Keycloak local
- ❌ **NO migración acervo histórico** — Fases posteriores
- ❌ **NO acceso BD Venus** — Ambiente aislado

### 🟡 Bloqueantes para STAGING (Diciembre)

Antes de llevar a datos reales, resolver en paralelo:

| Bloqueante | Responsable | Plazo | Impacto |
|---|---|---|---|
| **DPIA formal LSRPD** | Álvaro Patiño + Legal | 2026-09-30 | Privacidad |
| **Tablas retención formalizadas** | Archivista | 2026-10-15 | Disposición documentos |
| **Auditoría almacenamiento** | IT Venus | 2026-10-31 | Seguridad datos |
| **Contrato SLA + privacidad** | Legal | 2026-10-31 | Operacional |

**Estos NO bloquean DEV, pero SÍ bloquean STAGING + PRODUCCIÓN.**

---

## Cronograma Autorizado

```
SEP 2026
  16 ├─ 🚀 INICIO DESARROLLO POC-001 (DEV ficticios)
  23 ├─ Paralelo: DPIA + Retención
  30 ├─ DPIA deadline

OCT 2026
  14 ├─ POC-002 completado
  15 ├─ Tablas retención finalizadas
  31 ├─ Auditoría almacenamiento

NOV 2026
  10 ├─ MVP COMPLETO (DEV ficticios)
  30 ├─ Testing + hardening final

DIC 2026
  01 ├─ STAGING ABIERTO (datos reales Venus)
  31 ├─ UAT Venus completada

ENE 2027
  01 ├─ 🎯 GO-LIVE PRODUCCIÓN
```

---

## Equipo de Desarrollo Autorizado

**Responsable técnico:** Antonio José Escrucería Uribe (Arquitecto)

**Equipo sugerido:**
- Backend (NestJS): 2-3 desarrolladores
- Frontend (React): 1-2 desarrolladores
- QA/Testing: 1 QA engineer
- DevOps/Infra: 1 DevOps engineer
- Product Owner: Álvaro Patiño Cruz
- Scrum Master: [Designar]

---

## Qué Puede Empezar el Equipo AHORA

### ✅ Inmediato (Próximos 2 días)

1. **Setup ambiente local:**
   ```bash
   git clone repo
   pnpm install --frozen-lockfile
   docker-compose up -d
   pnpm db:migrate
   pnpm db:seed
   ```

2. **Verificar checklist pre-desarrollo (GDP-DEP-003):**
   - [ ] Node 24 LTS instalado
   - [ ] pnpm instalado
   - [ ] Docker + Docker-compose running
   - [ ] PostgreSQL 16 up
   - [ ] Keycloak accessible http://localhost:8080
   - [ ] MinIO accessible http://localhost:9000
   - [ ] RabbitMQ accessible http://localhost:15672

3. **Compilar y verificar:**
   ```bash
   cd libs/shared-types && tsc --noEmit
   pnpm lint
   pnpm test
   ```

### ✅ Semana 1 (Sep 16-22): POC-001 Multitenancy

- Implementar `SetTenantMiddleware` (extraer tenant de JWT)
- Validar RLS en 5 tablas críticas (organizations, users, documents, correspondences, audit_logs)
- 40+ integration tests RLS
- Keycloak integración básica (user create, login, tenant switch)

### ✅ Semana 2-4 (Sep 23 - Oct 13): POC-002 Documental

- Carga archivo a S3/MinIO + quarantine
- Antivirus mock + validación MIME
- EventBridge / RabbitMQ outbox pattern
- 50 documentos ficticios + testing

### ✅ Semana 5-8 (Oct 14 - Nov 10): MVP Completo

- 6 macroservicios funcionales
- 13 endpoints OpenAPI
- Búsqueda full-text
- Radicación + expedientes
- Auditoría completa

---

## Criterio de Éxito

**Go-live POC-001 exitoso si:**
- ✅ RLS validada (40+ tests)
- ✅ Multitenancy funcionando
- ✅ Keycloak integrado
- ✅ Flujo 12-pasos validado end-to-end
- ✅ CI/CD GREEN
- ✅ 0 bloqueantes críticos

**Go-live MVP completado si:**
- ✅ 6 macroservicios funcionales
- ✅ 100% requisitos funcionales implementados
- ✅ Testing: 60% unit, 25% integration, 10% e2e, 5% security
- ✅ Documentación developers completa
- ✅ Performance benchmarks cumplidos (80 docs/día)

**Go-live STAGING si:**
- ✅ MVP 100% funcional
- ✅ DPIA + retención + auditoría listos
- ✅ Venus ejecuta UAT con 28.500 documentos reales
- ✅ 95% funcionalidad operativa validada

---

## Recursos Disponibles

### Documentación completa:

```
✅ docs/00_Gestion_Proyecto/ — Gobierno completo
✅ docs/02_Analisis/ — Análisis AS-IS Venus + validación
✅ docs/03_Arquitectura/ — Modelos C4 + ADRs + amenazas
✅ docs/04_Base_Datos/ — DDL + modelo multitenant + seeds
✅ docs/05_Backend/ — OpenAPI + TypeScript interfaces + convenciones
✅ docs/10_Pruebas/ — Estrategia testing + gates + casos
✅ docs/11_Despliegue/ — Workspace + setup checklist + validación
```

### Código scaffold:

```
✅ apps/identity-access-service/ — Keycloak + RLS setup
✅ apps/document-core-service/ — Entidades documento
✅ apps/correspondence-workflow-service/ — Radicación workflow
✅ apps/document-processing-worker/ — Antivirus + MIME + hash
✅ apps/audit-compliance-service/ — Auditoría + eventos
✅ apps/notification-integration-service/ — Notificaciones
✅ apps/frontend/ — React + Vite scaffold
✅ libs/shared-types/ — TypeScript interfaces
✅ libs/database/ — DDL + seeds + migrations
✅ infra/ — Docker-compose + GitHub Actions
```

---

## Decisión Final

**POR ESTE ACTO SE AUTORIZA:**

✅ **Inicio inmediato desarrollo POC-001 + MVP**
✅ **Equipo comienza 2026-09-16**
✅ **Ambiente DEV con datos ficticios (sin restricciones LSRPD)**
✅ **Bloqueantes privacidad se resuelven en paralelo (Dic 2026)**
✅ **STAGING + PRODUCCIÓN después validación Diciembre**

---

## Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| **Patrocinador** | Wilmar Betancur Valencia | _________________ | _________ |
| **Product Owner** | Álvaro Patiño Cruz | _________________ | _________ |
| **Arquitecto** | Antonio José Escrucería Uribe | _________________ | _________ |
| **QA Lead** | Neffer Anais Martínez | _________________ | _________ |

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-09-15 | **AUTORIZACIÓN GO-LIVE DESARROLLO:** 100% validación completada, especificación técnica lista, datos reales Venus validados. Autorizado inicio POC-001 + MVP 2026-09-16 con datos ficticios. | Antonio José Escrucería Uribe |
