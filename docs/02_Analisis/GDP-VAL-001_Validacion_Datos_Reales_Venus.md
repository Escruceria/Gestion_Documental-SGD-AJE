# Validación — Datos Reales vs. Supuestos del Acta

| Campo | Valor | Acta | Real | Delta | Criticidad |
|---|---|---|---|---|---|
| **Usuarios activos internos** | 45 | 45 | 35 | -10 (22% menos) | 🟡 Moderada |
| **Usuarios externos** | 0 | 0 | 5 | +5 (NUEVO) | 🟡 Moderada |
| **Total usuarios** | 45 | 45 | 40 | -5 (11% menos) | ✅ Bajo |
| **Ingreso docs/día** | 1.000 | 1.000 | 80 | -920 (92% menos) | 🔴 CRÍTICA |
| **Tamaño promedio (MB)** | 1 | 1 | 1.8 | +0.8 (80% más) | 🟡 Moderada |
| **Crecimiento anual** | 30% | 30% | 20-25% | -5-10 pp | ✅ Bajo |
| **RPO** | 4h | 4h | 4h | 0 | ✅ Bajo |
| **RTO** | 8h | 8h | 8h | 0 | ✅ Bajo |
| **SLA disponibilidad** | 99.5% | 99.5% | 99.5% | 0 | ✅ Bajo |

---

## SECCIÓN 1: DATOS OPERACIONALES — ANÁLISIS DETALLADO

### 1.1 Usuarios y estructura organizacional

**Real vs. Acta:**
- Acta asumió 45 usuarios
- Real: 35 usuarios internos + 5 externos ocasionales = 40 total
- **Impacto:** Licencias, configuración Keycloak, gestión de memberships — escalable hacia arriba, no hacia abajo

**Distribución real por departamento:**
```
Gerencia: 2
Gestión documental: 3
Administración y contabilidad: 5
Recursos humanos: 3
Desarrollo de software: 10  ← Mayor concentración
Soporte técnico: 5
Comercial: 4
Jurídica: 1
Dirección de proyectos: 2
Total: 35
```

**Hallazgo crítico:** Desarrollo (10 usuarios) y Soporte (5) = 42% del uso. RLS y permisos deben priorizar estos departamentos.

**Roles especiales encontrados (NO EN LOS 4 ROLES BASE):**
- Auditor de consulta
- Responsable de protección de datos
- Aprobador jurídico
- Usuario externo temporal
- Administrador de tablas de retención documental

**Acción requerida:** Extender modelo de roles en GDP-DAT-003 o crear roles custom en Keycloak.

---

### 1.2 Volúmenes documentales — DELTA CRÍTICA 🔴

| Métrica | Acta | Real | % Diferencia | Riesgo |
|---------|------|------|--------------|--------|
| Acervo actual | 5.000 docs | 28.500 docs | +470% | SOBRE-PROVISIONAMIENTO EN DISEÑO |
| Ingreso diario | 1.000 docs/día | 80 docs/día | -92% | SOBRE-DIMENSIONAMIENTO INFRAESTRUCTURA |
| Tamaño promedio | 1 MB | 1.8 MB | +80% | CAPACIDAD ALMACENAMIENTO +80% REAL |
| Archivos > 50 MB | Desconocido | 15 archivos | Bajo volumen | Manejo casos especiales |

**Análisis crítico:**

1. **Ingreso diario: 1.000 vs. 80**
   - Acta asumió 1.000 docs/día (¿basado en qué?)
   - Real: 80 docs/día = 400 docs/semana = 1.600 docs/mes
   - **Proyección anual:** 1.600 × 12 = 19.200 docs/año
   - A 25% crecimiento: año 2 = 24.000, año 3 = 30.000 (cercano a actual)

2. **Acervo actual: 5.000 vs. 28.500**
   - Acta asumió 5.000 (baseline mínimo)
   - Real: 28.500 (casi 6 años de historia acumulada)
   - **Migración:** Necesitará OCR, clasificación retroactiva, cuarentena temporal

