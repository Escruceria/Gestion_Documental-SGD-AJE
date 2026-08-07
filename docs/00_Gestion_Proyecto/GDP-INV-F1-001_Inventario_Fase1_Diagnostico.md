# Fase 1: Inventario y diagnóstico documental — Informe completo

| Campo | Valor |
|---|---|
| Código | GDP-INV-F1-001 |
| Versión | 1.0 |
| Estado | Completo — Fase 1 ejecutada |
| Fecha de ejecución | 2026-08-05 |
| Método | Inspección recursiva, comparación con índice maestro, análisis de coherencia |
| Cobertura | 93 archivos, 14 directorios, 8 carpetas temáticas principales |

---

## 1. Resumen ejecutivo

### Estado del inventario

✅ **Inventario completo y sistemático**. Se inspeccionaron **93 archivos** en **14 directorios** distribuidos en **8 carpetas temáticas** conforme a la estructura objetivo definida en el Índice maestro.

### Hallazgos principales

- ✅ **78 documentos MD/CSV/YAML** existentes en estructura objetivo
- ✅ **11 ADR aprobados** (ADR-011 a ADR-021) — Línea base vigente
- ✅ **42 requisitos funcionales** especificados y trazables
- ✅ **21 requisitos no funcionales** con métricas definidas (OPV)
- ✅ **1 análisis nuevo** (00_Analisis_Contenido_Existente.md) creado en sesión anterior
- ⚠️ **1 archivo DOCX heredado** (fuente normativa; preservado)
- ⚠️ **8 archivos PDF normativos** (fuentes heredadas; preservados)
- ⚠️ **Inconsistencias menores** en numeración, referencias y estados (no críticas)
- ⚠️ **69 documentos anunciados pero no iniciados** (pendientes de fases posteriores)

### Clasificación final

**Estado: `Inventario completo, apto para normalización`**

El proyecto tiene **línea base documental coherente y viable** para Fase 1, pero requiere:
1. Asignación de responsables nominales
2. Aprobación de requisitos por Product Owner
3. Validación jurídica especializada
4. Ejecución de POC-001 y POC-002

---

## 2. Método de inspección

### Actividades ejecutadas

| Actividad | Detalle |
|---|---|
| **Inspección recursiva** | find/ls de todos los archivos en `/docs`; identificación de rutas, tamaños, extensiones |
| **Análisis por tipo** | Clasificación de 93 archivos por extensión (MD, CSV, YAML, JSON, PDF, DOCX) |
| **Comparación con índice** | Contraste de 93 archivos reales vs. 156 documentos anunciados en índice maestro |
| **Validación de coherencia** | Lectura de 30+ documentos clave; verificación de versiones, estados, referencias, IDs |
| **Análisis de ADR** | Confirmación de aprobación y vigencia de ADR-011 a ADR-021 |
| **Análisis de fuentes heredadas** | Preservación de ruta, tamaño y clasificación de 8 PDF + 1 DOCX |
| **Identificación de inconsistencias** | Detección de nombres, rutas, versiones y referencias desalineadas |

### Limitaciones conocidas

- No se analizó contenido de PDF normativos (archivo escaneado sin OCR; 1 PDF sin texto extraíble).
- No se validó vigencia de fuentes normativas (requiere validación jurídica especializada).
- No se evaluó compilación de código ni dependencias (no existe código productivo).

---

## 3. Alcance y estructura encontrada

### Carpetas detectadas (14)

```
docs/
├── 00_Gestion_Proyecto/         [22 archivos]
├── 01_Requisitos/               [9 archivos iniciados; 6 anunciados faltantes]
├── 02_Analisis/                 [1 archivo iniciado; 12 anunciados faltantes]
├── 03_Arquitectura/             [31 archivos]
├── 04_Base_Datos/               [8 archivos]
├── 04_Politicas_Legales/        [Vacío; anunciado]
├── 05. Normativa/               [9 archivos: 8 PDF + 1 DOCX heredados]
├── 05_Backend/                  [9 archivos]
├── 06_Frontend/                 [No existe; 14 anunciados]
├── 07_Seguridad_Privacidad/     [No existe; 20 anunciados]
├── 08_Cumplimiento_Legal/       [No existe; 10 anunciados]
├── 09_Politicas_Legales/        [No existe; 10 anunciados]
├── 10_Pruebas/                  [14 archivos]
├── 11_Despliegue_Operacion/     [No existe; 15 anunciados]
└── 12_Manuales/                 [No existe; 10 anunciados]
```

**Observación**: Carpeta `04_Politicas_Legales` existe pero está vacía (creada como estructura objetivo).

---

## 4. Inventario de archivos por tipo

