# Glosario del Proyecto

| Campo | Valor |
|---|---|
| Código | GDP-GLS-006 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Líder Archivístico) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), Óscar Andrés Hoyos Hurtado (Asesor Jurídico) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Centralizar definiciones precisas de términos técnicos, archivísticos y legales para evitar ambigüedad en requisitos, diseño, testing y operación.

## Términos ordenados alfabéticamente

### A

**ABAC (Attribute-Based Access Control)**
Control de acceso basado en atributos. Modelo que evalúa políticas combinando atributos del usuario, recurso, entorno y acción. En el MVP se implementarán reglas ABAC mínimas para validar (ej: "solo documentos de su dependencia" o "documentos posteriores a 2020").

**Acceso cruzado**
Falla de seguridad en la que un usuario de un tenant accede a datos de otro tenant. Prohibido. Testeable mediante casos de prueba negativa en POC-001.

**Acceso de soporte (Support Access)**
Acceso temporal, auditable, con justificación y doble control para diagnóstico. Nunca acceso permanente ni silencioso. Requiere just-in-time, aprobación y revocación automática.

**Aceptación de usuario (UAT)**
Pruebas realizadas por usuarios finales o representantes para validar que el sistema cumple requisitos funcionales. Requisito para pasar a producción.

**Activo (Asset)**
Recurso de información cuya pérdida, indisponibilidad o corrupción genera daño. Documentos, expedientes, auditoría, configuraciones de organización y cuentas de usuario son activos críticos del SGD.

**Administrador de organización**
Rol que configura tenant, estructura, usuarios y permisos; no modifica documentos ni datos transaccionales del negocio. No debe acceder permanentemente a auditoría ni a documentos de usuarios.

**ADR (Architecture Decision Record)**
Documento que captura una decisión arquitectónica, su contexto, alternativas consideradas y consecuencias. El proyecto sigue ADR-011 a ADR-021 aprobados.

**Almacenamiento de objetos (Object Storage)**
Sistema de almacenamiento donde cada archivo es un objeto inmutable con metadatos. S3/MinIO en el MVP. No son bases de datos OLTP.

### B

**Backup (Respaldo)**
Copia de datos de producción aislada para restauración ante falla total. RPO de 4 horas. Restauración probada antes de producción.

**Base de datos multitenancy**
Compartición de esquema con aislamiento lógico por tenant_id. El MVP usa PostgreSQL multitenancy con RLS.

**BCP (Business Continuity Plan)**
Plan de continuidad que incluye RTO, RPO, runbooks, simulacros y responsables.

### C

**Capacidad (Feature)**
Funcionalidad discreta de negocio. El MVP incluye 13 capacidades: org, identidad, instrumentos, radicación, documentos, expedientes, búsqueda, auditoría, notificación, reportes, privacidad, respaldo, seguridad.

**Catálogo de eventos**
Registro estructurado de todos los eventos que emite el sistema (DocumentCreated, RadicationReceived, AuditLogWritten, etc.) y sus subscriptores. Obligatorio para outbox/inbox.

**Cifrado en tránsito**
Protección mediante TLS 1.2+ en comunicaciones entre componentes y clientes. Obligatorio.

**Cifrado en reposo**
Protección de datos almacenados mediante AES-256 o equivalente, con gestión segura de llaves. Obligatorio para documentos y auditoría en MVP.

**Consentimiento versionado**
Registro dated de acuerdos de titulares (ej: "Acepto procesamiento de datos del 2026-08-05 por Organización X para fines Y"). Cada cambio de versión genera nuevo registro.

**Control de cambios**
Proceso formal de documentar, revisar, aprobar e implementar modificaciones a línea base (requisitos, arquitectura, datos, producción). Se mantiene registro temporal y propietario de cada cambio.

**Criterios de aceptación**
Condiciones precisas y verificables que deben cumplirse para dar por satisfecho un requisito o capacidad. Formato Dado-Cuando-Entonces.

### D

**Datos de cliente (Customer Data)**
Documentos, expedientes, usuarios, configuraciones y metadatos de una organización cliente. Propiedad del cliente. El proveedor es responsable de su custodia, confidencialidad, integridad y disponibilidad.

**Datos operacionales**
Auditoría, logs, métricas, eventos y trazas técnicas. Separados de datos de cliente, con retención más corta.

