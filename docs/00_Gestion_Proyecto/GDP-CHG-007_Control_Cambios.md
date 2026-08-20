# Control de Cambios — Línea Base Fase 1 Ejecutiva

| Campo | Valor |
|---|---|
| Código | GDP-CHG-007 |
| Versión | 2.1 |
| Estado | Aprobado |
| Fecha | 2026-08-05 (actualizado 2026-08-05) |
| Propietario | Antonio José Escrucería Uribe (Project Manager) |
| Revisores | Wilmar Betancur Valencia (Patrocinador), Álvaro Patiño Cruz (Product Owner) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Registrar todas las modificaciones a documentos, requisitos, arquitectura, datos y configuraciones durante el ciclo de vida del proyecto. Proporciona trazabilidad, auditoría y justificación de cambios.

## Política de cambios

1. **Clasificación:** Menor (corrección ortográfica, fecha, enlace), Moderada (cambio de requisito, actualización de responsable, decisión local), Mayor (cambio de alcance, riesgo crítico, impacto multidisciplinario).
2. **Autorización:** Menor: autor + PO. Moderada: autor + PO + Arquitecto. Mayor: Comité (Patrocinador + PO + PM + Arquitecto).
3. **Formato:** Cada cambio registra ID, tipo, documento, descripción, justificación, riesgo, autorización, fecha.
4. **Trazabilidad:** Cada cambio aprobado es identificable en la línea base mediante marca de versión.
5. **Reversibilidad:** Cambios rechazados se registran con motivo. Cambios reversibles se marcan.

## Registro de cambios Fase 1 Ejecutiva (2026-08-05)

| ID | Tipo | Documento | Descripción resumida | Justificación | Riesgo | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|---|---|
| CHG-001 | Moderada | 01_Acta_Inicio_Proyecto.md | V0.1 → V1.0: Nominación de responsables, cliente piloto Venus, SLA/RPO/RTO validados, cronograma aprobado. | Activación oficial del proyecto con responsables reales y compromisos medibles. | Bajo: todos los datos fuente proporcionados y verificados. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-002 | Moderada | 02_Alcance_Proyecto.md | V0.2 → V1.0: Decisión modalidad SaaS, cliente piloto único, integraciones comprometidas, responsables reales. | Formalizar decisión comercial SaaS + piloto-primero, detallar integraciones comprometidas. | Bajo: decisiones ya validadas en acta. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-003 | Moderada | 03_Objetivos_Proyecto.md | V0.1 → V1.0: Cronograma de hitos completado (HT-001 a HT-008), responsables asignados a cada hito. | Vincular objetivos a cronograma concreto (Línea base: ago 2026, POC-001: sep 2026, POC-002: nov 2026, Producción: oct 2028). | Bajo: fechas derivadas de acta aprobada. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-004 | Moderada | 04_Interesados_Stakeholders.md | V0.1 → V1.0: Nominación de 10 responsables centrales, cliente piloto Venus con contacto (José Sergio Arias), STK-020 agregado. | Formalizar quiénes son responsables, comunicación y participación de cliente piloto. | Bajo: confirmación de disponibilidad en proceso paralelo. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-005 | Menor | 05_Matriz_RACI.csv | NUEVO: Matriz 10x35 con responsabilidades de 10 roles centrales en 34 actividades clave MVP. | Proporcionar claridad de quién es responsable (R), aprobador (A), consultado (C), informado (I) en cada función. | Bajo: no modifica requisitos funcionales, solo estructura de autoridad. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-006 | Menor | 06_Glosario.md | NUEVO: Glosario centralizado con 150+ términos técnicos, archivísticos y legales; 26 términos clave resaltados. | Evitar ambigüedad en requisitos, diseño, testing y operación. Referencia común entre arquitectos, abogados, usuarios. | Bajo: glosario no cambia funcionalidad, mejora comunicación. | Álvaro Patiño Cruz | 2026-08-05 | ✅ APROBADO |
| CHG-007 | Menor | 07_Control_Cambios.md | NUEVO: Registro estructurado de cambios Fase 1, política de clasificación (menor, moderada, mayor) y trazabilidad. | Auditoría de qué cambió, cuándo, quién, por qué y aprobación. Obligatorio para gobierno. | Muy bajo: meta, no cambia productos. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-008 | Moderada | 01_Inventario_Fase1_Diagnostico.md | Actualización: Marca todos los documentos de Fase 1 Ejecutiva como "Normalizados y aprobados". Registra que inventario del diagnóstico (93 archivos) es línea base válida. | Cerrar ciclo de diagnóstico e inventario con aprobación. | Bajo: es marcador administrativo. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-009 | Moderada | 00_Indice_Maestro_Documentacion.md | Actualización: Agregar v1.0 aprobada de documentos GDP-ACT-001, GDP-ALC-002, GDP-OBJ-003, GDP-STK-004, GDP-GLS-006, GDP-CHG-007. Actualizar estado de línea base. | Sincronizar índice maestro con documentación ejecutiva aprobada. | Bajo: es actualización administrativa. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ PENDIENTE |

