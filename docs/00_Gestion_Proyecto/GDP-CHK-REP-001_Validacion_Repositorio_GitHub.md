# Validación — Repositorio GitHub

| Campo | Valor |
|---|---|
| Código | GDP-CHK-REP-001 |
| Versión | 1.0 |
| Fecha | 2026-09-15 |
| Repositorio | https://github.com/Escruceria/gestion_documental.git |
| Propósito | Validar que estructura repo coincida con documentación GDP-DEP-001 |

---

## CHECKLIST: Estructura de Carpetas

### ✅ Raíz del repo

```bash
gestion_documental/
├── 📁 apps/                    # Aplicaciones (6 MS + frontend)
├── 📁 libs/                    # Librerías compartidas
├── 📁 pocs/                    # Pruebas de concepto
├── 📁 infra/                   # Infraestructura (docker, k8s, terraform)
├── 📁 docs/                    # Documentación
├── 📁 .github/                 # GitHub Actions workflows
├── 📄 pnpm-workspace.yaml      # Workspace monorepo
├── 📄 docker-compose.yml       # Local development services
├── 📄 tsconfig.base.json       # TypeScript base config
├── 📄 .gitignore               # Git ignore rules
├── 📄 README.md                # Readme principal
├── 📄 package.json             # Root package.json
└── 📄 .env.example             # Variables de entorno ejemplo
```

**Verificar:**
```bash
cd gestion_documental
ls -la | grep -E "^d|pnpm-workspace|docker-compose|tsconfig"
```

---

### ✅ Carpeta `apps/` (6 Macroservicios + Frontend)

```bash
apps/
├── 📁 identity-access-service/       # MS-01: Identidad y acceso (Keycloak)
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── 📁 document-core-service/          # MS-02: Core documentos
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── 📁 correspondence-workflow-service/ # MS-03: Radicación y workflow
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── 📁 document-processing-worker/     # MS-04: Procesamiento (antivirus, MIME)
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── 📁 audit-compliance-service/       # MS-05: Auditoría y cumplimiento
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── 📁 notification-integration-service/ # MS-06: Notificaciones
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
└── 📁 frontend/                        # Frontend React + Vite
    ├── src/
    ├── public/
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
```

**Verificar:**
```bash
ls -la apps/ | wc -l  # Debe ser 7 (6 MS + frontend + total)
find apps -name "package.json" | wc -l  # Debe ser 7
```

---

### ✅ Carpeta `libs/` (Librerías Compartidas)

```bash
libs/
├── 📁 shared-types/              # TypeScript interfaces + branded types
│   ├── src/
│   │   ├── domain/              # Entidades de dominio
│   │   ├── dtos/                # Data Transfer Objects
│   │   ├── events/              # Domain Events
│   │   ├── errors/              # Error types (RFC 9457)
│   │   ├── audit/               # Audit log types
│   │   └── context/             # Request context
│   ├── package.json
│   └── tsconfig.json
├── 📁 database/                  # Database setup + migrations + seeds
│   ├── migrations/
│   │   ├── 001_base_extensions.sql
│   │   ├── 002_iam_tables.sql
│   │   ├── 003_core_tables.sql
│   │   ├── 004_correspondence_tables.sql
│   │   └── 005_audit_tables.sql
│   ├── seeds/
│   │   └── 001_poc001_base.sql
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── 📁 middleware/                # Shared middleware (SetTenantMiddleware, etc)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── 📁 testing/                   # Testing utilities (Testcontainers, etc)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── 📁 config/                    # Shared configuration
    ├── src/
    ├── package.json
    └── tsconfig.json
```

**Verificar:**
```bash
ls -la libs/
find libs -name "*.sql" -path "*/migrations/*" | wc -l  # Debe ser ~5
find libs/database/seeds -name "*.sql" | wc -l  # Debe ser >=1
```

---

### ✅ Carpeta `pocs/` (Pruebas de Concepto)

```bash
pocs/
├── 📁 poc-001-multitenancy/       # POC-001: Multitenancy + RLS
│   ├── src/
│   ├── test/
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
└── 📁 poc-002-document-pipeline/  # POC-002: Carga documental
    ├── src/
    ├── test/
    ├── README.md
    ├── package.json
    └── tsconfig.json
```

**Verificar:**
```bash
ls -la pocs/
```

---

### ✅ Carpeta `infra/` (Infraestructura)

```bash
infra/
├── 📁 docker/                     # Docker images custom
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.worker
├── 📁 kubernetes/                 # Kubernetes manifests (future)
│   ├── deployment.yml
│   ├── service.yml
│   └── configmap.yml
├── 📁 terraform/                  # Terraform para AWS (future)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── 📁 scripts/                    # Scripts de utilidad
│   ├── dev.sh                     # Start local dev
│   ├── docker-up.sh               # Start Docker services
│   ├── db-migrate.sh              # Run migrations
│   ├── db-seed.sh                 # Load seeds
│   ├── test.sh                    # Run tests
│   └── ci-check.sh                # Pre-commit checks
└── 📄 .env.local.example          # Local env variables
```

