# Modelo lógico por macroservicio

| Campo | Valor |
|---|---|
| Código | GDP-DAT-002 |
| Versión | 0.1 |
| Estado | Borrador para validación |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_ARCHIVISTICO]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Convenciones lógicas

- Identificadores opacos UUID/UUIDv7 o equivalente aprobable; tipo exacto se fija antes de migraciones.
- Entidades tenant-scoped: `id`, `tenant_id`, `created_at`, `created_by`, `updated_at`, `version`; bajas lógicas solo cuando el dominio lo permita.
- Instantes en UTC; zona original solo cuando sea dato de negocio.
- Estados se restringen por `CHECK`/tabla de catálogo versionada, no texto libre.
- PII se marca en diccionario; secretos y blobs quedan fuera.
- `external_*_id` es referencia sin FK a otro servicio.

## D01 — iam_db

| Entidad | Clave y relaciones locales | Unicidad tenant | Datos principales |
|---|---|---|---|
| organizations | PK id; 1:1 tenant | `legal_identifier_normalized` cuando exista y aplique | nombre, estado, configuración versionada |
| tenants | PK id; organization_id FK local | organization_id | slug/código, estado, modalidad |
| headquarters | PK; tenant_id FK | tenant_id + code | nombre, estado |
| departments | PK; tenant/headquarters FK; parent_id self FK | tenant_id + code | nombre, jerarquía, estado |
| users | PK; `keycloak_subject_id` | subject global único | perfil mínimo, estado |
| memberships | PK; tenant/user FK | tenant_id + user_id | estado, fechas |
| roles / permissions | PK; tenant nullable para catálogo plataforma | tenant_id + code | nombre, alcance, estado |
| membership_roles | membership_id + role_id | par único | asignador, fecha |

## D02 — documental_db

| Entidad | Clave y relaciones locales | Unicidad tenant | Datos principales |
|---|---|---|---|
| series | PK; tenant | tenant_id + code + version | nombre, vigencia, estado |
| subseries | PK; series_id FK local | tenant_id + series_id + code + version | nombre, vigencia |
| document_types | PK; subseries_id opcional FK local | tenant_id + code + version | esquema metadatos, formatos |
| documents | PK; document_type_id FK | tenant_id + business_key cuando aplique | título, estado, classification, metadata_version |
| document_versions | PK; document_id FK | tenant_id + document_id + version_number | estado, hash, algoritmo, tamaño, media_type |
| document_files | PK; version_id FK | tenant_id + object_key | bucket_ref, object_key, storage_version, quarantine |
| records | PK; series/subseries FK | tenant_id + record_code | asunto, estado, opened/closed_at, index_hash |
| record_documents | record_id + document_id | tenant_id + par; order único por record | orden, incorporated_at/by |
| transfers / dispositions | PK; tenant | business reference versionada | alcance, decisión, autorización, estado |
| outbox / inbox | PK message_id | message_id único | tipo, versión, payload minimizado, estado |

## D03 — correspondencia_db

| Entidad | Clave y relaciones locales | Unicidad tenant | Datos principales |
|---|---|---|---|
| sequences | PK; tenant | tenant_id + direction + period + code | next_value/version |
| correspondences | PK; tenant | tenant_id + direction + number + period | external_document_id, canal, estado, timestamps |
| parties | PK; correspondence_id FK | ámbito local | tipo, nombre/contacto minimizado, clasificación PII |
| distributions | PK; correspondence_id FK | clave idempotente | external_department_id/assignee, estado |
| workflows / workflow_steps | PK/FK locales | tenant_id + definition/version | definición y vigencia |
| tasks / approvals | PK; workflow/correspondence FK | clave de asignación según regla | external_subject_id, outcome, due_at |
| idempotency_keys / outbox / inbox | claves técnicas | tenant + operation + key | request_hash, response_ref, expiry |

## D04 — procesamiento_db

`processing_jobs` referencia externamente versión y objeto; `scan_results`, `hash_results`, `ocr_results`, `conversion_results` e `integrity_checks` dependen localmente del job. Unicidad: tenant + job_type + target_version_id + policy_version. OCR es derivado y hereda clasificación/retención del documento. Incluye inbox/outbox.

## D05 — auditoria_db

`audit_logs` usa event_id único, actor/tenant/action/resource/result/correlation e integrity_ref; `consent_logs` versiona finalidad/política/decisión; `privacy_requests` conserva tipo, identidad verificada por referencia, estado y decisión; `incidents` conserva clasificación, severidad, estado y evidencia referenciada. Escritura append-oriented; correcciones agregan evento, no modifican historia.

## D06 — notificaciones_db

`notification_templates` se versiona por tenant/canal/código; `notifications` referencia origen y destinatario minimizado; `delivery_attempts` conserva secuencia, proveedor, estado y referencia; `integrations`, `webhook_subscriptions` y `webhook_deliveries` no almacenan secretos, solo `secret_ref`. Incluye inbox/outbox e idempotencia.

## Proyecciones

| Proyección | Consumidor | Origen | Regla |
|---|---|---|---|
| estructura organizacional mínima | Documental/Correspondencia | IAM EVT-003 | id, nombre/código/estado/version; reconstruible |
| clasificación vigente | Correspondencia | Documental EVT-006/007 | solo campos necesarios; consulta autoritativa ante conflicto |
| estado documento | Correspondencia | Documental EVT-008..013 | no incluye contenido |
| estado radicación | Notificaciones/Auditoría | Correspondencia EVT-017..020 | referencia y estado mínimo |

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-DAT-001, propiedad de datos, eventos, RF y ADR-015. Supuesto: PostgreSQL por servicio puede compartir instancia con bases/roles separados. Decisiones: claves/constraints locales, referencias externas sin FK. Pendientes: tipo final ID, catálogos exactos, esquema dinámico de metadatos, particionamiento y retención.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Modelo lógico inicial por seis servicios. | Codex |
