# Plan de pruebas de backup

| Campo | Valor |
|---|---|
| Código | GDP-TST-013 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_OPERACIONES]` |
| Revisores | `[RESPONSABLE_SEGURIDAD]`, `[ARQUITECTO_DATOS]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_CONTINUIDAD]` |

## CP-REC-001 y cobertura

Verificar programación/manual, éxito/fallo/alerta, cifrado/KMS, mínimo privilegio, inmutabilidad cuando aplique, retención configurada, inventario/manifiesto, checksum, restaurabilidad, segregación de ambientes y eliminación al vencer. Se incluyen PostgreSQL de seis servicios, objetos/versiones, Keycloak, definiciones RabbitMQ/IaC y configuración necesaria; secretos se respaldan por mecanismo del gestor, no texto exportado.

## Casos

| ID | Acción | Esperado |
|---|---|---|
| BKP-001 | ejecutar backup correcto | manifiesto firmado/hasheado y estado CREATED |
| BKP-002 | denegar almacenamiento/KMS | fallo y alerta; no declarar éxito parcial |
| BKP-003 | intentar leer con rol no autorizado | acceso denegado/auditado |
| BKP-004 | alterar artefacto | checksum/fixity detecta cambio |
| BKP-005 | restaurar muestra según GDP-TST-012 | contenido/invariantes verificables |
| BKP-006 | aplicar expiración/hold | retiene o elimina exactamente según política aprobada |

Frecuencia/retención permanecen pendientes y requieren validación jurídica/operativa. Backup no equivale a preservación digital ni a restore probado.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: RF-OPS-002, RNF-BKP-001, THR-025 y GDP-TST-012. Supuesto: manifiesto relaciona versiones coherentes. Decisiones: solo restore convierte respaldo en evidencia recuperable. Pendientes: frecuencia, retención, producto y ubicación.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Pruebas de creación, protección y uso de backup. | Codex |
