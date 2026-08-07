# Catálogo de Errores (Códigos y mensajes)

| Campo | Valor |
|---|---|
| Código | GDP-REQ-012 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | David Ernesto Antequera Martínez (QA) |
| Revisores | Álvaro Patiño Cruz (Product Owner), Antonio José Escrucería Uribe (Arquitecto) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Estandarizar todos los códigos de error del MVP. Cada error devuelve RFC 9457 (application/problem+json) con tipo, status HTTP, título, detalle y contexto sin secretos.

---

## Errores de validación (400 Bad Request)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| validation.field_required | 400 | Campo requerido: {field} | Campo obligatorio ausente | Proporcionar campo |
| validation.field_format | 400 | Formato inválido para {field}: {example} | Email, UUID, fecha incorrectos | Corregir formato |
| validation.field_length | 400 | Longitud de {field} debe estar entre {min} y {max} | Demasiado corto/largo | Ajustar longitud |
| validation.field_regex | 400 | {field} no cumple patrón {pattern} | Caracteres inválidos | Usar caracteres permitidos |
| validation.array_empty | 400 | Array {field} no puede estar vacío | Array sin elementos requeridos | Agregar elementos |
| validation.constraint_unique | 409 Conflict | {field} ya existe: {value} | Duplicado no permitido | Usar valor diferente |
| validation.constraint_fk | 400 | {field} referencia no existe: {id} | Clave foránea rota | Usar ID válido |
| validation.payload_too_large | 413 | Payload supera {max} bytes | Solicitud demasiado grande | Reducir tamaño |
| validation.content_type | 415 | Content-Type no soportado: {sent} | MIME type incorrecto | Usar application/json |

---

## Errores de autenticación (401, 403)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| auth.missing | 401 | Authentication requerida | Ausente Authorization header | Proporcionar token |
| auth.invalid | 401 | Token inválido o malformado | Bearer token sin formato correcto | Enviar Bearer válido |
| auth.expired | 401 | Token expirado | Token válido pero ya pasada fecha | Refrescar token |
| auth.invalid_signature | 401 | Firma del token no válida | Token falsificado | Solicitar token nuevo |
| auth.mfa_required | 401 | MFA requerido para este rol | Usuario sin MFA para rol privilegiado | Completar MFA |
| auth.mfa_invalid | 401 | Código MFA inválido o expirado | OTP/Yubikey incorrecto | Reintentar con código válido |
| authz.insufficient_permission | 403 | No tiene permiso para {action} | Usuario autentic. pero sin permiso | Solicitar rol diferente |
| authz.tenant_not_member | 403 | No es miembro de este tenant | Usuario válido pero tenant incompatible | Cambiar a tenant válido |
| authz.resource_ownership | 403 | Recurso pertenece a otro tenant | Intento de acceso cruzado | Usar recurso en tenant propio |
| authz.anti_enumeration | 404 | Recurso no encontrado | (Oculta si existe pero sin permiso) | Verificar ID y permisos |

---

## Errores de recurso (404, 409)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| resource.not_found | 404 | Recurso no encontrado: {type} {id} | ID no existe o está eliminado | Verificar ID |
| resource.already_exists | 409 | Recurso ya existe: {type} {id} | Creación duplicada | Usar ID diferente |
| resource.state_invalid | 409 | Estado inválido para operación: {current} | Cambio de estado no permitido | Validar precondiciones |
| resource.version_conflict | 409 | Conflicto de versión: esperad {expected} recibido {actual} | Concurrencia en actualización | Refrescar y reintentar |
| resource.expired | 410 | Recurso expirado: {type} {id} | Invitación, sesión o token expirado | Solicitar recurso nuevo |
| resource.deleted | 410 | Recurso fue eliminado: {type} {id} | Acceso post-eliminación | Crear recurso nuevo |

---

## Errores de negocio (422 Unprocessable Entity)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| business.document_not_ready | 422 | Documento no disponible: pendiente antivirus/hash | Documento en cuarentena | Esperar procesamiento |
| business.expedient_not_closeable | 422 | Expediente no puede cerrarse: tareas pendientes | Documentos o tareas abiertas | Completar pendientes |
| business.retention_conflict | 422 | Acción prohibida por retención: {reason} | Disposición dentro de plazo | Esperar o solicitar excepción |
| business.consecutive_exhausted | 422 | Consecutivo agotado para serie {series} | Secuencia numeración completa | Revisar configuración de serie |
| business.invalid_transition | 422 | Transición no permitida: {from} → {to} | Estado o workflow prohibido | Validar flujo permitido |
| business.dualcontrol_required | 422 | Se requiere aprobación de segundo usuario | Acción sensible sin autorización | Solicitar aprobación |

