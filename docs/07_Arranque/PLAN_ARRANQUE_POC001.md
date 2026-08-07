# 🚀 Plan de Arranque — POC-001 + MVP

**Fecha inicio:** 2026-09-16
**Duración POC-001:** 1 semana (Sep 16-22)
**Duración POC-002:** 2 semanas (Sep 23 - Oct 13)
**Duración MVP:** 4 semanas (Oct 14 - Nov 10)
**Testing + Hardening:** 3 semanas (Nov 11-30)

---

## 📋 PRE-KICKOFF (2026-09-15)

### 1. Comunicación al Equipo

**Enviar email a equipo de desarrollo:**

```
Asunto: 🚀 Inicio POC-001 — SGD Colombia — 2026-09-16

Equipo,

Mañana iniciamos desarrollo POC-001: Multitenancy + RLS + Keycloak.

REPO: https://github.com/Escruceria/Gestion_Documental-SGD-AJE.git

SETUP (30 min):
1. git clone https://github.com/Escruceria/Gestion_Documental-SGD-AJE.git
2. cd gestion-documental
3. pnpm install
4. pnpm docker:up
5. pnpm db:migrate && pnpm db:seed
6. pnpm test  # Debe pasar

DOCUMENTACIÓN CLAVE:
- Acta: docs/00_Gestion_Proyecto/01_Acta_Inicio_Proyecto.md (v1.1)
- Autorización: docs/00_Gestion_Proyecto/17_Autorizacion_Inicio_Desarrollo.md
- Convenciones: docs/11_Despliegue_Operacion/02_Convenciones_Desarrollo.md
- Setup: docs/11_Despliegue_Operacion/03_Setup_Workspace_Checklist.md

KICKOFF MEETING: 9:00 AM
- Repaso 12-step vertical flow
- Asignación de tareas POC-001
- Q&A

¡Listos para programar!
```

### 2. Verificación Previa (Team Lead)

```bash
# En laptop fresco:
git clone https://github.com/Escruceria/Gestion_Documental-SGD-AJE.git
cd gestion-documental

# 1. Setup completo
pnpm install
pnpm docker:up -d
pnpm db:migrate
pnpm db:seed

# 2. Verificar que Docker está corriendo
docker ps | grep -E "postgres|keycloak|minio|rabbitmq"
# Debe haber 4 servicios UP

# 3. Verificar DB
psql -U dev -d sgd_dev -h localhost -c "SELECT COUNT(*) FROM organizations;"
# Debe retornar 1 (tenant Venus)

# 4. Compilar TypeScript
cd libs/shared-types && pnpm build && cd ../../

# 5. Tests
pnpm test

# ✅ Si todo pasa, LISTO PARA KICKOFF
```

---

## 📅 SEMANA 1: POC-001 (Sep 16-22)

**Objetivo:** Validar multitenancy + RLS + Keycloak en 40+ integration tests

### Día 1 (16 sep) — Kickoff + Setup Local

**Morning (9:00-12:00):**
- Reunión kickoff (30 min)
  - Repaso Acta v1.1: 40 usuarios, 80 docs/día, flujo 12-pasos
  - Explicar ADR-011 a ADR-015 (decisiones arquitectónicas)
  - Repaso Keycloak + PostgreSQL RLS
- Cada dev hace setup local (30 min)
  - Clone + pnpm install + docker-compose up
  - Verificar que pnpm test pasa
- Revisión de convenciones (30 min)
  - Hexagonal architecture (domain/app/infra/interfaces)
  - Error handling RFC 9457
  - Multitenant context

**Afternoon (14:00-17:00):**
- Crear rama feature/poc-001-multitenancy
- Implementar SetTenantMiddleware (2 devs)
- Configurar Keycloak inicial (1 dev)
- Crear primeros 10 integration tests (1 dev)

### Día 2-3 (17-18 sep) — RLS Implementation

**Implementar Row Level Security:**
- [ ] Crear 5 tablas críticas con RLS policies
  - organizations
  - users
  - documents
  - correspondences
  - audit_logs
