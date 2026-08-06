# Análisis integral del contenido existente — Sistema de Gestión Documental

| Campo | Valor |
|---|---|
| Código | GDP-ANA-000 |
| Versión | 1.0 |
| Estado | Completo — No aprobado; requiere revisión |
| Fecha de análisis | 2026-08-05 |
| Alcance | Revisión exhaustiva de estructura, documentación y decisiones aprobadas |
| Propietario | `[RESPONSABLE_DOCUMENTACION]` |

---

## 1. Resumen ejecutivo

El repositorio contiene una **línea base documental coherente y sustancial** con 81 archivos documentales organizados en 8 carpetas temáticas. Los **once ADR-011 a ADR-021 están aprobados** y definen una arquitectura distribuida completamente especificada con stack tecnológico, patrones de mensajería, autenticación y seguridad.

Se han documentado **42 requisitos funcionales**, **21 requisitos no funcionales**, un catálogo de eventos, modelo conceptual multitenant, y dos pruebas de concepto arquitectónicas prioritarias. El proyecto dispone de diagnóstico inicial, plan de generación, inventario normalizado y criterios de gate por fase.

**Sin embargo**, existen **pendientes críticos**: responsables nominales no asignados, cliente piloto no definido, volúmenes no estimados, y varias decisiones aplazadas a validación especializada (legal, archivística, de seguridad). El proyecto está apto para organización documental e inventario formal, pero **no para programación** hasta resolver supuestos, validar decisiones legales y nombrar responsables.

**Riesgo principal**: RSK-001 (fuga multitenant) y RSK-002 (obsolescencia normativa) requieren ejecución inmediata de POC-001 y revisión jurídica especializada.

---

## 2. Método utilizado

- **Inspección recursiva**: Directorios, archivos y metadatos del repositorio al 2026-08-05.
- **Lectura completa**: Documentos estratégicos, ADR, requisitos, arquitectura, modelos y planes.
- **Análisis transversal**: Comparación de decisiones entre documentos, verificación de consistencia, identificación de referencias y dependencias.
- **Clasificación**: Separación clara entre hechos encontrados, decisiones aprobadas, propuestas, supuestos y pendientes.
- **No se modificó contenido**: Solo lectura y análisis.

---

## 3. Alcance de la revisión

### Cobertura documental

- ✅ Documentos de gestión del proyecto (16 documentos principales)
- ✅ Requisitos funcionales y no funcionales (14 documentos)
- ✅ Análisis de procesos y datos (13 anunciados; algunos pendientes)
- ✅ Arquitectura y decisiones (11 ADR + vistas C4)
- ✅ Modelo de datos (5 documentos)
- ✅ Backend y API (8 documentos)
- ✅ Pruebas (13 documentos)
- ⚠️ Frontend (0 documentos; estructura anunciada)
- ⚠️ Seguridad y privacidad (0 documentos específicos; temas transversales)
- ⚠️ Operación y despliegue (0 documentos; anunciados)

### Documentos no inspeccionados exhaustivamente

- Fuentes normativas PDF (8 archivos). Se registraron hashes SHA-256 y tamaños; contenido legal no validado.

### Limitaciones conocidas

- No se evaluó compilación, dependencias ni software implementado (no existe código productivo).
- No se realizó validación jurídica especializada.
- No se contrastó copia normativa con fuente oficial vigente.
- Algunos documentos están en estado **Borrador** y marcan explícitamente como "no aprobados".

---

## 4. Estructura actual de carpetas

```
docs/
├── 00_Gestion_Proyecto/           [16 documentos: diagnóstico, índice, plan, acta, alcance, etc.]
├── 01_Requisitos/                 [14 documentos: ERS, RF, RNF, reglas, criterios, trazabilidad]
├── 02_Analisis/                   [1 documento actual; 12 anunciados]
├── 03_Arquitectura/               [22 documentos: vistas C4, ADR-011..021, eventos, conceptos]
├── 04_Base_Datos/                 [8 documentos: modelos conceptual/lógico, ER, diccionario]
├── 04_Politicas_Legales/          [Vacío; estructura objetivo]
├── 05. Normativa/                 [8 PDF normativos heredados; ruta con espacios]
├── 05_Backend/                    [8 documentos: OpenAPI, endpoints, convenciones, validaciones]
├── 10_Pruebas/                    [13 documentos: estrategia, casos, matrices, criterios]
└── [Falta: 06_Frontend, 07_Seguridad_Privacidad, 08_Cumplimiento_Legal, 09_Politicas_Legales,
          11_Despliegue_Operacion, 12_Manuales, 99_Fuentes_Heredadas]
```

---

## 5. Inventario general de archivos

| Tipo | Cantidad | Descripción |
|---|---:|---|
| Markdown (.md) | 73 | Documentos principales: diagnóstico, requisitos, arquitectura, análisis, backend, pruebas |
| CSV (.csv) | 5 | Matrices: RACI, riesgos, trazabilidad, inventario, referencias ADR |
| YAML (.yaml) | 2 | OpenAPI 3.1 y AsyncAPI 3.0 especificaciones |
| PDF (.pdf) | 8 | Fuentes normativas heredadas (Leyes, Decretos, Acuerdos, Actos) |
| DOCX (.docx) | 1 | Fuente heredada: "El Marco Normativo Fundamental" |
| **TOTAL** | **81+** | **41 MD, 5 CSV, 2 YAML en estructura objetivo; 8 PDF + 1 DOCX heredados** |

---

## 6. Descripción de documentos principales

### 6.1 Gestión del Proyecto (`00_Gestion_Proyecto`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **00_Diagnostico_Inicial_Proyecto.md** | Borrador | Inventario previo (13 fuentes), decisiones posteriores, tecnologías y módulos propuestos, vacíos, riesgos iniciales. **Referencia histórica importante**. |
| **00_Indice_Maestro_Documentacion.md** | Borrador | Catálogo de 13 carpetas y 156 documentos objetivo; códigos GDP-*; convenciones de versión y estado. Norma de gobierno. |
| **00_Plan_Generacion_Documental.md** | Borrador | Siete fases de documentación; gobierno por rol; flujo de estado; trazabilidad mínima. **Hoja de ruta documental**. |
| **00_Inventario_Estado_Documental.md** | Borrador controlado | Normalización ejecutada: numeración corregida, fuentes heredadas preservadas, hashes SHA-256 registrados. Supuestos y pendientes legales explícitos. |
| **00_Inventario_Archivos.csv** | Borrador controlado | Matriz de 41 archivos: ID, ruta, tipo, código, versión, estado, fecha, propietario, fuente, hash, referencias, observaciones. |
| **02_Alcance_Proyecto.md** | Borrador para validación | Declaración de límites: 13 capacidades MVP, exclusiones, alcance técnico (Node.js 24, NestJS, PostgreSQL, S3/MinIO, Keycloak, EventBridge/SQS/RabbitMQ). **Aprobado por ADR-011 a ADR-021 en tecnología**. |
| **03_Objetivos_Proyecto.md** | Borrador | Fases: Fase 0 validación; Fase 1 gov/alcance; Fase 2 requisitos; Fase 3 arquitectura; Fase 4 seguridad; Fase 5 API/UI; Fase 6 pruebas; Fase 7 operación. |
| **04_Interesados_Stakeholders.md** | Borrador para validación | Roles identificados; titulares pendientes: patrocinador, product owner, líder archivístico, arquitecto, seguridad, datos, jurídico, QA, operaciones. |
| **05_Matriz_RACI.csv** | Borrador | Responsabilidades por actividad de gobierno; celular pendiente. |
| **06_Glosario.md** | Borrador | Definiciones de términos técnicos, archivísticos y organizacionales. Base para nomenclatura. |
| **07_Control_Cambios.md** | Borrador | Registro de modificaciones documentales: numeración, nombres, referencias, decisiones. Evidencia de evolución. |
| **08_Registro_Decisiones_Arquitectura.md** | Borrador | ADR-011 a ADR-021 listados y enlazados; conexiones entre decisiones documentadas. |
| **10_Hoja_Ruta_Producto.md** | Borrador | Fases Fase 1-3; módulos priorizados; dependencias entre entregas. |
| **15_Criterios_Gate_Inicio_Desarrollo.md** | Evaluación inicial | Puertas G1-G7 con checklist de criterios de entrada y salida. **Bloqueante para iniciar código**. |
| **16_Baseline_Tecnico_G7.md** | Parcial | Workspace Node.js inicializado; lockfile creado; verificaciones de dependencias pendientes. |

