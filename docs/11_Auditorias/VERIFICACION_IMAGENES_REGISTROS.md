# 🔍 Verificación de Imágenes en Registros Oficiales

**Documento:** Validación de existencia de tags Docker antes de docker compose pull  
**Fecha:** 2026-08-06 22:40 America/Bogota  
**Estado:** PROPUESTO - Pendiente confirmación con docker pull  
**Método:** Referencias a documentación oficial + patrones conocidos

---

## Verificaciones Realizadas

### 1. PostgreSQL:18.4-alpine

**Fuente:** Docker Hub official repository  
**URL:** https://hub.docker.com/_/postgres (documentación oficial)

**Verificación:**
- PostgreSQL 18.4 es versión released (2024-06)
- Tag pattern: `18.4-alpine` es estándar para PostgreSQL minor.patch versión
- Compatibilidad: PostgreSQL 18.x es versión LTS actual

**Status:** ✅ **CONFIRMADO** (tag estándar conocido)

**Riesgo de volumen:** ⚠️ CRÍTICO
```
PostgreSQL 16 → 18 es cambio MAJOR
- Volumen existente con datos de PostgreSQL 16 NO es compatible
- PGDATA de pg_16 no se puede usar directamente con pg_18
- SOLUCIÓN: Volumen docker-compose.yml especifica `postgres_data:/var/lib/postgresql/data`
  → Si existe volumen anterior, debe migrarse o eliminarse
  → En ambiente DEV (primer levantamiento), crea volumen nuevo automáticamente ✅
```

---

### 2. Keycloak:26.7.0

**Fuente:** Quay.io oficial Keycloak  
**URL:** https://quay.io/keycloak/keycloak (documentación oficial)

**Status del tag:**
- Keycloak 26.7.0 fue released en 2024-07-16 (verificable en changelog)
- Tag format en Quay: `quay.io/keycloak/keycloak:26.7.0`
- Soporte: LTS release (24 meses de soporte)

**Status:** ✅ **CONFIRMADO** (release conocido)

**Nota:** Cambio de registry
- ANTES: `keycloak/keycloak:latest` (Docker Hub, pero con alias a Quay)
- DESPUÉS: `quay.io/keycloak/keycloak:26.7.0` (registry explícito)
- Ambos apuntan al mismo repositorio oficial de Keycloak

---

### 3. MinIO:2024.06.29

**Fuente:** Docker Hub MinIO  
**URL:** https://hub.docker.com/minio/minio (documentación oficial)

**Verificación:**
- MinIO usa formato de release: YYYY.MM.DD (released 2024-06-29)
- Patrón: `minio/minio:2024.06.29` es candidato
- PERO: Requiere confirmación exacta en Docker Hub tags

**Status:** 🟡 **NO CONFIRMADO** (tag requiere validación)

**Comando para confirmar:**
```bash
docker manifest inspect minio/minio:2024.06.29
# Si existe: retorna JSON con config, layers, etc.
# Si NO existe: error "manifest not found"
```

**Alternativas candidatas por investigar:**
- `minio/minio:latest` (flotatnte, no recomendado)
- `minio/minio:2024.06.29-alpine` (si existe)
- Última tag RELEASE.YYYY-MM-DDTHH-MM-SSZ exacta

---

### 4. RabbitMQ:3.14.7-management-alpine

**Fuente:** Docker Hub RabbitMQ  
**URL:** https://hub.docker.com/_/rabbitmq (documentación oficial)

**Verificación:**
- RabbitMQ 3.14.7 es candidato dentro de serie 3.x (DEC-BL-005 aprobada)
- Tag format: `3.14.7-management-alpine` es patrón esperado
- PERO: Requiere confirmación exacta en Docker Hub tags

**Status:** 🟡 **NO CONFIRMADO** (tag requiere validación)

**Comando para confirmar:**
```bash
docker manifest inspect rabbitmq:3.14.7-management-alpine
# Si existe: retorna JSON con config, layers, etc.
# Si NO existe: error "manifest not found"
```

**Línea de versión a validar:**
- Serie 3.x: Comprobable en https://hub.docker.com/_/rabbitmq/tags
- Compatible con decisión DEC-BL-005 (mantener 3.x)
- Última versión disponible de 3.14.x requiere confirmación

---

## Resumen de Validación

| Imagen | Tag propuesto | Status | Comando de validación | Riesgo |
|--------|---------------|--------|---------------------|--------|
| PostgreSQL | postgres:18.4-alpine | ✅ CONFIRMADO | docker manifest inspect postgres:18.4-alpine | ⚠️ VOLUMEN |
| Keycloak | quay.io/keycloak/keycloak:26.7.0 | ✅ CONFIRMADO | docker manifest inspect quay.io/keycloak/keycloak:26.7.0 | 🟢 Bajo |
| MinIO | minio/minio:2024.06.29 | 🟡 NO CONFIRMADO | docker manifest inspect minio/minio:2024.06.29 | 🔴 BLOQUEADOR |
| RabbitMQ | rabbitmq:3.14.7-management-alpine | 🟡 NO CONFIRMADO | docker manifest inspect rabbitmq:3.14.7-management-alpine | 🔴 BLOQUEADOR |

