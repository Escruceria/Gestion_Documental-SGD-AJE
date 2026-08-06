# 🧹 Plan de Saneamiento de Línea Base

**Documento:** Cambios propuestos para alineación a catálogo maestro  
**Fecha:** 2026-08-06 18:00 UTC  
**Rama:** `chore/baseline-readiness`  
**Estado:** PROPUESTA PENDIENTE APROBACIÓN (sin commit, push ni implementación)

---

## ⚠️ Principios del Saneamiento

1. **Sin eliminar pnpm-lock.yaml** — Solo agregar dependencias e instalar
2. **Sin cambiar rama principal** — Todo en `chore/baseline-readiness`
3. **Sin implementar funcionalidades** — Solo correcciones de configuración
4. **Cambios separados** — Clasificados por dominio (dependencias, Docker, documentación)
5. **Revisión antes de commit** — Mostrar diffs completos antes de cualquier operación destructiva

---

## 📦 CAMBIO 1: Dependencias de Base de Datos (CRÍTICO)

### Problema
```
pg, kysely, node-pg-migrate completamente ausentes
→ Base de datos inaccesible
→ POC-001 bloqueado
```

### Archivo a modificar
`libs/database/package.json`

### Cambio propuesto

**ANTES:**
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
    "test": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  }
}
```

**DESPUÉS:**
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
    "pg": "^8.22.0",
    "kysely": "^0.29.3",
    "node-pg-migrate": "^8.0.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "@types/node": "^20.10.0",
    "@types/pg": "^8.10.9"
  }
}
```

### Justificación
- Versiones alineadas con catálogo maestro (GDP-ARQ-022)
- Baseline candidato comprobado (publicado 2026-07-16)
- Scripts de migración y seed habilitados
- Types para Node.js y pg

### Verificación post-cambio
```bash
pnpm install --frozen-lockfile
grep -r '"pg"\|"kysely"\|"node-pg-migrate' libs/database/package.json
# Debe retornar 3 líneas (dependencies)
```

### Riesgo
🟢 BAJO — Solo agregar dependencias ausentes, ninguna eliminación

---

## 🐳 CAMBIO 2: Versiones e Imágenes Docker (CRÍTICO)

### Problema
```
keycloak:latest → Etiqueta móvil
minio:latest → Etiqueta móvil
postgres:16-alpine → Sin digest, tag móvil
rabbitmq:3-management-alpine → Sin digest, tag móvil
→ Builds no reproducibles
→ Violación de política (GDP-ARQ-022 sección 14)
```

### Archivo a modificar
`docker-compose.yml`

### Cambios propuestos

**SECCIÓN postgres:**
```yaml
# ANTES:
postgres:
  image: postgres:16-alpine

# DESPUÉS:
postgres:
  image: postgres:16.4-alpine
  # Nota: Sin digest SHA-256 hasta verificar disponibilidad en registry
```

**SECCIÓN keycloak:**
```yaml
# ANTES:
keycloak:
  image: keycloak/keycloak:latest

# DESPUÉS:
keycloak:
  image: keycloak/keycloak:26.7.0
  # Nota: Versión del catálogo maestro
```

**SECCIÓN minio:**
```yaml
# ANTES:
minio:
  image: minio/minio:latest

# DESPUÉS:
minio:
  image: minio/minio:2024.06.29
  # Nota: Release específica per catálogo; digest a fijar en POC-002
```

**SECCIÓN rabbitmq:**
```yaml
# ANTES:
rabbitmq:
  image: rabbitmq:3-management-alpine

# DESPUÉS:
rabbitmq:
  image: rabbitmq:3.14.7-management-alpine
  # Nota: Versión específica de serie 3.x; upgrade a 4.x requiere ADR
```

### Justificación
- Catálogo maestro (GDP-ARQ-022) requiere versiones específicas
- Builds reproducibles
- Evita drift ambiental
- Digests SHA-256 pueden agregarse en siguiente etapa (POC-002)

### Verificación post-cambio
```bash
docker compose config | grep "image:"
# Debe retornar 4 líneas sin "latest"
grep -E "keycloak:latest|minio:latest" docker-compose.yml
# Debe retornar 0 líneas
```

### Riesgo
🟡 MEDIO — Cambio de versión de RabbitMQ (3.14.7); puede requerir testing de quorum/confirms

---

## 📝 CAMBIO 3: Coherencia Documental de Fechas (ALTO)