3. **Tamaño promedio: 1 MB vs. 1.8 MB**
   - Aumenta capacidad S3/MinIO estimada
   - 28.500 × 1.8 MB = 51.3 GB de acervo actual
   - Con crecimiento 25% anual: año 5 = 91.5 GB

**Impacto en decisiones técnicas:**
- ✅ RabbitMQ/AWS SQS: REDUCCIÓN de volumen de mensajes (80 docs/día vs 1.000)
- ✅ Indexación full-text: Búsqueda en 28.500 docs, no 5.000 (más realista)
- ✅ RLS performance: Mejor, pues menos escrituras/día
- ⚠️ Migración: **NUEVO RIESGO** — necesita estrategia para acervo existente
- ⚠️ Testing: Escenarios de volumen son DIFERENTES; k6 debe usar 80 docs/día, no 1.000

---

### 1.3 Radicaciones de comunicaciones — HALLAZGO NUEVO

**No contemplado en Acta:**

| Tipo | Promedio/día | Acta dijo |
|------|------|----------|
| **Entrada** | 23/día | "300/día" ??? |
| **Salida** | 16/día | "200/día" ??? |
| **Internas** | 10/día | "No consideradas" |
| **Total** | 49/día | "500/día" (FANTASÍA) |

**Análisis:**
- Acta proyectó 300 entrada + 200 salida = 500/día
- Real: 23 + 16 + 10 = 49/día (90% MENOS)
- **Proporción:** Entrada 47%, Salida 33%, Internas 20%

**Impacto:**
- Workflow correspondence-workflow-service está sobre-dimensionado
- Testing e2e de radicación: usar 23/día entrada, no 300
- k6 load testing: reducir volumen de radicaciones a 10% de lo planeado
- SQS/EventBridge: sobra capacidad

---

### 1.4 Expedientes

| Métrica | Acta | Real |
|---------|------|------|
| Abiertos | 5.000 | 420 |
| Cerrados/mes | N/A | 35 |
| Perdidos | Desconocido | 8 |

**Hallazgo crítico:**
- Venus tiene **420 expedientes abiertos**, no 5.000
- Perdidos: 8 expedientes = 1.9% de tasa de pérdida
- Causa: "almacenamiento en carpetas personales, nomenclatura inconsistente"

**Acción:** Crear módulo de "búsqueda de expedientes perdidos" como requisito durante migración.

---

## SECCIÓN 2: PROCESOS AS-IS — VALIDACIÓN

### 2.1 Radicación de entrada

**Tiempo promedio:** 1 h 30 min (aceptable)

**Problema encontrado:** Pérdida de documentos
- Frecuencia: 1-2 veces/mes
- Causa: "documentos por correo/mensaje instantáneo no trasladados oportunamente al repositorio"
- **Acción:** Requiere workflow de "confirmación de radicación" con escalamiento si > 30 min

### 2.2 Búsqueda de documentos 🔴 CRÍTICA

| Métrica | Valor |
|---------|-------|
| Tiempo promedio | 8 minutos |
| Top 3 criterios | 1. Radicación, 2. Asunto, 3. Responsable |
| Búsquedas fallidas | 7% |

**Impacto en requisitos:**
- **GDP-REQ-029** "Búsqueda avanzada": CRÍTICA
- Full-text search debe ser RÁPIDO (8 min baseline debe ser 2-3 min en SGD)
- Elasticsearch/OpenSearch: **RECOMENDADO** aunque no está en ADRs

### 2.3 Disposición y retención 🔴 CRÍTICA

**Tabla de retención:**
- No existe formalizada
- Pendiente de validación antes de Producción
- Rangos actuales: 1-5 años según serie

**Series que NUNCA se eliminan:**
- Actas de órganos directivos
- Documentos constitutivos
- Estados financieros aprobados
- Contratos especiales
- Documentación histórica

