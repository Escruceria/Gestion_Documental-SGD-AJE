# OpenAPI 3.1 — Especificación Flujo Vertical 12-Paso

| Campo | Valor |
|---|---|
| Código | GDP-BKD-001 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 3-A3) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | David Ernesto Antequera Martínez (QA), Álvaro Patiño Cruz (PO) |
| Formato | OpenAPI 3.1.0 + JSON Schema |
| Validación | Swagger UI, Redoc, local testing |

## Propósito

Contrato de APIs REST para flujo vertical 12-paso. Cada paso → endpoint explícito + schema request/response + errores esperados + ejemplos.

---

## 1. Configuración global

```yaml
openapi: 3.1.0
info:
  title: SGD — Sistema de Gestión Documental
  version: 1.0.0
  description: APIs flujo vertical Venus Ingeniería
  contact:
    name: Equipo Arquitectura
    email: arquitectura@sisigoap.com

servers:
  - url: https://api.sgd.local
    description: Production
  - url: http://localhost:3000/api/v1
    description: Development

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT de Keycloak (OIDC)

  schemas:
    Error:
      type: object
      required: [type, status, title, detail, instance, timestamp]
      properties:
        type: { type: string, format: uri }
        status: { type: integer }
        title: { type: string }
        detail: { type: string }
        instance: { type: string }
        timestamp: { type: string, format: date-time }
        trace_id: { type: string }
        fields:
          type: array
          items:
            type: object
            properties:
              field: { type: string }
              message: { type: string }

security:
  - bearerAuth: []
```

---

## 2. Paso 1: Crear organización (MS-01)

```yaml
POST /organizations
  tags: [Identity & Access]
  summary: Crear organización (tenant)
  operationId: createOrganization

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [name, sector, headquarters]
          properties:
            name: { type: string, minLength: 3, maxLength: 255 }
            sector: { type: string, enum: [technology, government, finance, healthcare, other] }
            headquarters:
              type: object
              required: [name, city]
              properties:
                name: { type: string }
                city: { type: string }
                address: { type: string }
        example:
          name: "Venus Ingeniería de Software"
          sector: "technology"
          headquarters:
            name: "Oficina Principal"
            city: "Bogotá"
            address: "Cra 7 # 100-50"

  responses:
    201:
      description: Organización creada
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              tenant_id: { type: string, format: uuid }
              name: { type: string }
              created_at: { type: string, format: date-time }
          example:
            id: "550e8400-e29b-41d4-a716-446655440000"
            tenant_id: "550e8400-e29b-41d4-a716-446655440000"
            name: "Venus Ingeniería de Software"
            created_at: "2026-08-05T10:00:00Z"

    400:
      description: Datos inválidos
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Error' }
          example:
            type: "https://api.example.com/errors/validation-error"
            status: 400
            title: "Validation Error"
            detail: "sector must be one of: technology, government, finance, healthcare, other"
            instance: "/organizations"
            timestamp: "2026-08-05T10:00:00Z"
```

---

## 3. Paso 2: Invitar usuarios (MS-01)

```yaml
POST /users/invite
  tags: [Identity & Access]
  summary: Invitar usuario a organización
  operationId: inviteUser

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [email, full_name, department_id]
          properties:
            email: { type: string, format: email }
            full_name: { type: string, minLength: 3 }
            department_id: { type: string, format: uuid }
            roles: { type: array, items: { type: string }, example: ["EDITOR", "VIEWER"] }

  responses:
    201:
      description: Usuario invitado
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              email: { type: string }
              status: { type: string, enum: [invited, active] }
              created_at: { type: string, format: date-time }

    400:
      $ref: '#/components/responses/ValidationError'
```

---

## 4. Paso 3: Vincular Keycloak (MS-01)

```yaml
POST /users/{id}/link-identity
  tags: [Identity & Access]
  summary: Vincular identidad Keycloak
  operationId: linkKeycloakIdentity
  parameters:
    - name: id
      in: path
      required: true
      schema: { type: string, format: uuid }

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [keycloak_id]
          properties:
            keycloak_id: { type: string, format: uuid }

  responses:
    200:
      description: Identidad vinculada
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              keycloak_id: { type: string, format: uuid }
              linked_at: { type: string, format: date-time }
```

---

## 5. Paso 4: Cambio tenant (MS-01)

```yaml
POST /context/switch-tenant
  tags: [Identity & Access]
  summary: Cambiar contexto de tenant
  operationId: switchTenant
  description: Usuario con membresías múltiples cambia tenant activo

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [tenant_id]
          properties:
            tenant_id: { type: string, format: uuid }

  responses:
    200:
      description: Contexto actualizado
      content:
        application/json:
          schema:
            type: object
            properties:
              tenant_id: { type: string, format: uuid }
              tenant_name: { type: string }
              effective_permissions: { type: array, items: { type: string } }
              switched_at: { type: string, format: date-time }

    403:
      description: Usuario no tiene membresía en ese tenant
```