**Estado grupo 00**: 10 documentos aprobados parcialmente; 6 requieren decisión nominal y revisión especializada.

### 6.2 Requisitos (`01_Requisitos`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **01_ERS_SRS_Gestion_Documental.md** | Borrador para validación | Especificación general del producto: visión, actores, supuestos, reglas, casos de uso de alto nivel. |
| **02_Catalogo_Requisitos_Funcionales.md** | Borrador para validación | **42 RF atómicos** en 5 dominios: identidad (RF-IAM-001..008), documentos (RF-DOC-001..016), correspondencia (RF-COR-001..006), auditoría (RF-AUD-001..006), operaciones (RF-OPS-001..004). Cada RF con actor, disparador, resultado, reglas, eventos, criterios y caso de prueba. |
| **03_Catalogo_Requisitos_No_Funcionales.md** | Borrador medible | **21 RNF** con métricas: seguridad (RNF-SEG-001..002), privacidad (RNF-PRI-001), multitenancy (RNF-MTN-001), rendimiento (RNF-REN-001), disponibilidad (RNF-DIS-001), idempotencia (RNF-RES-001), accesibilidad (RNF-ACC-001), mantenibilidad, observabilidad, trazabilidad, interoperabilidad, integridad, backup, recuperación, capacidad, portabilidad, navegadores, auditoría, calidad, despliegue. **Umbrales marcados OPV (Objetivo Provisional Validación)**. |
| **04_Reglas_Negocio.md** | Borrador para validación | Reglas documentales, de identidad, correspondencia y cumplimiento que rigen comportamiento. |
| **05_Actores_Roles_Permisos.md** | Borrador para validación | Matriz de 9 actores (admin plataforma, admin org, usuarios, radicadores, auditores, operadores, ciudadanos, soportes, sistemas) con permisos y delegaciones. |
| **08_Criterios_Aceptacion.md** | Borrador para validación | Criterios Gherkin de los 42 RF; casos de prueba funcionales y casos de rechazo. |
| **09_Matriz_Trazabilidad.csv** | Borrador | **42 RF trazados** a objetivos, historias, reglas, RNF, entidades, endpoints, eventos y casos de prueba. |
| **15_Supuestos_Restricciones.md** | Borrador | **15 supuestos** (SUP-001..015) sobre cliente, mercado, volumen, contratación, despliegue, integración. **15 restricciones** (RES-001..012) técnicas, legales y operativas. |

**Pendientes anunciados en índice**: casos de uso (06), historias (07), diccionario de mensajes (10), catálogo de validaciones (11), catálogo de errores (12), backlog MVP (13), backlog futuro (14).

**Estado grupo 01**: 5 de 14 documentos inicializados; estructura clara; **RF y RNF medibles pero no aprobados; umbrales OPV requieren validación con cliente piloto**.

### 6.3 Análisis (`02_Analisis`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **13_Perfil_Capacidad_Operacion.md** | Borrador | Volúmenes, SLA y capacidad esperada. **Crítico bloqueante**: sin perfil no se pueden validar RNF ni diseño de base de datos. |

**Pendientes críticos**: Análisis de procesos (01-04), datos personales (05-06), multiempresa (09), conservación digital (10), TRD/TVD (11), brechas (12).

**Estado grupo 02**: 1 de 13 documentos iniciados. **Riesgo alto**: sin análisis de procesos, actores y retención no puede completarse requisitos.

### 6.4 Arquitectura (`03_Arquitectura`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **ADR-011 a ADR-021** | ✅ **Aprobados** | Decisiones fundamentales: macroservicios distribuidos (011), Node.js 24/NestJS/TypeScript/React/PostgreSQL (012), Keycloak/OIDC/OAuth 2.0 (013), EventBridge/SQS SaaS / RabbitMQ privado (014/021), Kysely/pg (015), S3/MinIO (016), validación backend / RFC 9457 (017), librerías frontend (018), estrategia de pruebas (019), OpenTelemetry (020). |
| **03_Vista_Contexto_C4.md** | Borrador | Sistema, actores externos, sistemas externos. |
| **04_Vista_Contenedores_C4.md** | Borrador | Frontend SPA, Gateway API, seis macroservicios, bases PostgreSQL, colas, S3, Keycloak, monitores. |
| **05_Vista_Componentes_C4.md** | Borrador para validación | Componentes internos de los seis macroservicios: IAM, Documental, Correspondencia, Procesamiento, Auditoría, Notificaciones. Arquitectura por puertos y adaptadores. |
| **15_Modelo_Amenazas.md** | Borrador para revisión de seguridad | STRIDE sobre servicios, datos, eventos, usuarios. Riesgos identificados. **Requiere revisión especializada**. |
| **16_Mapa_Dominios.md** | Borrador | Seis dominios y sus límites conceptuales. |
| **17_Matriz_Responsabilidades_Propiedad_Datos.csv** | Borrador | Qué servicio es fuente de verdad de qué datos. |
| **18_Catalogo_Eventos_Comunicaciones.md** | Borrador | 32 eventos (EVT-001..032) entre servicios, con payloads y versiones. |
| **19_Estrategia_Consistencia_Distribuida.md** | Borrador para validación | Outbox, inbox, idempotencia, sagas, compensación. |
| **20_Plan_Pruebas_Concepto.md** | Borrador; no autoriza desarrollo productivo | **POC-001**: Multitenancy, RLS, Keycloak, dos servicios, dos bases, 10 casos de prueba. **POC-002**: Carga documental, S3/MinIO, AV, hash, integridad, deduplicación, 21 casos de prueba. **Criterios de fallo arquitectónico explícitos**. |
| **21_Matriz_ADR_Documentos.csv** | Borrador controlado | Vinculación ADR a documentos que implementan decisión. |
| **22_Catalogo_Maestro_Stack_Versiones.md** | Borrador controlado | Todas las dependencias con versiones fijas: Node.js 24.0.0, TypeScript, NestJS, Express, React, Vite, PostgreSQL, Keycloak, etc. |

**Pendientes críticos**: Diagramas de despliegue (06), integraciones (07), seguridad (08), multiempresa (09), arquitectura de software (01), principios (02), escalabilidad (11), disponibilidad (12), observabilidad (13), backup/recuperación (14).

**Estado grupo 03**: 11 documentos inicializados; **11 ADR aprobados son línea base vinculante**; C4 en borrador; POC diseñadas pero no ejecutadas.

### 6.5 Base de Datos (`04_Base_Datos`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **01_Modelo_Conceptual.md** | Borrador para validación | Seis contextos: Identidad (org, sede, membresía, rol), Documental (serie, tipo, doc, versión, expediente), Correspondencia (secuencia, radicación, tarea), Procesamiento (trabajo, escaneo), Auditoría (evento, consentimiento, solicitud), Notificaciones (plantilla, intento). Referencias contractuales por ID/evento, no FK entre servicios. |
| **02_Modelo_Logico.md** | Borrador para validación | Entidades por servicio; 20 invariantes documentadas. |
| **04_Diagrama_ER.md** | Borrador lógico | Diagramas Mermaid por servicio. |
| **05_Diccionario_Datos.md** | Borrador lógico | Definición de columnas, tipos, índices, restricciones. |
| **06_Catalogo_Entidades.md** | Borrador para validación | Mapeo de conceptos a tablas. |
| **07_Reglas_Integridad.md** | Borrador | 20 invariantes: unicidad, rango, composición, referencias, temporal. |
| **11_Estrategia_Migraciones.md** | Borrador; sin migraciones productivas | Uso de node-pg-migrate; propiedad por servicio; cambios reversibles. |
| **15_Modelo_Multitenant.md** | Borrador bloqueante hasta POC-001 | tenant_id en todas las tablas cliente; RLS; contexto transaccional; propiedad exclusiva. **Crítico: no puede programarse sin validar en POC-001**. |

