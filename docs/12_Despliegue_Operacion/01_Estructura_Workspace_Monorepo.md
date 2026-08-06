# Estructura Workspace Monorepo — SGD

| Campo | Valor |
|---|---|
| Código | GDP-DEP-001 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A1) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | David Ernesto Antequera Martínez (Operaciones), Neffer Anais Martínez (QA) |

## Propósito

Especificar la estructura física de repositorio único (monorepo) que aloja 6 macroservicios, frontend, tests, CI/CD y documentación. Garantiza coherencia, navegabilidad y escalabilidad.

---

## 1. Árbol de directorios — Estructura oficial

```
gestion-documental/
│
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml          # CI para macroservicios
│   │   ├── ci-frontend.yml         # CI para React
│   │   ├── security-scan.yml       # OWASP ZAP
│   │   ├── deploy-staging.yml      # Deploy staging
│   │   └── deploy-prod.yml         # Deploy producción
│   └── CODEOWNERS                  # Governance revisores por área
│
├── .env.example                     # Template variables entorno
├── .env.production                  # Producción (no en git)
├── .dockerignore                    # Archivos excluir Docker
├── .gitignore                       # Control versiones
├── docker-compose.yml               # Entorno local (BD, cache, broker)
├── docker-compose.staging.yml       # Staging (AWS, real)
├── pnpm-workspace.yaml              # Definición workspace pnpm
├── pnpm-lock.yaml                   # Lock file dependencias
├── package.json                     # Scripts workspace raíz
├── tsconfig.base.json               # TypeScript base config
├── vitest.config.ts                 # Configuración test unitario
├── playwright.config.ts             # Configuración E2E
│
├── apps/
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/               # Rutas/pantallas (radicación, búsqueda, etc.)
│   │   │   ├── components/          # Componentes reutilizables
│   │   │   ├── hooks/               # Custom hooks (auth, multitenant)
│   │   │   ├── context/             # Context API (tenant, user)
│   │   │   ├── services/            # API clients (REST)
│   │   │   ├── types/               # TypeScript interfaces
│   │   │   ├── styles/              # CSS/Tailwind
│   │   │   └── main.tsx
│   │   ├── public/                  # Assets estáticos
│   │   ├── tests/                   # Tests E2E (Playwright)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts           # Vite bundler
│   │   └── .env.example
│   │
│   ├── identity-access-service/     # MS-01: Organización, usuarios, IAM
│   │   ├── src/
│   │   │   ├── interfaces/          # Controllers REST
│   │   │   ├── application/         # Servicios, DTOs, validación
│   │   │   ├── domain/              # Entidades, reglas negocio
│   │   │   ├── infrastructure/      # Repositorios, Keycloak, BD
│   │   │   ├── common/              # Guards, decoradores, exceptions
│   │   │   └── main.ts
│   │   ├── tests/
│   │   │   ├── unit/                # Tests unitarios (domain)
│   │   │   └── integration/         # Tests integración (BD real)
│   │   ├── Dockerfile               # Build multi-stage
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── document-core-service/       # MS-02: Docs, expedientes, búsqueda
│   │   ├── src/
│   │   │   ├── interfaces/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/      # Repositorios, FTS (PostgreSQL)
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── correspondence-workflow-service/  # MS-03: Radicaciones, tareas, aprobaciones
│   │   ├── src/
│   │   │   ├── interfaces/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── document-processing-worker/  # MS-04: Carga, antivirus, OCR, hash
│   │   ├── src/
│   │   │   ├── interfaces/          # Event listeners (EventBridge/RabbitMQ)
│   │   │   ├── application/         # Orquestación trabajos
│   │   │   ├── domain/              # Lógica scanning, OCR, hash
│   │   │   ├── infrastructure/      # S3/MinIO, antivirus client
│   │   │   ├── workers/             # Job processors (queue consumers)
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── audit-compliance-service/    # MS-05: Auditoría, privacidad, compliance
│   │   ├── src/
│   │   │   ├── interfaces/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/      # Repositorios audit_logs
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── notification-integration-service/  # MS-06: Notificaciones, integraciones
│       ├── src/
│       │   ├── interfaces/
│       │   ├── application/
│       │   ├── domain/
│       │   ├── infrastructure/      # Email, SMS, Slack clients
│       │   ├── common/
│       │   └── main.ts
│       ├── tests/
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── libs/
│   ├── shared-types/                # TypeScript interfaces compartidas (DTOs, eventos)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── api/                 # OpenAPI types
│   │   │   ├── events/              # Event schemas
│   │   │   ├── commands/            # Command schemas
│   │   │   └── domain/              # Tipos compartidos
│   │   └── package.json
│   │
│   ├── shared-middleware/           # Middlewares compartidos (auth, tenant, logging)
│   │   ├── src/
│   │   │   ├── auth/                # JWT validation, Keycloak
│   │   │   ├── tenant/              # Set tenant context (RLS)
│   │   │   ├── logging/             # OpenTelemetry
│   │   │   ├── error-handling/      # Global exception filter
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-testing/              # Fixtures, utilities para testing
│   │   ├── src/
│   │   │   ├── testcontainers/      # PostgreSQL container setup
│   │   │   ├── seeds/               # Datos de prueba
│   │   │   ├── mocks/               # MSW setup, mock services
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── database/                    # Migraciones y configuración PostgreSQL
│   │   ├── migrations/              # Migraciones (node-pg-migrate)
│   │   │   ├── 001_baseline.sql     # Esquema inicial
│   │   │   ├── 002_rls_policies.sql # Políticas RLS
│   │   │   └── ...
│   │   ├── seeds/                   # Datos iniciales (dev/test)
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── shared-config/               # Configuración centralizada
│       ├── src/
│       │   ├── env.ts               # Variables entorno
│       │   ├── logger.ts            # Logger OpenTelemetry
│       │   ├── database.ts          # Pool PostgreSQL
│       │   ├── cache.ts             # Redis (si aplica)
│       │   └── index.ts
│       └── package.json
│
├── pocs/
│   ├── poc-001-multitenancy/        # POC-001: Multitenancy + RLS + Keycloak
│   │   ├── src/
│   │   │   ├── setup.ts             # Inicialización workspace
│   │   │   ├── scenarios/           # Casos de prueba POC
│   │   │   │   ├── scenario-1-auth.test.ts
│   │   │   │   ├── scenario-2-rls-isolation.test.ts
│   │   │   │   └── scenario-3-audit.test.ts
│   │   │   └── fixtures/
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── poc-002-document-pipeline/   # POC-002: Upload + Antivirus + Outbox
│       ├── src/
│       │   ├── scenarios/
│       │   │   ├── scenario-1-upload.test.ts
│       │   │   ├── scenario-2-antivirus.test.ts
│       │   │   └── scenario-3-events.test.ts
│       │   └── fixtures/
│       ├── package.json
│       └── README.md
│
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.backend       # Multi-stage NestJS
│   │   ├── Dockerfile.frontend      # Vite + nginx
│   │   └── docker-compose.override.yml
│   │
│   ├── kubernetes/                  # K8s manifests (futuro, MVP no incluye)
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── configmaps/
│   │   └── secrets/
│   │
│   ├── terraform/                   # IaC AWS (futuro)
│   │   ├── main.tf
│   │   ├── vpc.tf
│   │   ├── rds.tf
│   │   └── s3.tf
│   │
│   └── scripts/
│       ├── setup-dev.sh             # Setup local
│       ├── migrate.sh               # Run migrations
│       ├── seed.sh                  # Cargar fixtures
│       └── clean.sh                 # Limpiar entorno
│
├── docs/
│   ├── 00_Gestion_Proyecto/         # Governanza
│   ├── 01_Requisitos/               # Especificación funcional
│   ├── 02_Analisis/                 # Análisis AS-IS
│   ├── 03_Arquitectura/             # Decisiones técnicas
│   ├── 04_Base_Datos/               # Modelo de datos
│   ├── 05_Backend/                  # Especificación APIs
│   ├── 06_Frontend/                 # Especificación UI
│   ├── 07_Seguridad_Privacidad/     # STRIDE, LSRPD
│   ├── 08_Cumplimiento_Legal/       # Normativa
│   ├── 09_Politicas_Legales/        # Políticas
│   ├── 10_Pruebas/                  # Estrategia testing
│   ├── 11_Despliegue_Operacion/     # Operación
│   ├── 12_Manuales/                 # Guías usuario/operador
│   └── 99_Fuentes_Heredadas/        # Documentos anteriores
│
├── scripts/
│   ├── ci-build.sh                  # Build todas las apps
│   ├── ci-test.sh                   # Tests todas las apps
│   ├── ci-lint.sh                   # Linting (ESLint, Prettier)
│   ├── dev-start.sh                 # Start local dev stack
│   ├── dev-stop.sh                  # Stop dev stack
│   └── dev-reset.sh                 # Reset BD + cache
│
├── .editorconfig                    # Configuración editor (IDE neutral)
├── .eslintrc.json                   # Linting JavaScript/TypeScript
├── .prettierrc                       # Formateador código
├── CONTRIBUTING.md                  # Guía contribución
├── ARCHITECTURE.md                  # Resumen arquitectura
├── README.md                         # Instrucciones raíz
├── LICENSE                          # Licencia proyecto
└── CHANGELOG.md                      # Historial cambios
```