**Acción:** Necesita **Taller de Retención** con LÍDER ARCHIVÍSTICO de Venus antes de migración.

---

## SECCIÓN 3: INFRAESTRUCTURA — HALLAZGOS DE RIESGO

### 3.1 Almacenamiento fragmentado 🔴 CRÍTICA

**Ubicación actual:**
- Servidor local
- Carpetas compartidas de red
- Google Drive
- Equipos personales (RIESGO)
- Correos electrónicos (RIESGO)

**Capacidad:**
- Total: 8 TB
- Usado: 4 TB (50%)
- Cifrado: Parcial (solo algunos)

**Riesgos identificados:**
1. **Datos personales sin cifrar** en equipos locales
2. **Duplicación** entre servidor, Drive y personal
3. **Conocimiento tribal** — algunos responsables son "los únicos" que saben dónde están documentos
4. **Cumplimiento LSRPD:** No está garantizado en equipos personales

**Acción urgente:** Realizar auditoría de datos personales antes de activar SGD.

### 3.2 Copias de seguridad

- Frecuencia: Incremental diaria + completa semanal
- Cantidad: 2 copias
- Problemas históricos: 
  - Marzo 2018: Daño de disco
  - Octubre 2021: Carpeta personal sin copia

**Acción:** Validar backups con RPO 4h y RTO 8h antes de Go.

### 3.3 Autenticación fragmentada

**Actual:**
- Cuentas locales
- Microsoft 365
- Google Workspace
- MFA: Solo en AWS

**Hallazgo crítico:**
- No hay centralización
- Accesos heredados sin revocar
- Carpetas antiguas compartidas públicamente

**Acción:** Keycloak debe ser **punto único de verdad** post-migración. Sincronización con AD/Microsoft 365 necesaria.

---

## SECCIÓN 4: NORMATIVA Y SEGURIDAD

### 4.1 Requisitos legales aplicables

✅ Normativa comercial
✅ Normativa laboral
✅ Normativa tributaria
✅ LSRPD (Ley protección datos personales)
✅ Conservación de documentos electrónicos
✅ Normas archivísticas
✅ Requisitos contractuales

**Acción:** Crear matriz normativa vinculada a cada serie documental.

### 4.2 Datos personales — DPIA PENDIENTE

**No existe DPIA formal.**

**Tipos de datos almacenados:**
- Nombres, cédulas, direcciones
- Correos, teléfonos
- Datos laborales (expedientes)
- Datos financieros
- Firmas
- Hojas de vida

**Responsable de Protección de Datos:** Álvaro Patiño Cruz
- Email: alvaropatcruz10@gmail.com

**Acción crítica:** 
- ✅ Elaborar DPIA antes de Producción
- ✅ Documentar consentimientos
- ✅ Configurar retención de datos personales
- ✅ Implementar derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)

---

## SECCIÓN 5: VALIDACIÓN DE SUPUESTOS

### **Diferencias halladas:**

| Supuesto | Acta | Real | Status | Impacto |
|----------|------|------|--------|--------|
| **Usuarios** | 45 | 40 | ✅ Aceptable | Bajo (5 menos es escalable) |
| **Documentos/día** | 1.000 | 80 | 🔴 CRÍTICA | Sobre-dimensionamiento arquitectura |
| **Tamaño promedio** | 1 MB | 1.8 MB | 🟡 Moderada | +80% almacenamiento real |
| **Crecimiento anual** | 30% | 20-25% | ✅ Aceptable | Más conservador (mejor) |
| **RPO** | 4h | 4h | ✅ Exacto | ✅ |
| **RTO** | 8h | 8h | ✅ Exacto | ✅ |
| **SLA** | 99.5% | 99.5% | ✅ Exacto | ✅ |

---

## RIESGOS OPERACIONALES ENCONTRADOS

### 🔴 CRÍTICOS

