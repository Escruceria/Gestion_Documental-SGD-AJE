# Setup Workspace y Checklist Inicialización

| Campo | Valor |
|---|---|
| Código | GDP-DEP-003 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A1) |
| Fecha | 2026-08-05 |
| Propietario | Neffer Anais Martínez (Operaciones) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), David Ernesto Antequera Martínez (QA) |
| Fecha inicio esperada | 2026-08-15 (primera setup) |

---

## 1. Requisitos previos

**Hardware mínimo:**
- CPU: 4 cores
- RAM: 8 GB (16 GB recomendado)
- Disco: 50 GB disponible
- SO: Linux (Ubuntu 22.04+), macOS 12+, Windows 11 + WSL2

**Software obligatorio:**
- Node.js 24.14.0 o superior
- pnpm 11.9.0 (package manager)
- Docker 24.0+ + Docker Compose 2.0+
- Git 2.40+
- VS Code (recomendado) o IDE similar

---

## 2. Instalación inicial (Primera vez)

### Paso 1: Clonar repositorio

```bash
git clone https://github.com/tu-org/gestion-documental.git
cd gestion-documental
```

### Paso 2: Verificar versiones

```bash
node --version      # Debe ser 24.14.0+
pnpm --version      # Debe ser 11.9.0+
docker --version    # Debe ser 24.0+
git --version       # Debe ser 2.40+
```

### Paso 3: Instalar dependencias

```bash
pnpm install --frozen-lockfile
# Esto instala:
# - Dependencias workspace
# - Dependencias por app
# - Dependencias por lib
```

### Paso 4: Copiar variables entorno

```bash
cp .env.example .env.development.local
# Editar .env.development.local si es necesario (normalmente no)
```

### Paso 5: Iniciar servicios Docker

```bash
docker-compose up -d

# Esperar a que PostgreSQL, MinIO, Keycloak estén listos
docker-compose logs -f postgres   # Buscar "database system is ready to accept connections"
```

### Paso 6: Migraciones BD

```bash
pnpm db:migrate
# Esto:
# - Crea esquema base
# - Aplica RLS policies
# - Crea índices
```

### Paso 7: Seedear datos de desarrollo

```bash
pnpm db:seed
# Esto crea:
# - Organización de prueba (tenant-001)
# - 5 usuarios de prueba (contraseña: 'test123')
# - Series, tipos de documento de ejemplo
```

### Paso 8: Verificar setup

```bash
# Tests unitarios (debe pasar todos)
pnpm test

# Build (debe completarse sin errores)
pnpm build

# Verificar servicios están corriendo
docker-compose ps
# Esperado: postgres, minio, keycloak, rabbitmq en estado "Up"
```

**¡Setup completado!** ✅

---

## 3. Inicio rápido — Desarrollo diario

```bash
# Iniciar todos los servicios en terminal 1
pnpm dev

# En otra terminal, ver logs
pnpm docker:logs

# En VS Code:
# - Abrir apps/frontend/src/App.tsx
# - Ir a http://localhost:5173 en navegador
# - Login: test.user@venus.com / test123
```

---

## 4. Checklist pre-POC-001 (2026-08-31)

