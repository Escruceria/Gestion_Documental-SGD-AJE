# Catálogo de requisitos funcionales del MVP

| Campo | Valor |
|---|---|
| Código | GDP-REQ-002 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Analista Requisitos, Product Owner) |
| Revisores | Álvaro Patiño Cruz (Líder Archivístico), Antonio José Escrucería Uribe (Arquitecto), David Ernesto Antequera Martínez (QA) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Contrato de especificación

Todos los RF son tenant-scoped salvo backup de plataforma explícito. Precondiciones comunes: sujeto autenticado (o canal público habilitado), tenant resuelto, autorización servidor y contrato válido. Flujo común: validar solicitud y contexto; verificar permiso/reglas; ejecutar transacción local; registrar auditoría/outbox; responder. Alternativas: dato inválido → RFC 9457; no autorizado → 403 sin revelar existencia; conflicto/duplicado → 409 o resultado idempotente; dependencia no disponible → error recuperable sin estado parcial. Fallo conserva invariantes y correlación. Cada escritura acepta `Idempotency-Key` cuando exista riesgo de repetición. Auditoría, aislamiento y minimización aplican según RNF. Autor: `[ANALISTA_REQUISITOS]`; versión 0.1; estado: Borrador.

## Organización, identidad y acceso

| ID | Nombre/objetivo | Actor; prioridad | Disparador y flujo específico | Resultado, reglas, evento | CA/CP |
|---|---|---|---|---|---|
| RF-IAM-001 | Crear y configurar organización; OBJ-001 | Administrador plataforma; Must | Solicita alta → valida identificador/configuración → crea tenant inactivo/activo según política | Organización única; RN-IAM-002; EVT-001/002 | CA-IAM-001; CP-FUN-001 |
| RF-IAM-002 | Administrar sedes y dependencias; OBJ-001 | Admin organización; Must | Crea/modifica/desactiva estructura con versión | Estructura tenant válida; RN-IAM-002; EVT-003 | CA-IAM-002; CP-FUN-002 |
| RF-IAM-003 | Invitar usuario institucional; OBJ-004 | Admin organización; Must | Registra correo/rol → emite invitación de un uso | Invitación auditable sin membresía prematura; RN-IAM-003 | CA-IAM-003; CP-FUN-003 |
| RF-IAM-004 | Asociar identidad Keycloak; OBJ-004 | Usuario invitado/sistema; Must | Canjea invitación autenticada → vincula `subject_id` único | Perfil asociado sin guardar contraseña; EVT-004 | CA-IAM-004; CP-SEG-001 |
| RF-IAM-005 | Gestionar membresías por organización; OBJ-003/004 | Admin organización; Must | Activa/suspende/revoca membresía con razón | Acceso cambia solo en tenant objetivo; EVT-004 | CA-IAM-005; CP-SEG-002 |
| RF-IAM-006 | Activar MFA para roles privilegiados; OBJ-004 | Usuario privilegiado/admin; Must | Detecta rol → exige enrolamiento/desafío Keycloak | Rol no operativo sin MFA; RN-IAM-004 | CA-IAM-006; CP-SEG-003 |
| RF-IAM-007 | Administrar roles y permisos; OBJ-004 | Admin organización; Must | Crea/asigna/revoca dentro del catálogo permitido | Política versionada y auditada; EVT-005 | CA-IAM-007; CP-SEG-004 |
| RF-IAM-008 | Cambiar contexto de tenant; OBJ-003 | Usuario multitenant; Must | Selecciona tenant → valida membresía → renueva contexto y limpia caché | Ningún dato previo permanece; RN-IAM-001 | CA-IAM-008; CP-MTN-001 |

## Clasificación, documentos y expedientes

