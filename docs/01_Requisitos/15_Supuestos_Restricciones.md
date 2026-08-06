# Supuestos y Restricciones del Proyecto

| Campo | Valor |
|---|---|
| Código | GDP-SUP-015 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), Óscar Andrés Hoyos Hurtado (Asesor Jurídico) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Documentar supuestos (lo que se da por cierto) y restricciones (límites operacionales, legales o técnicos) que delimitan el alcance, planificación y ejecutabilidad del proyecto. Cada ítem debe verificarse antes de convertirse en compromiso contractual.

---

## SUPUESTOS APROBADOS (SUP)

### SUP-001: Disponibilidad del cliente piloto

**Supuesto:** Venus Ingeniería de Software Ltda participará activamente en pruebas, validación de procesos AS-IS y aceptación de capacidades MVP entre octubre 2028 y mayo 2029.

**Justificación:** Proyecto depende de feedback real de usuario; sin participación, imposible validar usabilidad y requisitos.

**Validación:** ✅ CONFIRMADA. Contacto José Sergio Arias (jsmx0622@gmail.com, 3116308160) confirma disponibilidad de 45 usuarios.

**Riesgo si no se cumple:** Retraso de cronograma, validación incompleta, fracaso del piloto.

**Mitigación:** Contrato formal con cláusulas de participación, comité bi-mensual, acuerdos de confidencialidad.

---

### SUP-002: Alcance estable durante Fase 1 Ejecutiva y POC

**Supuesto:** Las 13 capacidades MVP y las 6 macroservicios no cambiarán entre agosto 2026 y diciembre 2026 (gate técnico).

**Justificación:** Cambios de alcance interrumpen diseño, costean tiempo y riesgo.

**Validación:** ✅ CONFIRMADA. Alcance en acta formalizada con Patrocinador. ADR-011..021 son arquitectura vigente.

**Riesgo si no se cumple:** Retraso de POC, replanificación de capacidades.

**Mitigación:** Cambios mayores requieren aprobación de Patrocinador + Comité. Control de cambios registra toda modificación.

---

### SUP-003: Stack tecnológico disponible y licenciado

**Supuesto:** Node.js 24 LTS, PostgreSQL, React/TypeScript/Vite, Keycloak, AWS (EventBridge, SQS, S3, RDS), RabbitMQ, Testcontainers, Vitest, Playwright, k6, OWASP ZAP están disponibles, licenciados (OSS o comercial) y soportados.

**Validación:** ✅ CONFIRMADA. Todas son tecnologías maduras, OSS o servicios AWS estándar.

**Riesgo si no se cumple:** Imposible implementar diseño actual sin cambio técnico mayor.

**Mitigación:** Arquitecto verifica mensualmente que versiones LTS siguen siendo soportadas. Alternativas documentadas en ADR si fuera necesario.

---

### SUP-004: Presupuesto aprobado

**Supuesto:** Patrocinador ha aprobado presupuesto para Fase 1 Ejecutiva (gobierno, POC, línea base de requisitos) y existe reserva para MVP.

**Validación:** ⏳ PENDIENTE. Estimación de costos debe ser realizada y presentada a Patrocinador en agosto 2026.

**Riesgo si no se cumple:** Detención de proyecto.

**Mitigación:** Presupuesto es decisión de Patrocinador; se documenta en contrato con cliente piloto.

---

### SUP-005: Datos de entrada auditables

**Supuesto:** Todas las decisiones sobre volúmenes, usuarios, SLA, RPO/RTO provienen de fuentes verificables (consulta Venus, experiencia operativa, contratos, mediciones).

**Validación:** ✅ CONFIRMADA. Venus proporcionó: 45 usuarios, 5.000 documentos, 1.000 docs/día, 500 radicaciones/día, 30% crecimiento anual.

**Riesgo si no se cumple:** Compromisos basados en supuestos generan incumplimiento.

**Mitigación:** Cada número en acta incluye fuente y fecha de validación. Revisiones periódicas en comité.

---

### SUP-006: Normatividad colombiana estable durante Fase 1 Ejecutiva