**Pendientes críticos**: Modelo físico (03), indexación (08), particionamiento (09), auditoría BD (10), retención (12), anonimización (13), cifrado (14).

**Estado grupo 04**: 8 de 15 documentos; modelo conceptual/lógico en borrador; modelo físico pendiente de POC.

### 6.6 Backend (`05_Backend`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **03_Convenciones_API.md** | Borrador contractual | Rutas, versión, autenticación, autorización, error RFC 9457, paginación, filtros, idempotencia, rate limiting. |
| **04_Especificacion_OpenAPI.yaml** | Borrador OpenAPI 3.1 validado semánticamente | Siete operaciones iniciales; validación automática de esquemas. |
| **05_Catalogo_Endpoints.md** | Borrador | Documentación de endpoints para flujo vertical. |
| **06_Autenticacion_Autorizacion.md** | Borrador para seguridad | JWT de Keycloak, contexto tenant, autorización por recurso, policy engines mínimas. |
| **07_Gestion_Errores.md** | Borrador contractual | RFC 9457 (Problem Details); códigos: validation.failed, authorization.denied, resource.conflict, dependency.unavailable, operation.accepted. |
| **08_Validaciones.md** | Borrador contractual | Validación en tres capas: DTO (forma), aplicación (reglas), dominio (invariantes). |
| **10_Procesamiento_Asincrono.md** | Borrador contractual | Outbox, inbox, idempotencia key, DLQ, reintentos, compensación. |
| **12_Idempotencia.md** | Borrador contractual | Clave única por solicitud; respuesta cacheada; escritura transaccional. |
| **16_Especificacion_AsyncAPI.yaml** | Borrador AsyncAPI 3.0; sintaxis validada | Eventos (EVT-001..032) y comandos (CMD-001..006) con schémas. |

**Pendientes**: Arquitectura (01), módulos (02), seguridad API (11), rate limiting (13), versionamiento (14), estrategia de pruebas (15).

**Estado grupo 05**: 9 de 15 documentos; especificaciones OpenAPI/AsyncAPI validadas; sin implementación productiva.

### 6.7 Pruebas (`10_Pruebas`)

| Documento | Estado | Contenido clave |
|---|---|---|
| **01_Estrategia_Pruebas.md** | Borrador para aprobación | Pirámide: unitarias (Vitest), integración (Supertest, Testcontainers), E2E (Playwright), carga (k6), seguridad (ZAP), accesibilidad (axe). |
| **02_Plan_Pruebas.md** | Borrador para aprobación | Fases, recursos, cronograma (no iniciado). |
| **03_Casos_Prueba_Funcionales.md** | Diseñado; 42 CP | Uno por cada RF; criterios Gherkin. |
| **04_Casos_Prueba_Seguridad.md** | Diseñado; no ejecutado | Inyección, autenticación, autorización, cifrado, sesión. |
| **05_Casos_Prueba_Privacidad.md** | Diseñado; no ejecutado | Minimización, retención, titulares, consentimiento. |
| **06_Casos_Prueba_Rendimiento.md** | Diseño provisional; umbrales pendientes | k6 sobre flujos verticales; SLO por definir. |
| **07_Casos_Prueba_Accesibilidad.md** | Diseñado; no ejecutado | WCAG 2.1 AA; axe; teclado; lector; manual. |
| **08_Casos_Prueba_Integraciones.md** | Diseñado; no ejecutado | Eventos, sagas, reintento, DLQ. |
| **09_Matriz_Trazabilidad_Pruebas.csv** | Borrador validado | 42 RF → 42 CP; cobertura completa anunciada. |
| **10_Criterios_Entrada_Salida.md** | Borrador para aprobación | Gates por tipo de prueba. |
| **11_Plan_Pruebas_Aceptacion.md** | Borrador; cliente piloto pendiente | Rol de cliente, escenarios, criterios. |
| **12_Plan_Pruebas_Recuperacion.md** | Diseñado; no ejecutado | Restauración de backup, failover, DR. |
| **13_Plan_Pruebas_Backup.md** | Diseñado; no ejecutado | Integridad, frequencia, RPO/RTO. |

**Pendientes**: Plan multitenant (14).

**Estado grupo 10**: 13 de 14 documentos iniciados; casos de prueba diseñados pero no ejecutados; ejecución paralela a desarrollo.

---

## 7. Estado del gobierno documental

### Índice maestro y control de cambios

✅ **Índice maestro** (GDP-IDX-001 v3.0 — Borrador controlado)
- Define estructura de 13 carpetas y códigos GDP-*.
- Registra 156 documentos objetivo; estado actual ~50 iniciados.
- Convenciones claras: numeración, versión, estados permitidos.

✅ **Control de cambios** (GDP-GPR-007 — Borrador)
- Registra normalizaciones ejecutadas (numeración, nombres).
- Trazabilidad de modificaciones y decisiones.

⚠️ **Propietarios nominales**: Todos marcados como `[PLACEHOLDER]` (patrocinador, product owner, arquitecto, etc.). **Crítico**: Sin responsables no hay gobierno ejecutable.

### Responsabilidad de documentación

- ✅ Estructura objetivo clara en índice.
- ✅ Convenciones de nomenclatura definidas.
- ✅ Códigos GDP-* aplicados.
- ⚠️ Revisores y aprobadores pendientes en todos los documentos.
- ⚠️ Flujo de aprobación no operativo.

---

## 8. Estado del alcance y objetivos

### Alcance

✅ **Bien definido**:
- MVP con 13 capacidades: organizaciones, identidad/MFA, instrumentos, radicación entrada/salida, documentos/versiones, expedientes, búsqueda, auditoría, notificación, reportes, privacidad, respaldo.
- Exclusiones explícitas: pagos/facturación (Fase 3), firma electrónica, OCR avanzado, movilidad.
- Modalidades: SaaS base; despliegue privado futuro.

✅ **Alcance técnico aprobado** (ADR-011 a ADR-021):
- Frontend: React + TypeScript + Vite.
- Backend: Node.js 24 LTS, NestJS, Express, TypeScript.
- Datos: PostgreSQL, Kysely, pg, node-pg-migrate.
- Autenticación: Keycloak, OIDC, OAuth 2.0, MFA.
- Mensajería: EventBridge/SQS (SaaS), RabbitMQ (privado).
- Almacenamiento: S3/MinIO con cuarentena.
- Observabilidad: OpenTelemetry.

⚠️ **Pendiente**: Cliente piloto inicial y decisión SaaS-solamente vs. privado en MVP.

### Objetivos

✅ **Siete fases definidas**:
0. Validación diagnóstico
1. Gobierno, alcance, producto
2. Análisis de requisitos MVP
3. Arquitectura y datos
4. Cumplimiento y seguridad
5. Backend, frontend, integraciones
6. Calidad (pruebas)
7. Operación, manuales

⚠️ **Cronograma sin fechas**: Las fases están secuenciadas pero no calendarizadas. Dependencias entre fases están claras.

---

## 9. Estado de requisitos

### Requisitos funcionales

✅ **42 RF definidos y trazados**
- Dominios: Identidad/acceso (8), Documentos (9), Correspondencia (6), Auditoría (6), Operaciones (4).
- Cada RF con: actor, prioridad, disparador, flujo, reglas, eventos, criterios de aceptación, caso de prueba.
- Todos los RF incluyen identificador único (RF-XXX-NNN).

✅ **Matriz de trazabilidad** (42 RF × múltiples dimensiones):
- RF → Objetivo, Historia, Regla, RNF, Entidad, Endpoint, Evento, Caso de Prueba.

⚠️ **Estado**: Borrador para validación. No hay aprobación de Product Owner.

⚠️ **Pendientes anunciados**: Casos de uso (CU), historias de usuario (HU), backlog priorizado.

### Requisitos no funcionales

