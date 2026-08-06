# Casos de prueba de seguridad

| Campo | Valor |
|---|---|
| Código | GDP-TST-004 |
| Versión | 0.1 |
| Estado | Diseñado; no ejecutado |
| Fecha | 2026-07-16 |
| Propietario | `[RESPONSABLE_SEGURIDAD]` |
| Revisores | `[LIDER_QA]`, `[ARQUITECTO]`, `[LIDER_OPERACIONES]` |
| Aprobador | `[COMITE_SEGURIDAD]` |

| Suite | Casos/amenazas | Técnica | Aceptación |
|---|---|---|---|
| Identidad | CP-SEG-001..004; THR-001/002 | tokens alterados/expirados/audience, MFA, elevación | fail closed; sin detalle sensible; evidencia |
| Tenant/autorización | CP-SEG-002/008..010, CP-MTN-001..003; THR-003/009 | IDOR, cambio headers/IDs, RLS y caché | cero lectura/escritura cruzada |
| API | CP-FUN-012; THR-004/006/007 | ZAP, payload extra, inyección, límites | RFC 9457; sin SQL/stack/PII |
| Carga | CP-SEG-005..007; THR-012..015 | URL robada/expirada, key, multipart, EICAR seguro | cuarentena; malware nunca disponible |
| Mensajería | CP-CON-006/INT-002; THR-016..020 | falsificación, duplicado, poison, DLQ, nodo | auth, idempotencia y mensajes confirmados preservados |
| Telemetría | THR-023 | tokens/PII/URL canario | cero secreto/contenido en log/trace |
| Supply chain | THR-026/027 | secret scan, SBOM, digest, dependencia vulnerable | cero secreto y crítico abierto |
| Backup/export | CP-REC-001/002, CP-MTN-003; THR-025/029 | permisos, cifrado, mezcla tenant, expiración | aislado, cifrado y auditable |

Las pruebas intrusivas se ejecutan solo en ambientes autorizados. El fixture antimalware no contiene malware activo y sigue procedimiento de seguridad. Hallazgo crítico bloquea release y activa incidente cuando corresponda.

## Fuentes, supuestos, decisiones y pendientes

Fuentes: STRIDE, OWASP, ADR-019 y casos maestros. Supuesto: ZAP/escáneres estarán disponibles en CI/preview. Decisiones: pruebas dirigidas complementan DAST. Pendientes: baseline OWASP concreto, alcance pentest y responsables.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-07-16 | Suites por amenaza y control. | Codex |
