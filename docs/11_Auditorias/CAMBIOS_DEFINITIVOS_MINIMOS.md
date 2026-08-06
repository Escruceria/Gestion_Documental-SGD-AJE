# 🎯 Cambios Definitivos - Versión Auditoría Rigurosa

**Estado:** PROPUESTO (versión corregida tras auditoría del usuario)  
**Fecha:** 2026-08-06  
**Total de cambios críticos:** 4  
**Cambios de línea base:** 6 (no bloqueantes, pero recomendados)
**Cambios opcionales:** Decidir caso a caso

---

## 🔴 Cambios BLOQUEANTES (Obligatorios - Impiden pnpm install)

### 1. pnpm-workspace.yaml - Agregar Catálogo

**Archivo:** `./pnpm-workspace.yaml`  
**Razón:** 7 workspaces usan `catalog:` en package.json; sin definición en workspace.yaml, pnpm install falla  
**Workspaces afectados:** apps/api-gateway, pocs/poc-001-multitenancy, pocs/poc-002-document-pipeline

#### ANTES:
```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'
```

#### DESPUÉS:
```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

catalog:
  "@nestjs/cli": "^10.2.1"
  "@nestjs/common": "^10.2.10"
  "@nestjs/core": "^10.2.10"
  "@nestjs/platform-express": "^10.2.10"
  "@nestjs/swagger": "^10.2.10"
  "@nestjs/testing": "^10.2.10"
  "@nestjs/terminus": "^10.2.10"
  "@opentelemetry/api": "^1.7.0"
  "@opentelemetry/sdk-node": "^0.45.0"
  "class-transformer": "^0.5.1"
  "class-validator": "^0.14.0"
  "express": "^4.18.2"
  "kysely": "^0.29.3"
  "nestjs-pino": "^4.0.0"
  "pg": "^8.22.0"
  "pino": "^8.16.2"
  "reflect-metadata": "^0.1.13"
  "rxjs": "^7.8.1"
```

---

### 2. pocs/poc-002-document-pipeline/package.json - Cambio: amqplib

**Archivo:** `./pocs/poc-002-document-pipeline/package.json`  
**Razón:** amqplib 2.0.1 no existe en npm (máximo es 0.10.5); bloquea instalación de POC-002  
**Problema:** Versión inexistente causa `pnpm install` falla

```diff
{
  "dependencies": {
    "amqp-connection-manager": "5.0.0",
-   "amqplib": "2.0.1",
+   "amqplib": "^0.10.5",
    "kysely": "catalog:",
    "pg": "catalog:"
  }
}
```

---

### 3. pnpm-lock.yaml - Regenerar

**Archivo:** `./pnpm-lock.yaml`  
**Razón:** Contiene resoluciones inconsistentes (esbuild 0.28.1 vs 0.21.5); causa fallos en build  
**Acción:** Eliminar y regenerar tras aplicar cambios 1-2

```bash
rm pnpm-lock.yaml
pnpm install
git diff pnpm-lock.yaml  # Verificar que solo hay cambios esperados
```

---

## 🟠 Cambios de LÍNEA BASE (No bloqueantes, pero recomendados)

Estos cambios alinean inconsistencias de versiones entre workspaces. No impiden desarrollo actual, pero mejoran consistencia.

### 4. apps/audit-compliance-service/package.json

**Cambio:** @types/node ^20.9.0 → ^24.11.0  
**Razón:** Node.js es 24.x; @types/node debe coincidir  
**Impacto:** Sin cambio: falta de tipos para APIs Node 24

```diff
{
  "devDependencies": {
-   "@types/node": "^20.9.0",
+   "@types/node": "^24.11.0",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "supertest": "^7.2.2"
  }
}
```

---

### 5. apps/correspondence-workflow-service/package.json

**Cambio:** @types/node ^20.9.0 → ^24.11.0

*Mismo cambio que #4*

---

### 6. apps/document-core-service/package.json

