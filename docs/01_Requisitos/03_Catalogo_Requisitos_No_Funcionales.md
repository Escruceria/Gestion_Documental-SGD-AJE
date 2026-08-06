# Catálogo de requisitos no funcionales

| Campo | Valor |
|---|---|
| Código | GDP-REQ-003 |
| Versión | 1.0 |
| Estado | Aprobado (OPV parcialmente validado desde Acta) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | Antonio José Escrucería Uribe (Seguridad), Álvaro Patiño Cruz (Datos), David Ernesto Antequera Martínez (QA), Neffer Anais Martínez (Operaciones) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

La frase **OPV** significa `Objetivo provisional sujeto a validación con cliente piloto`; no constituye SLA contractual hasta validación formal.

**Validaciones Acta v1.0 (2026-08-05):**
- Disponibilidad: 99,5% mensual (confirmado).
- RPO: 4 horas (confirmado).
- RTO: 8 horas (confirmado).
- Volúmenes: 20-50 usuarios simultáneos (meses 1-12), 1.000 docs/día, 500 radicaciones/día, 30% crecimiento anual (confirmado).
- Mantenimiento programado: Domingos/festivos 12:00-05:00 Colombia (confirmado).

| ID | Categoría y requisito | Métrica/unidad y umbral | Estado | Próxima revisión |
|---|---|---|---|---|
| RNF-SEG-001 | Seguridad: denegar toda acción sin autenticación/autorización válidas | 100 % casos críticos; cero hallazgo crítico/alto abierto | Aprobado POC-001 | 2026-09-30 (Antonio) |
| RNF-SEG-002 | Cifrar tránsito y datos persistidos según clasificación | 100 % endpoints TLS 1.2+, AES-256; algoritmos/política documentada | Aprobado Acta | 2026-12-15 (Antonio) |
| RNF-PRI-001 | Minimizar y proteger datos personales | 100 % campos personales inventariados con finalidad/retención | Aprobado DPIA | 2026-09-30 (Álvaro) |
| RNF-MTN-001 | Aislar tenants en API, DB, caché, objetos, bus y exportaciones | 100 % pruebas cruzadas negativas; cero fuga | Aprobado POC-001 | 2026-09-30 (Antonio) |
| RNF-REN-001 | Mantener latencia interactiva aceptable | p95 < 500ms, p99 < 1s por endpoint (20-50 usuarios) | OPV, validar POC-002 | 2026-11-30 (Antonio) |
| RNF-DIS-001 | Ofrecer disponibilidad acordada por modalidad | 99,5% mensual (confirmado Acta v1.0) | Aprobado Acta v1.0 | 2026-12-15 (Neffer) |
| RNF-RES-001 | Tolerar entrega duplicada y fallos transitorios | 100 % consumidores idempotentes; cero efecto duplicado crítico | Aprobado POC-002 | 2026-11-30 (Antonio) |
| RNF-ACC-001 | Interfaz operable con tecnologías de apoyo | WCAG 2.1 AA; cero defecto bloqueante | OPV, validar UAT | 2028-10-15 (David) |
| RNF-MAN-001 | Mantener módulos y contratos independientes | 100 % límites críticos cubiertos lint/test; ADR vigentes | Aprobado Arquitectura | 2026-12-15 (Antonio) |
| RNF-OBS-001 | Correlacionar solicitudes, eventos y trabajos | 100 % flujos críticos correlation-id; logs sin secretos | Aprobado OpenTelemetry | 2026-11-30 (Neffer) |
| RNF-TRA-001 | Trazar requisito a aceptación y prueba | 100 % RF/RNF sin huérfanos antes aprobación | Aprobado Matriz | 2026-12-15 (David) |
| RNF-INT-001 | Interoperar mediante contratos versionados | 100 % endpoints/eventos OpenAPI/AsyncAPI versionados | Aprobado Contratos | 2026-11-30 (Antonio) |
| RNF-ING-001 | Detectar alteración de archivos/versiones | 100 % versiones hash SHA-256 verificable | Aprobado Integridad | 2026-11-30 (Antonio) |
| RNF-BKP-001 | Producir respaldos restaurables | 100 % simulacros exitosos; frecuencia cada 4h (RPO Acta) | Aprobado Acta v1.0 | 2026-12-15 (Neffer) |
| RNF-REC-001 | Recuperar dentro de objetivos acordados | RPO: 4h, RTO: 8h (confirmado Acta v1.0) | Aprobado Acta v1.0 | 2026-12-15 (Neffer) |
| RNF-CAP-001 | Escalar carga y almacenamiento esperados | 20-50 usuarios, 1000 docs/día, 500 radicaciones/día, 30% crec. | Aprobado Acta v1.0 | 2026-11-30 (Antonio+Neffer) |
| RNF-POR-001 | Operar en AWS y modalidad privada mediante puertos | 100 % contratos portables AWS/MinIO, RabbitMQ compatibles | Aprobado POC-002 | 2026-11-30 (Antonio) |
| RNF-COM-001 | Soportar navegadores/plataformas aprobados | **OPV:** Matriz Chrome/Firefox/Safari/Edge últimas 2 versiones | OPV, **validar QA** | **2026-09-30 (David)** |
| RNF-AUD-001 | Conservar evidencia resistente a alteración y acceso indebido | 100 % eventos críticos; cero modificación RLS controlada | Aprobado Auditoría | 2026-11-30 (Antonio) |
| RNF-CAL-001 | Cumplir puertas automáticas de calidad | **OPV:** Cobertura >80%, defectos críticos 0 antes producción | OPV, **validar QA** | **2026-12-15 (David)** |
| RNF-DES-001 | Desplegar artefactos reproducibles y reversibles | 100 % release lockfile npm, digests, SBOM, rollback probado | Aprobado DevOps | 2026-12-15 (Neffer) |

