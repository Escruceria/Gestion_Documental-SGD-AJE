# Backlog del Producto (MVP y Futuro)

| Campo | Valor |
|---|---|
| Código | GDP-REQ-013 |
| Versión | 1.0 |
| Estado | Aprobado |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), David Ernesto Antequera Martínez (QA) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## Propósito

Priorizar y desglosar todas las capacidades del producto en historias de usuario, épicas y tareas, separando MVP (obligatorio antes de producción), Fase 2 (3-6 meses post-MVP) y Futuro (especulativo).

---

## MVP — 13 Capacidades prioritarias

### Épica 1: Organización y Multitenant (2 semanas)

**Descripción:** Crear y configurar tenants independientes aislados por tenant_id.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-001 | Como admin de plataforma, crear organización con datos básicos | Org creada, único tenant_id, RLS activo | 8 | S1 |
| US-002 | Como admin de org, crear sedes/dependencias en árbol jerárquico | Estructura visualizada, CRUD operativo | 5 | S1 |
| US-003 | Como admin de org, ver configuración tenant (cuota, módulos activos) | Dashboard con configuración vigente | 3 | S1 |

**RNF:** Aislamiento 100%, tenant_id en toda tabla.
**Dependencias:** Keycloak.

---

### Épica 2: Identidad y Acceso (3 semanas)

**Descripción:** Autenticación, invitaciones, MFA, RBAC.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-004 | Como admin de org, invitar usuarios con rol predefinido | Invitación email enviada, un solo uso | 5 | S2 |
| US-005 | Como usuario invitado, aceptar invitación y vincular Keycloak | Membresía activa, token JWT valida | 8 | S2 |
| US-006 | Como admin de org, gestionar membresías (activar, suspender, revocar) | Cambios trazados, usuario acceso cambia inmediatamente | 5 | S2 |
| US-007 | Como administrador, requerir MFA para roles privilegiados | MFA obligatorio, desafío OTP/Yubikey | 8 | S3 |
| US-008 | Como usuario multitenant, cambiar entre tenants sin contaminación | Caché limpiado, contexto renovado, sin fuga de datos | 8 | S3 |
| US-009 | Como admin de org, crear y asignar roles personalizados | Permisos granulares aplicados, auditable | 8 | S3 |

**RNF:** Keycloak integrado, MFA obligatorio para privilegiados, cero acceso cruzado.
**Dependencias:** identity-access-service, Keycloak.

---

### Épica 3: Clasificación Documental (2 semanas)

**Descripción:** Series, subseries, tipos documentales, metadatos.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-010 | Como gestor documental, crear serie con código/nombre/vigencia | Serie única por tenant, versionada | 5 | S2 |
| US-011 | Como gestor documental, crear subserie/tipos con herencia | Jerarquía válida, metadatos heredados | 5 | S2 |
| US-012 | Como usuario, ver catálogo de tipos disponibles al crear documento | Dropdown filtrado, metadatos requeridos visibles | 3 | S2 |

**RNF:** Versionado, único por tenant.
**Dependencias:** document-core-service.

---

### Épica 4: Documentos y Versiones (4 semanas)

**Descripción:** Crear, versionar, consultar, integridad.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-013 | Como usuario, crear documento lógico sin archivo aún | Documento en DRAFT, editable, no publicitado | 5 | S3 |
| US-014 | Como usuario, solicitar carga multipart con sesión temporal | URL corta, limitada a 24h, no reutilizable | 8 | S3 |
| US-015 | Como usuario, confirmar carga multipart y generar versión | Archivo en cuarentena, antivirus iniciado | 8 | S4 |
| US-016 | Como sistema, procesar archivo en cuarentena (antivirus, hash) | Resultado: CLEAN/REJECTED, evento auditable | 13 | S4 |
| US-017 | Como usuario, consultar documento y su historia de versiones | Versiones inmutables, hash verificable, autor/fecha | 5 | S4 |
| US-018 | Como usuario, rechazar archivo malicioso sin exponerlo | Documento REJECTED, no URL, alerta admin | 5 | S4 |

**RNF:** Versiones inmutables, hash verificable, cuarentena antes de disponibilidad.
**Dependencias:** document-core-service, document-processing-worker, S3/MinIO, antivirus.

---

### Épica 5: Expedientes (2 semanas)

**Descripción:** Crear, incorporar documentos, cerrar con índice.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-019 | Como gestor, crear expediente con clasificación y asunto | Expediente abierto, índice vacío, versión inicial | 5 | S5 |
| US-020 | Como gestor, incorporar documento a expediente en orden | Vínculo único, secuencia verificable | 5 | S5 |
| US-021 | Como usuario, consultar índice expediente con documentos autorizados | Lista ordenada, sin documentos no autorizados | 5 | S5 |
| US-022 | Como gestor, cerrar expediente verificando integridad | Índice hasheado, cierre irreversible | 5 | S5 |

