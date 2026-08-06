# ✅ Resultados de Validación Reproducible

**Documento:** Ejecución de verificaciones sin implementar funcionalidades  
**Fecha:** 2026-08-06 17:45 UTC  
**Rama:** `chore/baseline-readiness`  
**Entorno:** Linux sandbox con limitaciones de filesystem

---

## 📋 Verificaciones Ejecutadas

### 1. Estado de Git

```bash
$ git switch -c chore/baseline-readiness
Switched to a new branch 'chore/baseline-readiness'

$ git status --short
M docs/00_Gestion_Proyecto/09_Riesgos_Proyecto.csv
?? PLAN_ARRANQUE_POC001.md
?? docs/auditorias/
```

**Resultado:** ✅ **PASS**
- Rama controlada creada correctamente
- node_modules NO está versionado (git ls-files mostró 0 resultados)
- Cambios documentados presentes

---

### 2. Integridad de Lockfile y Configuración

```bash
$ ls -la | grep -E "pnpm-lock|package|nvmrc"
-rwx------ 1 focused-sharp-goodall focused-sharp-goodall      8 Jul 16 16:04 .nvmrc
-rwx------ 1 focused-sharp-goodall focused-sharp-goodall    970 Aug  6 09:23 package.json
-rwx------ 1 focused-sharp-goodall focused-sharp-goodall 221856 Jul 16 16:24 pnpm-lock.yaml
```

**Resultado:** ✅ **PASS**
- `.nvmrc` presente (8 bytes = "24.14.0\n")
- `package.json` presente e íntegro
- `pnpm-lock.yaml` presente (221KB, tamaño esperado)
- Lockfile NO fue deletreado

---

### 3. Versión de Node.js

```bash
$ node --version
v22.22.3
```

**Resultado:** ⚠️ **PARTIAL PASS**
- Node.js instalado: 22.22.3
- Requerido: 24.14.0 (.nvmrc)
- Estado: Mismatch entre .nvmrc y entorno
- Nota: El entorno del sandbox no puede cambiar; .nvmrc es correcto

**Clasificación:** `NOT APPLICABLE` (limitación del entorno auditado)

---

### 4. Instalación de pnpm

```bash
$ pnpm --version
bash: pnpm: command not found
```

**Resultado:** ❌ **BLOCKED**
- pnpm 9.0.0 NO disponible en PATH
- node_modules/bin/pnpm no accesible (symlinks rotos)
- Causa: Instalación anterior incompleta o corrupta

**Clasificación:** `BLOCKED`

**Evidencia anterior:** 
```
ls: cannot read symbolic link 'node_modules/typescript': Input/output error
ls: cannot read symbolic link 'node_modules/vitest': Input/output error
lrwxrwxrwx 1 focused-sharp-goodall focused-sharp-goodall 0 Jul 16 16:20 typescript
```

---

### 5. Intento de Instalación Limpia

```bash
$ rm -rf node_modules
# Command timeout after 120000ms
```

**Resultado:** ⏸️ **NOT APPLICABLE / BLOCKED**
- Entorno de sandbox: operaciones de filesystem extremadamente lentas
- Borrado de node_modules tarda >2 minutos
- No se completó la operación
- **Implicación:** La instalación `pnpm install --frozen-lockfile` también experimentaría timeout

**Clasificación:** `BLOCKED` (limitación ambiental, no del repositorio)

---

### 6. Verificación de docker-compose.yml

```bash
$ cat docker-compose.yml | head -30
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    # ... OK

  keycloak:
    image: keycloak/keycloak:latest  # ⚠️ MÓVIL
    
  minio:
    image: minio/minio:latest  # ⚠️ MÓVIL

  rabbitmq:
    image: rabbitmq:3-management-alpine  # ⚠️ MÓVIL (no digest)
```

**Resultado:** ⚠️ **PARTIAL FAIL**
- Keycloak: `latest` (etiqueta móvil) - **VIOLACIÓN**
- MinIO: `latest` (etiqueta móvil) - **VIOLACIÓN**
- PostgreSQL: `16-alpine` (tag móvil, no digest) - **VIOLACIÓN**
- RabbitMQ: `3-management-alpine` (tag móvil, no digest) - **VIOLACIÓN**