**Supuesto:** Regulación en gestión documental, acceso a información, protección de datos y seguridad informática en Colombia no sufre cambios sustanciales entre agosto 2026 y agosto 2027.

**Validación:** ⏳ PENDIENTE. Jurídico debe emitir concepto sobre vigencia de marco normativo aplicable.

**Riesgo si no se cumple:** Nueva regulación podría requerir cambios arquitectónicos o funcionales.

**Mitigación:** Jurídico monitorea cambios normativos. Matriz legal es viva, revisada semestralmente. Cláusulas de ajuste en contrato con cliente.

---

### SUP-007: Proveedores de nube y servicios comprometidos

**Supuesto:** AWS, SMTP/email, y proveedores de antivirus/OCR mantienen SLA de 99,5%+ y no modifican APIs de forma incompatible durante proyecto.

**Validación:** ⏳ CONFIRMADA PARCIALMENTE. AWS tiene SLA public; email y antivirus se evalúan en POC.

**Riesgo si no se cumple:** Indisponibilidad de funcionalidad, caída de SLA general.

**Mitigación:** Contratos de nivel de servicio (SLA) formales con cada proveedor. Alternativas evaluadas en arquitectura.

---

### SUP-008: Perfil de carga predecible

**Supuesto:** Los volúmenes, distribución horaria y patrones de acceso de Venus son representativos de clientes futuros en su segmento.

**Validación:** ⏳ PENDIENTE. Requiere análisis AS-IS detallado con Venus en septiembre 2026.

**Riesgo si no se cumple:** Sistema escalable para Venus pero no para clientes mayores; o inversión excesiva en escalabilidad innecesaria.

**Mitigación:** Testing de carga (k6) con perfiles realistas. RNF de latencia y throughput se calibran tras medición real.

---

### SUP-009: Equipo técnico estable y competente

**Supuesto:** Se dispone de arquitecto, desarrolladores, QA y operaciones con experiencia en Node.js, TypeScript, PostgreSQL, Kubernetes/Docker y prácticas ágiles.

**Validación:** ⏳ CONFIRMADA PARCIALMENTE. Antonio José Escrucería Uribe es arquitecto y Project Manager nominado con experiencia mencionada en sus perfiles.

**Riesgo si no se cumple:** Curva de aprendizaje prolongada, calidad comprometida.

**Mitigación:** Capacitación en stack técnico; mentoring desde arquitecto. Pair programming en componentes críticos.

---

### SUP-010: Acceso a datos heredados de Venus

**Supuesto:** Venus proporciona acceso seguro a datos AS-IS (documentos, procesos, usuarios, configuraciones) necesarios para análisis de requisitos.

**Validación:** ⏳ PENDIENTE. Requiere firma de acuerdo de confidencialidad y acceso en agosto 2026.

**Riesgo si no se cumple:** Análisis de requisitos incompleto, mapeo de procesos superficial.

**Mitigación:** Contrato con cláusula de acceso a datos heredados, plazos definidos, confidencialidad.

---

### SUP-011: Compatibilidad con privacidad by design

**Supuesto:** Aplicar privacidad desde el inicio (consentimientos, minimización, retención) es viable sin comprometer funcionalidad o desempeño en MVP.

**Validación:** ⏳ CONFIRMADA PARCIALMENTE. ADR y requisitos incluyen consentimientos versionados. Testing específico se realiza en POC.

**Riesgo si no se cumple:** Incumplimiento LSRPD o costo operativo prohibitivo.

**Mitigación:** Revisión legal continua, auditoría de privacidad antes de producción, diseño participativo con DPO.

---

### SUP-012: Disponibilidad de ambientes de testing

**Supuesto:** Se dispone de ambientes de desarrollo, prueba e integración separados de producción, con acceso aislado e independencia de datos.

**Validación:** ⏳ PENDIENTE. Infraestructura será aprovisionada en AWS/privado según modalidad; diseño arquitectónico debe incluir segregación.

**Riesgo si no se cumple:** Testing en producción, contaminación de datos, falloscí de seguridad.