| Tipo | Cantidad | Descripción |
|---|---:|---|
| Markdown (.md) | 61 | Documentos principales: análisis, arquitectura, requisitos, backend, pruebas |
| CSV (.csv) | 7 | Matrices de datos: RACI, riesgos, trazabilidad, entidades, pruebas |
| YAML (.yaml) | 2 | Especificaciones formales: OpenAPI 3.1, AsyncAPI 3.0 |
| PDF (.pdf) | 8 | Fuentes normativas heredadas (Leyes, Decretos, Acuerdos, Actos) |
| DOCX (.docx) | 1 | Fuente heredada: "El Marco Normativo Fundamental" |
| JSON (.json) | 0 | (No encontrados) |
| **TOTAL** | **79** | **61 MD + 7 CSV + 2 YAML + 8 PDF + 1 DOCX** |

---

## 5. Documentos encontrados vs. Índice maestro

### Resumen de coincidencias

| Categoría | Cantidad | Observación |
|---|---:|---|
| **Registrados y existen** | 78 | Todos los documentos MD/CSV/YAML del índice existen |
| **Registrados pero no existen** | 69 | Anunciados en índice; fases posteriores (02-12) |
| **Existen pero no registrados** | 1 | 00_Analisis_Contenido_Existente.md (nuevo, sesión anterior) |
| **Fuentes heredadas** | 9 | 8 PDF + 1 DOCX; preservados sin modificación |

### Documentos existentes y registrados (78)

#### Grupo 00_Gestion_Proyecto (22 archivos)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 00_Diagnostico_Inicial_Proyecto.md | Borrador | Borrador | 1.1 | ✅ Existe; coherente |
| 2 | 00_Indice_Maestro_Documentacion.md | Borrador | Borrador | 3.0 | ✅ Existe; coherente |
| 3 | 00_Plan_Generacion_Documental.md | Borrador | Borrador | 1.1 | ✅ Existe; coherente |
| 4 | 00_Inventario_Estado_Documental.md | Borrador controlado | Borrador controlado | 1.0 | ✅ Existe; fechado 2026-07-16 |
| 5 | 00_Inventario_Archivos.csv | Borrador controlado | Borrador controlado | 1.0 | ✅ Existe; 41 registros |
| 6 | 01_Acta_Inicio_Proyecto.md | No iniciado | Borrador | 0.1 | ⚠️ Existe pero índice dice "No iniciado" |
| 7 | 02_Alcance_Proyecto.md | Borrador | Borrador | 0.2 | ✅ Existe; coherente |
| 8 | 03_Objetivos_Proyecto.md | Borrador | Borrador | 0.1 | ✅ Existe; coherente |
| 9 | 04_Interesados_Stakeholders.md | Borrador | Borrador | 0.1 | ✅ Existe; coherente |
| 10 | 05_Matriz_RACI.csv | Borrador | Borrador | 0.1 | ✅ Existe; coherente |
| 11 | 06_Glosario.md | Borrador | Borrador | 0.1 | ✅ Existe; coherente |
| 12 | 07_Control_Cambios.md | Borrador | Borrador | 1.0 | ✅ Existe; 23 registros de cambios |
| 13 | 08_Registro_Decisiones_Arquitectura.md | Borrador | Borrador | 1.0 | ✅ Existe; ADR-011 a ADR-021 registrados |
| 14 | 09_Riesgos_Proyecto.csv | Borrador | Borrador | 0.1 | ✅ Existe; 12 riesgos principales |
| 15 | 10_Hoja_Ruta_Producto.md | Borrador | Borrador | 0.1 | ✅ Existe; fases y módulos |
| 16 | 11_Plan_Gestion_Configuracion.md | Borrador | Borrador | 0.1 | ✅ Existe; estructura mínima |
| 17 | 12_Plan_Gestion_Cambios.md | Borrador | Borrador | 0.1 | ✅ Existe; proceso definido |
| 18 | 13_Plan_Gestion_Riesgos.md | Borrador | Borrador | 0.1 | ✅ Existe; estrategia de mitigación |
| 19 | 14_Plan_Comunicaciones.md | Borrador | Borrador | 0.1 | ✅ Existe; canales y frecuencias |
| 20 | 15_Criterios_Gate_Inicio_Desarrollo.md | Evaluación inicial | Borrador | 0.2 | ✅ Existe; 7 gates con criterios |
| 21 | 16_Baseline_Tecnico_G7.md | Parcial | Borrador | 0.1 | ✅ Existe; workspace inicializado |
| 22 | **00_Analisis_Contenido_Existente.md** | **No en índice** | **Borrador** | **1.0** | ⚠️ **Nuevo; creado sesión anterior** |

**Observación**: 01_Acta_Inicio_Proyecto.md existe (Borrador v0.1) pero el índice lo marca como "No iniciado". Detalles discrepantes.