| ID | Nombre/objetivo | Actor; prioridad | Disparador y flujo específico | Resultado, reglas, evento | CA/CP |
|---|---|---|---|---|---|
| RF-DOC-001 | Parametrizar series; OBJ-001 | Gestor documental; Must | Crea/versiona código y nombre | Serie tenant única; RN-DOC-001 | CA-DOC-001; CP-FUN-009 |
| RF-DOC-002 | Parametrizar subseries; OBJ-001 | Gestor documental; Must | Vincula subserie a serie vigente | Jerarquía válida; RN-DOC-001 | CA-DOC-002; CP-FUN-010 |
| RF-DOC-003 | Parametrizar tipos documentales; OBJ-001 | Gestor documental; Must | Define tipo, metadatos y formatos permitidos | Tipo versionado; EVT-006 | CA-DOC-003; CP-FUN-011 |
| RF-DOC-004 | Crear documento; OBJ-001/005 | Usuario institucional; Must | Informa tipo/metadatos → crea entidad lógica | Documento DRAFT sin blob; EVT-008 | CA-DOC-004; CP-FUN-012 |
| RF-DOC-005 | Solicitar carga de archivo; OBJ-005 | Usuario autorizado; Must | Declara nombre/tamaño/tipo/partes → reserva objeto en cuarentena | URL/sesión corta y limitada; RN-DOC-003 | CA-DOC-005; CP-SEG-005 |
| RF-DOC-006 | Confirmar carga multipart; OBJ-005 | Usuario autorizado; Must | Envía sesión/partes/key → verifica objeto → registra trabajo | Estado QUARANTINED; CMD-001/002 | CA-DOC-006; CP-FUN-013 |
| RF-DOC-007 | Procesar archivo en cuarentena; OBJ-005 | Servicio técnico; Must | Consume comando → lee objeto → escanea y valida | Resultado idempotente; EVT-021/031 | CA-DOC-007; CP-SEG-006 |
| RF-DOC-008 | Registrar hash; OBJ-005 | Servicio técnico; Must | Calcula algoritmo aprobado → compara/deposita | Hash verificable; EVT-022 | CA-DOC-008; CP-FUN-014 |
| RF-DOC-009 | Registrar versión documental; OBJ-005 | Núcleo documental; Must | Recibe resultados limpios → asigna versión monotónica | Versión disponible e inmutable; EVT-009 | CA-DOC-009; CP-CON-001 |
| RF-DOC-010 | Rechazar archivo malicioso; OBJ-005/007 | Procesamiento; Must | Veredicto malicioso → bloquea/libera ninguna URL → alerta | REJECTED y evidencia; RN-DOC-005 | CA-DOC-010; CP-SEG-007 |
| RF-DOC-011 | Crear expediente; OBJ-001 | Gestor documental; Must | Informa clasificación/asunto → valida instrumento | Expediente abierto; EVT-011 | CA-DOC-011; CP-FUN-015 |
| RF-DOC-012 | Incorporar documento a expediente; OBJ-001 | Gestor documental; Must | Selecciona documento/expediente → valida estado → incorpora | Vínculo único/ordenado; EVT-012 | CA-DOC-012; CP-CON-002 |
| RF-DOC-013 | Consultar índice del expediente; OBJ-006 | Usuario autorizado; Must | Solicita expediente → autoriza → ordena entradas | Índice consistente sin contenido no autorizado | CA-DOC-013; CP-FUN-017 |
| RF-DOC-014 | Cerrar expediente; OBJ-001/005 | Gestor documental; Should | Valida índice y pendientes → sella cierre | CLOSED con hash de índice; EVT-013 | CA-DOC-014; CP-FUN-018 |

## Correspondencia, consulta y cumplimiento

| ID | Nombre/objetivo | Actor; prioridad | Disparador y flujo específico | Resultado, reglas, evento | CA/CP |
|---|---|---|---|---|---|
| RF-COR-001 | Radicar comunicación de entrada; OBJ-002 | Radicador/canal; Must | Registra remitente mínimo, canal y documento → reserva consecutivo | Radicación única; EVT-016/017 | CA-COR-001; CP-CON-003 |
| RF-COR-002 | Radicar comunicación de salida; OBJ-002 | Radicador; Must | Valida destinatario/documento aprobado → reserva consecutivo | Salida registrada idempotentemente; EVT-016/017 | CA-COR-002; CP-CON-004 |
| RF-COR-003 | Asignar consecutivo; OBJ-002 | Sistema; Must | Bloquea secuencia tenant/vigencia/tipo → incrementa | Sin hueco reutilizable ni duplicado; RN-COR-001 | CA-COR-003; CP-CON-005 |
| RF-COR-004 | Generar comprobante de radicación; OBJ-002 | Sistema; Must | Tras confirmar radicación → produce representación verificable | Comprobante exacto/minimizado | CA-COR-004; CP-FUN-022 |
| RF-COR-005 | Distribuir radicación; OBJ-002 | Radicador; Must | Selecciona dependencia/responsable → valida pertenencia → asigna | Tarea/estado trazado; EVT-018 | CA-COR-005; CP-FUN-023 |
| RF-COR-006 | Consultar estado; OBJ-002/006 | Usuario/remitente autorizado; Must | Busca referencia → aplica alcance → presenta estado | Sin datos internos innecesarios | CA-COR-006; CP-SEG-008 |
| RF-DOC-015 | Buscar documentos; OBJ-006 | Usuario institucional; Must | Envía términos/filtros/paginación → aplica tenant/permisos | Resultados autorizados y estables | CA-DOC-015; CP-MTN-002 |
| RF-DOC-016 | Consultar documentos respetando permisos; OBJ-003/006 | Usuario autorizado; Must | Solicita ID → evalúa acción/recurso → entrega metadatos/URL corta | 404/403 según política anti-enumeración | CA-DOC-016; CP-SEG-009 |
| RF-AUD-001 | Registrar evento auditable; OBJ-007 | Servicios; Must | Emite evento con sobre → deduplica → persiste evidencia | Registro correlacionado; EVT-032 | CA-AUD-001; CP-CON-006 |
| RF-AUD-002 | Consultar auditoría autorizada; OBJ-007 | Auditor; Must | Define propósito/filtros → autoriza → devuelve página | Lectura auditada y minimizada | CA-AUD-002; CP-SEG-010 |
| RF-AUD-003 | Registrar consentimiento cuando aplique; OBJ-007 | Titular/responsable datos; Should | Presenta finalidad/versión → registra decisión explícita | Evidencia separada; EVT-026 | CA-AUD-003; CP-PRI-001 |
| RF-AUD-004 | Registrar solicitud de titular; OBJ-008 | Titular/agente; Must | Captura tipo, identidad mínima y canal → acusa recibo | Caso único y trazable | CA-AUD-004; CP-PRI-002 |
| RF-AUD-005 | Gestionar estado de solicitud de titular; OBJ-008 | Responsable datos; Must | Asigna, analiza retención, decide y comunica | Historia completa; EVT-027 | CA-AUD-005; CP-PRI-003 |

