# 📊 Matriz de Hallazgos Clasificados - Análisis Corregido

**Estado:** REVISADO Y CORREGIDO  
**Fecha:** 2026-08-06  
**Criterios de clasificación:** Basados en impacto real, no en uniformidad estética

---

## 🔴 BLOQUEANTES CONFIRMADOS

Estos hallazgos impiden que `pnpm install` o las compilaciones funcionen ahora mismo.

### 1. Catálogo pnpm sin definición en pnpm-workspace.yaml

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | 7 paquetes usan `catalog:` en dependencias pero pnpm-workspace.yaml no tiene sección `catalog:` |
| **Workspaces afectados** | apps/api-gateway, pocs/poc-001-multitenancy, pocs/poc-002-document-pipeline |
| **Impacto** | `pnpm install` falla con error de resolución |
| **Severidad** | 🔴 CRÍTICA |
| **Acción** | Agregar catálogo en pnpm-workspace.yaml (ver CAMBIOS_DEFINITIVOS_MINIMOS.md) |
| **Nota** | No es un "error" que todos usen catalog:; es el diseño correcto. El error es que no existe la definición. |

---

### 2. amqplib 2.0.1 no existe en npm

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | pocs/poc-002-document-pipeline especifica "amqplib": "2.0.1" |
| **Problema** | Versión 2.0.1 no existe en npm registry (máximo es 0.10.5) |
| **Impacto** | `pnpm install` falla; POC-002 no puede levantarse |
| **Severidad** | 🔴 CRÍTICA |
| **Acción** | Cambiar a "^0.10.5" (última estable verificada) |
| **Nota** | Probablemente fue error de copia/tipeo al documentar la versión |

---

### 3. esbuild versión desincronizada durante postinstall

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | Historial de instalación muestra: "Expected "0.28.1" but got "0.21.5"" |
| **Problema** | Incompatibilidad entre versión esperada de esbuild y la resuelta |
| **Impacto** | Fallos en compilación/transpilación durante `pnpm install` o `pnpm build` |
| **Severidad** | 🔴 CRÍTICA |
| **Acción** | Investigar y limpiar pnpm-lock.yaml, luego reinstalar; verificar overrides en pnpm-workspace.yaml si es necesario |
| **Nota** | No es problema de "Vite 5 vs Vite 8"; es transitividad de dependencias de esbuild |

---

### 4. pnpm-lock.yaml desincronizado o corrupto

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | `pnpm-lock.yaml` no refleja estado consistente de las dependencias declaradas |
| **Impacto** | Instalaciones no reproducibles; cambios inesperados en node_modules |
| **Severidad** | 🔴 CRÍTICA |
| **Acción** | Eliminar pnpm-lock.yaml y regenerar: `rm pnpm-lock.yaml && pnpm install` |
| **Nota** | Debe validarse que `git diff pnpm-lock.yaml` muestre solo cambios esperados |

---

## 🟠 INCONSISTENCIAS DE LÍNEA BASE

Estos hallazgos representan desviaciones de la línea tecnológica establecida, pero no son bloqueantes si cada workspace es independiente.

### 5. @types/node 20.9.0 en 5 microservicios con Node.js 24.x

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | audit-compliance, correspondence-workflow, document-core, document-processing, identity-access usan @types/node@^20.9.0 |
| **Contexto** | Node.js declarado es 24.x LTS; @types/node@20.x corresponde a Node 20.x |
| **Impacto** | Falta de tipos para APIs nuevas de Node 24; posibles falsos negativos en TypeScript |
| **Severidad** | 🟠 MEDIA (inconsistencia, no bloqueante) |
| **Acción** | Cambiar a @types/node@^24.11.0 en esos 5 servicios |
| **Nota** | No impide instalación ni compilación, pero reduce calidad de types |

---

### 6. vitest 4.1.10 en 2 POCs; vitest 1.0.4 en apps/libs

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | pocs/poc-001, pocs/poc-002 usan vitest@4.1.10; resto usa vitest@1.0.4 |
| **Contexto** | Ambas versiones son estables (4.1.10 es más reciente) |
| **Impacto** | Diferentes APIs y comportamientos de test; equipo desarrolla en versiones distintas |
| **Severidad** | 🟠 MEDIA (inconsistencia, no bloqueante) |
| **Acción** | Decisión arquitectónica: elegir una versión unificada o documentar por qué coexisten |
| **Nota** | Las dos versiones pueden instalarse simultáneamente en pnpm; no causa conflicto automático |

---

### 7. Versiones de React: 18.2.0 en frontend vs 19.2.7 en web

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | apps/frontend usa React 18.2.0; apps/web usa React 19.2.7 |
| **Contexto** | Ambas son estables (19 GA desde dic 2024; 19.2.7 es versión actual) |
| **Impacto** | Si comparten componentes: incompatibilidad; si son aisladas: sin impacto |
| **Severidad** | 🟠 MEDIA (depende de arquitectura) |
| **Acción** | Verificar si hay compartición de componentes entre frontend y web; de no haberla, mantener ambas |
| **Nota** | NO es justificación para degradar 19 a 18; ambas son válidas |

