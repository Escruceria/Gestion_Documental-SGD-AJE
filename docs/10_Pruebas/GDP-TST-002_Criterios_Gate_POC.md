# Criterios Gate POC-001 y POC-002

| Campo | Valor |
|---|---|
| Código | GDP-TST-002 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 3-A3) |
| Fecha | 2026-08-05 |
| Propietario | David Ernesto Antequera Martínez (Líder QA) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), Álvaro Patiño Cruz (PO) |
| Aplicable | Validación POC antes de MVP |

---

## Resumen ejecutivo

**POC-001 (Multitenancy, RLS, Keycloak) — 2026-09-30**

6 macroservicios × 3 escenarios críticos × 4 capas testing = **Go to POC-002**

**POC-002 (Carga documental, antivirus, outbox) — 2026-11-30**

Document pipeline × 2 workers × Event bus = **Go to MVP Development**

---

## POC-001: Multitenancy, RLS, Keycloak

**Objetivo:** Validar aislamiento multitenant bajo cualquier circunstancia.

### Escenarios críticos POC-001

| # | Escenario | Caso de uso Venus | Gate ID | Pass Criteria |
|---|---|---|---|---|
| 1 | User Venus login → JWT válido → permisos cargados | Loguearse como secretaria Venus | G-AUTH | Token validado, permisos en JWT |
| 2 | Crear organización Venus + invitar 5 usuarios | Setup inicial pilot | G-ORG-SETUP | Org creada, 5 users invited, emails enviados |
| 3 | User A (Secretaria Venus) radicar entrada, NO acceder a datos Usuario B | Radicación separada | G-TENANT-ISO | RLS bloquea lectura cross-tenant (0/1000) |
| 4 | Cambiar contexto tenant (si multi-tenant) | N/A Venus (1 tenant) | G-TENANT-SWITCH | Contexto aislado, auditoría 100% |
| 5 | Intentar bypass: Forzar tenant_id en URL | Ataque security | G-SECURITY-BYPASS | RLS lo bloquea, 403 Forbidden |
| 6 | Audit log de cada operación | Trazabilidad | G-AUDIT-COMPLETE | 100% de cambios logged, inmutables |

### Checklist POC-001

**Pre-requisitos (Antes 2026-09-01):**
- [ ] identity-access-service código 100% funcional
- [ ] document-core-service configuración básica
- [ ] PostgreSQL RLS policies implementadas
- [ ] Keycloak integrado (mock o real)
- [ ] CI/CD pipeline ready (tests + build)

**Testing POC-001 (2026-09-01 a 2026-09-28):**
- [ ] 40+ unit tests (domain IAM layer) — cobertura >90%
- [ ] 20+ integration tests (RLS, permissions, audit) — Testcontainers
- [ ] 5+ E2E tests (critical journeys) — Playwright
- [ ] 1x OWASP ZAP scan (baseline) — 0 críticos
- [ ] Performance baseline (login <2s)

**Decision Gate (2026-09-30):**

| Criterio | Target | Status | Owner |
|---|---|---|---|
| Unit tests all pass | 100% | __ | David |
| Integration tests all pass | 100% | __ | David |
| E2E critical paths | 100% | __ | David |
| RLS tenant isolation | 0 leaks / 1000 attacks | __ | Óscar (Security) |
| Audit trail complete | 100% logged | __ | Álvaro (Data) |
| Performance (p95 latency) | <2s login, <1s perms | __ | David |
| Security scan clean | 0 críticos, <5 medios | __ | Óscar |
| **GO TO POC-002** | **Todos ✅** | **__** | **Antonio (Arch)** |

**If any ❌:** Root cause analysis → remediation → re-test (loop hasta ✅)

---

## POC-002: Carga Documental, Antivirus, Outbox

**Objetivo:** Validar pipeline de documentos (cuarentena → procesamiento → integración eventos).

### Escenarios críticos POC-002

| # | Escenario | Caso de uso Venus | Gate ID | Pass Criteria |
|---|---|---|---|---|
| 1 | Subir PDF 1MB (radicación entrada) | Usuario radicar con adjunto | G-UPLOAD-PDF | Archivo en cuarentena, hash SHA-256 OK |
| 2 | Antivirus scan (mock) retorna clean | Seguridad documento | G-ANTIVIRUS-CLEAN | scan_result = clean, archivo permitido |
| 3 | Intentar subir .exe (virus mock) | Detección malware | G-ANTIVIRUS-BLOCKED | scan_result = infected, archivo bloqueado, movido a quarantine |
| 4 | Completar carga, generar presigned URL | Disponibilizar documento | G-FILE-AVAILABLE | S3 URL firmada, acceso verificado |
| 5 | Reintento idempotente (mismo hash) | Reconexión durante carga | G-IDEMPOTENCY | 1 documento, sin duplicación |
| 6 | Evento DocumentUploadCompleted publicado | Event-driven integration | G-OUTBOX-EVENT | Evento en outbox, consumido por MS-05 |
| 7 | Auditoría: 5+ eventos por carga | Trazabilidad completa | G-AUDIT-UPLOAD | upload_requested, upload_confirmed, scan_result, ocr_started, audit_logged |
| 8 | Carga masiva 100 concurrentes | Performance | G-LOAD-TEST-UPLOADS | p95 <3s, sin errores |
| 9 | Archivo >50MB (streaming) | Grandes documentos | G-LARGE-FILE | Completed sin OOM, en background |
| 10 | OCR async (mock) sin bloquear respuesta | Procesamiento asíncrono | G-OCR-ASYNC | Response inmediata, OCR en worker |