- [ ] Crear 15 integration tests (test RLS isolation)
- [ ] Validar que usuario de tenant A no ve datos de tenant B

### Día 4-5 (19-20 sep) — Keycloak Integration

**Integrar Keycloak:**
- [ ] Setup realm "sgd"
- [ ] Crear 4 users (admin, secretaria, gestor, usuario)
- [ ] Vinculación UserId ↔ keycloak_id
- [ ] TenantContextSwitch (cambiar contexto tenant)
- [ ] 15 integration tests

### Día 6-7 (21-22 sep) — Validation + Documentation

**Validación:**
- [ ] Correr todos los 40+ integration tests
- [ ] Validar CI/CD pipeline (GitHub Actions)
- [ ] Code review entre pares
- [ ] Actualizar documentación
- [ ] Merge a develop

**Exit Criteria POC-001:**
- ✅ 40+ integration tests GREEN
- ✅ RLS validada en 5 tablas
- ✅ Keycloak integrado
- ✅ SetTenantMiddleware funcional
- ✅ 0 bloqueantes críticos
- ✅ Documentación actualizada

---

## 📅 SEMANA 2-3: POC-002 (Sep 23 - Oct 13)

**Objetivo:** Validar pipeline documental (carga → cuarentena → antivirus → storage)

### Semana 2 (Sep 23-29):
- [ ] Carga de archivos a S3/MinIO
- [ ] Cuarentena (quarantine bucket)
- [ ] Validación MIME type
- [ ] Hash SHA-256
- [ ] Antivirus mock

### Semana 3 (Sep 30 - Oct 13):
- [ ] EventBridge / RabbitMQ outbox pattern
- [ ] Procesamiento asincrónico
- [ ] 50+ documentos de prueba
- [ ] 20+ integration tests
- [ ] Error handling (retry, DLQ)

**Exit Criteria POC-002:**
- ✅ Pipeline completo funcional
- ✅ 20+ integration tests GREEN
- ✅ Manejo de errores robusto
- ✅ Documentación actualizada

---

## 📅 SEMANA 4-7: MVP Completo (Oct 14 - Nov 10)

**6 Macroservicios funcionales:**

1. **identity-access-service** (MS-01)
   - Keycloak integración
   - User management
   - Rol assignment

2. **document-core-service** (MS-02)
   - CRUD documentos
   - Series documentales
   - Versionamiento

3. **correspondence-workflow-service** (MS-03)
   - Radicación entrada/salida/internas
   - Workflow steps
   - Aprobaciones

4. **document-processing-worker** (MS-04)
   - Procesamiento asincrónico
   - Antivirus
   - OCR básico

5. **audit-compliance-service** (MS-05)
   - Event sourcing
   - Audit logs
   - Compliance reporting

6. **notification-integration-service** (MS-06)
   - Email notifications
   - Webhooks
   - Event publishing

**Frontend React:**
- Dashboard
- Document management UI
- Correspondence workflow UI
- Search interface

---

## 📅 SEMANA 8-10: Testing + Hardening (Nov 11-30)

- [ ] Unit tests (60%)
- [ ] Integration tests (25%)
- [ ] E2E tests (10%)
- [ ] Security testing (OWASP ZAP)
- [ ] Performance testing (k6: 80 docs/día)
- [ ] Bug fixes
- [ ] Documentation finalization

**Exit Criteria MVP:**
- ✅ 100% flujo vertical implementado
- ✅ 95%+ test coverage
- ✅ 0 bloqueantes críticos
- ✅ Performance benchmarks cumplidos
- ✅ Documentación completa
- ✅ Listo para STAGING

---

## 🎯 Verificaciones Clave

### Diarias (Team Lead)
```bash
# En cada fin de día:
git log --oneline -10  # Últimos 10 commits
pnpm test              # Todos los tests
pnpm lint              # Linter
pnpm build             # Build completo
```

### Semanales (Equipo)
- [ ] Standup 30 min (lunes-viernes, 9:00 AM)
- [ ] Code review pares
- [ ] Merge develop a main (viernes)
- [ ] Actualizar documentación

