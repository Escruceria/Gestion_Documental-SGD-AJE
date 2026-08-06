# 📋 Decisiones Pendientes de Línea Base

**Documento:** Decisiones que bloquean cambios de versiones  
**Fecha:** 2026-08-06 22:15 America/Bogota  
**Estado:** PROPUESTO  
**Responsable de aprobación:** Arquitecto (Antonio José Escrucería Uribe)

---

## Tabla de Decisiones

| ID | Decisión | Alternativas | Recomendación Actual | Impacto | Aprobador | Estado |
|----|----------|--------------|---------------------|---------|-----------|--------|
| **DEC-BL-001** | PostgreSQL: ¿16 o 18.4? | Mantener 16 / Actualizar a 18.4 | Por determinar | DDL, volúmenes, CI, soporte | Arquitecto | PENDIENTE |
| **DEC-BL-002** | NestJS: ¿10.2.10 o 11.1.28? | Mantener 10 / Actualizar a 11 | Por determinar | Backend, API, dependencias | Arquitecto | PENDIENTE |
| **DEC-BL-003** | TypeScript: ¿5.3.3 o 7.0.2? | Mantener 5 / Actualizar a 7 | Por determinar | Compilación, types | Arquitecto | PENDIENTE |
| **DEC-BL-004** | React: ¿Unificar 18 o 19? | Mantener 18 en frontend / Unificar a 19 | Por determinar | Frontend, compatibilidad | Arquitecto | PENDIENTE |
| **DEC-BL-005** | RabbitMQ: ¿3.x o 4.3.2? | Mantener 3 / Actualizar a 4 | Por determinar | Mensajería, quorum, confirms | Arquitecto | PENDIENTE |
| **DEC-BL-006** | Redis en POC-001: ¿Sí/No/Fase 2? | Agregar / No incluir / Posponer | Por determinar | Infraestructura, caching | Arquitecto | PENDIENTE |
| **DEC-BL-007** | Vitest: ¿1.0.4 o 4.1.10? | Mantener 1 / Actualizar a 4 | RECOMENDACIÓN: Mantener 1 (riesgo bajo) | Testing, compatibilidad | QA Lead | PENDIENTE |
| **DEC-BL-008** | Supertest: ¿Instalar 7.2.2? | Sí / No / Posponer | RECOMENDACIÓN: Sí (obligatorio) | Testing HTTP | QA Lead | PENDIENTE |

---

## Contexto de Cada Decisión

### DEC-BL-001: PostgreSQL 16 vs 18.4

**Análisis:**
- Actual: `postgres:16-alpine` (sin digest)
- Catálogo maestro: PostgreSQL 18.4 (baseline candidato)
- PostgreSQL 16 vs 18: cambio de versión mayor

**Implicaciones:**
- ❌ DDL en docs/04_Base_Datos probablemente escrito para 16
- ❌ Volúmenes, backups pueden tener incompatibilidades
- ❌ Ciertos tipos de datos o funciones pueden diferir
- ✅ PostgreSQL 18 tiene mejor performance y features

**Recomendación:** Documentación y análisis de cambios requieren validación antes de upgradear

---

### DEC-BL-002: NestJS 10 vs 11

**Análisis:**
- Actual: `@nestjs/common` 10.2.10
- Catálogo maestro: 11.1.28 (baseline candidato)
- Cambio major: impacto en decoradores, pipes, guards, interceptors

**Implicaciones:**
- ❌ Requiere validación completa de código existente
- ❌ Dependencias transitivas pueden cambiar
- ✅ NestJS 11 tiene mejor soporte, más reciente
- ❌ No hay código productivo aún; riesgo bajo para POC-001

**Recomendación:** Mantener NestJS 10 para POC-001, evaluar upgrade después

---

### DEC-BL-003: TypeScript 5.3.3 vs 7.0.2

**Análisis:**
- Actual: TypeScript 5.3.3 (instalado)
- Catálogo maestro: 7.0.2 (baseline candidato)
- Cambio major: compilador, tipos, decoradores

**Implicaciones:**
- ❌ Catálogo advierte: "debe compilar decoradores, metadata, NestJS, Kysely, Vite"
- ❌ Sin validación completa
- ✅ TypeScript 7 es más nuevo, mejor type checking
- ⚠️ Potencial breaking changes

**Recomendación:** Mantener TypeScript 5.3 para POC-001, validar 7.0 después

---