**Clasificación:** `FAIL` (violación de política de versiones)

---

## 🚫 Validaciones No Ejecutables

### ❌ `docker compose config`

**Intento:**
```bash
$ docker compose config
```

**Resultado:** `NOT APPLICABLE`
- Docker no disponible en entorno de sandbox
- No se pudo validar sintaxis YAML de docker-compose
- Cambios propuestos deben ser revisados manualmente

---

### ❌ `pnpm list -r --depth 0`

**Intento:**
```bash
$ pnpm list -r --depth 0
bash: pnpm: command not found
```

**Resultado:** `BLOCKED`
- pnpm no ejecutable
- No se puede listar dependencias instaladas
- No se puede verificar `pnpm-lock.yaml` consistency

---

### ❌ `pnpm -r run build`

**Intento:**
```bash
$ pnpm -r run build
bash: pnpm: command not found
```

**Resultado:** `BLOCKED`
- TypeScript compilation no ejecutable
- Cada workspace tendría scripts de build; todos fallarían
- No se puede validar que el código compila

---

### ❌ `pnpm -r run lint`

**Resultado:** `BLOCKED`
- ESLint no ejecutable
- No se puede validar estilo de código

---

### ❌ `pnpm -r run test`

**Resultado:** `BLOCKED`
- Vitest/suites de prueba no ejecutables
- No se puede validar que tests pasan

---

### ⚠️ `docker compose pull`

**Resultado:** `NOT APPLICABLE`
- Docker no disponible
- No se puede verificar accesibilidad de imágenes
- No se puede validar digests

---

### ⚠️ `docker compose up -d`

**Resultado:** `NOT APPLICABLE`
- No se pudo levantar servicios locales
- No se validó PostgreSQL, Keycloak, MinIO, RabbitMQ

---

## 📊 Resumen de Clasificaciones

| Verificación | Estado | Clasificación | Implicación |
|-------------|--------|---------------|------------|
| Git/Rama | ✅ OK | PASS | Branching controlado ✅ |
| Archivos config | ✅ OK | PASS | .nvmrc, package.json, pnpm-lock.yaml íntegros ✅ |
| Node.js | ⚠️ Mismatch | NOT APPLICABLE | Entorno: 22.22.3; Requerido: 24.14.0 (sandbox limitado) |
| pnpm disponible | ❌ NO | BLOCKED | node_modules corrupto impide ejecutar pnpm |
| Instalación limpia | ❌ TIMEOUT | BLOCKED | Filesystem de sandbox extremadamente lento (>120s timeout) |
| docker-compose.yml | ⚠️ Tags móviles | FAIL | Keycloak, MinIO, PostgreSQL, RabbitMQ sin versiones fijas |
| Compilación TypeScript | ❌ NO | BLOCKED | pnpm no disponible |
| Tests | ❌ NO | BLOCKED | pnpm no disponible |
| Linting | ❌ NO | BLOCKED | pnpm no disponible |
| Docker services | ⏸️ N/A | NOT APPLICABLE | Docker no disponible en sandbox |

**Total:** 4 BLOCKED, 2 FAIL, 3 NOT APPLICABLE, 1 PASS

---

## ⚙️ Verificaciones Alternativas Realizadas

### A. Análisis Estático de package.json

**Filtro pnpm:**
```bash
$ grep -r '"pg"\|"kysely"\|"node-pg-migrate' apps/*/package.json libs/*/package.json
# Resultado: 0 coincidencias
```

**Resultado:** ✅ **CONFIRMADO**
- pg: NO presente en ningún workspace
- kysely: NO presente en ningún workspace
- node-pg-migrate: NO presente en ningún workspace

**Implicación:** Base de datos no funcional sin estas librerías

---

### B. Análisis de Catálogo Maestro (GDP-ARQ-022)

