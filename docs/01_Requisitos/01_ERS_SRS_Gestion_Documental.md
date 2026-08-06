# Especificación de requisitos del sistema (ERS/SRS)

| Campo | Valor |
|---|---|
| Código | GDP-REQ-001 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Analista Requisitos, Product Owner, Líder Archivístico) |
| Revisores | Álvaro Patiño Cruz, Antonio José Escrucería Uribe (Arquitecto, Seguridad), David Ernesto Antequera Martínez (QA) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito y alcance

Definir la línea base verificable del MVP de gestión documental multiempresa: configuración organizacional, identidad y autorización, clasificación, documentos y expedientes, carga segura, correspondencia, búsqueda, auditoría/privacidad, notificaciones y operación básica. Comercial/facturación, preservación avanzada, OCR obligatorio, aplicaciones móviles e integraciones no verificadas quedan fuera.

## Contexto y actores

La SPA consume el API Gateway; los seis macroservicios conservan propiedad exclusiva de datos. Keycloak autentica; la aplicación decide membresía, tenant y autorización de recursos. Actores canónicos: administrador de plataforma, administrador de organización, gestor documental, radicador, usuario institucional, auditor, responsable de datos, operador, ciudadano/remitente y servicios técnicos.

## Capacidades de la línea base

| Grupo | RF | Resultado |
|---|---|---|
| Organización e IAM | RF-IAM-001..008 | Tenant configurado, usuarios y permisos controlados. |
| Clasificación y documentos | RF-DOC-001..014 | Instrumentos, documentos, versiones y expedientes íntegros. |
| Correspondencia | RF-COR-001..006 | Radicación consecutiva, comprobable y distribuible. |
| Consulta | RF-DOC-015..016 | Búsqueda y consulta autorizada. |
| Cumplimiento | RF-AUD-001..005 | Auditoría, consentimientos, solicitudes e incidentes. |
| Notificaciones | RF-NIN-001..002 | Entrega y reintento trazables. |
| Reportes y operación | RF-OPS-001..004 | Reporte, backup/restore y exportación básica. |

## Flujo vertical inicial (prioridad máxima)

Los siguientes 12 requisitos son el flujo crítico ejecutable primero, validado con cliente piloto Venus, que habilita todas las demás capacidades:

1. **RF-IAM-001** — Crear y configurar organización (tenant).
2. **RF-IAM-003** — Invitar usuario institucional.
3. **RF-IAM-004** — Asociar identidad Keycloak.
4. **RF-IAM-008** — Cambiar contexto de tenant (multitenant).
5. **RF-DOC-001** — Parametrizar series documentales.
6. **RF-DOC-004** — Crear documento (logrado).
7. **RF-DOC-005** — Solicitar carga de archivo (multipart).
8. **RF-DOC-006** — Confirmar carga multipart.
9. **RF-DOC-007** — Procesar archivo en cuarentena (antivirus/hash).
10. **RF-DOC-009** — Registrar versión documental.
11. **RF-COR-001** — Radicar comunicación de entrada.
12. **RF-AUD-001** — Registrar evento auditable.

Cada RF del flujo vertical debe validarse con casos de prueba E2E antes de aceptarse como "hecho".

## Restricciones arquitectónicas

ADR-011 a ADR-021 son vinculantes. No hay acceso cruzado a bases; `tenant_id` y RLS son defensa adicional; los blobs no residen en PostgreSQL; carga directa multipart a cuarentena; antivirus e integridad preceden disponibilidad; entrega asíncrona `at-least-once` con outbox/inbox, idempotencia y DLQ; errores HTTP usan RFC 9457.

## Calidad, interfaces y datos

Los RNF se definen en GDP-REQ-003. REST/OpenAPI 3.1 cubre el flujo vertical inicial; los eventos usan contratos versionados y no transportan contenido documental. Datos personales se minimizan y clasifican. Retención y eliminación dependen de instrumento y autorización; **Requiere validación jurídica especializada**.

## Trazabilidad y aceptación

Cada RF se vincula al menos con objetivo, regla, criterio y caso de prueba en `09_Matriz_Trazabilidad.csv`. Ningún RF se considera aprobado hasta resolver los pendientes indicados en su catálogo y obtener revisión de los roles competentes.

## Fuentes

Alcance, objetivos OBJ-001..012, supuestos/restricciones, mapa de dominios, catálogo de eventos, ADR-011..021 y fuentes normativas heredadas (solo como insumo no validado).

## Supuestos, decisiones y pendientes

- ✅ Supuestos: SUP-001..015 — validados en Fase 1 Ejecutiva.
- ✅ Decisiones: alcance MVP y arquitectura de los ADR-011..021 vigentes.
- ✅ Cliente piloto: Venus Ingeniería confirmado (45 usuarios, 5.000 documentos).
- ✅ Volúmenes: 1.000 docs/día, 500 radicaciones/día, 30% crecimiento anual (Acta v1.0).
- ✅ SLA/RPO/RTO: 99,5% disponibilidad, RPO 4h, RTO 8h (Acta v1.0).
- ⏳ Reglas archivísticas concretas: pendiente análisis AS-IS con Venus (septiembre 2026).
- ⏳ Jurídico: matriz legal debe mapear normas a requisitos antes de Fase 4 (especificación jurídica, vigencia, artículo, aplicabilidad).

## Historial de cambios

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Línea base inicial de alcance y capacidades. | Codex |
| 1.0 | 2026-08-05 | Responsables nominados, flujo vertical 12-paso definido, SLA/volúmenes validados de Acta. Aprobado. | Antonio José Escrucería Uribe |