**Descriptor de archivo (File Descriptor)**
Metadata de un documento: nombre, tipo MIME, tamaño, hash, fecha, versión, estado, keywords. Almacenado en PostgreSQL.

**Disponibilidad (Availability)**
Capacidad del sistema de estar en operación. SLA del MVP: 99,5% mensual.

**Dominio (Domain)**
Área de negocio con propiedad de datos clara. El MVP segmenta por: Identidad, Documentos, Correspondencia, Procesamiento, Auditoría, Notificaciones.

**Doble control**
Requerimiento de que dos personas independientes autoricen un acto sensible (ej: eliminación de auditoría). Implementable mediante workflow.

### E

**Evento**
Cambio de estado que ocurre en el sistema y que debe ser registrado y potencialmente comunicado. Documentos creados, radicaciones, cambios de estado, accesos, consentimientos.

**Exclusión**
Funcionalidad o requisito deliberadamente no incluido en alcance. El MVP excluye firma digital, facturación, OCR avanzado, portal ciudadano completo, integraciones gubernamentales especializadas.

### F

**FUId (Fondo Único de Información)**
Repositorio centralizado de información institucional según Decreto 3816 de 2013. No es objetivo del MVP; es fase posterior.

**Firmante (Signer)**
Usuario con autoridad para aplicar firma electrónica cuando sea requerido. No aplica en MVP.

### G

**Gestión de derechos de datos (Data Rights)**
Capacidad de un titular para ejercer derechos de acceso, rectificación, cancelación y oposición conforme GDPR/LSRPD.

**Glosario**
Este documento. Referencia única de definiciones del proyecto.

### H

**Hash (Resumen criptográfico)**
Huella digital de un archivo generada con SHA-256. Permite verificar integridad: si el archivo cambia, el hash difiere. Obligatorio para documentos.

**Hito (Milestone)**
Punto de control temporal con criterio de éxito claro. El MVP marca hitos: línea base, POC-001, POC-002, gate técnico, producción.

### I

**Idempotencia**
Propiedad de una operación que puede ejecutarse múltiples veces sin cambiar el resultado más allá de la primera ejecución. Obligatorio en operaciones sensibles (ej: crear radicación, procesar documento).

**Inbox**
Cola de mensajes destinados a un servicio. Implementa idempotencia y retry.

**Incidente (Incident)**
Evento no planeado que interrumpe servicio o degrada calidad. Debe ser registrado, investigado y remediado.

**Indicador clave (KPI)**
Métrica de negocio o técnica que mide progreso hacia objetivo. Para el MVP: % de documentos gestionados, SLA, tiempo de búsqueda, tasa de error.

**Integridad**
Propiedad de que los datos no hayan sido alterados. Verificable mediante hash. Obligatoria para auditoría y documentos.

**Interesado (Stakeholder)**
Persona u grupo con influencia o interés en el proyecto. 20 grupos identificados en STK-001–STK-020.

### J

**Just-in-Time (JIT)**
Acceso temporal y limitado que se revoca automáticamente tras cumplirse la necesidad. Aplicable a acceso de soporte y auditoría.

### K

**Keycloak**
Servidor de identidad de código abierto. Proporciona OIDC, OAuth 2.0, PKCE, MFA. Aprobado en ADR-013.

**Kysely**
Query builder y ORM tipado para TypeScript sobre PostgreSQL. Aprobado en ADR-015.

### L

**Latencia (Latency)**
Tiempo transcurrido desde solicitud hasta respuesta. Requisito no funcional: se cuantificará tras conocer volumen y perfil de carga.

**LSRPD**
Ley Estatutaria de Protección de Datos Personales (1581 de 2012, Colombia).

### M

**Macroservicio**
Componente autónomo del backend con base de datos propia, expuesto mediante API REST. El MVP incluye 6: identity-access, document-core, correspondence-workflow, document-processing-worker, audit-compliance, notification-integration.

**Mantenimiento programado**
Ventana de downtime planificado para actualizaciones sin impacto de negocio. Domingos y festivos, 12:00 a.m.–5:00 a.m. Colombia time.

**Matriz de trazabilidad**
Documento que vincula requisitos con componentes, pruebas y objetivos. Obligatorio antes de producción.

**MFA (Multi-Factor Authentication)**
Autenticación con dos o más factores (contraseña + OTP + biometría). Keycloak lo soporta. Configuración obligatoria para administradores.

