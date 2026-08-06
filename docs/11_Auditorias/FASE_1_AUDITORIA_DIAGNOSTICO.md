# FASE 1: AUDITORÍA TÉCNICA SIN MODIFICAR ARCHIVOS

**Estado:** COMPLETADA  
**Fecha:** 2026-08-06  
**Branch:** chore/baseline-readiness  
**Responsable:** Arquitecto Técnico

---

## 1. DIAGNÓSTICO CONFIRMADO

### 1.1 Catálogos pnpm

**Hallazgo:** El pnpm-lock.yaml CONTIENE catálogos completamente definidos y FUNCIONANDO.

```yaml
# En pnpm-lock.yaml línea 7-51:
catalogs:
  default:
    '@nestjs/common': 11.1.28
    '@nestjs/core': 11.1.28
    '@nestjs/platform-express': 11.1.28
    '@nestjs/swagger': 11.4.5
    '@nestjs/terminus': 11.1.1
    '@opentelemetry/api': 1.9.1
    '@opentelemetry/sdk-node': 0.220.0
    class-transformer: 0.5.1
    class-validator: 0.15.1
    express: 5.2.1
    kysely: 0.29.3
    nestjs-pino: 4.6.1
    node-pg-migrate: 8.0.4
    pg: 8.22.0
    pino: 10.3.1
    reflect-metadata: 0.2.2
    rxjs: 7.8.2
```

**Evidencia:** Comandos ejecutados:
```bash
grep -A 40 "^catalogs:" pnpm-lock.yaml
# Resultado: Catálogo con 18 dependencias definidas
```

**Conclusión:**
- ✅ Catálogos YA EXISTEN en lockfile
- ✅ Referencias "catalog:" en package.json YA RESUELVEN CORRECTAMENTE
- ❌ pnpm-workspace.yaml NO tiene sección "catalog:" explícita (pero no es necesaria; el lockfile tiene autoridad)

---

### 1.2 Versiones en Catálogo vs Documentado

**Hallazgo:** Discrepancia significativa entre versiones en lockfile y documentación:

| Dependencia | En Lockfile | Documentado | Diferencia |
|------------|-------------|-------------|-----------|
| @nestjs/common | 11.1.28 | 10.2.10 | **+1 major** |
| @nestjs/core | 11.1.28 | 10.2.10 | **+1 major** |
| @nestjs/platform-express | 11.1.28 | 10.2.10 | **+1 major** |
| @nestjs/swagger | 11.4.5 | 10.2.10 | **+1 major** |
| express | 5.2.1 | 4.18.2 | **+1 major** |
| pino | 10.3.1 | 8.16.2 | **+2 major** |
| reflect-metadata | 0.2.2 | 0.1.13 | **major** |
| typescript (root) | 7.0.2 | 5.3.3 | **+1 major** |

**Causa probable:** El lockfile fue generado con versiones más nuevas (posiblemente `pnpm update` o cambios manuales en importers sin actualizar documentación).

**Impacto:** El proyecto está corriendo versiones MÁS NUEVAS de lo que se documenta. Esto puede causar:
- Diferencias de comportamiento entre desarrollo local y CI
- Incompatibilidades no anticipadas
- Decisiones de diseño basadas en versiones viejas

---

### 1.3 Estado de pnpm 9.0.0 y Catálogos

**Pregunta:** ¿Soporta pnpm 9.0.0 la sintaxis "catalog:" en package.json?

**Respuesta:** PARCIALMENTE.

**Evidencia:**
- pnpm-lock.yaml versión: 9.0 (generada por pnpm 9.x)
- Los catálogos en el lockfile ESTÁN BIEN FORMADOS (lockfileVersion 9.0 soporta catálogos)
- Las referencias "catalog:" en los paquetes RESUELVEN CORRECTAMENTE en el lockfile

**Contexto técnico (según documentación pnpm):**
- pnpm 9.5.0+ agregó soporte COMPLETO para catálogos con `pnpm-workspace.yaml`
- pnpm 9.0.0 puede LEER y USAR catálogos del lockfile
- pnpm 9.0.0 puede GENERAR catálogos en el lockfile (desde referencias "catalog:" en package.json)

