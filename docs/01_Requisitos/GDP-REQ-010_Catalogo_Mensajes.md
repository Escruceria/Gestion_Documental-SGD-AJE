# Catálogo de Mensajes (Comandos y Eventos)

| Campo | Valor |
|---|---|
| Código | GDP-REQ-010 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner, Analista Requisitos) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), David Ernesto Antequera Martínez (QA) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Centralizar definiciones de comandos (solicitudes asíncronas) y eventos (cambios de estado) que circulan entre macroservicios y sistemas externos. Cada mensaje tiene estructura versionada, no contiene secretos ni documentos completos.

---

## Comandos (CMD) — Solicitudes asíncronas entre servicios

| ID | Nombre | Origen → Destino | Payload principal | Idempotencia | Reintento |
|---|---|---|---|---|---|
| CMD-001 | ProcessDocumentFile | document-core → document-processing-worker | { documentId, versionId, objectKey, storagePath } | Idempotency-Key obligatorio | SQS con DLQ |
| CMD-002 | ValidateFileIntegrity | document-processing-worker → núcleo | { versionId, hashAlgorithm, hashValue } | Idempotency-Key | 3 reintentos max |
| CMD-003 | SendNotification | notification-integration → proveedor SMTP | { recipientId, templateId, tenantId, variables } | Idempotency-Key | Retry + jitter |
| CMD-004 | RegisterAuditEvent | cualquier servicio → audit-compliance | { tenantId, userId, action, resource, resultCode, timestamp, correlationId } | Idempotency-Key | At-least-once |
| CMD-005 | ExtractTextOCR | document-processing-worker → servicio OCR | { versionId, objectKey, language } | Idempotency-Key | 2 reintentos |
| CMD-006 | EmitEmailTemplate | notification-integration → SMTP | { messageId, recipientEmail, templateCode, variables, expiresAt } | Idempotency-Key | DLQ tras max |

---

## Eventos (EVT) — Cambios de estado publicados

| ID | Nombre | Dominio | Publicador | Estructura mínima | Correlación | Retención |
|---|---|---|---|---|---|---|
| EVT-001 | OrganizationCreated | Identidad | identity-access-service | { tenantId, organizationId, name, createdAt, createdBy } | correlation-id | 365 días |
| EVT-002 | OrganizationUpdated | Identidad | identity-access-service | { tenantId, organizationId, change, changedAt, changedBy } | correlation-id | 365 días |
| EVT-003 | StructureUpdated | Identidad | identity-access-service | { tenantId, depId, change } | correlation-id | 90 días |
| EVT-004 | UserMembershipChanged | Identidad | identity-access-service | { tenantId, userId, memberships[], timestamp } | correlation-id | 365 días |
| EVT-005 | RoleAssigned | Identidad | identity-access-service | { tenantId, userId, roleId, grantedAt, grantedBy } | correlation-id | 365 días |
| EVT-006 | DocumentTypeCreated | Clasificación | document-core | { tenantId, typeId, name, metadata } | correlation-id | 90 días |
| EVT-008 | DocumentCreated | Documentos | document-core | { tenantId, documentId, typeId, createdBy, createdAt } | correlation-id | 365 días |
| EVT-009 | VersionRegistered | Documentos | document-core | { tenantId, documentId, versionId, hash, hashAlgorithm } | correlation-id | 7 años (mín) |
| EVT-011 | ExpedientCreated | Expedientes | document-core | { tenantId, expedientId, classificationId, createdBy } | correlation-id | 365 días |
| EVT-012 | DocumentIncorporated | Expedientes | document-core | { tenantId, expedientId, documentId, sequence } | correlation-id | 365 días |
| EVT-013 | ExpedientClosed | Expedientes | document-core | { tenantId, expedientId, indexHash, closedAt, closedBy } | correlation-id | 7 años (mín) |
| EVT-016 | CorrespondenceRegistered | Correspondencia | correspondence-workflow | { tenantId, recordId, consecutiveNumber, type, registeredAt } | correlation-id | 7 años (mín) |
| EVT-017 | ReceiptIssued | Correspondencia | correspondence-workflow | { tenantId, recordId, receiptUrl, receipHash } | correlation-id | 7 años (mín) |
| EVT-018 | CorrespondenceDistributed | Correspondencia | correspondence-workflow | { tenantId, recordId, distributedTo[], timestamp } | correlation-id | 365 días |
| EVT-021 | FileQuarantined | Procesamiento | document-processing-worker | { tenantId, versionId, objectKey, quarantineId } | correlation-id | 90 días |
| EVT-022 | HashCalculated | Procesamiento | document-processing-worker | { versionId, hash, algorithm, verifiedAt } | correlation-id | 7 años (mín) |
| EVT-026 | ConsentRecorded | Privacidad | audit-compliance | { tenantId, subjectId, consentId, version, purposes[], recordedAt } | correlation-id | Según ley |
| EVT-027 | DataSubjectRequestUpdated | Privacidad | audit-compliance | { tenantId, requestId, status, decision, decidedAt, decidedBy } | correlation-id | Según ley |
| EVT-028 | IncidentRecorded | Seguridad | audit-compliance | { tenantId, incidentId, severity, category, recordedAt, recordedBy } | correlation-id | 7 años (mín) |
| EVT-029 | EmailSent | Notificaciones | notification-integration | { messageId, tenantId, recipientId, templateId, sentAt } | correlation-id | 90 días |
| EVT-031 | ScanCompleted | Procesamiento | document-processing-worker | { versionId, verdict (clean|quarantine), timestamp, scanEngine } | correlation-id | 90 días |
| EVT-032 | AuditLogPersisted | Auditoría | audit-compliance | { auditId, tenantId, event, timestamp, integrity-hash } | correlation-id | 7 años (mín) |

