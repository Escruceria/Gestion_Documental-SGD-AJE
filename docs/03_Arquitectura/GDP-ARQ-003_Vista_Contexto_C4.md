# Vista C4 - Contexto

| Campo | Valor |
|---|---|
| Código | GDP-ARQ-003 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 3-A2) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | Álvaro Patiño Cruz (PO), David Ernesto Antequera Martínez (QA) |
| Nivel C4 | 1 - Contexto del sistema |
| Validado | Venus Ingeniería AS-IS (2026-08-05) |

## 1. Propósito

Mostrar el SGD como una caja única, sus personas y sistemas externos. La presencia de una integración en el diagrama no implica que forme parte del MVP; su fase se indica en el catálogo.

```mermaid
flowchart LR
    subgraph Personas["Personas y organizaciones"]
        CIT["Ciudadano / titular\nRadica, consulta y ejerce derechos"]
        USR["Usuario institucional\nProduce, tramita y consulta"]
        ADM["Administrador de organización\nConfigura tenant, usuarios y permisos"]
        ARC["Gestión documental y archivo\nInstrumentos, expedientes y disposición"]
        AUD["Auditor / privacidad / seguridad\nConsulta evidencias e incidentes"]
        SOP["Soporte autorizado\nOpera sin acceso permanente al contenido"]
    end

    SGD["Sistema de Gestión Documental\nPlataforma multiempresa para ciclo de vida documental"]

    subgraph Externos["Sistemas externos"]
        IDP["Proveedor de identidad / directorio\nKeycloak, Entra ID, LDAP, Google"]
        OBJ["Almacenamiento de objetos\nS3 / MinIO"]
        MSG["Proveedores de comunicación\nCorreo, SMS, WhatsApp"]
        SIG["Proveedor de firma\nElectrónica / digital"]
        OCR["Proveedor OCR opcional\nTesseract o administrado"]
        ERP["Sistemas institucionales\nERP, CRM, jurídicos, financieros"]
        GOV["Servicios gubernamentales\nSolo mediante convenio/API verificada"]
        PAY["Pago y facturación\nFase 3"]
    end

    CIT -->|HTTPS| SGD
    USR -->|HTTPS| SGD
    ADM -->|HTTPS| SGD
    ARC -->|HTTPS| SGD
    AUD -->|HTTPS| SGD
    SOP -->|Acceso JIT aprobado| SGD

    SGD <-->|OIDC/SAML/LDAP| IDP
    SGD <-->|API S3| OBJ
    SGD -->|API/SMTP| MSG
    SGD <-->|API y evidencia| SIG
    SGD <-->|Trabajo/resultado| OCR
    SGD <-->|REST/Webhooks/Eventos| ERP
    SGD <-->|APIs verificadas| GOV
    SGD <-->|API/Webhooks| PAY
```

## 2. Alcance por actor

| Actor | Capacidades principales | Restricción crítica |
|---|---|---|
| Ciudadano/titular | Radicar, consultar caso, descargar respuesta, solicitud de privacidad | Solo sus casos; minimización y accesibilidad |
| Usuario institucional | Documentos, expedientes, tareas y búsqueda | Tenant, dependencia, clasificación y estado |
| Administrador | Estructura, membresías, roles y configuración | No altera auditoría ni accede por defecto a todo contenido |
| Gestión documental | Clasificación, TRD/TVD, transferencias y disposición | Segregación y actos aprobados |
| Auditor/privacidad/seguridad | Evidencias, incidentes y solicitudes | Solo lectura/acciones especializadas; propósito registrado |
| Soporte | Diagnóstico técnico | Acceso temporal, aprobado, mínimo y auditado |

## 3. Límites de confianza

```mermaid
flowchart TB
    PUB["Internet / dispositivos no confiables"] --> EDGE["Borde: CDN, WAF, rate limit"]
    EDGE --> APP["Zona de aplicación"]
    APP --> DATA["Zona de datos"]
    APP --> EXT["Terceros externos"]
    OPS["Administración privilegiada"] -->|MFA + JIT + bastión/control| APP
    OPS -->|Acceso excepcional controlado| DATA
```

- Todo tráfico externo se autentica o limita según canal público.
- El `tenant_id` no se acepta como autoridad solo por venir del cliente; se deriva de identidad/membresía y contexto autorizado.
- Terceros reciben el mínimo dato requerido y están sujetos a contrato, seguridad y retención.
- Enlaces a objetos son temporales, limitados a operación y objeto.

## 4. Dependencias MVP

MVP: identidad, almacenamiento de objetos, correo y antivirus. OCR puede integrarse en Fase 2. Firma, SMS, WhatsApp, pagos, facturación e integraciones gubernamentales no son dependencias del núcleo MVP salvo cambio aprobado.

## 5. Preguntas pendientes

- Proveedor de identidad operado y federaciones del piloto.
- Sistemas externos comprometidos contractualmente.
- Residencia de datos y modalidad privada.
- Canales ciudadanos y autenticación requerida por tipo de trámite.

