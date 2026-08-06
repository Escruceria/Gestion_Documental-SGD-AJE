# Contratos y procesamiento asíncrono

| Campo | Valor |
|---|---|
| Código | GDP-BE-010 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_INTEGRACION]` |
| Revisores | `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Fuente contractual

`16_Especificacion_AsyncAPI.yaml` define seis mensajes iniciales con sobre portable. `18_Catalogo_Eventos_Comunicaciones.md` sigue siendo el catálogo amplio. AsyncAPI no fija la topología física: AWS usa EventBridge/SQS; privado usa topic/direct exchanges y quorum queues RabbitMQ.

| Mensaje | Tipo | Productor → consumidor | Idempotency/inbox | Resultado |
|---|---|---|---|---|
| `document.version.registered.v1` | evento | Documental → Procesamiento/Auditoría | messageId; versionId | activa comandos/traza |
| `processing.scan-document.v1` | comando | Documental → Procesamiento | versionId + policyVersion | resultado AV |
| `document.malware.scan.completed.v1` | evento | Procesamiento → Documental/Auditoría | job/version/policy | bloquea o permite continuar |
| `document.hash.computed.v1` | evento | Procesamiento → Documental/Auditoría | version/algorithm | registra integridad |
| `correspondence.registered.v1` | evento | Correspondencia → Documental/Auditoría/Notificaciones | correspondenceId/version | proyección/notificación |
| `notification.send.v1` | comando | Dominio autorizado → Notificaciones | originEvent+template+recipient | entrega/retry/DLQ |

## Garantías

Entrega `at-least-once`; no se promete orden global ni exactly-once. Cambio de negocio y outbox son atómicos. Efecto, inbox y outbox derivada son atómicos; ACK después del commit. Payload máximo portable 256 KiB; binarios, tokens, secretos, contenido completo y URLs prefirmadas están prohibidos. `tenantId` es obligatorio en mensajes tenant-scoped y se valida, no se usa ciegamente.

## Compatibilidad

Tipo + versión seleccionan schema. Campos opcionales nuevos son compatibles; eliminar/cambiar requerido, tipo o semántica crea versión nueva. Consumidor rechaza versión desconocida de forma observable. El productor conserva versión anterior durante ventana aprobada; la ventana está pendiente. Contract tests ejecutan productor y consumidores contra JSON Schema/AsyncAPI.

## Fallos

Errores transitorios usan backoff/jitter y reintentos acotados; contrato inválido o versión desconocida va a DLQ sin ciclo. Toda DLQ tiene dueño, alerta, retención, runbook y replay controlado. El replay conserva messageId. POC-002 debe cubrir broker caído, confirm ambiguo, caída antes/después de ACK, duplicado, fuera de orden, poison message y pérdida de nodo RabbitMQ.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-014/021, GDP-ARQ-018/019 y AsyncAPI GDP-BE-016. Supuesto: adaptadores ofrecen las garantías comunes, no APIs iguales. Decisiones: sobre portable y patrones outbox/inbox. Pendientes: bindings físicos, schema registry, retry/retención/DLQ y ownership operativo nominal.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Contratos asíncronos del flujo vertical. | Codex |