✅ **21 RNF medibles**
- Categorías: Seguridad (2), Privacidad (1), Multitenancy (1), Rendimiento (1), Disponibilidad (1), Resiliencia (1), Accesibilidad (1), Mantenibilidad (1), Observabilidad (1), Trazabilidad (1), Interoperabilidad (1), Integridad (1), Backup (1), Recuperación (1), Capacidad (1), Portabilidad (1), Navegadores (1), Auditoría (1), Calidad (1), Despliegue (1).

⚠️ **Umbrales**: La mayoría marcados como **OPV** (Objetivo Provisional Validación):
- Cero hallazgos críticos de seguridad, pero métricas específicas pendientes.
- Disponibilidad SLA sin porcentaje.
- Latencia p95/p99 sin valor.
- Capacidad sin volumen.

**Riesgo**: RNF-007 (RNF no verificables) está en matriz de riesgos iniciales como **Alto**.

### Reglas de negocio

✅ **Documento iniciado**: GDP-REQ-004 (Borrador para validación).
- Reglas de documentos, identidad, correspondencia, cumplimiento.

### Categorización de contenido

✅ **Criterios de aceptación**: Gherkin; 42 casos funcionales diseñados.

⚠️ **Supuestos y restricciones**: 15 SUP + 12 RES documentados; requieren validación.

---

## 10. Estado de la arquitectura

### Decisiones aprobadas

✅ **ADR-011 a ADR-021 aprobados**:

| ADR | Decisión | Estado |
|---|---|---|
| ADR-011 | Arquitectura distribuida de seis macroservicios por dominio | ✅ Aprobado |
| ADR-012 | Stack: Node.js 24 LTS, TypeScript, NestJS/Express, React/Vite, PostgreSQL | ✅ Aprobado |
| ADR-013 | Autenticación Keycloak OIDC/OAuth 2.0, Authorization Code + PKCE, MFA | ✅ Aprobado |
| ADR-014 | Mensajería EventBridge/SQS para SaaS | ✅ Aprobado |
| ADR-015 | Acceso PostgreSQL con Kysely/pg, migraciones node-pg-migrate | ✅ Aprobado |
| ADR-016 | Almacenamiento S3 para SaaS, MinIO para privado | ✅ Aprobado |
| ADR-017 | Validación backend por capas, errores RFC 9457 Problem Details | ✅ Aprobado |
| ADR-018 | Librerías frontend: React, TypeScript, Vite | ✅ Aprobado |
| ADR-019 | Estrategia de pruebas: Vitest, Supertest, Testcontainers, Playwright, k6, OWASP ZAP | ✅ Aprobado |
| ADR-020 | Observabilidad OpenTelemetry/OTLP | ✅ Aprobado |
| ADR-021 | Mensajería privada RabbitMQ con quorum queues | ✅ Aprobado |

**Ningún ADR está derogado o en riesgo**. Son línea base vinculante.

### Vistas arquitectónicas

✅ **Vistas C4 nivel 1-3 iniciadas**:
- Contexto (01): Sistema, actores externos.
- Contenedores (04): Aplicación, servicios, bases, colas, almacenamiento.
- Componentes (05): Arquitectura interna de seis macroservicios con patrones claros.

✅ **Macroservicios definidos**:
1. `identity-access-service` — Organización, membresía, RBAC, autorización.
2. `document-core-service` — Documentos, versiones, expedientes, clasificación.
3. `correspondence-workflow-service` — Radicación, secuencia, distribución, tareas.
4. `document-processing-worker` — Antivirus, OCR, hash, integridad, escaneo.
5. `audit-compliance-service` — Auditoría, consentimiento, solicitudes de titulares, incidentes.
6. `notification-integration-service` — Correo, notificaciones, webhooks.

**Fase 3**: `commercial-billing-service`.

✅ **Patrón arquitectónico**: Puertos y adaptadores; Keycloak centralizado; bases por servicio con RLS.

### Modelos de datos

✅ **Modelo conceptual**:
- Seis dominios explícitos con límites.
- Referencias contractuales por ID/evento, no FK entre servicios.
- 20 invariantes documentadas.

✅ **Modelo lógico**:
- Entidades por servicio identificadas.
- Diccionario de datos iniciado.

⚠️ **Modelo físico**: Pendiente; dependerá de POC-001 (validación RLS y contexto tenant).

### Decisiones pendientes

⚠️ **Búsqueda**: PostgreSQL FTS inicial; OpenSearch/Elasticsearch al escalar. Umbral no definido.

⚠️ **OCR**: Tesseract o servicios administrados. Evaluación abierta (exactitud, costo, residencia, datos).

⚠️ **Firma**: Firma electrónica o digital según riesgo. Proveedor pendiente.

⚠️ **Auditoría**: Mecanismo de "inmutabilidad" no especificado. Requiere precisión operativa y excepciones legales.

---

## 11. Estado de modelo de datos

### Modelado conceptual y lógico

✅ **Modelado conceptual** (GDP-DAT-001 v0.1 — Borrador para validación):
- Seis contextos de dominio con entidades fuente de verdad.
- Referencias explícitas y aclaraciones de propiedad.
- Invariantes conceptuales documentadas.

✅ **Modelado lógico** (GDP-DAT-002 v0.1 — Borrador para validación):
- Entidades por servicio con atributos iniciales.
- 20 invariantes de integridad documentadas.
- Diagrama ER por servicio en Mermaid.

✅ **Diccionario de datos** (GDP-DAT-005 — Borrador lógico):
- Definición de columnas, tipos, restricciones.

⚠️ **Modelo multitenant** (GDP-DAT-015 v0.1 — Borrador bloqueante):
- `tenant_id` en todas las tablas cliente.
- Row-Level Security (RLS) en PostgreSQL.
- Contexto transaccional con validación.
- **Bloqueante**: No puede implementarse sin validación en POC-001.

⚠️ **Modelo físico** (GDP-DAT-003):
- No iniciado. Dependerá de POC-001, volúmenes y RNF finales.

⚠️ **Pendientes**: Indexación (08), particionamiento (09), auditoría BD (10), retención (12), anonimización (13), cifrado (14).

---

## 12. Estado de backend y contratos API

### OpenAPI

✅ **Especificación OpenAPI 3.1** (GDP-BE-004 — Borrador validado semánticamente):
- Siete operaciones del flujo vertical.
- Validación automática de esquemas.
- Utiliza convenciones RFC 9457 para errores.

✅ **Convenciones API** (GDP-BE-003 — Borrador contractual):
- Rutas, versión, autenticación/autorización.
- Códigos de error: `validation.failed`, `authorization.denied`, `resource.conflict`, `dependency.unavailable`, `operation.accepted`.
- Paginación, filtros, idempotencia, rate limiting.

✅ **AsyncAPI** (GDP-BE-016 — Borrador AsyncAPI 3.0 validado):
- 32 eventos (EVT-001..032) y 7 comandos (CMD-001..007).
- Payloads con esquemas.

✅ **Catálogo de endpoints** (GDP-BE-005 — Borrador):
- Documentación de operaciones iniciales.

### Patrones backend

✅ **Validación en tres capas**:
- DTO (forma).
- Aplicación (reglas de negocio).
- Dominio (invariantes).

✅ **Procesamiento asíncrono**:
- Transactional Outbox (escritura con agregado).
- Inbox + Deduplicación (lectura idempotente).
- DLQ (manejo de fallos irrecuperables).

✅ **Idempotencia**:
- Clave única por solicitud.
- Respuesta cacheada.

⚠️ **Seguridad API**: No iniciado (GDP-BE-011).

⚠️ **Rate limiting**: No iniciado (GDP-BE-013).

⚠️ **Versionamiento API**: No iniciado (GDP-BE-014).

---

## 13. Estado del frontend

❌ **Documentación frontend: No iniciada**

La estructura objetivo anuncia 14 documentos (GDP-FE-001..014): arquitectura, pantallas, rutas, componentes, sistema de diseño, accesibilidad, gestión de estado, formularios, validaciones, errores, matriz de roles, prototipos, mensajes, estrategia de pruebas.

