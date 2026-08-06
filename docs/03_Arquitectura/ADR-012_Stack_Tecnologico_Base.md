# ADR-012 - Stack tecnológico base

| Campo | Valor |
|---|---|
| ID | ADR-012 |
| Estado | Aceptada; complementada por ADR-013 y ADR-014 |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Alcance | Stack base frontend, backend, API y persistencia |

## Contexto

El proyecto requiere un stack tipado, mantenible y coherente para una arquitectura distribuida de macroservicios, con API explícita, frontend desacoplado y base de datos relacional. La decisión debe permitir crecimiento del equipo, pruebas automatizadas y despliegues independientes.

## Decisión

| Capa | Tecnología aprobada | Estado |
|---|---|---|
| Lenguaje | TypeScript | Aprobada |
| Runtime | Node.js 24 LTS | Aprobada |
| Backend | NestJS | Aprobada |
| Motor HTTP | Express mediante `@nestjs/platform-express` | Aprobada |
| API | REST + OpenAPI 3.1 | Aprobada |
| Frontend | React + TypeScript | Aprobada |
| Construcción frontend | Vite | Aprobada |
| Base de datos | PostgreSQL | Aprobada |

## Aplicación

- Los servicios HTTP se implementarán con NestJS sobre el adaptador oficial de Express.
- Express puro requerirá un ADR de excepción.
- Los workers que no expongan API podrán usar NestJS como aplicación standalone, sin servidor HTTP.
- Las APIs REST tendrán contratos OpenAPI 3.1 versionados.
- El frontend será una SPA React construida con Vite y consumirá las APIs por medio del gateway.
- PostgreSQL será la base transaccional de los servicios; cada macroservicio tendrá propiedad exclusiva sobre su base o esquema y credenciales.
- Los binarios documentales no se almacenarán en PostgreSQL.

## Consecuencias

### Positivas

- TypeScript de extremo a extremo.
- Convenciones uniformes para módulos, validación, errores, pruebas y OpenAPI.
- Separación clara entre frontend y backend.
- Ecosistema maduro y disponibilidad de personal.
- PostgreSQL soporta integridad, transacciones, RLS, JSONB controlado y búsqueda inicial.

### Negativas

- NestJS introduce abstracción y curva de aprendizaje.
- La SPA necesita una estrategia explícita de autenticación, seguridad del navegador y rutas públicas.
- Compartir tipos entre frontend y backend deberá hacerse mediante contratos, no mediante acoplamiento a entidades internas.
- Node.js debe actualizarse dentro de su ciclo LTS mediante un procedimiento controlado.

## Decisiones no incluidas

ADR-012 no aprueba todavía:

1. Almacenamiento de objetos.
2. Librerías definitivas de validación, estado, UI y pruebas.
3. Plataforma física de despliegue.

Autenticación fue aprobada en ADR-013, mensajería SaaS en ADR-014 y acceso/migraciones PostgreSQL en ADR-015.

## Controles

- Versiones exactas se fijarán mediante lockfile e imágenes reproducibles.
- Solo se usarán versiones soportadas y se mantendrá una matriz de compatibilidad.
- OpenAPI será validado en CI.
- No se expondrán entidades de persistencia directamente como contratos REST.
- Cada servicio deberá compilar, probarse y desplegarse independientemente.

## Revisión

Revisar ante fin de soporte de Node.js 24, incompatibilidad relevante, cambio de arquitectura o evidencia de que el stack no cumple los RNF aprobados.
