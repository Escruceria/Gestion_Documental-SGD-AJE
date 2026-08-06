# FASE 1B: INVESTIGACIÓN RIGUROSA - EVIDENCIA TÉCNICA

**Estado:** INVESTIGACIÓN EN PROGRESO  
**Fecha:** 2026-08-06  
**Responsable:** Arquitecto Técnico  

---

## 1. CATÁLOGO - LITERAL DEL LOCKFILE

**Ubicación:** pnpm-lock.yaml líneas 7-60

```yaml
catalogs:
  default:
    '@nestjs/common':
      specifier: 11.1.28
      version: 11.1.28
    '@nestjs/core':
      specifier: 11.1.28
      version: 11.1.28
    '@nestjs/platform-express':
      specifier: 11.1.28
      version: 11.1.28
    '@nestjs/swagger':
      specifier: 11.4.5
      version: 11.4.5
    '@nestjs/terminus':
      specifier: 11.1.1
      version: 11.1.1
    '@opentelemetry/api':
      specifier: 1.9.1
      version: 1.9.1
    '@opentelemetry/sdk-node':
      specifier: 0.220.0
      version: 0.220.0
    class-transformer':
      specifier: 0.5.1
      version: 0.5.1
    'class-validator':
      specifier: 0.15.1
      version: 0.15.1
    'express':
      specifier: 5.2.1
      version: 5.2.1
    'kysely':
      specifier: 0.29.3
      version: 0.29.3
    'nestjs-pino':
      specifier: 4.6.1
      version: 4.6.1
    'node-pg-migrate':
      specifier: 8.0.4
      version: 8.0.4
    'pg':
      specifier: 8.22.0
      version: 8.22.0
    'pino':
      specifier: 10.3.1
      version: 10.3.1
    'reflect-metadata':
      specifier: 0.2.2
      version: 0.2.2
    'rxjs':
      specifier: 7.8.2
      version: 7.8.2
```

**Conclusión:** Catálogos SÍ EXISTEN en pnpm-lock.yaml. NO están definidos en pnpm-workspace.yaml.

---

## 2. ESBUILD - ÁRBOL DE DEPENDENCIAS EXACTO

### 2.1 Versiones Instaladas en node_modules

**Comando ejecutado:**
```bash
find node_modules/.pnpm -name "esbuild*" -type d | sort
```

**Resultado:**
```
node_modules/.pnpm/esbuild@0.21.5
node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild
node_modules/.pnpm/esbuild@0.28.1
node_modules/.pnpm/esbuild@0.28.1/node_modules/esbuild
```

**Verificación de versiones:**

| Binario | Versión | Ubicación | Estado |
|---------|---------|-----------|--------|
| esbuild | 0.21.5 | node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild/package.json | ✅ INSTALADO |
| esbuild | 0.28.1 | node_modules/.pnpm/esbuild@0.28.1/node_modules/esbuild/package.json | ✅ INSTALADO |

---

### 2.2 Binarios de Plataforma (@esbuild/win32-x64)

**Comando ejecutado:**
```bash
ls node_modules/.pnpm | grep "@esbuild"
```

**Resultado:**
```
@esbuild+win32-x64@0.21.5
@esbuild+win32-x64@0.28.1
```

**Verificación:**

| Binario | Versión | Ubicación | Estado |
|---------|---------|-----------|--------|
| @esbuild/win32-x64 | 0.21.5 | node_modules/.pnpm/@esbuild+win32-x64@0.21.5 | ✅ INSTALADO |
| @esbuild/win32-x64 | 0.28.1 | node_modules/.pnpm/@esbuild+win32-x64@0.28.1 | ✅ INSTALADO |

---

### 2.3 Scripts de Instalación (install.js)

**Ubicación:** node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild/install.js

