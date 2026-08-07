# Plan de gestión de configuración

| Campo | Valor |
|---|---|
| Código | GDP-GPR-011 |
| Versión | 0.1 |
| Estado | Borrador para aprobación |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO]` |
| Revisores | `[LIDER_OPERACIONES]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_QA]` |
| Aprobador | `[PROJECT_MANAGER]` |

## Propósito

Gobernar documentos, contratos, dependencias, imágenes, configuración y evidencia reproducible.

## Fuentes

ADR-012, ADR-019, ADR-020, GDP-ARQ-022 y control de cambios.

## Baselines

- BL-DOC: documentos con versión/estado e índice.
- BL-CON: OpenAPI, AsyncAPI y schemas.
- BL-SW: lockfile, versiones exactas, imágenes por digest y SBOM.
- BL-OPS: IaC, variables, dashboards y runbooks.

## Reglas

- Cambios mediante revisión trazable; no editar generados manualmente.
- Secretos nunca se almacenan en documentos o repositorio.
- Producción prohíbe `latest`, RC, beta y tags mutables.
- Cada release asocia commit válido, artefactos, SBOM, pruebas y aprobaciones.
- Backups de configuración no sustituyen backup de datos.

## Supuestos

Se contará con repositorio Git válido y CI antes del workspace.

## Decisiones

El gestor de paquetes y registry permanecen pendientes; no se asumen.

## Pendientes

Reparar/validar `.git`, decidir gestor, branching, firma, registry, secretos y retención de artefactos.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Plan inicial de baselines y configuración. | Codex |
