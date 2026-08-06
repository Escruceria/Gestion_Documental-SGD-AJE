# Diagnóstico inicial del proyecto

| Campo | Valor |
|---|---|
| Proyecto | Sistema de Gestión Documental para Colombia |
| Código | GDP-DIA-001 |
| Versión | 1.1 |
| Estado | Borrador para validación |
| Fecha de corte | 2026-07-16 |
| Alcance de esta ejecución | Diagnóstico y estructura documental; no incluye programación |

## 1. Resumen ejecutivo

El repositorio se encuentra en una etapa de análisis previa al desarrollo. Contiene 13 archivos: cinco documentos DOCX de análisis y ocho PDF normativos o administrativos. No contiene código fuente, manifiestos de dependencias, configuración de infraestructura, modelo de base de datos, especificación API ni pruebas. Tampoco es un repositorio Git en el directorio inspeccionado.

Existe una base conceptual valiosa: alcance del producto, público objetivo, procesos documentales, privacidad, roles, arquitectura propuesta y un primer requisito funcional. Sin embargo, la mayor parte está expresada como recomendaciones o listas y todavía no constituye una línea base aprobada, medible y trazable conforme a ISO/IEC/IEEE 29148:2018.

La recomendación es conservar los archivos actuales como fuentes históricas, adoptar la estructura objetivo definida en el índice maestro y producir primero la línea base de alcance, actores, decisiones y requisitos MVP. La validación legal debe realizarse con fuentes oficiales vigentes antes de aprobar requisitos normativos.

## 2. Método y límites

Se realizó inventario recursivo, lectura textual completa de los cinco DOCX, inspección de metadatos y contenido inicial de los ocho PDF, conteo de páginas y cálculo SHA-256. No se modificó código fuente porque no existe. No se sobrescribió ningún documento previo. Esta revisión no sustituye concepto jurídico, archivístico, de seguridad ni de protección de datos especializado.

Limitaciones:

- El PDF `resolucion-536-2017.pdf` no ofrece texto extraíble; requiere OCR o revisión visual para analizar su contenido completo.
- La vigencia normativa no se determinó exclusivamente desde copias locales. Toda obligación legal queda pendiente de contraste oficial.
- No fue posible evaluar compilación, dependencias, cobertura, vulnerabilidades o arquitectura implementada porque no hay software.
- No se conocen datos empresariales, presupuesto, equipo, cronograma contractual, volúmenes reales ni acuerdos de nivel de servicio.

## 3. Inventario de archivos existentes

| # | Archivo | Tipo | Tamaño (bytes) | Resultado de análisis |
|---:|---|---:|---:|---|
| 1 | `docs/Análisis y diseño/Cuestionario de análisis y diseño.docx` | DOCX | 53.261 | Fuente principal; 4.856 palabras; contiene alcance, privacidad, pagos, roles, arquitectura y decisiones propuestas. |
| 2 | `docs/Análisis y diseño/Estructura definitiva de cada ERF.docx` | DOCX | 20.022 | Define plantilla de requisito, consentimiento y criterios de aceptación. |
| 3 | `docs/Análisis y diseño/La estructura propuesta del repositorio.docx` | DOCX | 15.586 | Propone cuatro grupos documentales; queda superada en cobertura por la estructura objetivo actual. |
| 4 | `docs/Análisis y diseño/RF-001 – Registrar cuenta de usuario con autorización de tratamiento de datos.docx` | DOCX | 19.709 | Primer RF en estado borrador; incluye flujo, reglas, mensajes y cinco criterios. |
| 5 | `docs/05. Normativa/El Marco Normativo Fundamental.docx` | DOCX | 19.283 | Síntesis de marco archivístico, ocho procesos e instrumentos. Debe validarse jurídicamente. |
| 6 | `docs/05. Normativa/00. Leyes/LEY 594 DE 2000.pdf` | PDF, 19 págs. | 146.272 | Copia textual de la Ley General de Archivos. |
| 7 | `docs/05. Normativa/00. Leyes/Ley_527_de_1999.pdf` | PDF, 12 págs. | 116.408 | Copia del Gestor Normativo; advierte verificación de vigencia. |
| 8 | `docs/05. Normativa/01. Decretos/Decreto_1080_de_2015_Sector_Cultura.pdf` | PDF, 223 págs. | 1.145.718 | Versión integrada cuya portada indica actualización al 2023-01-19; debe contrastarse. |
| 9 | `docs/05. Normativa/01. Decretos/Decreto_2578_de_2012.pdf` | PDF, 7 págs. | 108.624 | Antecedente reglamentario; revisar compilación, derogatorias y vigencia. |
| 10 | `docs/05. Normativa/02. Acuerdos/2024-02_29_AcuerdoAGN-FIRMADO.pdf` | PDF, 158 págs. | 1.656.288 | Acuerdo AGN 001 de 2024 firmado. |
| 11 | `docs/05. Normativa/03. Actos administrativos/acuerdo-012-1998.pdf` | PDF, 3 págs. | 429.378 | Acto específico que aprueba TRD de Función Pública; no es requisito general del producto. |
| 12 | `docs/05. Normativa/03. Actos administrativos/resolucion-596-2016.pdf` | PDF, 2 págs. | 283.291 | Actualización de TRD de Función Pública; referencia institucional específica. |
| 13 | `docs/05. Normativa/03. Actos administrativos/resolucion-536-2017.pdf` | PDF, 3 págs. | 833.055 | Documento escaneado/sin texto extraíble; aplicabilidad por determinar. |