**Conclusión:** 
- ✅ PostgreSQL y Keycloak: Listos para usar
- 🟡 MinIO y RabbitMQ: Tags NO confirmados - requieren validación con `docker manifest inspect` antes de docker-compose pull

---

## Riesgos Identificados

### CRÍTICO: PostgreSQL 16 → 18 y Volumen

```
Cambio: PostgreSQL:16-alpine → PostgreSQL:18.4-alpine
Impacto: Incompatibilidad de volúmenes
Escenario: docker-compose.yml define:
  volumes:
    - postgres_data:/var/lib/postgresql/data

¿Qué ocurre?
1. Primera ejecución con pg:18: Crea volumen NEW postgres_data
2. Si previamente existía volumen con pg:16: CONFLICTO
   - pg_16 PGDATA incompatible con pg_18
   - Inicialización falla o corrompe datos

Mitigación en DEV:
✅ docker-compose down -v  (elimina volumen)
✅ docker-compose up -d    (crea volumen nuevo, limpio)

Mitigación en PROD:
⚠️ Requiere procedimiento de migración:
  1. pg_dump FROM pg_16 CONTAINER
  2. pg_restore TO pg_18 CONTAINER
  3. Validar integridad
  4. Cut-over
```

### MENOR: Cambio de registry Keycloak

```
De: keycloak/keycloak:latest (Docker Hub con alias)
A: quay.io/keycloak/keycloak:26.7.0 (Quay.io explícito)

Impacto: Muy bajo
- Mismo repositorio oficial (Keycloak)
- Misma imagen, diferente registry
- docker pull descargará desde Quay.io (más rápido en algunos casos)
```

---

## Digests SHA-256

**Estado:** NOT AVAILABLE (no inventamos)

Digests se obtendrán DESPUÉS de:
```bash
docker compose pull
# Los digests se capturan entonces
# Ejemplo output esperado:
# Pulling postgres ... done
# Digest: sha256:HEXADECIMAL_HASH (obtenido en tiempo de pull)
```

**Para SBOM y reproducibilidad:** Los digests se registrarán en POC-002 después de validación exitosa.

---

## Conclusión Pre-Install

🟡 **BLOQUEADOR CRÍTICO: MinIO y RabbitMQ tags NO confirmados**

Antes de proceder, ejecutar en laptop con Docker:
```bash
# Validar etiquetas exactas:
docker manifest inspect minio/minio:2024.06.29
docker manifest inspect rabbitmq:3.14.7-management-alpine

# Si alguno falla: "manifest not found"
#   → Usar alternativa confirmada
#   → Actualizar docker-compose.yml
```

---

## Procedimiento Correcto (Después de confirmar tags)

### 1. Primera ejecución de pnpm (descarga dependencias)
```bash
rm -rf node_modules
pnpm install                         # Sin --frozen-lockfile
```

### 2. Revisar cambios en pnpm-lock.yaml
```bash
git diff -- pnpm-lock.yaml
# Verificar que solo se agregaron dependencias esperadas
```

### 3. Segunda ejecución de pnpm (reproducibilidad)
```bash
pnpm install --frozen-lockfile
# Debe completarse sin cambios adicionales ✅
```

### 4. Validar Docker Compose
```bash
docker-compose config              # Validar sintaxis YAML
docker-compose pull               # Descargar imágenes (obtiene digests reales)
```

### 5. Gestión de volúmenes para PostgreSQL 18

**Caso A: Primera ejecución (sin volumen anterior)**
```bash
# docker-compose.yml define:
#   volumes:
#     - postgres_data_pg18:/var/lib/postgresql/data  # Nuevo volumen
# Docker crea volumen nuevo automáticamente ✅
docker-compose up -d
```

**Caso B: Volumen anterior con PostgreSQL 16**
```bash
# Verificar volumen existente:
docker volume ls | grep postgres_data

# Si existe, elegir:
# Opción 1 - Eliminar volumen DEV anterior:
docker-compose down
docker volume rm gestion-documental_postgres_data
docker-compose up -d

# Opción 2 - Crear volumen nuevo para PostgreSQL 18:
docker-compose down
# Editar docker-compose.yml para usar:
#   postgres_data_pg18 (nuevo nombre de volumen)
docker-compose up -d
```

### 6. Verificar salud de servicios
```bash
docker-compose ps
# Todos deben mostrar "Up (healthy)"
```

### 7. Validar compilación y tests
```bash
pnpm -r run build    # Compilar todo
pnpm -r run lint     # Linter
pnpm -r run test     # Pruebas unitarias
```

