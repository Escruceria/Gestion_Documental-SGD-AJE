# Reglas de integridad de datos

| Campo | Valor |
|---|---|
| Código | GDP-DAT-007 |
| Versión | 0.1 |
| Estado | Borrador para validación |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_ARCHIVISTICO]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

| ID | Invariante | Aplicación | Evidencia |
|---|---|---|---|
| INT-001 | PK opaca, no nula e inmutable | PK/trigger excepcional + dominio | tests creación/actualización |
| INT-002 | Toda fila tenant-scoped tiene tenant válido y no modificable | NOT NULL, RLS, servicio | pruebas RLS/transferencia denegada |
| INT-003 | Unicidades de negocio incluyen tenant y ámbito/version cuando aplique | UNIQUE compuesto local | carrera concurrente |
| INT-004 | FK solo enlaza tablas de la misma base/servicio y mismo tenant | FK compuesta cuando ayude | inspección catálogo DB |
| INT-005 | Referencia externa no tiene FK ni se “valida” leyendo DB ajena | contrato/API/evento/proyección | prueba credenciales cruzadas |
| INT-006 | Estados solo transitan por rutas permitidas | dominio + optimistic version + CHECK | property/state tests |
| INT-007 | Versiones documentales son monotónicas e inmutables | UNIQUE(document,number), dominio, permisos | concurrencia y update denegado |
| INT-008 | Disponible implica scan CLEAN y hash válido según política | dominio transaccional/proyección de resultados | casos cuarentena/malware |
| INT-009 | object_key es opaca, única y corresponde a tenant/document/version | UNIQUE + validación adaptador | POC multipart/tenant |
| INT-010 | Incorporación documento-expediente no se duplica y orden es único | UNIQUE(record,document), UNIQUE(record,order) | carrera de incorporación |
| INT-011 | Cierre exige índice completo/hash y bloquea mutación no autorizada | aggregate invariant | casos cierre |
| INT-012 | Consecutivo es único y se asigna atómicamente por tenant/tipo/vigencia | UNIQUE + lock/update atómico | prueba alta concurrencia |
| INT-013 | Idempotency key/payload idéntico produce un efecto; payload distinto, conflicto | UNIQUE tenant/operation/key + request_hash | reenvío/race |
| INT-014 | Negocio y outbox se confirman o revierten juntos | transacción local | broker caído |
| INT-015 | Efecto de consumo, inbox y outbox resultante son atómicos | transacción local + UNIQUE message_id | caída antes de ACK |
| INT-016 | Evento/proyección no retrocede versión conocida | source_version/aggregate_version | entrega fuera de orden |
| INT-017 | Auditoría es append-oriented; corrección agrega evento | privilegios/REVOKE + dominio | update/delete denegado |
| INT-018 | Legal hold o disposición no autorizada impide eliminación | dominio + constraints/permiso | casos retención |
| INT-019 | Borrado lógico no elude unicidad, retención ni auditoría | índices parciales solo con regla explícita | recreación y restore |
| INT-020 | Todo cambio concurrente crítico detecta versión obsoleta | `version`/ETag y update condicional | conflicto 409/412 |

## Consistencia entre almacenamiento de objetos y base

No existe transacción distribuida DB–objeto. La sesión reserva una key; confirmación verifica objeto, tamaño, partes y checksum; la base registra `QUARANTINED`; procesamiento produce resultados idempotentes; disponibilidad se decide en Documental. Un reconciliador detecta sesiones expiradas, objetos huérfanos, referencias sin objeto y versiones detenidas. Nunca elimina objeto sujeto a retención/hold sin decisión autorizada.

## Integridad criptográfica

Algoritmo, codificación, valor, herramienta/versión y fecha se conservan. Una comprobación fallida no sobrescribe el hash esperado; genera resultado e incidente según política. Selección de algoritmo y valor probatorio: **Requiere validación de seguridad y jurídica especializada**.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RF/RN, ADR-015/016, GDP-ARQ-019 y modelos de datos. Supuesto: PostgreSQL soporta constraints/RLS requeridos. Decisiones: DB refuerza, dominio explica; ninguna sola capa basta. Pendientes: DDL, algoritmo hash, política de borrado y reglas exactas de consecutivos.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | 20 invariantes y reconciliación DB–objeto. | Codex |