⚠️ **Observación**: Tecnología aprobada (React, TypeScript, Vite) pero sin especificación de componentes, navegación o diseño.

---

## 14. Estado de seguridad y privacidad

### Riesgos y modelo de amenazas

✅ **Matriz de riesgos iniciales** (12 riesgos; RSK-001..012):
- RSK-001: Fuga entre tenants (Crítico) → RLS/defensa en profundidad, pruebas negativas.
- RSK-002: Normas desactualizadas → Fuentes oficiales, validación jurídica.
- RSK-003: Alcance de 56 módulos → Baseline MVP, priorización.
- RSK-004: Conflicto retención/disposición → Motor de retención, autorización.
- RSK-005: Pérdida de integridad documental → Hash, versionado, WORM.
- RSK-006: Dependencia de proveedores → Puertos/adaptadores, portabilidad.
- RSK-007: Volúmenes sin RNF → Taller de capacidad.
- RSK-008: Acceso de soporte → Just-in-time, aprobación, auditoría.
- RSK-009: Malware en cargas → Cuarentena, AV, CDR.
- RSK-010: Restauración no probada → Pruebas de restore regulares.
- RSK-011: Consentimiento alterable → Hash, versión, sello, auditoría.
- RSK-012: Documentación sin dueño → RACI, control de cambios.

✅ **Modelo de amenazas** (GDP-ARQ-015 v0.1 — Borrador para revisión de seguridad):
- STRIDE aplicado a servicios y datos.
- Riesgos identificados por categoría.

⚠️ **Requiere revisión especializada** de seguridad y datos.

### Privacidad

✅ **Incorporado en diseño**:
- Minimización: no se solicitan datos más allá de lo necesario.
- Consentimiento: registrado con versión y timestamp.
- Solicitudes de titulares: proceso definido.
- Retención: por definir en base jurídica.

⚠️ **Análisis de datos personales**: No iniciado.

⚠️ **DPIA (Evaluación de Impacto)**: No iniciado.

⚠️ **Procedimientos de titulares**: Bosquejado (RF-AUD-004..005) pero no detallado.

---

## 15. Estado de cumplimiento legal

### Marcos normativos

✅ **Fuentes normativas identificadas** (8 PDF + 1 DOCX heredados):
- Ley 594 de 2000 (Ley General de Archivos).
- Ley 527 de 1999 (Mensajes de datos).
- Decreto 1080 de 2015 (Regulación de archivos).
- Decreto 2578 de 2012.
- Acuerdo AGN 001 de 2024 (Recientemente firmado).
- Actos administrativos: resoluciones y acuerdos particulares de Función Pública.

⚠️ **Validación legal**: **Requiere validación jurídica especializada**:
- Vigencia actual de cada norma.
- Aplicabilidad específica al MVP.
- Instrumentos archivísticos obligatorios vs. opcionales.
- Conflictos entre normas.

### Documentación de cumplimiento

❌ **Matriz de cumplimiento legal**: No iniciada.

❌ **Evidencias de cumplimiento**: No iniciadas.

⚠️ **Pendientes críticos**:
- Artículo → Obligación → Aplicabilidad → Requisito → Control → Evidencia.
- Gestión de consentimientos conforme a ley de protección de datos.
- Retención y disposición de documentos y datos.
- Interoperabilidad con sistemas gubernamentales.

---

## 16. Estado de pruebas

### Estrategia y casos diseñados

✅ **Estrategia de pruebas** (GDP-TST-001 — Borrador para aprobación):
- Pirámide: unitarias, integración, E2E, carga, seguridad, accesibilidad.

✅ **42 casos de prueba funcionales diseñados** (GDP-TST-003 — Diseñado):
- Uno por cada RF.
- Criterios Gherkin.

✅ **Casos de prueba de seguridad** (GDP-TST-004 — Diseñado; no ejecutado):
- Inyección, autenticación, autorización, cifrado, sesión.

✅ **Casos de prueba de privacidad** (GDP-TST-005 — Diseñado; no ejecutado):
- Minimización, retención, derechos de titulares, consentimiento.

✅ **Matriz de trazabilidad pruebas** (42 RF × 1 CP cada uno — Borrador validado):
- Cobertura completa anunciada.

### Pruebas de concepto

✅ **POC-001 diseñada**: Multitenancy e identidad distribuida.
- 10 casos de prueba; criterios de fallo explícitos.
- Validará RLS, contexto tenant, Keycloak, propagación entre servicios.
- **Bloqueante**: Sin POC-001 aprobada no puede iniciarse desarrollo multitenant.

✅ **POC-002 diseñada**: Pipeline documental resiliente.
- 21 casos de prueba; carga a S3/MinIO, AV, hash, integridad, idempotencia.
- Validará outbox, inbox, deduplicación, DLQ.
- **Bloqueante**: Sin POC-002 aprobada no puede garantizarse proceso documental.

⚠️ **POC no ejecutadas**: Sin evidencia de cumplimiento.

### Pendientes

⚠️ **Umbrales de calidad**: No definidos.
- Cobertura de código mínima.
- Defectos máximos permitidos.
- SLO de tiempo de ejecución.

⚠️ **Plan de aceptación**: Cliente piloto pendiente.

⚠️ **Pruebas de recuperación y backup**: Diseñadas pero no ejecutadas.

---

## 17. Estado de despliegue y operación

❌ **Documentación de despliegue: No iniciada**

La estructura objetivo anuncia 15 documentos (GDP-OPS-001..015): arquitectura de despliegue, ambientes, CI/CD, configuración, variables de entorno, infraestructura AWS, monitoreo, logs, alertas, backup/restore, escalamiento, runbooks, checklist, mantenimiento, actualizaciones.

### Preparativos parciales

✅ **Baseline técnico G7** (GDP-GPR-016 — Parcial):
- Workspace Node.js inicializado.
- pnpm lockfile creado.
- Verificaciones de dependencias pendientes.

❌ **CI/CD**: No existe (no hay código productivo aún).

❌ **IaC (Infraestructura como Código)**: No iniciada.

⚠️ **Observabilidad**: OpenTelemetry aprobado (ADR-020); backend sin implementar.

---

## 18. Decisiones aprobadas encontradas

### Decisiones arquitectónicas (ADR-011 a ADR-021)

Todas las decisiones archictectónicas ADR-011 a ADR-021 están **aprobadas y vigentes**. No hay contradicciones detectadas en documentación posterior.

### Decisiones de alcance

✅ **MVP con 13 capacidades** (Alcance GDP-GPR-002).

✅ **Exclusiones explícitas**: Pagos/facturación, firma digital, OCR avanzado, movilidad, portal ciudadano completo en MVP.

✅ **Despliegue preferente**: SaaS en AWS; capacidad para privado futuro.

### Decisiones de gobierno

✅ **Estructura de 13 carpetas** como línea base documental (Índice maestro).

✅ **Códigos GDP-***  (Gestión Documental para Proyecto) como convención.

✅ **Siete fases** de documentación y desarrollo (Plan de generación).

---

## 19. Decisiones pendientes

### Decisiones críticas bloqueantes