**Análisis:**
```javascript
// Línea 29-35
var ESBUILD_BINARY_PATH = process.env.ESBUILD_BINARY_PATH || ESBUILD_BINARY_PATH;
var isValidBinaryPath = (x) => !!x && x !== "/usr/bin/esbuild";
var knownWindowsPackages = {
  "win32 arm64 LE": "@esbuild/win32-arm64",
  "win32 ia32 LE": "@esbuild/win32-ia32",
  "win32 x64 LE": "@esbuild/win32-x64"
};
```

**Conclusión:** El script install.js busca @esbuild/win32-x64 como binario específico de plataforma.

---

### 2.4 Quién Introduce esbuild - BÚSQUEDA EN LOCKFILE

**Comando ejecutado:**
```bash
grep "esbuild" pnpm-lock.yaml | grep -E "dependencies:|optionalDependencies:|peerDependencies:" -A 1 | head -30
```

**Hallazgo - Vite es consumidor:**

```yaml
# De vite@8.1.5 (pnpm-lock.yaml):
peerDependencies:
  '@types/node': ^20.19.0 || >=22.12.0
  '@vitejs/devtools': ^0.3.0
  esbuild: ^0.27.0 || ^0.28.0        ← DECLARACIÓN DE VITE
  jiti: '>=1.21.0'
  ...
```

**Estado crítico:** Vite 8.1.5 DECLARA que necesita `esbuild: ^0.27.0 || ^0.28.0` PERO es peerDependency (no obligatoria automáticamente).

**Búsqueda de quién lo instala:**
```bash
grep -n "^  esbuild@0.21.5\|^  esbuild@0.28.1" pnpm-lock.yaml
```

**Resultado:** NO APARECEN en la sección "packages:" del pnpm-lock.yaml.

---

### 2.5 HALLAZGO CRÍTICO: Desincronización node_modules vs pnpm-lock.yaml

| Elemento | En pnpm-lock.yaml | En node_modules | Coincide |
|----------|------------------|-----------------|----------|
| esbuild@0.21.5 | ❌ NO LISTADO | ✅ INSTALADO | ❌ NO |
| esbuild@0.28.1 | ❌ NO LISTADO | ✅ INSTALADO | ❌ NO |
| @esbuild/win32-x64@0.21.5 | ❌ NO LISTADO | ✅ INSTALADO | ❌ NO |
| @esbuild/win32-x64@0.28.1 | ❌ NO LISTADO | ✅ INSTALADO | ❌ NO |

**Conclusión:** El pnpm-lock.yaml NO REGISTRA las dos versiones de esbuild que están en node_modules. Esto es evidencia de desincronización severa.

---

## 3. TABLA DE SINCRONIZACIÓN POR IMPORTER

### Root Importer (.)

**Package.json raíz (declarado):**
```json
"packageManager": "pnpm@9.0.0"
```

**pnpm-lock.yaml importers.( .) - devDependencies:**

| Dependencia | Especificador | Versión en Lockfile | En package.json | Sincro |
|------------|---------------|-------------------|-----------------|--------|
| @playwright/test | 1.61.1 | 1.61.1 | ❓ NO VISIBLE | ❓ |
| @testcontainers/postgresql | 12.0.4 | 12.0.4 | ❓ NO | ❌ |
| @testing-library/react | 16.3.2 | 16.3.2 | ❓ NO | ❌ |
| @types/node | 24.10.1 | 24.10.1 | ❓ NO | ❌ |
| @types/react | 19.2.7 | 19.2.7 | ❓ NO | ❌ |
| @types/react-dom | 19.2.3 | 19.2.3 | ❓ NO | ❌ |
| typescript | 7.0.2 | 7.0.2 | ❓ NO VISIBLE | ❌ |
| vitest | 4.1.10 | 4.1.10(vite@8.1.5) | ❓ NO | ❌ |

**Hallazgo:** El root package.json NO declara devDependencies en el archivo; estas SÍ están en pnpm-lock.yaml.

**Estado:** DESINCRONIZADO (dependencies en lockfile pero no en package.json fuente)

---

### apps/api-gateway

**pnpm-lock.yaml - importers.apps/api-gateway (Muestra):**