**Mitigación:** Infraestructura declarativa (Terraform), ambientes repetibles, bloqueos de acceso entre ambientes.

---

### SUP-013: Evolución regulatoria puede gestionarse sin reescritura

**Supuesto:** Diseño es flexible (ADR, extensibilidad) para incorporar nuevos requisitos normativos sin reescritura radical.

**Validación:** ⏳ CONFIRMADA PARCIALMENTE. Arquitectura modular (macroservicios) permite agregar capacidades. Modelo multitenant permite configuración por tenant.

**Riesgo si no se cumple:** Nueva regulación requiere redesño, retraso de proyecto.

**Mitigación:** Revisión de ADR por jurídico, extensibilidad probada en POC, marcos de configuración para reglas.

---

### SUP-014: Datos de prueba suficientes y representativos

**Supuesto:** Conjuntos de prueba creados o brindados por Venus son suficientes (volumen, complejidad, casos límite) para validar MVP.

**Validación:** ⏳ PENDIENTE. Se definen en plan de testing durante Fase 2.

**Riesgo si no se cumple:** Testing incompleto, defectos no detectados en producción.

**Mitigación:** Matriz de cobertura de tests, revisión de casos límite, pruebas de stres con datos reales.

---

### SUP-015: Colaboración multidisciplinaria posible

**Supuesto:** Equipo (Arquitecto, PO, Jurídico, QA, Operaciones, Seguridad) puede colaborar asiduamente mediante reuniones, talleres y reviews.

**Validación:** ✅ CONFIRMADA. Matriz RACI y plan de participación definidos. Comité de producto quincenal, talleres por dominio.

**Riesgo si no se cumple:** Decisiones aisladas, inconsistencias de requisitos, arquitectura frágil.

**Mitigación:** Calendario de comités, actas registradas, decisiones escaladas a Patrocinador si hay bloqueo.

---

## RESTRICCIONES APROBADAS (RES)

### RES-001: Presupuesto finito

**Restricción:** El proyecto opera bajo presupuesto aprobado. Ampliaciones requieren justificación y decisión de Patrocinador.

**Impacto:** Determina alcance de Fase 1, recursos contratables, cronograma ejecutable.

**Gestión:** PO prioriza capacidades MVP conforme presupuesto. Cambios mayores se escalan.

---

### RES-002: Cronograma restrictivo (Línea base → POC → Producción)

**Restricción:** Línea base debe cerrarse en agosto 2026. POC-001 en septiembre 2026, POC-002 en noviembre 2026, gate técnico en diciembre 2026, producción en octubre 2028.

**Impacto:** No hay tiempo para cambios de alcance mayores ni iteraciones extensas de requisitos.

**Gestión:** Cambios se procesan mediante control de cambios formal. MVP es inmutable tras gate. Fase 2 captura nuevas capacidades.

---

### RES-003: SLA operativo comprometido (99,5% mensual)

**Restricción:** Sistema debe mantener disponibilidad de 99,5% en producción. Incumplimiento escala a Patrocinador y puede generar acción comercial.

**Impacto:** Infraestructura debe ser redundante, monitoreada, con runbooks de incident.

**Gestión:** RTO 8h, RPO 4h son targets; simulacros mensuales. Operaciones es responsable.

---

### RES-004: Datos de cliente aislados por tenant

**Restricción:** Aislamiento multitenant es obligatorio desde el inicio. No se acepta SQL queries que cruzen tenant_id sin validación explícita.

**Impacto:** Modelos de datos, queries, testes, y operación del respaldo incluyen tenant_id obligatoriamente.

**Gestión:** ADR-015, RLS PostgreSQL, pruebas negativas en POC-001. Arquitecto y Seguridad revisan cada cambio.

---

### RES-005: Archivo separado de base de datos transaccional

**Restricción:** Documentos no se almacenan en columnas BLOB de PostgreSQL. Se usan S3/MinIO con referencias en BD.

**Impacto:** Desempeño de BD, gestión de ciclo de vida de archivos, backup independiente.

**Gestión:** ADR-016, modelo de datos separa metadatos (BD) de blobs (S3). Testcontainers incluye MinIO.

