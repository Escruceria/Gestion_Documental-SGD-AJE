# ⚠️ Inconsistencias Pre-Desarrollo

**Documento:** Reporte de inconsistencias encontradas  
**Fecha:** 2026-08-06 15:30 UTC  
**Responsable:** Validación técnica  
**Impacto:** Bloqueadores para iniciar POC-001 en 2026-09-16

---

## 1. CRÍTICO: Dependencias de Base de Datos Faltantes

### Problema
El análisis declara:
> "Kysely, pg y node-pg-migrate" están "Aprobados" en ADR-015

Pero en realidad:
- ❌ `pg` NO está en ningún package.json
- ❌ `kysely` NO está en ningún package.json
- ❌ `node-pg-migrate` NO está en ningún package.json

### Evidencia
```bash
$ grep -r '"pg"\|"kysely"\|"node-pg-migrate' apps/*/package.json libs/*/package.json
# Resultado: NINGUNO

$ cat libs/database/package.json
# Solo contiene: typescript, vitest (dev dependencies)
# NO contiene: pg, kysely, node-pg-migrate
```

### Impacto
| Sistema | Estado | Consecuencia |
|---------|--------|-------------|
| `pnpm db:migrate` | ❌ FALLA | No hay `node-pg-migrate` para ejecutar |
| `pnpm db:seed` | ❌ FALLA | No hay script de seed |
| Conexión PostgreSQL | ❌ IMPOSIBLE | Sin driver `pg` |
| Queries TypeScript | ❌ IMPOSIBLE | Sin `kysely` para construir queries |

### Corrección Requerida

**Archivo:** `libs/database/package.json`

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
    "seed": "node scripts/seed.ts"
  },
  "dependencies": {
    "pg": "^8.11.3",
    "kysely": "^0.28.0",
    "node-pg-migrate": "^8.11.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "@types/node": "^20.10.0"
  }
}
```

**Luego ejecutar:**
```bash
pnpm install
```

### Timeline
- **Crítico:** Resolver ANTES de 2026-09-16
- **Plazo:** Máximo 1 hora

---

## 2. CRÍTICO: Docker Images Sin Versiones Específicas

### Problema
El análisis menciona "Keycloak 22" y "MinIO latest" pero docker-compose.yml usa `latest`:

```yaml
# Viola ADR-012: "Versiones exactas se fijarán mediante... imágenes reproducibles"

keycloak:
  image: keycloak/keycloak:latest  # ❌ VIOLATION

minio:
  image: minio/minio:latest  # ❌ VIOLATION
```

### Impacto

| Escenario | Problema | Severidad |
|-----------|----------|-----------|
| Developer A instala 2026-08-06 | Obtiene Keycloak X | Imagen A |
| Developer B instala 2026-09-01 | Obtiene Keycloak X+2 | Imagen B |
| CI/CD hace build | Puede obtener imagen diferente | No reproducible |
| Producción | Versión desconocida deployada | CRÍTICO |

**Violación de ADR-012:**
> "Versiones exactas se fijarán mediante lockfile e imágenes reproducibles."

### Corrección Requerida

**Archivo:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine  # ✅ Especificado
    # ... resto igual

  keycloak:
    image: keycloak/keycloak:22.0.0  # CAMBIAR DE latest A 22.0.0
    container_name: sgd-keycloak
    # ... resto igual

  minio:
    image: minio/minio:2024.06.29  # CAMBIAR DE latest A 2024.06.29
    container_name: sgd-minio
    # ... resto igual

  rabbitmq:
    image: rabbitmq:3-management-alpine  # ✅ Ya especificado
    # ... resto igual

volumes:
  postgres_data:
  minio_data:
  rabbitmq_data:
```

**Verificación post-cambio:**
```bash
docker-compose config | grep image:
# Debe mostrar versiones exactas, SIN "latest"
```

### Timeline
- **Crítico:** Resolver ANTES de 2026-09-16
- **Plazo:** 15 minutos

