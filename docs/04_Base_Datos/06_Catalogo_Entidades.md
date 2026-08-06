# Catálogo inicial de entidades

| Campo | Valor |
|---|---|
| Código | GDP-DAT-006 |
| Versión | 0.1 |
| Estado | Borrador para validación |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[LIDER_ARCHIVISTICO]`, `[RESPONSABLE_DATOS]`, `[RESPONSABLE_SEGURIDAD]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

| Servicio | Entidad | Fuente de verdad | Tenant | Datos personales/sensibles | Retención | Auditoría/RLS |
|---|---|---|---|---|---|---|
| IAM | organizations, tenants | IAM | global/tenant | representantes/configuración puede contener PII | contrato/política pendiente | cambios auditados; RLS donde tenant |
| IAM | headquarters, departments | IAM | sí | normalmente no; nombres libres pueden incluir PII | política cliente | audit + RLS |
| IAM | users, memberships | IAM/Keycloak solo credencial | global + tenant | PII de identidad; no guardar contraseña | política identidad pendiente | audit + RLS membresía |
| IAM | roles, permissions, membership_roles | IAM | sí/global catálogo | actor asignador es PII | política seguridad | audit + RLS |
| Documental | series, subseries, document_types | Documental | sí | campos libres potenciales | vigencia de instrumento | audit + RLS |
| Documental | documents, document_metadata | Documental | sí | potencial PII/sensible | TRD/base aplicable pendiente | audit + RLS |
| Documental | document_versions, document_files | Documental; blob en objeto | sí | hereda del documento | TRD/base aplicable pendiente | append + RLS |
| Documental | records, record_documents | Documental | sí | potencial PII/sensible | TRD/base aplicable pendiente | audit + RLS |
| Documental | transfers, dispositions | Documental | sí | actor/evidencia | instrumento/acta | audit reforzada + RLS |
| Correspondencia | sequences | Correspondencia | sí | no | política radicación | audit + RLS |
| Correspondencia | correspondences, parties | Correspondencia | sí | remitente/destinatario PII | TRD/base pendiente | audit + RLS |
| Correspondencia | distributions, tasks, approvals | Correspondencia | sí | responsables/decisiones PII | proceso/expediente | audit + RLS |
| Procesamiento | processing_jobs, resultados | Procesamiento | sí | OCR puede ser sensible | operacional/heredada pendiente | audit + RLS |
| Auditoría | audit_logs | Auditoría | sí/plataforma | actor y recurso; sin payload | política legal/seguridad pendiente | append-oriented + RLS |
| Auditoría | consent_logs, privacy_requests | Auditoría | sí | PII y posible sensible | base/finalidad pendiente | audit reforzada + RLS |
| Auditoría | incidents | Auditoría | sí/plataforma | PII/sensible posible | política incidentes | acceso restringido + RLS |
| Notificaciones | templates, notifications, attempts | Notificaciones | sí | destinatario/contenido minimizado | política canal pendiente | audit + RLS |
| Notificaciones | integrations, webhooks | Notificaciones | sí | endpoints/contactos; secretos fuera | contrato | audit + RLS |
| Todos | outbox, inbox, idempotency | Servicio local | sí cuando mensaje lo sea | actor/ref mínima; sin payload sensible | operacional por definir | acceso técnico + RLS |

## Reglas

`Fuente de verdad` otorga escritura exclusiva. Cualquier copia es proyección y registra `source_service`, `source_id`, `source_version`, `projected_at`. Retención concreta, calidad de dato personal y legal hold no se inventan: **Requiere validación jurídica especializada**.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: propiedad de datos, GDP-DAT-001/002 y STRIDE. Supuesto: el contenido libre puede contener categorías superiores a las declaradas. Decisiones: clasificación conservadora y secretos fuera de tablas. Pendientes: inventario campo a campo y tiempos aprobados.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Catálogo por servicio, clasificación y gobierno. | Codex |
