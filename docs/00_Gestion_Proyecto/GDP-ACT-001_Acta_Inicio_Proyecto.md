# Acta de Inicio del Proyecto

| Campo | Valor |
|---|---|
| Código | GDP-ACT-001 |
| Versión | 1.1 |
| Estado | Aprobado |
| Fecha de inicio oficial | 10 de agosto de 2026 |
| Fecha del acta | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Project Manager) |
| Revisores | Álvaro Patiño Cruz (Product Owner), Álvaro Patiño Cruz (Líder Archivístico), Antonio José Escrucería Uribe (Arquitecto), Antonio José Escrucería Uribe (Seguridad), Álvaro Patiño Cruz (Datos), Óscar Andrés Hoyos Hurtado (Asesor Jurídico), David Ernesto Antequera Martínez (QA), Neffer Anais Martínez (Operaciones) |
| Patrocinador ejecutivo | Wilmar Betancur Valencia (Gerente) |

## Propósito, problema y justificación

Establecer el marco inicial para un sistema de gestión documental orientado al contexto colombiano. Se busca controlar documentos, expedientes, correspondencia, versiones, acceso, auditoría, conservación y operación multitenant. 

**Cliente piloto:** Venus Ingeniería de Software Ltda, empresa privada del sector tecnológico (35 usuarios), ubicada en Colombia. Acervo actual: 28.500 documentos históricos + ingreso 80 docs/día. Contacto: José Sergio Arias Orizco (jsmx0622@gmail.com, 3116308160). Responsable gestión documental: Álvaro Patiño Cruz (alvaropatcruz10@gmail.com, DPO). Responsable técnico: Antonio José Escrucería Uribe.

**Fecha de inicio del piloto:** 31 de octubre de 2028.

La validación funcional y arquictectónica se realizará con este cliente piloto antes de expandir a nuevas entidades.

## Producto y alcance

**Modalidad:** SaaS. La plataforma se desplegará como servicio administrado en la nube, con acceso mediante Internet y gestión centralizada.

**Arquitectura:** Seis macroservicios multitenant (ADR-011), frontend React/TypeScript/Vite (ADR-018), API REST (ADR-017), PostgreSQL con RLS (ADR-015), Keycloak (ADR-013), EventBridge/SQS (ADR-014), S3 (ADR-016), observabilidad OpenTelemetry (ADR-020), estrategia de pruebas Vitest/Playwright (ADR-019).

**Capacidades MVP:** 13 capacidades prioritarias incluyen identidad, documentos, expedientes, radicación, búsqueda, auditoría, notificaciones, reportes, privacidad y respaldo.

**Exclusiones MVP:** Firma digital, facturación/comercial (Fase 3), OCR avanzado, integraciones especiales. OCR básica sí incluida.

No incluye en esta fase implementación productiva real, contratación de usuarios adicionales, migración de datos heredados ni afirmación de cumplimiento jurídico con fuentes oficiales.

## Objetivos e interesados

**Objetivos OBJ-001–OBJ-012** definidos en `03_Objetivos_Proyecto.md`. 

**Interesados principales:**
- **Patrocinador:** Wilmar Betancur Valencia (wbetancur679@gmail.com)
- **Product Owner:** Álvaro Patiño Cruz (alvaropatcruz10@gmail.com)
- **Arquitecto:** Antonio José Escrucería Uribe (antoniojoseescruceria@gmail.com)
- **Equipo de gobierno:** Registrado en `04_Interesados_Stakeholders.md` y `05_Matriz_RACI.csv`

Todos los interesados han confirmado su disponibilidad y responsabilidades.

## Arquitectura aprobada

ADR-011 a ADR-021: macroservicios, stack TypeScript/NestJS/React/PostgreSQL, Keycloak, mensajería AWS/RabbitMQ, S3/MinIO, validación, frontend, pruebas y observabilidad. La aprobación arquitectónica no prueba implementación ni capacidad.

## Entregables

- Línea base de gobierno, requisitos, análisis y arquitectura.
- Modelos iniciales de datos y contratos.
- Estrategia de seguridad, privacidad, cumplimiento y pruebas.
- Plan de operación y gates.
- POC-001 multitenancy e identidad; POC-002 pipeline documental/mensajería.

## Gobierno

**Autoridades y responsabilidades:**
- **Wilmar Betancur Valencia (Patrocinador):** Aprueba inicio, decisiones estratégicas, presupuesto y escalaciones.
- **Álvaro Patiño Cruz (Product Owner):** Prioriza requisitos, acepta entregas, valida cumplimiento archivístico.
- **Antonio José Escrucería Uribe (Project Manager):** Coordina ejecución, hitos, comunicación y gobierno administrativo.
- **Antonio José Escrucería Uribe (Arquitecto):** Gobierna ADR, decisiones técnicas y coherencia arquitectónica.
- **Óscar Andrés Hoyos Hurtado (Asesor Jurídico):** Validación de normas, contratos y cumplimiento legal.
- **Neffer Anais Martínez (Líder QA):** Calidad, pruebas, criterios de aceptación.
- **David Ernesto Antequera Martínez (Líder Operaciones):** Infraestructura, despliegue, monitoreo y soporte.