**Cambio:** @types/node ^20.9.0 → ^24.11.0

*Mismo cambio que #4*

---

### 7. apps/document-processing-worker/package.json

**Cambio:** @types/node ^20.9.0 → ^24.11.0

*Mismo cambio que #4*

---

### 8. apps/identity-access-service/package.json

**Cambio:** @types/node ^20.9.0 → ^24.11.0

*Mismo cambio que #4*

---

### 9. pocs/poc-001-multitenancy/package.json

**Cambio:** vitest 4.1.10 → 1.0.4  
**Razón:** Decisión arquitectónica: unificar versión vitest en todo el monorepo  
**Nota:** Vitest 4.1.10 es válido pero diferente a apps/libs; requiere decisión explícita

```diff
{
  "dependencies": {
    "kysely": "catalog:",
    "pg": "catalog:"
  },
  "devDependencies": {
    "@testcontainers/postgresql": "^12.0.4",
    "testcontainers": "^12.0.4",
-   "vitest": "4.1.10"
+   "vitest": "^1.0.4"
  }
}
```

---

### 10. pocs/poc-002-document-pipeline/package.json

**Cambio:** vitest 4.1.10 → 1.0.4

*Mismo cambio que #9*

---

## 💚 CAMBIOS OPCIONALES (Mejora DX, Decidir caso a caso)

### 11. apps/api-gateway/package.json

**Cambio:** Agregar devDependencies (actualmente vacío)

```diff
{
  "dependencies": {
    // ... todas las deps siguen igual
  },
+ "devDependencies": {
+   "@nestjs/cli": "catalog:",
+   "@nestjs/testing": "catalog:",
+   "@types/node": "^24.11.0",
+   "typescript": "^5.3.3",
+   "vitest": "^1.0.4",
+   "supertest": "^7.2.2"
+ }
}
```

---

### 12. apps/frontend/package.json

**Cambio:** Agregar devDependencies (actualmente incompleto)  
**Nota:** @types/node no es crítico si es frontend browser puro sin APIs Node

```diff
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
+   "@types/node": "^24.11.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.2",
+   "vitest": "^1.0.4",
+   "@vitest/ui": "^1.0.4",
+   "eslint": "^8.54.0"
  }
}
```

---

### 13. apps/web/package.json

**Cambio:** Agregar devDependencies (actualmente sin testing)

```diff
{
  "dependencies": {
    "@emotion/react": "11.14.0",
    // ... todas las deps siguen igual (MANTENER React 19.2.7 y Vite 8.1.5)
  },
+ "devDependencies": {
+   "@types/node": "^24.11.0",
+   "@vitejs/plugin-react": "^4.2.1",
+   "typescript": "^5.3.3",
+   "vite": "^8.1.5",
+   "vitest": "^1.0.4",
+   "@vitest/ui": "^1.0.4",
+   "eslint": "^8.54.0"
+ }
}
```

**Nota IMPORTANTE:** 
- React 19.2.7 es estable (GA dic 2024); MANTENER (no degradar a 18)
- Vite 8.1.5 es más moderno que Vite 5; MANTENER (no degradar a 5)
- Si comparten componentes con apps/frontend: evaluar unificación futura, no automática

---

### 14. libs/testing/package.json

**Cambio:** Agregar testing utilities

```diff
{
  "name": "@lib/testing",
  "version": "0.1.0",
  "private": true,
  "devDependencies": {
+   "@testing-library/jest-dom": "^6.1.5",
+   "@testing-library/react": "^14.1.2",
+   "@testcontainers/postgresql": "^12.0.4",
+   "@types/node": "^24.11.0",
+   "testcontainers": "^12.0.4",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
+   "@vitest/ui": "^1.0.4"
  }
}
```

---

## 📊 Resumen de Cambios

