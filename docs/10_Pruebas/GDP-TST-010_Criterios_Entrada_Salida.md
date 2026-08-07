# Criterios de entrada y salida de pruebas

| Campo | Valor |
|---|---|
| Código | GDP-TST-010 |
| Versión | 0.1 |
| Estado | Borrador para aprobación |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[PRODUCT_OWNER]`, `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[PRODUCT_OWNER]` |

## Entrada mínima

- RF/RNF y criterios versionados; OpenAPI/AsyncAPI válidas.
- Build identificable, lockfile y ambiente reproducible cuando exista código.
- Datos sintéticos y secretos de prueba controlados.
- Riesgos/amenazas asociados y caso con resultado esperado.
- Observabilidad suficiente para diagnosticar sin exponer PII.
- Para recuperación: backup, runbook, ambiente aislado y autorización.

## Salida por nivel

| Nivel | Criterio de salida |
|---|---|
| PR | casos afectados verdes; contratos compatibles; sin secreto/vulnerabilidad crítica nueva |
| Vertical/POC | criterios POC medidos; duplicados/fallos/tenant cubiertos; informe y excepciones |
| UAT | 42 RF trazados, casos Must aprobados, accesibilidad sin bloqueantes y aceptación registrada |
| Producción | cero P0/P1 abierto; aislamiento, carga segura y restore exitosos; riesgos residuales aprobados; rollback/runbooks listos |

Umbrales RNF OPV no se convierten en SLA. Un test omitido, flaky o bloqueado no cuenta como aprobado. `No aplica` exige justificación y aprobador.

## Suspensión/reanudación

Suspender ante fuga de datos, corrupción, ambiente no confiable, malware fuera de cuarentena, secreto expuesto o evidencia inválida. Aislar, preservar evidencia, registrar incidente y corregir causa; reanudar con autorización de los responsables correspondientes.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: Gate G6, GDP-TST-001/002, STRIDE y RNF. Supuesto: severidades se formalizarán en gobierno QA. Decisiones: críticos no se aceptan por calendario. Pendientes: umbrales cuantitativos y firmantes.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Puertas iniciales de calidad. | Codex |
