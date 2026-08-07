# Gate de inicio de desarrollo

| Campo | Valor |
|---|---|
| Código | GDP-GPR-015 |
| Versión | 0.1 |
| Estado | Evaluación inicial |
| Fecha | 2026-07-16 |
| Propietario | `[PROJECT_MANAGER]` |
| Revisores | `[PRODUCT_OWNER]`, `[ARQUITECTO]`, `[LIDER_QA]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[PATROCINADOR]` |

## Propósito y criterio

Determinar con evidencia si puede iniciarse programación. Un archivo anunciado en el índice pero inexistente no cuenta como evidencia. `Bloqueante` impide declarar listo el desarrollo; `Parcial` exige completar y revisar.

## Resultado ejecutivo

**Recomendación: No apto para iniciar programación.** La arquitectura lógica y el stack están decididos, pero no existen todavía las líneas base implementables de requisitos, datos, contratos, seguridad, pruebas y operación. Las POC están planeadas, no ejecutadas.

## G1 — Gobierno: Parcial

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| Acta de inicio | Parcial | `01_Acta_Inicio_Proyecto.md`; falta aprobación y asignación de roles. |
| Alcance y objetivos | Cumplido | `02_Alcance_Proyecto.md`, `03_Objetivos_Proyecto.md`. |
| Propietarios y aprobadores | Parcial | Marcadores visibles; responsables humanos pendientes. |
| Riesgos críticos con tratamiento | Parcial | Registro y plan existentes; dueños pendientes. |
| Índice y control de cambios | Parcial | Normalizados en esta entrega; requieren revisión humana. |

## G2 — Requisitos: Parcial

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| ERS/SRS | Cumplido | GDP-REQ-001 define alcance, contexto, capacidades y restricciones; aprobación pendiente. |
| Backlog MVP | Parcial | Los 42 RF están priorizados como Must/Should; falta documento de backlog y orden de entregas. |
| 42 RF prioritarios | Parcial | GDP-REQ-002 contiene 42 RF atómicos con trazas; requieren validación del cliente piloto y detalle contractual OpenAPI. |
| RNF medibles | Parcial | GDP-REQ-003 define 21 RNF; umbrales OPV requieren perfil y aprobación. |
| Reglas, actores, permisos y aceptación | Cumplido | GDP-REQ-004, 005 y 008 creados; revisión humana pendiente. |
| Trazabilidad | Cumplido | GDP-REQ-009 y GDP-TST-009 enlazan 42 RF con 42 CP únicos; los artefactos de caso existen. |

## G3 — Arquitectura: Cumplido documentalmente

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| ADR-011 a ADR-021 | Cumplido | Once ADR localizados y aceptados. |
| C4 contexto y contenedores | Cumplido | Vistas 03 y 04. |
| C4 componentes | Cumplido | GDP-ARQ-005 contiene nivel 3 para los seis macroservicios. |
| Dominios y propiedad de datos | Cumplido | Documentos 16 y 17. |
| Modelo de amenazas | Cumplido | GDP-ARQ-015 cubre STRIDE y 30 amenazas; tratamientos requieren prueba. |
| Eventos, consistencia y POC | Cumplido | Catálogo, estrategia GDP-ARQ-019 y plan POC existentes; la ejecución pertenece a G6/G7. |
| Trazabilidad ADR | Cumplido | GDP-ARQ-021 relaciona ADR-011..021 y documentos derivados. |

## G4 — Datos: Cumplido documentalmente

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| Modelo conceptual | Cumplido | GDP-DAT-001 representa fuentes de verdad y referencias contractuales sin base monolítica. |
| Modelo lógico inicial | Cumplido | GDP-DAT-002 separa entidades y relaciones para los seis servicios. |
| Entidades por servicio | Cumplido | GDP-DAT-006 identifica propietario, tenancy, PII, retención, auditoría y RLS. |
| Diagramas ER | Cumplido | GDP-DAT-004 contiene seis diagramas independientes. |
| Multitenancy y RLS | Cumplido | GDP-DAT-015 define contexto fail-closed, `SET LOCAL`, roles y pruebas POC-001. |
| Reglas de integridad | Cumplido | GDP-DAT-007 define 20 invariantes locales y reconciliación DB–objeto. |
| Estrategia de migraciones | Cumplido | GDP-DAT-011 aplica node-pg-migrate, forward-only y expand-and-contract. |
| Validación ejecutable | Parcial | DDL/migraciones productivas no se generan en esta fase; POC-001/002 y G7 deben demostrar el diseño. |