### Problema
```
GDP-AUT-001: "Estado: ✅ AUTORIZADO" pero "Fecha: 2026-09-15" (40 días en futuro)
GDP-ACT-001: "Fecha de inicio oficial: 2026-08-10" (4 días en futuro)
PLAN_ARRANQUE_POC001.md: "Equipo comienza 2026-09-16" (tratado como hecho)
→ Documentación incoherente
→ Falso positivo de status
```

### Archivos a modificar
1. `docs/00_Gestion_Proyecto/17_Autorizacion_Inicio_Desarrollo.md`
2. `docs/00_Gestion_Proyecto/01_Acta_Inicio_Proyecto.md`
3. `PLAN_ARRANQUE_POC001.md`

### Cambio 1: GDP-AUT-001

**ANTES (línea 9-10):**
```markdown
| Estado | **✅ AUTORIZADO** |
| Fecha | 2026-09-15 |
```

**DESPUÉS:**
```markdown
| Estado | 📅 AUTORIZACIÓN PLANIFICADA |
| Fecha Planificada | 2026-09-15 |
| Última revisión | 2026-08-06 |
| Estado actual | 🟡 PENDIENTE APROBACIÓN |
```

### Cambio 2: GDP-ACT-001

**ANTES (línea 8):**
```markdown
| Fecha de inicio oficial | 10 de agosto de 2026 |
```

**DESPUÉS:**
```markdown
| Fecha de inicio PLANIFICADA | 2026-08-10 |
| Estado actual (2026-08-06) | 🟡 Pendiente confirmación |
```

### Cambio 3: PLAN_ARRANQUE_POC001.md

**TODAS las menciones de:** `"Equipo comienza 2026-09-16"`
**CAMBIAR A:** `"Equipo COMENZARÁ el 2026-09-16"`

**TODAS las menciones de:** `"Se autoriza"` (para fechas futuras)
**CAMBIAR A:** `"Se autorizará"`

**Buscar y reemplazar:**
```bash
grep -n "comienza 2026-09\|Se autoriza.*2026-09" PLAN_ARRANQUE_POC001.md
# Reemplazar con equivalentes futuros
```

### Justificación
- Claridad de estados: aprobado vs. planificado
- Coherencia temporal (hoy 2026-08-06)
- Precisión de 40 días (no 9)
- Separación clara de planeación vs. ejecución

### Verificación post-cambio
```bash
grep -r "AUTORIZADO" docs/00_Gestion_Proyecto/17_Autorizacion*.md
# NO debe encontrar "✅ AUTORIZADO" (cambiar a "PLANIFICADA")

grep -r "comienza 2026-09" PLAN_ARRANQUE_POC001.md
# NO debe encontrar "comienza", solo "COMENZARÁ"
```

### Riesgo
🟢 BAJO — Solo cambios documentales, no de código ni configuración

---

## 📂 CAMBIO 4: Estructura Duplicada de Documentación (BAJO)

### Problema
```
docs/04_Politicas_Legales/ ← Categoría
docs/09_Politicas_Legales/ ← DUPLICADA
docs/05. Normativa/ ← Punto decimal (inconsistente)
→ Confusión de navegación
→ Índice maestro desalineado
```

### Archivos afectados
1. Renombramiento de directorios
2. Actualización de índice maestro
3. Referencias cruzadas

### Cambio propuesto

**Reorganización:**
```
docs/04_Base_Datos/            # Mantener
docs/05_Backend/               # Mantener
docs/06_Frontend/              # Mantener
docs/07_Seguridad_Privacidad/  # Mantener
docs/08_Cumplimiento_Legal/    # Mantener
docs/09_Politicas_Legales/     # UNIFICAR (eliminar 04_Politicas_Legales)
docs/10_Pruebas/               # Renumerar si aplica
docs/11_Despliegue_Operacion/  # Mantener
docs/12_Manuales/              # Mantener
docs/99_Fuentes_Heredadas/     # Mantener
```

**Cambio en 05. Normativa:**
```bash
# ANTES:
docs/05. Normativa/

# DESPUÉS:
docs/05_Normativa/  # Sin punto decimal
```

### Acciones específicas
```bash
# NO hacer aún; propuesta únicamente
# rm -rf docs/04_Politicas_Legales
# mv docs/09_Politicas_Legales/* docs/09_Politicas_Legales_CONSOLIDADO/
# mv docs/05. Normativa docs/05_Normativa

# Actualizar índice:
# docs/00_Gestion_Proyecto/00_Indice_Maestro_Documentacion.md
# Todas las referencias a 04_Politicas → 09_Politicas
# Todas las referencias a "05. Normativa" → "05_Normativa"
```

