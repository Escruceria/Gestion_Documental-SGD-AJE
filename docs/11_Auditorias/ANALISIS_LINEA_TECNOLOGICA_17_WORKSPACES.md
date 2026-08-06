# 📊 Análisis de Línea Tecnológica: 17 Workspaces
**Documento:** Auditoría completa de dependencias, versiones y consistencia  
**Fecha:** 2026-08-06  
**Estado:** PROPUESTO - Requiere aprobación antes de aplicar cambios  
**Preparado por:** Claude (Arquitecto)  

---

## 📋 Resumen Ejecutivo

Se identificaron **12 inconsistencias críticas** en los 17 workspaces del monorepo:

| Tipo | Severidad | Cantidad | Impacto |
|------|-----------|----------|--------|
| **Versiones de @types/node** | 🔴 CRÍTICA | 5 apps con 20.9.0 vs libs/database con 24.11.0 | Node.js 24 sin tipos garantizados en 5 servicios |
| **Vitest mismatch** | 🔴 CRÍTICA | 2 pocs con 4.1.10 vs apps/libs con 1.0.4 | Incompatibilidad de test suites entre desarrolladores |
| **Catálogo pnpm incompleto** | 🔴 CRÍTICA | 7 workspaces usan "catalog:" sin definición en root | pnpm install fallará |
| **React version split** | 🟡 MAYOR | frontend 18.2.0 vs web 19.2.7 | Incompatibilidad de componentes React |
| **Vite version split** | 🟡 MAYOR | frontend 5.0.2 vs web 8.1.5 | Conflictos de build y plugins |
| **NestJS inconsistencia** | 🟡 MAYOR | api-gateway con "catalog:" vs otros con pinned | Versiones no validadas |
| **Dependencias faltantes** | 🟡 MAYOR | 4 servicios sin @types/node/testcontainers | Desarrollo bloqueado |
| **Versioning strategy** | 🟡 MAYOR | Mezcla de "catalog:", "^", "." y pinned | No reproducible |
| **RabbitMQ deps orphaned** | 🟡 MAYOR | solo poc-002 tiene amqplib/amqp-connection-manager | Otros servicios desconocen arquitectura de mensajería |
| **TypeScript unificado** | ✅ OK | Todos con 5.3.3 | Sin problemas |
| **Supertest present** | ✅ OK | Agregado a apps/ | Sin problemas |
| **Frontend faltante** | 🟡 MAYOR | apps/frontend sin devDependencies | Sin TypeScript, Vitest, ESLint |

---

## 🔍 Inventario de los 17 Workspaces

### Grupo A: 6 Microservicios Backend (apps/)

#### 1. api-gateway
**Estado:** ⚠️ ROTO  
**Problemas:**
- Todas las deps usan "catalog:" pero no hay catálogo en root
- Falta @types/node (crítico para Node.js 24)
- Falta @nestjs/testing y supertest

**Esperado:**
```json
{
  "dependencies": {
    "@nestjs/common": "^10.2.10",
    "@nestjs/core": "^10.2.10",
    "@nestjs/platform-express": "^10.2.10",
    "@nestjs/swagger": "^10.2.10",
    "@nestjs/terminus": "^10.2.10",
    "@opentelemetry/api": "^1.7.0",
    "@opentelemetry/sdk-node": "^0.45.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "express": "^4.18.2",
    "nestjs-pino": "^4.0.0",
    "pino": "^8.16.2",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/testing": "^10.2.10",
    "@types/node": "^24.11.0",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "supertest": "^7.2.2"
  }
}
```

#### 2-5. audit-compliance-service, correspondence-workflow-service, document-core-service, document-processing-worker

**Estado:** ⚠️ INCONSISTENCIA  
**Problemas:**
- @types/node@^20.9.0 (incompatible con Node.js 24.x)
- No declaran dependencia en libs/database, libs/middleware, etc.

