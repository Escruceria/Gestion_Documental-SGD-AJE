# Criterios de aceptación del MVP

| Campo | Valor |
|---|---|
| Código | GDP-REQ-008 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Revisores | Álvaro Patiño Cruz (Analista Requisitos), David Ernesto Antequera Martínez (QA), Antonio José Escrucería Uribe (Seguridad) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Escenarios transversales obligatorios

Para cada `CA-<DOM>-NNN` del catálogo RF se ejecutan, cuando apliquen, los siguientes escenarios además del resultado específico de su fila:

1. **Éxito:** Dado un actor autorizado y datos válidos, cuando ejecuta el RF, entonces obtiene la postcondición indicada y evidencia correlacionada.
2. **Validación:** Dado un campo ausente, inválido o no permitido, cuando envía la solicitud, entonces recibe RFC 9457 con código estable y no cambia estado.
3. **Autorización:** Dado un actor sin permiso, cuando intenta la acción, entonces se deniega sin revelar datos y queda evidencia apropiada.
4. **Tenant:** Dado un recurso de otro tenant, cuando se consulta o referencia, entonces no se devuelve ni modifica información y RLS/servicio lo impiden.
5. **Duplicidad/concurrencia:** Dada una repetición o carrera, cuando se procesa, entonces la unicidad se preserva y la idempotencia devuelve el mismo efecto.
6. **Fallo técnico:** Dada una dependencia no disponible, cuando falla la operación, entonces no queda estado parcial y el problema es observable/reintentable según contrato.
7. **Auditoría:** Dada una acción crítica, cuando finaliza, entonces actor, tenant, acción, recurso, tiempo, resultado y correlación quedan registrados sin secretos.

## Criterios de aceptación del flujo vertical

Para los 12 RF del flujo vertical, estos escenarios son obligatorios:

| RF | Escenario crítico | CA obligatoria |
|---|---|---|
| RF-IAM-001 | Dos organizaciones no pueden compartir identificador | CA-IAM-001 |
| RF-IAM-003 | Invitación expira y es de un solo uso | CA-IAM-003 |
| RF-IAM-004 | Identidad Keycloak vinculada sin guardar contraseña | CA-IAM-004 |
| RF-IAM-008 | Cambio de tenant limpia caché y contexto anterior | CA-IAM-008 |
| RF-DOC-001 | Serie única por tenant | CA-DOC-001 |
| RF-DOC-004 | Documento creado en estado DRAFT, no disponible sin archivo | CA-DOC-004 |
| RF-DOC-005 | Carga solicita sesión corta, no reutilizable | CA-DOC-005 |
| RF-DOC-006 | Confirmación multipart es idempotente | CA-DOC-006 |
| RF-DOC-007 | Archivo en cuarentena, no accesible hasta aprobación | CA-DOC-007 |
| RF-DOC-009 | Versión monotónica, inmutable | CA-DOC-009 |
| RF-COR-001 | Radicación consecutiva única | CA-COR-001 |
| RF-AUD-001 | Evento auditable con correlación | CA-AUD-001 |

## Escenarios específicos de mayor riesgo

| CA | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-IAM-008 | Usuario con dos membresías y caché del tenant A | Cambia válidamente al tenant B | Se renueva contexto, se limpia caché A y ninguna respuesta A aparece en B. |
| CA-DOC-006 | Carga multipart completa en cuarentena | Se confirma dos veces con igual clave | Se crea una sola versión/trabajo y ambas respuestas refieren el mismo recurso. |
| CA-DOC-010 | Motor reporta malware | Se procesa el resultado | El archivo queda rechazado, sin URL de lectura, con evento y alerta auditables. |
| CA-DOC-014 | Expediente con índice inconsistente o tarea pendiente | Se intenta cerrar | Se rechaza con problemas identificables y el expediente permanece abierto. |
| CA-COR-003 | Dos solicitudes concurrentes en igual tenant/tipo/vigencia | Asignan consecutivo | Obtienen números distintos, monotónicos y no reutilizables. |
| CA-AUD-001 | Un evento ya consumido | El broker lo entrega nuevamente | Inbox lo reconoce y existe un único efecto auditable. |
| CA-AUD-005 | Solicitud de eliminación afectada por retención | Se decide el caso | No se elimina; se registra fundamento, restricción y comunicación autorizada. |
| CA-NIN-002 | Proveedor falla de forma recuperable hasta el máximo | Ejecuta reintentos | Usa espera/jitter, no duplica entrega y termina en DLQ/estado final observable. |
| CA-OPS-003 | Backup seleccionado y entorno aislado | Se ejecuta restore | Integridad y consistencia se verifican y RPO/RTO medidos quedan en evidencia. |
| CA-OPS-004 | Exportación solicitada para tenant A | Se genera y descarga | Manifiesto solo contiene A, paquete cifrado expira y cada acceso queda auditado. |

## Fuentes, supuestos, decisiones y pendientes

**Fuentes:** RF, RN, ADR-017/019, catálogo de eventos.

**Supuestos:** Las suites automatizadas (Vitest, Supertest, Testcontainers, Playwright) materializarán cada CA. Cada CA debe tener caso de prueba (CP-*).

**Decisiones:** Ningún “happy path” basta por sí solo; toda CA debe incluir éxito, validación, autorización y tenant. Flujo vertical tiene 12 CA obligatorias.

**Pendientes:**
- Textos UX exactos (mensajes de error, confirmaciones) — (QA + PO) 2026-09-15.
- Matriz legal (obligaciones por jurisdicción) — (Jurídico) antes Fase 4.
- Aceptación del cliente piloto Venus (UAT) — (PO + Venus) 2028-10-31.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Criterios transversales y escenarios críticos. | Codex |
| 1.0 | 2026-08-05 | Responsables reales, CA del flujo vertical 12-paso explicitadas, pendientes con fechas. Aprobado. | Antonio José Escrucería Uribe |