### Justificación
- Consistencia de numeración
- Claridad de navegación
- Cumplimiento de convención (sin puntos decimales)

### Verificación post-cambio
```bash
find docs -type d -name "*Politica*" | wc -l
# Debe retornar 1 (consolidado)

ls -d docs/05_*
# NO debe haber "05. Normativa" (con punto)
```

### Riesgo
🟡 MEDIO — Requiere actualización de referencias en índices y enlaces internos

---

## 🔧 CAMBIO 5: Definición de Redis (DECISIÓN REQUERIDA)

### Problema
```
Análisis menciona Redis 7 en tabla de servicios
docker-compose.yml NO contiene Redis
→ Inconsistencia: ¿es requerido o no?
```

### Opciones

**OPCIÓN A: Agregar Redis a docker-compose.yml (SÍ es requerido)**
```yaml
redis:
  image: redis:7.4.1-alpine
  container_name: sgd-redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  # ... existing
  redis_data:
```

**OPCIÓN B: Eliminar mención de análisis (NO es requerido ahora)**
- Actualizar análisis a "Redis no incluido en POC-001"
- Documentar en catálogo maestro como "Fase 2"

**OPCIÓN C: Documentar como "Fase 2" (futuro)**
- Mantener en catálogo maestro
- Marcar en docker-compose como comentario
- Indicar cuándo se incluirá

### Decisión requerida antes de cambio
**¿Redis es necesario para POC-001?**
- SÍ → Opción A (agregar)
- NO → Opción B (eliminar mención)
- FUTURO → Opción C (documentar para Fase 2)

### Riesgo
- Opción A: 🟡 MEDIO (agrega servicio, aumenta complejidad local)
- Opción B: 🟢 BAJO (cambio documental)
- Opción C: 🟢 BAJO (cambio documental)

---

## 🎨 CAMBIO 6: Alineación/Justificación de React (DECISIÓN REQUERIDA)

### Problema
```
apps/frontend: React 18.2.0
apps/web: React 19.2.7
Catálogo maestro: React 19.2.7 (baseline candidato)
→ Major version inconsistencia
```

### Opciones

**OPCIÓN A: Unificar a React 19 (recomendado, alineado a catálogo)**
```json
// apps/frontend/package.json
"react": "^19.2.7",
"react-dom": "^19.2.7",
// Actualizar resto de dependencias para compatibilidad 19
```

**OPCIÓN B: Mantener 18 en frontend, justificar en ADR-018**
```markdown
# ADR-018 — JUSTIFICACIÓN DE VERSIONES
## Decisión: React 18.2.0 en frontend, 19.2.7 en web
**Razón:** apps/web es experimental; frontend es aplicación principal.
**Validación:** Peer dependencies y compatibilidad verificadas.
```

**OPCIÓN C: Completar análisis de compatibilidad primero**
- Revisar peer dependencies en pnpm-lock.yaml
- Validar si React 18 → 19 es safe
- Proponer como cambio separado después de auditoría

### Verificación de compatibilidad (si se elige Opción A)
```bash
# Después de instalar:
pnpm ls react react-dom
# Todas las versiones deben ser ^19.2.7

pnpm -r run build
# React 19 debe compilar sin breaking changes
```

### Decisión requerida
**¿Unificar a React 19 o mantener 18?**

### Riesgo
- Opción A: 🟡 MEDIO (upgrade major version, requiere testing)
- Opción B: 🟢 BAJO (mantener, documental)
- Opción C: 🟡 MEDIO (análisis adicional, riesgo de demora)

---

## 🧪 CAMBIO 7: Configuración Real de Pruebas y Observabilidad (INFORMACIÓN)

### Problema
```
Vitest 1.0.4 vs catálogo 4.1.10
Supertest completamente ausente
OpenTelemetry no implementado
→ Suite de testing incompleta
```

### Estado actual
- ✅ Vitest 1.0.4 presente (funcional pero versión anterior)
- ❌ Supertest completamente ausente
- ⚠️ Testcontainers, MSW, Playwright: symlinks rotos (no verificables)
- ❌ OpenTelemetry: no presente

### Propuesta: SIN CAMBIO EN POC-001
- Mantener Vitest 1.0.4 para POC-001 (riesgo bajo)
- Agregar Supertest como obligatorio (testing HTTP)
- OpenTelemetry: posponer para MVP
- Testing libraries: validar después de reparar node_modules

### Cambio propuesto

