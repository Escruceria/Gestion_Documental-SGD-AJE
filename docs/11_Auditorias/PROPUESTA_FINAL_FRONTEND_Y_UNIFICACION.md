# PROPUESTA FINAL: CORRECCIÓN DE FRONTEND Y UNIFICACIÓN COMPLETA

**Estado:** PROPUESTA FINAL (sin aplicar)  
**Fecha:** 2026-08-06  

---

## CORRECCIÓN DE DIAGNÓSTICO

### Error Cometido

❌ **Afirmación anterior:** "apps/frontend es una aplicación REAL con código funcional"

**Realidad:** Ambos apps/frontend y apps/web son **scaffolds sin desarrollo funcional**

### Diagnóstico Correcto

| Aspecto | apps/frontend | apps/web |
|---------|---------------|----------|
| **Tipo** | ❌ Scaffold sin código | ❌ Scaffold sin código |
| **src/** | Existe pero vacío (solo .gitkeep + main.tsx básico) | No existe |
| **Componentes** | NINGUNO | NINGUNO |
| **Rutas** | NINGUNA | NINGUNA |
| **Lógica funcional** | NINGUNA | NINGUNA |
| **Estado** | Plantilla inicial sin desarrollo | Plantilla inicial sin desarrollo |

### Conclusión Corregida

Ambas carpetas son **scaffolds sin implementación funcional**. No hay código legado que proteger, componentes que migrar, ni lógica que riesgo de romper.

---

## DECISIÓN ARQUITECTÓNICA APROBADA

✅ **Ruta Canónica:** `apps/frontend`

✅ **A Retirar:** `apps/web` (manifiesto duplicado)

✅ **Línea Base:** 
- React 19.2.7
- Vite 8.1.5
- TypeScript 7.0.2
- Vitest 4.1.10
- esbuild 0.28.1
- Node.js 24.18.0

---

## CLASIFICACIÓN DE DEPENDENCIAS: apps/web → apps/frontend

### Análisis por Dependencia

| Dependencia | Versión | Necesaria para MVP | Decisión | Justificación |
|------------|---------|-------------------|----------|---------------|
| @emotion/react | 11.14.0 | ❓ | PENDIENTE | Styling. Requiere decisión de estrategia CSS (Emotion vs TailwindCSS vs CSS puro) |
| @emotion/styled | 11.14.1 | ❓ | PENDIENTE | Styled components. Depende de decisión de @emotion/react |
| @hookform/resolvers | 5.4.0 | ❌ | NO | Formularios complejos. MVP puede usar HTML5 nativo o React Hook Form sin resolvers |
| @mui/icons-material | 9.2.0 | ❓ | PENDIENTE | Icons. Necesita decisión de librería de UI (Material-UI vs Ant vs Shadcn) |
| @mui/material | 9.2.0 | ❓ | PENDIENTE | UI Components. Estrategia de componentes visual |
| @tanstack/react-query | 5.101.2 | ✅ | SÍ | Data fetching. Necesario para manejo de estado servidor en MVP |
| date-fns | 4.4.0 | ✅ | SÍ | Manipulación de fechas. MVP necesita mostrar y procesar fechas |
| i18next | 26.3.6 | ❓ | PENDIENTE | Internacionalización. MVP inicial es español (solo es); decisión de i18n puede postergarse |
| react-i18next | 17.0.10 | ❓ | PENDIENTE | Depende de decisión de i18next |
| keycloak-js | 26.2.4 | ✅ | SÍ | Autenticación. Keycloak está en arquitectura; necesario para flujo de login |
| openapi-fetch | 0.17.0 | ✅ | SÍ | Cliente tipado OpenAPI. MVP requiere llamadas a API backend; esta librería es ligera y tipada |
| react-hook-form | 7.81.0 | ✅ | SÍ | Gestión de formularios. MVP necesita captura de datos (login, create doc) |
| react-router | 8.2.0 | ✅ | SÍ | Routing. MVP requiere navegación entre secciones |
| zod | 4.4.3 | ✅ | SÍ | Validación de esquemas. Complemento para react-hook-form y validación cliente |
| zustand | 5.0.14 | ✅ | SÍ | State management. MVP requiere estado global (usuario actual, context tenant, etc) |

### Resumen

**Agregar ahora (MVP):** 10 dependencias
- @tanstack/react-query
- date-fns
- keycloak-js
- openapi-fetch
- react-hook-form
- react-router
- zod
- zustand

**Pendiente de decisión (Diseño UI/Componentes):** 4 dependencias
- @emotion/react, @emotion/styled (Styling)
- @mui/material, @mui/icons-material (UI Components)

**No agregar (No necesarias para MVP):** 2 dependencias
- @hookform/resolvers (Formularios avanzados; puede usarse react-hook-form puro)
- i18next, react-i18next (Internacionalización postergable)

---

## PACKAGE.JSON CANÓNICO - apps/frontend

```json
{
  "name": "@gestion-documental/frontend",
  "version": "0.1.0",
  "type": "module",
  "description": "Frontend principal para Sistema de Gestión Documental",
  "engines": {
    "node": "24.18.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "@tanstack/react-query": "5.101.2",
    "date-fns": "4.4.0",
    "keycloak-js": "26.2.4",
    "openapi-fetch": "0.17.0",
    "react-hook-form": "7.81.0",
    "react-router": "8.2.0",
    "zod": "4.4.3",
    "zustand": "5.0.14"
  },
  "devDependencies": {
    "@types/node": "24.18.0",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "4.2.1",
    "@vitest/ui": "4.1.10",
    "eslint": "8.54.0",
    "@typescript-eslint/eslint-plugin": "6.13.2",
    "@typescript-eslint/parser": "6.13.2",
    "typescript": "7.0.2",
    "vite": "8.1.5",
    "vitest": "4.1.10"
  }
}
```

**Notas:**
- Versiones exactas (sin carets) alineadas con política de catálogo
- DevDependencies incluyen toolchain completo
- Scripts incluyen dev, build, preview, lint, type-check, test
- Sin dependencias de UI Framework (Emotion, Material-UI) hasta decisión arquitectónica

---

## CATÁLOGO COMPLETO PROPUESTO

```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

catalog:
  # NestJS Backend Framework
  '@nestjs/cli': 11.1.28
  '@nestjs/common': 11.1.28
  '@nestjs/core': 11.1.28
  '@nestjs/platform-express': 11.1.28
  '@nestjs/swagger': 11.4.5
  '@nestjs/testing': 11.1.28
  '@nestjs/terminus': 11.1.1
  
  # OpenTelemetry
  '@opentelemetry/api': 1.9.1
  '@opentelemetry/sdk-node': 0.220.0
  
  # NestJS Plugins
  'class-transformer': 0.5.1
  'class-validator': 0.15.1
  'nestjs-pino': 4.6.1
  'pino': 10.3.1
  
  # Core Dependencies
  'express': 5.2.1
  'reflect-metadata': 0.2.2
  'rxjs': 7.8.2
  
  # Database & ORM
  'kysely': 0.29.3
  'pg': 8.22.0
  'node-pg-migrate': 8.0.4
  
  # Frontend
  'react': 19.2.7
  'react-dom': 19.2.7
  '@tanstack/react-query': 5.101.2
  'date-fns': 4.4.0
  'keycloak-js': 26.2.4
  'openapi-fetch': 0.17.0
  'react-hook-form': 7.81.0
  'react-router': 8.2.0
  'zod': 4.4.3
  'zustand': 5.0.14
  
  # Build Tools (No en catálogo; cada workspace puede tener versión diferente)
  # typescript: 7.0.2
  # vite: 8.1.5
  # vitest: 4.1.10
  # eslint: 8.54.0
  # @types/node: 24.18.0
```

**Decisión:** Excluir TypeScript, Vite, Vitest, ESLint del catálogo (cada workspace puede tener versión específica si es necesario)

---

## ESTRUCTURA LIMPIA - apps/frontend

```
apps/frontend/
├── index.html          (Punto de entrada HTML)
├── package.json        (Canónico, sin cambios manuales)
├── tsconfig.json       (Heredado de base, con ajustes React)
├── vite.config.ts      (Configuración Vite 8 + proxy API)
├── vitest.config.ts    (Configuración Vitest)
├── .eslintrc.json      (Linter config)
├── src/
│   ├── main.tsx        (Punto de entrada React)
│   ├── App.tsx         (Componente raíz - VACÍO)
│   ├── App.css         (Estilos raíz - VACÍO)
│   ├── index.css       (Estilos globales - VACÍO)
│   └── ...
└── public/
    └── (Assets vacíos)
```

**Cambios necesarios:**

1. Reemplazar package.json actual por canónico
2. Limpiar src/ dejando solo scaffolds

---

## LISTA DE ARCHIVOS A RETIRAR: apps/web

```
apps/web/
├── .gitkeep
├── node_modules/      (Automático con pnpm)
└── package.json
```

**Acción:** Eliminar directorio completo `apps/web/`

---

## CAMBIOS A APLICAR - ORDEN EXACTO

### PASO 1: Crear pnpm-workspace.yaml con catálogo

**Archivo:** `pnpm-workspace.yaml`

```diff
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

+catalog:
+  '@nestjs/cli': 11.1.28
+  '@nestjs/common': 11.1.28
+  # ... (18 dependencias más)
```

### PASO 2: Actualizar package.json raíz

**Archivo:** `package.json`

```diff
{
-  "packageManager": "pnpm@9.0.0",
+  "packageManager": "pnpm@9.15.3",
  # ... rest igual
}
```

### PASO 3: Reemplazar apps/frontend/package.json

**Archivo:** `apps/frontend/package.json`

Reemplazar completamente por el package.json canónico anterior.

### PASO 4: Actualizar 6 microservicios

**Archivos:** apps/audit-compliance-service, apps/correspondence-workflow-service, apps/document-core-service, apps/document-processing-worker, apps/identity-access-service, apps/notification-integration-service

```diff
{
  "dependencies": {
-   "@nestjs/common": "^10.2.10",
+   "@nestjs/common": "catalog:",
    # ... más deps a catalog:
  },
  "devDependencies": {
-   "@types/node": "^20.9.0",
+   "@types/node": "^24.18.0",
-   "typescript": "^5.3.3",
+   "typescript": "^7.0.2",
-   "vitest": "^1.0.4"
+   "vitest": "^4.1.10"
  }
}
```

### PASO 5: Actualizar 5 librerías

**Archivos:** libs/config, libs/middleware, libs/shared-types, libs/database, libs/testing

```diff
{
  "devDependencies": {
-   "typescript": "^5.3.3",
+   "typescript": "^7.0.2",
-   "vitest": "^1.0.4"
+   "vitest": "^4.1.10"
  }
}
```

**libs/database adicional:**
```diff
{
  "dependencies": {
-   "pg": "^8.22.0",
+   "pg": "catalog:",
-   "kysely": "^0.29.3",
+   "kysely": "catalog:",
  }
}
```

### PASO 6: Actualizar 2 POCs

**Archivos:** pocs/poc-001-multitenancy, pocs/poc-002-document-pipeline

```diff
{
  "dependencies": {
    "kysely": "catalog:",
    "pg": "catalog:"
  },
  "devDependencies": {
+   "@types/node": "^24.18.0",
+   "typescript": "^7.0.2",
-   "vitest": "4.1.10"
+   "vitest": "^4.1.10"
  }
}
```

### PASO 7: Eliminar apps/web

**Acción:** Eliminar directorio completo

```bash
Remove-Item -Recurse -Force apps/web
```

### PASO 8: Regenerar pnpm-lock.yaml

**Acción:**

```bash
rm -Force pnpm-lock.yaml
pnpm install
```

---

## DIFFS PROPUESTOS (RESUMIDO)

### apps/frontend/package.json

```diff
{
  "name": "@app/frontend",
- "version": "0.0.0",
+ "version": "0.1.0",
+ "description": "Frontend principal para Sistema de Gestión Documental",
+ "engines": { "node": "24.18.0" },
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
+   "preview": "vite preview",
+   "lint": "eslint src --ext ts,tsx",
+   "type-check": "tsc --noEmit",
+   "test": "vitest",
+   "test:ui": "vitest --ui"
  },
  "dependencies": {
-   "react": "^18.2.0",
-   "react-dom": "^18.2.0",
+   "react": "19.2.7",
+   "react-dom": "19.2.7",
    "axios": "^1.6.2",
+   "@tanstack/react-query": "5.101.2",
+   "date-fns": "4.4.0",
+   "keycloak-js": "26.2.4",
+   "openapi-fetch": "0.17.0",
+   "react-hook-form": "7.81.0",
+   "react-router": "8.2.0",
+   "zod": "4.4.3",
+   "zustand": "5.0.14"
  },
  "devDependencies": {
+   "@types/node": "24.18.0",
+   "@types/react": "19.2.7",
+   "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "^4.2.1",
-   "typescript": "^5.3.3",
+   "@vitest/ui": "4.1.10",
+   "eslint": "8.54.0",
+   "@typescript-eslint/eslint-plugin": "6.13.2",
+   "@typescript-eslint/parser": "6.13.2",
+   "typescript": "7.0.2",
-   "vite": "^5.0.2"
+   "vite": "8.1.5",
+   "vitest": "4.1.10"
  }
}
```

---

## PLAN POWERSHELL DE APLICACIÓN

```powershell
# Script de aplicación - Saneamiento Frontend y Unificación

# PASO 1: Verificar estado actual
Write-Host "1. Verificando estado actual..." -ForegroundColor Cyan
git status
git diff --name-only

# PASO 2: Crear backup
Write-Host "2. Creando backup..." -ForegroundColor Cyan
Copy-Item -Recurse "apps/frontend" -Destination "apps/frontend.backup"
Copy-Item -Recurse "apps/web" -Destination "apps/web.backup"

# PASO 3: Agregar catálogo a pnpm-workspace.yaml
Write-Host "3. Actualizando pnpm-workspace.yaml..." -ForegroundColor Cyan
# (Usar Edit tool para agregar catálogo)

# PASO 4: Actualizar package.json raíz
Write-Host "4. Actualizando package.json raíz..." -ForegroundColor Cyan
# (pnpm@9.15.3)

# PASO 5: Reemplazar apps/frontend/package.json
Write-Host "5. Reemplazando apps/frontend/package.json..." -ForegroundColor Cyan
# (Usar canónico)

# PASO 6: Actualizar 6 microservicios
Write-Host "6. Actualizando 6 microservicios..." -ForegroundColor Cyan
# (Cambiar deps a catalog:, actualizar devDeps)

# PASO 7: Actualizar 5 librerías
Write-Host "7. Actualizando 5 librerías..." -ForegroundColor Cyan
# (TypeScript 5→7, Vitest 1→4)

# PASO 8: Actualizar 2 POCs
Write-Host "8. Actualizando 2 POCs..." -ForegroundColor Cyan
# (Agregar @types/node, TypeScript, Vitest)

# PASO 9: Eliminar apps/web
Write-Host "9. Eliminando apps/web..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "apps/web"

# PASO 10: Regenerar lockfile
Write-Host "10. Regenerando pnpm-lock.yaml..." -ForegroundColor Cyan
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
pnpm install

# PASO 11: Verificar
Write-Host "11. Verificando cambios..." -ForegroundColor Green
git diff --stat
pnpm -r ls
pnpm -r run build
pnpm -r run lint
pnpm -r run test --run
```

---

## GATES DE VALIDACIÓN

```bash
# 1. ✅ Sintaxis JSON válida
node -e "require('./package.json')" && echo "✅ Root package.json"
node -e "require('./apps/frontend/package.json')" && echo "✅ Frontend package.json"

# 2. ✅ Catálogo resuelto
pnpm ls 2>&1 | head -20

# 3. ✅ apps/web eliminado
test ! -d apps/web && echo "✅ apps/web eliminado" || echo "❌ apps/web aún existe"

# 4. ✅ TypeScript uniforme
grep -r '"typescript"' . --include="package.json" ! -path "./node_modules/*" | grep -v "7.0.2" | wc -l
# Debe retornar: 0 (todos en 7.0.2)

# 5. ✅ Vitest uniforme
grep -r '"vitest"' . --include="package.json" ! -path "./node_modules/*" | grep -v "4.1.10" | wc -l
# Debe retornar: 0 (todos en 4.1.10)

# 6. ✅ Compilación
pnpm -r run build

# 7. ✅ Linting
pnpm -r run lint

# 8. ✅ Tests
pnpm -r run test --run

# 9. ✅ Solo Vite 8 presente
ls node_modules/.pnpm | grep "vite@" | grep -c "8.1.5"
# Debe retornar: 1

# 10. ✅ Solo esbuild 0.28.1
ls node_modules/.pnpm | grep "esbuild@" | grep -c "0.28.1"
# Debe retornar: 1
```

---

## CORRECCIÓN DOCUMENTAL

### Actualizar: docs/11_Auditorias/INVESTIGACION_ESBUILD_Y_FRONTENDS.md

**Sección A.10 CONCLUSIÓN - REEMPLAZAR:**

```markdown
### Diagnóstico Correcto

✅ **Ambos son scaffolds sin código funcional**
- apps/frontend: Scaffold inicial (solo vite.config, tsconfig, main.tsx básico)
- apps/web: Scaffold sin implementación
- NO hay código legado que proteger
- NO hay componentes que migrar
- NO hay lógica que riesgo de romper

### Recomendación CORREGIDA

**🟢 OPCIÓN A APROBADA:**
- Mantener apps/frontend como ruta canónica
- Retirar apps/web (manifiesto duplicado sin código)
- Usar dependencias de apps/web como insumo para decisiones arquitectónicas (no migración automática)
- Agregar solo dependencias justificadas por MVP (10 de 18 originales)
```

---

## RESUMEN DE CAMBIOS

| Elemento | Acción | Archivos |
|----------|--------|----------|
| **pnpm-workspace.yaml** | Crear catálogo | 1 archivo |
| **package.json (root)** | Actualizar pnpm a 9.15.3 | 1 archivo |
| **apps/frontend** | Reemplazar completamente | 1 archivo (package.json) |
| **6 Microservicios** | Cambiar a catalog:, actualizar devDeps | 6 archivos |
| **5 Librerías** | Actualizar TypeScript/Vitest | 5 archivos |
| **2 POCs** | Agregar @types/node, TypeScript | 2 archivos |
| **apps/web** | Eliminar directorio | - |
| **pnpm-lock.yaml** | Regenerar | 1 archivo |

**Total: 17 archivos modificados, 1 directorio eliminado**

---

## RIESGOS FINALES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Regenerar lockfile introduce nuevas resoluciones | MEDIA | MEDIO | Validar compilación post-regeneración |
| Eliminar apps/web afecta CI/CD desconocida | BAJA | BAJO | No hay referencias documentadas |
| esbuild sigue conflictivo | BAJA | BAJO | Validar: solo 0.28.1 post-regeneración |
| TypeScript 5→7 introduce errores | BAJA | BAJO | Ejecutar `pnpm -r run build` y `type-check` |

---

**DECISIÓN DE FRONTEND CORREGIDA. AMBOS ERAN SCAFFOLDS. APPS/FRONTEND QUEDA COMO RUTA CANÓNICA. NO SE MODIFICÓ NINGÚN ARCHIVO. ESPERANDO APROBACIÓN.**