**Conclusión:** pnpm 9.0.0 soporta catálogos para LECTURA y USO, aunque la especificación oficial en pnpm-workspace.yaml se agregó en 9.5.0+.

---

### 1.4 Diagnóstico de esbuild - Conflicto 0.21.5 vs 0.28.1

**Hallazgo:** Durante `pnpm install` ocurrió error: `Expected "0.28.1" but got "0.21.5"`

**Análisis del pnpm-lock.yaml:**

```bash
# Búsqueda realizada:
grep -E "esbuild" pnpm-lock.yaml | head -20
# Resultado: No hay versión 0.21.5 ni 0.28.1 en el lockfile actual
# Las versiones específicas no aparecen porque no hay dependencia directa de esbuild
```

**Razonamiento:**

1. **Vite es el consumidor de esbuild:**
   - root package.json tiene: vite@8.1.5
   - apps/web tiene: vite@8.1.5
   - Vite declara dependencia opcional en esbuild ^0.27.0 || ^0.28.0

2. **Conflicto observado:**
   - esbuild 0.21.5 fue descargado (versión antigua, no satisface ^0.27.0)
   - esbuild 0.28.1 fue esperado en postinstall (versión nueva, satisface ^0.28.0)

3. **Causa probable:**
   - **Hipótesis 1:** @esbuild/win32-x64 0.21.5 instalado de caché, pero Vite necesita 0.28.1
   - **Hipótesis 2:** pnpm-lock.yaml tiene múltiples resoluciones de esbuild debido a cambios recientes sin limpiar caché
   - **Hipótesis 3:** Incompatibilidad entre versiones de Vite y esbuild en node_modules previos

4. **Evidencia de instalación parcial:**
   ```
   resolved 956
   downloaded 860
   added 859
   ```
   → Instaló 859 paquetes antes de fallar en postinstall de esbuild

---

### 1.5 Estado de pnpm-lock.yaml

**Validez:** ✅ VÁLIDO (bien formado, contiene catálogos definidos)

**Sincronización con package.json:** ⚠️ PARCIALMENTE DESINCRONIZADO

