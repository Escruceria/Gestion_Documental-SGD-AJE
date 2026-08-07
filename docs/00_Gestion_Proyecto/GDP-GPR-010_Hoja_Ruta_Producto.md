# Hoja de ruta del producto

| Campo | Valor |
|---|---|
| Código | GDP-GPR-010 |
| Versión | 0.2 |
| Estado | Borrador orientado a resultados |
| Fecha | 2026-07-16 |
| Propietario | `[PRODUCT_OWNER]` |

## 1. Enfoque

La hoja de ruta organiza resultados y capacidades, no fechas ficticias. Las fechas se asignarán después de estimar equipo, dependencias y cliente piloto. Cada fase requiere una puerta de salida; no se inicia programación productiva sin línea base mínima de requisitos y riesgos críticos tratados.

La ejecución usará el stack aprobado: React/TypeScript/Vite; Node.js 24 LTS; NestJS sobre Express; REST/OpenAPI 3.1; PostgreSQL con Kysely/pg y node-pg-migrate; Keycloak con OIDC/OAuth 2.0; y EventBridge/SQS para mensajería SaaS.

## 2. Secuencia

```mermaid
flowchart LR
    F0["F0 Descubrimiento y línea base"] --> F1["F1 MVP seguro y trazable"]
    F1 --> P["Piloto controlado"]
    P --> F2["F2 Operación archivística ampliada"]
    F2 --> F3["F3 Conservación, firma y ecosistema"]
    F3 --> FUT["Futuro móvil, IA e interoperabilidad"]
```

## 3. Fase 0 - Descubrimiento y línea base

**Resultado:** alcance aprobable y diseño implementable del MVP.  
**Incluye:** gobierno, objetivos, procesos TO-BE prioritarios, RF/RNF, modelo conceptual, C4, amenazas, privacidad, matriz legal inicial, ADR, prototipos y estrategia de pruebas.  
**Salida:** cero preguntas críticas sin dueño; trazabilidad del MVP; riesgos RSK-001/003/004/007/015 con plan aprobado.

## 4. Fase 1 - MVP seguro y trazable

**Resultado:** una organización piloto puede gestionar el núcleo documental sin mezclar información con otros tenants.

### Incremento 1 - Fundaciones

- Organizaciones, sedes, dependencias y configuración base.
- Identidad, membresías, recuperación, MFA, roles/permisos.
- Auditoría base, secretos, observabilidad y aislamiento tenant.
- Series, subseries y tipos documentales.

### Incremento 2 - Núcleo documental

- Documentos, archivos en cuarentena, antivirus, metadatos y hash.
- Versiones, estados y trazabilidad.
- Expedientes e incorporación controlada.
- Búsqueda autorizada por metadatos.

### Incremento 3 - Correspondencia y privacidad

- Radicación de entrada/salida, consecutivos, anexos y comprobantes.
- Distribución/tareas mínimas y notificaciones por correo.
- Consentimientos versionados cuando apliquen.
- Solicitudes de titulares y reportes básicos.

### Incremento 4 - Preparación operativa

- Backup/restore probado, alertas, runbooks y accesibilidad.
- Pruebas de seguridad, aislamiento, carga y UAT.
- Exportación básica de tenant y criterios de salida del piloto.

## 5. Piloto controlado

**Resultado:** validar valor, usabilidad, desempeño y operación con datos/volúmenes representativos.  
**Medidas:** tiempo AS-IS/TO-BE de radicación/localización, errores, adopción, latencia p95, incidentes, precisión de permisos y restauración.  
**Condición de expansión:** sin defectos críticos, tratamiento de altos aprobado y metas acordadas cumplidas.

## 6. Fase 2 - Operación archivística ampliada

- Comunicaciones internas y workflow configurable.
- Revisión/aprobación y firma electrónica por riesgo.
- OCR, digitalización y cargas masivas.
- Préstamos/devoluciones físicas.
- Transferencias primarias/secundarias y retención asistida.
- PGD, PINAR, FUID/inventario y TCA con alcance validado.
- Portal ciudadano ampliado, QR, SMS e indicadores.

## 7. Fase 3 - Conservación y ecosistema

- TVD, valoración, disposición y eliminación controlada.
- Preservación digital avanzada, formatos, fixity y migración.
- Firma digital e integraciones priorizadas.
- Suscripciones, pagos y facturación electrónica.
- Motor de búsqueda especializado si los umbrales lo justifican.
- Oferta de despliegue/base dedicada y recuperación por tenant madura.

## 8. Futuro

- PWA offline, aplicaciones móviles y agente de escritorio.
- WhatsApp Business mediante proveedor oficial.
- IA asistida con revisión humana, métricas y controles de privacidad.
- Interoperabilidad gubernamental sujeta a convenios y APIs.
- Alta disponibilidad multirregión según SLO y mercado.

## 9. Dependencias de producto

| Decisión | Bloquea | Responsable |
|---|---|---|
| Cliente piloto/segmento | Requisitos, UX, legal y métricas | Patrocinador/PO |
| Alta e identidad multi-organización | IAM y RF-001 | PO/Arquitectura |
| Volúmenes 12/24/36 meses | Datos, búsqueda, infraestructura y costo | PO/Operaciones |
| SLO, RPO y RTO | Topología, backup y planes | Patrocinador/Operaciones |
| Instrumentos en MVP | Modelo y backlog archivístico | Líder archivístico |
| Integraciones comprometidas | Arquitectura y cronograma | PO/Comercial |

## 10. Criterios de priorización

Orden: cumplimiento/seguridad crítico; dependencia habilitadora; valor para flujo principal; reducción de riesgo; frecuencia; costo de demora; esfuerzo. Toda nueva capacidad Must deberá indicar qué se desplaza o qué capacidad adicional se autoriza.

## 11. Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Roadmap inicial sin fechas no sustentadas. | Codex; pendiente de priorización |
| 0.2 | 2026-07-16 | Roadmap alineado con ADR-011 a ADR-014. | Codex; decisión del propietario |