## Registro de cambios Fase 2 (Requisitos) — 2026-08-05

### Cambios Fase 2-A1: Mayores (Responsables + Flujo vertical + 3 catálogos nuevos)

| ID | Tipo | Documento | Descripción resumida | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|
| CHG-010 | Moderada | 01_ERS_SRS_Gestion_Documental.md | V0.1 → V1.0: Responsables, flujo vertical 12-RF, validaciones Acta. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-011 | Moderada | 02_Catalogo_Requisitos_Funcionales.md | V0.1 → V1.0: Responsables, flujo vertical 12-RF marcado, referencias catálogos nuevos. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-012 | Moderada | 03_Catalogo_Requisitos_No_Funcionales.md | V0.1 → V1.0: Valores Acta (99,5% SLA, RPO 4h, RTO 8h, volúmenes), enriquecimiento RNF. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-013 | Moderada | 04_Reglas_Negocio.md | V0.1 → V1.0: Responsables, reglas flujo vertical explicitadas. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-014 | Moderada | 05_Actores_Roles_Permisos.md | V0.1 → V1.0: Responsables, actores flujo vertical 4 roles. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-015 | Moderada | 08_Criterios_Aceptacion.md | V0.1 → V1.0: Responsables, 12 CA flujo vertical obligatorias. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-016 | Moderada | 09_Matriz_Trazabilidad.csv | V0.1 → V1.0: Responsables reales, 42 trazas RF-OBJ-RN-CA-CP. | Wilmar Betancur Valencia | 2026-08-05 | ✅ APROBADO |
| CHG-017 | Menor | 06_Catalogo_Mensajes.md | NUEVO: 6 CMD, 21 EVT flujo vertical, OpenAPI, seguridad. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-018 | Menor | 07_Catalogo_Validaciones.md | NUEVO: 60+ validaciones por dominio, flujo vertical, RFC 9457. | David Ernesto Antequera Martínez | 2026-08-05 | ✅ APROBADO |
| CHG-019 | Menor | 10_Catalogo_Errores.md | NUEVO: 60+ códigos error, HTTP status, reintentos/backoff. | David Ernesto Antequera Martínez | 2026-08-05 | ✅ APROBADO |
| CHG-020 | Menor | 11_Backlog_MVP_Futuro.md | NUEVO: 13 épicas MVP, 49 US, 300 puntos, cronograma 8-10 sprints. | Álvaro Patiño Cruz | 2026-08-05 | ✅ APROBADO |

### Cambios Fase 2-A2: Moderados (Enriquecimiento RNF + Validación trazabilidad)

| ID | Tipo | Documento | Descripción resumida | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|
| CHG-021 | Menor | 03_Catalogo_Requisitos_No_Funcionales.md | Tabla RNF enriquecida: columna "Próxima revisión" con fechas/responsables OPV. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-022 | Menor | 03_Catalogo_Requisitos_No_Funcionales.md | Matriz RF→RNF trazabilidad 100%, flujo vertical cobertura validada. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-023 | Menor | 12_Validacion_Trazabilidad.md | NUEVO: Matriz RF-RNF-CA-CP 100% cobertura, 1 CP pendiente (no bloqueante). | David Ernesto Antequera Martínez | 2026-08-05 | ✅ APROBADO |

### Cambios Fase 2-A3: Menores (Actualización índices + Control cambios)

| ID | Tipo | Documento | Descripción resumida | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|
| CHG-024 | Menor | 00_Indice_Maestro_Documentacion.md | V3.0 → V4.0: Sección 01_Requisitos actualizada con 12 docs Fase 2 (V1.0 aprobados). | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |
| CHG-025 | Menor | 07_Control_Cambios.md | Registro de cambios Fase 2 (CHG-010 a CHG-024), política, resumen. | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |

## Cambios Fase 3-A3: Correcciones menores

| ID | Tipo | Documento | Descripción resumida | Justificación | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|---|
| CHG-026 | Menor | 04_Interesados_Stakeholders.md | V1.0: Corrección STK-015/STK-016 (Neffer Anais = QA ✓, David Ernesto = Operaciones ✓). Alinear con Acta v1.0. | Consistencia con roles aprobados en Acta (línea 68-69). | Antonio José Escrucería Uribe | 2026-08-05 | ✅ APROBADO |

## Cambios Fase 4 — Pre-Desarrollo (2026-08-06)

| ID | Tipo | Documento | Descripción resumida | Justificación | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|---|
| CHG-027 | Menor | 08_Checklist_Recoleccion_Datos_Venus.md | NUEVO: Pre-kickoff checklist para recolección de datos operacionales, técnicos, legales y de seguridad de Venus antes de autorizar desarrollo POC-001. 9 secciones (datos operacionales, procesos, infraestructura, normativa, seguridad, datos personales, integraciones, contactos, criterio de autorización). | Validar que todos los supuestos del Acta y análisis AS-IS coincidan con realidad operativa Venus. SIN estos datos NO se autoriza desarrollo. Fecha límite: 2026-09-15. | Álvaro Patiño Cruz (Product Owner) | 2026-08-06 | ✅ APROBADO |

## Cambios Fase 4 — Validación de Datos (2026-09-15)

| ID | Tipo | Documento | Descripción resumida | Justificación | Autorizado por | Fecha | Estado |
|---|---|---|---|---|---|---|---|
| CHG-028 | Moderada | 01_Acta_Inicio_Proyecto.md | V1.0 → V1.1: ACTUALIZACIÓN CON DATOS REALES VENUS. Volúmenes corregidos: documentos/día (1.000 → 80), acervo (5.000 → 28.500), usuarios (45 → 40), radicaciones (500 → 49/día). Agregadas 4 críticos hallazgos. Nuevos riesgos RSK-003, RSK-009. Impacto técnico documentado. Pendientes inmediatos actualizados. | Datos validados en formulario completado 15-09-2026. Impacta decisiones arquitectónicas (SQS/RabbitMQ, S3/MinIO, k6 testing, migración acervo). Requiere auditoría LSRPD urgente. | Álvaro Patiño Cruz (Product Owner) + Wilmar Betancur Valencia (Patrocinador) | 2026-09-15 | ✅ APROBADO |
| CHG-029 | Menor | 02_Analisis\99_Validacion_Datos_Reales_Venus.md | NUEVO: Documento de validación comparando supuestos Acta v1.0 vs. datos reales Venus. 9 secciones: operacionales, procesos, infraestructura, normativa, supuestos, ADR impact, riesgos operacionales, datos faltantes, recomendaciones. 40+ análisis detallados. | Trazabilidad de deltas y decisiones posteriores basadas en datos verificados. Referencia para ajuste de estimados técnicos. | Antonio José Escrucería Uribe (Arquitecto) | 2026-09-15 | ✅ APROBADO |
| CHG-030 | Moderada | ADR-015_Acceso_PostgreSQL_Migraciones.md; GDP-DAT-011_Estrategia_Migraciones.md; MATRIZ_HALLAZGOS_CLASIFICADOS.md; POC-002 migraciones | MIG-TOPO-001 CERRADO: se formaliza propiedad exclusiva de migraciones, se retira la cadena raíz obsoleta y se validan desde cero document-core 001→002 y processing 001→004. | Reconstrucción temporal produjo tablas, columnas, constraints e índices equivalentes a live; sin FK cruzada entre servicios; bases temporales eliminadas y git diff --check PASS. | Antonio José Escrucería Uribe (Arquitecto) | 2026-08-20 | ✅ APROBADO |

## Cambios pendientes de aprobación

Ninguno. Todos los cambios de Fase 1-4 han sido procesados y aprobados.

## Cambios rechazados o diferidos

Ninguno registrado.

## Impacto resumido de cambios (Fase 1 + Fase 2 + Fase 3 + Fase 4)

