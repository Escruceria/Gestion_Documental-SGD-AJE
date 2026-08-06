# Casos de prueba de privacidad

| Campo | Valor |
|---|---|
| Código | GDP-TST-005 |
| Versión | 0.1 |
| Estado | Diseñado; revisión jurídica pendiente |
| Fecha | 2026-07-16 |
| Propietario | `[RESPONSABLE_DATOS]` |
| Revisores | `[ASESOR_JURIDICO]`, `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]` |
| Aprobador | `[RESPONSABLE_DATOS]` |

| Caso | Escenario | Esperado |
|---|---|---|
| CP-PRI-001 | consentimiento aplicable/no aplicable, finalidad y versión | evidencia explícita separada; nunca casilla premarcada ni consentimiento universal |
| CP-PRI-002 | solicitud con datos mínimos, duplicidad e identidad insuficiente | caso restringido; verificación proporcional; sin exponer contenido |
| CP-PRI-003 | acceso/corrección/eliminación con retención o legal hold | decisión trazable; no borrar contra obligación; comunicación autorizada |
| PRI-004 | logs, traces, eventos y DLQ con datos canario | contenido/secretos ausentes; referencias mínimas |
| PRI-005 | reporte/exportación/backup | solo alcance autorizado; cifrado, TTL y auditoría |
| PRI-006 | OCR y metadatos con dato sensible sintético | clasificación heredada, acceso mínimo y retención alineada |
| PRI-007 | usuario revocado o cambio tenant | caché/sesión/proyección no conserva datos indebidos |

La prueba verifica controles técnicos, no determina base, plazo o obligación. Consentimiento, derechos, conservación y transferencias: **Requiere validación jurídica especializada**.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RF-AUD-003..005, RN-PRI, THR-023/025/029/030 y catálogo de datos. Supuesto: se usarán personas ficticias. Decisiones: minimización en toda evidencia. Pendientes: matriz legal, identidad del titular, plazos y políticas aprobadas.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Casos técnicos de privacidad. | Codex |
