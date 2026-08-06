# Modelo multitenant y diseño RLS

| Campo | Valor |
|---|---|
| Código | GDP-DAT-015 |
| Versión | 0.1 |
| Estado | Borrador bloqueante hasta POC-001 |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[RESPONSABLE_SEGURIDAD]`, `[ARQUITECTO]`, `[LIDER_QA]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Decisión de diseño

MVP SaaS usa aislamiento lógico compartido dentro de cada base de servicio: `tenant_id` obligatorio, autorización local y RLS como defensa adicional. Compartir instancia no comparte base, esquema, rol ni credencial. Despliegues/base dedicados son una variante posterior; no cambian IDs ni contratos.

## Origen del contexto

1. Gateway valida token Keycloak, pero no decide autorización final.
2. Servicio resuelve `subject_id` y membresía activa para tenant solicitado mediante contexto confiable.
3. `tenant_id` no se acepta del cuerpo como autoridad; rutas/headers solo expresan intención y se comparan.
4. Toda unidad de trabajo tenant-scoped abre transacción, ejecuta `SET LOCAL app.tenant_id = <valor validado>` mediante parámetro seguro y usa la misma conexión hasta commit/rollback.
5. Al devolver conexión al pool, `SET LOCAL` desaparece; queda prohibido `SET` de sesión global.
6. Jobs/mensajes vuelven a validar envelope, permiso del productor y tenant; correlación no autoriza.

## Política RLS conceptual

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON documents
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

El fragmento es diseño ilustrativo, no migración productiva. La ausencia/malformación de contexto debe negar, no ampliar. El rol runtime no posee `BYPASSRLS`, no es owner de tablas y no puede deshabilitar políticas. Migraciones usan rol separado y temporal. Procesos globales emplean funciones/roles específicos, alcance explícito y auditoría; nunca una bandera enviada por usuario.

## Cobertura por superficie

| Superficie | Clave de aislamiento | Control |
|---|---|---|
| PostgreSQL | tenant_id | filtro explícito + RLS + constraints compuestos |
| S3/MinIO | key opaca y metadata/registro tenant | IAM/policy, URL limitada, verificación servidor; no confiar en prefijo solo |
| Caché | namespace tenant + usuario/política | invalidación en cambio tenant; prohibido caché sin contexto |
| Mensajes | tenantId en envelope | productor autorizado, schema, inbox tenant-aware |
| Búsqueda/proyección | tenant_id y source version | filtrar antes de ranking/retorno; reconstruible |
| Logs/trazas | IDs operativos minimizados | acceso por ambiente/rol; tenant no como label cardinal alto |
| Exportación | manifiesto de un tenant | consulta RLS, cifrado, TTL, revisión y auditoría |
| Backup | conjunto multi-tenant cifrado | acceso restringido; restore selectivo no se promete sin diseño probado |

## Entidades globales y excepciones

`users` puede ser global y relacionarse con memberships tenant-scoped; catálogos de permisos de plataforma pueden ser globales inmutables. Toda tabla con filas globales y tenant en la misma estructura requiere política explícita y revisión; se prefiere separar tablas para evitar `tenant_id IS NULL` permisivo. Keycloak tiene aislamiento/configuración propia y no hereda la RLS de aplicación.

## Amenazas y pruebas POC-001

1. Dos tenants con IDs iguales de negocio no colisionan.
2. SELECT/INSERT/UPDATE/DELETE cruzado falla aun si el repositorio omite filtro.
3. `WITH CHECK` impide insertar/cambiar tenant.
4. Contexto ausente/inválido retorna cero/denegación, no todas las filas.
5. Pool concurrente no reutiliza contexto entre solicitudes.
6. Transacción anidada/error/rollback no filtra contexto.
7. Owner, migrator y runtime demuestran privilegios separados y runtime sin bypass.
8. Jobs, búsqueda, objetos, caché y exportación fallan ante mezcla tenant.
9. Cambio tenant en SPA limpia TanStack Query/Zustand permitido y no conserva datos.
10. Trazas/logs no contienen contenido ni tokens.

## Operación y tenants dedicados

Noisy neighbor se controla por rate limit, cuotas, pool, colas y métricas. Promover a base dedicada exige herramienta de exportación/importación, verificación de integridad, corte/reconciliación y ADR operativo. RPO/RTO y restore de un solo tenant permanecen pendientes; no se prometen como capacidad contractual.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-011/013/015, THR-003/009/029, RNF-MTN-001 y RF-IAM-008. Supuesto: organización:tenant 1:1 en MVP. Decisiones: shared model con defensa multicapa y fail closed. Pendientes: resultado POC-001, rol de soporte JIT, tareas globales, restore selectivo y variante dedicada.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Modelo multitenant, contexto y RLS conceptual. | Codex |
