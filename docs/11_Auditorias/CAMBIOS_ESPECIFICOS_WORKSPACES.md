# 🔧 Cambios Específicos por Archivo - Listos para Aplicar

**Estado:** PROPUESTO - Requiere aprobación  
**Fecha:** 2026-08-06  
**Total de archivos a modificar:** 15 (Root + 14 workspaces)

---

## 1️⃣ package.json (ROOT)

**Archivo:** `./package.json`  
**Cambio:** Agregar sección `pnpm.catalog`  
**Razón:** Resuelve referencias "catalog:" en 7 workspaces

```json
AGREGAR ESTA SECCIÓN después de "scripts":

  "pnpm": {
    "catalog": {
      "@nestjs/cli": "^10.2.1",
      "@nestjs/common": "^10.2.10",
      "@nestjs/core": "^10.2.10",
      "@nestjs/platform-express": "^10.2.10",
      "@nestjs/swagger": "^10.2.10",
      "@nestjs/testing": "^10.2.10",
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
```

---

## 2️⃣ apps/api-gateway/package.json

**Cambio:** Reemplazar todas las deps "catalog:" por versiones pinned + agregar devDependencies  
**Razón:** Habilita compilación y testing

### ANTES:
```json
{
  "name": "@gestion-documental/api-gateway",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@nestjs/common": "catalog:",
    "@nestjs/core": "catalog:",
    "@nestjs/platform-express": "catalog:",
    "@nestjs/swagger": "catalog:",
    "@nestjs/terminus": "catalog:",
    "@opentelemetry/api": "catalog:",
    "@opentelemetry/sdk-node": "catalog:",
    "class-transformer": "catalog:",
    "class-validator": "catalog:",
    "express": "catalog:",
    "nestjs-pino": "catalog:",
    "pino": "catalog:",
    "reflect-metadata": "catalog:",
    "rxjs": "catalog:"
  }
}
```