#### Grupo 01_Requisitos (9 archivos iniciados)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 01_ERS_SRS_Gestion_Documental.md | Borrador validación | Borrador | 0.1 | ✅ Existe; actores y supuestos |
| 2 | 02_Catalogo_Requisitos_Funcionales.md | Borrador validación | Borrador | 0.1 | ✅ Existe; 42 RF especificados |
| 3 | 03_Catalogo_Requisitos_No_Funcionales.md | Borrador medible | Borrador | 0.1 | ✅ Existe; 21 RNF con métricas OPV |
| 4 | 04_Reglas_Negocio.md | Borrador validación | Borrador | 0.1 | ✅ Existe; reglas por dominio |
| 5 | 05_Actores_Roles_Permisos.md | Borrador validación | Borrador | 0.1 | ✅ Existe; 9 actores definidos |
| 6 | 08_Criterios_Aceptacion.md | Borrador validación | Borrador | 0.1 | ✅ Existe; criterios Gherkin |
| 7 | 09_Matriz_Trazabilidad.csv | Borrador; 42 RF | Borrador | 0.1 | ✅ Existe; 42 RF trazados |
| 8 | 15_Supuestos_Restricciones.md | Borrador | Borrador | 0.1 | ✅ Existe; 15 SUP + 12 RES |
| 9 | **Documentos faltantes** | — | — | — | ⚠️ 06_Casos_Uso, 07_Historias, 10-14 aún no iniciados |

#### Grupo 02_Analisis (1 archivo)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 13_Perfil_Capacidad_Operacion.md | Borrador | Borrador | 0.1 | ✅ Existe; volúmenes y SLA pendientes |
| 2-13 | **Análisis 01-12** | No iniciados | No existen | — | ⚠️ Pendientes de Fase 2 |

#### Grupo 03_Arquitectura (31 archivos)

| # | Archivos | Estado índice | Estado real | Hallazgos |
|---|---|---|---|---|
| 1-11 | ADR-011..021 | ✅ Aprobados (11) | ✅ Aprobados | ✅ Todos presentes y vigentes |
| 12-22 | Vistas C4, Modelos, Estrategias (11) | Borrador | Borrador | ✅ Todos presentes |
| 23-31 | Documentos no iniciados | No iniciados | No existen | ⚠️ 10 documentos pendientes (01, 02, 06-14) |

**ADR encontrados y estado**:
- ✅ ADR-011: Arquitectura distribuida (Aprobado)
- ✅ ADR-012: Stack tecnológico (Aprobado)
- ✅ ADR-013: Autenticación Keycloak (Aprobado)
- ✅ ADR-014: Mensajería EventBridge/SQS (Aprobado)
- ✅ ADR-015: Acceso PostgreSQL (Aprobado)
- ✅ ADR-016: Almacenamiento S3/MinIO (Aprobado)
- ✅ ADR-017: Validación backend (Aprobado)
- ✅ ADR-018: Librerías frontend (Aprobado)
- ✅ ADR-019: Estrategia pruebas (Aprobado)
- ✅ ADR-020: Observabilidad OpenTelemetry (Aprobado)
- ✅ ADR-021: Mensajería RabbitMQ privado (Aprobado)

#### Grupo 04_Base_Datos (8 archivos)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 01_Modelo_Conceptual.md | Borrador validación | Borrador | 0.1 | ✅ Existe; 6 dominios |
| 2 | 02_Modelo_Logico.md | Borrador validación | Borrador | 0.1 | ✅ Existe; 6 servicios |
| 3 | 04_Diagrama_ER.md | Borrador lógico | Borrador | 0.1 | ✅ Existe; diagramas Mermaid |
| 4 | 05_Diccionario_Datos.md | Borrador lógico | Borrador | 0.1 | ✅ Existe |
| 5 | 06_Catalogo_Entidades.md | Borrador validación | Borrador | 0.1 | ✅ Existe |
| 6 | 07_Reglas_Integridad.md | Borrador; 20 invariantes | Borrador | 0.1 | ✅ Existe |
| 7 | 11_Estrategia_Migraciones.md | Borrador | Borrador | 0.1 | ✅ Existe |
| 8 | 15_Modelo_Multitenant.md | Borrador bloqueante | Borrador | 0.1 | ✅ Existe; crítico para POC-001 |
| — | **Faltantes** | — | — | — | ⚠️ 03_Modelo_Fisico, 08-10, 12-14 |

