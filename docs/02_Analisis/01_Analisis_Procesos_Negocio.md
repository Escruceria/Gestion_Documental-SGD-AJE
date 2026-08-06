# Análisis de Procesos de Negocio — Venus Ingeniería AS-IS

| Campo | Valor |
|---|---|
| Código | GDP-ANA-001 |
| Versión | 0.1 |
| Estado | Borrador para validación con cliente |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner, Líder Archivístico) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), José Sergio Arias Orizco (Cliente) |
| Validación requerida | Venus Ingeniería (taller 2026-09-15) |

## Propósito

Mapear cómo **Venus Ingeniería de Software Ltda** gestiona documentos, expedientes, radicaciones y comunicaciones HOY, sin sistema SGD integrado. Identifica procesos, actores, volúmenes, restricciones y dolor actual.

---

## 1. Perfil de Venus Ingeniería

**Empresa:**
- Nombre: Venus Ingeniería de Software Ltda
- Sector: Tecnología / Consultoría TI
- Naturaleza: Privada
- Ubicación: Colombia
- Usuarios estimados: 45
- Documentos en acervo: 5.000
- Contacto piloto: José Sergio Arias Orizco (jsmx0622@gmail.com, 3116308160)

**Operación actual:**
- Modalidad: [⏳ VALIDAR] Papel + email + carpetas compartidas
- Infraestructura: [⏳ VALIDAR] Servidores, NAS, Google Drive, Dropbox
- Normativa aplicable: [⏳ VALIDAR] Retención laboral, tributaria, comercial
- Restricciones de datos: [⏳ VALIDAR] Datos personales empleados, contratos confidenciales

---

## 2. Procesos documentales identificados

**Procesos principales (a validar con Venus):**

### 2.1 Radicación de entrada
- **Disparador:** Comunicación externa (email, correo postal, persona)
- **Actores:** Recepcionista, secretaria, gestor documental
- **Pasos actuales:** [⏳ VALIDAR]
  - Recibir comunicación
  - Registrar en log manual / Excel
  - Fechar y numerar (¿cómo? ¿secuencial? ¿por dependencia?)
  - Distribuir a responsable
  - Mantener expediente físico / digital
- **Salidas:** Comprobante recibido (¿cómo se entrega?)
- **Volumen:** ~300 radicaciones entrada/día (estimado Acta)
- **Restricciones:** [⏳ VALIDAR] Plazo de respuesta, requisitos legales

### 2.2 Radicación de salida
- **Disparador:** Comunicación desde empresa a externa
- **Actores:** Originador, supervisor, gestor, envío
- **Pasos actuales:** [⏳ VALIDAR]
  - Redactar comunicación
  - Supervisar/aprobar
  - Numerar (¿consecutivo único? ¿reinicia por año?)
  - Enviar (email, correo, mesa)
  - Guardar original (archivo, copia)
- **Volumen:** ~200 radicaciones salida/día (estimado Acta)
- **Restricciones:** [⏳ VALIDAR] Firma de autorizado, evidencia envío

### 2.3 Gestión de expedientes
- **Disparador:** Proceso que requiere agrupar documentos (proyecto, cliente, caso)
- **Actores:** Gestor documental, especialista del proceso
- **Pasos actuales:** [⏳ VALIDAR]
  - Crear carpeta (física / digital)
  - Clasificar documentos (serie, subserie, tipo)
  - Incorporar documentos al expediente
  - Mantener índice (¿manual? ¿automatizado?)
  - Cierre y archivo (¿cuándo? ¿cómo se valida cierre?)
- **Volumen:** ~5.000 expedientes simultáneos (estimado Acta)
- **Restricciones:** [⏳ VALIDAR] Integridad durante ciclo de vida

### 2.4 Búsqueda y consulta
- **Disparador:** Necesidad operacional de localizar documento/expediente
- **Actores:** Cualquier usuario autorizado
- **Pasos actuales:** [⏳ VALIDAR]
  - Buscar por número, asunto, fecha, responsable
  - Navegar carpetas (Windows, Google Drive, otro)
  - Abrir documento
  - Copiar o descargar
- **Herramientas:** [⏳ VALIDAR] Windows Explorer, Google Drive search, manual
- **Restricciones:** [⏳ VALIDAR] Permisos de acceso, confidencialidad

### 2.5 Transferencia y disposición
- **Disparador:** Fin de vigencia activa, preparación para archivo
- **Actores:** Gestor documental, archivo
- **Pasos actuales:** [⏳ VALIDAR]
  - Evaluar si se transfiere a archivo histórico
  - Empacar y enviar
  - Eliminar de áreas operativas
- **Plazo:** [⏳ VALIDAR] ¿Años de vigencia activa?
- **Restricciones:** [⏳ VALIDAR] Retención legal, LSRPD

---

## 3. Actores y responsabilidades

**Roles identificados (a confirmar):**