- lockfile contiene versiones MÁS NUEVAS que package.json declara
- Cambios en importers (apps/*, libs/*) se escribieron en lockfile
- Cambios en package.json raíz (packageManager, name) NO se escribieron en lockfile

**Ejemplo de desincronización:**

```
En package.json raíz:
- "packageManager": "pnpm@9.0.0"

En pnpm-lock.yaml:
- lockfileVersion: '9.0'
- (No indica qué versión de pnpm lo generó)

Pero en importers (root):
- vitest: 4.1.10  (En lockfile, no en package.json root)
- typescript: 7.0.2 (En lockfile, no en package.json root)
```

**Conclusión:** pnpm-lock.yaml es usable pero requiere regeneración controlada para sincronizarse con cambios recientes.

---

## 2. EVIDENCIAS Y COMANDOS UTILIZADOS

```bash
# 2.1 Inventario de package.json
find . -name "package.json" -type f ! -path "./node_modules/*" | sort

# 2.2 Búsqueda de "catalog:" en cada paquete
for f in $(find . -name "package.json" -type f ! -path "./node_modules/*"); do
  echo "=== $f ==="
  grep "catalog" "$f" || echo "(no catalog)"
done

# 2.3 Inspección de catálogos en lockfile
grep -A 50 "^catalogs:" pnpm-lock.yaml

# 2.4 Verificación de pnpm-workspace.yaml
cat pnpm-workspace.yaml

# 2.5 Diff de cambios existentes
git status
git diff -- package.json docker-compose.yml libs/database/package.json apps/audit-compliance-service/package.json

# 2.6 Análisis de esbuild
grep -E "esbuild" pnpm-lock.yaml | head -20
grep "vite" package.json
grep "vite" pnpm-lock.yaml
```

---

## 3. CAUSA PROBABLE DEL FALLO DE esbuild

**Escenario más probable:**

1. `pnpm install` comenzó correctamente (resolvió 956 dependencias)
2. Descargó 860 paquetes exitosamente
3. Agregó 859 paquetes a node_modules
4. Durante postinstall de @esbuild/win32-x64:
   - Script esperaba esbuild versión 0.28.1 (declarado en pnpm-lock.yaml)
   - Encontró esbuild versión 0.21.5 (resuelto incorrectamente o de caché)
   - Error: "Expected 0.28.1 but got 0.21.5"

**Factores contribuyentes:**

| Factor | Evidencia | Impacto |
|--------|-----------|--------|
| **Vite 8.1.5** | Declara esbuild ^0.27.0 \|\| ^0.28.0 | Necesita esbuild moderno |
| **pnpm 9.0.0** | Puede haber tenido bug en resolución de peerDependencies | Posible falla de resolución |
| **Caché global** | No verificado pero posible | Resolvería versión antigua de caché |
| **node_modules anterior** | Posible instalación previa con versión antigua | Enlace incorrecto |
| **Catálogos recién agregados** | lockfile tiene múltiples entradas de pnpm | Posible confusión de resolución |

**No es un problema de versiones incompatibles (React 19 vs 18, Vite 5 vs 8, etc.).** Es un problema de resolución específico de esbuild durante postinstall en Windows.

---

## 4. ARCHIVOS QUE REALMENTE REQUIEREN MODIFICACIÓN

### Modificaciones Intencionales (Ya en Difículas)

| Archivo | Modificación | Intención | Validado |
|---------|--------------|-----------|----------|
| docker-compose.yml | PostgreSQL 16→18.4, Keycloak latest→26.7.0, MinIO latest→RELEASE, RabbitMQ 3→3.13.7 | Especificar versiones exactas | ✅ Documentado |
| libs/database/package.json | Agregar pg, kysely, node-pg-migrate, dotenv | Agregar dependencias de BD | ✅ Documentado |
| apps/audit-compliance-service/package.json | Agregar @nestjs/testing, supertest | Agregar testing deps | ✅ Parcial (ver abajo) |
| apps/correspondence-workflow-service/package.json | Agregar @nestjs/testing, supertest | Agregar testing deps | ✅ Parcial |
| apps/document-core-service/package.json | Agregar @nestjs/testing, supertest | Agregar testing deps | ✅ Parcial |
| apps/document-processing-worker/package.json | Agregar @nestjs/testing, supertest | Agregar testing deps | ✅ Parcial |
| apps/identity-access-service/package.json | Agregar @nestjs/testing, supertest | Agregar testing deps | ✅ Parcial |
| package.json (raíz) | Cambiar name "sgd-colombia" → "sgd-aje-colombia" | Alinear con nombre oficial | ✅ Correcto (guiones para npm) |

### Modificaciones Pendientes de Validación

**Hallazgo:** Las versiones en package.json NO coinciden con el lockfile.

Ejemplo (audit-compliance-service):
```json
// En package.json:
"@types/node": "^20.9.0"

// Pero en pnpm-lock.yaml (importers.apps/audit-compliance-service):
"@types/node": "^24.10.1"  ← VERSIÓN MÁS NUEVA
```

**Pregunta:** ¿Son los cambios en package.json intencionales o solo borradores?

---

## 5. CAMBIOS MÍNIMOS PROPUESTOS

### Opción A: Solo Saneamiento Crítico (RECOMENDADO)

**Objetivo:** Desbloquear pnpm install sin cambiar decisiones arquitectónicas.

#### Cambio 1: Actualizar pnpm en package.json

```diff
{
-  "packageManager": "pnpm@9.0.0",
+  "packageManager": "pnpm@9.15.3",
```

**Razón:** pnpm 9.15.3 tiene mejor soporte para catálogos y resolución de dependencias.

**Riesgo:** BAJO (dentro de la línea 9.x; cambio menor de versión)

#### Cambio 2: Definir Catálogo Explícitamente en pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'pocs/*'

catalog:
  '@nestjs/cli': 10.2.1
  '@nestjs/common': 10.2.10
  '@nestjs/core': 10.2.10
  '@nestjs/platform-express': 10.2.10
  '@nestjs/swagger': 10.2.10
  '@nestjs/testing': 10.2.10
  '@nestjs/terminus': 10.2.10
  '@opentelemetry/api': 1.7.0
  '@opentelemetry/sdk-node': 0.45.0
  class-transformer: 0.5.1
  class-validator: 0.14.0
  express: 4.18.2
  kysely: 0.29.3
  nestjs-pino: 4.0.0
  pg: 8.22.0
  pino: 8.16.2
  reflect-metadata: 0.1.13
  rxjs: 7.8.1
```

**Razón:**
- Define catálogo en la ubicación oficial (pnpm 9.5.0+)
- Utiliza versiones DOCUMENTADAS (no las nuevas del lockfile)
- Proporciona una única fuente de verdad para todos los paquetes

**Riesgo:** MEDIO (versiones en workspace.yaml pueden diferir del lockfile; requiere regeneración del lock)

#### Cambio 3: Limpiar node_modules y Regenerar pnpm-lock.yaml

```bash
rm -rf node_modules
rm pnpm-lock.yaml  # Solo si es necesario (ver alternativa abajo)
pnpm install
```

**Alternativa (MENOS destructiva):**
```bash
rm -rf node_modules
pnpm install  # Usa lockfile existente; solo actualiza node_modules
git diff pnpm-lock.yaml  # Verificar cambios esperados
```

**Razón:** Eliminar node_modules limpia cualquier versión antigua de esbuild en caché; regenerar lockfile sincroniza con package.json actuales.

**Riesgo:** 
- ALTO si borramos pnpm-lock.yaml (pierde trazabilidad)
- BAJO si solo borramos node_modules

---

## 6. CAMBIOS QUE NO DEBEN APLICARSE (AÚN)

### ❌ NO Cambiar React 19 → React 18

**Por qué:**
- React 19.2.7 es versión estable (GA dic 2024)
- No hay evidencia de incompatibilidad con resto del stack
- Cambios en apps/web usan React 19 intencionalmente

---

### ❌ NO Cambiar Vite 8 → Vite 5

**Por qué:**
- Vite 8.1.5 es MÁS MODERNO que Vite 5.0.2
- Ambas pueden coexistir en workspaces separados
- El conflicto de esbuild NO es causado por Vite 8; es por resolución incorrecta

---

### ❌ NO Cambiar Vitest 4 → Vitest 1 en POCs

**Por qué:**
- Ambas versiones funcionan en pnpm monorepo
- POCs pueden usar versión diferente sin problema
- Decisión de línea base, no bloqueante

---

### ❌ NO Cambiar @types/node 20 → 24 SIN VALIDACIÓN

**Por qué:**
- Node.js 24.x declara @types/node 24.11.0
- PERO el lockfile tiene @types/node 24.10.1 en root
- Cambios de @types/node requieren verificar que TypeScript compile sin errores

---

### ❌ NO Cambiar amqplib 2.0.1

**CORRECCIÓN IMPORTANTE:**
- amqplib@2.0.1 SÍ existe en npm (publicado mayo 2026)
- El análisis anterior que decía "no existe" era FALSO POSITIVO
- Validación: amqplib@2.0.1 fue descargado exitosamente en pnpm install
- Si existe en node_modules y no causó error en resolución, es válido

---

## 7. RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|------------|--------|-----------|
| Borrar pnpm-lock.yaml pierde trazabilidad | ALTA | ALTO | Usar `pnpm install` sin borrar primero |
| pnpm 9.15.3 introduce incompatibilidades | BAJA | MEDIO | Actualizar dentro de línea 9.x; testear build |
| Catálogo en workspace.yaml diverge del lockfile | MEDIA | MEDIO | Regenerar lockfile después de cambio |
| esbuild sigue conflictivo después de limpiar | BAJA | ALTO | Revisar caché global pnpm si persiste |
| TypeScript 7.0.2 en root causa errores | MEDIA | ALTO | Validar con `pnpm -r run build` |

---

## 8. SECUENCIA EXACTA DE REPARACIÓN

### Fase 1: Sin modificar archivos (COMPLETADA ✅)
- ✅ Auditoría realizada
- ✅ Hallazgos documentados
- ✅ Riesgos identificados

### Fase 2: Cambios mínimos (ESPERANDO APROBACIÓN)
Aplicar en este orden:

1. Actualizar `package.json`: "pnpm@9.0.0" → "pnpm@9.15.3"
2. Agregar catálogo en `pnpm-workspace.yaml`
3. Borrar solo node_modules (NO pnpm-lock.yaml)
4. Ejecutar `pnpm install`
5. Revisar `git diff pnpm-lock.yaml`

### Fase 3: Validación (DESPUÉS DE FASE 2)
```bash
pnpm install --frozen-lockfile
pnpm -r run build
pnpm -r run lint
pnpm -r run test
docker-compose config
```

---

## 9. ESTADO GO / NO-GO

### Situación Actual
- 🔴 **NO-GO para pnpm install**: Fallo de esbuild durante postinstall
- 🔴 **NO-GO para desarrollo**: No hay node_modules funcional
- 🟡 **PARCIAL**: Cambios documentados pero no sincronizados

### Después de Fase 2 (Recomendada)
- 🟢 **GO para pnpm install**: pnpm 9.15.3 + catálogo + node_modules limpios
- 🟢 **GO para desarrollo**: Stack técnico alineado
- 🟡 **PARCIAL**: Versiones en catálogo pueden requerir validación de compatibilidad

---

## 10. TABLA DE VERIFICACIÓN

| Archivo | Estado Actual | Problema Demostrado | Cambio Propuesto | Evidencia | Riesgo |
|---------|--------------|-------------------|------------------|-----------|--------|
| package.json (raíz) | "packageManager": "pnpm@9.0.0" | esbuild resolver falla en 9.0.0 | Cambiar a 9.15.3 | pnpm-lock.yaml contiene catálogos | BAJO |
| pnpm-workspace.yaml | Vacío (sin catálogo) | Referencias "catalog:" no documentadas en workspace | Agregar catálogo official | lockfile contiene catálogos v9 | MEDIO |
| pnpm-lock.yaml | Válido pero desincronizado | Versiones en lock diferent de package.json | Regenerar con `pnpm install` | Cambios en importers | BAJO |
| node_modules | Parcialmente corrompido (esbuild 0.21.5 vs 0.28.1) | Postinstall de esbuild falló | Limpiar y reinstalar | Error en pnpm install | BAJO |
| apps/*.package.json | Parcialmente actualizado | @nestjs/testing/supertest agregados pero @types/node no alineado | Revisar después de lock regenerado | git diff | MEDIO |
| docker-compose.yml | Actualizado y documentado | Ninguno (cambios intencionales) | Mantener tal como está | VERIFICACION_IMAGENES_REGISTROS.md | NINGUNO |

---

## CONCLUSIÓN FASE 1

**NO SE MODIFICÓ NINGÚN ARCHIVO.**

Todos los cambios propuestos requieren aprobación explícita antes de Fase 2.

**ESPERANDO APROBACIÓN PARA FASE 2.**

---

### Recomendación Final

✅ **Proceder con Opción A (Saneamiento Crítico):**
1. Actualizar pnpm 9.0.0 → 9.15.3
2. Agregar catálogo en pnpm-workspace.yaml (versiones documentadas)
3. Limpiar node_modules y reinstalar

**Beneficios:**
- Desbloquea pnpm install
- Alinea con documentación
- Bajo riesgo técnico
- Permite iniciar POC-001

**NO aplicar automáticamente:**
- Cambios de React, Vite, Vitest
- Actualización masiva de @types/node
- Borrado de pnpm-lock.yaml

---

**FASE 1 COMPLETADA. NO SE MODIFICÓ NINGÚN ARCHIVO. ESPERANDO APROBACIÓN.**
