# ADR-011 - Arquitectura distribuida de macroservicios por dominio

| Campo | Valor |
|---|---|
| ID | ADR-011 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisores | `[COMITE_ARQUITECTURA]`, `[PRODUCT_OWNER]`, Seguridad, Operaciones |
| Sustituye | ADR-001 propuesto (monolito modular inicial) |
| Relacionados | ADR-003, ADR-004, ADR-005, ADR-007, ADR-008, ADR-010 |

## Contexto

El producto debe crecer en dominios, carga, clientes y modalidades de despliegue. El usuario ha descartado un único backend monolítico por riesgo de mantenimiento y escalamiento. Adoptar microservicios demasiado pequeños desde el inicio introduciría coordinación distribuida, operación y observabilidad desproporcionadas, pudiendo crear un monolito distribuido.

## Decisión

Construir una arquitectura distribuida orientada a dominios con seis macroservicios MVP:

1. `identity-access-service`.
2. `document-core-service`.
3. `correspondence-workflow-service`.
4. `document-processing-worker`.
5. `audit-compliance-service`.
6. `notification-integration-service`.

`commercial-billing-service` se incorpora en Fase 3. La aplicación web y el gateway son desplegables separados.

Cada macroservicio:

- Es propietario exclusivo de su modelo y persistencia.
- Expone API versionada y eventos versionados.
- Se despliega y escala independientemente.
- Aplica contexto tenant y autorización local.
- No realiza joins ni escrituras en bases de otros servicios.
- Publica hechos mediante transactional outbox.
- Consume mensajes `at-least-once` de forma idempotente.
- Propaga `tenant_id`, `correlation_id`, `causation_id` y actor.

## Alternativas consideradas

### A. Monolito modular

Menor costo inicial y transacciones simples, pero rechazado como dirección principal por preferencia explícita de despliegue y crecimiento independientes. Sus principios de modularidad siguen aplicando dentro de cada macroservicio.

### B. Microservicio por módulo/entidad

Rechazado. Separar documentos, versiones, metadatos, series y expedientes produciría llamadas excesivas, consistencia distribuida y alto costo de operación.

### C. Funciones serverless como núcleo

Rechazado para el núcleo por portabilidad privada, procesos largos y complejidad de observabilidad. Puede usarse como adaptador puntual si cumple los contratos.

### D. SOA con ESB central

Rechazado como núcleo porque centraliza lógica y puede crear cuello de botella/gobernanza pesada. El bus transportará eventos, no lógica de negocio.

## Consecuencias positivas

- Escalamiento de OCR, correspondencia, búsqueda/auditoría y notificaciones por separado.
- Equipos y ciclos de despliegue pueden evolucionar por dominio.
- Fallos de integraciones/OCR no necesitan detener el núcleo.
- Datos y permisos tienen propietarios explícitos.
- Facilita despliegues dedicados de dominios/tenants cuando se justifique.

## Consecuencias negativas

- Consistencia eventual y sagas en procesos entre dominios.
- Mayor costo de ambientes, CI/CD, seguridad, observabilidad y soporte.
- Contratos, versionado, idempotencia, DLQ y reconciliación son obligatorios desde el inicio.
- Pruebas end-to-end y diagnóstico requieren correlación distribuida.
- No existe transacción ACID global.

## Riesgos y controles

| Riesgo | Control vinculante |
|---|---|
| Monolito distribuido | Máximo dos saltos síncronos críticos; eventos para propagación; revisión de acoplamiento |
| Pérdida de eventos | Transactional outbox + publicador reintentable + reconciliación |
| Duplicación | Idempotency key, inbox/deduplicación y restricciones únicas |
| Datos divergentes | Propietario único, proyección derivada y versionada |
| Fuga tenant | Contexto firmado/validado, RLS, pruebas negativas por servicio y mensaje |
| Operación costosa | Seis servicios, no decenas; plataforma común y plantillas de despliegue |
| Contratos incompatibles | OpenAPI/AsyncAPI, schema registry y consumer-driven contracts |
| Cascada de fallos | Timeout, circuit breaker selectivo, bulkhead y degradación explícita |

## Reglas de evolución

Un macroservicio solo se divide si se cumple al menos uno:

- Perfil de carga exige escalamiento interno claramente distinto.
- Equipo autónomo necesita despliegue independiente sostenido.
- Requisito de seguridad/residencia exige aislamiento.
- Ciclo de cambios genera bloqueo demostrable.
- El subdominio tiene modelo, lenguaje e invariantes propios.

Compartir una instancia PostgreSQL es admisible inicialmente por costo, siempre que cada servicio tenga base/esquema, usuario y migraciones exclusivos. Acceso cruzado queda prohibido.

## Criterios de aceptación

1. Mapa de dominios y matriz de propiedad aprobados.
2. POC-001 demuestra aislamiento tenant en dos servicios.
3. POC-002 demuestra carga, cuarentena, outbox, procesamiento e idempotencia.
4. Fallo del bus no pierde una operación local confirmada.
5. Reenvío del mismo comando/evento no duplica efectos.
6. Trazas reconstruyen un flujo entre servicios con `correlation_id`.
7. Cada servicio compila, prueba y despliega independientemente.
8. No existe acceso de base cruzado.

## Reversibilidad

La decisión es parcialmente reversible: servicios muy acoplados podrían consolidarse como despliegue, conservando límites y contratos. La propiedad de datos y esquemas separados reduce el costo de consolidación/extracción.

## Revisión

Revisar después de ambas POC, del primer piloto y al alcanzar 70 % de CAP-MVP o incorporar un segundo equipo de desarrollo.
