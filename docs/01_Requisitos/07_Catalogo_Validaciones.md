# Catálogo de Validaciones (Reglas de entrada)

| Campo | Valor |
|---|---|
| Código | GDP-REQ-011 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | David Ernesto Antequera Martínez (QA, Líder Testing) |
| Revisores | Álvaro Patiño Cruz (Product Owner), Antonio José Escrucería Uribe (Arquitecto) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Definir reglas de validación que cada API debe aplicar antes de procesar solicitudes. Valida campos, formatos, límites, dependencias y permisos. Errores de validación devuelven RFC 9457 sin cambiar estado.

---

## Validaciones transversales (aplican a toda solicitud)

| ID | Regla | Condición de fallo | Código HTTP | Ejemplo |
|---|---|---|---|---|
| VAL-001 | Tenant-id presente y válido | Ausente, vacío o no UUID | 400 Bad Request | `GET /documents` sin tenant-id |
| VAL-002 | Authentication bearer token válido | Token ausente, expirado o inválido | 401 Unauthorized | Enviar con `Authorization: Bearer invalid` |
| VAL-003 | Idempotency-key válido (si aplica) | Presente pero no UUID v4 o v6 | 400 Bad Request | `Idempotency-Key: not-a-uuid` |
| VAL-004 | Content-Type correcto | application/json requerido pero no enviado | 415 Unsupported Media Type | POST sin Content-Type |
| VAL-005 | Payload no es nulo | Body vacío para operación que requiere datos | 400 Bad Request | POST con body vacío |
| VAL-006 | Membresía activa en tenant | Usuario autenticado pero sin membresía activa | 403 Forbidden | Usuario válido pero sin acceso |

---

## Validaciones por dominio

### Identidad y Acceso (Identity)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-IAM-001 | organizationId | Ausente, vacío, no UUID | 400 | Crear org sin nombre |
| VAL-IAM-002 | email en invitación | No es email válido | 400 | `email: "invalid-email"` |
| VAL-IAM-003 | email ya existe | Email vinculado a otra membresía activa | 409 Conflict | Invitar email existente |
| VAL-IAM-004 | roleId válido | ID no existe en catálogo permitido | 400 | `roleId: "fake-role"` |
| VAL-IAM-005 | MFA token | Presente pero inválido o expirado | 401 | OTP incorrecto |
| VAL-IAM-006 | tenantId en cambio de contexto | No es miembro de destino | 403 | Cambiar a tenant sin pertenencia |
| VAL-IAM-007 | dependencyId en estructura | Padre debe existir y ser válido | 400 | Crear dependencia sin padre |

### Documentos (Document Core)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-DOC-001 | typeId | No existe o no vigente | 400 | Crear doc con tipo inválido |
| VAL-DOC-002 | title | Vacío, >500 caracteres | 400 | Title vacío |
| VAL-DOC-003 | metadataJson | JSON inválido si presente | 400 | `metadata: "{invalid json}"` |
| VAL-DOC-004 | documentId en versión | No existe o estado incorrecto | 404 | Versionar doc inexistente |
| VAL-DOC-005 | archivo tamaño | >1GB o <1 byte | 413 Payload Too Large | Archivo 2GB |
| VAL-DOC-006 | MIME type | No está en whitelist permitida | 415 | Cargar .exe en tenant |
| VAL-DOC-007 | sessionId en confirmación | No emitida o expirada | 400 | Confirmar con sessionId viejo |
| VAL-DOC-008 | objetKey multipart | Debe coincidir con sesión | 400 | Confirmar con object diferente |

### Clasificación (Classification)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-CLS-001 | serieId | Vacío o no UUID | 400 | Serie sin código |
| VAL-CLS-002 | código único por tenant | Otro tipo ya usa código | 409 | Crear subserie con código existente |
| VAL-CLS-003 | subserie requiere serie | subserie sin serieId | 400 | Subserie huérfana |
| VAL-CLS-004 | vigencia válida | Fecha_inicio > fecha_fin | 400 | Vigencia invertida |