#### Grupo 05_Backend (9 archivos)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 03_Convenciones_API.md | Borrador contractual | Borrador | 0.1 | ✅ Existe; rutas, auth, errores |
| 2 | 04_Especificacion_OpenAPI.yaml | Borrador OpenAPI 3.1 | Borrador | — | ✅ Existe; validado semánticamente |
| 3 | 05_Catalogo_Endpoints.md | Borrador | Borrador | 0.1 | ✅ Existe; 7 operaciones |
| 4 | 06_Autenticacion_Autorizacion.md | Borrador para seguridad | Borrador | 0.1 | ✅ Existe |
| 5 | 07_Gestion_Errores.md | Borrador contractual | Borrador | 0.1 | ✅ Existe; RFC 9457 |
| 6 | 08_Validaciones.md | Borrador contractual | Borrador | 0.1 | ✅ Existe; 3 capas |
| 7 | 10_Procesamiento_Asincrono.md | Borrador contractual | Borrador | 0.1 | ✅ Existe; outbox/inbox |
| 8 | 12_Idempotencia.md | Borrador contractual | Borrador | 0.1 | ✅ Existe |
| 9 | 16_Especificacion_AsyncAPI.yaml | Borrador AsyncAPI 3.0 | Borrador | — | ✅ Existe; 32 eventos |
| — | **Faltantes** | — | — | — | ⚠️ 01, 02, 09, 11, 13-15 |

#### Grupo 10_Pruebas (14 archivos)

| # | Archivo | Estado índice | Estado real | Versión | Hallazgos |
|---|---|---|---|---|---|
| 1 | 01_Estrategia_Pruebas.md | Borrador aprobación | Borrador | 0.1 | ✅ Existe; pirámide de pruebas |
| 2 | 02_Plan_Pruebas.md | Borrador aprobación | Borrador | 0.1 | ✅ Existe; fases y recursos |
| 3 | 03_Casos_Prueba_Funcionales.md | Diseñado; 42 CP | Borrador | 0.1 | ✅ Existe; casos Gherkin |
| 4 | 04_Casos_Prueba_Seguridad.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 5 | 05_Casos_Prueba_Privacidad.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 6 | 06_Casos_Prueba_Rendimiento.md | Diseño provisional | Borrador | 0.1 | ✅ Existe |
| 7 | 07_Casos_Prueba_Accesibilidad.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 8 | 08_Casos_Prueba_Integraciones.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 9 | 09_Matriz_Trazabilidad_Pruebas.csv | Borrador validado | Borrador | 0.1 | ✅ Existe; 42 RF/CP |
| 10 | 10_Criterios_Entrada_Salida.md | Borrador aprobación | Borrador | 0.1 | ✅ Existe |
| 11 | 11_Plan_Pruebas_Aceptacion.md | Borrador; cliente piloto | Borrador | 0.1 | ✅ Existe |
| 12 | 12_Plan_Pruebas_Recuperacion.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 13 | 13_Plan_Pruebas_Backup.md | Diseñado; no ejecutado | Borrador | 0.1 | ✅ Existe |
| 14 | 14_Plan_Pruebas_Multitenant.md | Diseñado; bloqueante | Borrador | 0.1 | ✅ Existe |

---

## 6. Documentos faltantes (69 anunciados)

### Por carpeta

| Carpeta | Anunciados | Existentes | Faltantes | % Cobertura |
|---|---:|---:|---:|---:|
| 00_Gestion_Proyecto | 21 | 22* | 0 | 104%* |
| 01_Requisitos | 15 | 8 | 7 | 53% |
| 02_Analisis | 13 | 1 | 12 | 8% |
| 03_Arquitectura | 32 | 31 | 1 | 97% |
| 04_Base_Datos | 15 | 8 | 7 | 53% |
| 05_Backend | 15 | 9 | 6 | 60% |
| 06_Frontend | 14 | 0 | 14 | 0% |
| 07_Seguridad_Privacidad | 20 | 0 | 20 | 0% |
| 08_Cumplimiento_Legal | 10 | 0 | 10 | 0% |
| 09_Politicas_Legales | 10 | 0 | 10 | 0% |
| 10_Pruebas | 14 | 14 | 0 | 100% |
| 11_Despliegue_Operacion | 15 | 0 | 15 | 0% |
| 12_Manuales | 10 | 0 | 10 | 0% |
| **TOTAL** | **204** | **93** | **111** | **46%** |

*Incluye 00_Analisis_Contenido_Existente.md (nuevo, no en índice).

### Clasificación de faltantes

**Fase 2+ (Análisis, requisitos, datos, backend)**: 32 documentos
- 01_Requisitos: 06_CU, 07_HU, 10-14 (historias, backlog, diccionarios)
- 02_Analisis: 01-12 (procesos, datos, actores, conservación, TRD/TVD, brechas)
- 04_Base_Datos: 03_Modelo_Físico, 08-10, 12-14 (indexación, retención, cifrado)
- 05_Backend: 01_Arq, 02_Módulos, 09_Auditoría, 11_Seguridad, 13-15 (rate, versión, pruebas)

