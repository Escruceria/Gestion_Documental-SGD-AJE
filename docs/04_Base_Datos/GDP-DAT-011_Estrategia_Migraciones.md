# Estrategia de migraciones de base de datos

| Campo | Valor |
|---|---|
| Código | GDP-DAT-011 |
| Versión | 0.2 |
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

## Topología canónica y propiedad de migraciones

La cadena de migraciones es propiedad del macroservicio que posee los datos. Una migración ejecutable debe tener un único propietario y un único destino de base o esquema. No se mantiene una segunda cadena global que replique o combine las migraciones de varios servicios.

### Reglas obligatorias

1. Cada servicio mantiene una sola secuencia canónica de migraciones.
2. Una migración de un servicio no crea, altera ni elimina tablas propiedad de otro servicio.
3. No se permiten claves foráneas, joins ni DDL cruzados entre bases de servicios diferentes.
4. Las referencias a entidades externas se almacenan como identificadores contractuales sin FK entre servicios.
5. Una migración aplicada no se edita; la evolución se realiza mediante una nueva migración del mismo propietario.
6. Toda cadena se valida desde una base limpia y, cuando aplique, mediante upgrade desde la versión soportada.
7. Una ruta duplicada o divergente bloquea la integración hasta su corrección.

### Aplicación en POC-002

Cadena canónica Document Core:

    pocs/poc-002-document-pipeline/migrations/document-core/
    -> base: sgd_poc_document_core
    -> propietario: Document Core

Cadena canónica Processing:

    pocs/poc-002-document-pipeline/migrations/processing/
    -> base: sgd_poc_processing
    -> propietario: Processing

La base sgd_poc_document_core contiene las tablas propiedad del núcleo documental utilizadas por el POC, incluyendo document_versions y outbox_messages.

La base sgd_poc_processing contiene las tablas propiedad de procesamiento utilizadas por el POC, incluyendo inbox_messages, processing_jobs y outbox_messages.

La ruta histórica pocs/poc-002-document-pipeline/migrations/*.sql no constituye una tercera cadena canónica.

La auditoría MIG-TOPO-001 comprobó que esa ruta combina responsabilidades de ambos servicios y que su evolución diverge de las cadenas propietarias.

La ruta raíz queda clasificada como obsoleta y fuera de uso. Su eliminación física requiere completar primero la reconstrucción limpia, las verificaciones de esquema y las pruebas definidas para cerrar MIG-TOPO-001.

### Prevención de drift

Todo PR que agregue o modifique migraciones debe verificar:

- propietario del esquema;
- base de datos destino;
- ausencia de una migración equivalente en otra cadena;
- ausencia de FK, joins o DDL cruzados;
- ejecución completa sobre una base limpia;
- upgrade desde la versión soportada cuando aplique;
- esquema, constraints e índices finales esperados;
- pruebas del servicio;
- evidencia suficiente para auditoría.

Una divergencia entre cadenas ejecutables se considera defecto arquitectónico y bloquea la integración.

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
| 0.2 | 2026-08-20 | Se formaliza la topología canónica por servicio, la prohibición de cadenas globales duplicadas y los controles preventivos derivados de MIG-TOPO-001 en POC-002. | Antonio José Escrucería Uribe |
