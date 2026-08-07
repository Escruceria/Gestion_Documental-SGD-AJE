# Sistema de Gestion Documental - SGD-AJE

Sistema de Gestion Documental multitenant orientado a organizaciones, disenado con arquitectura distribuida por dominios, aislamiento de datos, gestion documental, correspondencia, procesamiento de archivos, auditoria y notificaciones.

## Estado actual

El repositorio se encuentra en construccion de su linea base tecnica.

| Elemento | Estado |
|---|---|
| Documentacion funcional y arquitectonica | Disponible y en consolidacion |
| Estructura canonica del monorepo | Creada |
| Archivos raiz del workspace | En construccion |
| Dependencias | No instaladas |
| Lockfile | No generado |
| Aplicaciones y librerias | Sin scaffold funcional |
| POC-001 Multitenancy y RLS | Pendiente |
| POC-002 Pipeline documental | Pendiente |
| SBOM y digests | Pendientes |
| Linea base productiva | No aprobada |

La existencia de carpetas o documentos no constituye evidencia de implementacion, compilacion, pruebas o aprobacion productiva.

## Estructura del monorepo

### Aplicaciones

    apps/
    |-- frontend/
    |-- api-gateway/
    |-- identity-access-service/
    |-- document-core-service/
    |-- correspondence-workflow-service/
    |-- document-processing-worker/
    |-- audit-compliance-service/
    `-- notification-integration-service/

### Librerias compartidas

    libs/
    |-- config/
    |-- database/
    |-- middleware/
    |-- shared-types/
    `-- testing/

### Pruebas de concepto

    pocs/
    |-- poc-001-multitenancy/
    `-- poc-002-document-pipeline/

## Responsabilidades principales

| Componente | Responsabilidad |
|---|---|
| frontend | Interfaz web y autenticacion SPA |
| api-gateway | Entrada controlada y enrutamiento |
| identity-access-service | Organizaciones, usuarios, membresias, roles y permisos |
| document-core-service | Documentos, versiones, expedientes y ciclo de vida |
| correspondence-workflow-service | Radicacion, consecutivos, tareas y aprobaciones |
| document-processing-worker | Antivirus, hash, integridad, OCR y procesamiento |
| audit-compliance-service | Auditoria, privacidad e incidentes |
| notification-integration-service | Notificaciones, entregas e integraciones |

Cada macroservicio sera propietario exclusivo de sus datos, migraciones, credenciales y contratos.

No se permitiran claves foraneas ni consultas directas entre bases de servicios diferentes.

## Stack tecnico candidato

| Componente | Version objetivo |
|---|---:|
| Node.js | 24.18.0 LTS |
| pnpm | 9.15.3 |
| TypeScript | 7.0.2 |
| NestJS | 11.1.28 |
| Express | 5.2.1 |
| PostgreSQL | 18.4 |
| Kysely | 0.29.3 |
| node-pg-migrate | 8.0.4 |
| Keycloak | 26.7.0 |
| RabbitMQ | 4.3.4 |
| React | 19.2.7 |
| Vite | 8.1.5 |
| Vitest | 4.1.10 |

Estas versiones corresponden al baseline candidato definido en GDP-ARQ-022.

No deben considerarse aprobadas para produccion hasta completar instalacion, compilacion, pruebas, POC, lockfile, analisis de dependencias, SBOM y digests.

## Principios tecnicos

- Arquitectura por puertos y adaptadores.
- Separacion entre interfaces, aplicacion, dominio e infraestructura.
- TypeScript en modo estricto.
- PostgreSQL con multitenancy y Row-Level Security.
- Contexto tenant transaccional mediante SET LOCAL.
- Autenticacion OIDC y OAuth 2.0 mediante Keycloak.
- Mensajeria at-least-once.
- Patrones outbox, inbox e idempotencia.
- RabbitMQ con quorum queues para instalaciones privadas.
- EventBridge y SQS para modalidad SaaS.
- Amazon S3 o MinIO para almacenamiento documental.
- Pino y OpenTelemetry para observabilidad.
- OpenAPI 3.1 para contratos REST.
- RFC 9457 para errores HTTP.
- Versiones exactas mediante catalogo centralizado de pnpm.

## Archivos raiz

    .env.example
    .node-version
    .npmrc
    .nvmrc
    package.json
    pnpm-workspace.yaml
    tsconfig.base.json
    README.md

## Workspace pnpm

El workspace incluye:

    apps/*
    libs/*
    pocs/*

Las dependencias compartidas se administran mediante el catalogo centralizado de pnpm-workspace.yaml.

## Comandos raiz previstos

    pnpm build
    pnpm dev
    pnpm start
    pnpm lint
    pnpm test
    pnpm typecheck
    pnpm clean

Los comandos no produciran resultados funcionales hasta que cada proyecto tenga su propio package.json y sus scripts.

## Reglas de dependencias

1. No instalar paquetes sin revisar primero el catalogo tecnico.
2. No usar latest, next, nightly, beta o RC.
3. No introducir otra version de una dependencia central sin decision documentada.
4. No compartir acceso directo a tablas entre macroservicios.
5. No usar datos reales del piloto durante el desarrollo inicial.
6. No registrar secretos, tokens ni contenido documental en logs.
7. No declarar aprobada la linea base hasta superar el gate tecnico.
8. No generar el lockfile antes de definir los manifiestos de los proyectos.

## POC obligatorias

### POC-001 - Multitenancy

Debe demostrar aislamiento entre tenants, PostgreSQL RLS, SET LOCAL, uso seguro del pool, separacion de roles e integracion con Keycloak.

### POC-002 - Pipeline documental

Debe demostrar almacenamiento de objetos, cuarentena, hash, antivirus, outbox, inbox, RabbitMQ, retries, DLQ y trazabilidad distribuida.

## Responsables principales

| Responsabilidad | Responsable |
|---|---|
| Patrocinador | Wilmar Betancur Valencia |
| Product Owner y lider archivistico | Alvaro Patino Cruz |
| Arquitecto de solucion | Antonio Jose Escruceria Uribe |
| Project Manager | David Ernesto Antequera Martinez |
| Asesor juridico | Oscar Andres Hoyos Hurtado |

## Licencia

Proyecto privado. Todos los derechos reservados.

El valor UNLICENSED de package.json indica que el codigo no se distribuye mediante una licencia publica.