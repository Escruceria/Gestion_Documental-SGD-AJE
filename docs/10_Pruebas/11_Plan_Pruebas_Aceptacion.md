# Plan de pruebas de aceptación

| Campo | Valor |
|---|---|
| Código | GDP-TST-011 |
| Versión | 0.1 |
| Estado | Borrador; cliente piloto pendiente |
| Fecha | 2026-07-16 |
| Propietario | `[PRODUCT_OWNER]` |
| Revisores | `[CLIENTE_PILOTO]`, `[LIDER_ARCHIVISTICO]`, `[LIDER_QA]`, `[RESPONSABLE_DATOS]` |
| Aprobador | `[CLIENTE_PILOTO]` y `[PRODUCT_OWNER]` |

## Alcance

Validar el flujo organización/contexto → clasificación → documento → carga segura → versión disponible → expediente/radicación → consulta/auditoría/notificación, más privacidad, accesibilidad y recuperación. Los 42 RF se aceptan por trazabilidad; capacidades futuras quedan fuera.

## Sesiones

1. Administración e identidad.
2. Gestión documental y expediente.
3. Correspondencia y consecutivos.
4. Auditoría, privacidad e incidentes.
5. Operación, backup/restore y accesibilidad.

Cada sesión registra datos, actor, CA/CP, resultado, evidencia, desviación y decisión. Un requisito `Should` puede diferirse solo mediante cambio aprobado; un Must crítico no se omite. La aceptación funcional no acepta vulnerabilidad/fuga ni sustituye revisión jurídica.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ERS, 42 RF, criterios, GDP-TST-003 y G6. Supuesto: `[CLIENTE_PILOTO]` será identificado. Decisiones: aceptación basada en evidencia/trazabilidad. Pendientes: agenda, datos AS-IS, firmantes y criterios cuantitativos.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Plan UAT inicial. | Codex |
