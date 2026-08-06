# Matriz de trazabilidad ADR — documentos

| Campo | Valor |
|---|---|
| Código | GDP-ARQ-021 |
| Versión | 0.1 |
| Estado | Borrador controlado |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[RESPONSABLE_DOCUMENTACION]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Matriz

| ADR | Estado | Decisión | Documentos que la materializan | Verificación pendiente | Coherencia |
|---|---|---|---|---|---|
| ADR-011 | Aceptada | Seis macroservicios por dominio, web/gateway separados | ARQ-003/004/005/016/017/019; ERS/RF | POC-001/002 y despliegue independiente | Coherente |
| ADR-012 | Aceptada | TS, Node 24, NestJS/Express, REST/OpenAPI, React/Vite, PostgreSQL | ARQ-005/022; ADR-017..020 | Workspace, lockfile, compatibilidad | Coherente; G7 pendiente |
| ADR-013 | Aceptada | Keycloak OIDC/OAuth2, Authorization Code + PKCE | ARQ-003/004/005/015; REQ-005 | Realm/clientes, MFA y POC | Coherente |
| ADR-014 | Aceptada | EventBridge/SQS SaaS, outbox/DLQ/idempotencia | ARQ-004/005/018/019/020 | POC AWS, topología física | Coherente |
| ADR-015 | Aceptada | Kysely/pg/node-pg-migrate, DB propia | ARQ-005/017/019; REQ RNF-MTN-001 | POC RLS/pool/migraciones | Coherente |
| ADR-016 | Aceptada | S3/MinIO, cuarentena, WORM selectivo, KMS ambiente | ARQ-004/005/015/019/020 | POC multipart/AV/WORM/licencia MinIO | Coherente |
| ADR-017 | Aceptada | Validación por capas, OpenAPI y RFC 9457 | ARQ-005; ERS/RF/CA; catálogo stack | OpenAPI y Problem Details ejecutables | Coherente; G5 pendiente |
| ADR-018 | Aceptada | Librerías y límites frontend | ERS, REQ-005, ARQ-015, catálogo stack | Arquitectura frontend/E2E | Coherente; documento FE pendiente |
| ADR-019 | Aceptada | Estrategia de pruebas automatizadas | RF/CA/trazabilidad; ARQ-015/019/020 | Artefactos G6 y pipeline | Coherente; G6 pendiente |
| ADR-020 | Aceptada | OTel/OTLP, Pino, salud y backends por modalidad | ARQ-004/005/015/019/020/022 | Collector/config y prueba de correlación | Coherente |
| ADR-021 | Aceptada | RabbitMQ privado, quorum/confirms/ACK/retry/DLQ | ARQ-004/005/015/018/019/020/022 | POC pérdida nodo/replay/seguridad | Coherente |

## Decisiones históricas y propuestas no vinculantes

El registro GDP-GPR-008 contiene ADR-001..010 como antecedentes. ADR-001 está rechazado/sustituido por ADR-011; una mención a monolito modular solo describe modularidad interna, no arquitectura global. ADR-002/003/005/007 fueron concretados por ADR posteriores. ADR-004/006/008/009/010 conservan propuestas complementarias; no pueden contradecir ADR-011..021 ni considerarse aceptadas sin ADR formal.

## Reglas de control

1. Todo documento nuevo cita el ADR que impone una decisión.
2. `Coherente` significa ausencia de contradicción documental, no implementación demostrada.
3. Cambiar tecnología, propiedad de datos o garantía requiere nuevo ADR; mejorar detalle compatible solo actualiza el documento derivado.
4. Una validación POC fallida no se oculta: actualiza esta matriz y propone ADR nuevo/sustitución.
5. El índice y control de cambios se actualizan junto con estados.

## Hallazgos

- El pendiente “adaptador privado” de la vista de contenedores estaba obsoleto porque ADR-021 lo resolvió; debe describirse como implementación/POC pendiente.
- El encabezado de GDP-GPR-008 todavía dice “decisiones propuestas”, aunque contiene ADR aceptados; requiere normalización editorial.
- No hay contradicción grave que justifique reemplazar ADR-011..021.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-011..021, registro de decisiones, catálogo stack y documentos relacionados. Supuesto: estado `Aceptada` de cada ADR fue decisión expresa del propietario. Decisión: ADR individuales son fuente autoritativa ante resumen divergente. Pendientes: ejecutar POC, completar G4–G7 y aprobación del comité.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Matriz inicial ADR-documentos y hallazgos. | Codex |