---

## 3. CRÍTICO: node_modules Corrupto

### Problema
Los symlinks en node_modules están rotos (apuntan a 0 bytes):

```bash
$ ls -la node_modules/typescript
lrwxrwxrwx 0 Jul 16 16:20 typescript

$ ls -la node_modules/vitest
lrwxrwxrwx 0 Jul 16 16:20 vitest

# Error al acceder:
$ tsc --version
Error: Cannot find module '/path/to/node_modules/typescript/bin/tsc'
```

### Impacto

| Comando | Status | Error |
|---------|--------|-------|
| `pnpm test` | ❌ FALLA | vitest symlink roto |
| `pnpm build` | ❌ FALLA | tsc symlink roto |
| `tsc --noEmit` | ❌ FALLA | typescript no accesible |
| Desarrollo local | ❌ BLOQUEADO | No se puede compilar |

### Causa Probable
- Instalación incompleta de pnpm
- Sincronización de archivos fallida en contenedor
- Permisos de filesystem corruptos

### Corrección Requerida

**Opción 1: Reparar (preferido)**
```bash
cd /sessions/focused-sharp-goodall/mnt/gestion-documental
pnpm install --force
```

**Opción 2: Limpiar y reinstalar**
```bash
rm -rf node_modules .pnpm pnpm-lock.yaml
pnpm install
```

**Verificación post-corrección:**
```bash
pnpm test --help  # Debe mostrar help sin errores
tsc --version    # Debe mostrar versión
ls -l node_modules/typescript/bin/tsc  # Debe ser archivo real, no symlink roto
```

### Timeline
- **Crítico:** Resolver ANTES de 2026-09-16
- **Plazo:** 30 minutos (incluye descarga si es necesario)

---

## 4. CRÍTICO: Inconsistencia de Fechas en Autorizaciones

### Problema
Documentos datados en el FUTURO están marcados como "AUTORIZADO" HOY (2026-08-06):

**GDP-AUT-001:**
```markdown
| Código | GDP-AUT-001 |
| Versión | 1.0 |
| Estado | **✅ AUTORIZADO** |  ← Hoy 2026-08-06
| Fecha | 2026-09-15 |           ← 9 días en futuro
```

**GDP-ACT-001:**
```markdown
| Fecha de inicio oficial | 10 de agosto de 2026 |  ← 4 días en futuro
```

### Violación de Regla
De las especificaciones de auditoría:
> "No presentes fechas futuras como aprobaciones ya ejecutadas."

### Impacto
- 🔴 Documentación INCOHERENTE
- 🔴 Confusion sobre qué está "aprobado" vs "planificado"
- 🔴 Falso positivo en status de go/no-go
- 🔴 Incumplimiento de gobernanza

### Corrección Requerida

**Archivo:** `docs/00_Gestion_Proyecto/17_Autorizacion_Inicio_Desarrollo.md`

**CAMBIAR:**
```markdown
| Estado | **✅ AUTORIZADO** |
| Fecha | 2026-09-15 |
```

**A:**
```markdown
| Estado | 📅 AUTORIZACIÓN PLANIFICADA |
| Fecha Planificada | 2026-09-15 |
| Estado Actual (2026-08-06) | 🟡 EN REVISIÓN |
```

---

**Archivo:** `docs/00_Gestion_Proyecto/01_Acta_Inicio_Proyecto.md`

**CAMBIAR:**
```markdown
| Fecha de inicio oficial | 10 de agosto de 2026 |
```

**A:**
```markdown
| Fecha de inicio PLANIFICADA | 10 de agosto de 2026 |
```

---

**Archivo:** `PLAN_ARRANQUE_POC001.md`

**CAMBIAR todos:** `"Equipo comienza 2026-09-16"` 

**A:** `"Equipo COMENZARÁ 2026-09-16"` (futuro)