| Actor | Responsabilidades | Usuarios aprox | Restricciones |
|---|---|---|---|
| Recepcionista | Recibir comunicaciones externas | 2-3 | Acceso públicos |
| Secretarias/Administrativos | Radicar entrada/salida, distribución | 5-8 | Acceso áreas operativas |
| Gestores documentales | Clasificar, expedientes, consultas | 3-5 | Acceso completo (¿supervisado?) |
| Supervisores/Líderes | Aprobación salida, decisiones escaladas | 10-15 | Acceso su área |
| Especialistas (proyectos, etc.) | Crear/consultar documentos operativos | 15-20 | Acceso área / proyecto |
| Archivo | Recibir, almacenar, transferencias | 1-2 | Acceso físico / histórico |
| Administrador IT | Gestión infraestructura, copias | 1-2 | Acceso root |
| Compliance/Legal | Validar requisitos, retención | 1 | Auditoría y asesoría |

---

## 4. Infraestructura y herramientas actuales

**Almacenamiento:** [⏳ VALIDAR]
- Servidores internos (¿SANs? ¿backup?)
- Google Drive / Dropbox
- Carpetas compartidas Windows
- Archivos físicos (¿bóveda? ¿clasificados?)

**Herramientas:** [⏳ VALIDAR]
- Email (¿Gmail? ¿Outlook?)
- Excel para logs de radicación
- Google Sheets para seguimiento
- ¿Sistema ERP? ¿CRM?

**Seguridad actual:** [⏳ VALIDAR]
- ¿Autenticación? (AD, local, Google)
- ¿Cifrado?
- ¿Copias de seguridad? (¿frecuencia? ¿verificadas?)
- ¿Auditoría?

---

## 5. Volúmenes y capacidad operacional

**Datos del Acta v1.0 (validar con Venus):**

| Métrica | Valor | Fuente | Validación |
|---|---|---|---|
| Usuarios activos pico | 45 | Acta | ⏳ Confirmar |
| Documentos en acervo | 5.000 | Acta | ⏳ Confirmar |
| Radicaciones entrada/día | 300 | Acta | ⏳ Validar pico |
| Radicaciones salida/día | 200 | Acta | ⏳ Validar pico |
| Expedientes simultáneos | 5.000 | Acta | ⏳ Confirmar |
| Crecimiento anual | 30% | Acta | ⏳ Proyección 12/24/36 meses |

**Capacidad infraestructura actual:** [⏳ VALIDAR]
- Storage: ¿Cuánto GB/TB usado? ¿Crecimiento mensual?
- Ancho de banda: ¿Suficiente? ¿Limitaciones?
- Disponibilidad: ¿SLA actual? (horas operativas, downtime aceptado)
- RPO/RTO actual: [⏳ VALIDAR] (¿aceptable? ¿crítico?)

---

## 6. Restricciones normativas y operacionales

**Normativa aplicable (a validar con Jurídico):** [⏳ VALIDAR ESPECIALIZADA]
- Retención laboral (empleados, nómina)
- Retención tributaria (facturas, comprobantes)
- Retención comercial (contratos, pedidos)
- LSRPD (datos personales empleados, clientes)
- Otros: [⏳ VALIDAR]

**Restricciones de negocio:**
- Confidencialidad: [⏳ VALIDAR] Documentos secretos, contratos, estrategia
- Acceso: [⏳ VALIDAR] Quién puede ver qué (por proyecto, por área, por rol)
- Modificación: [⏳ VALIDAR] Una vez radiado, ¿se puede editar? ¿quién?
- Auditoría: [⏳ VALIDAR] Quién accedió cuándo (requisito actual)

---

## 7. Problemas y dolor actual

**Preguntas a validar en taller:**

1. ¿Cuál es el problema más crítico hoy?
2. ¿Cuánto tiempo se pierde buscando documentos?
3. ¿Hay casos de pérdida de documentos? ¿Con qué frecuencia?
4. ¿Hay conflictos de versiones (dos personas editando a la vez)?
5. ¿Hay falta de evidencia de radicación o aprobación?
6. ¿Hay cumplimiento manual de retención? ¿Riesgo de eliminar anticipadamente?
7. ¿Cómo se garantiza confidencialidad de documentos sensibles?
8. ¿Hay auditorías externas? ¿Qué exigen?
9. ¿Cuál es el costo operativo anual de gestión documental?
10. ¿Qué capacidad le hace falta urgentemente?

---

## 8. Pendientes de validación

**Taller con Venus (2026-09-15):**
- [ ] Procesos detallados (diagramación)
- [ ] Volúmenes picos y promedio
- [ ] Infraestructura actual (capacidad, backup, SLA)
- [ ] Normativa específica y restricciones
- [ ] Problemas y prioridades de solución
- [ ] Actores y responsables precisos
- [ ] Datos sensibles y clasificación

**Validación Jurídica (antes Fase 4):**
- [ ] Retención por serie/tipo
- [ ] Requisitos firma/aprobación
- [ ] Auditoría y evidencia
- [ ] Privacidad y protección de datos
- [ ] Cumplimiento LSRPD

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-08-05 | Estructura inicial, procesos identificados, pendientes de validación Venus. | Álvaro Patiño Cruz |
