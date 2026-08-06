# ADR-021 - Mensajería privada con RabbitMQ

| Campo | Valor |
|---|---|
| ID | ADR-021 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-011, ADR-014, ADR-015, ADR-019, ADR-020 |

## Contexto

ADR-014 define EventBridge y SQS para SaaS. Las instalaciones privadas necesitan eventos fan-out, comandos y trabajos durables, aislamiento por consumidor, reintentos, DLQ, observabilidad y alta disponibilidad sin depender de AWS.

La portabilidad se limita a contratos y garantías funcionales. RabbitMQ no reproducirá las APIs o topología física de EventBridge/SQS. Los dominios dependerán de un puerto común y conservarán outbox, inbox e idempotencia.

## Decisión tecnológica

| Responsabilidad | Tecnología o patrón aprobado |
|---|---|
| Broker privado | RabbitMQ |
| Protocolo | AMQP 0-9-1 sobre TLS |
| Cliente Node.js | `amqplib` |
| Conexión/reconexión | `amqp-connection-manager` |
| Eventos | Topic exchange durable |
| Comandos/trabajos | Direct exchange durable |
| Colas productivas | Quorum queues |
| Garantía | At-least-once |
| Publicación segura | Publisher confirms + `mandatory` |
| Consumo seguro | ACK manual |
| Reintentos | Colas de retry escalonadas + TTL + DLX |
| Mensajes agotados | DLQ por cola origen |
| Publicación transaccional | Outbox PostgreSQL |
| Consumo idempotente | Inbox PostgreSQL |
| Alta disponibilidad inicial | Clúster productivo de tres nodos |
| Observabilidad privada | OpenTelemetry + Prometheus + Grafana |

## Puerto de mensajería

```typescript
interface MessageBusPort {
  publishEvent<T>(message: DomainEvent<T>): Promise<PublishResult>;
  sendCommand<T>(message: CommandMessage<T>): Promise<PublishResult>;
  subscribe<T>(
    subscription: MessageSubscription<T>,
    handler: MessageHandler<T>,
  ): Promise<SubscriptionHandle>;
}
```

```text
MessageBusPort
├── AwsMessageBusAdapter
│   ├── EventBridge
│   └── SQS
└── RabbitMqMessageBusAdapter
    ├── Topic exchanges
    ├── Direct exchanges
    └── Quorum queues
```

El dominio no conocerá exchange, routing key, cola, delivery tag, canal AMQP, ARN, URL SQS ni receipt handle. El adaptador traduce esos conceptos a resultados y errores internos estables.

## Topología base

| Exchange | Tipo | Propósito |
|---|---|---|
| `gd.events` | `topic` | Distribución de eventos de dominio |
| `gd.commands` | `direct` | Comandos y trabajos dirigidos |
| `gd.retry` | `direct` | Reintentos escalonados |
| `gd.dead` | `direct` | Mensajes agotados o inválidos |

Exchanges, colas, bindings y políticas se aprovisionarán mediante IaC o procedimiento administrativo versionado. Las aplicaciones podrán verificar la topología, pero no modificar políticas productivas arbitrariamente al iniciar.

### Eventos

Un evento usa una routing key versionada, por ejemplo `document.version.registered.v1`. Cada consumidor lógico posee una quorum queue y bindings propios. Varias réplicas del mismo consumidor comparten su cola; servicios distintos no comparten cola si cada uno debe observar el evento.

### Comandos y trabajos

Un comando usa una routing key dirigida, por ejemplo `processing.scan-document.v1`. Cada comando tiene un único propietario lógico y una cola durable. Sus réplicas compiten por mensajes para escalar horizontalmente.

## Envelope portable

```json
{
  "messageId": "01J...",
  "messageType": "document.version.registered",
  "messageVersion": 1,
  "kind": "event",
  "occurredAt": "2026-07-16T18:00:00.000Z",
  "tenantId": "01J...",
  "correlationId": "01J...",
  "causationId": "01J...",
  "producer": "document-core-service",
  "traceparent": "00-...",
  "contentType": "application/json",
  "payload": {}
}
```

Reglas:

1. `messageId` es globalmente único y clave del inbox.
2. Tipo y versión identifican el JSON Schema/AsyncAPI.
3. `tenantId` es obligatorio para mensajes tenant-scoped.
4. Correlación, causalidad y `traceparent` conservan trazabilidad.
5. No se incluyen binarios, tokens, secretos, contenido documental ni URLs prefirmadas.
6. Los documentos se transportan como identificadores/referencias autorizadas.
7. El máximo portable inicial del mensaje completo será 256 KiB.
8. Campos nuevos opcionales son compatibles; cambios incompatibles crean nueva versión.

## Publicación confiable

1. La transacción local confirma cambio de negocio y fila outbox.
2. El publicador lee el outbox y publica un mensaje persistente.
3. Usa canal confirm y `mandatory` para detectar mensajes no enrutables.
4. Solo marca el outbox publicado después del publisher confirm.
5. `basic.return`, nack, timeout o conexión perdida mantienen el mensaje pendiente.
6. La pérdida del confirm puede causar duplicación; no se promete exactly-once.
7. La recuperación de canales no debe perder la asociación mensaje-confirm.

## Consumo e idempotencia

El consumidor usa ACK manual:

1. Valida tamaño, envelope, tipo y versión.
2. Restaura traza/correlación sin usarlas como autorización.
3. Verifica `messageId` en inbox.
4. Ejecuta efecto, inbox y outbox resultante en una transacción local.
5. Confirma la transacción.
6. Envía ACK en el mismo canal de entrega.