Las huellas SHA-256 se calcularon durante el diagnóstico y pueden regenerarse para demostrar que las fuentes no cambiaron. Se recomienda crear en una ejecución posterior un inventario CSV versionado con ruta, origen oficial, fecha de consulta, vigencia verificada, aplicabilidad y huella.

### 3.1 Estado de decisiones posterior al diagnóstico

El inventario y los hallazgos anteriores describen el estado inicial. Posteriormente se aprobaron ADR que sustituyen propuestas heredadas:

- ADR-011: arquitectura distribuida de macroservicios por dominio; el monolito modular global fue rechazado.
- ADR-012: TypeScript, Node.js 24 LTS, NestJS sobre Express, REST/OpenAPI 3.1, React/TypeScript/Vite y PostgreSQL.
- ADR-013: Keycloak con OIDC/OAuth 2.0; autenticación propia descartada.
- ADR-014: EventBridge para eventos y SQS para colas/comandos del SaaS; BullMQ/Redis no será mensajería durable principal.
- ADR-015: Kysely + pg para acceso PostgreSQL y node-pg-migrate para migraciones por servicio.

Las tablas siguientes conservan el diagnóstico histórico y no deben interpretarse como decisión vigente cuando contradigan estos ADR.

## 4. Tecnologías y arquitectura encontradas

No se encontró ninguna tecnología implementada. Las siguientes son decisiones iniciales propuestas en la documentación, pendientes de ADR y validación mediante requisitos de calidad:

| Área | Propuesta existente | Estado diagnóstico |
|---|---|---|
| Producto | SaaS B2B/B2G, web responsiva | Propuesta consistente; falta validar modalidad privada/on-premise y segmentación de clientes. |
| Frontend | React, Next.js, TypeScript | Antecedente sustituido: ADR-012 aprueba React + TypeScript + Vite. |
| Backend | Node.js, TypeScript, NestJS preferido | Antecedente resuelto: ADR-012 aprueba Node.js 24 LTS y NestJS sobre Express. |
| Arquitectura | Monolito modular evolutivo | Antecedente rechazado: ADR-011 aprueba macroservicios distribuidos por dominio. |
| Datos | PostgreSQL | Aprobado por ADR-012; Kysely/pg y node-pg-migrate aprobados por ADR-015; RLS se valida en POC-001. |
| Objetos | S3 o compatible; MinIO privado | Propuesta; faltan aislamiento, cifrado, versionado, retención y borrado legal. |
| Búsqueda | PostgreSQL FTS; OpenSearch al escalar | Propuesta coherente; faltan umbrales de evolución. |
| Asíncrono | Redis/BullMQ; RabbitMQ según complejidad | Antecedente sustituido para SaaS: ADR-014 aprueba EventBridge + SQS. |
| OCR | Tesseract o servicios administrados | Alternativas abiertas; falta evaluación de exactitud, costo, residencia y datos sensibles. |
| Nube | AWS | Preferencia; falta arquitectura de referencia y portabilidad privada. |
| Identidad | Contraseña con hash y MFA; RBAC + ABAC | Dirección definida; faltan políticas medibles y segregación completa. |
| Multitenancy | Compartido con aislamiento lógico; dedicado para alta exigencia | Recomendación preliminar; falta decisión de MVP y modelo de amenazas. |

## 5. Módulos y capacidades identificados