## Notificaciones y operación

| ID | Nombre/objetivo | Actor; prioridad | Disparador y flujo específico | Resultado, reglas, evento | CA/CP |
|---|---|---|---|---|---|
| RF-NIN-001 | Enviar notificación por correo; OBJ-002/008 | Servicio originador; Should | Emite CMD-006 → renderiza plantilla/version → proveedor | Intento trazable sin secreto; EVT-029 | CA-NIN-001; CP-INT-001 |
| RF-NIN-002 | Reintentar notificación; OBJ-009 | Sistema/operador; Should | Clasifica fallo recuperable → espera con jitter → reenvía | Máximo/DLQ configurados; RN-NIN-001 | CA-NIN-002; CP-INT-002 |
| RF-OPS-001 | Generar reportes operativos básicos; OBJ-006 | Gestor/auditor; Should | Selecciona periodo/filtros → autoriza → genera asíncrono si aplica | Resultado tenant-scoped | CA-OPS-001; CP-FUN-039 |
| RF-OPS-002 | Ejecutar backup; OBJ-009 | Operador/automatización; Must | Inicia política aprobada → cifra → registra manifiesto | Backup verificable, no “éxito” de restore | CA-OPS-002; CP-REC-001 |
| RF-OPS-003 | Verificar restore; OBJ-009 | Operador; Must | Restaura aislado → valida integridad/consistencia → destruye entorno controlado | Evidencia RPO/RTO medidos | CA-OPS-003; CP-REC-002 |
| RF-AUD-006 | Registrar incidente; OBJ-007/009 | Usuario/operador; Must | Registra categoría/severidad/evidencia mínima → notifica rol | Incidente trazable; EVT-028 | CA-AUD-006; CP-SEG-011 |
| RF-OPS-004 | Exportar información básica de un tenant; OBJ-003/008 | Admin autorizado; Should | Define alcance → doble autorización si política → genera paquete cifrado/manifiesto | Exportación aislada, expirable y auditada | CA-OPS-004; CP-MTN-003 |

## Flujo vertical priorizado

RF del flujo vertical (primeros 12 en ejecutarse): RF-IAM-001, RF-IAM-003, RF-IAM-004, RF-IAM-008, RF-DOC-001, RF-DOC-004, RF-DOC-005, RF-DOC-006, RF-DOC-007, RF-DOC-009, RF-COR-001, RF-AUD-001.

Cada uno debe validarse con criterios de aceptación (CA-*) antes de marcar como "completado".

## Datos, mensajes y normativa

Entradas se definen por OpenAPI/AsyncAPI y validaciones en GDP-REQ-011 (Catálogo de Validaciones); salidas nunca incluyen secretos. Mensajes exactos se centralizan en GDP-REQ-010 (Catálogo de Mensajes) con códigos estandarizados. Errores usan RFC 9457 (Problem Details) y se detallan en GDP-REQ-012 (Catálogo de Errores). La normativa asociada se mapea en matriz legal; toda obligación dudosa **requiere validación jurídica especializada**. Riesgos principales: RSK-001..016 según trazabilidad.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | 40+ requisitos funcionales, 7 dominios, flujo general. | Codex |
| 1.0 | 2026-08-05 | Responsables reales, flujo vertical 12-RF priorizado, referencias a catálogos de mensajes/validaciones/errores. Aprobado. | Antonio José Escrucería Uribe |

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Primera ola de 42 RF atómicos y trazables. | Codex |
