# Registro inicial de decisiones de arquitectura

| Campo | Valor |
|---|---|
| Código | GDP-GPR-008 |
| Versión | 1.1 |
| Estado | Registro controlado; contiene decisiones históricas, propuestas y aceptadas |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Aprobadores | `[COMITE_ARQUITECTURA]` |

## 1. Escala de estados

`Propuesta`, `Aceptada`, `Rechazada`, `Sustituida` o `Deprecada`. Ninguna decisión de este archivo está aceptada hasta que se registre aprobador y fecha. Los ADR detallados futuros mantendrán el mismo ID.

## ADR-001 - Monolito modular como arquitectura inicial

- **Estado:** Rechazada como arquitectura global; sustituida por ADR-011. La modularidad se conserva dentro de cada macroservicio.
- **Contexto:** El MVP abarca múltiples dominios, pero el equipo, volúmenes y operación aún no justifican microservicios.
- **Decisión:** Desplegar inicialmente una aplicación backend modular con límites de dominio, dependencias dirigidas y contratos internos explícitos. Extraer servicios solo ante evidencia de escala, aislamiento, despliegue o equipo.
- **Alternativas:** microservicios desde el inicio; monolito sin modularidad.
- **Consecuencias positivas:** menor complejidad operativa y transaccional; entrega más rápida.
- **Riesgos/costos:** acoplamiento si no se aplican límites; despliegue conjunto.
- **Controles:** módulos sin acceso directo a tablas ajenas salvo contrato; pruebas de arquitectura; eventos internos; propiedad de datos documentada.
- **Revisión:** al superar umbrales de carga/equipo o requerir escalado independiente.

## ADR-002 - NestJS sobre Node.js y TypeScript

- **Estado:** Aceptada mediante ADR-012.
- **Contexto:** Se requiere estructura uniforme, inyección de dependencias, validación, OpenAPI y módulos.
- **Decisión:** Usar Node.js 24 LTS, TypeScript y NestJS sobre `@nestjs/platform-express` para todos los servicios HTTP. Express puro requiere ADR de excepción.
- **Alternativas:** Express modular; Fastify directo; otro ecosistema.
- **Consecuencias:** convenciones y ecosistema empresarial; añade abstracción y curva de aprendizaje.
- **Validación pendiente:** benchmark mínimo, estrategia ORM, manejo de contexto tenant y compatibilidad con colas.

## ADR-003 - PostgreSQL como base transaccional

- **Estado:** Aceptada mediante ADR-012.
- **Decisión:** Usar PostgreSQL para metadatos y relaciones; no almacenar binarios documentales en columnas de la base principal.
- **Razones:** transacciones, integridad, JSONB controlado, FTS, particionamiento y RLS.
- **Alternativas:** base documental como fuente principal; base por dominio desde el inicio.
- **Consecuencias:** exige diseño de índices, migraciones, pooling y restauración; RLS no reemplaza autorización de aplicación.
- **Riesgos relacionados:** RSK-001, RSK-007, RSK-010.

## ADR-004 - Modelo multitenant compartido para MVP

- **Estado:** Propuesta; decisión crítica pendiente de threat modeling.
- **Decisión:** Base y esquema compartidos para el MVP, con `tenant_id` obligatorio en toda entidad tenant-scoped, claves compuestas/únicas que incluyan tenant cuando corresponda, RLS, contexto no falsificable y pruebas antifuga. Ofrecer despliegue/base dedicada como variante posterior para requisitos altos.
- **Alternativas analizadas:** esquemas separados; base independiente por organización.
- **Beneficios:** menor costo y operación centralizada.
- **Riesgos:** fuga lógica, restauración selectiva compleja y noisy neighbor.
- **Controles mínimos:** RLS deny-by-default; transacciones con contexto tenant; rutas de objetos separadas; caché/colas con tenant; límites; observabilidad sin mezclar datos; pruebas automatizadas negativas.
- **Criterio de rechazo:** imposibilidad de demostrar aislamiento o requisito contractual/regulatorio de base dedicada.

## ADR-005 - Almacenamiento de objetos S3 compatible