Si cae después del commit y antes del ACK, el mensaje se redelivera y el inbox evita repetir el efecto. Un duplicado ya procesado se reconoce con ACK.

## Reintentos y DLQ

- No se hará requeue inmediato indefinido.
- Errores transitorios pasarán por colas de retry de demoras fijas y acotadas.
- TTL y dead-letter routing devolverán el mensaje a su cola principal.
- Niveles y demoras se configuran por carga; valores tentativos: 5 segundos, 30 segundos y 5 minutos.
- Contrato inválido, mensaje sobredimensionado o versión no soportada irá a DLQ sin ciclo inútil.
- Al agotar intentos, el mensaje irá a la DLQ exclusiva de su cola origen.
- DLX y delivery limit se administrarán mediante políticas RabbitMQ, no `x-arguments` rígidos cuando deban cambiar operacionalmente.
- Toda DLQ tendrá propietario, alerta, retención, runbook y replay controlado.
- El replay conserva `messageId` salvo una remediación que produzca explícitamente un nuevo mensaje causal.

## Ordenamiento y concurrencia

- No se garantiza orden global ni equivalencia con SQS FIFO.
- Consumidores toleran duplicados y fuera de orden mediante versión/estado del agregado.
- Prefetch será finito y configurable.
- Trabajos pesados usarán prefetch bajo; otros se calibrarán con pruebas.
- `single active consumer` solo se habilita si una invariante exige secuencia y acepta menor paralelismo.
- Partición por agregado se evaluará si se requiere paralelismo con orden local.

## Alta disponibilidad y operación

Producción privada iniciará con:

- tres nodos RabbitMQ y quorum queues;
- almacenamiento persistente y discos adecuados;
- nodos distribuidos entre dominios de fallo disponibles;
- límites y alarmas de memoria/disco;
- backup versionado de definiciones, usuarios, permisos y políticas;
- pruebas de pérdida de nodo y restauración;
- procedimiento de rolling upgrade;
- monitoreo de partición, quorum, conexiones, canales y consumidores.

Un nodo se limita a desarrollo, POC o instalación expresamente no productiva. El clúster no reemplaza backup ni DR.

## Seguridad

1. TLS obligatorio en producción; mTLS cuando la PKI/riesgo lo requieran.
2. Virtual host separado por ambiente/instalación.
3. Credencial por macroservicio y mínimo privilegio.
4. Consola/API administrativa sin exposición pública.
5. Secretos externos y rotables.
6. Puertos inter-nodo/administrativos restringidos.
7. Límites de conexiones, canales, tamaño y consumo.
8. Cambios administrativos y replay dejan evidencia.

## Observabilidad

Conforme a ADR-020:

- publicación y consumo crean spans OpenTelemetry;
- W3C Trace Context viaja en headers/envelope;
- logs Pino incluyen IDs operativos y resultado, nunca payload;
- métricas RabbitMQ se exponen a Prometheus y Grafana;
- se observan ready, unacked, edad, publish/deliver/ack, returns, nacks, redeliveries, retries, DLQ, consumidores, consumer capacity, memoria, disco y quorum;
- IDs de mensaje/tenant no se usan como labels Prometheus.

## Pruebas

ADR-019 y POC-002 verificarán confirms, mensajes no enrutables, caídas antes/después de confirm y ACK, inbox/outbox, retries, DLQ, replay, permisos, pérdida de nodo, backpressure, prefetch, trazas y equivalencia contractual con AWS.

## Alternativas no seleccionadas

- NATS JetStream: válido y durable, pero su modelo de streams/consumers se aleja más de la topología definida.
- Apache Kafka: apropiado para streaming/replay masivo, sobredimensionado para comandos y volumen inicial.
- BullMQ/Redis: útil para jobs locales, no será bus durable distribuido.
- ActiveMQ Artemis: válido, con menor alineación prevista con Node.js y experiencia operativa.
- Emuladores AWS productivos: no son una base privada soportada.
- Transporte RMQ de NestJS como contrato de dominio: puede evaluarse internamente, pero no sustituye `MessageBusPort` ni puede filtrar tipos del framework al dominio.

## Consecuencias

### Positivas

- Instalación privada autosuficiente y alineada semánticamente con SaaS.
- Routing flexible para eventos y comandos.
- Alta disponibilidad mediante quorum queues/confirms.
- Mismo envelope, outbox, inbox, contratos y telemetría.

### Costos y riesgos

- Requiere operación, almacenamiento, upgrades, backup y monitoreo.
- Retry/DLX y replay deben gobernarse.
- Diferencias AWS/RabbitMQ exigen suites para ambos adaptadores.
- Quorum añade latencia y costo de replicación.
- At-least-once exige idempotencia real.

## Criterios de aceptación

1. El adaptador cambia por configuración sin modificar dominio.
2. Evento fan-out llega a cada consumidor lógico; réplicas comparten su cola.
3. Comando llega solo a su propietario lógico.
4. Outbox no se confirma antes del publisher confirm.
5. Mensaje no enrutable falla de forma observable.
6. Redelivery posterior al commit no duplica efecto.
7. Retry y DLQ siguen su política.
8. Perder un nodo no pierde mensajes confirmados mientras exista quorum.
9. TLS y permisos impiden acceso ajeno.
10. Prometheus/Grafana y OTel muestran salud y trazas sin payload/PII.

## Revisión

Después de POC-002 privada, antes del primer despliegue privado productivo, ante cambio mayor de RabbitMQ/AMQP o si backlog, fan-out o replay justifican otra tecnología.
