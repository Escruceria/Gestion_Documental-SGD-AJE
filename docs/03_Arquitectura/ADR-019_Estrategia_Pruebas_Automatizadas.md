# ADR-019 - Estrategia de pruebas automatizadas

| Campo | Valor |
|---|---|
| ID | ADR-019 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-011, ADR-012, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017, ADR-018 |

## Contexto

La arquitectura distribuida incorpora contratos REST y asíncronos, bases PostgreSQL exclusivas por servicio, RLS multitenant, mensajería al menos una vez, almacenamiento S3/MinIO, identidad Keycloak y una SPA React. Las pruebas deben detectar fallos de dominio, integración, contrato, aislamiento, seguridad y capacidad antes de producción.

La simulación total produciría confianza falsa en PostgreSQL, migraciones, RLS y adaptadores. A la vez, ejecutar todo como E2E haría la retroalimentación lenta e inestable. Se requiere una estrategia por niveles con infraestructura real efímera donde el comportamiento tecnológico sea relevante.

## Decisión tecnológica

| Necesidad | Tecnología aprobada |
|---|---|
| Runner TypeScript común | Vitest |
| Utilidades NestJS | `@nestjs/testing` |
| Pruebas HTTP backend | Supertest |
| Integración con infraestructura | Testcontainers for Node.js |
| PostgreSQL real | `@testcontainers/postgresql` |
| Simulación HTTP controlada | MSW |
| Contratos REST | OpenAPI 3.1 |
| Contratos asíncronos | AsyncAPI + JSON Schema |
| Rendimiento y capacidad | k6 |
| E2E de navegador | Playwright |
| Seguridad dinámica | OWASP ZAP |

Vitest será el runner común para backend y frontend. React Testing Library y axe-core/jest-axe permanecen vigentes conforme a ADR-018.

## Niveles de prueba

| Nivel | Alcance | Dependencias permitidas |
|---|---|---|
| Unitario | Value Objects, dominio, casos de uso, mapeos, validadores | Sin red, reloj/IDs controlados, puertos simulados |
| Componente NestJS | Módulo, DI, pipes, guards, filtros, interceptores | `@nestjs/testing`, dobles explícitos |
| Integración | Repositorios, migraciones, RLS, outbox, adaptadores | Contenedores reales y servicios efímeros |
| Contrato | REST, eventos, comandos y Problem Details | OpenAPI/AsyncAPI/JSON Schema versionados |
| E2E de servicio | API y persistencia completas de un macroservicio | Proceso real y dependencias controladas |
| E2E de sistema | Flujos entre macroservicios y frontend | Ambiente integrado representativo |
| Rendimiento | Carga, estrés, ráfaga, duración y recuperación | Ambiente aislado y perfil documentado |
| Seguridad dinámica | Superficie HTTP desplegada | Ambiente autorizado sin datos reales |

## Política de dobles e infraestructura real

1. Las pruebas unitarias sustituyen puertos externos, no lógica interna del sujeto probado.
2. PostgreSQL no se simula en pruebas de repositorio, migración, transacción, constraint o RLS.
3. Testcontainers proporciona PostgreSQL efímero con las migraciones reales de cada servicio.
4. MSW simula APIs externas o escenarios HTTP difíciles, pero no reemplaza la suite de integración contra dependencias reales.
5. Los adaptadores S3/MinIO se prueban contra ambos proveedores conforme a ADR-016 y POC-002.
6. EventBridge/SQS se prueba en un ambiente AWS autorizado además de pruebas locales/controladas.
7. Keycloak real se utiliza en POC, integración de identidad y E2E de autenticación; los tests unitarios usan un puerto de identidad simulado.
8. Los dobles deben respetar el contrato y no aceptar operaciones que el proveedor real rechazaría.

## PostgreSQL y migraciones

Cada macroservicio probará como mínimo:

- migración sobre base vacía;
- actualización desde la versión soportada anterior;
- constraints y tipos;
- claves e índices tenant-scoped;
- RLS deny-by-default y acceso cruzado negativo;
- `SET LOCAL` dentro de transacción con pooling;
- atomicidad de negocio + outbox;
- aislamiento de credenciales entre servicios;
- backfills reiniciables e idempotentes;
- estrategia expand-and-contract;
- concurrencia, unicidad y bloqueos relevantes;
- correspondencia entre esquema migrado y tipos Kysely.

No se modificará una migración ya aplicada para hacer pasar una prueba.

## Contratos REST

OpenAPI 3.1 será la fuente del contrato HTTP:

1. Cada servicio genera una especificación válida y reproducible.
2. CI compara el contrato con la línea base anterior.
3. Un cambio incompatible requiere versionamiento y aprobación explícita.
4. Se validan cuerpos, estados, headers y `application/problem+json`.
5. El frontend regenera sus tipos; los generados no se editan manualmente.
6. Ejemplos de contrato no contienen información personal ni secretos.
7. Las pruebas verifican rechazo de propiedades desconocidas conforme a ADR-017.

## Contratos asíncronos

AsyncAPI y JSON Schema documentarán eventos y comandos. Cada mensaje define nombre, versión, productor, consumidores, metadatos y payload.

Reglas de compatibilidad:

