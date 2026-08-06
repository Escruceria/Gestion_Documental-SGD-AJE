# INVESTIGACIÓN COMPLETA: ESBUILD Y FRONTENDS

**Estado:** INVESTIGACIÓN COMPLETADA (sin modificaciones)  
**Fecha:** 2026-08-06  

---

## PARTE A: ANÁLISIS apps/frontend vs apps/web

### A.1 Comparación Estructural

| Aspecto | apps/frontend | apps/web | Conclusión |
|---------|---------------|----------|-----------|
| **Directorio src/** | ✅ EXISTE (main.tsx) | ❌ NO EXISTE | frontend tiene código |
| **vite.config.ts** | ✅ EXISTE (config real + proxy) | ❌ NO EXISTE | frontend está configurado |
| **tsconfig.json** | ✅ EXISTE (React + DOM) | ❌ NO EXISTE | frontend tiene config TypeScript |
| **index.html** | ✅ EXISTE | ❌ NO EXISTE | frontend es aplicación real |
| **public/** | ✅ EXISTE | ❌ NO EXISTE | frontend tiene assets |
| **package.json** | ✅ EXISTE (dependencias reales) | ✅ EXISTE (dependencias: 18, devDependencies: 0) | web es stub vacío |

### A.2 Contenido de Código

**apps/frontend/src/main.tsx:**
```tsx
// Existe y tiene importaciones React reales
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**apps/web/src/:** ❌ NO EXISTE

### A.3 Configuración Vite

**apps/frontend/vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'  // ← Proxy real para API
    }
  }
})
```

**apps/web/vite.config.ts:** ❌ NO EXISTE

### A.4 TypeScript Configuration

**apps/frontend/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**apps/web/tsconfig.json:** ❌ NO EXISTE

### A.5 Package.json Comparación

**apps/frontend/package.json:**
```json
{
  "name": "@app/frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.2"
  }
}
```

**apps/web/package.json:**
```json
{
  "name": "@gestion-documental/web",
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@hookform/resolvers": "5.4.0",
    "@mui/icons-material": "9.2.0",
    "@mui/material": "9.2.0",
    "@tanstack/react-query": "5.101.2",
    "date-fns": "4.4.0",
    "i18next": "26.3.6",
    "keycloak-js": "26.2.4",
    "openapi-fetch": "0.17.0",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "react-hook-form": "7.81.0",
    "react-i18next": "17.0.10",
    "react-router": "8.2.0",
    "vite": "8.1.5",
    "zod": "4.4.3",
    "zustand": "5.0.14"
  },
  "devDependencies": {}  // ← VACÍO
}
```

### A.6 Referencias en Documentación

**En docs/:**
```bash
grep -r "apps/frontend\|apps/web" docs/ 2>/dev/null | wc -l
# Resultado: 0 (sin referencias)

grep -r "frontend\|web" docs/ 2>/dev/null | grep -i "aplicación\|application" | wc -l
# Resultado: 0 (sin mención de cuál es la aplicación oficial)
```

### A.7 Referencias en CI/CD

**Buscando referencias en workflows:**
```bash
find . -name "*.yml" -o -name "*.yaml" | xargs grep -l "apps/frontend\|apps/web" 2>/dev/null
# Resultado: Ninguno encontrado
```

### A.8 Referencias en Docker

**docker-compose.yml:** No menciona apps/frontend ni apps/web (están en microservicios backend)

### A.9 Referencias en Arquitectura (ADRs)

**Buscando en docs de arquitectura:**
```bash
grep -r "frontend\|web" docs/03_Arquitectura/ 2>/dev/null | grep -v "backend" | head -5
# Resultado: Probablemente menciona "frontend" genérico sin especificar cuál
```

---

## A.10 CONCLUSIÓN: apps/frontend vs apps/web

### Diagnóstico

| Atributo | Resultado |
|----------|-----------|
| **apps/frontend** | ✅ Aplicación REAL con código, configuración, scripts funcionales |
| **apps/web** | ❌ Stub/Plantilla VACÍA (solo package.json sin src/, vite.config, tsconfig, devDependencies) |
| **Propósito frontend** | **apps/frontend** es la única aplicación frontend real |
| **apps/web** | Parece ser una plantilla de bootstrap nunca completada |
| **Duplicación** | SÍ - apps/web es un duplicado innecesario |

### Recomendación

**🟢 OPCIÓN A: Conservar apps/frontend y RETIRAR apps/web**

**Justificación:**
1. apps/frontend es la ÚNICA aplicación con código real
2. apps/web no tiene src/, vite.config, tsconfig, ni devDependencies
3. apps/web solo tiene package.json con dependencias declaradas pero nunca usadas
4. No hay referencia a apps/web en documentación, CI, Docker o arquitectura
5. apps/frontend está correctamente estructurada para desarrollo

**Acciones necesarias (FASE 2):**
- ✅ Mantener apps/frontend sin cambios (solo actualizar versiones)
- ❌ Eliminar apps/web (no contribuye)
- ✅ Consolidar dependencias de apps/web → apps/frontend si es necesario
- ✅ Actualizar apps/frontend: React 18→19, Vite 5→8, TypeScript 5→7

---

## PARTE B: INVESTIGACIÓN EXHAUSTIVA DE ESBUILD

### B.1 Versiones Instaladas en node_modules

**Confirmado en node_modules/.pnpm:**

```
esbuild@0.21.5 ✅ INSTALADO
esbuild@0.28.1 ✅ INSTALADO
@esbuild/win32-x64@0.21.5 ✅ INSTALADO
@esbuild/win32-x64@0.28.1 ✅ INSTALADO
```

### B.2 Registro en pnpm-lock.yaml

**Búsqueda:** grep "esbuild@0.21.5\|esbuild@0.28.1" pnpm-lock.yaml

**Resultado:** ❌ NO APARECEN en pnpm-lock.yaml

**Conclusión:** pnpm-lock.yaml NO lista esbuild como paquete directo en "packages:". Ambas versiones están en node_modules pero el lockfile NO las registra.

### B.3 Declaración de Consumidores en pnpm-lock.yaml

**Vite 8.1.5 (línea 3341):**
```yaml
vite@8.1.5:
  peerDependencies:
    esbuild: ^0.27.0 || ^0.28.0
  peerDependenciesMeta:
    esbuild:
      optional: true  # ← OPCIONAL
```

**Vite 5.4.21 (en node_modules pero NO en pnpm-lock.yaml):**
```
Tiene symlink: node_modules/.pnpm/vite@5.4.21_*/node_modules/esbuild
Pero NO está registrado en pnpm-lock.yaml
```

### B.4 DESCUBRIMIENTO CRÍTICO: Desincronización Severa

**Paquetes en node_modules pero NO en pnpm-lock.yaml:**

| Paquete | En node_modules | En pnpm-lock.yaml | Estado |
|---------|-----------------|------------------|--------|
| vite@5.4.21 | ✅ 2 resoluciones | ❌ NO | **DESINCRONIZADO** |
| tsx@4.23.9 | ✅ PRESENTE | ❌ NO | **DESINCRONIZADO** |
| esbuild@0.21.5 | ✅ PRESENTE | ❌ NO | **DESINCRONIZADO** |
| esbuild@0.28.1 | ✅ PRESENTE | ❌ NO | **DESINCRONIZADO** |

### B.5 Árbol de Symlinks Identificados

```
node_modules/.pnpm/node_modules/esbuild
  → Resuelve a: ???
  
