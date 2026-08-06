# Plan de pruebas multitenant

| Campo | Valor |
|---|---|
| Código | GDP-TST-014 |
| Versión | 0.1 |
| Estado | Diseñado; bloqueante hasta POC-001 |
| Fecha | 2026-07-16 |
| Propietario | `[RESPONSABLE_SEGURIDAD]` |
| Revisores | `[ARQUITECTO_DATOS]`, `[LIDER_QA]`, `[LIDER_FRONTEND]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[COMITE_SEGURIDAD]` |

## Matriz de actores/datos

Tenants A/B tienen códigos, títulos y IDs de negocio iguales para detectar filtros accidentales. Actores: miembro solo A, solo B, ambos, suspendido, sin membresía, admin plataforma sin acceso contenido y servicio técnico. Superficies: API, PostgreSQL/RLS, caché frontend, objeto/URL, búsqueda, eventos/DLQ, auditoría, reporte/exportación y backup/restore.

## Casos bloqueantes

| ID | Ataque/fallo | Esperado |
|---|---|---|
| CP-MTN-001 | cambiar A→B con requests y caché A activas | queries canceladas/aisladas; caché limpia; solo B |
| CP-MTN-002 | buscar/consultar ID A desde B | cero resultado/detalle; RLS y app deniegan |
| CP-MTN-003 | exportar A con registros A/B | manifiesto/paquete solo A; TTL/cifrado/auditoría |
| MTN-004 | omitir filtro en repositorio | RLS impide SELECT/UPDATE/DELETE cruzado |
| MTN-005 | insertar/cambiar tenant_id desde cuerpo/SQL | DTO ignora/rechaza y WITH CHECK deniega |
| MTN-006 | pool reutiliza conexión tras commit/rollback/error | `SET LOCAL` no fuga contexto |
| MTN-007 | mensaje con tenant manipulado/productor ajeno | rechazo/DLQ; ningún efecto |
| MTN-008 | URL/key de objeto A usada por B/expirada | denegación; sin metadata/contenido |
| MTN-009 | noisy neighbor A | B permanece dentro del objetivo provisional/limitado |
| MTN-010 | soporte/admin plataforma sin JIT | contenido denegado y acceso intentado auditado |

## POC-001

Ejecutar sobre PostgreSQL real con pool y concurrencia; probar runtime sin `BYPASSRLS`, owner/migrator separados, `ENABLE/FORCE RLS`, contexto ausente fail-closed, transacciones anidadas y seis servicios representativos. Evidencia: SQL/roles/policies, tests, trazas sanitizadas y resultados. Cualquier lectura/escritura cruzada es P0 y rechaza el modelo compartido hasta corrección o nuevo ADR.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: GDP-DAT-015, RNF-MTN-001, THR-003/009/029 y RF-IAM-008. Supuesto: POC cubre al menos dos servicios y luego plantilla común. Decisiones: defensa multicapa. Pendientes: workspace, implementación y variante tenant dedicado.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Matriz multicanal y POC-001. | Codex |
