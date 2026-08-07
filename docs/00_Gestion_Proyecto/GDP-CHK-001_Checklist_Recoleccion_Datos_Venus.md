# Checklist — Recolección de Datos con Venus Ingeniería

| Campo | Valor |
|---|---|
| Código | GDP-CHK-001 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-Validación) |
| Fecha | 2026-08-06 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Responsable ejecución | José Sergio Arias Orizco (Cliente) |
| Fecha límite | 2026-09-15 (antes de POC-001 kick-off) |
| Criticidad | **CRÍTICA** — Sin estos datos NO se autoriza desarrollo |

---

## Propósito

Validar que todos los supuestos del Acta v1.0 y análisis AS-IS coincidan con la realidad operativa de Venus, ANTES de que el equipo técnico inicie desarrollo POC-001.

---

## SECCIÓN 1: Validación de Datos Operacionales

### 1.1 Usuarios y Estructura Organizacional

**Datos a recolectar:**

| Item | Pregunta | Formato | Criticidad | Responsable Venus |
|---|---|---|---|---|
| 1.1.1 | ¿Cuántos usuarios ACTIVOS hay realmente hoy? (No estimado) | Número exacto | 🔴 CRÍTICA | Admin IT |
| 1.1.2 | ¿Cuál es la distribución actual por departamento/rol? | Tabla: Dpto, Usuarios, Roles | 🔴 CRÍTICA | Admin IT |
| 1.1.3 | ¿Cuántos usuarios se añaden/eliminan por mes promedio? | Número + historias últimos 6 meses | 🟡 IMPORTANTE | Admin IT |
| 1.1.4 | ¿Hay subcontratos o usuarios externos (clientes, proveedores)? | Sí/No + cantidad | 🟡 IMPORTANTE | Admin IT |
| 1.1.5 | ¿Cuál es el tiempo promedio de vida del usuario (rotación)? | Meses | 🟡 IMPORTANTE | RRHH |
| 1.1.6 | ¿Existen roles/permisos que NO podemos representar en 4 roles base? | Descripción | 🔴 CRÍTICA | Gerencia |

**Formato entrega:** Archivo Excel/CSV con estructura actual de usuarios

---

### 1.2 Volúmenes Documentales Reales

**Datos a recolectar:**

| Item | Pregunta | Acta dice | Validar | Criticidad |
|---|---|---|---|---|
| 1.2.1 | Acervo actual ¿es realmente 5.000 documentos? | 5.000 docs | Cantidad exacta hoy | 🔴 CRÍTICA |
| 1.2.2 | Promedio ingreso/día ¿es 1.000 docs? | 1.000 docs/día | Último mes: mínimo, promedio, máximo | 🔴 CRÍTICA |
| 1.2.3 | Tamaño promedio archivo ¿es 1 MB? | 1 MB | Histograma: 100 archivos recientes | 🟡 IMPORTANTE |
| 1.2.4 | ¿Hay archivos > 50 MB? ¿Cuántos? | N/A | Cantidad + ejemplos | 🟡 IMPORTANTE |
| 1.2.5 | Tipos MIME más comunes ¿cuáles son? | N/A | Distribución top 5 | 🟡 IMPORTANTE |
| 1.2.6 | ¿Hay compresión de archivos (ZIP, RAR)? | No considerado | Sí/No + % | 🟡 IMPORTANTE |

**Formato entrega:** SQL query del acervo actual + Excel con distribución tamaños

---

### 1.3 Radicaciones de Comunicaciones

**Datos a recolectar:**

| Item | Pregunta | Acta dice | Validar | Criticidad |
|---|---|---|---|---|
| 1.3.1 | Entrada/día ¿es realmente 300? | 300/día | Última semana: diaria | 🔴 CRÍTICA |
| 1.3.2 | Salida/día ¿es realmente 200? | 200/día | Última semana: diaria | 🔴 CRÍTICA |
| 1.3.3 | Picos horarios ¿cuándo se concentran? | N/A | Gráfico horario entrada/salida | 🟡 IMPORTANTE |
| 1.3.4 | ¿Cuál es el plazo de respuesta legal/operacional? | N/A | Horas/días para responder | 🔴 CRÍTICA |
| 1.3.5 | ¿Se radicar INTERNAS (entre departamentos)? | No considerado | Cantidad/día | 🟡 IMPORTANTE |
| 1.3.6 | ¿Hay comprobantes de radicación? ¿Qué datos incluyen? | N/A | Ejemplo comprobante actual | 🔴 CRÍTICA |

**Formato entrega:** Registro radicaciones últimas 2 semanas + ejemplo comprobante

---

### 1.4 Expedientes Actuales

