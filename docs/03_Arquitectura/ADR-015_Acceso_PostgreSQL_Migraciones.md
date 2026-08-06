# ADR-015 - Acceso a PostgreSQL y migraciones

| Campo | Valor |
|---|---|
| ID | ADR-015 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-003, ADR-004, ADR-011, ADR-012, ADR-014 |

## Contexto

Los macroservicios requieren SQL tipado y explícito para PostgreSQL, RLS multitenant, outbox, índices avanzados, búsqueda textual, funciones, triggers y migraciones independientes. Un ORM que oculte consultas o genere el esquema automáticamente incrementaría el riesgo de aislamiento, rendimiento y evolución.

## Decisión

- Kysely será la capa de construcción de consultas tipadas.
- `pg` (`node-postgres`) será el driver y pool PostgreSQL.
- `node-pg-migrate` administrará migraciones.
- Cada macroservicio será propietario exclusivo de sus migraciones, credenciales y base/esquema.
- El dominio dependerá de interfaces de repositorio, no de Kysely.
- Las transacciones se controlarán en la capa de aplicación.
- Escritura de negocio y outbox se confirmarán en la misma transacción local.
- En producción las migraciones serán forward-only y los cambios incompatibles usarán expand-and-contract.

## Reglas vinculantes

1. Prohibido `synchronize`, `db push` o equivalentes en ambientes compartidos/productivos.
2. Nunca modificar una migración aplicada; crear una nueva.
3. Usuario runtime sin permisos DDL; usuario de migración separado y temporal.
4. Un servicio no accede ni migra la base/esquema de otro.
5. Consultas tenant-scoped incluyen filtro explícito y RLS como defensa adicional.
6. El contexto RLS usa `SET LOCAL` dentro de la misma transacción/conexión; nunca `SET` global en el pool.
7. SQL nativo se permite mediante API parametrizada y revisión; concatenación insegura queda prohibida.
8. Migraciones se prueban sobre base limpia y sobre datos representativos.
9. Backfills pesados son reiniciables, por lotes y observables; no bloquean indefinidamente el despliegue.
10. Índices grandes se crean con estrategia de bajo bloqueo cuando corresponda.
11. Cambios destructivos requieren aprobación, backup y plan de recuperación.
12. Seeds productivos contienen solo configuración controlada, no datos ficticios.

## Estructura por servicio

```text
apps/<service>/
├── src/infrastructure/database/
│   ├── database.module.ts
│   ├── database.types.ts
│   ├── transaction.manager.ts
│   └── repositories/
└── database/
    ├── migrations/
    ├── seeds/
    └── schema/
```

## Patrón transaccional

```typescript
await transactionManager.execute(async (trx) => {
  await repository.save(aggregate, trx);
  await outboxRepository.append(domainEvent, trx);
});
```

El publicador lee posteriormente el outbox y envía a EventBridge/SQS conforme a ADR-014.

## Estrategia expand-and-contract

1. Expandir el esquema con cambios compatibles.
2. Desplegar código compatible con modelo anterior y nuevo.
3. Migrar datos por lotes, con reanudación y métricas.
4. Cambiar lecturas/escrituras al modelo nuevo.
5. Retirar estructura anterior en una entrega posterior.

No se ejecutará reversión automática `down` en producción. La recuperación puede requerir rollback de aplicación, roll-forward de esquema o restauración según el incidente.

## Alternativas no seleccionadas

- TypeORM: integración cómoda con NestJS, pero menor control directo para el SQL avanzado requerido.
- Prisma: buena experiencia CRUD, pero añade abstracción y escape frecuente a SQL para características PostgreSQL avanzadas.
- Drizzle: alternativa válida y cercana; Kysely fue preferido por su modelo mental SQL-first.
- SQL manual exclusivo: máximo control, pero menor seguridad de tipos y composición.
- Migrador de Kysely: no elegido como estándar; `node-pg-migrate` aporta especialización PostgreSQL, locking y primitivas para políticas, funciones, triggers y extensiones.

## Criterios de aceptación

1. POC-001 demuestra RLS con pool, transacciones y `SET LOCAL` sin fuga de contexto.
2. POC-002 demuestra escritura de negocio + outbox atómica.
3. Dos servicios no pueden conectarse con credenciales a la base del otro.
4. Migraciones concurrentes quedan serializadas/bloqueadas de forma segura.
5. Pipeline valida migración sobre base limpia y upgrade desde versión anterior.
6. Pruebas detectan drift entre tipos Kysely y esquema migrado.
7. Una migración expand-and-contract se ejecuta sin indisponibilidad indebida.

## Revisión

Después de POC-001/002, antes del piloto y ante limitaciones verificadas de Kysely o `node-pg-migrate`.

