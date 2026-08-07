# Casos de prueba de integraciones y contratos

| Campo | Valor |
|---|---|
| Código | GDP-TST-008 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[ARQUITECTO_INTEGRACION]`, `[LIDER_OPERACIONES]`, `[RESPONSABLE_SEGURIDAD]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

| ID | Integración/escenario | Esperado |
|---|---|---|
| CP-INT-001 | correo éxito, timeout, 4xx/5xx y respuesta inesperada | estado/telemetría correctos; ningún secreto/payload en log |
| CP-INT-002 | retries, duplicado, agotamiento y DLQ | efecto único, backoff acotado, replay gobernado |
| INT-003 | OpenAPI: requests/responses y RFC 9457 | productor/consumidor cumplen 3.1; cambio incompatible bloqueado |
| INT-004 | AsyncAPI: versión conocida/desconocida, extra opcional | compatible aceptado; desconocido DLQ observable |
| INT-005 | S3 y MinIO: multipart/checksum/TTL/versionado/WORM selectivo | suite portable equivalente; sin URL en eventos |
| INT-006 | EventBridge/SQS y RabbitMQ: fanout/comando/confirm/ACK | garantía at-least-once e inbox/outbox equivalente |
| INT-007 | Keycloak: JWKS rotado, audience, expiración, MFA | auth fail closed y recuperación prevista |
| INT-008 | OTel Collector no disponible | negocio continúa según política; buffer/drop observable sin datos |

Mocks/MSW sirven para desarrollo; aceptación de proveedor/broker usa integración real o POC autorizada. No se equiparan emuladores a evidencia productiva.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: OpenAPI, AsyncAPI, ADR-013/014/016/020/021 y POC-002. Supuesto: credenciales de prueba estarán aisladas. Decisiones: contract tests más POC real. Pendientes: proveedores concretos, bindings y cuotas.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Integraciones, contratos y fallos. | Codex |
