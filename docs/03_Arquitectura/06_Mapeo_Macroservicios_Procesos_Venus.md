# Mapeo: Macroservicios ↔ Procesos Venus AS-IS ↔ Datos

| Campo | Valor |
|---|---|
| Código | GDP-ARQ-006 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 3-A2) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | Álvaro Patiño Cruz (PO, Análisis AS-IS), David Ernesto Antequera Martínez (QA) |
| Objetivo | Vincular 5 procesos Venus actuales + 6 macroservicios SGD + modelo datos |

---

## 1. Matriz Macroservicios ↔ Procesos Venus

| Proceso Venus AS-IS | Macroservicio SGD | Responsabilidad | Entidades | RF flujo vertical |
|---|---|---|---|---|
| **Radicación Entrada** (300/día) | correspondence-workflow-service | Asignar número consecutivo, registrar entrada, distribuir | correspondences, sequences, tasks, workflow_steps | RF-COR-001 |
| **Radicación Salida** (200/día) | correspondence-workflow-service | Registrar salida, solicitar aprobación, enviarevidencia | correspondences, approvals, sequences | RF-COR-001 |
| **Gestión Expedientes** (5.000 abiertos) | document-core-service | Crear, clasificar, mantener índice, transferencia, disposición | expedients, expedient_documents, transfers, dispositions | RF-DOC-001, RF-DOC-004, RF-DOC-009 |
| **Búsqueda y Consulta** (ad hoc) | document-core-service | Búsqueda full-text, aplicar permisos, retornar resultados | documents, document_versions, series, audit_logs | RF-DOC-004 (búsqueda) |
| **Control Versiones** (cambios doc) | document-core-service | Registrar cambios, mantener inmutabilidad, auditar | document_versions, document_files, audit_logs | RF-DOC-009 |

---

## 2. Desglose por macroservicio

### **MS-01: identity-access-service**

**Propósito:** Organización, usuarios, identidad Keycloak, roles, permisos.

**Procesos Venus que soporta:**
- Setup inicial de Venus (crear organización, departamentos)
- Invitación de usuarios (secretarias, gestores, supervisores)
- Control de permisos (quién puede radicar, aprobar, etc.)

**Entidades:**
- organizations, users, departments, memberships, roles, permissions, delegations

**APIs principales:**
- POST /organizations — Crear tenant Venus
- POST /users — Invitar usuario
- GET /users/:id/permissions — Permisos del usuario
- POST /delegations — Delegar función

**Flujo vertical:**
- Paso 1: Crear organización (RF-IAM-001)
- Paso 2: Invitar usuarios (RF-IAM-003)
- Paso 3: Vincular Keycloak (RF-IAM-004)
- Paso 4: Cambio tenant (RF-IAM-008)

---

### **MS-02: document-core-service**

**Propósito:** Clasificación, documentos, versiones, expedientes, retención, transferencias.

**Procesos Venus que soporta:**
- Crear documento (capturar en sistema)
- Versionar (registrar cambios)
- Gestionar expedientes (crear, clasificar, mantener)
- Buscar (full-text, filtros, permisos)
- Disposición (archivar, transferir, destruir)

**Entidades:**
- series, document_types, documents, document_versions, document_files
- expedients, expedient_documents, transfers, dispositions
- retention_schedules

**APIs principales:**
- POST /series — Crear serie documental (ej: "RH - Nómina")
- POST /documents — Crear documento
- POST /documents/:id/versions — Registrar versión
- POST /expedients — Crear expediente
- GET /documents/search?q=... — Búsqueda full-text
- POST /expedients/:id/transfer — Transferir expediente
- POST /expedients/:id/disposition — Disponer expediente

**Flujo vertical:**
- Paso 5: Series/Tipos (RF-DOC-001)
- Paso 6: Crear documento (RF-DOC-004)
- Paso 10: Registrar versión (RF-DOC-009)

---

### **MS-03: correspondence-workflow-service**

**Propósito:** Radicaciones, sequences, tareas, aprobaciones, workflow.

**Procesos Venus que soporta:**
- Radicación de entrada (300/día)
- Radicación de salida (200/día)
- Distribución a responsable
- Aprobación de comunicaciones
- Seguimiento de tareas

**Entidades:**
- correspondences, sequences, workflow_steps, tasks, approvals
- channels

**APIs principales:**
- POST /correspondences/incoming — Radicar entrada
- POST /correspondences/outgoing — Radicar salida
- GET /correspondences/:id/next-sequence — Siguiente número
- POST /tasks — Crear tarea de seguimiento
- POST /approvals/:id/approve — Aprobar
- GET /correspondences?status=pending — Bandeja

**Flujo vertical:**
- Paso 11: Radicar entrada (RF-COR-001)