**Cambio necesario:**
```json
{
  "devDependencies": {
    "@types/node": "^24.11.0",  // ← CAMBIAR de 20.9.0
    // ... resto igual
  }
}
```

#### 6. identity-access-service
**Estado:** ⚠️ INCONSISTENCIA  
**Misma** estructura que los 4 anteriores.

---

### Grupo B: 2 Frontends (apps/)

#### 7. frontend
**Estado:** 🔴 INCOMPLETO  
**Problemas:**
- Sin devDependencies definidas
- Falta TypeScript, Vitest, ESLint, @types/node, vitest
- Usa Vite 5.0.2 (moderno)
- React 18.2.0 (acorde con resto)

**Cambio necesario:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "@types/node": "^24.11.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.2",
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "eslint": "^8.54.0"
  }
}
```

#### 8. web
**Estado:** ⚠️ INCOMPLETO + VERSIONES PINNED  
**Problemas:**
- React 19.2.7 (beta, incompatible con frontend's 18.2.0)
- Vite 8.1.5 (versión vieja, incompatible con frontend's 5.0.2)
- Versiones pinned sin ^ o ~ (no actualizables)
- Falta devDependencies: TypeScript, Vitest, ESLint, testing
- Versión vieja de openapi-fetch (0.17.0)

**Cambio necesario:**
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hookform/resolvers": "^5.4.0",
    "@mui/icons-material": "^9.2.0",
    "@mui/material": "^9.2.0",
    "@tanstack/react-query": "^5.101.2",
    "date-fns": "^4.4.0",
    "i18next": "^26.3.6",
    "keycloak-js": "^26.2.4",
    "openapi-fetch": "^0.17.0",
    "react": "^18.2.0",          // ← CAMBIAR de 19.2.7
    "react-dom": "^18.2.0",       // ← CAMBIAR de 19.2.7
    "react-hook-form": "^7.81.0",
    "react-i18next": "^17.0.10",
    "react-router": "^8.2.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@types/node": "^24.11.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.2",              // ← CAMBIAR de 8.1.5
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2"
  }
}
```

---

### Grupo C: 5 Librerías Compartidas (libs/)

#### 9. config
**Estado:** ✅ OK  
**Descripción:** Solo TypeScript y Vitest, sin dependencies.

#### 10. database
**Estado:** ✅ OK (después de cambios previos)  
**@types/node:** Correcto en 24.11.0

#### 11. middleware
**Estado:** ✅ OK  
**Descripción:** Solo TypeScript y Vitest, sin dependencies.

#### 12. shared-types
**Estado:** ✅ OK  
**Descripción:** Solo TypeScript y Vitest, sin dependencies.

#### 13. testing
**Estado:** ⚠️ INCOMPLETO  
**Problemas:**
- Solo TypeScript y Vitest
- Debería incluir: @testing-library/react, @testing-library/jest-dom, vitest, @vitest/ui, testcontainers