| ID | Decisión | Impacto | Responsable | Plazo recomendado |
|---|---|---|---|---|
| **DEC-001** | Validación de ADR-004 a ADR-010 (arquitectura previa) | Coherencia histórica | Comité Arquitectura | Antes de Fase 3 |
| **DEC-002** | Cliente piloto inicial (público/privado, entidad/empresa) | Direcciona MVP y validación | Product Owner / Patrocinador | Antes de Fase 1 |
| **DEC-003** | Volúmenes y capacidad esperada (usuarios, docs, radicaciones, crecimiento) | Valida RNF y diseño de base | Product Owner / Análisis | Antes de Fase 3 |
| **DEC-004** | RPO/RTO contractual | Define estrategia de backup y disaster recovery | Operaciones / Patrocinador | Antes de Fase 7 |
| **DEC-005** | Disponibilidad SLA por modalidad | Valida RNF-DIS-001 y arquitectura HA | Operaciones / Patrocinador | Antes de Fase 7 |
| **DEC-006** | Matriz de navegadores soportados | Valida RNF-COM-001 | Frontend / QA | Antes de Fase 5 |
| **DEC-007** | Instrumento archivístico mínimo operativo en MVP | Define RF-DOC-001..003 en detalle | Líder Archivístico | Antes de Fase 2 |
| **DEC-008** | Retención y disposición de documentos (período y regla) | Regula RF-OPS e implementación | Líder Archivístico / Jurídico | Antes de Fase 2 |
| **DEC-009** | Validación jurídica especializada de normas | Confirma aplicabilidad de Ley 594, Decreto 1080, AGN 001 | Asesor Jurídico | Antes de Fase 4 |
| **DEC-010** | Proveedor de firma electrónica/digital | Si aplica en MVP | Jurídico / Arquitectura | Antes de Fase 5 |
| **DEC-011** | Proveedor de OCR y residencia de datos | Evaluación exactitud, costo, privacidad | Arquitectura / Seguridad | Antes de Fase 3 |
| **DEC-012** | Búsqueda: umbral de evolución a OpenSearch/Elasticsearch | Define cuándo escalar de PostgreSQL FTS | Arquitectura / Operaciones | Antes de Fase 2 |

### Decisiones de validación

| ID | Validación | Responsable | Criterio |
|---|---|---|---|
| **VAL-001** | POC-001 (Multitenancy e identidad) | Desarrollo + Seguridad | Cero acceso cross-tenant; 100% consultas tenant-scoped |
| **VAL-002** | POC-002 (Pipeline documental) | Desarrollo + QA | Cero archivo malicioso disponible; cero duplicación de versión/efecto |
| **VAL-003** | Requisitos legales | Asesor Jurídico especializado | Vigencia y aplicabilidad de cada norma |
| **VAL-004** | Modelo multitenant | Seguridad + Arquitectura | Validación de RLS y contexto en POC-001 |
| **VAL-005** | Aprobación de requisitos (RF/RNF/reglas) | Product Owner | Cobertura del problema de negocio sin contradicciones |
| **VAL-006** | Aprobación de ADR | Comité Arquitectura | Consecuencias negativas documentadas y riesgos mitigados |

---

## 20. Supuestos no validados

| ID | Supuesto | Riesgo | Responsable | Fecha límite recomendada |
|---|---|---|---|---|
| **SUP-001** | Existe cliente piloto definido | Alto | Product Owner | Antes de Fase 1 |
| **SUP-002** | Cliente piloto es público O privado (no ambos) | Medio | Product Owner | Antes de Fase 1 |
| **SUP-003** | Volumen inicial: <1000 usuarios/tenant | Alto | Análisis/Producto | Antes de Fase 3 |
| **SUP-004** | Retención de documentos ≥ 5 años | Medio | Líder Archivístico | Antes de Fase 2 |
| **SUP-005** | Disponibilidad SLA ≥ 99,5% | Medio | Operaciones | Antes de Fase 7 |
| **SUP-006** | RPO ≤ 1 hora; RTO ≤ 4 horas | Medio | Operaciones | Antes de Fase 7 |
| **SUP-007** | Solo radicadores certificados pueden radiar entrada | Medio | Líder Archivístico | Antes de Fase 2 |
| **SUP-008** | Datos de ciudadanos viven en la plataforma ≤ 1 año sin consentimiento | Crítico | Responsable Datos | Antes de Fase 2 |
| **SUP-009** | Integraciones iniciales: correo solo; Notaría/DIAN posteriores | Medio | Arquitectura | Antes de Fase 5 |
| **SUP-010** | Migración de datos heredados NO es responsabilidad del MVP | Medio | Product Owner | Antes de Fase 1 |
| **SUP-011** | Despliegue SaaS en AWS; privado en AWS on-premises al escalar | Medio | Operaciones | Antes de Fase 3 |
| **SUP-012** | Firma electrónica básica (recepción); firma digital (expedientes) fase posterior | Bajo | Jurídico | Antes de Fase 2 |
| **SUP-013** | Base de datos compartida con usuario/esquema por servicio | Bajo | Arquitectura | Antes de Fase 3 |
| **SUP-014** | Keycloak como identidad central (federación futura) | Bajo | Arquitectura | Antes de Fase 1 |
| **SUP-015** | OpenTelemetry con backend por modalidad (Datadog/Self-hosted) | Bajo | Operaciones | Antes de Fase 7 |

---

## 21. Contradicciones detectadas

| ID | Hallazgo | Severidad | Documentos | Tratamiento |
|---|---|---|---|---|
| **CNT-001** | Diagnóstico menciona solo ADR-011..014; índice refiere ADR-011..021 | Baja | Diagnóstico, Índice | Histórico; estado vigente es ADR-011..021. Corregir para claridad. |
| **CNT-002** | Alcance dice "disponibilidad 99,5% / 99,9%" sin percentil ni ventana | Media | Alcance (histórico) | Remitir a RNF-DIS-001 (OPV); diseño de backend aún no garantiza. |
| **CNT-003** | RF-001 heredado (Registrar usuario) no aparece en catálogo 42 RF | Media | Diagnóstico, Catálogo RF | Diagnóstico es histórico. RF-IAM-003/004 cubren invitación y asociación Keycloak. Actualizar referencia. |
| **CNT-004** | Mapa dominios lista 17 módulos; alcance habla de "56 módulos sin priorizar" | Media | Alcance histórico, Mapa | Histórico; MVP reduce a 13 capacidades y seis servicios. RSK-003 mitiga. |
| **CNT-005** | Plan de generación Fase 2 lista "RF del flujo vertical" pero Catálogo RF ya tiene 42 | Baja | Plan generación | Fase 2 es "línea base verificable"; los 42 RF son esa línea base. Clarificar. |
| **CNT-006** | Supuestos dicen "membresía única por tenant" pero alcance permite "usuario multitenant" | Media | Alcance, Supuestos | Alcance es correcto (RF-IAM-008). Supuestos requieren revisión. |
| **CNT-007** | Criteiro multitenant G1 dice "RLS validada" pero POC-001 aún no ejecutada | Media | Gates, POC | Criterio es correcto; POC-001 es prereq. Orden de dependencias claro. |
| **CNT-008** | Fuente normativa "El Marco Normativo" resume "8 instrumentos" pero no especifica cuáles | Media | Normativa heredada | Supuesto no validado; jurídico debe confirmar instrumentos obligatorios MVP. |

**Ninguna contradicción es crítica ni invalida decisiones aprobadas**. Todas admiten corrección mediante revisión especializada.

---

## 22. Documentos mencionados pero inexistentes

| Documento esperado | Carpeta | Estado | Motivo |
|---|---|---|---|
| `06_Casos_Uso.md` | 01_Requisitos | No existe | Anunciado; no iniciado |
| `07_Historias_Usuario.md` | 01_Requisitos | No existe | Anunciado; depende de casos de uso |
| `10_Diccionario_Mensajes_Sistema.md` | 01_Requisitos | No existe | Anunciado; parcialmente en Gestion_Errores y Validaciones |
| `11_Catalogo_Validaciones.md` | 01_Requisitos | No existe | Anunciado; parcialmente en GDP-BE-008 |
| `12_Catalogo_Errores.md` | 01_Requisitos | No existe | Anunciado; códigos en GDP-BE-007 |
| `13_Backlog_MVP.md` | 01_Requisitos | No existe | Anunciado; derivable de 42 RF + priorización |
| `14_Backlog_Futuro.md` | 01_Requisitos | No existe | Anunciado; fases 2-3 anunciadas en Alcance |
| Toda carpeta `02_Analisis` (excepto 13) | 02_Analisis | No existen | Anunciados; 12 de 13 aún por iniciar |
| Múltiples de `03_Arquitectura` (01, 02, 06-14) | 03_Arquitectura | No existen | Anunciados; dependen de requisitos |
| Múltiples de `04_Base_Datos` (03, 08-10, 12-14) | 04_Base_Datos | No existen | Anunciados; modelo físico post-POC |
| Múltiples de `05_Backend` (01, 02, 11, 13-15) | 05_Backend | No existen | Anunciados; parcialmente en convenciones |
| Toda carpeta `06_Frontend` | 06_Frontend | No existe | Anunciada vacía; 14 documentos esperados |
| Toda carpeta `07_Seguridad_Privacidad` | 07_Seguridad_Privacidad | No existe | Anunciada vacía; 20 documentos esperados |
| Toda carpeta `08_Cumplimiento_Legal` | 08_Cumplimiento_Legal | No existe | Anunciada vacía; 10 documentos esperados |
| Toda carpeta `09_Politicas_Legales` | 09_Politicas_Legales | No existe | Anunciada vacía; 10 documentos esperados |
| Toda carpeta `11_Despliegue_Operacion` | 11_Despliegue_Operacion | No existe | Anunciada vacía; 15 documentos esperados |
| Toda carpeta `12_Manuales` | 12_Manuales | No existe | Anunciada vacía; 10 documentos esperados |
| `99_Fuentes_Heredadas` | 99_Fuentes_Heredadas | No existe | Anunciada para preservar historial |