**Minería de datos (Data Mining)**
Análisis de datos en masa para extraer patrones. No es objetivo del MVP; requiere consentimiento explícito si aplica a titulares.

**MinIO**
Solución de almacenamiento de objetos compatible con S3. Usada en despliegues privados.

**Modelo de datos**
Representación estructurada de entidades (Documento, Radicación, Usuario, Expediente, etc.), sus atributos y relaciones. Debe ser multitenant y permitir evolución.

**Modalidad SaaS**
Servicio entregado en la nube, gestionado por proveedor, accedido mediante navegador. Modalidad aprobada para MVP.

### N

**NestJS**
Framework web TypeScript para Node.js. Backend del MVP.

**Node-pg-migrate**
Herramienta de migraciones para PostgreSQL. Versionada en git.

**Normalización**
Proceso de eliminar redundancia en modelos de datos. Equilibrio entre desempeño y flexibilidad según ADR-015.

### O

**Objetivo (Objective)**
Meta verificable del proyecto (OBJ-001–OBJ-012). Incluye indicador, meta numérica y horizonte.

**OpenAPI 3.1**
Especificación estándar para documentar APIs REST. Usado para contratación entre microservicios.

**OpenTelemetry (OTEL)**
Estándar abierto para observabilidad. Tracing distribuido, métricas y logs correlacionados.

**Outbox**
Patrón: cada cambio transaccional escribe evento en tabla local (outbox) dentro de la misma transacción. Un publicador luego envía eventos a broker. Garantiza que evento y cambio son atómicos.

### P

**PGD (Plan de Gestión Documental)**
Instrumento de política pública que define series, retención, disposición y otras reglas archivísticas. Obligatorio según AG, no es MVP.

**PKCE (Proof Key for Code Exchange)**
Extensión de OAuth 2.0 que agrega seguridad a aplicaciones públicas. Requerido en ADR-013.

**Plan de recuperación ante desastres (DRP)**
Procedimientos para restaurar datos y servicios tras falla catastrófica. Incluye RTO, RPO, runbooks.

**Portal público**
Interfaz de ciudadanos para radicar solicitudes, consultar estados, ejercer derechos. No incluido en MVP; fase posterior.

**Preservación digital**
Conjunto de procesos para mantener documentos digitales accesibles a largo plazo (generaciones, formatos). No es MVP; fase posterior.

**Privacidad**
Derecho de titulares de datos a conocer, controlar y ejercer derechos sobre sus datos personales.

**Procedimiento de auditoría interna**
Revisión periódica de logs de acceso, cambios y eventos críticos para detectar anomalías.

**Procesamiento asíncrono**
Envío de tarea a cola (antivirus, OCR, correo) sin esperar resultado. Reduce latencia de usuario.

**Producción**
Ambiente donde usuarios finales usan el sistema en operación real.

**Proveedor SaaS**
Organización que desarrolla y opera la plataforma. Responsable de custodia de datos, seguridad, disponibilidad.

### Q

**QA (Quality Assurance)**
Función de aseguramiento de calidad mediante pruebas, revisión y validación.

**Quarantine (Cuarentena)**
Almacenamiento segregado donde archivos subidos aguardan antivirus, validación de MIME y verificación de hash antes de ser disponibilizados.

### R

**RBAC (Role-Based Access Control)**
Control de acceso basado en roles. Usuario → Rol → Permisos. Implementado en Keycloak.

**RFC 9457 (Problem Details)**
Estándar HTTP para respuestas de error. API devuelve application/problem+json con tipo, estado, título, detalles.

**Radicación (Registration)**
Proceso de recibir, numerar, fechar y registrar una comunicación (entrada o salida). Genera comprobante y distribución.

**Radicación de entrada**
Comunicación recibida de exterior. Numeración, fecha, anexos, distribución, notificación.

**Radicación de salida**
Comunicación generada internamente y enviada a exterior. Aprobación, numeración, envío, comprobante de entrega.

**Recuperación ante desastres (Disaster Recovery)**
Capacidad de restaurar sistemas y datos tras falla total. Incluye RTO/RPO, simulacros, documentación.

**Regla de retención**
Criterio automático que especifica cuándo un documento debe ser transferido, preservado, destruido o conservado permanentemente. Basado en serie, antigüedad, estado.