**Cambio necesario:**
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testcontainers/postgresql": "^12.0.4",
    "@types/node": "^24.11.0",
    "testcontainers": "^12.0.4",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4"
  }
}
```

---

### Grupo D: 2 POCs (pocs/)

#### 14-15. poc-001-multitenancy, poc-002-document-pipeline

**Estado:** 🔴 CRÍTICA  
**Problemas:**
- Vitest 4.1.10 (versión vieja, **2 major versions desincronizada**)
- Testcontainers 12.0.4 pinned sin ^
- pocs/poc-002 tiene amqplib y amqp-connection-manager pero estos deberían estar en notification-integration-service
- Ambos usan "catalog:" sin definición en root
- Falta @types/node

**Cambio necesario (Ambos POCs):**
```json
{
  "dependencies": {
    "kysely": "^0.29.3",           // ← Cambiar de "catalog:"
    "pg": "^8.22.0"                // ← Cambiar de "catalog:"
  },
  "devDependencies": {
    "@testcontainers/postgresql": "^12.0.4",
    "@types/node": "^24.11.0",
    "testcontainers": "^12.0.4",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",            // ← CAMBIAR de 4.1.10
    "@vitest/ui": "^1.0.4"
  }
}
```

**Para poc-002 (adicional):**
```json
{
  "dependencies": {
    "amqp-connection-manager": "^5.0.0",
    "amqplib": "^0.10.5",          // ← Actualizar de 2.0.1 (que no existe)
    "kysely": "^0.29.3",
    "pg": "^8.22.0"
  }
  // ... resto igual
}
```

#### 16. Root package.json
**Estado:** ⚠️ INCOMPLETO  
**Problemas:**
- No define "pnpm": { "overrides": ... } para versiones globales
- No define "pnpm": { "catalog": ... } que usan 7 workspaces
- Versiones de scripts no verificadas

**Cambio necesario:**
```json
{
  "pnpm": {
    "catalog": {
      "@nestjs/cli": "^10.2.1",
      "@nestjs/common": "^10.2.10",
      "@nestjs/core": "^10.2.10",
      "@nestjs/platform-express": "^10.2.10",
      "@nestjs/swagger": "^10.2.10",
      "@nestjs/terminus": "^10.2.10",
      "@opentelemetry/api": "^1.7.0",
      "@opentelemetry/sdk-node": "^0.45.0",
      "class-transformer": "^0.5.1",
      "class-validator": "^0.14.0",
      "express": "^4.18.2",
      "kysely": "^0.29.3",
      "nestjs-pino": "^4.0.0",
      "pg": "^8.22.0",
      "pino": "^8.16.2",
      "reflect-metadata": "^0.1.13",
      "rxjs": "^7.8.1"
    }
  }
}
```

---

## 📐 Línea Tecnológica Propuesta (Unificada)

### Node.js & Toolchain
```
Node.js:         24.x LTS
pnpm:            9.0.0 (ya en package.json)
TypeScript:      5.3.3
Vitest:          1.0.4
ESLint:          8.54.0
@types/node:     24.11.0
```

### Backend (NestJS)
```
@nestjs/common:                 10.2.10
@nestjs/core:                   10.2.10
@nestjs/platform-express:       10.2.10
@nestjs/swagger:                10.2.10
@nestjs/terminus:               10.2.10
@nestjs/cli:                    10.2.1
@nestjs/testing:                10.2.10