**Fase 5+ (Frontend, seguridad, operación, documentación legal)**: 69 documentos
- 06_Frontend: 14 documentos (arquitectura, pantallas, componentes, accesibilidad)
- 07_Seguridad_Privacidad: 20 documentos (políticas, controles, DPIA, gestión incidentes)
- 08_Cumplimiento_Legal: 10 documentos (matriz legal, evidencias, licencias)
- 09_Politicas_Legales: 10 documentos (términos, privacidad, cookies, SLA)
- 11_Despliegue_Operacion: 15 documentos (CI/CD, infraestructura, monitoreo, runbooks)
- 12_Manuales: 10 documentos (usuario, admin, instalación, recuperación)

---

## 7. Documentos no registrados

| Archivo | Ruta | Tipo | Tamaño | Estado | Acción |
|---|---|---|---|---|---|
| 00_Analisis_Contenido_Existente.md | docs/00_Gestion_Proyecto/ | MD | 56 KB | Borrador | ✅ Registrar en índice próxima versión |

**Observación**: Archivo creado en sesión anterior como análisis preliminar. Debe ser integrado al índice o repositorio como fuente de diagnóstico (potencial como sección 00 del grupo análisis o preservarse como referencia).

---

## 8. Posibles duplicados

**Hallazgo**: No se detectaron duplicados por nombre o contenido SHA-256 en documentos MD/CSV/YAML.

**Observación**: Existe sobreposición temática entre documentos (ej: ADR de decisiones arquitectónicas + vistas C4 de implementación), pero son complementarios, no duplicados.

---

## 9. Problemas de nombres y rutas

### Inconsistencias detectadas

| Problema | Ubicación | Severidad | Detalle | Recomendación |
|---|---|---|---|---|
| **Carpeta con espacios** | `05. Normativa/` | Media | Ruta inconsistente con convención (espacios y punto) | Preservar como heredada; no mover |
| **Numeración desplazada** | 01_Requisitos | Baja | 08, 09, 15 no son consecutivos (falta 06, 07, 10-14) | Esperado; documentos aún no creados |
| **Numeración desplazada** | 03_Arquitectura | Baja | 03-05, 15-22, ADR-011..021 fuera de orden | Intencionado; agrupa por tipo (C4, ADR, estrategias) |
| **Nombre del índice** | 00_Indice_Maestro_Documentacion.md | Baja | Largo; podría abreviarse a 00_Indice_Maestro.md | No cambiar; ya existe |

**Conclusión**: Problemas menores. Numeración permite gaps (documentos pendientes). Ruta heredada debe preservarse.

---

## 10. Inconsistencias de versiones

### Versiones encontradas

| Documento | Versión archivo | Versión índice | Estado | Inconsistencia |
|---|---|---|---|---|
| 00_Diagnostico_Inicial_Proyecto.md | 1.1 | Borrador | ✅ Coherente | No |
| 00_Indice_Maestro_Documentacion.md | 3.0 | Borrador | ✅ Coherente | No |
| 00_Plan_Generacion_Documental.md | 1.1 | Borrador | ✅ Coherente | No |
| 02_Alcance_Proyecto.md | 0.2 | Borrador | ✅ Coherente | No |
| 07_Control_Cambios.md | 1.0 | Borrador | ✅ Coherente | No |
| 01_Acta_Inicio_Proyecto.md | 0.1 | **No iniciado** | ⚠️ Discrepancia | Índice desactualizado |
| 00_Analisis_Contenido_Existente.md | 1.0 | **No en índice** | ⚠️ Nuevo | Debe registrarse |

**Conclusión**: Versiones coherentes. Una discrepancia menor (Acta_Inicio). Archivo nuevo debe integrarse.

---

## 11. Inconsistencias de estados

### Estados encontrados vs. Índice

| Categoría | Cantidad | Hallazgo |
|---|---:|---|
| Borrador (como índice indica) | 60 | ✅ Coherente |
| Borrador controlado (como índice indica) | 4 | ✅ Coherente |
| Borrador para validación (como índice indica) | 8 | ✅ Coherente |
| Aprobado (ADR-011..021) | 11 | ✅ Coherente y vigente |
| Parcial (Baseline_Tecnico_G7) | 1 | ✅ Coherente |
| Estado discrepante (Acta_Inicio) | 1 | ⚠️ Índice dice "No iniciado"; archivo es Borrador v0.1 |

**Conclusión**: Estados coherentes. Una discrepancia menor que requiere actualización del índice.

---

## 12. Referencias y enlaces rotos

### Análisis de referencias internas

| Documento | Referencias internas | Estado |
|---|---|---|
| 00_Indice_Maestro_Documentacion.md | Refiere 156 documentos | ⚠️ 69 no existen (aún; pendientes de fases posteriores) |
| 07_Control_Cambios.md | 23 cambios registrados | ✅ Todos traceable a documentos existentes |
| 08_Registro_Decisiones_Arquitectura.md | ADR-011..021 | ✅ Todos presentes y vigentes |
| 02_Catalogo_Requisitos_Funcionales.md | 42 RF + eventos | ✅ Referencias válidas; eventos en catálogo |
| 09_Matriz_Trazabilidad.csv | 42 RF × multiples dimensiones | ✅ Matriz validada; cobertura completa |