### Timeline
- **Crítico:** Resolver ANTES de 2026-09-16
- **Plazo:** 1 hora (incluye revisión de todos los documentos)

---

## 5. ALTO: Redis Mencionado pero NO en docker-compose

### Problema
El análisis menciona Redis en tabla "Servicios Docker levantados localmente":
> "redis:7 # Redis (cache, sessions)"

Pero `docker-compose.yml` NO contiene redis.

### Evidencia
```bash
$ grep -i redis docker-compose.yml
# Resultado: NINGUNO
```

### Pregunta
¿Es Redis realmente requerido para POC-001?

### Opciones
1. **Sí, es requerido:** Agregar a docker-compose.yml
2. **No, es opcional:** Eliminar mención del análisis
3. **Futuro:** Documentar como "Fase 2 o posterior"

### Corrección Requerida

**Si SÍ es requerido, agregar a docker-compose.yml:**
```yaml
redis:
  image: redis:7-alpine
  container_name: sgd-redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data

volumes:
  # ... existing
  redis_data:
```

**Si NO es requerido, corregir análisis:**
```markdown
# Servicios levantados localmente:
✅ postgres:16
✅ keycloak:22
✅ minio:2024.06.29
✅ rabbitmq:3
❌ redis (NOT INCLUDED YET - planned for Phase 2)
```

### Timeline
- **Alto:** Clarificar ANTES de 2026-09-15
- **Plazo:** 15 minutos (decisión) + 15 minutos (implementación si aplica)

---

## 6. ALTO: React Versiones Incompatibles en Diferentes Apps

### Problema
```
apps/frontend:   react@^18.2.0
apps/web:        react@19.2.7
```

Diferentes major versions (18 vs 19) en el mismo monorepo.

### Impacto
- Potencial incompatibilidad de librerías
- Confusión para desarrolladores
- Posibles conflictos en node_modules

### Pregunta
¿Es intencional tener React 19 en `web` mientras el resto usa 18?

### Corrección Requerida

**Opción A: Unificar a React 18 (más seguro para POC)**
```json
// apps/web/package.json
"react": "^18.2.0",
"react-dom": "^18.2.0"
```

**Opción B: Unificar a React 19 (más moderno)**
```json
// apps/frontend/package.json
"react": "^19.2.7",
"react-dom": "^19.2.7"
```

**Opción C: Documentar decisión**
Si son intencionalmente diferentes, documentar en `ADR-018_Frontend`:
```markdown
## Decisión de React Versions
- apps/frontend: React 18.2 (stable, production-ready)
- apps/web: React 19.2 (experimental, for evaluation)
```

### Timeline
- **Alto:** Resolver ANTES de 2026-09-16
- **Plazo:** 1 hora

---

## 7. MEDIO: Duplicación y Inconsistencia en Categorías docs/

### Problema
```
docs/04_Politicas_Legales/    # Categoría
docs/09_Politicas_Legales/    # DUPLICADA
docs/05. Normativa/           # Punto decimal (inconsistente)
docs/05_Backend/              # Sin punto (consistente)
```

### Impacto
- Confusión en navegación
- Índice maestro potencialmente incoherente
- No sigue convención de numeración

### Corrección Requerida

**Reorganizar bajo una estructura clara:**
```
docs/
├── 00_Gestion_Proyecto/
├── 01_Requisitos/
├── 02_Analisis/
├── 03_Arquitectura/
├── 04_Base_Datos/
├── 05_Backend/
├── 06_Frontend/
├── 07_Seguridad_Privacidad/
├── 08_Cumplimiento_Legal/
├── 09_Politicas_Legales/      # UNIFICADA (eliminar 04_Politicas)
├── 10_Pruebas/
├── 11_Despliegue_Operacion/
├── 12_Manuales/
└── 99_Fuentes_Heredadas/
```

**Luego actualizar:**
1. `docs/00_Gestion_Proyecto/00_Indice_Maestro_Documentacion.md`
2. Todas las referencias cruzadas

