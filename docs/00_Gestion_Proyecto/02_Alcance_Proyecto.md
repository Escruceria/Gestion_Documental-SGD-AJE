# Alcance del proyecto

| Campo | Valor |
|---|---|
| Código | GDP-ALC-002 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Revisores | Álvaro Patiño Cruz (Líder Archivístico), Antonio José Escrucería Uribe (Arquitecto), Antonio José Escrucería Uribe (Seguridad), Álvaro Patiño Cruz (Datos), Óscar Andrés Hoyos Hurtado (Asesor Jurídico) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## 1. Propósito

Definir los límites iniciales del Sistema de Gestión Documental (SGD) para organizaciones colombianas, separando el producto objetivo, el MVP, las fases posteriores y las exclusiones. Este documento no constituye por sí solo una obligación contractual y requiere aprobación formal.

## 2. Declaración de alcance

El proyecto diseñará y desarrollará una plataforma web responsiva, multiempresa y configurable para centralizar, clasificar, radicar, tramitar, organizar, consultar, conservar, transferir y disponer documentos físicos y electrónicos durante su ciclo de vida. La solución deberá preservar contexto, integridad, autenticidad, disponibilidad, confidencialidad y trazabilidad, y permitir a cada organización aplicar sus instrumentos archivísticos, reglas de acceso, retención y privacidad.

El producto se orienta inicialmente a entidades públicas y empresas privadas de Colombia. La aplicabilidad normativa y las configuraciones obligatorias variarán por naturaleza jurídica, función pública ejercida, sector, tipo de documento y relación con titulares de datos.

## 3. Alcance organizacional

**Modalidad aprobada:** SaaS. La plataforma será un servicio administrado en la nube con acceso mediante Internet.

**Estrategia de lanzamiento aprobada:** Un único cliente piloto (Venus Ingeniería de Software Ltda, empresa privada, sector tecnología, 45 usuarios, 5.000 documentos).

**Futuro:** Despliegues privados, dedicados u on-premise se evaluarán posteriormente para clientes que presenten requisitos especiales.

**Alcance organizacional del MVP:**

- Proveedor de la plataforma y organizaciones cliente aisladas por `tenant_id` (multitenant desde el inicio).
- Sedes, dependencias, usuarios, cargos o grupos cuando sean necesarios para autorización.
- Usuarios institucionales, personal de soporte sujeto a acceso controlado y ciudadanos del portal público (fase posterior).
- Aislamiento completo de datos, configuraciones, auditoría y permisos por tenant.

**Entidades objetivo (futuro post-piloto):** Públicas y privadas. El MVP se valida con empresa privada del sector tecnología.

## 4. Alcance funcional del MVP

| Capacidad | Resultado mínimo esperado | Prioridad |
|---|---|---:|
| Organizaciones y dependencias | Crear/configurar tenant, sedes y estructura organizacional. | Must |
| Identidad y acceso | Usuarios, invitaciones/alta definida, recuperación, MFA, RBAC + reglas ABAC mínimas. | Must |
| Instrumentos básicos | Parametrizar series, subseries y tipos documentales; asociarlos a documentos/expedientes. | Must |
| Radicación de entrada | Recibir, validar, numerar, fechar, adjuntar, distribuir y emitir comprobante. | Must |
| Radicación de salida | Preparar, aprobar cuando aplique, numerar, enviar y registrar evidencia. | Must |
| Documentos y versiones | Metadatos, archivos en objeto, hash, versiones, estados y relaciones. | Must |
| Expedientes | Crear, clasificar, incorporar documentos, consultar índice y cerrar bajo reglas. | Must |
| Búsqueda | Búsqueda básica y filtros por metadatos respetando permisos y tenant. | Must |
| Auditoría | Registrar accesos y eventos críticos con controles de integridad y acceso restringido. | Must |
| Notificación | Correo para radicación, tareas, seguridad y respuestas configuradas. | Must |
| Reportes | Reportes operativos básicos de radicación, documentos, expedientes y auditoría autorizada. | Must |
| Privacidad | Consentimientos versionados cuando procedan y gestión básica de solicitudes de titulares. | Must |
| Respaldo y seguridad | Backup, restauración probada, cifrado, secretos, antivirus de cargas y registro de incidentes. | Must |

Los instrumentos archivísticos avanzados no incluidos como operación completa en el MVP deberán poder incorporarse sin romper el modelo de clasificación y ciclo de vida.

## 5. Integraciones y servicios comprometidos en MVP

- **SMTP/Email:** Notificaciones transaccionales (radicación, tareas, incidentes, respuestas).
- **S3/MinIO:** Almacenamiento de documentos, cuarentena, Write-Once-Read-Many (WORM) selectivo.
- **Keycloak:** Autenticación centralizada, OIDC/OAuth 2.0, PKCE, MFA, federación de identidades.
- **Base de datos:** PostgreSQL nativo con RLS (Row-Level Security).
- **API REST:** OpenAPI 3.1, RFC 9457 (Problem Details), versionado.
- **Reportes:** Exportación básica (CSV, PDF), consultas autorizadas.
- **OCR:** Asistido, motor básico, sin entrenamiento custom.
- **Búsqueda:** PostgreSQL FTS inicial, LIKE avanzado, filtros por metadatos y permisos.
- **Auditoría:** Registro de accesos y eventos, integridad por hash, acceso segregado.
- **Antivirus:** Integración en cuarentena, respuesta en fila de procesamiento.
- **Observabilidad:** OpenTelemetry/OTLP, correlación de trazas, métricas básicas.