Se identifican los dominios: organizaciones, sedes y dependencias; identidad, usuarios, roles y permisos; instrumentos archivísticos; documentos y versiones; correspondencia y radicación; expedientes; flujos, tareas y aprobaciones; firma; digitalización y OCR; búsqueda; préstamos; transferencias; retención, disposición y preservación; auditoría; notificaciones; privacidad; portal ciudadano; integraciones; suscripciones, pagos y facturación; reportes; configuración; respaldo e incidentes.

El material previo propone como núcleo inicial radicación, documentos, expedientes, clasificación, usuarios, permisos, búsqueda, auditoría y reportes. La solicitud actual amplía el MVP con MFA, entrada y salida, metadatos, correo, consentimientos, solicitudes de titulares, backup y seguridad base. Esta última definición se toma como línea de trabajo vigente, pendiente de aprobación formal.

## 6. Requisitos existentes

Solo existe un requisito formal, `RF-001 Registrar cuenta de usuario`, versión 1.0, estado Borrador. Presenta actor, prioridad, precondiciones, flujo, reglas, excepciones, mensajes, postcondiciones y cinco criterios Gherkin. Sus fortalezas son hash de contraseña, consentimiento versionado, casilla desmarcada y recuperación ante fallo de correo.

Brechas de RF-001 frente a la plantilla obligatoria:

- Faltan justificación, dependencias, requisitos relacionados, autor y fecha.
- Faltan validaciones exhaustivas y datos de salida explícitos.
- No incluye escenario de autorización/permisos diferenciado ni referencia a caso de prueba.
- La trazabilidad no relaciona objetivo, historia, caso de uso, RNF, entidades, tablas, endpoint, control legal, evidencia y entrega.
- El campo `tenant_id` no aparece en el consentimiento ni se define si el alta crea una organización, se realiza por invitación o corresponde al portal ciudadano.
- La unicidad de correo se declara “dentro de la plataforma”; debe decidirse si es global, por tenant o por identidad central con membresías múltiples.
- El mensaje de correo/documento duplicado puede facilitar enumeración de cuentas; requiere análisis de seguridad y UX.
- Se exige documento de identidad pese al principio de minimización; debe justificarse por finalidad y tipo de actor.
- La regla de contraseña mezcla longitud y composición. Debe alinearse con la política de autenticación aprobada y controles contra contraseñas comprometidas.
- El flujo podría crear cuenta antes de confirmar el envío de correo, pero la postcondición de fallo afirma que no se crea una cuenta incompleta; hay contradicción semántica.

No existen catálogos de RF/RNF, reglas consolidadas, historias, casos de uso, catálogo de mensajes/errores, backlog trazable ni matriz bidireccional.

## 7. Decisiones ya propuestas

Se consideran propuestas, no decisiones aprobadas, salvo ratificación de patrocinador y responsables:

- Aplicación web responsiva; móvil en fase posterior.
- Mercado colombiano de entidades públicas y privadas.
- Antecedente: monolito modular. Decisión vigente: macroservicios distribuidos, REST/OpenAPI 3.1 y PostgreSQL (ADR-011/012).
- AWS como despliegue preferente con alternativa privada.
- `tenant_id` en los registros y oferta dedicada para clientes de alta exigencia.
- Hash Argon2id o bcrypt, MFA, RBAC + ABAC y auditoría resistente a modificación.
- Pagos mediante pasarela externa y facturación mediante proveedor DIAN.
- Datos sensibles no solicitados por defecto, pero soportados con controles reforzados.
- Firma electrónica o digital según riesgo y exigencia jurídica.

## 8. Inconsistencias y contradicciones