---

### RES-006: Seguridad "0 trust" en acceso de soporte

**Restricción:** Acceso de soporte a datos de cliente es never by default. Siempre just-in-time, con justificación, aprobación, doble control y auditoría.

**Impacto:** Runbooks no incluyen acceso directo. Procedimientos requieren autorización de PO o administrador de organización.

**Gestión:** ADR, procedimientos de operación, control de cambios en acceso concedido.

---

### RES-007: Cumplimiento normativo colombiano no garantizado

**Restricción:** El sistema está diseñado para soportar controles de gestión documental, privacidad y seguridad; **no se garantiza cumplimiento automático** de todas las normas sin configuración específica por cliente.

**Impacto:** Cada cliente es responsable de configurar instrumentos archivísticos, retenciones, permisos conforme su mandato legal.

**Gestión:** Matriz legal mapea normas a capacidades configurables. Auditoría legal especializada requerida antes de Fase 4.

---

### RES-008: No inclusión de firma digital en MVP

**Restricción:** Firma digital no está en MVP. Radicación y aprobación registran electrónicamente, pero sin valor probatorio especial.

**Impacto:** Procesos que legalmente requieren firma digital deben contar con mecanismo externo o diferirse a Fase 3.

**Gestión:** Matriz legal lista casos que requieren firma. Contrato con cliente especifica limitación. Fase 3 incluye firma acreditada.

---

### RES-009: Financiación no comprende integración gubernamental

**Restricción:** Integraciones con SIID, SDTI, plataformas gubernamentales, certificadores y dependencias especiales no están en presupuesto MVP.

**Impacto:** Estos clientes serán futuros; MVP se centra en sector privado y entidades públicas simples.

**Gestión:** Roadmap identifica integraciones por fase. Contrato con Venus no incluye estas.

---

### RES-010: Mantenimiento programado es obligatorio

**Restricción:** Sistema tendrá ventana de mantenimiento semanal: Domingos y festivos, 12:00 a.m.–5:00 a.m. Colombia time. SLA se suspende durante ventana.

**Impacto:** Cliente piloto y usuarios deben programar procesos críticos fuera de esta ventana.

**Gestión:** SLA contractual indica exclusión de ventana. Operaciones establece calendario de actualizaciones.

---

### RES-011: Retención y disposición manual en MVP

**Restricción:** Disposición de documentos (traslado a histórico, eliminación) es acto manual y auditado en MVP. No hay motor de retención automático; se prepara para Fase 2.

**Impacto:** Operadores deben aplicar retención conforme reglas; no hay "ejecutar automáticamente por vencer término".

**Gestión:** Requisitos de retención definen flujo manual. Auditoría registra cada disposición. Fase 2 automatiza con autorización.

---

### RES-012: Escalabilidad limitada en MVP

**Restricción:** MVP está diseñado para soportar 50 usuarios simultáneos, 1.000 documentos/día, 500 radicaciones/día. Clientes mayores requieren replanificación de infraestructura.

**Impacto:** Capacidad crecerá conforme clientes agregados; no hay "escala infinita" inicial.

**Gestión:** Arquitectura es modular (microservicios) para escalar independientemente. k6 testing calibra umbrales. Fase 2 agrega elasticidad automática.

---

## MATRIZ DE VALIDACIÓN