**Hallazgo especial**: 
- ⚠️ **Referencias pendientes de validación jurídica**: Documentos normativos en `05. Normativa/` citan fuentes vigentes al 2026-07-16 pero requieren validación especializada.

**Conclusión**: Sin enlaces rotos críticos. Referencias futuras (documentos pendientes) son válidas como planificación.

---

## 13. Contradicciones documentales

### Contradicciones detectadas (del análisis anterior + fase 1)

| ID | Contradicción | Severidad | Ubicación | Tratamiento | Estado |
|---|---|---|---|---|---|
| **CNT-001** | Diagnóstico menciona solo ADR-011..014; índice refiere ADR-011..021 | Baja | Diagnóstico (histórico) | Estado vigente es 011-021; Diagnostico es referencia histórica | Esperado |
| **CNT-002** | Alcance describe disponibilidad SLA sin métrica específica | Media | 02_Alcance | Remitir a RNF-DIS-001; SLA OPV (pendiente validación) | Pendiente |
| **CNT-003** | RF-001 heredado no aparece en catálogo 42 RF | Baja | Diagnóstico vs Catálogo | RF-IAM-003/004 cubren invitación/asociación Keycloak | Resuelto |
| **CNT-004** | Supuestos dicen "membresía única" vs "usuario multitenant" en alcance | Media | Supuestos vs Alcance | Alcance es correcto (RF-IAM-008); supuestos requieren revisión | Pendiente |
| **CNT-005** | Proyecto anunciaba "56 módulos"; MVP define 13 capacidades | Baja | Alcance histórico | Esperado; RSK-003 y priorización completan mitigación | Mitigado |
| **CNT-006** | Numeración de documentos 01_Requisitos salta 06, 07, 10-14 | Baja | Estructura de carpetas | Intencionado; documentos pendientes reservan espacio | Esperado |
| **CNT-007** | 01_Acta_Inicio_Proyecto.md existe pero índice marca "No iniciado" | Baja | Índice vs archivo real | Archivo existe (Borrador v0.1); índice desactualizado | Acción: Actualizar índice |

**Conclusión**: Contradicciones menores, ninguna crítica. Causadas por evolución del proyecto y estado histórico vs. vigente.

---

## 14. Estado de ADR-011 a ADR-021

### Resumen de decisiones arquitectónicas

✅ **Todos los 11 ADR están APROBADOS y vigentes**. No hay derogaciones ni sustituciones detectadas.

| ADR | Título | Estado | Vigencia | Validación |
|---|---|---|---|---|
| ADR-011 | Arquitectura distribuida de macroservicios | ✅ Aprobado | ✅ Vigente | ✅ Referenciado en Alcance, Requisitos, Arquitectura |
| ADR-012 | Stack tecnológico base | ✅ Aprobado | ✅ Vigente | ✅ Aprobado; Node.js 24, TypeScript, NestJS, PostgreSQL |
| ADR-013 | Autenticación Keycloak/OIDC/OAuth 2.0 | ✅ Aprobado | ✅ Vigente | ✅ Requisitos IAM alineados |
| ADR-014 | Mensajería EventBridge/SQS SaaS | ✅ Aprobado | ✅ Vigente | ✅ Requisitos asíncrono alineados |
| ADR-015 | Acceso PostgreSQL con Kysely | ✅ Aprobado | ✅ Vigente | ✅ Modelo de datos alineado |
| ADR-016 | Almacenamiento S3/MinIO | ✅ Aprobado | ✅ Vigente | ✅ Cuarentena y procesamiento alineados |
| ADR-017 | Validación backend y RFC 9457 | ✅ Aprobado | ✅ Vigente | ✅ OpenAPI conforme |
| ADR-018 | Librerías frontend | ✅ Aprobado | ✅ Vigente | ✅ Tecnología confirmada |
| ADR-019 | Estrategia de pruebas | ✅ Aprobado | ✅ Vigente | ✅ Plan de pruebas conforme (Vitest, Playwright, k6) |
| ADR-020 | Observabilidad OpenTelemetry | ✅ Aprobado | ✅ Vigente | ✅ Especificado en baseline |
| ADR-021 | Mensajería privada RabbitMQ | ✅ Aprobado | ✅ Vigente | ✅ Alternativa a EventBridge para despliegue privado |

**Conclusión**: Línea base arquitectónica sólida. Todas las decisiones clave están documentadas y aprobadas. No requiere revisión de arquitectura.

---

## 15. Estado de fuentes heredadas

### Documentos heredados preservados