### DESPUÉS:
```json
{
  "name": "@gestion-documental/api-gateway",
  "version": "0.0.0",
  "private": true,
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

---

## 3️⃣ apps/audit-compliance-service/package.json

**Cambio:** @types/node 20.9.0 → 24.11.0  
**Razón:** Compatibilidad con Node.js 24

### ANTES:
```json
{
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/testing": "^10.2.10",
    "@types/node": "^20.9.0",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4",
    "supertest": "^7.2.2"
  }
}
```

### DESPUÉS:
```json
{
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

---

## 4️⃣ apps/correspondence-workflow-service/package.json

**Cambio:** @types/node 20.9.0 → 24.11.0  
**Razón:** Compatibilidad con Node.js 24

*Mismo cambio que #3*

---

## 5️⃣ apps/document-core-service/package.json

**Cambio:** @types/node 20.9.0 → 24.11.0  
**Razón:** Compatibilidad con Node.js 24

*Mismo cambio que #3*

---

## 6️⃣ apps/document-processing-worker/package.json

**Cambio:** @types/node 20.9.0 → 24.11.0  
**Razón:** Compatibilidad con Node.js 24

*Mismo cambio que #3*

---

## 7️⃣ apps/identity-access-service/package.json

**Cambio:** @types/node 20.9.0 → 24.11.0  
**Razón:** Compatibilidad con Node.js 24

*Mismo cambio que #3*

---

## 8️⃣ apps/frontend/package.json

**Cambio:** Agregar devDependencies completamente faltantes  
**Razón:** Habilita dev toolchain (TypeScript, Vitest, ESLint)

### ANTES:
```json
{
  "name": "@gestion-documental/frontend",
  "version": "0.0.0",
  "private": true,
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

### DESPUÉS:
```json
{
  "name": "@gestion-documental/frontend",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/node": "^24.11.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.2",
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2"
  }
}
```

---

## 9️⃣ apps/web/package.json

**Cambio:** React 19→18, Vite 8→5, agregar carets, agregar devDependencies  
**Razón:** Unificar frontend stack y habilitar testing

### ANTES:
```json
{
  "name": "@gestion-documental/web",
  "version": "0.0.0",
  "private": true,
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
  }
}
```

### DESPUÉS:
```json
{
  "name": "@gestion-documental/web",
  "version": "0.0.0",
  "private": true,
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
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
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
    "vite": "^5.0.2",
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2"
  }
}
```

---

## 🔟 libs/testing/package.json

**Cambio:** Agregar testing utilities + @types/node  
**Razón:** Centraliza testing dependencies para toda la arquitectura

### ANTES:
```json
{
  "name": "@lib/testing",
  "version": "0.1.0",
  "private": true,
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  }
}
```

### DESPUÉS:
```json
{
  "name": "@lib/testing",
  "version": "0.1.0",
  "private": true,
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

## 1️⃣1️⃣ pocs/poc-001-multitenancy/package.json

**Cambio:** Cambiar "catalog:" a pinned, vitest 4.1.10 → 1.0.4, agregar @types/node  
**Razón:** Alinear con línea tecnológica MVP

### ANTES:
```json
{
  "name": "@gestion-documental/poc-001-multitenancy",
  "version": "0.0.0",
  "private": true,
  "description": "POC de PostgreSQL RLS, SET LOCAL, pool y aislamiento tenant.",
  "dependencies": {
    "kysely": "catalog:",
    "pg": "catalog:"
  },
  "devDependencies": {
    "@testcontainers/postgresql": "12.0.4",
    "testcontainers": "12.0.4",
    "vitest": "4.1.10"
  }
}
```

### DESPUÉS:
```json
{
  "name": "@gestion-documental/poc-001-multitenancy",
  "version": "0.0.0",
  "private": true,
  "description": "POC de PostgreSQL RLS, SET LOCAL, pool y aislamiento tenant.",
  "dependencies": {
    "kysely": "^0.29.3",
    "pg": "^8.22.0"
  },
  "devDependencies": {
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

## 1️⃣2️⃣ pocs/poc-002-document-pipeline/package.json

**Cambio:** Cambiar "catalog:" a pinned, vitest 4.1.10 → 1.0.4, amqplib 2.0.1 → 0.10.5, agregar @types/node  
**Razón:** Alinear con línea tecnológica MVP

### ANTES:
```json
{
  "name": "@gestion-documental/poc-002-document-pipeline",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "amqp-connection-manager": "5.0.0",
    "amqplib": "2.0.1",
    "kysely": "catalog:",
    "pg": "catalog:"
  },
  "devDependencies": {
    "@testcontainers/postgresql": "12.0.4",
    "testcontainers": "12.0.4",
    "vitest": "4.1.10"
  }
}
```

### DESPUÉS:
```json
{
  "name": "@gestion-documental/poc-002-document-pipeline",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "amqp-connection-manager": "^5.0.0",
    "amqplib": "^0.10.5",
    "kysely": "^0.29.3",
    "pg": "^8.22.0"
  },
  "devDependencies": {
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

## Resumen de Cambios

| # | Archivo | Tipo de Cambio | Líneas Afectadas |
|---|---------|---|---|
| 1 | package.json | Agregar sección | +23 líneas |
| 2 | apps/api-gateway | Reemplazar + Agregar | 14 líneas modificadas + 6 agregadas |
| 3-7 | 5 microservicios | Cambiar versión | 1 línea c/u (5 total) |
| 8 | apps/frontend | Agregar | +7 líneas |
| 9 | apps/web | Cambiar + Agregar | 2 líneas + 7 agregadas |
| 10 | libs/testing | Agregar | +6 líneas |
| 11 | pocs/poc-001 | Cambiar + Agregar | 2 líneas + 4 agregadas |
| 12 | pocs/poc-002 | Cambiar + Agregar | 3 líneas + 4 agregadas |

**Total:** 15 archivos modificados, ~85 líneas netas agregadas/modificadas

---

## Validación Post-Aplicación

Después de aplicar cambios, ejecutar:

```bash
# 1. Verificar sintaxis
node -e "Object.keys(require('./package.json')).length > 0 && console.log('✅ Root JSON válido')"

# 2. Instalar dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 3. Verificar lock actualizado
git diff pnpm-lock.yaml | head -50

# 4. Compilar todo
pnpm -r run build

# 5. Validar tests
pnpm -r run test --run

# 6. Verificar POCs
pnpm --filter poc-001 run build
pnpm --filter poc-002 run build
```

---

## ✅ Checklist Pre-Aplicación

- [ ] He revisado todos los cambios propuestos
- [ ] Entiendo el impacto de cambiar React 19 → 18 en apps/web
- [ ] Entiendo el impacto de cambiar Vite 8 → 5 en apps/web
- [ ] Entiendo que vitest 4.1.10 → 1.0.4 puede requerir ajustes en sintaxis de tests en POCs
- [ ] Entiendo que amqplib 2.0.1 (inexistente) → 0.10.5 es fix de error crítico
- [ ] Apruebo proceder con todos los cambios
- [ ] Confirmo que no hay cambios adicionales requeridos

**Si apruebás, confirma con:** ✅ PROCEDER