- **Estado:** Aceptada y concretada mediante ADR-016.
- **Decisión:** Amazon S3 para SaaS y MinIO para despliegues privados mediante adaptadores; metadatos, hash y referencia en PostgreSQL.
- **Controles:** claves opacas e inmutables, cuarentena, multipart, SSE-KMS con clave por ambiente, versionado canónico, WORM selectivo en bucket dedicado, URLs firmadas cortas y disposición autorizada.
- **Consecuencias:** consistencia entre base y objeto debe gestionarse; se requieren reconciliación y eventos idempotentes.

## ADR-006 - Búsqueda con PostgreSQL FTS en MVP

- **Estado:** Propuesta.
- **Decisión:** Emplear PostgreSQL Full Text Search para metadatos y texto permitido inicialmente; evolucionar a OpenSearch/Elasticsearch solo con umbrales medidos.
- **Controles:** autorización/tenant antes de devolver resultados; índice derivable; reindexación; idioma y normalización definidos.
- **Umbrales pendientes:** volumen, latencia p95, complejidad de consulta y frecuencia de indexación.

## ADR-007 - Procesamiento asíncrono desacoplado

- **Estado:** Aceptada y concretada por ADR-014 para SaaS.
- **Decisión:** Ejecutar antivirus, OCR, miniaturas, indexación, correo y reportes pesados mediante comandos idempotentes en SQS. EventBridge distribuye eventos de dominio; SQS mantiene una cola durable por consumidor. BullMQ/Redis no será el bus ni la cola durable principal del SaaS.
- **Controles:** correlation ID, tenant, reintentos limitados, dead-letter, deduplicación, observabilidad y no exponer archivo antes de veredicto antivirus.

## ADR-008 - Autorización combinada RBAC + ABAC

- **Estado:** Propuesta.
- **Decisión:** Roles agrupan permisos; políticas adicionales evalúan tenant, dependencia, expediente, clasificación, estado, horario y delegación. Denegar por defecto.
- **Consecuencias:** aumenta expresividad y complejidad de pruebas; las decisiones deben ser explicables y auditables.
- **Segregaciones iniciales:** auditor sin modificación; soporte sin acceso permanente; disposición con aprobación; administración sin alteración de logs.

## ADR-009 - Identidad global con membresías por organización

- **Estado:** Aceptada parcialmente y complementada por ADR-013.
- **Decisión candidata:** separar identidad de persona/cuenta de membresía tenant, permitiendo pertenecer a varias organizaciones sin duplicar credencial. El correo puede ser identificador global, pero documento personal no será obligatorio sin finalidad válida.
- **Alternativa:** cuenta independiente por tenant.
- **Impacto:** resuelve tensión de RF-001, pero exige selector de organización, MFA/políticas por tenant y recuperación segura.
- **Pendiente:** modelo de alta pública/invitación/federación y uso del portal ciudadano.

## ADR-010 - AWS preferente con portabilidad razonable

- **Estado:** Propuesta.
- **Decisión:** Diseñar despliegue de referencia AWS sin acoplar lógica de dominio a servicios propietarios. Usar contratos para objeto, correo, OCR, secretos y colas.
- **Alternativas:** nube distinta; Kubernetes/on-premise desde el inicio.
- **Consecuencias:** la portabilidad total no es objetivo; se priorizan datos, componentes críticos y procedimientos reproducibles.

## ADR-011 - Arquitectura distribuida de macroservicios por dominio

- **Estado:** Aceptada.
- **Decisión:** desplegar seis macroservicios MVP propietarios de sus datos: identidad/acceso, núcleo documental, correspondencia/workflow, procesamiento, auditoría/cumplimiento y notificaciones/integraciones. Comercial/facturación se agrega en Fase 3.
- **Contratos:** REST/OpenAPI para operaciones inmediatas; eventos/AsyncAPI con outbox e idempotencia para propagación.
- **Documento:** `docs/03_Arquitectura/ADR-011_Arquitectura_Distribuida_Macroservicios.md`.
- **Consecuencia:** ADR-001 deja de ser la arquitectura global propuesta.