**RNF:** Orden verificable, cierre irreversible.
**Dependencias:** document-core-service.

---

### Épica 6: Correspondencia (Radicación) (3 semanas)

**Descripción:** Registrar entrada/salida, consecutivos, comprobantes.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-023 | Como radicador, radicar comunicación de entrada con documento | Consecutivo único, comprobante generado, email enviado | 8 | S4 |
| US-024 | Como radicador, radicar comunicación de salida con aprobación | Salida numerada, disponible para distribución | 8 | S4 |
| US-025 | Como sistema, asignar consecutivo sin hueco ni duplicado | Número único, secuencia garantizada, thread-safe | 8 | S5 |
| US-026 | Como radicador, distribuir radicación a responsables | Tareas creadas, notificadas, trazadas | 5 | S5 |
| US-027 | Como remitente, consultar estado de mi radicación de entrada | Estado visible sin datos internos innecesarios | 5 | S5 |
| US-028 | Como sistema, generar comprobante de radicación verificable | PDF/QR con datos esenciales, no información sensible | 5 | S5 |

**RNF:** Consecutivo único, comprobante minimizado, cero datos sensibles.
**Dependencias:** correspondence-workflow-service, notification-integration-service.

---

### Épica 7: Búsqueda y Consulta (2 semanas)

**Descripción:** Buscar documentos, filtrar, respetar permisos.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-029 | Como usuario, buscar documentos por título, metadata, términos | Resultados autorizados, paginados, p95 <500ms | 8 | S6 |
| US-030 | Como usuario, filtrar por serie, tipo, fecha, estado | Filtros acumulativos, UI intuitiva | 5 | S6 |
| US-031 | Como usuario, consultar documento sin revelar datos no autorizados | Título sí, contenido si permiso, sin enlace si prohibido | 5 | S6 |

**RNF:** Latencia p95 <500ms, 404 sin enumerar para no autorizados.
**Dependencias:** document-core-service, PostgreSQL FTS.

---

### Épica 8: Auditoría y Compliance (3 semanas)

**Descripción:** Registrar eventos, consultar logs, consentimientos.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-032 | Como sistema, registrar todo acceso y cambio de datos | Evento con actor, acción, recurso, fecha, resultado | 8 | S6 |
| US-033 | Como auditor, consultar logs con filtros (usuario, fecha, acción) | Logs sin secretos, minimizados, correlacionados | 8 | S6 |
| US-034 | Como responsable de datos, registrar consentimiento versionado | Consentimiento por finalidad, sin presión, auditable | 5 | S7 |
| US-035 | Como responsable de datos, recibir y procesar solicitud de titular | Solicitud trazable, decisión registrada, comunicación documentada | 8 | S7 |

**RNF:** Auditoría no modificable, eventos correlacionados, cero secretos.
**Dependencias:** audit-compliance-service, RLS.

---

### Épica 9: Notificaciones (1 semana)

**Descripción:** Enviar emails transaccionales, reintentos.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-036 | Como sistema, enviar email de radicación recibida/enviada | Email entregado, plantilla correcta, sin secretos | 5 | S6 |
| US-037 | Como sistema, reintentar email fallido con backoff y DLQ | Máximo 5 reintentos, terminación observable | 5 | S7 |

**RNF:** Idempotencia, reintentos exponenciales.
**Dependencias:** notification-integration-service, SMTP.

---

### Épica 10: Reportes Operativos (2 semanas)

**Descripción:** Generar reportes de radicación, documentos, expedientes.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-038 | Como gestor, generar reporte de radicaciones por periodo | Datos agregados, CSV/PDF, sin datos personales sensibles | 5 | S8 |
| US-039 | Como auditor, generar reporte de accesos por usuario | Trazabilidad completa, exportable, tenant-scoped | 5 | S8 |
| US-040 | Como admin, monitorear salud del sistema (uptime, errores) | Dashboard con SLI, alertas configurables | 5 | S8 |

**RNF:** Exportación minimizada, tenant-scoped, asíncrona si >10k registros.
**Dependencias:** Reportes en todos los servicios.

---

### Épica 11: Respaldo y Recuperación (2 semanas)

**Descripción:** Backup automático, restore probado, RPO/RTO.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-041 | Como operador, ejecutar backup de datos según política | Backup cifrado, manifiesto generado, RPO 4h | 8 | S7 |
| US-042 | Como operador, restaurar desde backup aislado y verificar integridad | Restore completado, datos consistentes, RPO/RTO medido | 8 | S8 |
| US-043 | Como operador, automatizar backups con reintentos y alertas | Backups diarios/horarios, DLQ si falla | 5 | S8 |