RACI detallado en `05_Matriz_RACI.csv`.

## Criterios de éxito

- Requisitos prioritarios trazables y aceptados.
- Cero bloqueantes críticos en el gate.
- POC con aislamiento, integridad, resiliencia y evidencia.
- Stack reproducible con lockfile, digests y SBOM.
- Riesgos críticos tratados y responsables asignados.

## Supuestos y restricciones validados

**SLA y capacidad operativa (confirmado):**
- Disponibilidad SLA: 99,5% mensual
- RPO (Recovery Point Objective): 4 horas
- RTO (Recovery Time Objective): 8 horas
- Ventana de mantenimiento: Domingos y festivos, 12:00 a.m. a 5:00 a.m. (hora de Colombia)
- Residencia de datos: Flexible, con preferencia por Colombia. Procesamiento fuera de Colombia requiere autorización y cifrado.

**Volúmenes del piloto (ACTUALIZADO 2026-09-15 con datos reales de Venus):**

| Métrica | Supuesto Acta | Datos Reales Venus | Variación | Nota |
|---------|---|---|---|---|
| **Usuarios internos** | 45 | 35 | -10 (-22%) | ✅ Aceptable |
| **Usuarios externos** | 0 | 5 ocasionales | +5 (NUEVO) | Clientes/proveedores |
| **Documentos entrada/día** | 1.000 | 80 | -920 (-92%) | 🔴 CRÍTICA — Sobre-dimensionamiento |
| **Tamaño promedio** | 1 MB | 1.8 MB | +0.8 MB (+80%) | Ajuste requerido |
| **Radicaciones entrada/día** | 300 | 23 | -277 (-92%) | 🔴 CRÍTICA |
| **Radicaciones salida/día** | 200 | 16 | -184 (-92%) | 🔴 CRÍTICA |
| **Radicaciones internas/día** | 0 | 10 | +10 (NUEVO) | No contemplado |
| **Expedientes abiertos** | 5.000 | 420 | -4.580 (-92%) | Mayor discrepancia |
| **Acervo histórico** | 5.000 | 28.500 | +23.500 (+470%) | Migración requerida |
| **Crecimiento anual** | 30% | 20-25% | -5-10 pp | Más conservador |
| **Disponibilidad SLA** | 99.5% | 99.5% | 0 | ✅ Exacto |
| **RPO** | 4 horas | 4 horas | 0 | ✅ Exacto |
| **RTO** | 8 horas | 8 horas | 0 | ✅ Exacto |

**Validación realizada:** Formulario completado por Álvaro Patiño Cruz (Jefe Gestión Documental Venus), revisado por Antonio José Escrucería Uribe, aprobado por Wilmar Betancur Valencia el 15-09-2026.

**Impacto en decisiones técnicas:**
- Reducir estimado throughput AWS SQS/RabbitMQ a 10% de lo originalmente proyectado
- Ajustar capacidad S3/MinIO: +80% tamaño promedio = 51 GB acervo actual vs. 5 GB estimado
- Escalabilidad: Más conservadora (20-25% vs. 30%), favorece arquitectura
- k6 load testing: Usar 80 docs/día y 49 radicaciones/día en escenarios reales
- Migración acervo: 28.500 documentos históricos requieren estrategia de cuarentena y clasificación retroactiva

Aplican SUP/RES de `15_Supuestos_Restricciones.md` con **validaciones de campo realizadas 2026-09-15**. No se inventan obligaciones ni compromisos no respaldados por datos reales verificados.

## Hallazgos críticos de validación con Venus (2026-09-15)

**Documento de validación:** `02_Analisis\99_Validacion_Datos_Reales_Venus.md`

### 🔴 Críticos

1. **Almacenamiento fragmentado sin gobernanza**
   - Datos en: servidor local, carpetas red, Google Drive, equipos personales, correos
   - Riesgo LSRPD: Datos personales sin cifrar en equipos locales
   - Acción: Auditoría de privacidad + DPIA formal ANTES de migración

2. **Migración de acervo histórico (28.500 documentos)**
   - Venus tiene 6 años de historia acumulada
   - Almacenados sin metadatos normalizados
   - Requiere OCR, clasificación retroactiva, cuarentena temporal
   - Esfuerzo: 3-4 semanas, equipo dedicado
   - Acción: Incluir en cronograma POC-002 + presupuesto adicional

3. **Tablas de retención no formalizadas**
   - Serán críticas para disposición post-migración
   - Acción: Taller de retención con archivista ANTES de Producción