**Agregar a apps/*/package.json (o root si es shared):**
```json
"devDependencies": {
  "supertest": "^7.2.2"
}
```

### Justificación
- Supertest es obligatorio para testing de endpoints HTTP
- Vitest upgrade puede hacerse después (backward compatible)
- OpenTelemetry es "nice-to-have" para POC-001

### Riesgo
🟢 BAJO — Solo agregar una librería de testing, sin cambios mayores

---

## 🎯 Resumen de Cambios por Dominio

| Dominio | Cambio | Severidad | Bloqueador | Aprobación requerida |
|---------|--------|-----------|-----------|-------------------|
| **Base de Datos** | Instalar pg, kysely, node-pg-migrate | 🔴 CRÍTICO | SÍ | Arquitecto |
| **Docker** | Fijar versiones (keycloak, minio, postgres, rabbitmq) | 🔴 CRÍTICO | SÍ | Arquitecto |
| **Documentación** | Corregir fechas futuras (GDP-AUT-001, GDP-ACT-001, PLAN*) | 🟡 ALTO | NO | Product Owner |
| **Estructura docs** | Consolidar duplicados de Políticas Legales | 🟡 MEDIO | NO | Product Owner |
| **Configuración** | Decisión: Redis SÍ/NO/FUTURO | 🟡 MEDIO | POSIBLE | Arquitecto |
| **Frontend** | Decisión: React 18 o 19 | 🟡 MEDIO | NO | Arquitecto |
| **Testing** | Agregar Supertest; validar suite completa | 🟢 BAJO | NO | QA Lead |

---

## 📊 GO/NO-GO Revisado (Excluyendo N/A)

### Verificaciones ejecutables:

| Item | Actual | Requerido | Post-saneamiento |
|------|--------|-----------|-----------------|
| pg, kysely, node-pg-migrate | ❌ NO | ✅ SÍ | ✅ SANEADO |
| Docker versiones específicas | ❌ NO | ✅ SÍ | ✅ SANEADO |
| Documentación coherente | ❌ INCOHERENTE | ✅ COHERENTE | ✅ SANEADO |
| Compilación TypeScript | ⏸️ BLOCKED | ✅ PASS | ⏳ POR VALIDAR |
| Tests ejecutables | ⏸️ BLOCKED | ✅ PASS | ⏳ POR VALIDAR |
| `docker compose config` | ⏸️ N/A | ✅ PASS | ⏳ POR VALIDAR |

**Calculando:**
- Ejecutables (excluyendo N/A): 6
- Actualmente PASS: 0
- Post-saneamiento PASS: 3
- Aún BLOCKED: 3

**Ratio:** 3/6 (50%) → Mejora significativa

---

## 🚦 Recomendación GO/NO-GO Post-Saneamiento

### ANTES del saneamiento:
```
0 / 6 ejecutables PASS = NO-GO (0%)
```

### DESPUÉS del saneamiento propuesto:
```
3-4 / 6 ejecutables PASS = GO CON CONDICIONES (50-67%)
Condiciones:
  - pnpm install --force exitoso en entorno limpio
  - TypeScript compila sin errores
  - Docker compose up levanta servicios
```

### Limitaciones permanentes del entorno auditado:
- Node.js versión incorrecta (22 vs 24, limitación del sandbox)
- Filesystem lento (no se puede reinstalar en el sandbox)
- Docker no disponible en sandbox

**Conclusión:** El saneamiento propuesto es NECESARIO pero NO SUFICIENTE sin poder validar en entorno limpio con Docker.

---

## ✅ Próximos Pasos

### 1. **Aprobación de cambios (REQUERIDO)**
   - [ ] Arquitecto aprueba cambios de dependencias y Docker
   - [ ] Product Owner aprueba cambios documentales
   - [ ] Equipo confirma decisiones de Redis y React

### 2. **Cambios sin commit (POR AHORA)**
```bash
git status --short
# Ver cambios propuestos

git diff --stat
# Ver resumen de cambios

git diff
# Ver diffs completos ANTES de cualquier operación
```

### 3. **Instalación en entorno limpio (NO AQUÍ)**
```bash
# En laptop del equipo con Docker disponible:
rm -rf node_modules
pnpm install --frozen-lockfile
pnpm -r run build
pnpm -r run test
docker compose up -d && docker compose ps
```

### 4. **Commit y Push (DESPUÉS DE VALIDACIÓN)**
```bash
# Solo después de que todo pase arriba
git add .
git commit -m "chore: baseline readiness - align versions and dependencies"
git push origin chore/baseline-readiness
# Crear pull request para revisión del equipo
```