**Verificar:**
```bash
ls -la infra/
find infra/scripts -type f | wc -l
```

---

### ✅ Carpeta `docs/` (Documentación)

```bash
docs/
├── 📁 00_Gestion_Proyecto/
│   ├── 01_Acta_Inicio_Proyecto.md
│   ├── 02_Alcance_Proyecto.md
│   ├── 03_Objetivos_Proyecto.md
│   ├── 04_Interesados_Stakeholders.md
│   ├── 05_Matriz_RACI.csv
│   ├── 06_Glosario.md
│   ├── 07_Control_Cambios.md
│   ├── 08_Checklist_Recoleccion_Datos_Venus.md
│   ├── 17_Autorizacion_Inicio_Desarrollo.md
│   └── ... (más documentos)
├── 📁 01_Requisitos/
│   ├── 01_ERS_SRS_Gestion_Documental.md
│   ├── 02_Catalogo_Requisitos_Funcionales.md
│   ├── 03_Catalogo_Requisitos_No_Funcionales.md
│   └── ... (más documentos)
├── 📁 02_Analisis/
│   ├── 01_Analisis_Procesos_Negocio.md
│   ├── 02_Mapa_Procesos.md
│   └── 99_Validacion_Datos_Reales_Venus.md
├── 📁 03_Arquitectura/
│   ├── 03_Vista_Contexto_C4.md
│   ├── 04_Vista_Contenedores_C4.md
│   ├── 05_Vista_Componentes_C4.md
│   └── ADR-011 a ADR-021 (arquitectura)
├── 📁 04_Base_Datos/
│   ├── 03_DDL_POC001_PostgreSQL.md
│   ├── 04_Seeds_Datos_POC001.md
│   └── ...
├── 📁 05_Backend/
│   ├── 01_OpenAPI_Flujo_Vertical.md
│   ├── 02_TypeScript_Interfaces_POC001.md
│   └── ...
├── 📁 06_Frontend/
├── 📁 07_Seguridad_Privacidad/
├── 📁 08_Cumplimiento_Legal/
├── 📁 09_Politicas_Legales/
├── 📁 10_Pruebas/
│   ├── 01_Plan_Testing_Layers.md
│   ├── 02_Criterios_Gate_POC.md
│   └── ...
├── 📁 11_Despliegue_Operacion/
│   ├── 01_Estructura_Workspace_Monorepo.md
│   ├── 02_Convenciones_Desarrollo.md
│   ├── 03_Setup_Workspace_Checklist.md
│   └── 04_Validacion_Fase4_Checklist.md
├── 📁 12_Manuales/
└── 📁 99_Fuentes_Heredadas/
```

**Verificar:**
```bash
find docs -type f -name "*.md" | wc -l  # Debe ser 50+
```

---

### ✅ Archivos de Configuración en Raíz

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'
```

**`tsconfig.base.json`:**
```json
{
  "compilerOptions": {
    "paths": {
      "@lib/types": ["libs/shared-types/src"],
      "@lib/database": ["libs/database/src"],
      "@lib/middleware": ["libs/middleware/src"],
      "@lib/testing": ["libs/testing/src"],
      "@lib/config": ["libs/config/src"]
    }
  }
}
```

**`docker-compose.yml`:**
```yaml
services:
  postgres:
    image: postgres:16-alpine
  keycloak:
    image: keycloak:latest
  minio:
    image: minio:latest
  rabbitmq:
    image: rabbitmq:3-management-alpine
```

**Verificar:**
```bash
cat pnpm-workspace.yaml | grep -E "apps|libs|pocs"
cat tsconfig.base.json | grep "@lib"
cat docker-compose.yml | grep -E "postgres|keycloak|minio|rabbitmq"
```

---

### ✅ GitHub Actions Workflows

```bash
.github/workflows/
├── 📄 ci-backend.yml             # Tests + lint backend
├── 📄 ci-frontend.yml            # Tests + lint frontend
├── 📄 security-scan.yml          # OWASP ZAP scanning
└── 📄 docker-build.yml           # Docker image build (future)
```

**Verificar:**
```bash
ls -la .github/workflows/
```

---

## Validación de Contenido

### ✅ `libs/shared-types/src/` debe contener:

```bash
domain/
├── index.ts              # TenantId, UserId, DocumentId, etc (branded types)
├── organization.ts       # Organization interface
├── user.ts              # User interface
├── document.ts          # Document interface
└── correspondence.ts    # Correspondence interface

dtos/
├── index.ts
├── auth.ts              # CreateOrganizationDto, CreateUserDto, etc
├── documents.ts         # CreateDocumentDto, DocumentResponseDto, etc
└── correspondence.ts    # CreateCorrespondenceDto, etc

events/
├── index.ts
├── domain-events.ts     # OrganizationCreatedEvent, DocumentCreatedEvent, etc
└── types.ts             # Type union AllDomainEvents

errors/
├── index.ts
└── problem-detail.ts    # RFC 9457 ProblemDetail interface

