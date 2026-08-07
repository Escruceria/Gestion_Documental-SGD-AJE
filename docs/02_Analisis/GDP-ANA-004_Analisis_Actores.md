# Análisis de Actores y Responsabilidades — Venus AS-IS

| Campo | Valor |
|---|---|
| Código | GDP-ANA-004 |
| Versión | 0.1 |
| Estado | Borrador validación |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz |

## Actores y permisos actuales (Venus)

| Actor | Usuarios | Responsabilidades | Acceso actual | Restricciones |
|---|---|---|---|---|
| Recepcionista | 2-3 | Recibir comunicaciones externas | Inbox email, escritorio | Entrada solamente |
| Secretarias/Admin | 5-8 | Radicar, registrar, distribuir | Email, Excel, Google Drive | Por área |
| Gestores Documentales | 3-5 | Clasificar, mantener índices, expedientes | Todo acceso | Supervisado |
| Especialistas | 15-20 | Crear/usar documentos operativos | Su proyecto/área | Restricto proyecto |
| Supervisores | 10-15 | Aprobación, autorización | Su área completa | Authority by role |
| Archivo/Histórico | 1-2 | Custodiar, transferencias | Almacenamiento físico | Recibir/entregar |
| IT/Administrador | 1-2 | Infraestructura, backups | Root/admin | Técnico |
| Compliance/Legal | 1 | Validar retención, auditoria | Lectura auditoría | Asesor |

## Matriz de permisos por proceso

| Proceso | Recepcionista | Secretaria | Gestor | Especialista | Supervisor | Archivo | IT | Compliance |
|---|---|---|---|---|---|---|---|---|
| Radicar entrada | Recibir | Numerar ✓ | Validar | — | Revisar | — | — | — |
| Radicar salida | — | Crear | Numerar | Redactar ✓ | Aprobar ✓ | — | — | — |
| Crear expediente | — | — | Crear ✓ | Usar | — | — | — | Validar |
| Búsqueda | — | — | Asesorar | Buscar ✓ | Buscar | Consultar | — | Auditar |
| Disposición | — | — | Proponer | — | Autorizar ✓ | Ejecutar ✓ | — | Validar ✓ |

✓ = Can do
— = Cannot do

## Validaciones pendientes

- ¿Hay segregación de funciones (persona que crea ≠ persona que aprueba)?
- ¿Supervisión actual suficiente?
- ¿Documentados permisos?
- ¿Hay acceso heredado (people who left)?

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-08-05 | Actores y permisos AS-IS. | Álvaro Patiño Cruz |
