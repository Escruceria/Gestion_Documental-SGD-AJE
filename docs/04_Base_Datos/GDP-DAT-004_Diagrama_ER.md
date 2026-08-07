# Diagramas ER por macroservicio

| Campo | Valor |
|---|---|
| Código | GDP-DAT-004 |
| Versión | 0.1 |
| Estado | Borrador lógico, no DDL |
| Fecha | 2026-07-16 |
| Propietario | `[ARQUITECTO_DATOS]` |
| Revisores | `[ARQUITECTO]`, `[RESPONSABLE_SEGURIDAD]`, `[LIDER_ARCHIVISTICO]` |
| Aprobador | `[COMITE_ARQUITECTURA]` |

Las referencias `external_*` no se dibujan como relaciones entre diagramas: son IDs contractuales y no FK cruzadas.

## identity-access-service

```mermaid
erDiagram
  ORGANIZATION ||--|| TENANT : owns
  TENANT ||--o{ HEADQUARTERS : contains
  HEADQUARTERS ||--o{ DEPARTMENT : groups
  DEPARTMENT ||--o{ DEPARTMENT : parent_of
  USER ||--o{ MEMBERSHIP : has
  TENANT ||--o{ MEMBERSHIP : grants
  MEMBERSHIP ||--o{ MEMBERSHIP_ROLE : assigned
  ROLE ||--o{ MEMBERSHIP_ROLE : groups
  ROLE ||--o{ ROLE_PERMISSION : permits
  PERMISSION ||--o{ ROLE_PERMISSION : included
```

## document-core-service

```mermaid
erDiagram
  SERIES ||--o{ SUBSERIES : contains
  SUBSERIES ||--o{ DOCUMENT_TYPES : classifies
  DOCUMENT_TYPES ||--o{ DOCUMENTS : types
  DOCUMENTS ||--o{ DOCUMENT_VERSIONS : versions
  DOCUMENT_VERSIONS ||--o{ DOCUMENT_FILES : references
  SERIES ||--o{ RECORDS : groups
  RECORDS ||--o{ RECORD_DOCUMENTS : indexes
  DOCUMENTS ||--o{ RECORD_DOCUMENTS : incorporated
  RECORDS ||--o{ TRANSFERS : transfers
  RECORDS ||--o{ DISPOSITIONS : disposes
```

## correspondence-workflow-service

```mermaid
erDiagram
  SEQUENCES ||--o{ CORRESPONDENCES : assigns
  CORRESPONDENCES ||--o{ PARTIES : involves
  CORRESPONDENCES ||--o{ DISTRIBUTIONS : routes
  WORKFLOWS ||--o{ WORKFLOW_STEPS : defines
  CORRESPONDENCES ||--o{ TASKS : creates
  WORKFLOW_STEPS ||--o{ TASKS : instantiates
  TASKS ||--o{ APPROVALS : decides
```

## document-processing-worker

```mermaid
erDiagram
  PROCESSING_JOBS ||--o| SCAN_RESULTS : produces
  PROCESSING_JOBS ||--o| HASH_RESULTS : produces
  PROCESSING_JOBS ||--o| OCR_RESULTS : produces
  PROCESSING_JOBS ||--o{ CONVERSION_RESULTS : produces
  PROCESSING_JOBS ||--o{ INTEGRITY_CHECKS : verifies
  INBOX ||--o| PROCESSING_JOBS : deduplicates
  PROCESSING_JOBS ||--o{ OUTBOX : emits
```

## audit-compliance-service

```mermaid
erDiagram
  AUDIT_EVENTS ||--o{ AUDIT_INTEGRITY_MARKS : protects
  PRIVACY_REQUESTS ||--o{ PRIVACY_REQUEST_HISTORY : transitions
  CONSENTS ||--o{ CONSENT_HISTORY : versions
  INCIDENTS ||--o{ INCIDENT_HISTORY : transitions
  INBOX ||--o| AUDIT_EVENTS : deduplicates
```

## notification-integration-service

```mermaid
erDiagram
  NOTIFICATION_TEMPLATES ||--o{ NOTIFICATIONS : renders
  NOTIFICATIONS ||--o{ DELIVERY_ATTEMPTS : attempts
  INTEGRATIONS ||--o{ WEBHOOK_SUBSCRIPTIONS : exposes
  WEBHOOK_SUBSCRIPTIONS ||--o{ WEBHOOK_DELIVERIES : delivers
  INBOX ||--o| NOTIFICATIONS : deduplicates
  NOTIFICATIONS ||--o{ OUTBOX : emits
```

## Reglas de lectura

- Toda relación dibujada se materializa únicamente dentro de la base del servicio correspondiente.
- La cardinalidad final se valida con casos de negocio antes de DDL.
- `tenant_id`, auditoría técnica y columnas de control se omiten visualmente para legibilidad, pero son obligatorias donde aplique.
- Outbox/inbox se muestran solo donde aclaran el flujo; el patrón aplica a todo servicio productor/consumidor.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: modelos GDP-DAT-001/002, matriz de propiedad y C4 nivel 3. Supuesto: las entidades nombradas cubren el MVP. Decisiones: seis diagramas independientes. Pendientes: atributos físicos, cardinalidades configurables e instrumentos del piloto.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Seis diagramas ER lógicos. | Codex |
