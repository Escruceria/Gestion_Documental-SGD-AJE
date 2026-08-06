# Gestión de errores y Problem Details

| Campo | Valor |
|---|---|
| Código | GDP-BE-007 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]`, `[ANALISTA_REQUISITOS]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Formato

Todos los errores HTTP usan `application/problem+json`. Campos RFC 9457: `type`, `title`, `status`, `detail`, `instance`; extensiones: `code`, `correlationId`, `errors`, `retryable`. `detail` es seguro y localizado por cliente si procede; `code` es estable y no cambia con traducción.

```json
{
  "type": "https://docs.example.invalid/problems/validation-failed",
  "title": "La solicitud contiene datos inválidos",
  "status": 422,
  "detail": "Corrija los campos indicados.",
  "instance": "/v1/documents",
  "code": "validation.failed",
  "correlationId": "01J...",
  "errors": [{"field":"documentTypeId","code":"required","message":"El tipo documental es obligatorio."}],
  "retryable": false
}
```

El dominio no conoce HTTP; produce errores tipados. Un filtro global NestJS mapea validación, autorización, conflicto, dependencia y fallo inesperado. Errores inesperados devuelven mensaje genérico y conservan detalle solo en telemetría sanitizada.

| Código estable | HTTP | Uso |
|---|---:|---|
| `request.malformed` | 400 | JSON/media type/parámetro inválido |
| `validation.failed` | 422 | regla semántica o campos |
| `authentication.required` | 401 | token ausente/inválido |
| `authorization.denied` | 403 | identidad válida sin permiso visible |
| `resource.not_found` | 404 | inexistente o política anti-enumeración |
| `resource.conflict` | 409 | unicidad, estado o idempotency payload distinto |
| `precondition.failed` | 412 | ETag/versión obsoleta |
| `rate_limit.exceeded` | 429 | presupuesto agotado |
| `dependency.unavailable` | 503 | dependencia temporal; retryable según caso |
| `internal.error` | 500 | fallo inesperado sin detalle sensible |

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-017, RFC 9457, criterios de aceptación y THR-006. Supuesto: se alojará documentación real de tipos antes de producción. Decisiones: catálogo estable y filtro global. Pendientes: dominio público para `type`, traducciones y matriz completa de errores por endpoint.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Problem Details y códigos iniciales. | Codex |
