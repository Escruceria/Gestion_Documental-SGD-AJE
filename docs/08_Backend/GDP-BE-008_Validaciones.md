# Validaciones de backend

| Campo | Valor |
|---|---|
| Código | GDP-BE-008 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[ANALISTA_REQUISITOS]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Capas

| Capa | Responsabilidad | Tecnología/evidencia |
|---|---|---|
| Transporte | JSON, media type, parámetros, tamaño | Gateway/NestJS/OpenAPI |
| DTO | tipo, requerido, formato, allowlist | class-validator + class-transformer |
| Aplicación | existencia autorizada, idempotencia, coordinación | casos de uso |
| Dominio | estados, invariantes, unicidad semántica | Value Objects/agregados |
| Persistencia | NOT NULL, CHECK, UNIQUE, FK local, RLS | PostgreSQL |
| Integración | envelope/schema/version/tamaño | JSON Schema/AsyncAPI |

`ValidationPipe` global usa transformación controlada, whitelist y rechazo de campos no permitidos. Conversión implícita peligrosa queda prohibida. El DTO no sustituye autorización ni reglas de dominio. IDs se validan sintácticamente antes de uso y nunca se concatenan en SQL/keys.

## Flujo vertical

- Documento: `documentTypeId`, título/metadatos conforme al schema vigente; no aceptar `tenantId`, estado, hash ni actor del cliente.
- Solicitud de carga: nombre lógico, media type permitido, tamaño positivo dentro de política y partes controladas; key/bucket los genera servidor.
- Confirmación: upload ID, partes/ETags y checksum ligados a sesión; no aceptar URL/key arbitraria.
- Radicación: dirección fija `INCOMING`, canal permitido, documento disponible/autorizado, remitente minimizado.
- Búsqueda/consulta: cursor/filtros allowlist y autorización previa al resultado.

## Configuración

Variables de entorno se validan al arrancar y fallan rápido; biblioteca concreta sigue pendiente. Secretos no aparecen en mensajes. Constraints DB son última defensa y se traducen a errores estables sin exponer nombres de tabla/constraint.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-017, GDP-REQ-011 anunciado, RF-DOC/COR y GDP-DAT-007. Supuesto: schemas de metadatos serán versionados. Decisiones: validación por capas y reject unknown. Pendientes: límites exactos, formatos permitidos, biblioteca de configuración y catálogo campo a campo.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Capas y validaciones del flujo vertical. | Codex |