4. **Pérdida de documentos operacional (1-2 veces/mes)**
   - Causa: Workflow manual sin confirmación radicación
   - Acción: Workflow radicación debe incluir escalamiento si > 30 min sin confirmación

### 🟡 Moderados

1. **Accesos heredados sin revocar** → Limpieza pre-migración
2. **MFA solo en AWS** → Habilitar en Keycloak para todos
3. **Búsquedas fallidas 7%** → Target post-SGD: < 2%
4. **Roles especiales (5 roles FUERA de modelo base)** → Extender configuración Keycloak

**Responsable validación:** Álvaro Patiño Cruz (DPO Venus)
**Contacto técnico Venus:** Antonio José Escrucería Uribe

## Riesgos principales críticos (ACTUALIZADO)

- **RSK-001:** Fuga de datos entre tenants → Mitigación: POC-001, RLS, pruebas negativas, revisión de seguridad.
- **RSK-002:** Obsolescencia normativa → Mitigación: Validación jurídica especializada antes de Fase 4.
- **RSK-003 (NUEVO):** Almacenamiento fragmentado y datos personales sin cifrar → Mitigación: DPIA formal, auditoría privacidad pre-migración.
- **RSK-004:** Conflicto retención/disposición → Mitigación: Taller retención con archivista, formalizar tablas.
- **RSK-008:** Acceso de soporte a datos de clientes → Mitigación: Just-in-time, aprobación, doble control, auditoría.
- **RSK-009 (NUEVO):** Pérdida de documentos durante radicación → Mitigación: Workflow con confirmación + escalamiento.
- **RSK-012:** Documentación sin dueño → Mitigación: RACI confirmada, control de cambios operativo, revisiones programadas.

Matriz completa en `09_Riesgos_Proyecto.csv`.

## Condiciones para iniciar desarrollo

Se aplicará `15_Criterios_Gate_Inicio_Desarrollo.md`. Mientras existan bloqueantes, solo se autorizan documentación, validadores y POC aprobadas; no desarrollo funcional productivo.

## Fuentes

Alcance, objetivos, interesados, RACI, riesgos, roadmap, ADR-011–021, catálogo GDP-ARQ-022 y fuentes heredadas inventariadas.

## Decisiones

- El acta no queda aprobada con marcadores de roles y cliente piloto.
- La siguiente actividad permitida es cerrar línea base y preparar POC.

## Pendientes inmediatos

- ✅ Responsabilidades nominadas y confirmadas.
- ✅ Validar AS-IS con Venus Ingeniería (15-09-2026) — **COMPLETADO.**
- 🔴 **URGENTE:** Auditoría de privacidad / DPIA formal (antes de Producción).
- 🔴 **URGENTE:** Taller de retención con archivista Venus (antes de migración).
- 🔴 **URGENTE:** Taller de migración acervo histórico (28.500 docs, 3-4 semanas).
- ⏳ Validación jurídica especializada de normas (antes de Fase 4).
- ⏳ Ejecutar POC-001 (multitenancy, RLS, Keycloak) → septiembre 2026.
- ⏳ Ejecutar POC-002 (carga documental, antivirus, integridad) → noviembre 2026.
- ✅ Completar análisis de procesos AS-IS (agosto-septiembre 2026).
- ⏳ Enriquecer requisitos con casos de uso y historias (Fase 2).
- ✅ Definir contrato formal con cliente piloto (agosto 2026).
- ⏳ Ajustar estimados técnicos (throughput, almacenamiento, testing) con datos reales.
- ⏳ Documentar procedimiento formal de radicación (actual vs. futuro).

## Decisión y aprobación

**Estado:** ✅ ACTA APROBADA

Por este acto se formaliza el inicio del Proyecto Sistema de Gestión Documental para Colombia, con responsables nominados, cliente piloto identificado, cronograma establecido, objetivos claros y autoridades definidas.

El patrocinador Wilmar Betancur Valencia aprueba este acta y autoriza el inicio de la Fase 1 Ejecutiva a partir del 10 de agosto de 2026.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Acta inicial consolidada, pendiente de firmas y validación. | Codex |
| 1.0 | 2026-08-05 | Acta formalizada con responsables, cliente piloto, cronograma, SLA, volúmenes, decisiones comerciales y mitigación de riesgos. Aprobada para Fase 1 Ejecutiva. | Antonio José Escrucería Uribe |
| 1.1 | 2026-09-15 | ACTUALIZACIÓN CON DATOS REALES VENUS: Volúmenes corregidos (1.000 → 80 docs/día, 5.000 → 28.500 docs, usuarios 45 → 40, radicaciones 500 → 49/día). Agregados 4 hallazgos críticos (almacenamiento fragmentado, migración acervo, tablas retención, pérdida documentos). Nuevos riesgos RSK-003, RSK-009. Pendientes inmediatos actualizados. Impacto en decisiones técnicas documentado. | Antonio José Escrucería Uribe |