## G5 — Contratos: Cumplido documentalmente

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| Convenciones API | Cumplido | GDP-BE-003 define REST, contexto tenant, códigos, paginación, concurrencia y compatibilidad. |
| OpenAPI inicial válida | Cumplido | GDP-BE-004: OpenAPI 3.1, siete operaciones verticales; parseo, referencias y validación semántica correctos. |
| Problem Details | Cumplido | GDP-BE-007 y schema OpenAPI usan RFC 9457 y `application/problem+json`. |
| Catálogo de endpoints | Cumplido | GDP-BE-005 relaciona siete operaciones con servicio, RF, permiso, idempotencia y evento. |
| Autenticación/autorización | Cumplido | GDP-BE-006 aplica Keycloak, PKCE, RBAC/ABAC y autorización local. |
| Validaciones e idempotencia | Cumplido | GDP-BE-008 y GDP-BE-012 definen capas, claves y garantías síncronas/asíncronas. |
| Contratos asíncronos iniciales | Cumplido | GDP-BE-016: AsyncAPI 3.0 con seis canales/mensajes, sobre portable y referencias válidas. |
| Validación ejecutable | Parcial | Bindings físicos, contract tests y adaptadores se demuestran en G6/POC-002; no hay código productivo en esta fase. |

## G6 — Calidad y seguridad: Cumplido documentalmente

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| Estrategia y plan | Cumplido | GDP-TST-001/002 definen niveles, herramientas, ambientes, riesgos y fases. |
| Casos funcionales trazables | Cumplido | GDP-TST-003 y 009 contienen 42 RF, 42 CP únicos y cero diferencias con G2. |
| Seguridad y carga segura | Cumplido | GDP-TST-004 cubre identidad, tenant, API, multipart, cuarentena, malware, broker y telemetría. |
| Privacidad | Cumplido | GDP-TST-005 cubre consentimiento, titulares, minimización, OCR, exportación y retención pendiente. |
| Multitenancy/RLS | Cumplido | GDP-TST-014 cubre API, RLS/pool, caché, objeto, bus, búsqueda y exportación; POC-001 diseñada. |
| Backup y restore | Cumplido | GDP-TST-012/013 definen manifiesto, cifrado, recuperación aislada, integridad y medición RPO/RTO. |
| Integraciones/resiliencia | Cumplido | GDP-TST-008 cubre contratos, brokers, Keycloak, S3/MinIO y fallos; POC-002 diseñada. |
| Criterios de entrada/salida | Cumplido | GDP-TST-010 bloquea producción ante P0/P1, fuga, malware o restore fallido. |
| Ejecución y evidencia | Bloqueante para G7/producción | Todos los casos están `No ejecutado`; POC-001/002, ZAP, carga y restore requieren workspace/ambientes. |

## G7 — Baseline técnico: Bloqueante

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| Gestor de paquetes | Cumplido | pnpm 11.9.0 decidido, comprobado localmente y fijado en `packageManager`. |
| Workspace | Cumplido | 13 proyectos: raíz, ocho apps, dos packages y dos POC; sin código productivo. |
| Versiones instalables | Parcial | 649 paquetes resolvieron; Node local 24.14.0 difiere del objetivo 24.18.0 y peers requieren revisión. |
| Lockfile | Cumplido | `pnpm-lock.yaml` generado mediante `--lockfile-only`. Verificación frozen pendiente por interrupción del entorno. |
| Imágenes por digest | Bloqueante | Inventario candidato creado; digests reales no resueltos porque Docker/registry tooling no quedó disponible. |
| SBOM | Bloqueante | Comando nativo pnpm preparado; artefacto no generado por interrupción del entorno. |
| Compatibilidad | Bloqueante | No hay instalación, compilación ni pruebas; peer warnings y subdependencias deprecadas pendientes. |
| POC ejecutadas | Bloqueante | Manifests/README preparados; POC-001/002 siguen no ejecutadas. |

Evidencia y comandos de reanudación: GDP-GPR-016. Estado global G7: **Parcial, aún bloqueante**.

## Condiciones mínimas para reevaluar

1. Asignar responsables y aprobadores.
2. Completar y revisar los RF/RNF del primer flujo vertical con trazabilidad y casos de prueba.
3. Crear C4 nivel 3, STRIDE y modelo de datos por servicio.
4. Publicar OpenAPI válida y contratos asíncronos mínimos.
5. Aprobar gestor de paquetes; crear workspace y lockfile reproducible.
6. Ejecutar POC-001 y POC-002, registrar versiones, digests, resultados y excepciones.

## Fuentes

Inventario documental, ADR-011 a ADR-021, catálogo maestro del stack, plan de POC y estructura documental solicitada.

## Supuestos, decisiones y pendientes

- Supuesto: los documentos localizados representan el repositorio completo al corte.
- Decisión: las ausencias se reportan; no se simula avance con esqueletos vacíos.
- Pendiente: revisión y firma de todos los roles indicados.
- Pendiente legal: toda obligación normativa concreta requiere fuente oficial, vigencia, artículo y aplicabilidad; **Requiere validación jurídica especializada**.

## Historial de cambios

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Evaluación inicial basada en evidencia del repositorio. | Codex |