## 6. Fuera del MVP

### Fase 2

- Comunicaciones internas y distribución avanzada.
- Flujos configurables de revisión/aprobación y firma electrónica básica.
- Digitalización asistida, OCR y cargas masivas.
- Préstamo/devolución de expedientes físicos.
- Transferencias documentales y aplicación asistida de retención.
- Portal ciudadano ampliado, QR de validación, SMS e indicadores avanzados.
- PGD, PINAR, inventario/FUID y controles de acceso archivísticos con mayor profundidad.

### Fase 3

- TVD y fondos acumulados; disposición final y eliminación controlada integral.
- Preservación digital avanzada, verificación periódica de integridad y migración de formatos.
- Firma digital con proveedor acreditado según caso.
- Pagos, suscripciones y facturación electrónica.
- Integraciones corporativas y gubernamentales priorizadas.
- OpenSearch/Elasticsearch cuando umbrales medidos lo justifiquen.

### Futuro

- Aplicaciones móviles nativas, PWA offline y agente de escritorio.
- WhatsApp Business, analítica avanzada e IA de clasificación/extracción.
- Interoperabilidad gubernamental no comprometida y despliegues multirregión.

## 6. Exclusiones explícitas iniciales

- No se desarrollará una pasarela de pagos, entidad de certificación, proveedor de firma digital ni sistema tributario propio.
- No se almacenarán PAN completos, CVV ni credenciales bancarias.
- No se prometerá integración externa sin API disponible, convenio, costo y requisitos verificados.
- No se eliminarán automáticamente documentos solo por vencer un término; toda disposición requiere regla vigente y autorización trazable.
- No se asumirá que digitalizar autoriza destruir el original físico.
- No se almacenarán archivos binarios en columnas de la base transaccional principal.
- No se dirigirá el producto a menores en el MVP, aunque deberá proteger documentos que contengan sus datos.
- No se garantiza valor probatorio por una función aislada; la fuerza de la evidencia dependerá del proceso y controles aplicables.
- No se migrarán archivos heredados de clientes dentro del MVP sin alcance específico.

## 7. Alcance técnico aprobado

- Frontend SPA con React, TypeScript y Vite.
- Runtime Node.js 24 LTS.
- Macroservicios backend con NestJS sobre Express mediante `@nestjs/platform-express`.
- Arquitectura distribuida por dominios y API REST documentada con OpenAPI 3.1.
- PostgreSQL con Kysely/`pg`, migraciones `node-pg-migrate`, propiedad por servicio y PostgreSQL FTS inicial.
- Amazon S3 para SaaS y MinIO para instalaciones privadas, cuarentena y WORM selectivo conforme a ADR-016.
- Keycloak con OIDC/OAuth 2.0, Authorization Code + PKCE, MFA y federación futura.
- EventBridge/SQS para SaaS y RabbitMQ para instalaciones privadas; outbox, inbox, DLQ e idempotencia obligatorios.
- Procesamiento asíncrono desacoplado para antivirus, correo, OCR, integridad e indexación.
- Despliegue preferente en AWS con puertos/adaptadores para almacenamiento y servicios sustituibles.
- Observabilidad definida con OpenTelemetry/OTLP y backends por modalidad; CI/CD e infraestructura reproducible continúan pendientes.

Estas tecnologías están aprobadas por ADR-011 a ADR-021; su aprobación no constituye evidencia de implementación ni de cumplimiento de capacidad.

## 8. Alcance de cumplimiento

El sistema deberá soportar controles derivados de gestión documental, acceso a información, protección de datos, mensajes de datos y firmas, seguridad informática, comercio electrónico y facturación cuando sean aplicables. La matriz legal deberá clasificar cada obligación como general, condicional o específica de cliente. Todo punto dudoso se marcará “Requiere validación jurídica especializada”.

## 9. Criterios de aceptación del alcance

El alcance podrá aprobarse cuando:

1. El segmento y cliente piloto estén definidos.
2. Cada capacidad MVP tenga objetivo, dueño y criterio de aceptación de negocio.
3. Las exclusiones sean aceptadas por patrocinador y Product Owner.
4. Se disponga de rangos de volumen y objetivos de servicio preliminares.
5. Los riesgos críticos tengan dueño y tratamiento.
6. La distinción SaaS/privado y las integraciones comprometidas estén resueltas.
7. Exista trazabilidad entre `OBJ-*`, capacidades y backlog.

## 10. Supuestos y dependencias

Rigen `SUP-001` a `SUP-015` y `RES-001` a `RES-012` del documento `01_Requisitos/15_Supuestos_Restricciones.md`. Los supuestos no validados no se transformarán en compromisos contractuales.

## 12. Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Línea base inicial derivada del diagnóstico. | Codex |
| 0.2 | 2026-07-16 | Alcance técnico normalizado al stack y arquitectura aprobados. | Codex |
| 1.0 | 2026-08-05 | Modalidad SaaS, cliente piloto Venus, integraciones comprometidas, responsables reales, aprobado. | Antonio José Escrucería Uribe |