---

## 2. Configuración raíz — package.json workspace

```json
{
  "name": "gestion-documental-workspace",
  "version": "0.0.0",
  "private": true,
  "description": "SGD Monorepo: 6 macroservicios + frontend + tests + documentación",
  "packageManager": "pnpm@11.9.0",
  "engines": {
    "node": ">=24.14.0 <25",
    "pnpm": "11.9.0"
  },
  
  "scripts": {
    "setup": "pnpm install && pnpm db:migrate && pnpm db:seed",
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r --if-present run build",
    "test": "pnpm -r --if-present run test",
    "test:poc": "pnpm --filter './pocs/*' run test",
    "test:e2e": "pnpm --filter './apps/frontend' run test:e2e",
    "lint": "pnpm -r --if-present run lint",
    "format": "pnpm -r --if-present run format",
    "db:migrate": "pnpm --filter database run migrate",
    "db:seed": "pnpm --filter database run seed",
    "db:reset": "pnpm db:migrate:down && pnpm db:migrate && pnpm db:seed",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  },

  "devDependencies": {
    "@types/node": "^24.10.0",
    "@types/react": "^19.2.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "typescript": "^7.0.0",
    "vitest": "^4.1.0",
    "playwright": "^1.61.0"
  }
}
```

---

## 3. Convenciones de código