**Lectura del documento maestro:**
- Stack "aprobado" pero "baseline de versiones pendiente de POC/lockfile"
- 43 componentes listados
- Política de fijación clara (prohibe `latest`, requiere digest)

**Resultado:** ✅ **CONFIRMADO**
- Catálogo vigente existe
- Define versiones "baseline candidato"
- Actualmente NOT IMPLEMENTED en docker-compose

---

### C. Comparación Catálogo vs Lockfile (MATRIZ_VERSIONES_REALES.md)

**Resultados:**
- 5 componentes confirmados en versión esperada
- 7 componentes con versión anterior (funcional pero candidata)
- 17 componentes completamente faltantes
- 6 etiquetas móviles en Docker

**Clasificación:** ⚠️ **VERSIONES PARCIALMENTE COHERENTES**
- Lockfile tiene versiones estables pero anteriores a candidatos
- Componentes críticos faltantes
- Docker images sin versionado

---

## 📝 Limitaciones del Entorno Auditado

| Limitación | Severidad | Alternativa |
|-----------|-----------|-----------|
| Docker no disponible | 🔴 CRÍTICA | No se pueden validar imágenes, servicios, config de docker-compose |
| pnpm no ejecutable | 🔴 CRÍTICA | No se puede compilar, lintear, testear; no se puede listar deps |
| Filesystem muy lento | 🟡 ALTA | rm -rf node_modules toma >120s (timeout) |
| Node.js versión incorrecta | 🟡 MEDIA | Entorno sandbox fijo; .nvmrc es correcto |

**Conclusión:** El entorno de auditoría tiene limitaciones significativas que impiden validar compilación, testing y ejecución. Solo se pueden hacer análisis estáticos y en Git.

---

## 🎯 Recomendación de Validación Completa

Para completar validación reproducible:

**Entorno local del equipo de desarrollo debe ejecutar:**

```bash
# En laptop fresco o contenedor limpio:
git clone https://github.com/Escruceria/gestion_documental.git
cd gestion_documental

# Después de aplicar cambios de saneamiento:
rm -rf node_modules
corepack enable
corepack prepare pnpm@9.0.0 --activate

# EXPECTED DURATIONS (estimaciones preliminares):
pnpm install --frozen-lockfile          # ~2-3 minutos
pnpm -r run build                        # ~30-45 segundos
pnpm -r run lint                         # ~20-30 segundos
pnpm -r run test                         # ~1-2 minutos
docker compose config                    # <1 segundo
docker compose pull                      # ~5-10 minutos
docker compose up -d                     # ~30-60 segundos
docker compose ps                        # <1 segundo
```

**Criterios GO después de cambios:**
- ✅ pnpm install completa sin errores
- ✅ pnpm build completa sin errores
- ✅ pnpm lint sin warnings críticos
- ✅ pnpm test todos PASS
- ✅ docker compose up levanta 4 servicios
- ✅ all 4 servicios muestran "Up" en docker compose ps

---

## 📌 Hallazgos Críticos

### 1. **node_modules no es "corrupto"**
   - Descripción más precisa: "La instalación disponible en el entorno auditado no es ejecutable debido a symlinks rotos"
   - Causa probable: Instalación anterior incompleta o issues de filesystem
   - Solución: `pnpm install --force` en entorno donde pnpm sea ejecutable

### 2. **Docker images con tags móviles**
   - Violación de política (GDP-ARQ-022 sección 14)
   - Causa raíz: docker-compose.yml no seguía política de fijación
   - Solución: Fijar versiones + digests en docker-compose.yml

### 3. **Dependencias críticas de BD faltantes**
   - pg, kysely, node-pg-migrate: 0% presente
   - Impacto: 100% bloqueador para cualquier desarrollo DB
   - Solución: Agregar a libs/database/package.json

### 4. **Versiones candidatas vs instaladas**
   - Catálogo maestro propone versiones más nuevas (ej: NestJS 11, TypeScript 7)
   - Lockfile tiene versiones anteriores pero estables (ej: NestJS 10, TypeScript 5.3)
   - Decisión requerida: Mantener estable o upgradearse a candidatos