class-validator:                0.14.0
class-transformer:              0.5.1
reflect-metadata:               0.1.13
rxjs:                           7.8.1
express:                        4.18.2
```

### Database
```
pg:                             8.22.0
kysely:                         0.29.3
node-pg-migrate:               8.0.4
dotenv:                         16.3.1
```

### Message Queue
```
amqplib:                        0.10.5 (o latest stable)
amqp-connection-manager:       5.0.0
```

### OpenTelemetry
```
@opentelemetry/api:            1.7.0
@opentelemetry/sdk-node:       0.45.0
nestjs-pino:                   4.0.0
pino:                          8.16.2
```

### Frontend (Unified)
```
react:                          18.2.0 (LTS compatible)
react-dom:                      18.2.0
vite:                           5.0.2
@vitejs/plugin-react:          4.2.1
react-router:                  8.2.0
react-hook-form:               7.81.0
@hookform/resolvers:           5.4.0
@tanstack/react-query:         5.101.2
zustand:                        5.0.14
@mui/material:                 9.2.0
@mui/icons-material:           9.2.0
@emotion/react:                11.14.0
@emotion/styled:               11.14.1
i18next:                        26.3.6
react-i18next:                 17.0.10
zod:                            4.4.3
openapi-fetch:                 0.17.0
keycloak-js:                    26.2.4
date-fns:                       4.4.0
axios:                          1.6.2
```

### Testing (Unified)
```
vitest:                         1.0.4
@vitest/ui:                     1.0.4
supertest:                      7.2.2
testcontainers:                12.0.4
@testcontainers/postgresql:    12.0.4
@testing-library/react:        14.1.2
@testing-library/jest-dom:     6.1.5
```

---

## 🔧 Cambios Propuestos por Workspace

### Cambios Inmediatos (Críticos)

#### 1. Root package.json
**Acción:** Agregar pnpm catalog
```diff
+ "pnpm": {
+   "catalog": {
+     "@nestjs/cli": "^10.2.1",
+     "@nestjs/common": "^10.2.10",
+     // ... (ver tabla arriba)
+   }
+ }
```

#### 2. apps/api-gateway/package.json
**Acción:** Reemplazar "catalog:" con versiones pinned + agregar devDependencies
```
CAMBIOS:
- 19 líneas con "catalog:"
+ 19 líneas con versiones específicas (ver propuesta arriba)
+ Agregar devDependencies completas
```

#### 3. apps/audit-compliance-service, correspondence-workflow-service, document-core-service, document-processing-worker, identity-access-service (5 archivos)
**Acción:** Cambiar @types/node de 20.9.0 a 24.11.0
```diff
- "@types/node": "^20.9.0",
+ "@types/node": "^24.11.0",
```

#### 4. apps/frontend/package.json
**Acción:** Agregar devDependencies completamente faltantes
```
Agregar:
- @vitejs/plugin-react
- @types/node@^24.11.0
- typescript
- vite
- vitest
- @vitest/ui
- eslint (y plugins)
```

#### 5. apps/web/package.json
**Acción:** Cambiar React 19 → 18, Vite 8 → 5, cambiar pinned a carets, agregar devDependencies
```
CAMBIOS:
- "react": "19.2.7" → "^18.2.0"
- "react-dom": "19.2.7" → "^18.2.0"
- "vite": "8.1.5" → "^5.0.2"
- Agregar ^ a todas las dependencies
- Agregar devDependencies completas
```

#### 6. libs/testing/package.json
**Acción:** Agregar testing utilities
```
Agregar:
- @testing-library/react
- @testing-library/jest-dom
- testcontainers
- @testcontainers/postgresql
- @types/node@^24.11.0
- @vitest/ui
```

#### 7. pocs/poc-001-multitenancy/package.json
**Acción:** Cambiar "catalog:" a pinned, actualizar vitest 4.1.10 → 1.0.4
```
CAMBIOS:
- "kysely": "catalog:" → "^0.29.3"
- "pg": "catalog:" → "^8.22.0"
- "vitest": "4.1.10" → "^1.0.4"
- Agregar @types/node@^24.11.0
- Agregar @vitest/ui@^1.0.4
- Cambiar testcontainers a "^12.0.4"
```

#### 8. pocs/poc-002-document-pipeline/package.json
**Acción:** Cambiar "catalog:" a pinned, actualizar vitest, corregir amqplib
```
CAMBIOS:
- "kysely": "catalog:" → "^0.29.3"
- "pg": "catalog:" → "^8.22.0"
- "amqplib": "2.0.1" → "^0.10.5"
- "amqp-connection-manager": "5.0.0" → "^5.0.0"
- "vitest": "4.1.10" → "^1.0.4"
- Agregar @types/node@^24.11.0
- Agregar @vitest/ui@^1.0.4
- Cambiar testcontainers a "^12.0.4"
```

---

## 📊 Tabla de Cambios Resumida

| Workspace | Cambios | Severidad | Impacto |
|-----------|---------|-----------|--------|
| Root | + Agregar pnpm catalog | CRÍTICA | Desbloquea 7 workspaces |
| api-gateway | Cambiar catalog: → pinned + devDeps | CRÍTICA | Habilita compilación |
| audit-compliance, correspondence, document-core, document-processing, identity-access | @types/node 20.9.0 → 24.11.0 | CRÍTICA | Node 24 compatibility |
| frontend | + Agregar devDependencies | MAYOR | Habilita dev experience |
| web | React 19→18, Vite 8→5, + devDeps | MAYOR | Unifica stack frontend |
| testing | + Agregar testing utilities | MAYOR | Habilita testing strategy |
| poc-001, poc-002 | Cambiar catalog:, vitest 4→1, + @types | CRÍTICA | Alinea con línea tecnológica |

---

## ✅ Criterios de Validación

Después de aplicar cambios, verificar:

```bash
# 1. Sintaxis JSON válida en todos los package.json
pnpm ls --depth=0

