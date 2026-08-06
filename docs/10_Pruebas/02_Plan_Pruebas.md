# Plan maestro de pruebas

| Campo | Valor |
|---|---|
| Código | GDP-TST-002 |
| Versión | 0.1 |
| Estado | Borrador; ejecución no iniciada |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[PRODUCT_OWNER]`, `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[PRODUCT_OWNER]` |

## Fases

| Fase | Alcance | Entrada | Salida |
|---|---|---|---|
| T0 documental | RF/RNF/contratos/casos | línea base borrador | trazabilidad sin huérfanos críticos |
| T1 componente | dominio, API, DB, UI | workspace/lockfile | suites unitarias/integración verdes |
| T2 vertical | documento→carga→proceso→radicación | servicios desplegables | flujo y fallos críticos demostrados |
| T3 POC-001 | tenant, RLS, pool, cambio contexto | modelo ejecutable | aislamiento demostrado o ADR revisado |
| T4 POC-002 | objeto, AV/hash, outbox/inbox, brokers | adaptadores configurados | garantías portables demostradas |
| T5 aceptación | negocio, privacidad, accesibilidad | defectos P0/P1 cerrados | acta `[PRODUCT_OWNER]`/piloto |
| T6 producción | seguridad, restore, observabilidad | ambiente candidato | checklist y go/no-go |

## Ambientes y datos

Local/CI son efímeros y reproducibles; integración usa PostgreSQL real y emuladores solo si no reemplazan POC del servicio real. Preview no contiene datos productivos. Datos: tenants A/B, usuario sin tenant, admin, gestor, radicador, auditor, archivo limpio, EICAR o fixture seguro aprobado, multipart incompleto, evento duplicado/fuera de orden y backup verificable.

## Gestión de defectos

Se registra ID, severidad, riesgo, versión, pasos, esperado/actual, evidencia sanitizada, propietario y estado. P0: fuga, corrupción, bypass, malware disponible o restore imposible. P1: control crítico degradado sin workaround seguro. Cierre exige prueba de regresión; “no reproducible” requiere evidencia.

## Entregables

Casos GDP-TST-003..008/012..014, matriz GDP-TST-009, reportes por ejecución, evidencias POC, cobertura RNF, defectos, aceptación y riesgo residual. Fechas y personas permanecen `[FECHA_PENDIENTE]`/marcadores hasta planificación real.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-TST-001, POC, roadmap y gates. Supuesto: cliente piloto participa en T5. Decisiones: ejecución por riesgo/fase. Pendientes: calendario, infraestructura, presupuesto de carga, criterios cuantitativos y datos piloto.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Plan por fases y ambientes. | Codex |