## ADR-012 - Stack tecnológico base

- **Estado:** Aceptada.
- **Decisión:** TypeScript, Node.js 24 LTS, NestJS, Express mediante `@nestjs/platform-express`, REST/OpenAPI 3.1, React/TypeScript, Vite y PostgreSQL.
- **Documento:** `docs/03_Arquitectura/ADR-012_Stack_Tecnologico_Base.md`.
- **Pendientes fuera de alcance:** autenticación, mensajería, acceso a datos, almacenamiento de objetos y despliegue físico.

## ADR-013 - Autenticación con Keycloak, OIDC y OAuth 2.0

- **Estado:** Aceptada.
- **Decisión:** Keycloak administra autenticación, credenciales, sesiones, MFA y federación. NestJS IAM administra organizaciones, membresías, roles de negocio, delegaciones y contexto tenant.
- **Flujo web:** Authorization Code con PKCE; no se usarán flujos implícito ni Resource Owner Password Credentials.
- **Documento:** `docs/03_Arquitectura/ADR-013_Autenticacion_Keycloak_OIDC_OAuth2.md`.

## ADR-014 - Mensajería SaaS con Amazon EventBridge y SQS

- **Estado:** Aceptada.
- **Decisión:** EventBridge para distribución de eventos; SQS por consumidor y SQS directa para comandos/trabajos; Standard por defecto y FIFO solo con requisito de orden; DLQ, outbox e idempotencia obligatorios.
- **Documento:** `docs/03_Arquitectura/ADR-014_Mensajeria_AWS_EventBridge_SQS.md`.

## ADR-015 - Acceso a PostgreSQL y migraciones

- **Estado:** Aceptada.
- **Decisión:** Kysely + `pg` para consultas y pooling; `node-pg-migrate` para migraciones exclusivas por macroservicio; forward-only y expand-and-contract en producción.
- **Controles:** RLS con `SET LOCAL` transaccional, usuario runtime sin DDL, usuario de migración separado, outbox en la transacción local y prohibición de sincronización automática.
- **Documento:** `docs/03_Arquitectura/ADR-015_Acceso_PostgreSQL_Migraciones.md`.

## ADR-016 - Almacenamiento de objetos con Amazon S3 y MinIO

- **Estado:** Aceptada.
- **Decisión:** Amazon S3 para SaaS y MinIO para instalaciones privadas detrás de un puerto propio; carga multipart a cuarentena, contenido canónico inmutable y metadatos en PostgreSQL.
- **Cifrado:** SSE-KMS con una clave por ambiente como base; claves dedicadas por cliente como capacidad opcional.
- **Retención:** versionado canónico y WORM selectivo, no universal, en un bucket dedicado.
- **Documento:** `docs/03_Arquitectura/ADR-016_Almacenamiento_Objetos_S3_MinIO.md`.

## ADR-017 - Validación del backend, contratos y errores HTTP

- **Estado:** Aceptada.
- **Decisión:** DTO HTTP con `class-validator`, transformación con `class-transformer` e integración mediante `ValidationPipe`; documentación con `@nestjs/swagger`.
- **Capas:** reglas de negocio en Value Objects/servicios de dominio, configuración validada al arrancar y constraints/tipos PostgreSQL como defensa persistente.
- **Errores:** `application/problem+json` basado en RFC 9457, con códigos estables y sin detalles sensibles.
- **Documento:** `docs/03_Arquitectura/ADR-017_Validacion_Backend_Contratos_Errores.md`.

## ADR-018 - Librerías y arquitectura base del frontend

- **Estado:** Aceptada.
- **Decisión:** React Router Data Mode, TanStack Query, React Hook Form, Zod 4, Material UI/Emotion, OpenAPI TypeScript/fetch, Zustand restringido, i18next, date-fns y keycloak-js.
- **Pruebas:** Vitest, React Testing Library, MSW, Playwright y axe-core/jest-axe.
- **Límites:** TanStack Query posee estado remoto; Zustand solo estado cliente transversal y nunca tokens; tipos REST se generan desde OpenAPI 3.1.
- **Documento:** `docs/03_Arquitectura/ADR-018_Librerias_Arquitectura_Frontend.md`.