---

## Contrato OpenAPI para servicios sincronos

Servicios como `identity-access-service`, `document-core-service`, `correspondence-workflow-service` exponen APIs REST con OpenAPI 3.1:

- **identity-access-service:** `POST /organizations`, `POST /users/invite`, `PUT /memberships/{id}`, `POST /auth/tenant-context`
- **document-core-service:** `POST /documents`, `POST /documents/{id}/versions`, `GET /documents/{id}`, `POST /expedients`
- **correspondence-workflow-service:** `POST /correspondences/register`, `GET /correspondences/{id}/receipt`, `PUT /correspondences/{id}/distribute`
- **audit-compliance-service:** `GET /audit-logs`, `POST /audit-logs/search`, `POST /consents`, `POST /data-subject-requests`

Todos los servicios:
- Aceptan `Idempotency-Key` header.
- Devuelven RFC 9457 en errores.
- Loguean correlation-id en cada operación.
- No transportan documentos completos, solo referencias.

---

## Flujo vertical del catálogo de mensajes

**Flujo 12-paso:**
1. **EVT-001, EVT-002:** Organización creada/actualizada.
2. **EVT-004:** Usuario membresía en tenant.
3. **EVT-006:** Tipo documental creado.
4. **EVT-008:** Documento creado.
5. **CMD-001, EVT-021:** Carga solicitada, archivo en cuarentena.
6. **CMD-002, EVT-022:** Integridad validada, hash registrado.
7. **CMD-005, EVT-031:** OCR/antivirus, resultado clean.
8. **EVT-009:** Versión documental registrada.
9. **EVT-016, EVT-017:** Radicación ingreso registrada, comprobante.
10. **CMD-004, EVT-032:** Evento auditable, log persistido.
11. **EVT-011, EVT-012:** Expediente creado, documento incorporado.
12. **CMD-003, EVT-029:** Notificación enviada a usuario.

---

## Estándares y seguridad

- **Confidencialidad:** Ningún mensaje contiene contraseñas, tokens OAuth, números de documentos de identidad completos, o BAN bancarios.
- **Integridad:** Eventos críticos incluyen hash de contenido previo; logs son inmutables.
- **Trazabilidad:** Todos transportan `tenant_id`, `user_id`, `correlation_id`, `timestamp`.
- **Serialización:** JSON utf-8; versionado por cambios de esquema mayores.
- **Reintentos:** Exponencial backoff con jitter; DLQ para máximo agotado.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | 6 comandos, 21 eventos flujo vertical, estándares OpenAPI, seguridad y reintentos. Aprobado. | Antonio José Escrucería Uribe |
