# Reglas de negocio

| Campo | Valor |
|---|---|
| Código | GDP-REQ-004 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Analista Requisitos, Líder Archivístico) |
| Revisores | Álvaro Patiño Cruz (Líder Archivístico), Antonio José Escrucería Uribe (Seguridad), Álvaro Patiño Cruz (Datos) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

| ID | Regla verificable | Aplica a |
|---|---|---|
| RN-IAM-001 | Toda operación tenant-scoped usa una membresía activa del sujeto en el tenant seleccionado. | RF-IAM-003..008 |
| RN-IAM-002 | Una sede/dependencia pertenece a una sola organización; su identificador es único dentro del tenant. | RF-IAM-001..002 |
| RN-IAM-003 | Invitaciones expiran, son de un solo uso y no otorgan permisos antes de aceptación válida. | RF-IAM-003 |
| RN-IAM-004 | Roles privilegiados requieren MFA y toda asignación/revocación queda auditada. | RF-IAM-006..007 |
| RN-DOC-001 | Serie, subserie y tipo documental tienen código único por tenant y versión efectiva. | RF-DOC-001..003 |
| RN-DOC-002 | Un documento lógico no está disponible hasta aprobar antivirus e integridad de su archivo. | RF-DOC-004..010 |
| RN-DOC-003 | Una confirmación de carga solo acepta objeto, tamaño y metadatos de la sesión emitida y no puede duplicar versión. | RF-DOC-005..006 |
| RN-DOC-004 | Cada versión es inmutable, conserva orden monotónico, hash, autor, fecha y referencia de objeto. | RF-DOC-007..009 |
| RN-DOC-005 | Un objeto malicioso permanece aislado, no genera URL de lectura y produce evidencia auditable. | RF-DOC-010 |
| RN-DOC-006 | Un documento solo se incorpora una vez al mismo expediente y conserva orden verificable. | RF-DOC-011..013 |
| RN-DOC-007 | Cerrar expediente exige índice consistente; el cierre no borra ni sobrescribe documentos. | RF-DOC-014 |
| RN-COR-001 | El consecutivo es único por tenant, tipo, vigencia y configuración; no se reutiliza. | RF-COR-001..003 |
| RN-COR-002 | Repetir una radicación con igual clave idempotente devuelve el mismo resultado. | RF-COR-001..002 |
| RN-COR-003 | El comprobante refleja número, fecha/hora, canal y referencia verificable sin exponer datos innecesarios. | RF-COR-004 |
| RN-COR-004 | Distribución y cambios de estado conservan actor, origen, destino, fecha y resultado. | RF-COR-005..006 |
| RN-AUD-001 | Eventos críticos se registran con actor, tenant, acción, recurso, tiempo, resultado y correlación. | RF-AUD-001..002 |
| RN-AUD-002 | Auditoría no contiene secretos, tokens ni contenido completo y no puede modificarse por actores operativos. | RF-AUD-001..002 |
| RN-PRI-001 | Consentimiento se registra solo cuando aplique, por finalidad y versión, sin casillas premarcadas. | RF-AUD-003 |
| RN-PRI-002 | Una solicitud de titular no autoriza eliminación contraria a retención o bloqueo; se registra la decisión. | RF-AUD-004..005 |
| RN-NIN-001 | Cada entrega usa idempotencia; reintentos son limitados y el agotamiento termina en DLQ/estado final. | RF-NIN-001..002 |
| RN-OPS-001 | Backup no se considera recuperable hasta que un restore aislado sea verificado y evidenciado. | RF-OPS-002..003 |
| RN-OPS-002 | Exportar un tenant exige autorización, alcance explícito, cifrado y manifiesto; nunca incluye otro tenant. | RF-OPS-004 |

## Reglas del flujo vertical

Las siguientes reglas garantizan aislamiento y seguridad del flujo vertical 12-paso:
- RN-IAM-001: Toda operación es tenant-scoped.
- RN-IAM-003: Invitaciones expiables.
- RN-DOC-002: Documentos solo disponibles post-antivirus.
- RN-DOC-004: Versiones inmutables.
- RN-COR-001: Consecutivos únicos.
- RN-AUD-001: Auditoría correlacionada.

## Fuentes, supuestos, decisiones y pendientes

**Fuentes:** Objetivos OBJ-001..012, restricciones RES-*, ADR-011..021, catálogo de eventos.

**Supuestos:** Las reglas configurables se versionan por tenant; cambios requieren aprobación Gestor Documental.

**Decisiones:** Integridad, idempotencia, aislamiento y no-repudio son invariantes no negociables.

**Pendientes archivísticos y jurídicos:** 
- Consecutivos por serie/año/tipo (específico de cada organización).
- Conservación y disposición (instrumento y autorización mandatorio).
- Consentimiento explícito para capturas biométricas o datos sensibles.
- Derechos de titulares (LSRPD + caso específico por país).

**Validación:** Toda regla dudosa **requiere validación jurídica especializada**.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | 22 reglas iniciales. | Codex |
| 1.0 | 2026-08-05 | Responsables reales, reglas del flujo vertical explicitadas, validaciones jurídicas pendientes marcadas. Aprobado. | Antonio José Escrucería Uribe |
