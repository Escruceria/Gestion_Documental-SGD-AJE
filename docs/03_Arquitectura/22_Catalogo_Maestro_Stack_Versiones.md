# Catálogo maestro del stack tecnológico y versiones

| Campo | Valor |
|---|---|
| Código | GDP-ARQ-022 |
| Versión | 1.1 |
| Estado | Borrador controlado; stack aprobado y baseline de versiones pendiente de POC/lockfile |
| Fecha de corte | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Aprobador funcional | Propietario del proyecto |
| ADR fuente | ADR-011 a ADR-021 |

## 1. Propósito

Consolidar en una sola fuente el stack aprobado, la versión objetivo verificada al corte, el mecanismo que fijará la versión reproducible y la política de actualización. Este catálogo no sustituye los ADR: resume sus decisiones y gobierna el baseline técnico.

Las versiones npm indicadas corresponden a la versión publicada consultada el 2026-07-16. Antes de iniciar producción deben demostrarse conjuntamente en POC, registrarse en lockfile/SBOM y fijarse en imágenes por digest cuando corresponda.

## 2. Significado de estados

| Estado | Significado |
|---|---|
| Aprobada | Tecnología y línea de versión decididas explícitamente |
| Baseline candidato | Versión exacta verificada, pendiente de instalación y suite de compatibilidad |
| Gestionado | El proveedor administra versión/API; se fija configuración, región y contrato |
| Pendiente de digest | Producto sin SemVer/baseline estable suficiente; se seleccionará artefacto inmutable en POC |
| Pendiente de decisión | El componente aún no fue aprobado y no debe asumirse |

## 3. Lenguaje, runtime y backend

| Componente | Paquete/artefacto | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| Lenguaje | `typescript` | 7.0.2 | Baseline candidato | `devDependencies` + lockfile |
| Runtime | Node.js Krypton LTS | 24.18.0 | Aprobada | `.nvmrc`/Volta e imagen por digest |
| Framework backend | `@nestjs/core` | 11.1.28 | Baseline candidato | lockfile |
| Núcleo NestJS | `@nestjs/common` | 11.1.28 | Baseline candidato | lockfile; misma línea NestJS |
| Motor HTTP NestJS | `@nestjs/platform-express` | 11.1.28 | Baseline candidato | lockfile; misma línea NestJS |
| Motor HTTP | `express` | 5.2.1 | Baseline candidato | lockfile |
| OpenAPI | `@nestjs/swagger` | 11.4.5 | Baseline candidato | lockfile |
| API | REST + OpenAPI | 3.1 | Aprobada | especificación versionada |
| Utilidades reactivas NestJS | `rxjs` | 7.x compatible | Dependencia requerida | versión exacta al scaffold |
| Metadata NestJS | `reflect-metadata` | 0.2.x compatible | Dependencia requerida | versión exacta al scaffold |