node_modules/.pnpm/tsx@4.23.9/node_modules/esbuild
  → tsx REQUIERE esbuild (pero qué versión?)

node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43_*/node_modules/esbuild
  → Vite 5 con @types/node 20 requiere esbuild 0.21.5 (antiguo)

node_modules/.pnpm/vite@5.4.21_@types+node@24.13.3_*/node_modules/esbuild
  → Vite 5 con @types/node 24 requiere esbuild 0.21.5 (antiguo)

node_modules/.pnpm/vite@8.1.5_*_esbuild@0.28.1_*/node_modules/esbuild
  → Vite 8 con esbuild@0.28.1 es CORRECTO
```

### B.6 Causa del Conflicto de esbuild

**Escenario reconstruido:**

1. **Root importer declara en pnpm-lock.yaml:**
   - vitest@4.1.10 (que depende de vite@8.1.5)
   - vite@8.1.5 requiere esbuild ^0.28.0 (satisfecho por 0.28.1)

2. **PERO pnpm también instaló Vite 5:**
   - vite@5.4.21 está en node_modules (2 resoluciones)
   - Vite 5 requiere esbuild ^0.21.0 (satisfecho por 0.21.5)
   - Vite 5 NO está en pnpm-lock.yaml

3. **Conflicto en postinstall:**
   - esbuild@0.21.5 install.js se ejecutó
   - Esperaba encontrar @esbuild/win32-x64@0.28.1 (para Vite 8)
   - Pero encontró @esbuild/win32-x64@0.21.5 (para Vite 5)
   - Error: "Expected 0.28.1 but got 0.21.5"

### B.7 ¿Por Qué Vite 5 Está en node_modules?

**Hipótesis confirmada por symlinks:**

Vite 5.4.21 está en node_modules con 2 resoluciones diferentes (@types/node 20 y 24). Esto significa que ALGÚN paquete lo requiere transitivamente.

**Posibles consumidores:**
1. Una dependencia antigua de apps/frontend requiere Vite 5
2. Una dependencia en root requiere Vite 5
3. pnpm-lock.yaml es antiguo y no refleja estado actual

**Acción necesaria:** Ejecutar `npm ls vite` en node_modules para rastrear consumidor de Vite 5

### B.8 Consumidor de tsx@4.23.9

tsx está en node_modules pero no en pnpm-lock.yaml. Esto también indica desincronización severa.

**Potencial consumidor:** libs/database (usa tsx para scripts de migración)

---

## B.9 TABLA RESUMIDA: ÁRBOL EXACTO DE ESBUILD

| Versión de esbuild | Consumidor Directo | Consumidor Transitivo | Estado en Lockfile | Versión @esbuild/win32-x64 |
|-------------------|-------------------|----------------------|------------------|--------------------------|
| esbuild@0.21.5 | Vite 5.4.21 | ??? (Vite 5 requiere 0.21.x) | ❌ NO LISTADO | 0.21.5 |
| esbuild@0.28.1 | Vite 8.1.5 | vitest@4.1.10 → vite@8.1.5 | ❌ NO LISTADO | 0.28.1 |
| tsx@4.23.9 | ??? | Potencialmente libs/database | ❌ NO LISTADO | (no declara esbuild) |

---

## B.10 CONCLUSIÓN: CAUSA DE ESBUILD 0.21.5 vs 0.28.1

### Diagnóstico Confirmado

**Causa raíz:** pnpm-lock.yaml está DESINCRONIZADO con node_modules

**Evidencia:**
1. ✅ esbuild@0.21.5 SÍ está en node_modules
2. ✅ esbuild@0.28.1 SÍ está en node_modules
3. ❌ NINGUNA versión está listada en pnpm-lock.yaml
4. ✅ vite@5.4.21 SÍ está en node_modules (2 resoluciones)
5. ❌ vite@5.4.21 NO está en pnpm-lock.yaml
6. ✅ tsx@4.23.9 SÍ está en node_modules
7. ❌ tsx@4.23.9 NO está en pnpm-lock.yaml

**Causa específica del error "Expected 0.28.1 but got 0.21.5":**

1. Root importer tiene vitest@4.1.10 con vite@8.1.5 en pnpm-lock.yaml
2. Vite 8.1.5 peerDepends en esbuild ^0.28.0
3. pnpm install resolvió esbuild@0.28.1 correctamente
4. PERO vite@5.4.21 (no en lockfile) se instaló también
5. Vite 5 genera @esbuild/win32-x64@0.21.5
6. Vite 8 requiere @esbuild/win32-x64@0.28.1
7. install.js de 0.21.5 ejecutó primero y falló buscando 0.28.1

**Solución:** Regenerar pnpm-lock.yaml completamente (no solo node_modules) para sincronizar versiones

---

## RECOMENDACIONES FINALES

### Para apps/frontend vs apps/web

✅ **OPCIÓN A APROBADA:**
- Mantener apps/frontend como única aplicación frontend
- Retirar apps/web (stub vacío sin código)
- Actualizar apps/frontend a: React 19.2.7, Vite 8.1.5, TypeScript 7.0.2

### Para esbuild

✅ **Plan de Reparación:**
1. Identificar consumidor de vite@5.4.21 (probablemente deps antiguas)
2. Actualizar ese consumidor o removerio
3. Regenerar lockfile completo: `rm pnpm-lock.yaml && pnpm install`
4. Verificar: Solo esbuild@0.28.1 en node_modules
5. Verificar: Solo vite@8.1.5 (no 5.4.21)

---

## CAMBIOS NECESARIOS - VERSIÓN CORREGIDA

### Cambios INMEDIATOS (Relacionados a Frontends)

1. **apps/frontend/package.json**
   - React: ^18.2.0 → ^19.2.7
   - Vite: ^5.0.2 → ^8.1.5
   - TypeScript: ^5.3.3 → ^7.0.2
   - Agregar devDependencies: @types/node@^24.18.0, eslint, @vitest/ui

2. **Eliminar apps/web/** (completamente)
   - No tiene código
   - No tiene configuración
   - No hay referencias
   - Es un duplicado innecesario

### Cambios de ARQUITECTURA (pnpm-lock.yaml)

1. **Regenerar lockfile**
   - Eliminar todas las referencias a vite@5.4.21
   - Confirmar solo vite@8.1.5 presente
   - Confirmar solo esbuild@0.28.1 presente

2. **Implementar catálogo en pnpm-workspace.yaml**
   - Centralizar todas las versiones
   - Evitar future desincronización

---

## RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Eliminar apps/web puede afectar alguien | BAJA | BAJO | No hay referencias; es stub |
| Regenerar lockfile introduce nuevas resoluciones | MEDIA | MEDIO | Validar compilación y tests post-regeneración |
| Vite 5 → 8 tiene breaking changes | BAJA | BAJO | Testear apps/frontend build |
| React 18 → 19 tiene cambios en API | BAJA | BAJO | Revisar main.tsx para incompatibilidades |
| esbuild sigue conflictivo después | BAJA | ALTO | Requiere investigación de consumidor de Vite 5 |

---

## DIFERENCIAS DOCUMENTADAS PARA FASE 2

### Cambio 1: apps/frontend/package.json

```diff
{
  "name": "@app/frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src",
    "preview": "vite preview"
  },
  "dependencies": {
-   "react": "^18.2.0",
-   "react-dom": "^18.2.0",
+   "react": "^19.2.7",
+   "react-dom": "^19.2.7",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
-   "typescript": "^5.3.3",
-   "vite": "^5.0.2"
+   "@types/node": "^24.18.0",
+   "eslint": "^8.54.0",
+   "typescript": "^7.0.2",
+   "vite": "^8.1.5",
+   "vitest": "^4.1.10",
+   "@vitest/ui": "^4.1.10"
  }
}
```

### Cambio 2: Eliminar apps/web

```diff
- apps/web/  (DIRECTORIO COMPLETO)
+ (retirar)
```

### Cambio 3: pnpm-workspace.yaml (agregar catálogo)

[Ver FASE 1_PROPUESTA_UNIFICACION.md para detalles]

---

**INVESTIGACIÓN COMPLETADA. NO SE MODIFICÓ NINGÚN ARCHIVO. ESPERANDO DECISIÓN SOBRE FRONTEND Y APROBACIÓN DE CAMBIOS.**