---

### 8. Vite 5.0.2 en frontend vs 8.1.5 en web

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | apps/frontend usa Vite 5.0.2; apps/web usa Vite 8.1.5 |
| **Contexto** | Vite 8 es POSTERIOR a Vite 5 (8 es más moderno); ambas estables |
| **Impacto** | Si comparten estructura de build: inconsistencia; en workspaces aisladas: sin impacto |
| **Severidad** | 🟠 MEDIA (depende de arquitectura) |
| **Acción** | Verificar si comparten configuración; si no, considerar actualizar frontend a Vite 8 EN FUTURO (no degradar web) |
| **Nota** | Proponer bajar Vite 8→5 es regresión técnica; lo correcto es evaluar subir 5→8 |

---

## 🟡 DECISIONES ARQUITECTÓNICAS

Estos hallazgos son diferencias de versión que reflejan decisiones de diseño válidas en un monorepo con workspaces.

### 9. Versiones exactas sin rango de actualización

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | apps/web especifica versiones exactas: "react": "19.2.7", no "^19.2.7" |
| **Contexto** | Semver se respeta (19.2.7 ES semver); lo que falta es la caret (^) |
| **Impacto** | Reproducibilidad estricta; requiere actualización manual explícita |
| **Severidad** | ⚪ NEUTRAL (es decisión de política de versioning) |
| **Acción** | Documentar decisión: ¿versiones exactas para reproducibilidad? ¿o rangos para flexibilidad? |
| **Nota** | No es "error"; es patrón válido en algunos equipos |

---

### 10. Versiones de dependencias de testing dispersas

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | testcontainers exacto en POCs (12.0.4); ausente en libs/testing |
| **Contexto** | Cada workspace declara sus propias devDependencies |
| **Impacto** | Diferentes estrategias de testing por workspace (posible intención) |
| **Severidad** | ⚪ NEUTRAL (depende de alcance) |
| **Acción** | Documentar estrategia de testing por workspace o centralizar en libs/testing |
| **Nota** | No es inconsistencia automáticamente mala; puede reflejar necesidades diferentes |

---

## 💚 MEJORAS NO BLOQUEANTES

Estos hallazgos son oportunidades de mejora que NO impiden desarrollo actual.

### 11. DevDependencies incompletas en algunos workspaces

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | apps/frontend, apps/web, libs/testing no tienen @types/node explícito |
| **Contexto** | @types/node es necesario si el workspace compila TypeScript que usa APIs de Node |
| **Impacto** | Si el workspace es frontend browser puro: bajo impacto; si importa procesos Node: requiere @types/node |
| **Severidad** | 💚 BAJA (mejora, no bloqueante) |
| **Acción** | Agregar si se verifica que se necesita; de otra forma, no es obligatorio |
| **Nota** | Frontend browser no siempre necesita @types/node; depende de la configuración tsconfig |

---

### 12. ESLint no declarado en apps/frontend y apps/web

| Aspecto | Detalle |
|---------|---------|
| **Hallazgo** | Estos workspaces no tienen eslint en devDependencies |
| **Impacto** | No se pueden ejecutar scripts `lint` si existen |
| **Severidad** | 💚 BAJA (es mejora de DX, no bloqueante) |
| **Acción** | Agregar si hay configuración .eslintrc definida |
| **Nota** | No es error; es falta de declaración de herramientas de desarrollo |

---

## ❌ FALSOS POSITIVOS (Errores en mi análisis)

### 13. "7 workspaces usan catalog: sin catálogo" → FALSO

**Lo que asevera mi análisis:** Los 7 workspaces que usan catalog: fallarán.

**La verdad:** Si pnpm-workspace.yaml tiene `catalog:` definido (lo cual vamos a hacer), todos resuelven correctamente.

**Acción:** No es un hallazgo; es un TODO pendiente de implementación.

---

### 14. "React 19 es incompatible con React 18" → FALSO

**Lo que asevera mi análisis:** Hay incompatibilidad automática.

**La verdad:** Son versiones distintas que pueden coexistir en apps separadas sin problema, a menos que compartan componentes.

**Acción:** Requiere análisis de dependencias compartidas, no decisión automática de degradación.

---

### 15. "Vitest 4 vs Vitest 1 causa incompatibilidad" → FALSO

**Lo que asevera mi análisis:** 2 major versions de diferencia = bloqueante.

**La verdad:** Ambas pueden coexistir en workspaces separados sin conflicto automático.

**Acción:** Es inconsistencia de línea base, no bloqueante.

---

## 📋 Tabla Resumida