## Matriz de Trazabilidad RF → RNF (Cobertura)

**Validación:** Cada RF debe tener al menos un RNF que lo soporte. Cada RNF debe referenciar RF(s) que lo utilizan.

| RF Dominio | RF(s) Incluidas | RNF(s) Aplicables | Cobertura | Estado |
|---|---|---|---|---|
| Identidad (IAM) | RF-IAM-001..008 | RNF-SEG-001, RNF-MTN-001, RNF-MAN-001 | ✅ Completa | Validado |
| Clasificación (DOC) | RF-DOC-001..003 | RNF-MAN-001, RNF-INT-001 | ✅ Completa | Validado |
| Documentos (DOC) | RF-DOC-004..010 | RNF-REN-001, RNF-ING-001, RNF-CAP-001, RNF-OBS-001 | ✅ Completa | Validado |
| Expedientes (DOC) | RF-DOC-011..014 | RNF-MAN-001, RNF-CAP-001 | ✅ Completa | Validado |
| Búsqueda (DOC) | RF-DOC-015..016 | RNF-REN-001, RNF-MTN-001, RNF-ACC-001 | ✅ Completa | Validado |
| Correspondencia (COR) | RF-COR-001..006 | RNF-RES-001, RNF-REN-001, RNF-CAP-001, RNF-OBS-001 | ✅ Completa | Validado |
| Auditoría (AUD) | RF-AUD-001..002 | RNF-AUD-001, RNF-OBS-001, RNF-TRA-001 | ✅ Completa | Validado |
| Privacidad (AUD) | RF-AUD-003..005 | RNF-PRI-001, RNF-AUD-001, RNF-TRA-001 | ✅ Completa | Validado |
| Notificaciones (NIN) | RF-NIN-001..002 | RNF-RES-001, RNF-OBS-001 | ✅ Completa | Validado |
| Operación (OPS) | RF-OPS-001..004 | RNF-CAP-001, RNF-BKP-001, RNF-REC-001, RNF-DES-001 | ✅ Completa | Validado |

**Resultado:** ✅ 100% cobertura RF → RNF. Cada RF tiene RNF(s) definida(s). No hay RF huérfana.

---

## Flujo vertical: Cobertura RNF

Los 12 RF del flujo vertical están cubiertos por RNF:

| Paso | RF | RNF(s) aplicables | Métrica |
|---|---|---|---|
| 1 | RF-IAM-001 | RNF-SEG-001, RNF-MTN-001 | 100% auth + tenant aislado |
| 2 | RF-IAM-003 | RNF-SEG-001 | 100% invitación válida |
| 3 | RF-IAM-004 | RNF-SEG-001, RNF-OBS-001 | 100% token + audit |
| 4 | RF-IAM-008 | RNF-MTN-001 | 100% cambio tenant sin fuga |
| 5 | RF-DOC-001 | RNF-MAN-001 | 100% serie única |
| 6 | RF-DOC-004 | RNF-REN-001, RNF-CAP-001 | <500ms, soporta 20-50 usuarios |
| 7 | RF-DOC-005 | RNF-REN-001, RNF-CAP-001 | <500ms, 1GB max |
| 8 | RF-DOC-006 | RNF-RES-001, RNF-OBS-001 | Idempotencia, audit |
| 9 | RF-DOC-007 | RNF-ING-001, RNF-OBS-001 | Hash verificable, audit |
| 10 | RF-DOC-009 | RNF-ING-001, RNF-AUD-001 | Hash + audit, inmutable |
| 11 | RF-COR-001 | RNF-RES-001, RNF-REN-001, RNF-OBS-001 | Idempotencia, <500ms, audit |
| 12 | RF-AUD-001 | RNF-AUD-001, RNF-OBS-001, RNF-TRA-001 | 100% evento correlacionado |

---

## Fuentes, supuestos, decisiones y pendientes

**Fuentes:** OBJ-003..012, perfil de capacidad (Acta v1.0), ADR-011..021, riesgos RSK-*, matriz de trazabilidad.

**Supuestos validados:** Cliente piloto Venus confirmado; volúmenes, SLA, RPO/RTO medidos y aprobados (Acta v1.0).

**Decisiones:** 
- Disponibilidad (99,5%), RPO/RTO (4h/8h), volúmenes del Acta son aprobados y base de negociación.
- Latencia p95/p99 son OPV calibrados en k6 durante POC-002 (evidencia medible).
- WCAG 2.1 AA validar en UAT (David, 2028-10-15).
- Navegadores y cobertura QA validar pre-producción (David, 2026-12-15).

**Pendientes marcados:** 
- **RNF-COM-001:** Matriz navegadores — David, 2026-09-30 (OPV).
- **RNF-CAL-001:** Umbrales cobertura/defectos — David, 2026-12-15 (OPV).
- **RNF-ACC-001:** WCAG validación UAT — David, 2028-10-15 (OPV).
- Retención de datos por serie — Jurídico/Archivo, antes Fase 4.
- Validación jurídica especializada (cifrado, auditabilidad) — Jurídico, antes producción.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | 21 RNF medibles con umbrales controlados. | Codex |
| 1.0 | 2026-08-05 | Responsables reales, disponibilidad 99,5% / RPO 4h / RTO 8h / volúmenes del Acta aprobados, OPV residuales identificados con hitos de validación. | Antonio José Escrucería Uribe |
