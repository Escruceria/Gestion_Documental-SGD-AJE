# Diccionario inicial de datos

| Campo | Valor |
|---|---|
| Código | GDP-DAT-005 |
| Versión | 0.1 |
| Estado | Borrador lógico; tipos físicos por validar |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[RESPONSABLE_DATOS]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_ARCHIVISTICO]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Campos canónicos

| Campo | Tipo lógico | Nulo | Semántica/control | Clasificación |
|---|---|---|---|---|
| id | opaque-id | no | PK generada servidor; no reutilizable | interna |
| tenant_id | opaque-id | no salvo entidad global explícita | límite de aislamiento; derivado de contexto | confidencial |
| created_at / updated_at | instant UTC | no | tiempo servidor; `updated_at` no reemplaza historia | interna |
| created_by / updated_by | subject-ref | según acción técnica | sujeto/servicio externo, no FK IAM | personal privada |
| version | positive integer | no | control optimista/versión de agregado | interna |
| status | controlled-code | no | transición permitida por máquina de estados | interna |
| external_*_id | opaque-id | según caso | referencia contractual sin FK cruzada | hereda recurso |
| correlation_id / causation_id | opaque-id | según origen | diagnóstico, nunca autorización | interna |
| classification | controlled-code | no en contenido | nivel de protección | confidencial |
| retention_policy_ref | opaque/versioned-ref | pendiente en borradores | instrumento/base aplicable | restringida |
| legal_hold | boolean/ref | no; default false | impide eliminación cuando aplica | restringida |

## Campos críticos por dominio

| Entidad.campo | Tipo lógico | Regla | PII/sensible | Fuente |
|---|---|---|---|---|
| users.keycloak_subject_id | string normalizada | única global, inmutable salvo reconciliación aprobada | identificador personal | Keycloak/IAM |
| memberships.(tenant_id,user_id) | par ID | único; estado controlado | personal | IAM |
| departments.code | bounded string | único por tenant; no vacío | potencial en texto libre | IAM |
| series/subseries/document_types.code | bounded string | único por tenant+versión+ámbito | no previsto | Documental |
| documents.title | bounded string | sanitizado, obligatorio según tipo | puede ser personal/sensible | Documental |
| documents.metadata | schema-bound JSON | esquema y versión permitidos; tamaño limitado | potencial personal/sensible | Documental |
| document_versions.version_number | positive integer | único y monotónico por documento | no | Documental |
| document_versions.hash_value | hex/base encoding | algoritmo aprobado, longitud exacta, inmutable | seguridad | Procesamiento→Documental |
| document_files.object_key | opaque string | generado servidor, único tenant, nunca nombre usuario | hereda | Documental |
| document_files.storage_version | string | identifica versión S3/MinIO | hereda | Objeto |
| records.record_code | bounded string | único tenant; regla archivística pendiente | puede ser personal | Documental |
| record_documents.order_no | positive integer | único por expediente | no | Documental |
| sequences.next_value | positive integer | actualización atómica; no decrece | no | Correspondencia |
| correspondences.number | bounded string | único tenant+direction+period | no | Correspondencia |
| parties.contact | structured/encrypted as policy | minimizado y validado por canal | personal | Correspondencia |
| processing_jobs.target_version_id | external ID | único con job_type/policy_version | hereda documento | Procesamiento |
| scan_results.verdict | controlled-code | CLEAN/MALICIOUS/ERROR/UNKNOWN | seguridad | Procesamiento |
| ocr_results.result_ref | object/ref | no texto completo en eventos/logs | potencial sensible | Procesamiento |
| audit_logs.event_id | opaque-id | único global; dedup inbox | interna | Servicios |
| audit_logs.actor_ref | subject-ref | requerido salvo actor system documentado | personal | Servicio origen |
| consent_logs.policy_version | versioned-ref | requerido con finalidad y decisión | personal | Auditoría |
| privacy_requests.request_type | controlled-code | catálogo jurídicamente validado | personal | Auditoría |
| incidents.severity | controlled-code | taxonomía aprobada; no inferir obligación legal | restringida | Auditoría |
| notifications.recipient_ref/contact | ref o dato cifrado | minimizado; no secreto | personal | Notificaciones |
| integrations.secret_ref | secret-ref | solo puntero a vault; nunca secreto | restringida | Secret manager |
| outbox.message_id | opaque-id | único; payload sujeto a schema/tamaño | según mensaje | Servicio local |
| inbox.message_id | opaque-id | único; marca efecto confirmado | interna | Servicio local |
| idempotency.request_hash | cryptographic digest | vincula key a payload normalizado | seguridad | Servicio local |

## Reglas de calidad

Strings se normalizan sin destruir el valor original cuando tenga valor probatorio; correo/teléfono no se asumen identificadores universales. JSON requiere schema/version y límites. Dinero no pertenece al MVP. Hash no prueba autoría. Campos calculados registran algoritmo/versión/procedencia. No se registran contraseñas, tokens, claves KMS, credenciales de proveedor ni binarios.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-DAT-002/006, RF, ADR-015/016 y catálogo de eventos. Supuesto: los tipos lógicos serán traducidos a PostgreSQL tras POC. Decisiones: contexto tenant no proviene del cuerpo; secretos/blobs fuera. Pendientes: longitudes, enumeraciones, schemas de metadatos, cifrado campo a campo e inventario jurídico.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Diccionario lógico inicial y campos críticos. | Codex |