Node.js 24 está en LTS y la publicación oficial mostraba 24.18.0 como último LTS al corte. Solo se admitirán parches 24.x soportados sin reabrir el ADR; cambiar de major requiere revisión. [Ciclo de versiones de Node.js](https://nodejs.org/en/about/previous-releases)

TypeScript 7.0.2 es el baseline candidato publicado, no una excepción automática a compatibilidad. Debe compilar decoradores, metadata, NestJS, Kysely, Vite y pruebas antes de entrar al lockfile de la línea base.

## 4. Validación, contratos y errores backend

| Componente | Paquete/estándar | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| DTO y validación HTTP | `class-validator` | 0.15.1 | Baseline candidato | lockfile |
| Transformación | `class-transformer` | 0.5.1 | Baseline candidato | lockfile |
| Integración global | `ValidationPipe` | NestJS 11.1.28 | Aprobada | framework |
| Errores HTTP | RFC 9457 / `application/problem+json` | RFC 9457 | Aprobada | schemas OpenAPI y pruebas |
| Contratos asíncronos | AsyncAPI | versión a fijar al publicar | Aprobada conceptualmente | documentos/schema registry futuro |
| Esquemas de mensajes | JSON Schema | dialecto a fijar con AsyncAPI | Aprobada conceptualmente | contrato versionado |

La tecnología concreta para validar variables de entorno sigue pendiente. El comportamiento fail-fast aprobado por ADR-017 es obligatorio aunque la biblioteca aún no se haya decidido.

## 5. Datos y migraciones

| Componente | Paquete/artefacto | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| Base transaccional | PostgreSQL | 18.4 | Baseline candidato | imagen/servicio por major 18 y patch actual |
| Query builder | `kysely` | 0.29.3 | Baseline candidato | lockfile |
| Driver/pool | `pg` | 8.22.0 | Baseline candidato | lockfile |
| Migraciones | `node-pg-migrate` | 8.0.4 | Baseline candidato | lockfile |

PostgreSQL 18.4 era el minor soportado actual de la línea 18 al corte; PostgreSQL recomienda ejecutar el minor actual del major soportado. Los upgrades 18.x son de mantenimiento controlado; PostgreSQL 19 requiere plan/ADR de upgrade mayor. [Política de versiones PostgreSQL](https://www.postgresql.org/support/versioning/)

## 6. Identidad y autenticación

| Componente | Paquete/artefacto | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| Servidor IAM | Keycloak | 26.7.0 | Baseline candidato | imagen oficial por digest |
| Adaptador navegador | `keycloak-js` | 26.2.4 | Baseline candidato | lockfile |
| Protocolos | OIDC + OAuth 2.0 | estándares vigentes | Aprobada | configuración y pruebas |
| Flujo SPA | Authorization Code + PKCE | N/A | Aprobada | configuración del realm/cliente |

Keycloak Server y `keycloak-js` tienen ciclos independientes; no se forzará igualdad artificial de versión. La descarga oficial mostraba servidor 26.7.0 y adaptador JavaScript 26.2.4 al corte. [Descargas de Keycloak](https://www.keycloak.org/downloads)

## 7. Frontend

| Necesidad | Paquete | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| Framework UI | `react` | 19.2.7 | Baseline candidato | lockfile |
| Render DOM | `react-dom` | 19.2.7 | Baseline candidato | lockfile; igual a React |
| Build/dev server | `vite` | 8.1.5 | Baseline candidato | lockfile |
| Enrutamiento Data Mode | `react-router` | 8.2.0 | Baseline candidato | lockfile |
| Estado remoto | `@tanstack/react-query` | 5.101.2 | Baseline candidato | lockfile |
| Formularios | `react-hook-form` | 7.81.0 | Baseline candidato | lockfile |
| Validación frontend | `zod` | 4.4.3 | Baseline candidato | lockfile |
| Resolver formulario | `@hookform/resolvers` | 5.4.0 | Baseline candidato | lockfile |
| Componentes | `@mui/material` | 9.2.0 | Baseline candidato | lockfile |
| Estilos | `@emotion/react` | 11.14.0 | Baseline candidato | lockfile |
| Estilos | `@emotion/styled` | 11.14.1 | Baseline candidato | lockfile |
| Iconos | `@mui/icons-material` | 9.2.0 | Baseline candidato | lockfile; igual major MUI |
| Cliente REST | `openapi-fetch` | 0.17.0 | Baseline candidato | lockfile |
| Generador tipos REST | `openapi-typescript` | 7.13.0 | Baseline candidato | lockfile |
| Estado local transversal | `zustand` | 5.0.14 | Baseline candidato | lockfile |
| Internacionalización | `i18next` | 26.3.6 | Baseline candidato | lockfile |
| Integración i18n React | `react-i18next` | 17.0.10 | Baseline candidato | lockfile |
| Fechas | `date-fns` | 4.4.0 | Baseline candidato | lockfile |

React Router 8.2.0 declara React/React DOM 19.2.7 o superior y Node.js 22.22 o superior; la combinación candidata React 19.2.7 + Node 24.18.0 satisface esos requisitos publicados. Vite 8 también admite Node 24.

Uppy y MUI X comercial continúan fuera del baseline conforme a ADR-018.

## 8. Almacenamiento de objetos

| Modalidad | Producto/API | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| SaaS | Amazon S3 | Servicio administrado | Gestionado | región, API, IAM, KMS e IaC |
| Privada | MinIO Server | Release validada en POC | Pendiente de digest | imagen inmutable + checksum/SBOM |
| Cifrado SaaS | AWS KMS/SSE-KMS | Servicio administrado | Gestionado | key ARN/alias e IaC |
| Cifrado privado | KMS externo compatible MinIO | Producto pendiente | Pendiente de decisión | ADR de secretos/KMS privado |

MinIO publica releases por fecha y su distribución/soporte debe verificarse para el modelo privado elegido. No se usará `latest`; POC-002 registrará repositorio, tag, digest, licencia, soporte, checksums, versionado y Object Lock antes de promoverlo.

## 9. Mensajería

| Modalidad | Componente | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| SaaS | Amazon EventBridge | Servicio administrado | Gestionado | bus/reglas mediante IaC |
| SaaS | Amazon SQS | Servicio administrado | Gestionado | colas/policies mediante IaC |
| Privada | RabbitMQ | 4.3.2 | Baseline candidato | imagen oficial por digest |
| Protocolo privado | AMQP | 0-9-1 sobre TLS | Aprobada | configuración |
| Cliente AMQP | `amqplib` | 2.0.1 | Baseline candidato | lockfile |
| Gestión de conexión | `amqp-connection-manager` | 5.0.0 | Baseline candidato | lockfile |

RabbitMQ 4.3.2 era el patch actual de la serie 4.3 con soporte comunitario al corte. Un upgrade de serie requiere pruebas de quorum, confirms, retries, DLQ y rolling upgrade. [Información de releases RabbitMQ](https://www.rabbitmq.com/release-information)

## 10. Pruebas

| Necesidad | Paquete/herramienta | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| Runner común | `vitest` | 4.1.10 | Baseline candidato | lockfile |
| Nest testing | `@nestjs/testing` | 11.1.28 | Baseline candidato | lockfile; igual línea NestJS |
| HTTP backend | `supertest` | 7.2.2 | Baseline candidato | lockfile |
| Infraestructura efímera | `testcontainers` | 12.0.4 | Baseline candidato | lockfile |
| PostgreSQL efímero | `@testcontainers/postgresql` | 12.0.4 | Baseline candidato | lockfile |
| Mock HTTP | `msw` | 2.15.0 | Baseline candidato | lockfile |
| E2E navegador | `@playwright/test` | 1.61.1 | Baseline candidato | lockfile + browsers fijados |
| Motor Playwright | `playwright` | 1.61.1 | Baseline candidato | lockfile; misma línea |
| Accesibilidad | `axe-core` | 4.12.1 | Baseline candidato | lockfile |
| Integración axe | `jest-axe` | 10.0.0 | Baseline candidato | lockfile; compatibilidad Vitest a probar |
| Rendimiento | Grafana k6 | 1.7.1 | Baseline candidato | binario/imagen por digest |
| Seguridad dinámica | OWASP ZAP | estable a fijar en pipeline | Pendiente de digest | imagen oficial por digest |

Vitest 4.1.10 declara compatibilidad con Vite 8 y Node 24. Los browsers instalados por Playwright se fijarán junto con la versión del paquete; no se compartirán caches no versionadas entre pipelines.

## 11. Observabilidad y salud

| Necesidad | Paquete/producto | Versión objetivo | Estado | Fijación |
|---|---|---:|---|---|
| API OTel | `@opentelemetry/api` | 1.9.1 | Baseline candidato | lockfile |
| SDK Node OTel | `@opentelemetry/sdk-node` | 0.220.0 | Baseline candidato | lockfile |
| Collector privado | OTel Collector Contrib | 0.153.0 | Baseline candidato | imagen por digest/config versionada |
| Collector AWS | ADOT Collector | versión soportada al despliegue | Gestionado/pendiente de digest | imagen AWS por digest |
| Logs | `pino` | 10.3.1 | Baseline candidato | lockfile |
| Integración NestJS logs | `nestjs-pino` | 4.6.1 | Baseline candidato | lockfile |
| Salud | `@nestjs/terminus` | 11.1.1 | Baseline candidato | lockfile |
| Métricas privadas | Prometheus | 3.12.0 | Baseline candidato | imagen por digest |
| Dashboards privados | Grafana | 13.1.0 | Baseline candidato | imagen por digest |
| Logs privados | Loki | 3.7.2 | Baseline candidato | imagen por digest |
| Trazas privadas | Tempo | 2.10.5 | Baseline candidato | imagen por digest |
| Métricas/logs SaaS | Amazon CloudWatch | Servicio administrado | Gestionado | IaC/retención |
| Trazas SaaS | AWS X-Ray | Servicio administrado | Gestionado | ADOT/IaC |

No se selecciona Tempo 3.0 mientras sea prerelease. Las versiones privadas se validarán juntas porque compatibilidad de datasource, formato, almacenamiento y upgrade importa más que adoptar individualmente cada `latest`.

## 12. Componentes aprobados sin versión de software

| Elemento | Decisión |
|---|---|
| Arquitectura | Macroservicios por dominio |
| Patrones | Puertos/adaptadores, outbox, inbox, idempotencia |
| Multitenancy | `tenant_id`, RLS, contexto transaccional sujeto a POC |
| Objetos | Claves opacas/inmutables, cuarentena, WORM selectivo |
| Mensajería | At-least-once, contratos versionados, DLQ/replay gobernado |
| Trazabilidad | W3C Trace Context + correlation/causation IDs |
| Logs | JSON estructurado y sanitizado |
| Salud | Liveness, readiness y startup separados |

## 13. Decisiones de versión aún pendientes

1. **Resuelto:** pnpm 11.9.0 y workspace compartido; ver GDP-GPR-016. El lockfile fue generado para 13 proyectos.
2. Herramienta concreta para validar configuración/variables de entorno.
3. Producto KMS/secretos para instalaciones privadas.
4. Release y licencia exactas de MinIO, fijadas por digest después de POC.
5. Imagen exacta de OWASP ZAP y política de actualización.
6. Distribución/versión ADOT del despliegue AWS.
7. Registry/linter/diff concreto para OpenAPI y AsyncAPI.
8. Imagen base Linux y estrategia de actualización de contenedores.
9. Herramienta de error tracking frontend; Sentry no está aprobado.

Estos pendientes no reabren el stack ya aprobado, pero bloquean una línea base productiva completamente reproducible.

## 14. Política de fijación

- Aplicaciones: versiones exactas en lockfile; no rangos flotantes en CI/release.
- Runtime: Node major/minor controlado y artefacto oficial verificable.
- Contenedores productivos: tag legible más digest SHA-256 inmutable.
- PostgreSQL/RabbitMQ/Keycloak: major/minor según política del producto y patch de seguridad probado.
- AWS administrado: IaC fija región, configuración, políticas y contratos, no una versión ficticia.
- Generados: registrar versión de generador junto al artefacto generado.
- Toda release produce SBOM, hashes y lista de imágenes/dependencias.
- `latest`, `next`, nightly, RC, beta y tags mutables quedan prohibidos en producción.

## 15. Política de actualización

| Cambio | Tratamiento mínimo |
|---|---|
| Patch npm compatible | Renovación automatizada, CI completa y revisión |
| Minor npm | CI completa, changelog y pruebas del área afectada |
| Major npm/runtime | Análisis de impacto, POC/migración y actualización del catálogo/ADR si cambia la decisión |
| Patch PostgreSQL/Keycloak/RabbitMQ | Seguridad prioritaria, backup y prueba de upgrade/rollback operativo |
| Major de datos/broker/identidad | Proyecto de migración con compatibilidad y recuperación |
| Imagen operativa | Escaneo, SBOM, digest, pruebas de configuración y smoke |

Las vulnerabilidades críticas pueden acelerar una actualización, pero no eliminan las pruebas proporcionadas al riesgo.

## 16. Gate para convertir el baseline candidato en línea base

1. ~~Crear workspace con gestor aprobado y lockfile.~~ Cumplido con pnpm 11.9.0; validación frozen/peers pendiente.
2. Instalar exactamente las versiones candidatas sin overrides inseguros.
3. Compilar backend y frontend en TypeScript strict.
4. Ejecutar unitarias, integración, OpenAPI y build productivo.
5. Ejecutar POC-001 y POC-002 con versiones/imágenes registradas.
6. Validar peer dependencies, licencias y vulnerabilidades.
7. Generar SBOM y fijar digests.
8. Registrar excepciones o ajustes con causa.
9. Cambiar estado del catálogo a `Aprobado` mediante decisión del propietario.

## 17. Fuentes de verificación

- Registro npm consultado el 2026-07-16 para paquetes JavaScript/TypeScript.
- [Node.js Releases](https://nodejs.org/en/about/previous-releases).
- [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/).
- [Keycloak Downloads](https://www.keycloak.org/downloads).
- [RabbitMQ Release Information](https://www.rabbitmq.com/release-information).
- [OpenTelemetry Collector Releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases).
- [Prometheus Releases](https://github.com/prometheus/prometheus/releases).
- [Grafana Releases](https://github.com/grafana/grafana/releases).
- [Loki Releases](https://github.com/grafana/loki/releases).
- [Tempo Releases](https://github.com/grafana/tempo/releases).
- [Grafana k6 Release Notes](https://grafana.com/docs/k6/latest/release-notes/).

## 18. Revisión

Al crear el workspace, al completar cada POC, mensualmente durante construcción, antes de cada release y ante vulnerabilidad crítica o fin de soporte.