### Nomenclatura

| Entidad | Convención | Ejemplo |
|---|---|---|
| Carpetas | kebab-case | `identity-access-service`, `shared-types` |
| Archivos TypeScript | kebab-case.ts | `document.entity.ts`, `user.dto.ts` |
| Clases/Interfaces | PascalCase | `DocumentEntity`, `CreateDocumentDto` |
| Funciones/variables | camelCase | `getUserPermissions()`, `tenant_id` |
| Constantes | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `TENANT_ID_HEADER` |
| Rutas API | kebab-case | `POST /documents/search`, `GET /users/:id` |

### Estructura archivos NestJS (cada MS)

```
src/
├── interfaces/          # Controllers
│   └── http/
│       ├── documents.controller.ts
│       └── documents.dto.ts
├── application/         # Servicios, DTOs, validación
│   ├── services/
│   │   └── document.service.ts
│   ├── dtos/
│   │   ├── create-document.dto.ts
│   │   └── update-document.dto.ts
│   └── validators/
│       └── document.validator.ts
├── domain/              # Entidades, agregados, reglas
│   ├── entities/
│   │   └── document.entity.ts
│   ├── repositories/    # Interfaces (no impl)
│   │   └── document.repository.interface.ts
│   └── exceptions/
│       └── document-not-found.exception.ts
├── infrastructure/      # Implementación repositorios
│   ├── repositories/
│   │   └── document.repository.ts
│   ├── database/
│   │   └── migrations/
│   └── external/        # Keycloak, S3, etc
│       └── keycloak.client.ts
├── common/              # Guards, decoradores, pipes
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── decorators/
│   │   └── current-tenant.decorator.ts
│   └── filters/
│       └── global-exception.filter.ts
├── app.module.ts        # Módulo raíz NestJS
└── main.ts              # Entry point
```

---

