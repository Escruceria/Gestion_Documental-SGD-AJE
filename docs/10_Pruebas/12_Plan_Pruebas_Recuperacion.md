# Plan de pruebas de recuperación

| Campo | Valor |
|---|---|
| Código | GDP-TST-012 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_OPERACIONES]` |
| Revisores | `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_CONTINUIDAD]` |

## Objetivo

Demostrar recuperación consistente de bases por servicio, objetos, Keycloak, broker/configuración y secretos referenciados, midiendo pérdida y tiempo reales. RPO/RTO son `Objetivo provisional sujeto a validación con cliente piloto` hasta aprobación.

| Escenario | Inyección | Validación |
|---|---|---|
| REC-001 / CP-REC-002 | pérdida/corrupción controlada de DB de un servicio | restore, migraciones, constraints/RLS, outbox/inbox y reconciliación |
| REC-002 | objeto faltante/versión previa | referencia/hash/versionado y estado seguro; no liberar inconsistente |
| REC-003 | nodo/cola broker | quorum/definiciones, mensajes confirmados y consumidores |
| REC-004 | pérdida Keycloak/config | realm/clientes/roles técnicos restaurados sin secretos expuestos |
| REC-005 | región/sitio no disponible simulado | orden de recuperación, DNS/config, dependencia y comunicación |
| REC-006 | rollback app con schema expandido | compatibilidad/roll-forward sin DDL destructivo |

## Ejecución

Autorizar ventana; capturar punto de fallo; arrancar cronómetro; restaurar en ambiente aislado; aplicar versiones/migraciones; verificar hashes, conteos, invariantes, tenant A/B, flujo vertical y auditoría; medir RPO/RTO; documentar brechas; destruir datos temporales de forma controlada. Nunca sobrescribir producción durante prueba.

## Criterio de éxito

Integridad y aislamiento demostrados, flujo crítico operativo, evidencia completa y RPO/RTO medidos frente a objetivo aprobado. Un “restore terminó” sin comprobación funcional no es éxito.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RF-OPS-003, RNF-BKP/REC, ADR-015/016/021 y THR-025. Supuesto: backups cubren componentes coordinados mediante manifiesto. Decisiones: restore aislado verificable. Pendientes: objetivos, herramientas, orden exacto y responsable de crisis.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Escenarios y verificación de recuperación. | Codex |