1. **Migración de acervo histórico (28.500 docs)**
   - Almacenados en múltiples ubicaciones
   - Sin metadatos normalizados
   - Necesita OCR, clasificación retroactiva
   - **Esfuerzo:** 3-4 semanas, requiere equipo dedicado
   - **Acción:** Incluir en cronograma POC-002

2. **Almacenamiento fragmentado sin gobernanza**
   - Datos personales en equipos sin cifrar
   - LSRPD en riesgo
   - **Acción:** Auditoría de privacidad ANTES de migración

3. **Tablas de retención no formalizadas**
   - Serán críticas para disposición post-migración
   - **Acción:** Taller de retención con archivista antes de Producción

4. **Pérdida de documentos (1-2 veces/mes)**
   - Causa: Workflow manual sin confirmación
   - **Acción:** Workflow radicación debe incluir "confirmación recibida"

### 🟡 MODERADOS

1. **Accesos heredados sin revocar**
   - Carpetas compartidas públicas
   - Enlaces antiguos
   - **Acción:** Limpieza pre-migración

2. **MFA solo en AWS (no generalizado)**
   - **Acción:** Habilitarlo en Keycloak para todos

3. **Búsquedas con 7% de fracaso**
   - Mejora esperada con full-text search del SGD
   - **Target:** < 2%

---

## IMPACTO EN DECISIONES TÉCNICAS (ADRs)

### ADR-014: Mensajería (AWS SQS / RabbitMQ)
- **Cambio:** Reducir estimado de throughput 90% (1.000 → 80 docs/día)
- **Impacto:** RabbitMQ es suficiente incluso para instalaciones privadas

### ADR-016: Almacenamiento (S3 / MinIO)
- **Cambio:** Ajustar capacidad estimada
  - Acervo actual: 51 GB (vs. 5 GB estimado)
  - Año 5 proyectado: 92 GB (vs. 50 GB estimado)
- **Impacto:** S3/MinIO 100 GB para primeros 5 años es adecuado

### ADR-019: Testing (k6 load)
- **Cambio:** Volúmenes de prueba deben usar 80 docs/día, no 1.000
- **Impacto:** Escenarios de carga serán 90% menores

---

## DATOS FALTANTES O PENDIENTES

| Documento | Status | Acción |
|-----------|--------|--------|
| Tabla de retención formalizada | Pendiente | Taller retención con archivista |
| Diagrama infraestructura IT | Pendiente | Solicitar a responsable TI |
| DPIA (Evaluación privacidad) | **No existe** | Elaborar antes Producción |
| Procedimiento radicación formalizado | Pendiente | Documentar actual + mejorar |
| Configuración autenticación (AD/LDAP) | Pendiente | Solicitar a responsable TI |

---

## CRONOGRAMA IMPACTADO

| Fase | Cambio | Nuevo ETI |
|------|--------|----------|
| **POC-001** | Reducir volumen test radicaciones | No impacta inicio |
| **POC-002** | Agregar taller retención + DPIA | +1-2 semanas |
| **Pre-Producción** | Migración acervo histórico | +3-4 semanas |
| **Producción** | Ir con 28.500 docs + 80 docs/día | Adelanta 2026-10-15 |

---

## RECOMENDACIONES

### Corto plazo (2026-08)
1. ✅ Validar datos Venus en taller con responsables
2. ✅ Confirmar tablas de retención reales
3. ✅ Auditar datos personales por LSRPD
4. ✅ Documentar autenticación actual (AD/LDAP)

### Mediano plazo (2026-09)
1. Elaborar DPIA formal
2. Diseñar estrategia de migración acervo (28.500 docs)
3. Taller de retención con archivista
4. Limpieza de accesos heredados

### Largo plazo (2026-10 en adelante)
1. Migración graduada de acervo histórico
2. Sincronización Keycloak ↔ AD/Microsoft 365
3. Implementación full-text search optimizado

---

## HISTORIAL

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | 2026-09-15 | Validación datos reales Venus vs. Acta: 8 secciones, 40 hallazgos, 4 críticos. | Antonio José Escrucería Uribe |
