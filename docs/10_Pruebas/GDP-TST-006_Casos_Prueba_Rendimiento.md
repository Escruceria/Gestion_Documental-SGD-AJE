# Casos de prueba de rendimiento

| Campo | Valor |
|---|---|
| Código | GDP-TST-006 |
| Versión | 0.1 |
| Estado | Diseño provisional; umbrales pendientes |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[ARQUITECTO]`, `[LIDER_OPERACIONES]`, `[PRODUCT_OWNER]` |
| Aprobador | `[PRODUCT_OWNER]` |

| ID | Escenario k6 | Métrica |
|---|---|---|
| PERF-001 | crear/consultar documento con mezcla CAP-MVP | p50/p95/p99, error, RPS, DB pool |
| PERF-002 | asignar consecutivos concurrentes por varios tenants | duplicados=0, throughput, lock wait |
| PERF-003 | solicitar/confirmar multipart sin transportar blob por API | latencia API, éxito, objeto/cola |
| PERF-004 | buscar con corpus representativo y permisos | percentiles, plan/índice, resultados correctos |
| PERF-005 | ráfaga de eventos, consumidor lento y recuperación | lag/edad, redelivery, DLQ, tiempo drenaje |
| PERF-006 | noisy neighbor tenant A frente a B | degradación relativa y límites |

Carga, concurrencia, tamaños y umbrales son `Objetivo provisional sujeto a validación con cliente piloto`; no son SLA. Cada ejecución registra dataset, warm-up, duración, versión, infraestructura y saturación.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RNF-REN/CAP, perfil de capacidad y POC. Supuesto: perfil real llegará antes de aceptación. Decisiones: medir percentiles y corrección, no solo throughput. Pendientes: valores, infraestructura/costo y presupuesto de error.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Escenarios k6 iniciales. | Codex |