### DEC-BL-004: React 18 vs 19

**Análisis:**
- apps/frontend: React 18.2.0
- apps/web: React 19.2.7
- Catálogo maestro: React 19.2.7 (baseline candidato)

**Implicaciones:**
- ⚠️ Inconsistencia en monorepo
- ❌ Potencial issues con peer dependencies
- ✅ React 19 es más reciente
- ❌ Sin validación de compatibilidad

**Recomendación:** Análisis de peer dependencies antes de unifcar

---

### DEC-BL-005: RabbitMQ 3 vs 4

**Análisis:**
- Actual: `rabbitmq:3-management-alpine`
- Catálogo maestro: 4.3.2 (baseline candidato)
- Cambio major: quorum queues, confirms, DLQ, rolling upgrades

**Implicaciones:**
- ❌ ADR-014 requiere validación de cambios importantes
- ❌ Puede afectar implementación de outbox/inbox
- ✅ RabbitMQ 4 es más robusto
- ⚠️ Requiere testing completo

**Recomendación:** Mantener RabbitMQ 3 para POC-001, evaluar 4 después

---

### DEC-BL-006: Redis en POC-001

**Análisis:**
- Actual: NO incluido en docker-compose.yml
- Análisis anterior mencionó Redis 7
- Catálogo maestro: Redis no listado (posible omisión)

**Implicaciones:**
- ❌ No hay evidencia de que sea obligatorio para POC-001
- ✅ Si no se necesita, no incluirlo (YAGNI)
- ⚠️ Si se necesita luego, agregarlo es simple

**Recomendación:** NO incluir en POC-001; documentar para Fase 2 si aplica

---

### DEC-BL-007: Vitest 1.0.4 vs 4.1.10

**Análisis:**
- Actual: vitest 1.0.4 (instalado)
- Catálogo maestro: 4.1.10 (baseline candidato)
- Cambio major: cambios en API, reporters, config

**Implicaciones:**
- ⚠️ Versión 1 es funcional pero vieja
- ✅ Versión 4 tiene mejor estabilidad
- ❌ Requiere validación de compatibilidad con suite actual
- 🟢 BAJO RIESGO para POC-001 (no hay tests aún)

**Recomendación:** Mantener Vitest 1.0.4 (funciona), upgradear después de POC

---

### DEC-BL-008: Supertest 7.2.2

**Análisis:**
- Actual: NO instalado
- Catálogo maestro: 7.2.2 (baseline candidato)
- Necesidad: Testing HTTP endpoints es obligatorio

**Implicaciones:**
- 🔴 CRÍTICO: Sin Supertest no se pueden testear endpoints REST
- ✅ Supertest es fundamental para ADR-019 (testing)
- 🟢 BAJO RIESGO: Simple instalación de nueva librería

**Recomendación:** INSTALAR Supertest 7.2.2 (obligatorio)

---

## Gates de Decisión

Para proceder con saneamiento:

### Requisito 1: Decisiones Aprobadas
```
DEC-BL-001: [ ] APROBADA
DEC-BL-002: [ ] APROBADA
DEC-BL-003: [ ] APROBADA
DEC-BL-004: [ ] APROBADA
DEC-BL-005: [ ] APROBADA
DEC-BL-006: [ ] APROBADA
DEC-BL-007: [ ] APROBADA (Recomendación: MANTENER)
DEC-BL-008: [ ] APROBADA (Recomendación: INSTALAR)
```

### Requisito 2: Firmas
```
Arquitecto (Antonio José Escrucería): ___________  Fecha: _______
```

---

## Resumen Ejecutivo

**Cambios BLOQUEADOS hasta aprobación de todas las decisiones.**

**Cambios ya identificados SIN cambios de versión mayor:**
1. ✅ Instalar pg, kysely, node-pg-migrate (CRÍTICO)
2. ✅ Fijar Docker versions (keycloak, minio, postgres, rabbitmq)
3. ✅ Corregir documentación (fechas futuras)
4. ✅ Instalar Supertest (testing)

**Cambios POSPUESTOS (decisión requerida primero):**
1. ⏳ PostgreSQL 16 → 18
2. ⏳ NestJS 10 → 11
3. ⏳ TypeScript 5.3 → 7.0
4. ⏳ React 18 → 19 (unificación)
5. ⏳ RabbitMQ 3 → 4
6. ⏳ Vitest 1 → 4 (análisis)
7. ⏳ Redis (definir si es necesario)