### Bloqueantes (3 cambios obligatorios)
| # | Archivo | Tipo | Líneas | Bloquea |
|---|---------|------|--------|---------|
| 1 | pnpm-workspace.yaml | Agregar catálogo | +16 | **SÍ** |
| 2 | pocs/poc-002 | Cambiar amqplib 2.0.1 → 0.10.5 | 1 | **SÍ** |
| 3 | pnpm-lock.yaml | Regenerar (borrar y reinstalar) | Completo | **SÍ** |

### Línea Base (6 cambios recomendados)
| # | Archivo | Tipo | Líneas | Bloquea |
|---|---------|------|--------|---------|
| 4-8 | 5 microservicios | @types/node 20→24 | 1 c/u | NO |
| 9-10 | 2 POCs | vitest 4.1.10 → 1.0.4 | 1 c/u | NO |

### Opcionales (4 cambios de mejora DX)
| # | Archivo | Tipo | Líneas | Bloquea |
|---|---------|------|--------|---------|
| 11 | api-gateway | + devDeps | +6 | NO |
| 12 | frontend | + devDeps | +5 | NO |
| 13 | web | + devDeps (MANTENER React 19, Vite 8) | +6 | NO |
| 14 | testing | + devDeps | +6 | NO |

**Cambios bloqueantes:** 3 (obligatorios ahora)  
**Cambios línea base:** 6 (recomendados)  
**Cambios opcionales:** 4 (mejora)  
**Total:** 13 cambios en 12 archivos

---

## ✅ Plan de Aplicación

### Fase 1: Críticos (Desbloquea pnpm install)
```bash
# Aplicar cambios 1-8
# Luego ejecutar:
rm -rf node_modules pnpm-lock.yaml
pnpm install
git diff pnpm-lock.yaml | head -50
```

### Fase 2: Opcionales (Mejora DX)
```bash
# Aplicar cambios 9-12
# Ejecutar:
pnpm -r run build
pnpm -r run test --run
```

---

## 🎓 Lo Que NO Cambió

✅ **React 19.2.7 en apps/web** - Estable, mantener  
✅ **Vite 8.1.5 en apps/web** - Funcional, mantener  
✅ **package.json raíz** - No modificar  
✅ **Línea tecnológica existente** - Confirmada

---

## Validación Post-Aplicación

```bash
# 1. Sintaxis YAML
pnpm -r ls --depth=0

# 2. Catalogo resuelto
grep -r "catalog:" apps/api-gateway/package.json

# 3. Compilación
pnpm -r run build

# 4. Tests
pnpm -r run test --run

# 5. POCs específicos
pnpm --filter poc-001 run build
pnpm --filter poc-002 run build
```

---

## 📋 Aprobación - Estrategia de Aplicación

### Opción A: Mínima (Solo Bloqueantes)
Aplica SOLO los 3 cambios bloqueantes para desbloquear pnpm install:
- [ ] Cambio 1: pnpm-workspace.yaml catálogo
- [ ] Cambio 2: pocs/poc-002 amqplib 0.10.5
- [ ] Cambio 3: Regenerar pnpm-lock.yaml

**Resultado:** pnpm install funciona; desarrollo puede iniciar

### Opción B: Recomendada (Bloqueantes + Línea Base)
Aplica bloqueantes + alineación de línea base (4-10):
- [ ] Cambios 1-3 (bloqueantes)
- [ ] Cambios 4-8 (@types/node en 5 servicios)
- [ ] Cambios 9-10 (vitest unificado en POCs)

**Resultado:** Línea tecnológica alineada; mejor DX

### Opción C: Completa (Todos)
Aplica bloqueantes + línea base + opcionales:
- [ ] Cambios 1-10 (bloqueantes + línea base)
- [ ] Cambios 11-14 (devDependencies opcionales)

**Resultado:** Stack completo optimizado; máxima DX

---

**Confirmación requerida:**

¿Cuál opción prefieres?

- [ ] Opción A (Mínima - 3 cambios)
- [ ] Opción B (Recomendada - 10 cambios)
- [ ] Opción C (Completa - 14 cambios)
- [ ] Otra (especificar)