**Datos a recolectar:**

| Item | Pregunta | Acta dice | Validar | Criticidad |
|---|---|---|---|---|
| 1.4.1 | ¿Cuántos expedientes están ABIERTOS hoy? | 5.000 | Cantidad exacta | 🔴 CRÍTICA |
| 1.4.2 | ¿Cuántos se CIERRAN por mes promedio? | N/A | Último año: mes a mes | 🟡 IMPORTANTE |
| 1.4.3 | ¿Cuántos documentos promedio por expediente? | N/A | Estadística (mín, prom, máx) | 🟡 IMPORTANTE |
| 1.4.4 | ¿Cómo se indexan expedientes actualmente? (manual) | Manual Excel | ¿Mantenimiento automático? | 🟡 IMPORTANTE |
| 1.4.5 | ¿Hay expedientes "perdidos" o sin seguimiento? | N/A | Sí/No + cantidad estimada | 🔴 CRÍTICA |

**Formato entrega:** Query DB actual de expedientes + estadísticas

---

## SECCIÓN 2: Validación de Procesos AS-IS

### 2.1 Radicación de Entrada

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 2.1.1 | Tiempo promedio de radicación (de recibir a distribuir) | Medir 20 casos | 🟡 IMPORTANTE |
| 2.1.2 | ¿Se pierde documentación durante radicación? ¿Con qué frecuencia? | Histórico problemas | 🔴 CRÍTICA |
| 2.1.3 | ¿Se radicar TODAS las comunicaciones externas o hay excepciones? | Listar excepciones | 🟡 IMPORTANTE |
| 2.1.4 | ¿Se requiere firma de recibido? ¿De quién? | Procedimiento actual | 🟡 IMPORTANTE |
| 2.1.5 | ¿Hay comunicaciones que no se pueden digitalizar? ¿Cuáles? | Ejemplos | 🟡 IMPORTANTE |

**Formato entrega:** Procedimiento escrito + métricas + excepciones

---

### 2.2 Búsqueda de Documentos

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 2.2.1 | ¿Cuánto tiempo tarda EN PROMEDIO encontrar un documento? | Medir 20 búsquedas | 🔴 CRÍTICA |
| 2.2.2 | ¿Por cuál criterio se busca más? (número, asunto, fecha, responsable) | Top 3 criterios | 🟡 IMPORTANTE |
| 2.2.3 | ¿Cuántas búsquedas fallan (no se encuentra el documento)? | % de fracaso mensual | 🔴 CRÍTICA |
| 2.2.4 | ¿Quién tiene acceso a qué documentos? (restricciones actuales) | Matriz acceso por rol | 🔴 CRÍTICA |
| 2.2.5 | ¿Se buscan documentos de expedientes cerrados/archivados? | Sí/No + % | 🟡 IMPORTANTE |

**Formato entrega:** Métricas de búsqueda + matriz de acceso actual

---

### 2.3 Disposición y Retención

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 2.3.1 | ¿Cuántos años se guardan documentos activos antes de archivar? | Por serie/tipo | 🔴 CRÍTICA |
| 2.3.2 | ¿Quién decide disposición? ¿Hay proceso formal? | Responsable + procedimiento | 🔴 CRÍTICA |
| 2.3.3 | ¿Se destruyen documentos? ¿Cómo se certifican? | Procedimiento + certificados | 🔴 CRÍTICA |
| 2.3.4 | ¿Hay documento fijo por ley que NUNCA se puede eliminar? | Lista series/tipos | 🔴 CRÍTICA |
| 2.3.5 | ¿Se han violado plazos de retención? ¿Con qué frecuencia? | Histórico violaciones | 🔴 CRÍTICA |

**Formato entrega:** Tabla retención por serie + procedimiento de destrucción + evidencia legal

---

## SECCIÓN 3: Validación de Infraestructura Actual

### 3.1 Sistemas de Almacenamiento

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 3.1.1 | ¿Dónde se guardan documentos hoy? (servidores, NAS, nube) | Listado ubicaciones | 🔴 CRÍTICA |
| 3.1.2 | ¿Capacidad total disponible? | GB/TB usado vs disponible | 🟡 IMPORTANTE |
| 3.1.3 | ¿Velocidad de lectura/escritura (latencia)? | Benchmarks si disponible | 🟡 IMPORTANTE |
| 3.1.4 | ¿Cifrado de datos en almacenamiento? | Sí/No + tipo | 🔴 CRÍTICA |
| 3.1.5 | ¿Copias de seguridad? ¿Cuántas? ¿Con qué frecuencia? | Procedimiento backup | 🔴 CRÍTICA |
| 3.1.6 | ¿RPO/RTO actual? (punto y tiempo de recuperación) | Horas/días | 🟡 IMPORTANTE |
| 3.1.7 | ¿Se han perdido datos? ¿Cuándo? ¿Por qué? | Histórico | 🔴 CRÍTICA |

