# Catálogo maestro de casos funcionales y de contrato

| Campo | Valor |
|---|---|
| Código | GDP-TST-003 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[LIDER_QA]` |
| Revisores | `[ANALISTA_REQUISITOS]`, `[PRODUCT_OWNER]`, `[ARQUITECTO]` |
| Aprobador | `[PRODUCT_OWNER]` |

## Plantilla de ejecución

Cada caso hereda: ambiente/build, precondiciones, datos, pasos, esperado, evidencia, resultado, defecto y ejecutor. Además del objetivo de la tabla se aplican, cuando corresponda, validación, autorización, tenant, duplicidad/concurrencia, fallo técnico y auditoría de GDP-REQ-008. `Automatización` es objetivo, no evidencia de ejecución.

| CP | RF | Objetivo y pasos esenciales | Resultado esperado | Nivel/automatización |
|---|---|---|---|---|
| CP-FUN-001 | RF-IAM-001 | Crear organización válida; repetir identificador | tenant único; conflicto sin duplicado; EVT-001/002 | API/integración |
| CP-FUN-002 | RF-IAM-002 | Crear/modificar/desactivar sede/dependencia | jerarquía tenant válida; EVT-003 | API/integración |
| CP-FUN-003 | RF-IAM-003 | Invitar y canjear una vez; intentar reuso/expiración | membresía solo tras canje válido | E2E/API |
| CP-SEG-001 | RF-IAM-004 | Vincular subject Keycloak; intentar subject duplicado | vínculo único; ninguna contraseña local | integración/seguridad |
| CP-SEG-002 | RF-IAM-005 | Suspender membresía A manteniendo B | A denegado, B intacto y auditable | E2E/seguridad |
| CP-SEG-003 | RF-IAM-006 | Acceder rol privilegiado sin/con MFA | sin MFA denegado; con desafío válido permitido | E2E/Keycloak |
| CP-SEG-004 | RF-IAM-007 | Asignar/revocar rol; intentar elevación no delegable | política respetada, cache invalidada, EVT-005 | API/seguridad |
| CP-MTN-001 | RF-IAM-008 | Cambiar A→B con queries/caché activas | contexto renovado; cero datos A en B | E2E/multitenant |
| CP-FUN-009 | RF-DOC-001 | Crear/versionar serie; duplicar código tenant | única por tenant/versión | integración |
| CP-FUN-010 | RF-DOC-002 | Crear subserie bajo serie vigente/ajena | válida local; ajena denegada | integración |
| CP-FUN-011 | RF-DOC-003 | Crear tipo con schema/formato; publicar versión | contrato vigente y EVT-006 | API/contrato |
| CP-FUN-012 | RF-DOC-004 | Crear documento válido/inválido/repetido | DRAFT único, RFC 9457, EVT-008 | API/OpenAPI |
| CP-SEG-005 | RF-DOC-005 | Solicitar carga autorizada; alterar tamaño/key/tenant | URL corta limitada a cuarentena | integración/objeto |
| CP-FUN-013 | RF-DOC-006 | Confirmar partes; repetir; omitir/alterar ETag | una versión/trabajo o error sin parcial | API/integración |
| CP-SEG-006 | RF-DOC-007 | Procesar limpio, error AV y comando duplicado | estado correcto, efecto único, observable | worker/seguridad |
| CP-FUN-014 | RF-DOC-008 | Calcular/comparar hash; provocar discrepancia | valor/procedencia registrados; discrepancia bloquea | integración |
| CP-CON-001 | RF-DOC-009 | Dos resultados concurrentes intentan versión | número monotónico, única versión/evento | concurrencia DB |
| CP-SEG-007 | RF-DOC-010 | Procesar fixture malicioso aprobado | REJECTED, sin lectura, alerta/evidencia | seguridad/E2E |
| CP-FUN-015 | RF-DOC-011 | Crear expediente con clasificación válida/obsoleta | OPEN solo con instrumento aplicable | API/integración |
| CP-CON-002 | RF-DOC-012 | Incorporar mismo documento concurrentemente | vínculo/orden único; respuesta idempotente | concurrencia DB |
| CP-FUN-017 | RF-DOC-013 | Consultar índice con documentos de permisos mixtos | orden/estado correcto sin fuga | API/seguridad |
| CP-FUN-018 | RF-DOC-014 | Cerrar completo e intentar cerrar inconsistente | hash/cierre o rechazo sin mutación | integración |
| CP-CON-003 | RF-COR-001 | Radicar entrada y repetir clave | mismo número/resultado; EVT-016/017 una vez efectivo | API/concurrencia |
| CP-CON-004 | RF-COR-002 | Radicar salida con documento aprobado/no aprobado | creada o 422; sin consecutivo reutilizado | API/concurrencia |
| CP-CON-005 | RF-COR-003 | Ejecutar múltiples asignaciones simultáneas | consecutivos únicos/monotónicos | carga/concurrencia |
| CP-FUN-022 | RF-COR-004 | Generar comprobante y comparar registro | datos exactos, minimizados, verificables | API/snapshot |
| CP-FUN-023 | RF-COR-005 | Distribuir a dependencia válida/ajena/inactiva | tarea válida o rechazo; EVT-018 | integración |
| CP-SEG-008 | RF-COR-006 | Consultar estado propio, ajeno y referencia inválida | estado mínimo o 404/403 sin enumeración | API/seguridad |
| CP-MTN-002 | RF-DOC-015 | Buscar términos iguales en tenants A/B | solo resultados del contexto y permisos | integración/RLS |
| CP-SEG-009 | RF-DOC-016 | Consultar ID de otro tenant/clasificación | sin metadato ni URL; auditoría apropiada | API/seguridad |
| CP-CON-006 | RF-AUD-001 | Entregar evento, duplicarlo y caer antes de ACK | un registro/efecto; ACK tras commit | mensajería/inbox |
| CP-SEG-010 | RF-AUD-002 | Auditor autorizado/no autorizado consulta | mínimo autorizado; consulta también auditada | API/seguridad |
| CP-PRI-001 | RF-AUD-003 | Registrar finalidad/versión/decisión; sin aplicar | evidencia separada o flujo no invocado | privacidad |
| CP-PRI-002 | RF-AUD-004 | Registrar solicitud e identidad mínima | caso único, acuse y acceso restringido | privacidad/API |
| CP-PRI-003 | RF-AUD-005 | Procesar eliminación con retención/hold | no borra; decisión/fundamento/historia | privacidad/legal |
| CP-INT-001 | RF-NIN-001 | Enviar correo y simular éxito/fallo proveedor | intento trazado, contenido minimizado, EVT-029 | integración/MSW |
| CP-INT-002 | RF-NIN-002 | Fallar hasta máximo, duplicar y recuperar | backoff, efecto único, DLQ/estado final | integración/broker |
| CP-FUN-039 | RF-OPS-001 | Generar reporte con filtros y actor ajeno | contenido tenant-scoped y autorización | API/E2E |
| CP-REC-001 | RF-OPS-002 | Ejecutar backup y validar manifiesto/cifrado | estado CREATED; no afirmar restore | recuperación |
| CP-REC-002 | RF-OPS-003 | Restaurar aislado y verificar integridad | restore válido, RPO/RTO medidos/evidencia | recuperación |
| CP-SEG-011 | RF-AUD-006 | Registrar incidente y probar acceso restringido | caso trazable, sin exposición, EVT-028 | seguridad/API |
| CP-MTN-003 | RF-OPS-004 | Exportar A con datos A/B y expirar paquete | manifiesto solo A, cifrado, TTL y auditoría | multitenant/E2E |

## Fuentes, supuestos, decisiones y pendientes

Fuentes: catálogo RF, criterios GDP-REQ-008 y matriz GDP-REQ-009. Supuesto: fixtures/ambientes permitirán fallos controlados. Decisiones: conservar los 42 IDs existentes. Pendientes: scripts, datos concretos, expected bodies y resultados de ejecución.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Materialización de 42 casos trazados. | Codex |