**RNF:** RPO 4h, RTO 8h, simulacros mensuales.
**Dependencias:** PostgreSQL, S3/MinIO.

---

### Épica 12: Seguridad y Privacidad (Transversal)

**Descripción:** Cifrado, secretos, privacidad, acceso JIT.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-044 | Como operador, gestionar secretos (API keys, DB password) en bóveda | Secretos rotados, auditable, nunca en logs | 8 | S1-S8 |
| US-045 | Como administrador, habilitar acceso JIT para soporte | Acceso temporal, aprobación, revocación automática | 8 | S7 |
| US-046 | Como CISO, ejecutar test de seguridad automático (OWASP ZAP) | Cero crítico/alto abierto antes de producción | 8 | S8-Gate |

**RNF:** TLS 1.2+, AES-256, MFA, RLS obligatorio.
**Dependencias:** KMS, Vault, SIEM.

---

### Épica 13: Integración y Despliegue (Transversal)

**Descripción:** CI/CD, reproducibilidad, lockfile, SBOM.

| ID | User Story | Criterios de aceptación | Puntos | Sprint |
|---|---|---|---|---|
| US-047 | Como dev, desplegar stack con Docker/Kubernetes reproducible | Lockfile npm, digests contenedor, SBOM generado | 13 | S1-S8 |
| US-048 | Como operador, ejecutar rollback sin intervención manual | Reversión automatizada, sin datos corruptos | 8 | S8 |
| US-049 | Como dev, validar contratos OpenAPI entre servicios | Contract tests pasan, versionado de APIs | 8 | S6-S8 |

**RNF:** Zero-downtime deploy, SBOM completo.
**Dependencias:** GitHub Actions, Terraform, Helm.

---

## Resumen Capacidades MVP

- **Épicas:** 13
- **User Stories:** 49 (aprox 300 puntos)
- **Duración estimada:** 8-10 sprints de 2 semanas = 16-20 semanas
- **GO-LIVE:** Octubre 2028 (piloto Venus)
- **Criterio de aceptación:** 13 capacidades + 100% CA + UAT Venus + cero crítico abierto

---

## Fase 2 (Post-MVP, 3-6 meses)

### Mejoras funcionales

- **Firma electrónica básica** (no obligatoria aún, preparación para Fase 3).
- **OCR avanzado** (entrenamiento custom, extracción de datos).
- **Flujos de aprobación configurables** (workflow visual).
- **Préstamo/devolución expedientes físicos** (tracking híbrido).
- **Transferencias documentales** (movimiento entre series).
- **Portal ciudadano ampliado** (QR, SMS, consulta estado).
- **Inventario/FUID** (catalogación de acervos).

### Mejoras técnicas

- **ElasticSearch/OpenSearch** (si volúmenes justifican).
- **Replicación geográfica** (DR preparación).
- **Métricas avanzadas** (Prometheus, Grafana).
- **Caché distribuida** (Redis para sesión y búsqueda).

---

## Fase 3 (6-12 meses post-MVP)

- **Firma digital acreditada** (con certificadora).
- **Facturación y cobros** (commercial-billing-service).
- **Disposición final y eliminación integral** (TVD, destrucción).
- **Preservación digital** (migración formato, verificación periódica).
- **Integraciones SIID/SDTI** (si cliente requiere).

---

## Futuro (Especulativo)

- **Aplicaciones móviles nativas** (iOS, Android).
- **PWA offline** (trabajar sin conexión).
- **WhatsApp Business** (radicación/notificaciones por WhatsApp).
- **IA de clasificación/extracción** (ML automático).
- **Interoperabilidad multirregión** (gobiernos, privados internacionales).

---

## Criterios de priorización

1. **Bloqueante MVP:** Sin la capacidad, no hay piloto viable (categoría 1).
2. **Soporte cliente piloto:** Venus requiere la capacidad (categoría 2).
3. **Cumplimiento normativo:** Ley exige la capacidad (categoría 2).
4. **Valor de negocio:** Abre mercado o cliente nueva (categoría 3).
5. **Deuda técnica:** Reduce riesgo o mantiene arquitectura (categoría 3).

**MVP = Categoría 1 + 2.**
**Fase 2 = Categoría 2 + 3.**
**Fase 3+ = Categoría 3 + futura.**

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | 13 épicas MVP, 49 US, 300 puntos, cronograma 8-10 sprints. Fases 2-3 especulativas. Aprobado. | Álvaro Patiño Cruz |