---

## 6. Paso 5: Crear series/tipos (MS-02)

```yaml
POST /series
  tags: [Document Core]
  summary: Crear serie documental
  operationId: createSeries

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [code, name, retention_years]
          properties:
            code: { type: string, minLength: 3, maxLength: 20 }
            name: { type: string }
            description: { type: string }
            parent_id: { type: string, format: uuid, nullable: true }
            retention_years: { type: integer, minimum: 1 }
            requires_approval: { type: boolean, default: false }
        example:
          code: "RH-NOMI"
          name: "Recursos Humanos — Nómina"
          retention_years: 5
          requires_approval: false

  responses:
    201:
      description: Serie creada
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              code: { type: string }
              name: { type: string }
              tenant_id: { type: string, format: uuid }
              created_at: { type: string, format: date-time }
```

---

## 7. Paso 6: Crear documento (MS-02)

```yaml
POST /documents
  tags: [Document Core]
  summary: Crear documento
  operationId: createDocument

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [title, series_id, document_type_id]
          properties:
            title: { type: string, minLength: 3 }
            description: { type: string, nullable: true }
            series_id: { type: string, format: uuid }
            document_type_id: { type: string, format: uuid }
            classification: { type: string, enum: [public, internal, confidential, secret] }
            expedient_id: { type: string, format: uuid, nullable: true }

  responses:
    201:
      description: Documento creado
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              title: { type: string }
              status: { type: string, enum: [draft, active, archived] }
              created_at: { type: string, format: date-time }
```

---

## 8. Paso 7: Solicitar carga (MS-04)

```yaml
POST /uploads/request
  tags: [Document Processing]
  summary: Solicitar carga multipart
  operationId: requestUpload

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [document_id, file_name, mime_type, size_bytes]
          properties:
            document_id: { type: string, format: uuid }
            file_name: { type: string }
            mime_type: { type: string, example: "application/pdf" }
            size_bytes: { type: integer, maximum: 104857600 }

  responses:
    200:
      description: Sesión carga preparada
      content:
        application/json:
          schema:
            type: object
            properties:
              upload_session_id: { type: string, format: uuid }
              upload_url: { type: string, format: uri }
              expiry_at: { type: string, format: date-time }
              multipart_parts: { type: array, items: { type: object } }
```

---

## 9. Paso 8: Confirmar carga (MS-04)

```yaml
POST /uploads/{upload_session_id}/confirm
  tags: [Document Processing]
  summary: Confirmar carga completada
  operationId: confirmUpload
  parameters:
    - name: upload_session_id
      in: path
      required: true
      schema: { type: string, format: uuid }

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [hash_sha256]
          properties:
            hash_sha256: { type: string, pattern: '^[a-f0-9]{64}$' }

  responses:
    200:
      description: Carga confirmada, procesamiento iniciado
      content:
        application/json:
          schema:
            type: object
            properties:
              document_file_id: { type: string, format: uuid }
              status: { type: string, enum: [pending, processing] }
              processing_job_id: { type: string, format: uuid }
```

---

## 10. Paso 9: Procesar archivo (MS-04)

```yaml
GET /jobs/{job_id}
  tags: [Document Processing]
  summary: Obtener estado del procesamiento
  operationId: getProcessingJobStatus
  parameters:
    - name: job_id
      in: path
      required: true
      schema: { type: string, format: uuid }

  responses:
    200:
      description: Estado del trabajo
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              status: { type: string, enum: [pending, in_progress, completed, failed] }
              job_type: { type: string, enum: [scan_virus, validate_format, extract_text_ocr] }
              results:
                type: object
                properties:
                  scan_result: { type: string, enum: [clean, infected] }
                  ocr_text: { type: string, nullable: true }
                  integrity_valid: { type: boolean }
              error_message: { type: string, nullable: true }
              completed_at: { type: string, format: date-time, nullable: true }
```

---

## 11. Paso 10: Registrar versión (MS-02)

```yaml
POST /documents/{doc_id}/versions
  tags: [Document Core]
  summary: Registrar versión de documento
  operationId: registerVersion
  parameters:
    - name: doc_id
      in: path
      required: true
      schema: { type: string, format: uuid }

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [file_id]
          properties:
            file_id: { type: string, format: uuid }
            change_summary: { type: string }

  responses:
    201:
      description: Versión registrada
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              version_number: { type: integer }
              created_at: { type: string, format: date-time }
              is_current: { type: boolean }
```

---

## 12. Paso 11: Radicar entrada (MS-03)