### Checklist POC-002

**Pre-requisitos (Antes 2026-10-01, POST POC-001):**
- [ ] POC-001 100% ✅ aprobado
- [ ] document-processing-worker implementado
- [ ] S3/MinIO configurado (local o AWS)
- [ ] EventBridge/SQS o RabbitMQ ready
- [ ] Antivirus mock integrado (ClamAV mock o similar)
- [ ] Outbox/Inbox implementado

**Testing POC-002 (2026-10-01 a 2026-11-28):**
- [ ] 30+ unit tests (PDF parsing, hash calc, antivirus logic) — Vitest
- [ ] 25+ integration tests (upload flow, S3 API, event publishing) — Testcontainers
- [ ] 5+ E2E tests (usuario upload, virus detection, OCR) — Playwright
- [ ] 1x OWASP ZAP scan (file upload scenarios) — 0 críticos
- [ ] 1x k6 load test (100 uploads/sec sustained)

**Decision Gate (2026-11-30):**

| Criterio | Target | Status | Owner |
|---|---|---|---|
| Upload multipart working | 100% | __ | David |
| Quarantine system functional | 100% files quarantined | __ | David |
| Antivirus mock integrated | Clean + Infected detection | __ | David |
| Hash verification working | 100% integrity OK | __ | David |
| Idempotency preventing duplicates | 0 duplicates / 1000 retries | __ | David |
| Event bus publishing | 100% events queued | __ | Antonio (Arch) |
| Audit trail complete | 5+ events per upload | __ | Álvaro (Data) |
| OCR async (mock) working | Response <2s, OCR in background | __ | David |
| Load test passing | 100 uploads/sec, p95 <3s | __ | David |
| Security scan clean | 0 críticos, <5 medios | __ | Óscar |
| **GO TO MVP DEVELOPMENT** | **Todos ✅** | **__** | **Antonio (Arch)** |

---

## Métricas clave por fase

### POC-001 (Sep 30)

| Métrica | Target | Medición |
|---|---|---|
| Test coverage | >85% (domain) | Vitest coverage report |
| RLS isolation | 0 leaks / 1000 attempts | Integration test matrix |
| Audit completeness | 100% events logged | Query audit_logs count |
| Performance | p95 <2s, p99 <5s | k6 summary stats |
| Security risks | 0 críticos, <5 medios | ZAP scan report |

### POC-002 (Nov 30)

| Métrica | Target | Medición |
|---|---|---|
| Test coverage | >80% (pipeline) | Vitest coverage report |
| Upload success rate | 99.9% | Supertest / E2E results |
| Idempotency | 0 duplicates | Database query row counts |
| Event delivery | 100% delivered | Outbox / consumed events count |
| Audit completeness | 5+ events/upload | Query audit_logs count by entity |
| Performance | 100 uploads/sec, p95 <3s | k6 summary stats |
| Security risks | 0 críticos, <5 medios | ZAP scan report |

---

## Entregables por POC

### POC-001 (2026-09-30)

**Código:**
- [ ] identity-access-service (prod-ready)
- [ ] document-core-service (basic read/write)
- [ ] PostgreSQL RLS policies (tested)
- [ ] Keycloak integration
- [ ] JWT validation middleware

**Tests:**
- [ ] Unit test report (>85% coverage)
- [ ] Integration test report (all pass)
- [ ] E2E test report (critical journeys pass)
- [ ] OWASP ZAP baseline report
- [ ] k6 performance report

**Documentación:**
- [ ] API endpoints documented (Swagger UI)
- [ ] Deployment runbook
- [ ] Troubleshooting guide
- [ ] Security checklist (signed-off)

### POC-002 (2026-11-30)

**Código:**
- [ ] document-processing-worker (full pipeline)
- [ ] S3/MinIO integration (proven)
- [ ] Antivirus integration (mock)
- [ ] Outbox/Inbox (event delivery)
- [ ] OCR integration (async mock)

**Tests:**
- [ ] Unit test report (>80% coverage)
- [ ] Integration test report (all pass)
- [ ] E2E test report (upload journeys pass)
- [ ] OWASP ZAP file-upload report
- [ ] k6 load test report (100 uploads/sec)
- [ ] Idempotency test matrix

**Documentación:**
- [ ] File upload API documented (Swagger UI)
- [ ] Event schema documented (AsyncAPI)
- [ ] Disaster recovery runbook (restore from S3)
- [ ] Performance tuning guide
- [ ] Security checklist (signed-off)

---

## Riesgos POC

| Riesgo | Probabilidad | Impacto | Mitigation |
|---|---|---|---|
| RLS policies incorrectas (leaks) | Media | Crítico | 40+ integration tests, ZAP scan |
| Keycloak integration delays | Baja | Moderado | Mock JWT token si Keycloak tarda |
| S3/MinIO setup issues | Baja | Moderado | MinIO local first, AWS depois |
| Antivirus latency | Media | Moderado | Mock antivirus POC-002, real después |
| Performance not meeting thresholds | Media | Moderado | k6 early, indexing optimization |
| Event bus not scaling | Baja | Moderado | Load testing, queue tuning |

**Escalation:** Si algún riesgo se materializa → revisar con Comité Arquitectura, ajustar criterios si es necesario

---

## Aprobación final

**Comité Arquitectura (es decir, yo mismo :))**

POC-001 Go Decision: _____________________ (Firma Antonio)
POC-002 Go Decision: _____________________ (Firma Antonio)

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Criterios gate POC-001/002, checklist, métricas, entregables, riesgos. | David Ernesto Antequera Martínez |
