# Baseline técnico G7

| Campo | Valor |
|---|---|
| Código | GDP-GPR-016 |
| Versión | 0.1 |
| Estado | Parcial; workspace y lockfile creados, verificaciones pendientes |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

## Decisión de gestor y workspace

Se adopta `pnpm 11.9.0` con workspace compartido. Motivos: resolución única, catálogo central de versiones, filtros por proyecto, lockfile común, soporte nativo de monorepo y generación SBOM en pnpm 11. El baseline no usa rangos flotantes.

```text
apps/
├── web/
├── api-gateway/
├── identity-access-service/
├── document-core-service/
├── correspondence-workflow-service/
├── document-processing-worker/
├── audit-compliance-service/
└── notification-integration-service/
packages/
├── contracts/
└── platform-testing/
pocs/
├── poc-001-multitenancy/
└── poc-002-document-pipeline/
```

Los directorios solo contienen manifests y documentación; no hay módulos funcionales, controladores, migraciones productivas ni CRUD.

## Evidencia obtenida

| Control | Resultado |
|---|---|
| Node local | `v24.14.0` comprobado |
| pnpm local | `11.9.0` comprobado y fijado en `packageManager` |
| Proyectos workspace | 13: raíz, 8 apps, 2 packages y 2 POC |
| Resolución | 649 paquetes resueltos por `pnpm install --lockfile-only` |
| Lockfile | `pnpm-lock.yaml` generado |
| Instalación física | No realizada; la orden fue `--lockfile-only` |
| Advertencias | dos subdependencias `glob` deprecadas; `openapi-typescript@7.13.0` declara peer TypeScript `^5.x` |
| Versiones verificadas por fuente npm | TypeScript 7.0.2, NestJS 11.1.28, React 19.2.7 |
| Node objetivo del catálogo | 24.18.0; difiere del 24.14.0 local y debe alinearse antes de POC |

pnpm añadió automáticamente excepciones de edad mínima para `react-i18next@17.0.10` y `vite@8.1.5`; requieren revisión de supply chain y no implican aprobación silenciosa.

La prueba real demostró que `openapi-typescript@7.13.0` falla al ejecutarse con TypeScript 7.0.2. Se rechazó la excepción peer y se aisló el generador en `packages/openapi-generator` con TypeScript 5.9.3, que satisface su peer `^5.x`. Las aplicaciones conservan TypeScript 7.0.2; el artefacto generado debe compilar posteriormente con TypeScript 7.

## Reglas reproducibles

- `.npmrc`: versiones exactas, peers estrictos, integridad de store y lockfile compartido.
- `.nvmrc`: reproduce el runtime observado; debe actualizarse junto con evidencia al adoptar Node 24.18.0.
- `pnpm-workspace.yaml`: catálogo único backend y proyectos explícitos.
- `tsconfig.base.json`: strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` y NodeNext.
- CI usará `pnpm install --frozen-lockfile`; cualquier cambio de resolución requiere PR y revisión.
- Scripts de instalación de dependencias permanecen deshabilitados por allowlist vacía hasta revisar cada necesidad.
- Los scripts de `@scarf/scarf`, `cpu-features`, `msw`, `protobufjs` y `ssh2` se ignoran explícitamente; no se aprobó ejecución de telemetría ni compilación nativa en el baseline POC.

## SBOM

pnpm 11 ofrece generación nativa. Comando preparado:

```powershell
pnpm sbom --sbom-format cyclonedx --sbom-spec-version 1.6 --lockfile-only --out artifacts/sbom.cdx.json
```

El archivo no se creó por interrupción del entorno durante la verificación final. No se genera un SBOM ficticio. Tras crearlo se validará JSON, cantidad de componentes, raíz/workspaces, hashes y correspondencia con `pnpm-lock.yaml`.

## Imágenes y digests

`infra/images.candidates.yaml` registra repositorios/tags candidatos y el estado de digest. Ningún `sha256` se inventa. Promoción exige resolver manifiesto para plataforma, verificar firma/procedencia/licencia/SBOM/vulnerabilidades y escribir referencia inmutable `repository@sha256:...`. Docker no quedó demostrado disponible en esta sesión.

## Comandos de reanudación

```powershell
pnpm peers check
pnpm install --lockfile-only --frozen-lockfile
pnpm sbom --sbom-format cyclonedx --sbom-spec-version 1.6 --lockfile-only --out artifacts/sbom.cdx.json
docker version
```

Después: resolver imágenes, ejecutar escaneo, registrar digests y recién entonces instalar/compilar POC.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: catálogo maestro del stack, ADR-011..021, documentación oficial pnpm y páginas npm de paquetes. Supuesto: el registro resuelto representa las versiones candidatas al corte. Decisiones: pnpm 11.9.0, workspace único y lockfile compartido. Pendientes bloqueantes: Node 24.18, peers, frozen lock, SBOM, digests, Docker, instalación/build y POC.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Decisión, workspace, evidencia y bloqueos G7. | Codex |