### Gate POC-001 (Sep 22)
- [ ] 40+ integration tests ✅
- [ ] RLS validada ✅
- [ ] CI/CD GREEN ✅
- [ ] Documentación actualizada ✅
- [ ] Aprobación Product Owner

### Gate MVP (Nov 10)
- [ ] 6 macroservicios funcionales ✅
- [ ] 95%+ test coverage ✅
- [ ] Performance benchmarks ✅
- [ ] Documentación completa ✅
- [ ] Aprobación Product Owner
- [ ] **READY FOR STAGING**

---

## 📊 Dashboard Seguimiento

| Semana | Objetivo | Status | Tests | Docs |
|--------|----------|--------|-------|------|
| 1 (16-22) | POC-001 Multitenancy | 🔄 | 40+ | ✅ |
| 2-3 (23-13) | POC-002 Pipeline | 🔄 | 20+ | ✅ |
| 4-7 (14-10) | MVP 6 MS | 🔄 | 95%+ | ✅ |
| 8-10 (11-30) | Testing + Hardening | 🔄 | 100% | ✅ |

---

## 📞 Contactos Clave

| Rol | Nombre | Email | Teléfono |
|-----|--------|-------|----------|
| Patrocinador | Wilmar Betancur Valencia | [PATROCINADOR] | [PHONE] |
| Product Owner | Álvaro Patiño Cruz | alvaropatcruz10@gmail.com | [PHONE] |
| Arquitecto | Antonio José Escrucería | antoniojoseescruceria@gmail.com | [PHONE] |
| Team Lead Dev | [LIDER_DESARROLLO] | [EMAIL] | [PHONE] |
| QA Lead | Neffer Anais Martínez | [EMAIL] | [PHONE] |

---

## 🚀 Go/No-Go Decision

**Antes de 2026-09-16, validar:**

- [ ] Equipo completó setup local ✅
- [ ] Todos los servicios Docker están UP ✅
- [ ] pnpm test pasa 100% ✅
- [ ] GitHub repo accesible ✅
- [ ] Documentación leída y entendida ✅
- [ ] Roles y responsabilidades asignados ✅

**Si TODO está ✅ → GO FOR POC-001** 🚀

---

## 📚 Documentación de Referencia

**Lectura OBLIGATORIA (primeros 2 días):**
1. `docs/00_Gestion_Proyecto/01_Acta_Inicio_Proyecto.md` — Acta v1.1
2. `docs/00_Gestion_Proyecto/17_Autorizacion_Inicio_Desarrollo.md` — Autorización
3. `docs/03_Arquitectura/ADR-011_*.md` a `ADR-015_*.md` — Decisiones arquitectónicas
4. `docs/11_Despliegue_Operacion/02_Convenciones_Desarrollo.md` — Estándares de código
5. `docs/04_Base_Datos/02_Modelo_Multitenant_RLS.md` — RLS strategy

**De Referencia (durante desarrollo):**
- `docs/05_Backend/02_TypeScript_Interfaces_POC001.md` — Tipos de dominio
- `docs/04_Base_Datos/03_DDL_POC001_PostgreSQL.md` — Esquema BD
- `docs/10_Pruebas/01_Plan_Testing_Layers.md` — Estrategia testing

---

## 🎯 Resumen Ejecutivo

**Timeline Completo:**
- **Sep 16-22:** POC-001 (Multitenancy + RLS + Keycloak)
- **Sep 23 - Oct 13:** POC-002 (Pipeline documental)
- **Oct 14 - Nov 10:** MVP (6 macroservicios funcionales)
- **Nov 11-30:** Testing + Hardening
- **Dic 1-31:** STAGING (UAT con Venus)
- **Ene 1:** 🚀 **GO-LIVE PRODUCCIÓN**

**Equipo:** ~4-5 desarrolladores
**Stack:** Node.js 24, TypeScript, NestJS, React, PostgreSQL, Keycloak
**Repo:** https://github.com/Escruceria/gestion_documental.git
**Status:** ✅ **READY TO SHIP**

---

**¡A programar! 🚀**
