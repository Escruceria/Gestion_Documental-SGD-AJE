# ADR-018 - Librerías y arquitectura base del frontend

| Campo | Valor |
|---|---|
| ID | ADR-018 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-012, ADR-013, ADR-016, ADR-017 |

## Contexto

El frontend React con TypeScript y Vite requiere convenciones comunes para navegación, acceso REST, formularios, validación, identidad, componentes, estado, internacionalización y pruebas. Sin una selección vinculante, cada flujo podría introducir librerías equivalentes, duplicar estado o acoplarse manualmente a contratos del backend.

La selección debe servir a una aplicación de gestión documental con formularios extensos, tablas, filtros, permisos, cargas asíncronas, accesibilidad y operación multitenant, sin convertir una biblioteca cliente en fuente de autorización.

## Decisión

| Necesidad | Biblioteca aprobada |
|---|---|
| Enrutamiento | React Router, Data Mode |
| Estado remoto/API | TanStack Query |
| Formularios | React Hook Form |
| Validación de formularios | Zod 4 |
| Integración formulario/Zod | `@hookform/resolvers` |
| Componentes visuales | Material UI |
| Estilos de MUI | Emotion |
| Iconos | `@mui/icons-material` |
| Cliente REST tipado | `openapi-fetch` |
| Tipos desde OpenAPI | `openapi-typescript` |
| Estado global cliente | Zustand, uso restringido |
| Internacionalización | `i18next` + `react-i18next` |
| Fechas | `date-fns` |
| Autenticación | `keycloak-js` |
| Pruebas unitarias | Vitest |
| Pruebas de componentes | React Testing Library |
| Simulación HTTP | MSW |
| Pruebas E2E | Playwright |
| Accesibilidad automatizada | `axe-core` / `jest-axe` |

Las versiones exactas se fijarán en el lockfile al crear el workspace. Se usará una versión estable compatible con React, TypeScript, Vite y Node.js 24 LTS; las actualizaciones mayores requieren revisión de compatibilidad.

## Límites de responsabilidad

### React Router

- Se usará Data Mode con `createBrowserRouter` y rutas declaradas fuera del árbol de renderizado.
- Cada área funcional tendrá límites de error y carga diferida cuando aporte valor.
- Los guards del navegador mejoran navegación, pero no sustituyen autorización del backend.
- El contexto de tenant se valida contra la sesión/membresías; cambiar una URL no otorga acceso.
- No se adopta React Router Framework Mode ni SSR en esta decisión.

### TanStack Query

Será la autoridad cliente para datos remotos:

- consultas, mutaciones, caché e invalidación;
- paginación y filtros serializables;
- estados de carga, error y reintento;
- cancelación y deduplicación de solicitudes;
- actualizaciones optimistas solo cuando exista reversión segura.

Las claves de consulta incluirán tenant y demás contexto que afecte el resultado. Al cambiar tenant o cerrar sesión se cancelarán solicitudes y limpiará la información que no pueda reutilizarse de forma segura.

### React Hook Form y Zod

- React Hook Form administra interacción, campos y envío.
- Zod 4 describe la validación de experiencia de usuario y produce tipos inferidos.
- `@hookform/resolvers` integra ambos.
- Los esquemas del navegador no reemplazan DTO, reglas de dominio ni constraints definidos por ADR-017.
- Las reglas dependientes del servidor se muestran a partir de Problem Details sin duplicarlas como supuestas verdades locales.
- Los mensajes visibles se resuelven mediante claves de internacionalización, no como contrato técnico del esquema.

### Material UI y Emotion

- Material UI aporta componentes base; Emotion será su motor de estilos aprobado.
- Un tema institucional centralizará colores, tipografía, espaciado, breakpoints, foco y variantes.
- Los componentes de aplicación envolverán MUI cuando exista una convención funcional recurrente.
- Se evitarán estilos globales ad hoc y valores visuales duplicados fuera de tokens.
- `@mui/icons-material` será la fuente inicial de iconos; los iconos tendrán etiqueta accesible o serán decorativos explícitamente.
- MUI X de pago no está aprobado por este ADR y requiere análisis funcional/licenciamiento separado.

### Contrato REST tipado

El backend publicará OpenAPI 3.1. `openapi-typescript` generará tipos y `openapi-fetch` ejecutará solicitudes tipadas.

```text
OpenAPI 3.1 del backend
        ↓
openapi-typescript
        ↓
tipos generados de solo lectura
        ↓
openapi-fetch
        ↓
adaptadores/hooks de TanStack Query
        ↓
features y componentes
```

Reglas:

1. Los archivos generados no se editan manualmente.
2. La generación debe ser reproducible y fallar ante contratos inválidos.
3. El frontend no importa DTO ni código interno de los macroservicios.
4. Los componentes no invocan `fetch` directamente; usan clientes/adaptadores de infraestructura y hooks de cada feature.
5. Los errores `application/problem+json` se normalizan en un tipo cliente común.
6. Una incompatibilidad de contrato se detecta en CI antes del despliegue.

### Zustand

Zustand se limita a estado cliente transversal que no pertenece al servidor, por ejemplo:

- preferencias visuales no sensibles;
- estado del panel lateral;
- selección temporal compartida;
- coordinación local de una carga multipart;
- estado efímero de flujos de interfaz.

No almacenará:

- access tokens, refresh tokens ni secretos;
- respuestas remotas duplicadas desde TanStack Query;
- permisos como fuente de autoridad;
- documentos completos o contenido sensible;
- estado que ya pertenece a la URL o a un formulario.

La persistencia en `localStorage` o equivalente será opt-in, versionada y prohibida para información sensible.