```yaml
POST /correspondences/incoming
  tags: [Correspondence & Workflow]
  summary: Radicar comunicación de entrada
  operationId: registerIncomingCorrespondence

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [subject, sender_name, document_id]
          properties:
            subject: { type: string, minLength: 5 }
            sender_name: { type: string }
            sender_email: { type: string, format: email, nullable: true }
            document_id: { type: string, format: uuid }
            received_date: { type: string, format: date-time }
            priority: { type: string, enum: [normal, high, urgent] }
            assigned_to: { type: string, format: uuid, nullable: true }

  responses:
    201:
      description: Radicación registrada
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              number: { type: string, example: "RAD-2026-00001" }
              document_id: { type: string, format: uuid }
              status: { type: string, enum: [registered, in_review, approved] }
              created_at: { type: string, format: date-time }
              receipt_proof:
                type: object
                properties:
                  number: { type: string }
                  timestamp: { type: string, format: date-time }
                  receipt_url: { type: string, format: uri }
```

---

## 13. Paso 12: Auditar evento (MS-05)

```yaml
POST /audit-logs
  tags: [Audit & Compliance]
  summary: Registrar evento de auditoría
  operationId: logAuditEvent
  description: Consumido automáticamente desde outbox

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [event_type, entity_type, entity_id, performed_by, action]
          properties:
            event_type: { type: string, enum: [create, read, update, delete, approve, sign] }
            entity_type: { type: string, enum: [document, correspondence, expedient, user] }
            entity_id: { type: string, format: uuid }
            performed_by: { type: string, format: uuid }
            action: { type: string }
            old_value: { type: object, nullable: true }
            new_value: { type: object, nullable: true }
            ip_address: { type: string, format: ipv4 }
            user_agent: { type: string }
            trace_id: { type: string, format: uuid }

  responses:
    201:
      description: Evento registrado
      content:
        application/json:
          schema:
            type: object
            properties:
              id: { type: string, format: uuid }
              timestamp: { type: string, format: date-time }
              trace_id: { type: string, format: uuid }
```

---

## 14. Búsqueda (MS-02)

```yaml
GET /documents/search
  tags: [Document Core]
  summary: Buscar documentos (full-text + filtros)
  operationId: searchDocuments
  parameters:
    - name: q
      in: query
      required: true
      schema: { type: string, minLength: 3 }
      description: Término búsqueda
    - name: series_id
      in: query
      schema: { type: string, format: uuid }
    - name: classification
      in: query
      schema: { type: string, enum: [public, internal, confidential, secret] }
    - name: from_date
      in: query
      schema: { type: string, format: date }
    - name: to_date
      in: query
      schema: { type: string, format: date }
    - name: limit
      in: query
      schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
    - name: offset
      in: query
      schema: { type: integer, minimum: 0, default: 0 }

  responses:
    200:
      description: Resultados búsqueda
      content:
        application/json:
          schema:
            type: object
            properties:
              total: { type: integer }
              results:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: string, format: uuid }
                    title: { type: string }
                    series: { type: string }
                    classification: { type: string }
                    created_at: { type: string, format: date-time }
                    relevance_score: { type: number, minimum: 0, maximum: 1 }
```

---

## 15. Códigos de error estándar

| Status | Title | Ejemplo Detail |
|---|---|---|
| 400 | Validation Error | "field 'email' must be valid email format" |
| 401 | Unauthorized | "Token expired or invalid signature" |
| 403 | Forbidden | "User not member of tenant xyz" |
| 404 | Not Found | "Document with ID xxx not found" |
| 409 | Conflict | "Sequence number already exists" |
| 410 | Gone | "Document has been disposed" |
| 422 | Unprocessable Entity | "Document requires approval before radicating" |
| 429 | Too Many Requests | "Rate limit exceeded (100 req/min)" |
| 500 | Internal Server Error | "Database connection failed" |
| 503 | Service Unavailable | "Processing worker is unavailable" |

---

## 16. Headers obligatorios en requests

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Correlation-ID: {uuid}  # Trazabilidad
X-Tenant-ID: {uuid}       # Información (validada en middleware)
User-Agent: {app}
```

---

## 17. Ejemplos de flujos

**Flujo completo radicación:**
```
1. POST /correspondences/incoming
   ├─ Validar documento existe (MS-02)
   ├─ Generar número secuencial (MS-03)
   ├─ Guardar correspondencia (MS-03)
   ├─ Publicar CorrespondenceRegistered (evento)
   │   ├─ MS-05 consume: audit_logs insert
   │   └─ MS-06 consume: enviar notificación
   └─ Retornar radicación con número y comprobante

2. Respuesta incluye:
   - number: "RAD-2026-00001"
   - receipt_proof (comprobante descargable)
   - timestamp inmutable
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Especificación OpenAPI 3.1 flujo vertical 12-paso, errores RFC 9457, ejemplos. | Antonio José Escrucería Uribe |