### Correspondencia (Correspondence)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-COR-001 | remitente mínimo | Nombre y canal vacíos | 400 | Radicar sin remitente |
| VAL-COR-002 | canal | No en {email, postal, mesa, otro} | 400 | Canal inválido |
| VAL-COR-003 | documentId | No existe o no vigente | 404 | Radicar doc inexistente |
| VAL-COR-004 | asunto | Vacío o >1000 caracteres | 400 | Asunto vacío |
| VAL-COR-005 | tipo radicación | {entrada, salida} requerido | 400 | Tipo inválido |
| VAL-COR-006 | destinatario en salida | Requerido y mínimo válido | 400 | Salida sin destinatario |

### Expedientes (Expedients)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-EXP-001 | classificationId | Debe ser válido y vigente | 400 | Classification inexistente |
| VAL-EXP-002 | asunto | Vacío o >1000 caracteres | 400 | Asunto vacío |
| VAL-EXP-003 | documentId en incorporación | Existe y está en estado permitido (no ARCHIVED) | 400 | Incorporar doc archivado |
| VAL-EXP-004 | expedientId en cierre | No tiene documentos | 400 | Cerrar expediente vacío |
| VAL-EXP-005 | dependencia | Usuario pertenece a dependencia | 403 | Usuario sin pertenencia |

### Auditoría y Privacidad (Compliance)

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-AUD-001 | action | Valor válido en catálogo predefinido | 400 | Action inválida |
| VAL-AUD-002 | resource | Referencia válida (UUID) | 400 | Resource sin formato |
| VAL-AUD-003 | consentId | Debe existir y estar en versión vigente | 404 | Consentimiento inexistente |
| VAL-AUD-004 | purposes | Array no vacío | 400 | Purposes vacío |
| VAL-AUD-005 | requestType | {acceso, rectificación, cancelación, oposición} | 400 | Tipo solicitud inválido |
| VAL-AUD-006 | requestState | Transición válida (no saltos) | 400 | State inválido o transición prohibida |

### Búsqueda y Consulta

| ID | Campo/regla | Condición de fallo | Código | Ejemplo |
|---|---|---|---|---|
| VAL-BUS-001 | query string | Mínimo 1 carácter, máximo 500 | 400 | Query vacío |
| VAL-BUS-002 | paginación page | >0, máximo 1000 | 400 | Page = 0 |
| VAL-BUS-003 | paginación limit | 1-500 registros | 400 | Limit = 1000 |
| VAL-BUS-004 | sort fields | Solo campos permitidos | 400 | Sort por campo inexistente |
| VAL-BUS-005 | filtros de fecha | Formato ISO 8601 | 400 | Fecha inválida |

---

## Validaciones del flujo vertical

| Paso | RF | Validación crítica | Fallo |
|---|---|---|---|
| 1 | RF-IAM-001 | organizationId único, nombre no vacío | 400/409 |
| 2 | RF-IAM-003 | email válido, no duplicado | 400/409 |
| 3 | RF-IAM-004 | invitationId válida, token Keycloak | 400/401 |
| 4 | RF-IAM-008 | membresía activa en tenant destino | 403 |
| 5 | RF-DOC-001 | serieId único por tenant | 409 |
| 6 | RF-DOC-004 | typeId vigente | 400 |
| 7 | RF-DOC-005 | sessionId válida, tamaño < 1GB | 400/413 |
| 8 | RF-DOC-006 | objectKey coincide sesión, hash válido | 400 |
| 9 | RF-DOC-007 | versión en cuarentena, MIME aprobado | 400 |
| 10 | RF-DOC-009 | versionId único, hash válido | 400 |
| 11 | RF-COR-001 | documentId existe, remitente válido | 400/404 |
| 12 | RF-AUD-001 | action catalogada, tenant válido | 400 |

---

## Tratamiento de errores de validación

- **Respuesta:** RFC 9457 (application/problem+json)
- **Estructura:**
  ```json
  {
    "type": "https://api.example.com/errors/validation",
    "title": "Validation Failed",
    "status": 400,
    "detail": "Field 'email' is not a valid email address",
    "instance": "/organizations",
    "fields": [
      { "name": "email", "reason": "invalid_format", "value": "not-an-email" }
    ]
  }
  ```
- **Sin cambio de estado:** Validación falla, no se persiste nada.
- **Idempotencia:** Mismo Idempotency-Key, mismo error = misma respuesta.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | 60+ validaciones por dominio, flujo vertical explicitado, RFC 9457 para errores. Aprobado. | David Ernesto Antequera Martínez |