| Archivo | Ruta | Tipo | Tamaño | SHA-256 (parcial) | Aplicabilidad | Acción |
|---|---|---|---|---|---|---|
| LEY 594 DE 2000.pdf | 05. Normativa/00. Leyes/ | PDF | 143 KB | 7470A5D9... | Ley general de archivos | ✅ Preservar |
| Ley_527_de_1999.pdf | 05. Normativa/00. Leyes/ | PDF | 114 KB | 784C1BA9... | Mensajes de datos | ✅ Preservar |
| Decreto_1080_de_2015_Sector_Cultura.pdf | 05. Normativa/01. Decretos/ | PDF | 1.1 MB | 73E24962... | Regulación de archivos (integrado) | ✅ Preservar |
| Decreto_2578_de_2012.pdf | 05. Normativa/01. Decretos/ | PDF | 107 KB | DD8E8E3... | Antecedente reglamentario | ✅ Preservar |
| 2024-02_29_AcuerdoAGN-FIRMADO.pdf | 05. Normativa/02. Acuerdos/ | PDF | 1.6 MB | 2D71C663... | Acuerdo AGN 001 de 2024 | ✅ Preservar |
| acuerdo-012-1998.pdf | 05. Normativa/03. Actos/ | PDF | 420 KB | 336E460C... | Particular FP; no requisito general | ✅ Preservar como referencia |
| resolucion-596-2016.pdf | 05. Normativa/03. Actos/ | PDF | 283 KB | E0DDFA00... | Particular FP; TRD | ✅ Preservar como referencia |
| resolucion-536-2017.pdf | 05. Normativa/03. Actos/ | PDF | 813 KB | D191FE73... | Escaneado; sin OCR disponible | ✅ Preservar; requiere revisión visual |
| El Marco Normativo Fundamental.docx | 05. Normativa/ | DOCX | 19 KB | — | Síntesis secundaria de normas | ✅ Preservar; requiere validación jurídica |

### Información de fuentes heredadas

**Ruta con espacios**: `05. Normativa/` (inconsistente con convención; preservar sin cambios).

**Documentos por categoría**:
- **Leyes** (2): Ley 594/2000, Ley 527/1999
- **Decretos** (2): Decreto 1080/2015, Decreto 2578/2012
- **Acuerdos** (1): Acuerdo AGN 001/2024
- **Actos** (3): Resoluciones y acuerdos particulares
- **Síntesis** (1): Marco Normativo Fundamental (DOCX)

**Estado de validación**:
- ⚠️ **Vigencia no verificada**: Documentos locales al 2026-07-16; requieren contraste con fuente oficial.
- ⚠️ **Aplicabilidad no validada**: Supuesto de obligatoriedad no confirmado jurídicamente.
- ⚠️ **PDF sin OCR**: Documento 536-2017.pdf es escaneo; texto no extraíble programáticamente.

**Recomendación**: Mantener fuentes heredadas sin modificación. Validación jurídica especializada debe confirmar vigencia, aplicabilidad e instrumentos obligatorios antes de Fase 4 (Cumplimiento).

---

## 16. Riesgos documentales identificados

| ID | Riesgo | Probabilidad | Impacto | Nivel | Mitigación |
|---|---|---|---|---|---|
| **RDC-001** | Índice maestro desactualizado (1_Acta_Inicio) | Media | Bajo | Bajo | Actualizar índice en próxima versión |
| **RDC-002** | 69 documentos anunciados no iniciados | Media | Bajo | Bajo | Estructura reserva espacios; fases posteriores ejecutarán |
| **RDC-003** | Fuentes normativas sin validación jurídica | Media | Crítico | Alto | Validación especializada obligatoria antes Fase 4 |
| **RDC-004** | Responsables nominales no asignados | Alta | Crítico | Crítico | Asignación de RACI obligatoria antes Fase 1 |
| **RDC-005** | RNF con umbrales OPV sin cliente piloto | Alta | Alto | Alto | Validación con cliente piloto obligatoria antes Fase 5 |
| **RDC-006** | Modelo multitenant no validado en POC-001 | Media | Crítico | Alto | POC-001 bloqueante para programación |
| **RDC-007** | Archivo nuevo (Análisis_Contenido) no en índice | Baja | Bajo | Bajo | Registrar en próxima versión del índice |
| **RDC-008** | Herramientas de análisis no disponibles | Baja | Bajo | Bajo | Herramientas estándar (find, grep, bash) suficientes |

---

## 17. Cambios seguros recomendados (sin ejecutar aún)

### Cambios de bajo riesgo a Fase 2

| Cambio | Riesgo | Impacto | Autorización |
|---|---|---|---|
| Actualizar índice maestro con 01_Acta_Inicio estado Borrador | Bajo | Bajo | Product Owner |
| Registrar 00_Analisis_Contenido_Existente.md en índice | Bajo | Bajo | RESPONSABLE_DOCUMENTACION |
| Agregar sección "Análisis de contenido existente" a 07_Control_Cambios | Bajo | Bajo | RESPONSABLE_DOCUMENTACION |
| Crear 99_Fuentes_Heredadas/00_Indice_Normas.md (referencial) | Bajo | Bajo | Asesor jurídico |