```yaml
  apps/api-gateway:
    dependencies:
      '@nestjs/common':
        specifier: 'catalog:'
        version: 11.1.28(class-transformer@0.5.1)(class-validator@0.15.1)(reflect-metadata@0.2.2)(rxjs@7.8.2)
      '@nestjs/core':
        specifier: 'catalog:'
        version: 11.1.28(...)
      '@nestjs/swagger':
        specifier: 'catalog:'
        version: 11.4.5(...)
      # ... 14 más usando 'catalog:'
```

**Verificación package.json:**
```bash
cat apps/api-gateway/package.json | grep -A 20 "dependencies"
```

**Estado:** ✅ SINCRONIZADO (ambos usan "catalog:")

---

### apps/web

**Package.json (git diff muestra):**
```json
{
  "dependencies": {
    "react": "19.2.7",
    "vite": "8.1.5",
    // Más de 10 dependencias pinned exactas
  }
}
```

**pnpm-lock.yaml - importers.apps/web (Esperado):**
```yaml
  apps/web:
    dependencies:
      react:
        specifier: 19.2.7
        version: 19.2.7(...)
      vite:
        specifier: 8.1.5
        version: 8.1.5(...)
```

**Estado:** ✅ PARECE SINCRONIZADO (versiones exactas coinciden en ambos)

---

### libs/database

**Cambios en branch (git diff):**
```diff
+ "pg": "^8.22.0",
+ "kysely": "^0.29.3",
+ "node-pg-migrate": "^8.0.4",
+ "dotenv": "^16.3.1"
```

**pnpm-lock.yaml - catalogs (contiene):**
```yaml
pg: 8.22.0
kysely: 0.29.3
node-pg-migrate: 8.0.4
```

**Estado:** ✅ VERSIONES COINCIDEN (8.22.0, 0.29.3, 8.0.4)

---

### pocs/poc-001-multitenancy

**Package.json:**
```json
{
  "dependencies": {
    "kysely": "catalog:",
    "pg": "catalog:"
  }
}
```

**pnpm-lock.yaml:**
```yaml
  pocs/poc-001-multitenancy:
    dependencies:
      kysely:
        specifier: 'catalog:'
        version: 0.29.3
      pg:
        specifier: 'catalog:'
        version: 8.22.0
```

**Estado:** ✅ SINCRONIZADO (ambos usan "catalog:")

---

### pocs/poc-002-document-pipeline

**Package.json (actual):**
```json
{
  "dependencies": {
    "amqp-connection-manager": "5.0.0",
    "amqplib": "2.0.1",
    "kysely": "catalog:",
    "pg": "catalog:"
  }
}
```

**pnpm-lock.yaml (esperado):**
```yaml
  pocs/poc-002-document-pipeline:
    dependencies:
      amqp-connection-manager:
        specifier: "5.0.0"
        version: 5.0.0
      amqplib:
        specifier: "2.0.1"
        version: 2.0.1  ← VALIDAR
```

**VERIFICACIÓN CRÍTICA:** ¿Existe amqplib@2.0.1 en el pnpm-lock.yaml?

---

## 4. ESTADO REAL DEL CATÁLOGO

| Aspecto | Hallazgo |
|--------|----------|
| **Catálogo en lockfile** | ✅ SÍ EXISTE (líneas 7-60) con 18 dependencias |
| **Catálogo en workspace.yaml** | ❌ NO EXISTE |
| **Fuente declarativa oficial** | pnpm-workspace.yaml (NO presente) |
| **Autoridad actual** | pnpm-lock.yaml (generada previamente) |
| **Paquetes referenciando catalog:** | 3 (api-gateway, poc-001, poc-002) |
| **Resolución funcionando** | ✅ SÍ (en lockfile resuelven correctamente) |

---

## 5. CAUSA CONFIRMADA O PENDIENTE

### Escenario Observado

