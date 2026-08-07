# Idempotencia de API y mensajería

| Campo | Valor |
|---|---|
| Código | GDP-BE-012 |
| Versión | 0.1 |
| Estado | Borrador contractual |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## API

Clave compuesta: tenant + sujeto/cliente + operación + `Idempotency-Key`. Se almacena hash canónico de solicitud, estado (`PROCESSING/COMPLETED/FAILED_RETRYABLE`), referencia/código de respuesta y expiración. Primera solicitud adquiere unicidad; repetición con mismo hash devuelve el mismo efecto/respuesta; misma clave con hash distinto devuelve 409 `resource.conflict`; carrera en curso devuelve resultado/estado determinista.

La ventana exacta no se inventa y debe superar el máximo reintento del canal. No se guardan tokens ni payload sensible completo. Errores de validación previos a adquirir clave pueden repetirse; fallos ambiguos se consultan con la misma clave.

## Mensajería

`messageId` global es PK del inbox. Consumidor valida y, en una transacción local, registra inbox, efecto y outbox derivada; ACK después del commit. Duplicado confirmado recibe ACK sin repetir efecto. Publicador conserva outbox hasta confirmación/aceptación; pérdida de confirm puede duplicar y se tolera. Replay conserva ID salvo corrección causal explícita.

## Operaciones mínimas

Crear documento, confirmar carga, radicar y solicitar exportación requieren clave. Solicitar sesión de carga también la acepta para evitar sesiones duplicadas. GET no usa almacenamiento idempotente. Consecutivos dependen además de constraint/transacción local, nunca solo de la clave.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-ARQ-019, ADR-014/021, RN-COR-002 e INT-013..015. Supuesto: gateway preserva la clave sin reescribirla. Decisiones: exactly-once no se promete. Pendientes: ventana/limpieza, tamaño de respuesta cacheada y semántica por endpoint.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Idempotencia síncrona y asíncrona. | Codex |