- consumidores toleran campos adicionales;
- campos existentes no cambian de significado;
- un campo requerido no se elimina ni se vuelve incompatible sin nueva versión;
- productores y consumidores prueban el esquema que publican/aceptan;
- duplicación, reordenamiento permitido y reintento forman parte de los casos;
- `eventId`, `correlationId`, `tenantId` y versión del contrato se verifican;
- payloads sensibles o referencias documentales respetan minimización.

## Rendimiento con k6

k6 ejecutará perfiles diferenciados:

- smoke para verificar el escenario;
- baseline y carga esperada;
- stress para hallar degradación;
- spike para ráfagas;
- soak para fugas y acumulación;
- recuperación después de saturación o dependencia fallida.

Cada script incluye checks funcionales y thresholds de aprobación derivados del perfil de capacidad y los SLO. Un threshold incumplido falla la ejecución. No se fijarán objetivos arbitrarios dentro de este ADR.

Escenarios mínimos:

- autenticación y cambio de tenant;
- consultas y paginación documental;
- radicación/incorporación;
- carga multipart de archivos;
- procesamiento asíncrono y edad de cola;
- ráfaga de trabajos y recuperación;
- búsqueda;
- descarga autorizada;
- mezcla concurrente de tenants sin fuga.

## E2E con Playwright

Playwright validará en navegadores soportados:

- inicio/cierre de sesión y expiración;
- selección y cambio de organización;
- permisos y denegaciones;
- flujo vertical documental;
- carga, progreso, fallo y reintento;
- formularios y Problem Details;
- navegación por teclado en rutas críticas;
- limpieza de caché/estado al cambiar tenant;
- evidencia sin capturar tokens ni datos sensibles.

Las pruebas E2E usan usuarios y documentos sintéticos; no comparten cuentas productivas.

## Seguridad dinámica con OWASP ZAP

- Baseline scan sobre entornos de revisión autorizados.
- Active scan únicamente en ambientes aislados y con alcance aprobado.
- Autenticación y roles de prueba configurados sin secretos en el repositorio.
- Hallazgos se clasifican, reproducen y trazan; no se ignoran solo por ser automatizados.
- ZAP complementa threat modeling, revisión, SAST, dependencias y pruebas de autorización; no los reemplaza.
- Quedan prohibidos escaneos activos contra producción sin autorización operativa específica.

## Cobertura y calidad

- La cobertura es una señal, no el objetivo único.
- Código nuevo tendrá un umbral inicial mínimo de 80 % de líneas y branches, ajustable por evidencia.
- Dominio, autorización, aislamiento, retención, disposición e idempotencia buscarán 90 % o más y casos negativos explícitos.
- Código generado se excluye justificadamente.
- No se escriben pruebas triviales solo para elevar porcentaje.
- Flakiness se trata como defecto: una prueba no se reintenta indefinidamente para ocultarla.
- Mutation testing podrá incorporarse posteriormente para reglas críticas mediante decisión complementaria.

## Puertas de calidad

1. Formato, lint y compilación TypeScript.
2. Pruebas unitarias y de componentes.
3. Validación/diff de OpenAPI y AsyncAPI.
4. Integración con Testcontainers.
5. Build reproducible.
6. Análisis de seguridad estático/dependencias cuando se defina su herramienta.
7. E2E de servicio.
8. E2E integrado con Playwright.
9. OWASP ZAP según el ambiente y riesgo.
10. k6 según el tipo de cambio y puerta de liberación.

Una excepción requiere responsable, justificación, riesgo, vencimiento y plan de corrección.

## Datos y evidencia

- Solo datos sintéticos o anonimizados irreversiblemente.
- Factories/builders producen escenarios deterministas.
- Reloj, UUID y aleatoriedad se controlan donde afecten repetibilidad.
- Logs, screenshots, videos y trazas de prueba se sanitizan y retienen por tiempo definido.
- Cada ejecución relevante conserva versión, ambiente, resultado y artefactos suficientes para auditoría.

## Alternativas no seleccionadas

- Jest como runner backend: integración madura con NestJS, pero se prefirió Vitest para unificar el workspace TypeScript.
- SQLite/in-memory como sustituto de PostgreSQL: no reproduce RLS, tipos, locking ni SQL aprobado.
- Solo pruebas E2E: retroalimentación lenta y diagnóstico difícil.
- Solo mocks: no valida integraciones ni infraestructura real.
- Pruebas manuales como puerta principal: no son repetibles ni suficientes para regresión.
- JMeter: válido, pero k6 se alinea mejor con código, thresholds y automatización del stack.

## Criterios de aceptación

1. Un módulo NestJS ejecuta unitarias e integración bajo Vitest.
2. Supertest valida HTTP real, ValidationPipe y Problem Details.
3. Testcontainers levanta PostgreSQL, aplica migraciones y ejecuta RLS/outbox.
4. Un cambio incompatible OpenAPI/AsyncAPI falla CI.
5. POC-001 demuestra cero fuga entre tenants bajo concurrencia.
6. POC-002 demuestra idempotencia, reintentos, DLQ y almacenamiento real.
7. k6 aplica thresholds vinculados al perfil de capacidad.
8. Playwright ejecuta un flujo vertical con Keycloak y cambio de tenant.
9. ZAP baseline no deja hallazgos críticos/altos sin tratamiento aceptado.
10. Evidencias no contienen secretos, tokens ni información personal real.

## Revisión

Después de POC-001/002, tras el primer flujo vertical, antes del piloto y ante cambios mayores en Vitest, NestJS, Testcontainers, contratos o infraestructura.