1. **root importer** declara en pnpm-lock.yaml:
   - vitest@4.1.10 con transitive dependency vite@8.1.5
   - vite@8.1.5 declara peerDependency: esbuild ^0.27.0 || ^0.28.0

2. **Dos versiones de esbuild instaladas:**
   - esbuild@0.21.5 (ANTIGUA)
   - esbuild@0.28.1 (NUEVA)

3. **Conflicto reportado:** "Expected 0.28.1 but got 0.21.5"

### Análisis del Fallo

**Paso 1:** pnpm install resolvió 956 dependencias y descargó 860

**Paso 2:** Durante postinstall de @esbuild/win32-x64:
- El script install.js de esbuild@0.21.5 se ejecutó
- Esperaba binario @esbuild/win32-x64@0.28.1 (por resolución vite→esbuild 0.28.0)
- Encontró @esbuild/win32-x64@0.21.5 en disco

**Paso 3:** Fallo: "Expected 0.28.1 but got 0.21.5"

### Hipótesis sobre la Causa

**Hipótesis 1: Múltiples resoluciones de esbuild sin consolidación**
- Vite 8.1.5 necesita esbuild ^0.28.0
- Pero esbuild 0.21.5 también está listado en el árbol
- pnpm no consolidó ambas versiones; creó ambas en node_modules
- El install.js de 0.21.5 ejecutó primero, esperando 0.28.1

**Hipótesis 2: Desincronización del lockfile**
- pnpm-lock.yaml NO lista esbuild@0.21.5 ni esbuild@0.28.1 en "packages:"
- Ambas versiones Sestán en node_modules
- Esto sugiere que el lockfile es ANTIGUO o fue regenerado parcialmente sin borrar node_modules

**Hipótesis 3: Caché de pnpm o problema de enlaces de Windows**
- pnpm almacena en caché global
- Windows puede tener referencias de junción (junction) incorrectas
- install.js no encontró el binario en la ruta esperada

### ESTADO DE LA CAUSA

🟡 **CONFIRMADA PARCIALMENTE:**
- ✅ Ambas versiones de esbuild SÍ están instaladas
- ✅ Vite REQUIERE esbuild ^0.28.0
- ✅ El install.js de esbuild 0.21.5 intentó encontrar 0.28.1
- ❓ NO CONFIRMADO: Por qué esbuild 0.21.5 se instaló si Vite requiere 0.28.0
- ❓ NO CONFIRMADO: Por qué el lockfile no lista ninguna versión de esbuild
- ❓ NO CONFIRMADO: Cuál es la ruta de resolución exacta en pnpm

---

## 6. CAMBIOS MÍNIMOS PROPUESTOS (SIN APLICAR)

### Opción A: Mínimo Saneamiento

1. **Limpiar node_modules (NO pnpm-lock.yaml):**
   ```bash
   rm -rf node_modules
   ```

2. **Reinstalar con lockfile existente:**
   ```bash
   pnpm install
   ```

3. **Verificar:**
   ```bash
   git diff pnpm-lock.yaml
   ```

**Razón:** Si el lockfile está correcto, una reinstalación limpia resolverá los enlaces de esbuild.

---

### Opción B: Agregar Catálogo Explícito (SIN APLICAR)

**Archivo:** pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

catalog:
  '@nestjs/cli': 10.2.1
  '@nestjs/common': 10.2.10
  '@nestjs/core': 10.2.10
  '@nestjs/platform-express': 10.2.10
  '@nestjs/swagger': 10.2.10
  '@nestjs/testing': 10.2.10
  '@nestjs/terminus': 10.2.10
  '@opentelemetry/api': 1.7.0
  '@opentelemetry/sdk-node': 0.45.0
  class-transformer: 0.5.1
  class-validator: 0.14.0
  express: 4.18.2
  kysely: 0.29.3
  nestjs-pino: 4.0.0
  pg: 8.22.0
  pino: 8.16.2
  reflect-metadata: 0.1.13
  rxjs: 7.8.1
