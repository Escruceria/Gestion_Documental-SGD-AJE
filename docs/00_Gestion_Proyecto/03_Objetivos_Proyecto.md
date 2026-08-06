# Objetivos del proyecto

| Campo | Valor |
|---|---|
| Código | GDP-OBJ-003 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), David Ernesto Antequera Martínez (Líder QA) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## 1. Objetivo general

Diseñar, construir y operar una plataforma de gestión documental multiempresa que permita a organizaciones colombianas administrar documentos físicos y electrónicos de manera centralizada, configurable, segura, trazable y compatible con sus obligaciones archivísticas, de privacidad y de conservación.

## 2. Objetivos específicos

| ID | Objetivo verificable | Indicador inicial | Meta/criterio | Horizonte | Responsable |
|---|---|---|---|---|---|
| OBJ-001 | Centralizar el registro y localización de documentos y expedientes del alcance MVP. | Porcentaje de registros MVP gestionados en la plataforma durante piloto. | Meta por acordar; línea base medida antes del piloto. | MVP/Piloto | Product Owner + Gestión documental |
| OBJ-002 | Controlar la radicación de entrada y salida con identificador único, fecha, anexos y trazabilidad. | Radicaciones aceptadas que cumplen campos y evidencia obligatoria. | 100 % en pruebas de aceptación; tolerancia operativa por definir. | MVP | Correspondencia |
| OBJ-003 | Garantizar aislamiento lógico entre organizaciones. | Casos de prueba negativos de acceso cruzado aprobados. | 100 % de casos críticos; cero hallazgos abiertos críticos/altos antes de producción. | MVP | Arquitectura + Seguridad |
| OBJ-004 | Aplicar acceso por mínimo privilegio mediante roles y atributos. | Permisos críticos cubiertos por pruebas y revisión. | 100 % de acciones críticas; revisión periódica definida. | MVP | Seguridad + Administrador de organización |
| OBJ-005 | Mantener historia de versiones e integridad verificable de archivos. | Versiones con hash y vínculo al archivo/autor/fecha. | 100 % de versiones persistidas. | MVP | Gestión documental |
| OBJ-006 | Facilitar recuperación de información autorizada. | Latencia de búsqueda y tasa de resultados válidos. | Umbrales se aprobarán en RNF tras perfil de carga (`SUP-008`). | MVP | Producto + Arquitectura |
| OBJ-007 | Registrar evidencia técnica auditable de eventos críticos y consentimientos. | Eventos/consentimientos con campos obligatorios e integridad verificada. | 100 % de eventos catalogados y consentimientos aplicables. | MVP | Seguridad + Privacidad |
| OBJ-008 | Atender solicitudes de titulares sin contradecir deberes de conservación. | Casos dentro de plazo y con decisión/base jurídica registrada. | 100 % de casos de prueba; SLA legal configurable. | MVP | Responsable de datos |
| OBJ-009 | Recuperar el servicio y los datos ante fallos conforme a objetivos acordados. | Pruebas de restore exitosas; RPO/RTO medidos. | 100 % de simulacros planificados; valores por aprobar. | MVP/Producción | Operaciones |
| OBJ-010 | Asegurar accesibilidad del canal web. | Auditoría WCAG y pruebas con teclado/lector. | WCAG 2.1 AA o versión aplicable, sin defectos bloqueantes. | MVP | Frontend + QA |
| OBJ-011 | Permitir evolución tecnológica sin reescritura prematura. | Dependencias externas detrás de contratos y ADR; acoplamiento revisado. | Controles de arquitectura aprobados para componentes críticos. | Continuo | Arquitecto |
| OBJ-012 | Establecer trazabilidad bidireccional de la línea base. | RF y RNF sin vínculos huérfanos a pruebas/objetivos. | 100 % antes de aprobar cada entrega. | Pre-desarrollo/continuo | Analista + QA |

## 3. Resultados de negocio esperados