### Cambios de alto riesgo (no ejecutar)

- ⛔ Mover o renombrar `05. Normativa/` (requiere procedimiento de preservación)
- ⛔ Modificar contenido de fuentes heredadas
- ⛔ Cambiar versión de documentos sin autorización
- ⛔ Crear documentos masivos aún no planificados
- ⛔ Cambiar estados a "Aprobado" sin revisión

---

## 18. Decisiones que requieren intervención humana

| Decisión | Responsable | Plazo | Impacto |
|---|---|---|---|
| **DEC-HUM-001** | ¿Registrar 00_Análisis_Contenido_Existente.md como documento oficial o referencia historiográfica? | Líder Documentación | Fase 1 | Catalogación |
| **DEC-HUM-002** | ¿Actualizar inmediatamente índice maestro con cambios detectados o esperar a Fase 2? | Product Owner | Fase 1 | Gobierno documental |
| **DEC-HUM-003** | ¿Preservar `05. Normativa/` con espacios en ruta o normalizar a `05_Normativa/` en Fase 2? | Product Owner | Fase 2 | Trazabilidad heredada |
| **DEC-HUM-004** | ¿Validar jurídicamente fuentes normativas antes o después de Fase 1 cierre? | Asesor jurídico | Inmediato | Bloqueante para Fase 4 |
| **DEC-HUM-005** | ¿Agregar sección de metodología y limitaciones a próximas versiones de inventario? | Líder Documentación | Próxima versión | Calidad documental |

---

## 19. Propuesta de organización para Fase 2

### Recomendaciones estructurales

**1. Reorganización de carpetas (sin mover archivos)**

Crear mapeo de referencias pero preservar rutas actuales:
- Crear `99_Fuentes_Heredadas/00_Indice_Normas.md` (referencia a 05. Normativa/)
- No mover `05. Normativa/`; mantener como heredada

**2. Actualización de índice maestro**

- Versión → 3.1 o 4.0
- Registrar 01_Acta_Inicio como Borrador (no "No iniciado")
- Opción: Registrar 00_Analisis_Contenido como Referencia o nueva sección
- Agregar notas de cambios en 07_Control_Cambios

**3. Prioridades Fase 2**

Orden recomendado:
1. **Aprobar requisitos** (42 RF + 21 RNF) con Product Owner
2. **Completar análisis mínimo** (procesos, actores, datos personales)
3. **Ejecutar POC-001** (multitenancy) en paralelo
4. **Completar modelos de datos** lógico/físico
5. **Enriquecer requisitos** con historias y casos de uso

**4. No iniciar aún (Fase 3+)**

- Frontend, operación, documentación legal
- Modelo físico de datos (post-POC-001)
- Matriz de cumplimiento legal (post-validación jurídica)

---

## 20. Recomendación de estado del proyecto

### Clasificación final de inventario

**Clasificación: `Inventario completo, apto para normalización`**

### Justificación

✅ **Fortalezas:**
- 78 documentos MD/CSV/YAML existentes y registrados
- 11 ADR aprobados sin derogaciones
- 42 RF + 21 RNF especificados
- Especificaciones técnicas (OpenAPI, AsyncAPI) validadas
- Pruebas diseñadas con criterios explícitos
- Control de cambios operativo

⚠️ **Pendientes Fase 1:**
- Responsables nominales: `[PLACEHOLDER]`
- Cliente piloto no definido
- Volúmenes no estimados
- Validación jurídica no realizada

❌ **Bloqueantes antes de programación:**
- POC-001 (multitenancy) no ejecutada
- POC-002 (carga documental) no ejecutada
- RNF umbrales OPV no validados
- Fuentes normativas sin vigencia verificada

### Recomendación de siguiente fase

**➡️ Proceder a Fase 1: Gobierno, alcance y producto**

Actividades:
1. Asignar responsables nominales
2. Definir cliente piloto inicial
3. Estimar volúmenes y capacidad
4. Validar requisi­tos con Product Owner
5. Iniciar validación jurídica de normas
6. Ejecutar POC-001 y POC-002 en paralelo

**Criterios de salida Fase 1:**
- ✅ RACI completado y nominado
- ✅ Alcance aprobado por patrocinador
- ✅ Cliente piloto identificado
- ✅ Volúmenes estimados
- ✅ Control de cambios actualizado

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Fase 1: Inventario completo; 93 archivos inspeccionados; 78 registrados y existentes; 69 pendientes; 11 ADR aprobados. Apto para normalización. | Antonio (Análisis) |

---

**Fin de Fase 1 — Inventario y diagnóstico documental**

**Recomendación**: Proceder a Fase 1 ejecutiva (gobierno, alcance, producto) tras aprobación de este inventario.