**Infrastructure & Setup:**
- [ ] Repositorio GitHub creado y acceso asignado al equipo
- [ ] CI/CD pipeline configurado (.github/workflows/*.yml)
- [ ] Docker compose probado en 3 máquinas diferentes
- [ ] Documentación README.md actualizada
- [ ] Secretos (API keys) en GitHub Secrets, no en .env
- [ ] Pre-commit hook para linting (husky)

**Dependencias instaladas:**
- [ ] Node.js 24.14.0 verificado en CI
- [ ] pnpm 11.9.0 locked en package.json
- [ ] TypeScript 7.0+ compilando
- [ ] NestJS 11+ en cada MS
- [ ] React 19+ + Vite en frontend
- [ ] Vitest + Testcontainers para tests
- [ ] OpenTelemetry configured

**Base de datos:**
- [ ] PostgreSQL 16 en docker-compose
- [ ] Migrations ejecutables y versionadas
- [ ] RLS policies implementadas y testables
- [ ] Seeds de datos para desarrollo
- [ ] Script db:reset funcionando
- [ ] Backup local exportable

**Keycloak:**
- [ ] Keycloak container en docker-compose
- [ ] Realm "sgd" creado
- [ ] Cliente backend + frontend configurado
- [ ] Usuarios de prueba creados
- [ ] Validación JWT en middleware listo

**Arquitectura:**
- [ ] 6 macroservicios scaffolded en apps/
- [ ] Frontend React + TypeScript en apps/frontend/
- [ ] Libs compartidas en libs/
- [ ] tsconfig.base.json con paths mapeados
- [ ] Estructura de carpetas según convenciones

**Testing:**
- [ ] vitest.config.ts definido
- [ ] Testcontainers PostgreSQL funcionando
- [ ] MSW (Mock Service Worker) para mocks HTTP
- [ ] Playwright configurado para E2E
- [ ] k6 configurado para load tests

**Documentación:**
- [ ] README.md con quick-start
- [ ] CONTRIBUTING.md con guía PR
- [ ] ARCHITECTURE.md resumen técnico
- [ ] docs/11_Despliegue_Operacion/ completo

**CI/CD:**
- [ ] GitHub Actions configurado
- [ ] Tests ejecutan en cada PR
- [ ] Linting (ESLint + Prettier) en CI
- [ ] Build completo sin errores
- [ ] Coverage reportado (Codecov)

**Seguridad:**
- [ ] .env.example NO contiene secretos
- [ ] GitHub Secrets configurados (KEYCLOAK_SECRET, DB_PASSWORD, etc.)
- [ ] Dependencias sin vulnerabilidades críticas (npm audit)
- [ ] Pre-commit hook para secrets scanning

---

## 5. Checklist pre-POC-002 (2026-10-31)

**Adicional a POC-001:**

- [ ] S3/MinIO integrado en docker-compose
- [ ] Antivirus mock integrado
- [ ] EventBridge/SQS o RabbitMQ funcionando
- [ ] Outbox/Inbox implementado
- [ ] Hash SHA-256 calculable
- [ ] OpenTelemetry OTLP exporter funcional
- [ ] OpenAPI 3.1 contrato deployed (Swagger UI)
- [ ] E2E tests para carga de documentos

---

## 6. Troubleshooting rápido

| Problema | Solución |
|---|---|
| **"pnpm: command not found"** | `npm install -g pnpm@11.9.0` |
| **PostgreSQL connection refused** | `docker-compose logs postgres`, asegurar puerto 5432 libre |
| **Port already in use** | `lsof -i :5432` (identificar proceso), `kill -9 <PID>` |
| **Migrations failed** | `pnpm db:reset` (limpia y vuelve a crear) |
| **Tests timeout** | Aumentar timeout en vitest.config.ts a 30000ms |
| **Keycloak 502 Bad Gateway** | Esperar 30s, Keycloak necesita tiempo para iniciar BD |
| **MinIO bucket no existe** | `docker exec sgd-minio mkdir -p /data/sgd-documents` |
| **Out of memory** | Aumentar heap: `NODE_OPTIONS="--max-old-space-size=4096"` |

---

## 7. Scripts útiles día a día

```bash
# Desenvolvimento
pnpm dev              # Inicia todos los servicios (localhost:5173, 3000)
pnpm build            # Build completo
pnpm test             # Tests todas las apps
pnpm lint             # Linting + Prettier

# Base de datos
pnpm db:migrate       # Ejecutar migraciones
pnpm db:seed          # Cargar datos de prueba
pnpm db:reset         # Limpia y vuelve a crear BD
docker-compose exec postgres psql -U dev -d sgd_dev  # psql directo

# Docker
pnpm docker:up        # Inicia servicios (postgres, minio, keycloak, rabbitmq)
pnpm docker:down      # Para servicios
pnpm docker:logs      # Ver logs en tiempo real

# Testing
pnpm test             # Todos los tests
pnpm test:poc         # Solo POCs
pnpm test:e2e         # Solo E2E (Playwright)

# Limpieza
pnpm docker:down && rm -rf node_modules && pnpm install  # Reset completo
```

---

## 8. Acceso a servicios locales

| Servicio | URL | Usuario | Contraseña |
|---|---|---|---|
| Frontend | http://localhost:5173 | test.user@venus.com | test123 |
| API Backend | http://localhost:3000/api/v1 | N/A | N/A |
| Swagger UI | http://localhost:3000/api | N/A | N/A |
| Keycloak | http://localhost:8080 | admin | admin |
| MinIO | http://localhost:9001 | minioadmin | minioadmin |
| PostgreSQL | localhost:5432 | dev | dev |
| RabbitMQ | http://localhost:15672 | guest | guest |

---

## 9. Estructura de una sesión típica de desarrollo

```bash
# Inicio de la jornada
cd gestion-documental
pnpm docker:up                          # Inicia BD + servicios

# En terminal 1
pnpm dev                                # Inicia watchers

# En terminal 2
# Editar código

# Cuando haces commit
git add .
git commit -m "feat(document): agregar búsqueda full-text"
# Pre-commit hook ejecuta: lint, prettier, tests

# Antes de push
pnpm test                               # Asegurar tests verdes
git push origin feature/search-fts

# En GitHub, crear PR
# CI ejecuta automáticamente: lint, test, build
# Si todo ✅, mergear y deletear rama

# Fin de la jornada
pnpm docker:down                        # Para servicios
```

---

## 10. Soporte y escalamiento

**Problemas no listados arriba?**

1. Revisar `docs/11_Despliegue_Operacion/` completo
2. Buscar issue en GitHub (https://github.com/tu-org/gestion-documental/issues)
3. Crear issue nuevo con:
   - Sistema operativo y versiones (node, pnpm, docker)
   - Error exacto y stacktrace
   - Pasos para reproducir
   - Output de `pnpm baseline:versions`

**Contacto:**
- Arquitecto: @antonio-arquitec
- Operaciones: @neffer-operaciones
- QA: david.antequera@...

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Setup inicial, troubleshooting, checklists POC-001/002, scripts. | Neffer Anais Martínez |