| ID | Supuesto/Restricción | Validado | Técnica | Responsable | Próxima revisión |
|---|---|---|---|---|---|
| SUP-001 | Participación Venus | ✅ Sí | Comunicación directa | Patrocinador | 2026-09-30 (contrato firmado) |
| SUP-002 | Alcance estable | ✅ Sí | Acta formalizada | PO + PM | 2026-12-15 (gate técnico) |
| SUP-003 | Stack disponible | ✅ Sí | POC inicial | Arquitecto | 2026-11-30 (POC-002) |
| SUP-004 | Presupuesto aprobado | ⏳ No | Decisión Patrocinador | Patrocinador | 2026-08-31 |
| SUP-005 | Datos auditables | ✅ Sí | Fuentes documentadas | PM | 2026-09-15 (AS-IS validado) |
| SUP-006 | Normatividad estable | ⏳ No | Concepto jurídico | Jurídico | 2026-09-30 |
| SUP-007 | Proveedores comprometidos | ⏳ Parcial | SLA verificables | Operaciones | 2026-09-30 |
| SUP-008 | Perfil de carga predecible | ⏳ No | Medición AS-IS | Arquitecto + Operaciones | 2026-10-31 |
| SUP-009 | Equipo competente | ✅ Sí | Perfiles y experiencia | PM | 2026-09-30 (capacitación) |
| SUP-010 | Acceso datos heredados | ⏳ No | Acuerdo confidencialidad | Jurídico + Patrocinador | 2026-08-31 |
| SUP-011 | Privacidad by design viable | ✅ Parcial | ADR y diseño | Jurídico + Arquitecto | 2026-11-30 (POC-002) |
| SUP-012 | Ambientes segregados | ⏳ No | Infraestructura creada | Operaciones | 2026-09-30 |
| SUP-013 | Flexibilidad normativa | ✅ Parcial | Arquitectura modular | Arquitecto | 2026-12-15 (gate técnico) |
| SUP-014 | Datos prueba suficientes | ⏳ No | Plan de testing | QA + PO | 2026-10-31 |
| SUP-015 | Colaboración multidisciplinaria | ✅ Sí | RACI + calendario | PM | Continuo (comité semanal) |
| RES-001 | Presupuesto finito | ⏳ Parcial | Estimación en curso | Patrocinador | 2026-08-31 |
| RES-002 | Cronograma restrictivo | ✅ Sí | Acta + Objetivos | PM | Continuo |
| RES-003 | SLA 99,5% | ✅ Sí | Validado en Acta | Operaciones | 2026-12-15 (proof of concept) |
| RES-004 | Multitenant obligatorio | ✅ Sí | ADR-015, diseño | Arquitecto | Continuo |
| RES-005 | Archivo separado | ✅ Sí | ADR-016, diseño | Arquitecto | Continuo |
| RES-006 | Seguridad "0 trust" | ✅ Parcial | ADR, procedimientos | Seguridad + Operaciones | 2026-11-30 (POC-002) |
| RES-007 | Cumplimiento no garantizado | ✅ Sí | Documentado en Alcance | Jurídico | Antes de Fase 4 |
| RES-008 | Sin firma digital MVP | ✅ Sí | Alcance formalizado | PO + Jurídico | Fase 3 planning |
| RES-009 | Sin integraciones gubernamentales | ✅ Sí | Presupuesto excluido | Patrocinador | Fase 2+ planning |
| RES-010 | Mantenimiento programado | ✅ Sí | SLA documentado | Operaciones | Continuo |
| RES-011 | Retención manual | ✅ Sí | Alcance documentado | PO + Jurídico | Fase 2 planning |
| RES-012 | Escalabilidad limitada MVP | ✅ Sí | Volúmenes en Acta | Arquitecto | 2026-12-15 (gate técnico) |

---

## Acciones pendientes por validación

| Acción | Responsable | Plazo | Criterio de cierre |
|---|---|---|---|
| Presupuesto formal aprobado | Patrocinador | 2026-08-31 | Decisión ejecutiva registrada |
| Concepto jurídico normatividad | Jurídico | 2026-09-30 | Documento con matriz legal actualizada |
| Medición AS-IS Venus | Arquitecto + Operaciones | 2026-10-31 | Reporte con volúmenes, perfiles, limitaciones |
| Acuerdos de confidencialidad/acceso | Jurídico | 2026-08-31 | Contratos signados |
| Infraestructura ambientes | Operaciones | 2026-09-30 | Dev/Test/Prod segregados, acceso validado |
| Plan de testing detallado | QA | 2026-10-31 | Matriz de cobertura, datos de prueba |

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Supuestos y restricciones completos: 15 SUP, 12 RES, matriz de validación, pendientes identificados. Aprobado. | Antonio José Escrucería Uribe |