---

## Errores de dependencias externas (50x)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| dependency.unavailable | 503 | Servicio externo no disponible: {service} | Base de datos, S3, Keycloak caído | Reintentar en segundos |
| dependency.timeout | 504 | Tiempo de espera agotado en {service} | Operación tardó demasiado | Reintentar o contactar soporte |
| dependency.invalid_response | 502 | Respuesta inválida de {service} | Servicio devolvió formato inesperado | Contactar soporte |
| storage.quota_exceeded | 507 | Cuota de almacenamiento agotada | Límite de GB por tenant alcanzado | Liberar espacio o ampliar cuota |
| storage.not_accessible | 503 | Almacenamiento no accesible: {path} | S3/MinIO no responde | Reintentar |
| antivirus.unavailable | 503 | Motor antivirus no disponible | Proveedor de antivirus caído | Reintentar carga |
| ocr.unavailable | 503 | Servicio OCR no disponible | Motor de OCR caído | Reintentar más tarde |

---

## Errores de servidor (500)

| Código | HTTP | Mensaje | Causa | Acción usuario |
|---|---|---|---|---|
| server.internal_error | 500 | Error interno. Contacte soporte: {ticket_id} | Bug no capturado | Reportar con ticket_id |
| server.unhandled_exception | 500 | Error inesperado (vea logs) | Excepción no manejada | Contactar soporte |
| server.corrupted_data | 500 | Integridad de datos comprometida | Hash mismatch, corrupción detectada | Contactar soporte inmediatamente |
| server.insufficient_resources | 503 | Recursos insuficientes: {resource} | Memoria, CPU saturados | Reintentar o contactar soporte |

---

## Estructura RFC 9457

Todas las respuestas de error usan:

```json
{
  "type": "https://api.example.com/errors/{categoria}/{codigo}",
  "status": 400,
  "title": "Brief title",
  "detail": "Detailed explanation",
  "instance": "/path/that/failed",
  "timestamp": "2026-08-05T14:30:00Z",
  "trace_id": "correlation_id_here",
  "fields": [
    {
      "name": "fieldName",
      "reason": "error_code",
      "value": "problematic_value"
    }
  ]
}
```

**Campos obligatorios:** type, status, title, detail.
**Campos opcionales:** instance, timestamp, trace_id, fields.
**Nunca incluir:** contraseñas, tokens, secretos, rutas del servidor.

---

## Errores del flujo vertical

| Paso | RF | Errores esperados | Manejo |
|---|---|---|---|
| 1 | RF-IAM-001 | validation.field_required, resource.already_exists | Validar antes, usar ID único |
| 2 | RF-IAM-003 | validation.field_format, authz.insufficient_permission | Email válido, check permisos |
| 3 | RF-IAM-004 | auth.expired, resource.expired | Reintentar con token fresco |
| 4 | RF-IAM-008 | authz.tenant_not_member | Verificar membresía en destino |
| 5 | RF-DOC-001 | validation.constraint_unique | Usar código único por tenant |
| 6 | RF-DOC-004 | resource.not_found | Verificar typeId vigente |
| 7 | RF-DOC-005 | validation.payload_too_large | Reducir tamaño archivo <1GB |
| 8 | RF-DOC-006 | business.document_not_ready, resource.version_conflict | Esperar procesamiento, reintentar con versión correcta |
| 9 | RF-DOC-007 | antivirus.unavailable, dependency.timeout | Reintentar carga |
| 10 | RF-DOC-009 | resource.state_invalid | Validar documento en estado CLEANED |
| 11 | RF-COR-001 | validation.field_required, resource.not_found | Proporcionar remitente, doc válido |
| 12 | RF-AUD-001 | server.internal_error, dependency.unavailable | Reintentar o contactar soporte |

---

## Reintentos y backoff

- **Errores 4xx:** No reintentar (usuario debe corregir).
- **Errores 5xx y 503:** Reintentar con backoff exponencial (1s, 2s, 4s, 8s, 16s, max 60s).
- **Jitter:** Agregar ±10% aleatorio para evitar thundering herd.
- **DLQ:** Tras 5 reintentos, enviar a cola de tareas fallidas.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | 60+ códigos de error RFC 9457, flujo vertical cubierto, reintentos y backoff. Aprobado. | David Ernesto Antequera Martínez |