## ADR-019 - Estrategia de pruebas automatizadas

- **Estado:** Aceptada.
- **Decisión:** Vitest como runner común, `@nestjs/testing`, Supertest, Testcontainers/PostgreSQL real, MSW, contratos OpenAPI/AsyncAPI, k6, Playwright y OWASP ZAP.
- **Principio:** infraestructura real efímera para persistencia e integraciones críticas; dobles limitados a puertos en pruebas unitarias/controladas.
- **Documento:** `docs/03_Arquitectura/ADR-019_Estrategia_Pruebas_Automatizadas.md`.

## ADR-020 - Observabilidad con OpenTelemetry y backends operativos

- **Estado:** Aceptada.
- **Decisión:** OpenTelemetry, OTLP y Collector; Pino/`nestjs-pino`, W3C Trace Context y `@nestjs/terminus`.
- **SaaS:** ADOT con CloudWatch/X-Ray. **Privado:** Prometheus, Grafana, Loki y Tempo.
- **Documento:** `docs/03_Arquitectura/ADR-020_Observabilidad_OpenTelemetry.md`.

## ADR-021 - Mensajería privada con RabbitMQ

- **Estado:** Aceptada.
- **Decisión:** RabbitMQ con AMQP 0-9-1/TLS, `amqplib` y `amqp-connection-manager`; topic exchange para eventos y direct exchange para comandos.
- **Garantías:** quorum queues, publisher confirms, `mandatory`, ACK manual, retry queues, DLQ por cola, outbox/inbox e idempotencia.
- **Operación:** clúster productivo inicial de tres nodos y observabilidad OpenTelemetry, Prometheus y Grafana.
- **Documento:** `docs/03_Arquitectura/ADR-021_Mensajeria_Privada_RabbitMQ.md`.

## 2. Decisiones pendientes prioritarias

1. Detalle operativo del contexto tenant/RLS, sujeto a POC-001.
2. Dimensionamiento, retención y DR definitivos del clúster RabbitMQ privado.
3. Valores definitivos SLO/RPO/RTO y topología de alta disponibilidad.
4. Criterios comerciales/regulatorios para activar claves KMS dedicadas por cliente.
5. Formatos de preservación y periodicidad de controles de fixity.
6. Proveedores de correo, firma y OCR.

## 3. Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Diez ADR iniciales derivados de las decisiones propuestas. | Codex; pendientes de aprobación |
| 0.2 | 2026-07-16 | Se sustituye ADR-001 por ADR-011 y se registra arquitectura distribuida. | Codex; pendiente de aprobación |
| 0.3 | 2026-07-16 | ADR-012 aprobado; ADR-002 y ADR-003 pasan a aceptados. | Codex; decisión del propietario |
| 0.4 | 2026-07-16 | ADR-013 aprobado; autenticación propia descartada en favor de Keycloak/OIDC/OAuth 2.0. | Codex; decisión del propietario |
| 0.5 | 2026-07-16 | ADR-014 aprobado; EventBridge y SQS establecidos para SaaS. | Codex; decisión del propietario |
| 0.6 | 2026-07-16 | ADR-015 aprobado; Kysely, pg y node-pg-migrate establecidos. | Codex; decisión del propietario |
| 0.7 | 2026-07-16 | ADR-016 aprobado; S3/MinIO, WORM selectivo y clave KMS por ambiente establecidos. | Codex; decisión del propietario |
| 0.8 | 2026-07-16 | ADR-017 aprobado; validación backend por capas y Problem Details establecidos. | Codex; decisión del propietario |
| 0.9 | 2026-07-16 | ADR-018 aprobado; librerías y responsabilidades base del frontend establecidas. | Codex; decisión del propietario |
| 1.0 | 2026-07-16 | ADR-019 y ADR-020 aprobados; pruebas automatizadas y observabilidad establecidas. | Codex; decisión del propietario |
| 1.1 | 2026-07-16 | ADR-021 aprobado; RabbitMQ establecido como adaptador de mensajería privada. | Codex; decisión del propietario |