| ID | Hallazgo | Impacto | Tratamiento propuesto |
|---|---|---|---|
| INC-001 | Se usa “ERF” y “RF” para el mismo artefacto. | Trazabilidad y nomenclatura inconsistente. | Adoptar `RF` conforme al estándar solicitado. |
| INC-002 | La estructura previa tiene 4 grupos y usa DOCX/XLSX; la solicitud vigente define 13 grupos y Markdown/CSV. | Duplicación y rutas divergentes. | Conservar fuentes previas; adoptar estructura del índice maestro sin moverlas todavía. |
| INC-003 | RF-001 dice correo único en toda la plataforma, mientras el producto es multitenant. | Impide o confunde membresías en varias organizaciones. | ADR de identidad y regla explícita de unicidad. |
| INC-004 | En fallo de correo, la cuenta queda creada y pendiente; otra postcondición dice que no se crea una cuenta incompleta. | Pruebas ambiguas. | Definir “incompleta” y estados transaccionales. |
| INC-005 | Se propone auditoría “inmutable”, pero no se define mecanismo, excepción legal, retención ni acceso de soporte. | Afirmación no verificable. | Sustituir por controles medibles de resistencia a alteración, integridad y retención. |
| INC-006 | Se listan “8 instrumentos obligatorios”, mientras otra fuente enumera un conjunto distinto de instrumentos. | Riesgo legal y funcional. | Matriz normativa por artículo y aplicabilidad. Requiere validación jurídica especializada. |
| INC-007 | Disponibilidad 99,5 %/99,9 % y tiempos de 2/3 segundos aparecen como sugerencias sin carga, percentil ni ventana. | RNF no verificables. | Definir perfiles, percentiles, volumen y método de medición. |
| INC-008 | “Base compartida” y “copias de seguridad por organización” se proponen juntas sin mecanismo de restauración selectiva. | Promesa operativa posiblemente inviable. | Diseñar exportación/restauración por tenant y probarla. |
| INC-009 | Los actos de 1998, 2016 y 2017 parecen específicos de TRD de Función Pública. | Podrían confundirse con normas generales. | Clasificarlos como ejemplos/antecedentes institucionales. |
| INC-010 | El Decreto 1080 local indica actualización integrada hasta 2023. | Puede omitir cambios posteriores. | Verificar versión vigente en fuente oficial antes de aprobar matriz legal. |

## 9. Vacíos prioritarios

### Negocio y producto

- Patrocinador, propietario del producto, autoridad aprobadora y modelo de gobierno.
- Segmento de lanzamiento, problema priorizado, diferenciadores y criterios de éxito.
- Límite MVP contractual y exclusiones; modalidad SaaS versus instalación privada.
- Volúmenes esperados: tenants, usuarios, documentos, radicaciones, tamaño y crecimiento.
- Política comercial, planes, soporte, migración, salida y portabilidad.

### Requisitos y archivo

- Procesos AS-IS/TO-BE, numeración de radicados, calendarios, términos y excepciones.
- Modelo parametrizable de CCD, TRD, TVD, FUID, TCA y expedientes híbridos.
- Reglas de cierre, reapertura, foliado, índice electrónico, transferencias y eliminación.
- Metadatos obligatorios, perfiles de aplicación y formatos de preservación.
- Matriz completa de roles, segregación y delegaciones.

### Arquitectura y datos

- Contextos delimitados, dependencias, contratos internos y estrategia de eventos.
- Elecciones aún pendientes: almacenamiento de objetos, OCR y proveedor de correo. NestJS/Express, Keycloak, EventBridge/SQS y Kysely/pg/node-pg-migrate ya fueron aprobados.
- Modelo conceptual/lógico/físico, claves, ciclos de vida e integridad referencial.
- Estrategia multitenant: RLS, contexto del tenant, claves, rutas de objetos y pruebas antifuga.
- API, idempotencia, versionado, límites, malware, cuarentena y cargas fragmentadas.
- Preservación digital, verificación de fixity, PDF/A y migración de formatos.

### Seguridad, privacidad y cumplimiento

- Clasificación de información, modelo de amenazas y matriz de controles.
- Bases jurídicas por finalidad, inventario de datos, responsables/encargados y transferencias.
- Retención diferenciada de documentos, datos, consentimientos, logs, backups y facturas.
- Procedimientos de titulares compatibles con deberes archivísticos.
- Gestión de claves, secretos, sesiones, incidentes, vulnerabilidades y proveedores.
- Marco legal completo y vigente, con artículo, aplicabilidad, requisito y evidencia.

### Calidad y operación

- Métricas RNF, criterios de entrada/salida y ambientes.
- Estrategia de pruebas funcionales, seguridad, privacidad, accesibilidad, carga, backup y aislamiento.
- RPO/RTO, disponibilidad, observabilidad, alertas, runbooks y continuidad.
- CI/CD, IaC, SBOM, gestión de licencias y control de cambios.

## 10. Riesgos iniciales

