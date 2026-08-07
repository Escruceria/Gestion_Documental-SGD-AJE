# Estrategia de migraciones de base de datos

| Campo | Valor |
|---|---|
| Código | GDP-DAT-011 |
| Versión | 0.1 |
| Estado | Borrador; no contiene migraciones productivas |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[ARQUITECTO]`, `[LIDER_OPERACIONES]`, `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Estándar aprobado

Cada macroservicio usa `node-pg-migrate`; acceso runtime mediante Kysely/`pg`. El servicio es propietario exclusivo de directorio, tabla de control, credencial y orden de migración. Quedan prohibidos `synchronize`, `db push`, modificar una migración aplicada y ejecutar DDL con el usuario runtime.

```text
apps/<service>/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
└── src/infrastructure/database/
```

## Ciclo de cambio

1. Diseñar cambio y clasificar compatible/destructivo, volumen, lock, RLS, PII y rollback lógico.
2. Crear nueva migración con ID temporal monotónico y nombre descriptivo; nunca editar aplicada.
3. Validar en PostgreSQL real: base limpia y upgrade desde versión soportada con datos representativos.
4. Comparar esquema esperado, tipos Kysely y contratos; ejecutar seguridad/RLS.
5. Revisar SQL, locks, índices, permisos y plan de recuperación.
6. En deploy, adquirir lock de migración, usar rol temporal DDL y emitir telemetría sin datos.
7. Desplegar aplicación compatible; verificar salud y métricas.
8. Conservar evidencia: hash de migración, versión app, duración, resultado y aprobador.

## Expand-and-contract

| Fase | Acción | Regla |
|---|---|---|
| Expand | agregar columna/tabla/índice compatible | nullable/default seguro; evitar rewrite/lock largo |
| Dual | código lee/escribe ambos modelos cuando sea necesario | observable y temporal |
| Backfill | lotes reiniciables con checkpoint | rate limit, tenant-aware, no transacción gigante |
| Switch | activar lectura/escritura nueva | feature flag/config controlada y reconciliación |
| Contract | retirar estructura anterior en release posterior | evidencia de cero uso, backup y aprobación |

No se confía en `down` automático en producción. Recuperación puede ser rollback de aplicación compatible, roll-forward de esquema o restore probado. Cambios destructivos requieren backup verificado y plan específico.

## RLS, constraints e índices

- Crear tabla y constraints antes de habilitar acceso de aplicación.
- Cargar/normalizar `tenant_id`, validar no nulos, crear índices tenant-first cuando lo justifique el plan y luego habilitar/forzar RLS.
- Probar políticas como runtime y atacante, no solo como owner.
- FK compuestas pueden incluir tenant para impedir vínculos locales cruzados.
- Índices grandes usan estrategia de bajo bloqueo; `CREATE INDEX CONCURRENTLY` exige manejo fuera de transacción según capacidad del migrador.
- Cambiar enum físico rígido se evita cuando dificulte evolución; catálogos/checks versionados se eligen conscientemente.

## Seeds y datos

Seeds productivos contienen solo configuración controlada, determinista e idempotente; no usuarios, documentos ni datos ficticios. Migración de datos de clientes es un proyecto separado con mapeo, hash, conciliación, cuarentena, evidencia y aprobación. No se crean FK ni consultas hacia otra base durante migración.

## Pipeline y puertas

Debe fallar ante migración editada, drift, SQL inseguro, privilegio excesivo, política RLS ausente en tabla tenant-scoped, downgrade no soportado, incompatibilidad Kysely o timeout de lock. SBOM/lockfile pertenecen a G7. La secuencia entre servicios no debe depender de una transacción global; contratos expand-and-contract mantienen compatibilidad.

## POC y aceptación

POC-001 valida `SET LOCAL`, pool, RLS y roles. POC-002 valida negocio+outbox. Antes del primer release: clean install, upgrade N-1, backfill reiniciable, fallo intermedio, despliegue compatible y restore deben pasar sobre PostgreSQL real con Testcontainers/entorno representativo.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: ADR-015, GDP-DAT-007/015 y estrategia distribuida. Supuesto: una sola versión de esquema soportada hacia atrás se definirá por release. Decisiones: forward-only productivo y expand-contract. Pendientes: gestor workspace, convención exacta de timestamp, herramienta drift, ventana operacional y política N-1.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Estrategia independiente por servicio. | Codex |