---

### **MS-04: document-processing-worker**

**Propósito:** Carga en cuarentena, antivirus, hash, OCR, conversión, validación.

**Procesos Venus que soporta:**
- Recibir archivo adjunto en solicitud de carga
- Validar formato y tamaño
- Escanear virus (antivirus)
- Calcular hash integridad
- Extraer texto (OCR si aplica)
- Almacenar en S3/MinIO

**Entidades:**
- processing_jobs, scan_results, ocr_results, integrity_checks
- document_files (referencias)

**APIs principales:**
- POST /uploads/accept — Aceptar carga multipart
- GET /jobs/:id/status — Estado del procesamiento
- POST /jobs/:id/validate — Validar completud
- EventBridge: DocumentFileUploaded, ScanComplete, OCRComplete

**Flujo vertical:**
- Paso 7: Solicitar carga (RF-DOC-005)
- Paso 8: Confirmar carga (RF-DOC-006)
- Paso 9: Procesar archivo (RF-DOC-007)

---

### **MS-05: audit-compliance-service**

**Propósito:** Auditoría inmutable, consentimientos LSRPD, privacy requests, incidentes.

**Procesos Venus que soporta:**
- Registrar acceso (quién vio qué documento, cuándo)
- Consentimientos (LSRPD)
- Solicitudes derechos (derecho al olvido, etc.)
- Incidentes (acceso no autorizado, virus, etc.)

**Entidades:**
- audit_logs, consent_logs, privacy_requests, incidents, compliance_evidence

**APIs principales:**
- POST /audit-logs — Registrar evento (consumir desde outbox)
- GET /audit-logs?entity=document&entity_id=xxx — Trazabilidad
- POST /privacy-requests — Crear solicitud LSRPD
- POST /incidents — Reportar incidente

**Flujo vertical:**
- Paso 12: Auditar evento (RF-AUD-001)

---

### **MS-06: notification-integration-service** (Fase MVP)

**Propósito:** Envío de notificaciones, integraciones externas.

**Procesos Venus que soporta:**
- Notificar recepción de radicación
- Alertar de vencimientos de tareas
- Confirmar envío de comunicaciones
- Integración con email, SMS, Slack

**Entidades:**
- notifications (log de envíos)
- integration_configs (configuración de conectores)

**APIs principales:**
- POST /notifications — Enviar notificación
- GET /integrations/:id/status — Estado de integración

**Flujo vertical:**
- Notificaciones post-acción (transversal)

---

## 3. Flujo vertical 12-paso — Asignación macroservicios

| Paso | Acción | MS Primario | MS Secundarios | Entidades | Eventos |
|---|---|---|---|---|---|
| 1 | Crear organización | MS-01 (IAM) | — | organizations | OrganizationCreated |
| 2 | Invitar usuarios | MS-01 (IAM) | — | users, memberships | UsersInvited |
| 3 | Vincular Keycloak | MS-01 (IAM) | — | users (keycloak_id) | IdentityLinked |
| 4 | Cambio tenant | MS-01 (IAM) | — | memberships | TenantContextChanged |
| 5 | Series/Tipos | MS-02 (DOC) | — | series, document_types | SeriesCreated |
| 6 | Crear documento | MS-02 (DOC) | MS-01 | documents | DocumentCreated |
| 7 | Solicitar carga | MS-04 (WRK) | — | document_files (pending) | UploadRequested |
| 8 | Confirmar carga | MS-04 (WRK) | MS-02 | document_files (verified) | UploadConfirmed |
| 9 | Procesar archivo | MS-04 (WRK) | MS-05 | processing_jobs, scan_results | FileProcessed |
| 10 | Registrar versión | MS-02 (DOC) | MS-05 | document_versions | VersionRegistered |
| 11 | Radicar entrada | MS-03 (COR) | MS-02, MS-05, MS-06 | correspondences, sequences | CorrespondenceRegistered |
| 12 | Auditar evento | MS-05 (AUD) | — | audit_logs | EventAudited |

---

## 4. Matriz Permisos × Macroservicios

**¿Quién puede hacer qué en Venus?**

| Actor Venus | IAM | DOC | COR | WRK | AUD | NIN |
|---|---|---|---|---|---|---|
| Recepcionista | R | — | C radiación entrada | — | R | R notif |
| Secretaria | R | R | C/U radicación | R upload | R | R |
| Gestor documental | R | CRU expedientes | R | R | R | R |
| Especialista | R | R documentos | R correspon | R upload | R | R |
| Supervisor | R | R | C aprobaciones | R | R | R |
| Archivo/Histórico | R | R dispositiones | — | — | R | — |
| IT/Admin | U (admin) | U (admin) | — | — | R | U |
| Auditor/Compliance | R | R | R | R | **CRU** | R |