## 4. Import paths — tsconfig.base.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workspace/*": ["*"],
      "@app/identity/*": ["apps/identity-access-service/src/*"],
      "@app/document/*": ["apps/document-core-service/src/*"],
      "@app/correspondence/*": ["apps/correspondence-workflow-service/src/*"],
      "@app/processing/*": ["apps/document-processing-worker/src/*"],
      "@app/audit/*": ["apps/audit-compliance-service/src/*"],
      "@app/notification/*": ["apps/notification-integration-service/src/*"],
      "@app/frontend/*": ["apps/frontend/src/*"],
      "@lib/types": ["libs/shared-types/src"],
      "@lib/middleware": ["libs/shared-middleware/src"],
      "@lib/testing": ["libs/shared-testing/src"],
      "@lib/config": ["libs/shared-config/src"]
    }
  }
}
```

---

## 5. Variables entorno — .env.example

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://dev:dev@localhost:5432/sgd_dev
DATABASE_POOL_SIZE=10
DATABASE_STATEMENT_CACHE_SIZE=25

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=sgd
KEYCLOAK_CLIENT_ID=sgd-backend
KEYCLOAK_CLIENT_SECRET=[secret]

# AWS (SaaS)
AWS_REGION=us-east-1
AWS_S3_BUCKET=sgd-documents-dev
AWS_EVENTBRIDGE_BUS=sgd-events-dev

# RabbitMQ (private installations)
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# MinIO (local object storage)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=sgd-documents

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_EXPORTER_OTLP_HEADERS=

# Logging
LOG_LEVEL=debug

# Frontend
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=sgd
REACT_APP_KEYCLOAK_CLIENT_ID=sgd-frontend

# Testing
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/sgd_test
ANTIVIRUS_MOCK=true
```

---

## 6. CI/CD Pipeline — GitHub Actions skeleton

**.github/workflows/ci-backend.yml**

```yaml
name: CI — Backend

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/**'
      - 'libs/**'
      - 'pnpm-lock.yaml'
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: sgd_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 11.9.0
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run tests
        env:
          TEST_DATABASE_URL: postgresql://test:test@localhost:5432/sgd_test
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

---

## 7. Setup local — docker-compose.yml

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: sgd-postgres
    environment:
      POSTGRES_DB: sgd_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: sgd-minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  keycloak:
    image: keycloak/keycloak:latest
    container_name: sgd-keycloak
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/sgd_dev
      KC_DB_USERNAME: dev
      KC_DB_PASSWORD: dev
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    command: start-dev

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: sgd-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  postgres_data:
  minio_data:
  rabbitmq_data:
```

---

## 8. Scripts útiles

**scripts/dev-start.sh**

```bash
#!/bin/bash
set -e

echo "🚀 Starting SGD workspace..."

# Check dependencies
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm not found. Install from https://pnpm.io"
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Install from https://docker.com"
  exit 1
fi

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🐳 Starting Docker services..."
docker-compose up -d

echo "🔄 Waiting for PostgreSQL..."
sleep 3

echo "📊 Running migrations..."
pnpm db:migrate

echo "🌱 Seeding database..."
pnpm db:seed

echo "✅ Workspace ready!"
echo "   Frontend: http://localhost:5173"
echo "   API: http://localhost:3000/api/v1"
echo "   Keycloak: http://localhost:8080"
echo "   MinIO: http://localhost:9001"
echo ""
echo "Start development with: pnpm dev"
```

**scripts/dev-stop.sh**

```bash
#!/bin/bash
echo "🛑 Stopping Docker services..."
docker-compose down
echo "✅ Workspace stopped"
```

---

## 9. Convenciones Git

### Ramas

```
main/           # Producción
  ├─ v1.0.0     # Releases
  └─ hotfix/*   # Correcciones críticas

develop/        # Integración
  └─ feature/*  # Nuevas características
  └─ fix/*      # Bugfixes
  └─ poc/*      # Pruebas de concepto
```

### Commits

```
format: <tipo>(<escopo>): <descripción>

Tipos:
- feat: Nueva característica
- fix: Corrección bug
- docs: Documentación
- style: Formato código
- refactor: Refactorización
- test: Tests
- chore: Tareas (deps, build)

Escopo (opcional):
- api, frontend, iam, doc, cor, audit, etc.

Ejemplo:
feat(iam): Agregar vinculación Keycloak
fix(doc): Corregir búsqueda full-text
docs(workspace): Actualizar setup local
```

---

## 10. Acceso y permisos

**.github/CODEOWNERS**

```
# Frontend
apps/frontend/                      @todo-frontend-owner

# Microservicios
apps/identity-access-service/       @antonio-arquitec
apps/document-core-service/         @antonio-arquitec
apps/correspondence-workflow-service/ @antonio-arquitec
apps/document-processing-worker/    @antonio-arquitec
apps/audit-compliance-service/      @oscar-seguridad
apps/notification-integration-service/ @antonio-arquitec

# Libs compartidas
libs/                               @antonio-arquitec

# Infraestructura
infra/                              @neffer-operaciones
.github/                            @neffer-operaciones

# Base de datos
libs/database/                      @antonio-arquitec

# Documentación
docs/                               @alvaro-po
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Estructura monorepo, 6 MS + frontend + libs, convenciones, scripts, CI/CD skeleton. | Antonio José Escrucería Uribe |
