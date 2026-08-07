# Estrategia de pruebas

| Campo | Valor |
|---|---|
| Código | GDP-TST-001 |
| Versión | 0.1 |
| Estado | Borrador para aprobación |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[PRODUCT_OWNER]`, `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[RESPONSABLE_DATOS]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[PRODUCT_OWNER]` |

## Objetivo y alcance

Demostrar requisitos, contratos, aislamiento, integridad, resiliencia, accesibilidad y recuperación antes de producción. Se aplica pirámide de pruebas con mayor cobertura unitaria/integración y E2E selectivo. Ninguna cobertura porcentual provisional sustituye casos de riesgo ni garantiza calidad.

| Nivel | Herramientas aprobadas | Alcance/evidencia |
|---|---|---|
| Unitaria | Vitest, `@nestjs/testing` | dominio, Value Objects, políticas, mapeos, UI/hooks |
| Integración | Vitest, Supertest, Testcontainers PostgreSQL | repositorios, RLS, transacciones, outbox/inbox, API |
| Contrato | OpenAPI/AsyncAPI, MSW, contract tests | productor/consumidor y Problem Details |
| Componentes frontend | React Testing Library, MSW, axe | formularios, estados, errores y accesibilidad |
| E2E | Playwright | flujo vertical, tenant, caché, navegación y permisos |
| Rendimiento | k6 | latencia, concurrencia, backpressure; umbrales OPV |
| Seguridad dinámica | OWASP ZAP + pruebas dirigidas | authz, inyección, exposición, carga y headers |
| Resiliencia/recuperación | Testcontainers/ambiente POC y runbooks | broker, DLQ, backup, restore, RPO/RTO medidos |

## Principios

1. Cada RF tiene al menos un CP; cada RNF aprobado tendrá evidencia medible.
2. PostgreSQL real reemplaza mocks para constraints, RLS y transacciones.
3. Datos sintéticos; no copiar producción salvo procedimiento de anonimización aprobado.
4. Pruebas tenant usan al menos A/B y atacante sin membresía; IDs intencionalmente similares.
5. Tiempo, UUID, proveedores y broker se controlan sin ocultar carreras reales.
6. Casos de fallo prueban postcondición, telemetría y ausencia de estado parcial.
7. Flaky test se corrige o aísla con dueño/fecha; no se reintenta indefinidamente para obtener verde.
8. Evidencia incluye commit, versiones, ambiente, datos, resultado, logs sanitizados y artefactos.

## Riesgo y prioridad

P0: fuga tenant, elevación, malware liberado, pérdida/corrupción, restore fallido, consecutivo duplicado, auditoría alterable y supply chain crítica. P1: idempotencia, DLQ, notificaciones, privacidad, accesibilidad bloqueante. Un P0 fallido impide release; su aceptación administrativa no sustituye tratamiento demostrado.

## Automatización y puertas

PR ejecuta unitarias, integración afectada, contratos, lint y SCA/SAST cuando exista pipeline. Main añade suites completas, componentes y E2E. Preview ejecuta ZAP baseline y aceptación. POC/operación ejecuta carga, caos controlado y restore. Resultados se publican sin secretos. Matriz GDP-TST-009 es fuente de cobertura.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-019, RF/RNF, STRIDE, OpenAPI/AsyncAPI y POC. Supuesto: CI permitirá PostgreSQL/contenedores o runner equivalente. Decisiones: riesgo antes que porcentaje. Pendientes: gestor workspace, umbrales cobertura/carga, ambientes y responsables nominales.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Estrategia integral inicial. | Codex |
