# Catálogo inicial de endpoints

| Campo | Valor |
|---|---|
| Código | GDP-BE-005 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[ANALISTA_REQUISITOS]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

OpenAPI GDP-BE-004 es la fuente técnica. Este catálogo explica propiedad, trazabilidad y garantías sin duplicar schemas.

| API | Método y ruta | Servicio propietario | RF | Permiso/contexto | Idempotencia | Resultado/evento |
|---|---|---|---|---|---|---|
| API-CTX-001 | GET `/v1/me/contexts` | identity-access-service | RF-IAM-008 | identidad; solo membresías propias | no aplica | 200 contextos activos |
| API-DOC-001 | POST `/v1/documents` | document-core-service | RF-DOC-004 | `document:create`; tenant/estructura/tipo | obligatoria | 201 DRAFT; EVT-008 |
| API-DOC-002 | POST `/v1/documents/{documentId}/uploads` | document-core-service | RF-DOC-005 | `document:version`; recurso autorizado | obligatoria | 201 sesión multipart cuarentena |
| API-DOC-003 | POST `/v1/documents/{documentId}/uploads/{uploadId}/confirm` | document-core-service | RF-DOC-006 | misma sesión/sujeto/tenant | obligatoria | 202 QUARANTINED; EVT-009/CMD-001/002 |
| API-DOC-004 | GET `/v1/documents/{documentId}/processing-status` | document-core-service | RF-DOC-007..010/016 | `document:read`; recurso autorizado | no aplica | 200 estado actual autorizado |
| API-COR-001 | POST `/v1/correspondences/incoming` | correspondence-workflow-service | RF-COR-001/003/004 | `correspondence:register`; documento visible | obligatoria | 201 REGISTERED; EVT-016/017 |
| API-COR-002 | GET `/v1/correspondences/{correspondenceId}` | correspondence-workflow-service | RF-COR-006 | `correspondence:read`; alcance de recurso | no aplica | 200 estado/radicación |

## Dependencias y transacciones

Crear documento/carga opera localmente en Documental. Confirmación registra versión y outbox local; no espera antivirus. Radicación puede invocar Documental idempotentemente para validar/vincular referencia, con máximo dos saltos síncronos; consecutivo, radicación y outbox se confirman localmente en Correspondencia. Fallo de notificación nunca revierte radicación.

## Política de exposición

Gateway enruta, limita y valida autenticación básica, pero no posee lógica de negocio. APIs internas se documentarán en specs separadas o tags/servers inequívocos; no se exponen accidentalmente. Health no incluye detalle sensible. No se publica endpoint genérico CRUD, acceso a outbox/inbox ni descarga por object key.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-BE-004, RF, C4 nivel 3 y eventos. Supuesto: API Gateway preserva Location, Problem Details, tenant/idempotencia. Decisiones: siete operaciones del vertical. Pendientes: endpoints de comprobante, descarga autorizada, polling/backoff y APIs internas.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Catálogo del flujo vertical mínimo. | Codex |