**Formato entrega:** Diagrama infraestructura actual + matriz de riesgos

---

### 3.2 Autenticación y Control de Acceso

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 3.2.1 | ¿Qué tecnología se usa hoy? (AD, LDAP, local, otro) | Sistema actual | 🔴 CRÍTICA |
| 3.2.2 | ¿Se integra con Keycloak o es nueva implementación? | Existente sí/no | 🔴 CRÍTICA |
| 3.2.3 | ¿Hay 2FA o MFA? | Sí/No + tipo | 🟡 IMPORTANTE |
| 3.2.4 | ¿Cómo se revocan permisos cuando alguien se va? | Procedimiento | 🔴 CRÍTICA |
| 3.2.5 | ¿Hay acceso "heredado" que nunca se revoca? | Sí/No + casos conocidos | 🔴 CRÍTICA |

**Formato entrega:** Documento técnico AD/LDAP + procedimiento de segregación de funciones

---

## SECCIÓN 4: Validación de Normativa y Seguridad

### 4.1 Requisitos Legales

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 4.1.1 | ¿Qué normativas aplican específicamente? (tributaria, laboral, comercial, otra) | Lista normas + referencias | 🔴 CRÍTICA |
| 4.1.2 | ¿Cuáles son los términos de retención POR SERIE? | Tabla retención por serie | 🔴 CRÍTICA |
| 4.1.3 | ¿Requiere firma electrónica o solo radicación? | Por tipo de comunicación | 🟡 IMPORTANTE |
| 4.1.4 | ¿Hay auditorías externas? ¿Qué exigen? | Tipo auditoría + requisitos | 🔴 CRÍTICA |
| 4.1.5 | ¿Hay multas o sanciones por incumplimiento? | Ejemplos históricos | 🔴 CRÍTICA |
| 4.1.6 | ¿Se aplica LSRPD (Ley de protección datos personales)? | Sí/No + alcance | 🔴 CRÍTICA |

**Formato entrega:** Matriz normativa por serie documental + evidencia legal

---

### 4.2 Datos Personales y Confidencialidad

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 4.2.1 | ¿Qué tipos de datos personales se guardan? | Listado tipos (DPIA) | 🔴 CRÍTICA |
| 4.2.2 | ¿Quiénes son los "interesados"? (empleados, clientes, terceros) | Categorías | 🔴 CRÍTICA |
| 4.2.3 | ¿Hay base jurídica para procesar esos datos? | Sí/No + documentación | 🔴 CRÍTICA |
| 4.2.4 | ¿Hay consentimientos explícitos? | Sí/No + ejemplos | 🔴 CRÍTICA |
| 4.2.5 | ¿Hay Responsable de Protección de Datos? | Nombre + contacto | 🟡 IMPORTANTE |
| 4.2.6 | ¿Se ha realizado DPIA (evaluación impacto privacidad)? | Sí/No | 🔴 CRÍTICA |

**Formato entrega:** DPIA template completado + consentimientos | Contacto DPO

---

## SECCIÓN 5: Validación Técnica Venus

### 5.1 Infraestructura TI

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 5.1.1 | ¿Cuál es el SO de los clientes? (Windows, Mac, Linux) | Distribución | 🟡 IMPORTANTE |
| 5.1.2 | ¿Navegadores soportados? (Chrome, Edge, Safari, Firefox) | Versiones mínimas | 🟡 IMPORTANTE |
| 5.1.3 | ¿Ancho de banda disponible? | Mbps promedio | 🟡 IMPORTANTE |
| 5.1.4 | ¿Disponibilidad esperada hoy vs. esperada en SGD? | % SLA actual vs. propuesto | 🔴 CRÍTICA |
| 5.1.5 | ¿Hay proxy, firewall, filtrado de contenido? | Sí/No + restricciones | 🟡 IMPORTANTE |
| 5.1.6 | ¿Tenemos acceso directo a BD desde AWS/cloud? | Sí/No + VPN/conexión | 🔴 CRÍTICA |

**Formato entrega:** Documento técnico infraestructura Venus

---

### 5.2 Integraciones Necesarias

**Datos a recolectar:**