# 2. Sin conflictos de versiones
pnpm audit

# 3. Reproducibilidad (sin nuevas resoluciones)
rm -rf node_modules
pnpm install
git diff pnpm-lock.yaml  # Debe ser mínimo

# 4. Compilación exitosa
pnpm -r run build

# 5. Linting sin errores
pnpm -r run lint

# 6. Tests ejecutables
pnpm -r run test --run

# 7. POCs compilables
pnpm --filter poc-001 run build
pnpm --filter poc-002 run build
```

---

## ⚠️ Riesgos Identificados

### Riesgo 1: Breaking change en amqplib
**Problema:** amqplib versión "2.0.1" no existe en npm (máxima es 0.10.x)  
**Mitigación:** Cambiar a "^0.10.5" (última estable)  
**Verificación:** `npm view amqplib versions`

### Riesgo 2: React 19 beta deprecation
**Problema:** web usa React 19.2.7 (beta, posibles cambios breaking)  
**Mitigación:** Cambiar a React 18.2.0 estable  
**Verificación:** Tests de componentes deben pasar

### Riesgo 3: Vitest 4 → 1 en POCs
**Problema:** Diferencias en API entre versiones  
**Mitigación:** Revisar sintaxis de tests después del cambio  
**Verificación:** `pnpm --filter poc-001 test --run`

### Riesgo 4: Catálogo pnpm no sincronizado
**Problema:** Si se actualiza una versión en root, afecta 7 workspaces  
**Mitigación:** Mantener catálogo como única fuente de verdad  
**Verificación:** Buscar versiones pinned después de aplicar cambios

---

## 🎯 Recomendación Final

**Estado Actual:** 🔴 **NO APTO para iniciar programación**

**Razones:**
1. Catálogo pnpm incompleto → pnpm install fallará
2. 5 microservicios con @types/node incompatible
3. POCs con vitest desincronizado
4. 2 frontends con versiones conflictivas
5. Múltiples workspaces sin devDependencies

**Acción Recomendada:**
1. ✅ Aprobar cambios propuestos
2. ✅ Aplicar cambios en este orden: Root → apps → libs → pocs
3. ✅ Ejecutar `pnpm install` y validar
4. ✅ Ejecutar validaciones arriba
5. ✅ Hacer commit: `chore: unify dependency versions across 17 workspaces`

**Después de aplicar:** Estado → 🟢 **APTO para iniciar programación (POC-001)**

---

## 📝 Siguiente Paso

**Para proceder, confirmá:**

- [ ] Aprobás cambiar @types/node de 20.9.0 a 24.11.0 en 5 microservicios
- [ ] Aprobás cambiar React 19.2.7 → 18.2.0 en apps/web
- [ ] Aprobás cambiar Vite 8.1.5 → 5.0.2 en apps/web
- [ ] Aprobás cambiar vitest 4.1.10 → 1.0.4 en ambos POCs
- [ ] Aprobás crear pnpm catalog en root con 16 dependencias
- [ ] Aprobás cambiar "catalog:" a pinned en api-gateway y pocs
- [ ] Aprobás agregar devDependencies faltantes en frontend y testing
- [ ] Aprobás cambiar amqplib de 2.0.1 a 0.10.5 en poc-002
- [ ] Confirma si algún cambio requiere consideración especial

Si aprobás TODO sin cambios, aplico los 8 cambios inmediatamente y reporto validaciones.
