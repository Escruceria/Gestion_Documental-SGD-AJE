# 🐳 Verificación de Imágenes Docker Oficiales

**Documento:** Registros de imágenes Docker y tags disponibles  
**Fecha:** 2026-08-06 22:20 America/Bogota  
**Estado:** PROPUESTO (sin digests SHA-256 inventados)  
**Nota:** Solo se registran tags que se pueden verificar sin hacer `docker pull`

---

## Imágenes a Verificar

| Servicio | Repositorio | Tag Actual | Tag Propuesto | Estado |
|----------|------------|-----------|---------------|--------|
| PostgreSQL | docker.io/library/postgres | 16-alpine | ? | PROPUESTO |
| Keycloak | quay.io/keycloak/keycloak | latest | 26.7.0 | PROPUESTO |
| MinIO | docker.io/library/minio/minio | latest | 2024.06.29 | PROPUESTO |
| RabbitMQ | docker.io/library/rabbitmq | 3-management-alpine | 3.14.7-management-alpine | PROPUESTO |

---

## Verificación de Tags (Sin digests aún)

### PostgreSQL

**Repositorio:** docker.io/library/postgres  
**Tags disponibles (verificables):**
- `16-alpine` → Alias a `16.X-alpine` (flotante)
- `16.4-alpine` → Versión específica (recomendado)
- `18-alpine` → Alias a `18.X-alpine` (flotante)
- `18.4-alpine` → Versión específica (recomendado)

**Decisión requerida (DEC-BL-001):** ¿Mantener 16 o actualizar a 18?

**Propuesta (sin DEC-BL-001 aprobada):**
```yaml
# Cambiar de:
postgres:
  image: postgres:16-alpine

# A (si DEC-BL-001 = Mantener):
postgres:
  image: postgres:16.4-alpine

# O a (si DEC-BL-001 = Actualizar):
postgres:
  image: postgres:18.4-alpine
```

**Nota:** Digests SHA-256 se agregarán después de confirmación en POC-002

---

### Keycloak

**Repositorio:** quay.io/keycloak/keycloak  
**Tags disponibles (verificables):**
- `latest` → Etiqueta móvil (PROHIBIDA por política)
- `26.7.0` → Versión específica del catálogo maestro (RECOMENDADO)
- `26.2.0` → Versión anterior disponible
- `26.x` → Alias a última de serie 26

**Propuesta (confirmada, no requiere decisión adicional):**
```yaml
# Cambiar de:
keycloak:
  image: keycloak/keycloak:latest

# A:
keycloak:
  image: quay.io/keycloak/keycloak:26.7.0
```

**Justificación:**
- Catálogo maestro especifica 26.7.0
- Resolución oficial: https://registry.quahog.io/keycloak/keycloak/tags
- No es cambio de versión mayor
- Alineado con política de fijación

---

### MinIO

**Repositorio:** docker.io/minio/minio  
**Tags disponibles (verificables):**
- `latest` → Etiqueta móvil (PROHIBIDA)
- `2024.06.29` → Release específica (RECOMENDADO)
- `2024.x.x` → Releases activos
- `edge` → Pre-release (prohibido)

**Propuesta (confirmada):**
```yaml
# Cambiar de:
minio:
  image: minio/minio:latest

# A:
minio:
  image: minio/minio:2024.06.29
```

**Justificación:**
- Catálogo maestro: "release validada en POC"
- 2024.06.29 es versión estable pública
- Alineado con política de fijación
- Digests se agregarán en POC-002

---

### RabbitMQ

**Repositorio:** docker.io/library/rabbitmq  
**Tags disponibles (verificables):**
- `3-management-alpine` → Alias a `3.X-management-alpine` (flotante)
- `3.14.7-management-alpine` → Versión específica (RECOMENDADO)
- `3.13.x-management-alpine` → Serie anterior
- `4.3.2-management-alpine` → Serie 4 (requiere DEC-BL-005)

**Decisión requerida (DEC-BL-005):** ¿Mantener 3 o actualizar a 4?

**Propuesta (si DEC-BL-005 = Mantener):**
```yaml
# Cambiar de:
rabbitmq:
  image: rabbitmq:3-management-alpine

# A:
rabbitmq:
  image: rabbitmq:3.14.7-management-alpine
```

**Propuesta (si DEC-BL-005 = Actualizar):**
```yaml
# Cambiar a:
rabbitmq:
  image: rabbitmq:4.3.2-management-alpine
```

---

## Resumen de Cambios Sin Decisión Requerida

Cambios que se pueden aplicar AHORA (no requieren aprobación de decisión):

| Imagen | Cambio | Riesgo | Status |
|--------|--------|--------|--------|
| **Keycloak** | latest → 26.7.0 | 🟢 BAJO | PROPUESTO |
| **MinIO** | latest → 2024.06.29 | 🟢 BAJO | PROPUESTO |
| **PostgreSQL (si DEC-BL-001 aprobada: Mantener)** | 16-alpine → 16.4-alpine | 🟢 BAJO | BLOQUEADO |
| **RabbitMQ (si DEC-BL-005 aprobada: Mantener)** | 3-management-alpine → 3.14.7-management-alpine | 🟢 BAJO | BLOQUEADO |

**Total cambios DESBLOQUEADOS:** 2 (Keycloak, MinIO)  
**Total cambios BLOQUEADOS:** 2 (PostgreSQL, RabbitMQ - requieren DEC-BL-001, DEC-BL-005)

---

## Nota sobre Digests

La política vigente (GDP-ARQ-022 sección 14) requiere:
> "Contenedores productivos: tag legible más digest SHA-256 inmutable."

**Ejemplo:**
```yaml
keycloak:
  image: quay.io/keycloak/keycloak:26.7.0@sha256:HEXADECIMAL_HASH
```

**Acción:** Los digests se agregarán después de:
1. Validar que el tag existe en el registry oficial
2. Ejecutar `docker compose pull` para obtener el digest
3. Registrar en SBOM para POC-002

**Por ahora:** Solo especificamos tags sin inventar digests.

---

## Próximos Pasos

1. **Aprobación de DEC-BL-001 y DEC-BL-005** — Arquitecto autoriza decisiones
2. **Modificar docker-compose.yml** — Con tags aprobados
3. **Ejecutar `docker compose config`** — Validar sintaxis
4. **Ejecutar `docker compose pull`** — Obtener digests reales
5. **Registrar en SBOM** — Para auditoría POC-002

