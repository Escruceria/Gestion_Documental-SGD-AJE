# Actores, roles y permisos

| Campo | Valor |
|---|---|
| Código | GDP-REQ-005 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Responsable Seguridad) |
| Revisores | Álvaro Patiño Cruz (Product Owner, Líder Archivístico), Álvaro Patiño Cruz (Responsable Datos) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Modelo

Keycloak autentica y entrega identidad; `identity-access-service` gobierna organización, membresía, roles y contexto. Cada servicio autoriza la acción sobre el recurso con RBAC más atributos. No se confía en roles enviados por el navegador. Denegación por defecto, mínimo privilegio, separación de funciones y aislamiento tenant son obligatorios.

| ID | Actor/rol | Capacidades iniciales | Límites |
|---|---|---|---|
| ACT-001 | Administrador de plataforma | Crear/configurar organización; soporte controlado | No consulta contenido por defecto; soporte JIT auditable |
| ACT-002 | Administrador de organización | Estructura, invitaciones, membresías, roles | Solo su tenant; no altera auditoría |
| ACT-003 | Gestor documental | Series, subseries, tipos, documentos, expedientes | Instrumentos publicados requieren aprobación definida |
| ACT-004 | Radicador | Crear y distribuir radicaciones, comprobantes | Consecutivos no editables; tenant actual |
| ACT-005 | Usuario institucional | Crear/consultar según permisos y dependencia | Sin administración ni auditoría general |
| ACT-006 | Auditor | Consultar evidencia autorizada | Solo lectura, propósito y alcance registrados |
| ACT-007 | Responsable de datos | Consentimientos y solicitudes de titular | No elimina contra retención/bloqueo |
| ACT-008 | Operador | Backup, restore, incidentes y salud | Sin lectura ordinaria de contenido |
| ACT-009 | Ciudadano/remitente | Entregar comunicación y consultar comprobante habilitado | Sin acceso al tenant interno |
| ACT-010 | Servicio técnico | Procesar, auditar o notificar por identidad de carga | Permiso contractual mínimo, sin usuario humano |

## Permisos canónicos

`organization:manage`, `membership:manage`, `role:manage`, `classification:manage`, `document:create`, `document:read`, `document:version`, `record:manage`, `correspondence:register`, `correspondence:distribute`, `audit:read`, `privacy:manage`, `notification:manage`, `report:read`, `backup:execute`, `restore:verify`, `incident:manage`, `tenant:export`.

El cambio de tenant requiere membresía activa, limpia cachés/datos de la SPA, renueva el contexto y queda auditado. MFA es obligatorio para roles privilegiados; política y factores concretos quedan por configurar.

## Actores del flujo vertical

Los actores del flujo vertical 12-paso son:
- **ACT-002:** Administrador de organización (crea estructura, invita usuarios).
- **ACT-005:** Usuario institucional (crea documentos, radiaciones, consulta).
- **ACT-008:** Operador (monitorea carga, procesa archivos).
- **ACT-010:** Servicio técnico (antivirus, hash, notificaciones).

## Fuentes, supuestos, decisiones y pendientes

**Fuentes:** ADR-013, mapa de dominios, OBJ-003/004, RES-004.

**Supuestos:** Una identidad puede pertenecer a varios tenants; roles son configurables por tenant; MFA es por rol.

**Decisiones:** Autorización servidor; denegación por defecto; separación de funciones obligatoria (no confundir admin con auditor).

**Pendientes:** 
- Matriz nominal organización-rol-permiso (Seguridad + PO) — 2026-09-15.
- Segregación exigida por cliente piloto (Venus) — 2026-09-15.
- Flujo JIT con aprobación y revocación automática (Operaciones) — antes de producción.
- Políticas de MFA, desbloqueo y recuperación (Seguridad) — antes de Fase 4.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Modelo inicial de actores y permisos. | Codex |
| 1.0 | 2026-08-05 | Responsables reales, actores del flujo vertical explicitados, pendientes con hitos de validación. Aprobado. | Antonio José Escrucería Uribe |
