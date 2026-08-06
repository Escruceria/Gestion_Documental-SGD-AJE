# Convenciones de API REST

| Campo | Valor |
|---|---|
| Código | GDP-BE-003 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[ANALISTA_REQUISITOS]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Alcance y estilo

REST JSON sobre HTTPS, descrito con OpenAPI 3.1. Rutas públicas bajo `/v1`; nombres plurales, minúsculos y kebab-case. Los recursos usan IDs opacos y nunca exponen claves secuenciales. La versión mayor incompatible vive en la URL; cambios compatibles evolucionan el contrato sin crear `/v2`.

## Solicitud y contexto

- `Authorization: Bearer <token>` es obligatorio salvo operación expresamente pública.
- `X-Tenant-ID` expresa el tenant solicitado, pero **no es autoridad**: el servicio valida membresía y permiso. No se deriva tenant del cuerpo.
- `Idempotency-Key` es obligatorio en escrituras indicadas; formato opaco 16–128 caracteres.
- `traceparent` sigue W3C; `X-Correlation-ID` puede aceptarse si es válido, pero el servidor genera/normaliza uno.
- `Content-Type: application/json`; archivos se cargan directamente a S3/MinIO mediante sesión multipart, no atraviesan la API.
- Fechas son RFC 3339 UTC; IDs y códigos sensibles a mayúsculas se normalizan por regla explícita.

## Respuestas

| Caso | Código | Regla |
|---|---:|---|
| Creación confirmada | 201 | `Location` y representación mínima |
| Trabajo aceptado | 202 | recurso/estado consultable; no promete finalización |
| Consulta correcta | 200 | representación autorizada |
| Sin contenido | 204 | solo cuando no se necesita estado resultante |
| Validación | 400/422 | 400 para sintaxis/contrato; 422 para semántica de negocio validable |
| No autenticado | 401 | `WWW-Authenticate`; sin detalle sensible |
| No autorizado/no visible | 403/404 | política anti-enumeración por recurso |
| Conflicto/concurrencia | 409/412 | invariante o precondición/ETag |
| Límite | 429 | `Retry-After` cuando sea conocido |
| Dependencia/fallo | 502/503/504 | sin estado parcial oculto; correlación disponible |

Errores usan exclusivamente `application/problem+json` conforme a RFC 9457. Respuestas exitosas no se envuelven en un objeto genérico `data`; colecciones usan `items` y `page`.

## Filtrado, orden y paginación

Paginación por cursor opaco para colecciones mutables; `limit` tiene máximo configurable. Filtros/orden permitidos se enumeran en OpenAPI; queda prohibido convertir parámetros en SQL libre. El cursor está ligado a tenant, filtros y orden y expira según política.

## Concurrencia e idempotencia

GET/HEAD son seguros. PUT reemplaza solo cuando exista semántica completa; PATCH usa media type/operaciones expresamente definidas. Recursos versionados devuelven ETag y escrituras sensibles usan `If-Match`. Reintento automático solo para métodos seguros o escrituras con clave idempotente.

## Compatibilidad y deprecación

Agregar campo opcional es compatible; cambiar tipo, significado, requerido o enum cerrado es incompatible. Consumidores deben ignorar campos nuevos. Deprecación se anuncia en OpenAPI, cabeceras estándar cuando proceda y calendario aprobado; no se inventa ventana contractual.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-012/013/017, RF, RNF-INT-001 y GDP-ARQ-019. Supuesto: gateway conserva headers autorizados y elimina spoofing. Decisiones: REST/OpenAPI 3.1, RFC 9457, tenant revalidado. Pendientes: gateway, límites, cursor y política de deprecación.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Convenciones contractuales iniciales. | Codex |