- Reducir dispersión, duplicidad y pérdida de contexto documental.
- Disminuir el tiempo de localización respecto de la línea base de cada piloto.
- Mejorar control de responsables, vencimientos, préstamos, transferencias y disposición por fases.
- Producir evidencia reproducible para auditorías, incidentes y solicitudes de titulares.
- Habilitar comercialización SaaS y una ruta controlada hacia instalaciones privadas.

No se fijan porcentajes de ahorro o productividad sin una medición AS-IS. Las metas comerciales y operativas se incorporarán tras el piloto.

## 4. Objetivos de calidad pendientes de cuantificación

Los siguientes valores deberán convertirse en RNF medibles después de conocer volúmenes y planes: disponibilidad, concurrencia, latencia por percentil, tamaño/volumen de archivo, tasa de error, RPO, RTO, retención de logs, expiración de sesión, bloqueo, capacidad de cola y tiempo de reportes.

## 5. Trazabilidad inicial

| Objetivo | Capacidades relacionadas | Riesgos principales |
|---|---|---|
| OBJ-001, OBJ-002 | Radicación, documentos, expedientes | RSK-003, RSK-013 |
| OBJ-003, OBJ-004 | Multitenancy, IAM, permisos | RSK-001, RSK-008 |
| OBJ-005, OBJ-007 | Versiones, auditoría, consentimientos | RSK-005, RSK-011 |
| OBJ-006 | Búsqueda y metadatos | RSK-007, RSK-014 |
| OBJ-008 | Privacidad y retención | RSK-002, RSK-004 |
| OBJ-009 | Backup, continuidad y operación | RSK-010, RSK-015 |
| OBJ-010 | Frontend y portal | RSK-016 |
| OBJ-011, OBJ-012 | Arquitectura y gobierno documental | RSK-006, RSK-012 |

## 6. No objetivos del MVP

No son objetivos del MVP reemplazar todos los sistemas institucionales, automatizar íntegramente disposición/preservación avanzada, crear proveedores de firma/pago/facturación, ofrecer aplicaciones móviles ni garantizar integraciones gubernamentales no verificadas.

## 7. Cronograma de hitos aprobado

| ID | Hito | Fecha objetivo | Responsable | Criterio de éxito |
|---|---|---|---|---|
| HT-001 | Línea base documental completada | 2026-08-15 | Antonio José Escrucería Uribe | Inventario validado, gobierno activo, riesgos documentados. |
| HT-002 | AS-IS Venus validado | 2026-09-15 | Álvaro Patiño Cruz | Procesos documentados, volúmenes confirmados, restricciones legales mapeadas. |
| HT-003 | POC-001: Multitenancy + RLS ejecutada | 2026-09-30 | Antonio José Escrucería Uribe | Aislamiento probado, Keycloak integrado, contexto tenant propagado. |
| HT-004 | POC-002: Pipeline documental ejecutada | 2026-11-30 | Antonio José Escrucería Uribe | Cuarentena, antivirus, hash, integridad, outbox, idempotencia probados. |
| HT-005 | Gate técnico MVP cerrado | 2026-12-15 | Antonio José Escrucería Uribe | Requisitos priorizados, contratos OpenAPI, modelos de datos, plan de desarrollo. |
| HT-006 | Contrato formal Venus firmado | 2026-09-30 | Wilmar Betancur Valencia | Términos, SLA, alcance, responsabilidades, cronograma ejecutivo. |
| HT-007 | MVP en producción con piloto | 2028-10-31 | Neffer Anais Martínez | 13 capacidades, 100% pruebas de aceptación, cero hallazgos críticos abiertos. |
| HT-008 | Retrospectiva piloto y roadmap Fase 2 | 2028-12-31 | Álvaro Patiño Cruz | Lecciones, métrica de éxito, backlog Fase 2 priorizado. |

## 8. Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Objetivos iniciales y criterios de medición. | Codex |
| 1.0 | 2026-08-05 | Objetivos validados, hitos cronograma aprobados, responsables asignados, cronograma MVP → Producción. | Antonio José Escrucería Uribe |