### Documentos creados totales (12)
**Fase 1:** 05_Matriz_RACI.csv, 06_Glosario.md, 07_Control_Cambios.md
**Fase 2:** 06_Catalogo_Mensajes.md, 07_Catalogo_Validaciones.md, 10_Catalogo_Errores.md, 11_Backlog_MVP_Futuro.md, 12_Validacion_Trazabilidad.md
**Fase 4:** 08_Checklist_Recoleccion_Datos_Venus.md, 02_Analisis\99_Validacion_Datos_Reales_Venus.md

### Documentos actualizados totales (16)
**Fase 1:** 01_Acta (CHG-028 v1.1), 02_Alcance, 03_Objetivos, 04_Interesados (CHG-026), 00_Indice, 01_Inventario
**Fase 2:** 01_ERS_SRS, 02_Catalogo_RF, 03_Catalogo_RNF, 04_Reglas, 05_Actores, 08_CA, 09_Matriz
**Fase 4:** 00_Indice_Maestro (registro GDP-CHK-001), 07_Control_Cambios (CHG-028, CHG-029)

### Cambios por clasificación (Total 29 cambios)

| Tipo | Cantidad | Riesgo acumulado |
|---|---|---|
| Mayor | 0 | 0 |
| Moderada | 14 | Bajo (CHG-028: impacto arquitectónico, mitigado con validación + documentación) |
| Menor | 15 | Muy bajo (administrativa, enriquecimiento, pre-kickoff, validación) |

### Cambios por ámbito (Total)

| Ámbito | Cambios | Impacto |
|---|---|---|
| Gobierno | 4 | RACI, control cambios, índice, objetivos. |
| Requisitos | 19 | 41 RF, 21 RNF, 42 CA, 41 CP trazados 100%. |
| Catálogos | 5 | Mensajes, validaciones, errores, backlog, trazabilidad. |
| Arquitectura | 0 | ADR-011..021 vigentes. |
| Datos | 0 | Modelos pendientes Fase 3. |
| Seguridad | 0 | Riesgos documentados Acta. |
| Operación | 1 | SLA 99,5%, RPO 4h, RTO 8h validados. |

## Riesgos de cambios

- **RSK-CHG-001:** Nominación reciente de responsables puede generar curva de aprendizaje. *Mitigación:* Capacitación y RACI escrita antes de sep/2026.
- **RSK-CHG-002:** SLA 99,5%, RPO 4h, RTO 8h son compromisos ejecutivos; incumplimiento escalaría. *Mitigación:* Validación técnica en POC-001 y POC-002.
- **RSK-CHG-003:** Cliente piloto Venus es dependencia crítica; demoras afectarían cronograma. *Mitigación:* Contrato formal y comité bi-mensual.

## Trazabilidad a objetivos

Todos los cambios de Fase 1 Ejecutiva soportan **OBJ-012**: "Establecer trazabilidad bidireccional de la línea base. RF y RNF sin vínculos huérfanos a pruebas/objetivos. 100% antes de aprobar cada entrega."

## Mecanismo de desempate de cambios

Si hay desacuerdo entre PO y Arquitecto, escala a Patrocinador. Si hay desacuerdo entre Patrocinador y Jurídico, se conforma comité ejecutivo.

## Riesgos de cambios (Fase 1 + Fase 2)

- **RSK-CHG-001:** Responsables nominados recientemente pueden tener curva aprendizaje. *Mitigación:* RACI clara, capacitación ante POC.
- **RSK-CHG-002:** SLA 99,5%, RPO 4h, RTO 8h son compromisos; incumplimiento crítico. *Mitigación:* Validación técnica POC-001/POC-002.
- **RSK-CHG-003:** Cliente piloto Venus es dependencia crítica. *Mitigación:* Contrato formal, comité bi-mensual.
- **RSK-CHG-004:** 1 CP pendiente (CA-IAM-008) debe crearse antes POC. *Mitigación:* Creación programada 2026-08-31.

## Historial del documento

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Registro de 9 cambios Fase 1 Ejecutiva, política de control, trazabilidad. Aprobado. | Antonio José Escrucería Uribe |
| 2.0 | 2026-08-05 | Registro de 25 cambios totales (9 Fase 1 + 16 Fase 2), 12 documentos nuevos, 14 actualizados, 100% trazabilidad RF-RNF-CA-CP. Aprobado. | Antonio José Escrucería Uribe |
| 2.1 | 2026-08-05 | Agregado CHG-026: Corrección de roles Acta (David Ernesto = QA, Neffer Anais = Operaciones) para alineación STK-004. Total 26 cambios. | Antonio José Escrucería Uribe |