### Timeline
- **Medio:** Resolver ANTES de 2026-09-16
- **Plazo:** 1.5 horas

---

## 8. MEDIO: Vitest Versión 1.0.4 (No 0.x como declara análisis)

### Problema
Análisis declara: "Vitest 0.x"
Realidad: `vitest@^1.0.4`

### Impacto
- Documentación imprecisa
- Potencial para incompatibilidades asumidas
- Diferencia de major version

### Corrección Requerida

**Actualizar análisis:**
```markdown
# Cambiar en ANALISIS_REPOSITORIO_COMPLETO.md:
Vitest (0.x) → Vitest (1.0.4)
```

**Verificar compatibilidad:**
```bash
pnpm test --help  # Verificar que funciona con 1.0.4
```

### Timeline
- **Medio:** Actualizar documentación antes de 2026-09-16
- **Plazo:** 15 minutos

---

## 9. BAJO: Supertest, Playwright, k6 No Verificados

### Problema
ADR-019 declara "Vitest, Supertest, Testcontainers, MSW, Playwright, k6"
Pero en package.json solo vimos Vitest confirmado.

### Hallazgo
- ✅ Vitest confirmado
- ⚠️ Testcontainers, MSW, Playwright mencionados como symlinks rotos en node_modules
- ❌ Supertest no encontrado
- ❌ k6 no encontrado

### Corrección Requerida

1. Verificar qué librerías están realmente en package.json de los apps
2. Instalar las faltantes
3. Actualizar análisis con estado real

### Timeline
- **Bajo:** Resolver ANTES de compilación
- **Plazo:** 1 hora

---

## Resumen de Correcciones por Prioridad

### 🔴 BLOQUEADORES INMEDIATOS (Máximo 2-3 horas)

| # | Corrección | Tiempo | Archivo |
|---|-----------|--------|---------|
| 1 | Instalar pg, kysely, node-pg-migrate | 15 min | libs/database/package.json |
| 2 | Reparar node_modules (pnpm install --force) | 30 min | (compilar) |
| 3 | Especificar Docker versions (Keycloak, MinIO) | 15 min | docker-compose.yml |
| 4 | Corregir fechas futuras en documentos | 60 min | 17_Autorizacion*, 01_Acta*, PLAN* |

### 🟡 CRÍTICO ANTES DE KICKOFF (Máximo 1 hora)

| # | Corrección | Tiempo |
|---|-----------|--------|
| 5 | Clarificar Redis (agregar o documentar) | 30 min |
| 6 | Unificar React versions | 60 min |
| 7 | Reorganizar directorios docs/ | 90 min |

### 🟢 DESEABLE ANTES DE DESARROLLO (Máximo 1 hora)

| # | Corrección | Tiempo |
|---|-----------|--------|
| 8 | Actualizar análisis (Vitest 0.x → 1.0.4) | 15 min |
| 9 | Verificar testing libraries | 60 min |

---

## Timeline Recomendado

**2026-08-06 (Hoy) 16:00-18:00 (2 horas):**
1. Instalar dependencias BD
2. Reparar node_modules
3. Especificar Docker versions
4. Push de cambios

**2026-08-07 (Mañana) 09:00-12:00 (3 horas):**
5. Corregir fechas en documentos
6. Unificar React versions
7. Reorganizar directorios docs
8. Actualizar análisis

**2026-08-15 (Verificación final antes de kickoff):**
- Ejecutar `pnpm test` exitosamente
- Ejecutar `pnpm build` exitosamente
- Levantar `docker-compose up` exitosamente
- Validar punto 1 de checklist pre-desarrollo

---

## Conclusión

**Total de inconsistencias:** 9  
**Bloqueadores críticos:** 4  
**Tiempo total de correcciones:** ~4-5 horas  
**Go/No-Go:** 🟡 **NO-GO HASTA RESOLVER BLOQUEADORES**