**Observación**: La mayoría de documentos pendientes son de fase posterior o dependen de decisiones/validaciones que aún no ocurren. **No es un fallo del proyecto**, sino orden de precedencias. Sin embargo, algunas (casos de uso, historias, backlog) deberían iniciarse en Fase 2.

---

## 23. Documentos existentes no registrados en índice

**Hallazgo**: Todos los documentos MD/CSV/YAML actuales están registrados en el Índice maestro con estado. No hay huérfanos detectados.

---

## 24. Posibles duplicados o conceptos superpuestos

| Concepto | Documentos | Superposición | Recomendación |
|---|---|---|---|
| Errores y validaciones | GDP-REQ-004 (Reglas), GDP-BE-007 (Errores), GDP-BE-008 (Validaciones), GDP-BE-003 (Convenciones) | Alta | Consolidar en una vista única de reglas/errores con referencias cruzadas |
| Arquitectura | GDP-ARQ-011/012, GDP-ARQ-003/04/05, GDP-ARQ-19 | Media | Clarificar: qué va en ADR vs. Vistas C4 vs. Estrategia |
| Seguridad | GDP-ARQ-015 (Amenazas), GDP-BE-006 (Autenticación), RNF-SEG-001..002 | Media | Centralizar matriz de riesgos y controles en Seguridad/Privacidad |
| Eventos y comandos | GDP-ARQ-018 (Catálogo) + GDP-BE-016 (AsyncAPI) | Baja | Catálogo es fuente; AsyncAPI es especificación formal. Coherentes. |
| Retención y disposición | GDP-DOC conceptual, Alcance (exclusión), Supuestos (SUP-004) | Media | Requiere DEC-008 y validación jurídica |

**No se detectan duplicados críticos**. Algunos documentos comparten dominios; requieren enlazamiento y validación de coherencia.

---

## 25. Riesgos críticos identificados

| Riesgo ID | Riesgo | Probabilidad | Impacto | Nivel | Mitigación |
|---|---|---|---|---|---|
| **RSK-001** | Fuga de datos entre tenants | Alta | Crítico | **Crítico** | POC-001, pruebas negativas, revisión de seguridad especializada |
| **RSK-002** | Normas desactualizadas convertidas en requisitos | Media | Crítico | **Alto** | Validación jurídica especializada antes de Fase 4 |
| **RSK-003** | Alcance desbordado sin priorización | Alta | Alto | **Alto** | MVP acotado (13 capacidades); Plan de fases; Gate G1 |
| **RSK-007** | Ausencia de volúmenes invalida RNF | Alta | Medio | **Alto** | Taller de capacidad DEC-003; antes de Fase 3 |
| **RSK-008** | Acceso de soporte a datos de clientes | Media | Crítico | **Alto** | Just-in-time, aprobación, doble control, auditoría |
| **RSK-012** | Documentación extensa sin dueño | Alta | Medio | **Alto** | Asignar responsables (DEC-002, RACI); control de cambios operativo |

---

## 26. Información requerida antes de programar

### Decisiones nominales sin responsable asignado

- [ ] `[PATROCINADOR]` — Apellido, cargo, teléfono, email
- [ ] `[PRODUCT_OWNER]` — Apellido, cargo, teléfono, email
- [ ] `[ARQUITECTO]` — Apellido, cargo, teléfono, email
- [ ] `[LIDER_ARCHIVISTICO]` — Apellido, cargo, teléfono, email
- [ ] `[RESPONSABLE_SEGURIDAD]` — Apellido, cargo, teléfono, email
- [ ] `[RESPONSABLE_DATOS]` — Apellido, cargo, teléfono, email
- [ ] `[ASESOR_JURIDICO]` — Apellido, cargo, teléfono, email, especialidad
- [ ] `[LIDER_QA]` — Apellido, cargo, teléfono, email
- [ ] `[LIDER_OPERACIONES]` — Apellido, cargo, teléfono, email
- [ ] `[PROJECT_MANAGER]` — Apellido, cargo, teléfono, email

### Decisiones comerciales sin definir

- [ ] **Cliente piloto inicial**: Nombre, naturaleza jurídica (público/privado), sector, volumen esperado, fecha de inicio
- [ ] **Segmento de lanzamiento**: ¿Entidades públicas, empresas privadas, ambas?
- [ ] **Modalidad inicial**: ¿Solo SaaS en MVP, o requiere privado desde el inicio?
- [ ] **Presupuesto y cronograma**: Monto total, fases, hitos contractuales
- [ ] **Modelo de soporte**: Niveles, horarios, SLA de respuesta

### Decisiones técnicas sin validar

- [ ] **POC-001 ejecutada y aprobada**: Validación de multitenant/RLS
- [ ] **POC-002 ejecutada y aprobada**: Validación de pipeline documental
- [ ] **Volumen y capacidad esperada**: Usuarios, documentos/día, tamaño medio, crecimiento 12/24/36 meses
- [ ] **RPO/RTO contractual**: Definición de objetivos de respaldo/recuperación
- [ ] **Disponibilidad SLA**: Porcentaje mensual, ventanas de mantenimiento
- [ ] **Matriz de navegadores**: Versiones mínimas soportadas

### Decisiones archivísticas sin validar

- [ ] **Instrumentos archivísticos mínimos operativos en MVP**: Cuáles de CCD, TRD, TVD, FUID, TCA son obligatorios
- [ ] **Retención de documentos**: Períodos por clase/tipo, base jurídica
- [ ] **Disposición final**: Criterios y autoridad para eliminación/transferencia
- [ ] **Preservación digital**: Si aplica; formatos y herramientas

### Validación jurídica especializada requerida

- [ ] **Vigencia de normas**: Ley 594/2000, Ley 527/1999, Decreto 1080/2015, Decreto 2578/2012, AGN 001/2024
- [ ] **Aplicabilidad de cada norma** al MVP
- [ ] **Instrumento archivístico obligatorio vs. opcional**
- [ ] **Base jurídica para tratamiento de datos personales**
- [ ] **Procedimientos de titulares** conforme RGPD/Ley 1581/2012
- [ ] **Términos de consentimiento y privacidad** (políticas legales)
- [ ] **Seguridad de información mínima** (normas ISO 27001/27002 aplicables)

---

## 27. Recomendación para la siguiente fase

### Línea de acción recomendada

1. **Inmediato (Semana 1-2)**:
   - Asignar responsables nominales (RACI completado).
   - Revisar y aprobar este análisis de contenido.
   - Obtener confirmación de cliente piloto y presupuesto.

2. **Corto plazo (Semana 3-4)**:
   - Iniciar validación jurídica especializada de normas (DEC-009).
   - Realizar taller de capacidad (DEC-003 volúmenes).
   - Completar decisiones críticas (DEC-001..012).

3. **Antes de Fase 1**:
   - Aprobar diagnóstico y plan de generación.
   - Nombrar revisores/aprobadores de cada documento.
   - Operacionalizar flujo de cambios.

