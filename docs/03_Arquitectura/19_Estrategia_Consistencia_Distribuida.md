# Estrategia de consistencia distribuida

| Campo | Valor |
|---|---|
| Código | GDP-ARQ-019 |
| Versión | 0.1 |
| Estado | Borrador para validación |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[LIDER_QA]`, `[LIDER_OPERACIONES]`, `[RESPONSABLE_SEGURIDAD]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Principios

No hay transacción ACID global ni 2PC. Cada invariante tiene un único servicio propietario y transacción local. REST se reserva para una confirmación inmediata imprescindible; eventos propagan hechos. `at-least-once` implica duplicados y orden parcial. La interfaz muestra estados intermedios y nunca afirma consistencia que no existe.

## Patrones vinculantes

1. Cambio de agregado + outbox en una transacción PostgreSQL.
2. Publicador reintentable marca envío solo tras aceptación/confirmación; ambigüedad puede duplicar.
3. Consumidor valida contrato/tenant, consulta inbox por `message_id`, confirma efecto + inbox + outbox local, luego ACK.
4. Clave idempotente se vincula a actor, tenant, operación y hash de solicitud; reutilizarla con payload distinto produce conflicto.
5. Proyecciones incluyen versión/origen/fecha y descartan eventos obsoletos.
6. Sagas usan estado persistido, timeout, compensación semántica y reconciliación; nunca rollback ficticio entre servicios.
7. Jobs/reconciliadores comparan verdad propietaria, outbox, objetos y proyecciones; toda reparación deja evidencia.

## Matriz de consistencia por flujo

| Flujo/invariante | Propietario y consistencia local | Coordinación | Estado visible / compensación |
|---|---|---|---|
| Crear organización/membresía | IAM, fuerte | EVT-001..005 propagan | `PENDING/ACTIVE/SUSPENDED`; revocar acceso si configuración falla |
| Cambiar tenant | IAM valida membresía; servicios revalidan | Contexto por solicitud, no evento como autorización | Limpieza inmediata de caché; denegar ante duda |
| Clasificación documental | Documental, fuerte por versión/vigencia | EVT-006/007 alimentan proyecciones | Proyección puede estar `STALE`; creación crítica consulta versión válida |
| Crear documento | Documental, fuerte | EVT-008 | Documento `DRAFT`; fallo de consumidores no revierte creación |
| Carga multipart | Sesión/versión en Documental; blob en objeto | Saga: reservar → cargar → confirmar → procesar | `UPLOAD_PENDING/QUARANTINED/AVAILABLE/REJECTED`; abortar/expirar y recolectar huérfano |
| Scan/hash/versión | Procesamiento posee resultado; Documental decide disponibilidad | CMD-001/002 + EVT-021/022, inbox/versiones | Fuera de orden se acumula hasta cumplir política; malware domina y bloquea |
| Incorporar documento | Documental, fuerte y unique por expediente/documento | EVT-012 informa a otros | Duplicado devuelve mismo vínculo; no hay escritura cruzada |
| Cerrar expediente | Documental, fuerte sobre índice local | Eventos posteriores notifican | Si dependencia externa falla, expediente sigue cerrado y se reintenta propagación |
| Asignar consecutivo | Correspondencia, fuerte y serializado por tenant/tipo/vigencia | Parte de transacción de radicación | Número no se reutiliza; fallo posterior queda anulado/registrado según regla por validar |
| Radicar con documento | Correspondencia orquesta; Documental posee documento | REST idempotente máximo dos saltos + outbox | `PENDING_DOCUMENT/REGISTERED/FAILED`; compensar vínculo lógico, no borrar evidencia |
| Distribuir/notificar | Correspondencia fuerte; notificación eventual | EVT-018 → CMD-006 → EVT-029 | Entrega `PENDING/SENT/FAILED`; fallo de correo no desradica |
| Auditoría | Servicio origen confirma outbox; Auditoría persiste copia | Eventos `at-least-once`, inbox | Reconciliar eventos faltantes; fuente conserva operación de negocio |
| Solicitud titular | Auditoría/Privacidad, fuerte | Tareas/notificaciones eventuales | Estado explícito; ninguna compensación elimina datos bajo retención |
| Backup/restore | Operación/almacenamientos | Manifiesto coordina snapshots | Backup `CREATED` no es `RESTORE_VERIFIED`; evidencia separada |
| Exportar tenant | Servicio coordinador con lecturas autorizadas | Saga asíncrona y manifiesto | `REQUESTED/RUNNING/READY/EXPIRED/FAILED`; borrar paquete temporal al expirar |

## Orden, concurrencia y versiones

- No hay orden global. Agregados usan `aggregate_version`; el consumidor aplica siguiente versión, ignora duplicado y reconcilia brecha.
- Consecutivos usan restricción única y bloqueo/operación atómica local; nunca coordinador distribuido.
- Actualizaciones HTTP emplean versión/ETag cuando perder actualización sea riesgo; conflicto devuelve 409/412.
- Los comandos tienen propietario único. Eventos se nombran en pasado y pueden tener múltiples consumidores.
- El replay conserva `message_id`; una corrección genera nuevo mensaje con `causation_id` hacia el original.

## Fallos y observabilidad

Timeout no implica fracaso: el cliente consulta estado o repite con igual idempotency key. Reintentos solo para operaciones seguras/idempotentes, con backoff/jitter y presupuesto. Se miden edad outbox, publicación, redelivery, lag, inbox duplicate, retry, DLQ, proyección atrasada, saga vencida y reconciliaciones. `correlation_id`, `causation_id` y W3C trace unen el flujo sin servir como autorización.

## Pruebas de aceptación

1. Commit local sobrevive broker caído y el outbox publica al recuperarse.
2. Caída después de commit y antes de ACK no duplica efecto.
3. Eventos fuera de orden no retroceden agregado/proyección.
4. Misma clave/payload retorna mismo resultado; misma clave/payload distinto da conflicto.
5. Objeto huérfano, outbox atrasado y saga vencida son detectados/reconciliados.
6. Fallo de notificación no revierte radicación.
7. Pérdida de nodo RabbitMQ conserva mensajes confirmados con quorum.
8. Ninguna compensación borra auditoría ni incumple retención.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-011, 014, 015, 016, 021; eventos y RF. Supuesto: contratos conservan IDs/versiones portables entre AWS y RabbitMQ. Decisiones: consistencia fuerte solo dentro del propietario; eventual entre servicios. Pendientes: ventanas de idempotencia/retención, timeouts, estados exactos de saga y regla archivística de números anulados.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Consistencia por flujo, fallos y reconciliación. | Codex |