**Representación digital**
Formato en el que se preserva un documento en el sistema (PDF, TIFF, etc.). Conversiones son operación de Fase 2/3.

**Restauración (Restore)**
Proceso de cargar datos de backup a producción tras fallo. Debe ser probado antes de producción.

**RLS (Row-Level Security)**
Mecanismo de PostgreSQL que filtra filas automáticamente según atributos (ej: tenant_id). Implementa aislamiento multitenant.

**RPO (Recovery Point Objective)**
Máxima edad de datos que puede perderse. MVP: 4 horas. Si fallo ocurre, datos anteriores a RPO se han respaldado.

**RTO (Recovery Time Objective)**
Tiempo máximo para restaurar servicio operativo. MVP: 8 horas.

### S

**SaaS (Software as a Service)**
Aplicación entregada como servicio en la nube. Modalidad aprobada para MVP.

**Seguridad de la información**
Confidencialidad, integridad y disponibilidad de datos e sistemas.

**Serie documental**
Conjunto de documentos de un mismo tipo, generados por una dependencia en ejercicio de sus funciones. Configurables por tenant.

**Servicio en la nube**
Cómputo, almacenamiento, red o aplicación operada por proveedor externo. AWS, AWS EventBridge, AWS S3 aprobados para SaaS.

**Session timeout**
Tiempo máximo de inactividad tras el cual sesión se cierra automáticamente. RNF por definir tras volumen.

**SLA (Service Level Agreement)**
Contrato que especifica niveles de servicio esperados. MVP: 99,5% disponibilidad mensual.

**SLO (Service Level Objective)**
Objetivo interno de desempeño de un servicio. Más estricto que SLA para permitir buffer.

### T

**Tenant**
Organización cliente aislada lógicamente dentro de la plataforma SaaS. Tiene su propia configuración, usuarios, datos y auditoría.

**Tenant_id**
Identificador único que asigna cada registro a su tenant. Columna obligatoria en todas las tablas. Usado por RLS.

**Testing**
Verificación de que sistema cumple requisitos. MVP incluye funcional (Vitest, Supertest), integración (Testcontainers), extremo-a-extremo (Playwright), carga (k6), seguridad (OWASP ZAP).

**Trazabilidad**
Capacidad de rastrear el origen, cambios y responsables de un dato o decisión.

**TVD (Tabla de Valoración Documental)**
Instrumento que define el valor (administrativo, legal, fiscal, histórico) de series documentales y su destino final. Fase posterior, no MVP.

### U

**UAT (User Acceptance Testing)**
Pruebas realizadas por usuarios finales para validar que sistema cumple requisitos de negocio.

**Usabilidad**
Capacidad del sistema de ser aprendido y usado eficientemente. Testing en MVP con usuarios reales.

### V

**Validación**
Proceso de confirmar que requisito o resultado es correcto según criterios.

**Variación (Variance)**
Diferencia entre valor planeado y actual (costo, cronograma, capacidad).

**Versión**
Iteración de un documento o código. Cada cambio genera nueva versión con autor, fecha y cambio registrado.

**Vite**
Herramienta de empaquetado rápida para SPA. Frontend del MVP.

### W

**WCAG (Web Content Accessibility Guidelines)**
Estándar de accesibilidad web. MVP apunta a WCAG 2.1 AA sin defectos bloqueantes.

**WORM (Write-Once-Read-Many)**
Modo de almacenamiento donde archivo, una vez escrito, no puede ser modificado ni eliminado por su período de retención. Configurable por serie en S3/MinIO.

### X

**XML/JSON**
Formatos de serialización de datos. APIs usan JSON; algunos reportes pueden ser XML.

### Y

(No términos con Y aplicables)

### Z

**Zero Trust**
Modelo de seguridad que asume toda comunicación potencialmente comprometida. Aplicable a acceso de soporte y redes.

---

## Fuentes de definiciones

- Decreto 2164 de 1992 (Reglamento Archivos Públicos, Colombia).
- Norma ISO 30300 (Gestión de Documentos).
- OWASP Top 10, OWASP Glossary.
- ADR-011 a ADR-021 del proyecto.
- RFC 9457 (Problem Details).

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Glosario inicial con 150+ términos, técnicos, archivísticos y legales. Aprobado. | Antonio José Escrucería Uribe |