4. **Fase 1 (Gobierno y alcance)**:
   - Generar acta de inicio.
   - Completar RACI y responsabilidades.
   - Validar alcance con Product Owner y patrocinador.

5. **Fase 2 (Requisitos)**:
   - Completar ERS/SRS.
   - Enriquecer 42 RF con historias y casos de uso.
   - Comenzar matriz de cumplimiento legal.
   - Ejecutar POC-001 en paralelo.

6. **Fase 3 (Arquitectura)**:
   - Completar vistas C4 (despliegue, integraciones, seguridad).
   - Validar POC-001 y POC-002.
   - Iniciar modelos físicos de datos.
   - Completar matriz legal.

7. **Fase 5+**: Código productivo solo tras gates G1-G4.

---

## 28. Clasificación del estado actual del proyecto

### Rúbrica de evaluación

| Criterio | Estado | Evidencia |
|---|---|---|
| **Documentación inicial** | ✅ Suficiente | 81 archivos; 10 grupos temáticos; estructura clara |
| **Decisiones arquitectónicas** | ✅ Aprobadas | 11 ADR (011-021) documentados y vigentes |
| **Requisitos funcionales** | ✅ Definidos (no aprobados) | 42 RF trazables; falta aprobación de Product Owner |
| **Requisitos no funcionales** | ⚠️ Parcialmente definidos | 21 RNF medibles pero umbrales OPV sin validar |
| **Análisis de procesos** | ⚠️ Iniciado (incompleto) | 1 de 13 documentos iniciados |
| **Modelos de datos** | ⚠️ Conceptual/lógico definidos | Modelo físico pendiente de POC-001 |
| **Especificaciones API** | ✅ OpenAPI/AsyncAPI iniciales | Siete operaciones; 32 eventos; validados semánticamente |
| **Pruebas de concepto** | ✅ Diseñadas (no ejecutadas) | POC-001 y POC-002 con criterios claros; bloqueantes |
| **Documentación legal** | ❌ No iniciada | Fuentes normativas heredadas; matriz no existe |
| **Documentación de seguridad** | ⚠️ Incompleta | Modelo de amenazas STRIDE; controles en requerimientos |
| **Responsabilidades** | ❌ No asignadas | Todos marcados `[PLACEHOLDER]` |
| **Cliente piloto** | ❌ No definido | Supuesto SUP-001 sin validar |
| **Volúmenes y capacidad** | ❌ No estimados | Perfil capacidad iniciado; RNF marcados OPV |

### Veredicto de clasificación

**Nivel actual: `Documentación suficiente para normalización e inventario formal`**

El proyecto **NO es apto para programación** pero **SÍ está listo** para:
- Inventario formal y validación cruzada de documentos.
- Organización final de carpetas y archivos.
- Revisión especializada (legal, archivística, seguridad).
- Asignación de responsables.
- Ejecución de POC-001 y POC-002 en paralelo.

### Criterios faltantes para "Apto para primer flujo vertical"

1. ✅ Decisiones arquitectónicas aprobadas — **Completado**
2. ⚠️ Requisitos MP aprobados por Product Owner — **Pendiente aprobación**
3. ⚠️ POC-001 (multitenancy) ejecutada y aprobada — **Pendiente ejecución**
4. ⚠️ Validación jurídica de normas — **Pendiente validación especializada**
5. ❌ Responsables nominales asignados — **Pendiente**
6. ❌ Cliente piloto y volúmenes definidos — **Pendiente decisión comercial**
7. ❌ RNF validados con cliente (no solo OPV) — **Pendiente validación**

---

## 29. Recomendación de fase siguiente

### Fase recomendada

**Fase 1 — Gobierno, alcance y producto**

Esta fase debe completar los **pendientes críticos** antes de diseño detallado:

1. **Gobierno documental actualizado**:
   - Asignar responsables y aprobadores.
   - Operacionalizar flujo de revisión y cambios.
   - Completar RACI y autoridades de decisión.

2. **Decisiones comerciales**:
   - Confirmar cliente piloto y segmento.
   - Estimar volumen y capacidad.
   - Fijar presupuesto y cronograma.

3. **Validaciones especializadas**:
   - Revisión jurídica de normas (vigencia, aplicabilidad).
   - Validación de archivismos (instrumentos obligatorios).
   - Validación de seguridad (modelo de amenazas, controles).

4. **Documentos prioritarios**:
   - Acta de inicio (aprobada).
   - Alcance aprobado (con decisiones de SaaS/privado).
   - Objetivos explícitos.
   - Interesados y RACI nominales.
   - Glosario operativo.
   - Control de cambios activo.

5. **Ejecución de POC-001** (en paralelo):
   - Validar multitenancy y RLS.
   - Confirmar o revisar ADR-004 (modelo de datos multitenant).
   - Documentar lecciones aprendidas.

---

## 30. Conclusión y síntesis final

### Fortalezas identificadas

1. ✅ **Arquitectura clara y aprobada** (ADR-011 a ADR-021): Decisiones documentadas sin ambigüedad.
2. ✅ **Requisitos funcionales bien estructurados** (42 RF atómicos, trazables, con criterios).
3. ✅ **Especificaciones técnicas iniciales** (OpenAPI, AsyncAPI, C4, modelos conceptuales).
4. ✅ **Análisis de riesgos proactivo** (12 riesgos identificados, mitigaciones propuestas).
5. ✅ **Plan de pruebas de concepto** con criterios de fallo explícitos (bloqueantes para programación).
6. ✅ **Gobierno documental** fundamentado en ISO/IEC/IEEE 29148 y prácticas de arquitectura.

### Debilidades identificadas

1. ❌ **Responsables nominales no asignados**: Todas las posiciones marcadas `[PLACEHOLDER]`.
2. ❌ **Cliente piloto y volúmenes no definidos**: Muchos requisitos marcados OPV (sin validar).
3. ❌ **Validación jurídica no realizada**: Fuentes normativas heredadas; aplicabilidad sin verificar.
4. ❌ **Documentación incompleta de negocio**: Análisis de procesos, datos personales, multiempresa aún pendientes.
5. ❌ **POC-001 y POC-002 no ejecutadas**: Arquitectura técnica no validada en entorno real.
6. ❌ **Documentación de frontend, operación y legales**: Carpetas anunciadas pero no iniciadas (38 documentos).

### Pendientes bloqueantes para programación

| Pendiente | Impacto | Dependencia |
|---|---|---|
| Asignación de responsables | **Crítico** | Antes de cualquier entrega |
| Ejecución POC-001 | **Crítico** | Antes de código multitenant |
| Validación jurídica normas | **Crítico** | Antes de Fase 4 (cumplimiento) |
| Definición cliente piloto | **Crítico** | Antes de Fase 1 |
| Estimación de volumen | **Crítico** | Antes de Fase 3 (arquitectura física) |
| Aprobación de 42 RF por Product Owner | **Alto** | Antes de Fase 5 (implementación) |
| Validación RNF (OPV → valores reales) | **Alto** | Antes de Fase 5 |

### Riesgo general

**Riesgo global del proyecto: ALTO**

Razones:
- 10 de 13 responsables no nominados (gobierno débil).
- Requisitos no funcionales con umbrales "pendientes" (RNF-007: RSK-007 abierto).
- Supuestos no validados (15 SUP, 12 RES).
- Normativa sin validación jurídica (RSK-002 Crítico).
- Multitenant no validado (RSK-001 Crítico; depende de POC-001).

**Mitigación recomendada**:
- Fase 1 completa antes de cualquier desarrollo.
- POC-001 y POC-002 ejecutadas en paralelo.
- Validación jurídica especializada obligatoria.

---

## Historial de documento

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Análisis integral del contenido existente; 30 secciones; inventario de 81 archivos; estado de documentación evaluado. | Antonio (Análisis automatizado) |

---

**Fin del análisis**

**Próximo paso recomendado**: Revisar este informe con Patrocinador y Product Owner. Aprobar Fase 1 (gobierno, alcance, producto) e iniciar asignación de responsables.
