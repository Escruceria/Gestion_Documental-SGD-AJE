# Casos de prueba de accesibilidad

| Campo | Valor |
|---|---|
| Código | GDP-TST-007 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[RESPONSABLE_ACCESIBILIDAD]`, `[PRODUCT_OWNER]`, `[LIDER_FRONTEND]` |
| Aprobador | `[PRODUCT_OWNER]` |

| ID | Escenario | Técnica/aceptación |
|---|---|---|
| ACC-001 | login/contexto/cambio tenant por teclado | orden/foco visible, sin trampa, anuncio cambio |
| ACC-002 | crear documento y errores | labels, instrucciones, resumen y vínculo al campo |
| ACC-003 | carga multipart/progreso/rechazo | estado no solo color; live region sin ruido |
| ACC-004 | radicar y leer comprobante | headings/nombre accesible/fecha comprensible |
| ACC-005 | tablas, búsqueda y paginación | encabezados, nombre, navegación y estado |
| ACC-006 | zoom/reflow/contraste/modos de error | axe + revisión manual sin pérdida funcional |
| ACC-007 | lector de pantalla en flujo vertical | nombres/roles/estados correctos y mensajes oportunos |

Objetivo WCAG 2.1 AA o versión aplicable; axe/jest-axe detecta parte de los problemas y no sustituye revisión manual con teclado/lector.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RNF-ACC-001, OBJ-010 y ADR-018/019. Supuesto: prototipos usarán MUI con semántica preservada. Decisiones: cero defecto bloqueante antes de producción. Pendientes: tecnologías de apoyo/navegadores y validador especializado.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Casos automáticos y manuales. | Codex |