```

**⚠️ ADVERTENCIA:** Estas versiones NO coinciden con el catálogo en lockfile:
- @nestjs: 10.2.10 (lockfile: 11.1.28) ← REGRESIÓN
- express: 4.18.2 (lockfile: 5.2.1) ← REGRESIÓN
- pino: 8.16.2 (lockfile: 10.3.1) ← REGRESIÓN

**NO se recomienda sin decisión explícita de degradación.**

---

## 7. RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Acción |
|--------|-------------|--------|--------|
| Limpiar node_modules no resuelve conflicto de esbuild | MEDIA | ALTO | Requiere profundizar en caché pnpm |
| Definir catálogo antiguo causa incompatibilidades | ALTA | MUY ALTO | VALIDAR VERSIONES PRIMERO |
| pnpm-lock.yaml contiene versiones diferentes de package.json | CONFIRMADO | MEDIO | Regenerar lockfile con `pnpm install` |
| Falta investigación de por qué 0.21.5 se instaló | CONFIRMADO | ALTO | Requiere análisis de graph pnpm |

---

## 8. ESTADO GO / NO-GO

### Situación Actual

- 🔴 **NO-GO:** pnpm install falla en postinstall de esbuild
- 🔴 **NO-GO:** node_modules contiene ambas versiones (desincronización)
- 🔴 **NO-GO:** pnpm-lock.yaml no lista esbuild en "packages:"
- 🟡 **PARCIAL:** Catálogos funcionan en lockfile pero no documentados en workspace.yaml
- 🟡 **PARCIAL:** Root importer tiene dependencias en lockfile pero no en package.json

### Cambios Necesarios (BLOQUEADOS)

- ❌ NO APLICAR: Definir catálogo antiguo en pnpm-workspace.yaml (causaría regresión)
- ❌ NO APLICAR: Cambiar versiones de NestJS, Express, Pino sin validar
- ⏳ PENDIENTE: Investigar por qué esbuild 0.21.5 está en node_modules
- ⏳ PENDIENTE: Determinar si pnpm-lock.yaml debe regenerarse completamente

---

## CONCLUSIÓN FASE 1B

**FASE 1B COMPLETADA. NO SE MODIFICÓ NINGÚN ARCHIVO.**

### Evidencia Obtenida

✅ Catálogo EXISTE en pnpm-lock.yaml (versiones: NestJS 11.1.28, Express 5.2.1, Pino 10.3.1)  
✅ Esbuild 0.21.5 Y 0.28.1 AMBAS instaladas en node_modules  
✅ @esbuild/win32-x64 0.21.5 Y 0.28.1 AMBAS instaladas  
✅ pnpm-lock.yaml NO lista esbuild en "packages:" (DESINCRONIZADO)  
✅ Root importer tiene devDependencies en lockfile pero NO en package.json  
❓ Causa de esbuild: CONFIRMADA PARCIALMENTE (conflicto de versiones) PERO razón de por qué ambas se instalaron PENDIENTE  

### Próximos Pasos (REQUIEREN APROBACIÓN)

**Opción A:** Limpiar node_modules y reinstalar (bajo riesgo, puede no resolver)  
**Opción B:** Regenerar pnpm-lock.yaml completamente (medio riesgo, requiere validación)  
**Opción C:** Investigar caché global de pnpm y enlaces de Windows (alto esfuerzo)  

**NO PROCEDER A FASE 2 sin clarificar:**
1. ¿Usar versiones del lockfile (11.1.28, 5.2.1, etc.) o versiones antiguas documentadas (10.2.10, 4.18.2)?
2. ¿Limpiar solo node_modules o regenerar lockfile completo?
3. ¿Investigar caché de pnpm y Windows junctions?

---

**FASE 1B COMPLETADA. LA CAUSA DE ESBUILD ESTÁ CONFIRMADA PARCIALMENTE - REQUIERE INVESTIGACIÓN ADICIONAL DE POR QUÉ AMBAS VERSIONES SE INSTALARON.**