| ID | Riesgo | Prob. | Impacto | Nivel | Respuesta inicial |
|---|---|---:|---:|---:|---|
| RSK-001 | Fuga de datos entre tenants | Alta | Crítico | Crítico | RLS/defensa en profundidad, pruebas negativas y revisión independiente. |
| RSK-002 | Convertir resúmenes legales desactualizados en requisitos | Media | Crítico | Alto | Fuentes oficiales, fecha de consulta y validación jurídica. |
| RSK-003 | Alcance de 56 módulos sin priorización efectiva | Alta | Alto | Alto | Baseline MVP, criterios de exclusión y roadmap por capacidades. |
| RSK-004 | Eliminación de datos en conflicto con retención archivística | Alta | Alto | Alto | Motor de retención, suspensión legal y decisión autorizada. |
| RSK-005 | Pérdida de integridad/autenticidad documental | Media | Crítico | Alto | Hash, versionado, controles WORM cuando aplique y verificación periódica. |
| RSK-006 | Dependencia excesiva de AWS/proveedores OCR/firma | Media | Alto | Alto | Puertos/adaptadores, formatos abiertos y plan de salida. |
| RSK-007 | Ausencia de volúmenes hace inválidos los RNF | Alta | Medio | Alto | Taller de capacidad y perfil de carga antes del diseño físico. |
| RSK-008 | Acceso privilegiado de soporte a documentos de clientes | Media | Crítico | Alto | Acceso just-in-time, aprobación, doble control y auditoría. |
| RSK-009 | Malware o contenido activo en cargas | Alta | Alto | Alto | Cuarentena, antivirus, CDR según riesgo y tipos permitidos. |
| RSK-010 | Restauración no probada o no selectiva por tenant | Media | Crítico | Alto | RPO/RTO acordados y pruebas periódicas de restore. |
| RSK-011 | Evidencia de consentimiento incompleta o alterable | Media | Alto | Alto | Hash de texto, versión, sello de tiempo, auditoría y retención. |
| RSK-012 | Documentación extensa sin dueño ni control de cambios | Alta | Medio | Alto | RACI, estados, revisiones y trazabilidad automatizable. |

## 11. Estructura documental propuesta

Se adopta la estructura detallada en `00_Indice_Maestro_Documentacion.md`: `00_Gestion_Proyecto`, `01_Requisitos`, `02_Analisis`, `03_Arquitectura`, `04_Base_Datos`, `05_Backend`, `06_Frontend`, `07_Seguridad_Privacidad`, `08_Cumplimiento_Legal`, `09_Politicas_Legales`, `10_Pruebas`, `11_Despliegue_Operacion` y `12_Manuales`.

Los directorios actuales `docs/Análisis y diseño` y `docs/05. Normativa` se conservarán sin mover ni renombrar hasta aprobar un plan de migración. En el índice se catalogan como fuentes heredadas, evitando confundirlos con entregables aprobados.

## 12. Documentos a generar primero

1. Acta de inicio, alcance, objetivos, interesados, RACI, glosario y ADR iniciales.
2. ERS/SRS y catálogo de módulos/actores del MVP.
3. Catálogo RF/RNF, reglas de negocio y diccionario de mensajes.
4. Backlog MVP y matriz de trazabilidad inicial.
5. Análisis multiempresa, datos personales, riesgos de seguridad/privacidad y conservación.
6. Arquitectura C4, modelo de amenazas y ADR de identidad/multitenancy.
7. Modelo conceptual/lógico y diccionario de datos mínimo.
8. Matriz de cumplimiento legal con validación especializada.

## 13. Preguntas pendientes

1. ¿Quién aprueba alcance, requisitos, arquitectura, seguridad, privacidad y cumplimiento?
2. ¿El primer cliente objetivo es entidad pública, empresa privada o ambos con el mismo MVP?
3. ¿El alta de usuarios es pública, por invitación, federada o una combinación?
4. ¿Una persona puede pertenecer a varias organizaciones con una identidad común?
5. ¿Qué volúmenes y tamaños deben soportarse a 12, 24 y 36 meses?
6. ¿Qué RPO, RTO, disponibilidad y horarios de soporte son contractuales?
7. ¿Qué requisitos obligan despliegue privado, residencia de datos o claves dedicadas?
8. ¿Qué instrumentos archivísticos estarán operativos en el MVP y cuáles solo parametrizados?
9. ¿Qué proveedor y nivel de firma se requiere para cada clase de acto?
10. ¿Qué integraciones son compromiso del MVP y cuáles son solo posibilidades?
11. ¿Qué datos son indispensables para registrar ciudadanos y usuarios institucionales?
12. ¿Quién realizará y aprobará la validación jurídica especializada?

## 14. Criterio de salida del diagnóstico

Esta fase queda completa al existir inventario, hallazgos, estructura objetivo, plan de generación y preguntas abiertas. No implica aprobación del alcance ni autorización para iniciar programación. La siguiente fase debe comenzar con validación de este diagnóstico y asignación de responsables.