C = Create, R = Read, U = Update, D = Delete

---

## 5. Data flow Venus → Macroservicios

```
Venus Ingeniería (usuario)
        │
        ├─ Logín (email)
        │   └─ IAM (Keycloak): Validar
        │       └─ MS-01: Obtener permisos, tenant_id
        │
        ├─ Crear expediente
        │   └─ MS-02: POST /expedients
        │       └─ audit_logs insert (MS-05)
        │
        ├─ Radicar entrada (email/correo)
        │   ├─ MS-03: POST /correspondences/incoming
        │   │   └─ Obtener siguiente número (sequences)
        │   ├─ MS-02: Vinculación a document (si aplica)
        │   ├─ MS-05: Registrar evento (audit_logs)
        │   └─ MS-06: Enviar notificación
        │
        ├─ Subir archivo
        │   ├─ MS-04: POST /uploads/accept (multipart)
        │   │   ├─ Antivirus (scan_results)
        │   │   ├─ Hash SHA-256
        │   │   └─ S3/MinIO PUT
        │   ├─ MS-02: Asignar a documento
        │   └─ MS-05: Auditar "file uploaded"
        │
        ├─ Buscar documento
        │   ├─ MS-02: GET /documents/search
        │   │   └─ Aplicar RLS (tenant_id)
        │   └─ MS-05: Registrar "search executed"
        │
        └─ Cerrar expediente
            ├─ MS-02: POST /expedients/:id/transfer o /disposition
            ├─ MS-05: Registrar evento + certificado
            └─ MS-06: Notificar a archivo
```

---

## 6. Validaciones Venus vs. Requisitos SGD

| Req SGD | Proc Venus | Macroservicio | Status |
|---|---|---|---|
| RF-IAM-001 (org) | Setup Venus | MS-01 | ✅ Validado |
| RF-IAM-003 (invite) | Invitar usuarios | MS-01 | ✅ Validado |
| RF-IAM-004 (Keycloak) | Vincular identidad | MS-01 | ✅ Validado |
| RF-IAM-008 (tenant switch) | Multi-tenant Venus | MS-01 | ⏳ Futuro (single-tenant POC) |
| RF-DOC-001 (series) | Clasificación actual | MS-02 | ✅ Validado |
| RF-DOC-004 (crear doc) | Documentos nuevos | MS-02 | ✅ Validado |
| RF-DOC-005/006 (carga) | Adjuntos hoy | MS-04 | ✅ Validado |
| RF-DOC-007 (procesar) | Antivirus, hash | MS-04 | ✅ Validado (antivirus mock POC) |
| RF-DOC-009 (versionar) | Control versiones | MS-02 | ✅ Validado |
| RF-COR-001 (radicar) | Radicación actual | MS-03 | ✅ Validado |
| RF-AUD-001 (auditar) | Logging actual | MS-05 | ✅ Validado |

---

## 7. Dependencias de arquitectura

```
┌─────────────────────────────────────────────────┐
│ Frontend (React/Vite)                           │
│ • Radicación, búsqueda, expedientes, tareas     │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ BFF (Backend for Frontend) / API Gateway        │
│ • Auth middleware (SET tenant_id)               │
│ • Enrutamiento, rate limiting                   │
└──┬───────┬───────┬───────┬───────┬───────────────┘
   │       │       │       │       │
   ▼       ▼       ▼       ▼       ▼
 MS-01  MS-02  MS-03  MS-04  MS-05
 (IAM) (DOC) (COR) (WRK) (AUD)
   │       │       │       │       │
   └───────┼───────┼───────┼───────┘
           │       │       │
     ┌─────▼───────▼───────▼──────┐
     │ PostgreSQL (shared, RLS)   │
     │ • Todas entidades          │
     │ • tenant_id + RLS policies │
     └────────────────────────────┘
           │
     ┌─────▼──────────┐
     │ S3 / MinIO     │
     │ (blobs, WORM)  │
     └────────────────┘

     EventBridge / RabbitMQ
     (inter-servicio)
```

---

## 8. Pendientes POC-001 y POC-002

**POC-001 (Multitenancy, RLS, Keycloak):**
- [ ] MS-01: Setup org, usuarios, permisos
- [ ] MS-02: Crear serie, documento
- [ ] Validar RLS aislamiento

**POC-002 (Carga documental, antivirus, outbox):**
- [ ] MS-04: Carga multipart, cuarentena
- [ ] MS-02: Verificar completud
- [ ] MS-05: Auditar evento
- [ ] Validar antivirus mock, hash, idempotencia

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Mapeo 5 procesos Venus + 6 macroservicios + modelo datos + flujo vertical 12-paso. | Antonio José Escrucería Uribe |