### Autenticación con Keycloak

- `keycloak-js` implementará Authorization Code con PKCE conforme a ADR-013.
- La librería se encapsulará en un adaptador/proveedor de autenticación propio.
- Los tokens no se persistirán en Zustand, Redux, `localStorage` ni `sessionStorage`; permanecerán en memoria salvo futura decisión de arquitectura.
- El cliente puede ocultar acciones por experiencia de usuario, pero cada operación será autorizada nuevamente por el backend.
- Cierre de sesión y cambio de tenant limpian cachés y estado sensible.

### Internacionalización y fechas

- `i18next` y `react-i18next` administrarán textos visibles mediante claves estables y namespaces por feature.
- El idioma inicial será español; la estructura permitirá nuevos idiomas sin incrustar textos en lógica.
- `date-fns` realizará cálculo y formato de fechas.
- Los instantes intercambiados con API usarán ISO 8601 con zona/UTC según el contrato; las fechas archivísticas sin hora se modelarán como fecha, no como instante.
- La zona horaria de negocio no se inferirá silenciosamente del navegador cuando afecte plazos o vencimientos.

## Estrategia de pruebas

| Nivel | Herramienta | Propósito |
|---|---|---|
| Unidad | Vitest | Funciones, esquemas, hooks aislables y lógica de presentación |
| Componente/integración UI | React Testing Library | Comportamiento observable, teclado, foco y formularios |
| API simulada | MSW | Contratos y escenarios HTTP sin acoplar pruebas a implementaciones de red |
| E2E | Playwright | Flujos críticos en navegador real con backend/identidad de prueba |
| Accesibilidad | `axe-core` / `jest-axe` | Detección automatizada complementaria a pruebas manuales |

Reglas:

1. Las pruebas consultan la UI por rol, nombre y texto accesible antes que por selectores de implementación.
2. MSW simula respuestas reales, incluidos Problem Details, 401, 403, 404, 409, 422, 429 y 5xx.
3. Playwright cubre autenticación, selección de tenant, radicación/incorporación, cargas, permisos y cierre de sesión.
4. Las pruebas automatizadas de accesibilidad no reemplazan revisión de teclado, lector de pantalla, contraste y zoom.
5. Los datos de prueba no contienen información personal real.

## Dependencias expresamente no aprobadas

- Axios: no se requiere junto a `openapi-fetch` salvo limitación demostrada.
- Redux/Redux Toolkit: no se requiere junto a TanStack Query y Zustand bajo el alcance actual.
- React Query duplicado en stores propios: prohibido.
- Formik/Yup: duplicarían React Hook Form/Zod.
- Styled Components o Tailwind como segundo sistema general de estilos: requieren ADR de sustitución o excepción.
- Uppy: permanece como candidato sujeto a POC de carga S3/MinIO; no forma parte de esta aprobación.
- MUI X comercial: sujeto a evaluación de licencia y necesidad.
- Bibliotecas adicionales de fechas, routing, i18n o peticiones HTTP: requieren justificación y revisión.

## Estructura orientativa

```text
src/
├── app/                 # providers, router, theme y bootstrap
├── features/            # casos funcionales por dominio
├── shared/
│   ├── api/             # cliente OpenAPI y Problem Details
│   ├── auth/            # adaptador keycloak-js
│   ├── i18n/
│   ├── ui/              # componentes compartidos sobre MUI
│   └── validation/
├── generated/           # tipos OpenAPI; no editar
└── test/                # setup Vitest, RTL y MSW
```

No se creará un directorio global de servicios o componentes sin propiedad clara. Las features conservarán sus consultas, formularios, esquemas y componentes específicos.

## Consecuencias

### Positivas

- Responsabilidades claras para datos remotos, formularios y estado local.
- Contratos REST tipados y derivados de OpenAPI.
- Integración consistente con Keycloak y Problem Details.
- Sistema visual coherente y base amplia de pruebas.
- Menor proliferación de soluciones equivalentes.

### Costos y riesgos

- El equipo debe aprender los patrones de Data Mode y TanStack Query.
- MUI y sus iconos afectan tamaño del bundle si se importan incorrectamente.
- Los tipos generados no validan por sí solos respuestas en runtime.
- Zod del frontend y DTO backend pueden duplicar parte de las restricciones de presentación.
- Zustand puede convertirse en almacén indiscriminado si no se revisan sus usos.
- `keycloak-js` y limpieza de caché requieren pruebas cuidadosas ante expiración y cambio de tenant.

## Criterios de aceptación

1. Una ruta protegida maneja carga, error y acceso denegado sin confiar en el guard cliente como autorización.
2. Las claves de TanStack Query aíslan tenants y la caché se limpia al cambiar sesión/contexto.
3. Un formulario usa React Hook Form + Zod y traduce Problem Details a errores generales/de campo.
4. CI regenera tipos desde OpenAPI y detecta drift o incompatibilidad.
5. Ningún componente de feature usa `fetch` o SDK Keycloak directamente.
6. Zustand no contiene tokens, permisos autoritativos ni copias de datos remotos.
7. El tema MUI soporta foco visible, contraste, zoom y navegación por teclado.
8. Vitest, React Testing Library, MSW y Playwright ejecutan un flujo vertical mínimo.
9. `axe-core` no reporta violaciones críticas en las pantallas del flujo vertical; se conserva evidencia de revisión manual.
10. El bundle se analiza y los imports/rutas permiten división de código razonable.

## Revisión

Después del primer flujo vertical, antes del piloto, al cambiar de versión mayor React/MUI/Router/Query o cuando una limitación demostrada exija sustituir o agregar una biblioteca transversal.