audit/
└── index.ts             # AuditLogPayload interface

context/
└── index.ts             # RequestContext, CurrentTenant, CurrentUser
```

**Verificar:**
```bash
find libs/shared-types/src -name "*.ts" | head -20
```

---

### ✅ `libs/database/migrations/` debe contener:

```sql
001_base_extensions.sql      # uuid-ossp, btree_gin, btree_gist
002_iam_tables.sql           # organizations, users, roles, permissions (8 tablas)
003_core_tables.sql          # documents, series, expedients (9 tablas)
004_correspondence_tables.sql # correspondences, sequences, channels (6 tablas)
005_audit_tables.sql         # audit_logs, consent_logs, privacy_requests (4 tablas)
```

**Verificar:**
```bash
wc -l libs/database/migrations/*.sql
grep -l "CREATE TABLE" libs/database/migrations/*.sql
```

Debe retornar ~28 tablas totales.

---

### ✅ `libs/database/seeds/` debe contener:

```bash
001_poc001_base.sql          # Venus tenant: 4 usuarios + 4 series + 10 docs
```

**Verificar:**
```bash
wc -l libs/database/seeds/001_poc001_base.sql
grep -c "INSERT INTO" libs/database/seeds/001_poc001_base.sql
```

---

### ✅ `apps/identity-access-service/src/` debe contener:

```bash
interfaces/
├── controllers/
│   └── auth.controller.ts          # POST /auth/login, etc

application/
├── services/
│   ├── keycloak.service.ts
│   └── identity.service.ts
└── dtos/
    └── index.ts

domain/
├── entities/
│   ├── user.entity.ts
│   └── organization.entity.ts
└── exceptions/
    └── identity.exception.ts

infrastructure/
├── repositories/
│   └── user.repository.ts
└── external/
    └── keycloak.client.ts
```

**Verificar:**
```bash
find apps/identity-access-service/src -type d
```

---

## Validación de Scripts

### ✅ `package.json` raíz debe contener scripts:

```json
{
  "scripts": {
    "dev": "pnpm run --filter ./apps/* dev",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "db:migrate": "pnpm --filter database run migrate",
    "db:seed": "pnpm --filter database run seed",
    "db:reset": "pnpm --filter database run reset",
    "test": "pnpm run --filter ./apps/* test",
    "test:watch": "pnpm run --filter ./apps/* test:watch",
    "lint": "pnpm run --filter ./apps/* lint",
    "build": "pnpm run --filter ./apps/* build",
    "ci:check": "./infra/scripts/ci-check.sh"
  }
}
```

**Verificar:**
```bash
cat package.json | grep -A 15 '"scripts"'
```

---

## Estado Actual del Repo

Ejecutar esta validación:

```bash
cd gestion_documental

echo "=== ESTRUCTURA GENERAL ==="
ls -la | grep -E "^d|^-" | grep -v "^\."

echo "=== APPS ==="
ls -la apps/ | wc -l

echo "=== LIBS ==="
ls -la libs/

echo "=== MIGRATIONS ==="
find libs/database/migrations -name "*.sql" | wc -l

echo "=== SEEDS ==="
find libs/database/seeds -name "*.sql"

echo "=== TypeScript Types ==="
find libs/shared-types/src -name "*.ts" | wc -l

echo "=== Package.json en apps ==="
find apps -maxdepth 2 -name "package.json" | wc -l

echo "=== Workflows ==="
ls -la .github/workflows/ | grep -E ".yml"

echo "=== Documentación ==="
find docs -name "*.md" | wc -l
```

---

## Resultado de Validación

### Checklist Final

- [ ] Carpeta `apps/` contiene 7 subdirectorios (6 MS + frontend)
- [ ] Carpeta `libs/` contiene 5 subdirectorios (types, database, middleware, testing, config)
- [ ] Carpeta `pocs/` contiene 2 subdirectorios (POC-001, POC-002)
- [ ] `pnpm-workspace.yaml` existe y está configurado
- [ ] `tsconfig.base.json` existe con path mappings
- [ ] `docker-compose.yml` tiene 4 servicios (postgres, keycloak, minio, rabbitmq)
- [ ] `.github/workflows/` contiene 3+ archivos YAML
- [ ] `libs/database/migrations/` contiene 5 archivos SQL
- [ ] `libs/database/seeds/` contiene 001_poc001_base.sql
- [ ] `libs/shared-types/src/` contiene domain, dtos, events, errors, audit, context
- [ ] `docs/` contiene 50+ archivos Markdown
- [ ] `package.json` raíz contiene scripts (dev, docker:up, db:migrate, etc)
- [ ] Todos los `apps/MS-*/` tienen `src/`, `test/`, `package.json`, `tsconfig.json`

**Si todos están ✅:**
→ **Repositorio LISTO para desarrollo POC-001**

**Si hay ❌:**
→ **Validar cuáles faltan y crearlos**

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-09-15 | Checklist validación repositorio GitHub: estructura, contenido, scripts, workflows. | Antonio José Escrucería Uribe |