| ID | Hallazgo | Categoría | Acción | Bloquea Ahora |
|----|----------|-----------|--------|---------------|
| 1 | catalog: sin definición | BLOQUEANTE | Agregar en pnpm-workspace.yaml | **SÍ** |
| 2 | amqplib 2.0.1 inexistente | BLOQUEANTE | Cambiar a 0.10.5 | **SÍ** |
| 3 | esbuild 0.28.1 vs 0.21.5 | BLOQUEANTE | Limpiar lock y reinstalar | **SÍ** |
| 4 | pnpm-lock.yaml desincronizado | BLOQUEANTE | Regenerar | **SÍ** |
| 5 | @types/node 20 en Node 24 | INCONSISTENCIA | Actualizar a 24.11.0 | NO |
| 6 | vitest 4 vs 1 | INCONSISTENCIA | Decidir versión unificada | NO |
| 7 | React 18 vs 19 | DECISIÓN ARQUITECTÓNICA | Verificar compartición de componentes | NO |
| 8 | Vite 5 vs 8 | DECISIÓN ARQUITECTÓNICA | Mantener; evaluar subida de 5→8 futuro | NO |
| 9 | Versiones exactas sin ^ | DECISIÓN ARQUITECTÓNICA | Documentar política | NO |
| 10 | Testing disperso | DECISIÓN ARQUITECTÓNICA | Documentar estrategia | NO |
| 11 | @types/node faltante | MEJORA | Agregar si necesario | NO |
| 12 | ESLint no declarado | MEJORA | Agregar si hay config | NO |

---

## ✅ Plan Corregido

### Fase 1: Resolver Bloqueantes (Ahora)
1. Agregar catálogo en pnpm-workspace.yaml
2. Cambiar amqplib 2.0.1 → 0.10.5
3. Limpiar y regenerar pnpm-lock.yaml
4. Ejecutar `pnpm install`

### Fase 2: Alinear Línea Base (Después)
5. Actualizar @types/node en 5 microservicios
6. Decidir versión de vitest (4.1 o 1.0)
7. Documentar decisión sobre React y Vite

### Fase 3: Mejorar DX (Futuro)
8. Agregar @types/node si es necesario en frontends
9. Agregar eslint si hay configuración

---

## Conclusión

**Hallazgos reales:** 12 (4 bloqueantes, 6 de línea base, 2 de mejora)  
**Cambios obligatorios:** 4  
**Cambios recomendados:** 6  
**Cambios opcionales:** 2

**Estado actual:** 🔴 BLOQUEADO por catálogo + amqplib + esbuild  
**Después de Fase 1:** 🟢 APTO para POC-001  
**Después de Fase 2:** 🟢 LÍNEA BASE ALINEADA

---

## Hallazgos POC-002 — PR Readiness

### MIG-TOPO-001 — Cadenas de migración divergentes

| Aspecto | Detalle |
|---|---|
| ID | MIG-TOPO-001 |
| Fecha de detección | 2026-08-20 |
| Ámbito | POC-002 / PostgreSQL / propiedad de datos / migraciones |
| Hallazgo | Coexisten una cadena raíz combinada y cadenas separadas para document-core y processing. Fueron creadas inicialmente en el mismo commit pero evolucionaron de forma distinta. |
| Regla afectada | ADR-011 y ADR-015: propiedad exclusiva de datos y migraciones por servicio. GDP-DAT-002: referencias externas sin FK entre servicios. |
| Evidencia | El entorno validado utiliza sgd_poc_document_core y sgd_poc_processing por separado. Las cadenas por servicio reproducen ese modelo. La cadena raíz no contiene toda la evolución actual de processing_jobs ni la coordinación claim/lease del outbox. |
| Impacto | Ejecutar la cadena raíz puede producir un esquema diferente del validado por POC-002 y reintroducir drift o acoplamiento entre dominios. |
| Severidad | BLOQUEANTE PARA PR |
| Estado | CERRADO — documentación, limpieza técnica y reconstrucción limpia validadas. |
| Decisión aplicada | Las únicas cadenas canónicas del POC-002 son migrations/document-core/ y migrations/processing/. |
| Tratamiento | COMPLETADO: se retiraron las tres migraciones raíz obsoletas y se reconstruyeron bases temporales limpias usando exclusivamente document-core 001→002 y processing 001→004. |
| Criterio de cierre | CUMPLIDO: documentación revisada; migraciones raíz retiradas; document-core y processing reconstruidas desde cero; tablas, columnas, constraints e índices iguales a live; ausencia de FK cruzada; git diff --check PASS; bases temporales eliminadas. |
| Relacionado | ADR-011, ADR-015, GDP-DAT-002, GDP-DAT-011, POC-002 |
| Nota | El commit de9f413 cierra OUTBOX-PUB-001, pero no cierra MIG-TOPO-001. |

MIG-TOPO-001 no introduce una nueva decisión arquitectónica. Registra un incumplimiento detectado respecto de decisiones ya aprobadas y establece evidencia verificable para su cierre.

Evidencia de cierre 2026-08-20: reconstrucción limpia de sgd_poc_mig_topo_001_doc y sgd_poc_mig_topo_001_proc; topología, columnas, constraints e índices equivalentes a las bases live; processing_jobs conserva únicamente FK interna processing_jobs_source_message_fk; policy_version=text; target_object_ref=text NOT NULL; claim/lease completo en ambos outbox; bases temporales eliminadas al finalizar.