| Item | Pregunta | Validación requerida | Criticidad |
|---|---|---|---|
| 5.2.1 | ¿Se integra con email? ¿SMTP/IMAP? | Servidor, puertos, credenciales (encriptadas) | 🟡 IMPORTANTE |
| 5.2.2 | ¿Se integra con ERP/CRM/otro sistema? | Sistema + API disponible | 🟡 IMPORTANTE |
| 5.2.3 | ¿Se exportan reportes? ¿A qué formato? | Formatos (Excel, PDF, otro) | 🟡 IMPORTANTE |
| 5.2.4 | ¿Se envían notificaciones vía SMS/WhatsApp? | Sí/No + proveedor | 🟡 IMPORTANTE |
| 5.2.5 | ¿Hay portal para ciudadanos/externos? | Sí/No + alcance futuro | 🟡 IMPORTANTE |

**Formato entrega:** Matriz de integraciones + endpoints/credenciales (seguramente)

---

## SECCIÓN 6: Validación de Supuestos del Acta

### 6.1 Supuestos a Validar

**Supuesto #1: SLA 99.5% mensual**
- [ ] ¿Es aceptable? ¿Operación crítica requiere más?
- [ ] ¿Hay horarios de mantenimiento permitidos?
- [ ] ¿Qué significa "downtime" para Venus? (minutos, horas, días)

**Supuesto #2: 45 usuarios, crecimiento 30% anual**
- [ ] ¿Es realista la proyección?
- [ ] ¿Habrá 60 usuarios en mes 12 del piloto?
- [ ] ¿Cuál es el máximo realista en 36 meses?

**Supuesto #3: 1.000 docs/día, 1 MB promedio**
- [ ] ¿Cifras validadas con datos reales?
- [ ] ¿Hay picos estacionales (ej: fin de mes)?
- [ ] ¿Hay documentos especiales (ej: videos) que distorsionan promedio?

**Supuesto #4: RPO 4h, RTO 8h**
- [ ] ¿Es aceptable perder 4 horas de trabajo?
- [ ] ¿Se puede tolerar 8 horas de indisponibilidad?
- [ ] ¿Hay operaciones que no pueden pausarse?

**Formato entrega:** Documento "Validación de Supuestos del Acta" con Sí/No/observación

---

## SECCIÓN 7: Datos de Contacto y Kick-off

### 7.1 Identificar Contactos Operacionales

| Rol | Nombre | Email | Teléfono | Disponibilidad |
|---|---|---|---|---|
| Sponsor ejecutivo | ? | ? | ? | ? |
| Administrador IT | ? | ? | ? | ? |
| Responsable Documentación | ? | ? | ? | ? |
| DPO (Privacidad) | ? | ? | ? | ? |
| Asesor Legal | ? | ? | ? | ? |
| Usuarios representantes (4 roles) | ? | ? | ? | ? |

**Formato entrega:** Contactos completados + disponibilidad para kick-off

---

### 7.2 Fechas Clave Pre-Desarrollo

| Hito | Fecha | Responsable |
|---|---|---|
| Recolección datos completada | 2026-08-31 | José Sergio (Venus) |
| Validación datos (1 semana) | 2026-09-08 | Álvaro + Óscar (equipo) |
| Resolución de gaps | 2026-09-15 | José Sergio + Equipo |
| Aprobación Go-Live | 2026-09-22 | Wilmar (Patrocinador) |
| Kick-off desarrollo POC-001 | 2026-09-30 | Antonio (Arquitecto) |

---

## SECCIÓN 8: Criterio de Autorización Desarrollo

**Desarrollo POC-001 SÍ se autoriza si y solo si:**

✅ Todas las secciones 1-6 están **100% completadas** con datos verificables.

❌ **NO se autoriza si falta:**
- Validación volúmenes (1.2, 1.3, 1.4)
- Proceso de radicación (2.1)
- Infraestructura BD/acceso (3.1.6, 5.1.6)
- Normativa de retención (4.1.2)
- Datos personales DPIA (4.2.6)
- Supuestos del Acta (6.1)

---

## SECCIÓN 9: Plan de Recolección

**Fase 1 (2026-08-06 a 2026-08-20):**
- [ ] Enviar checklist a José Sergio Arias Orizco
- [ ] Programar 3 talleres de recolección (Operación, IT, Legal)
- [ ] Recibir datos iniciales

**Fase 2 (2026-08-20 a 2026-08-31):**
- [ ] Validar datos (son completos, reales, verificables)
- [ ] Identificar gaps
- [ ] Gestionar seguimiento

**Fase 3 (2026-08-31 a 2026-09-15):**
- [ ] Resolución de gaps
- [ ] Aprobación datos por equipo técnico
- [ ] Autorización Go-Live

---

## Historial

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| 1.0 | 2026-08-06 | Checklist recolección datos: 9 secciones, 50+ items, criterio de autorización claro. | Álvaro Patiño Cruz |
