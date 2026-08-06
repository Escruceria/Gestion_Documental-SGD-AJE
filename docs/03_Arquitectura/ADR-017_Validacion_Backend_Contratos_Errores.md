# ADR-017 - Validación del backend, contratos y errores HTTP

| Campo | Valor |
|---|---|
| ID | ADR-017 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-003, ADR-012, ADR-013, ADR-015, ADR-016 |

## Contexto

Los macroservicios NestJS recibirán datos no confiables mediante REST, configuración de ambiente, mensajería y cargas documentales. TypeScript aporta comprobación estática, pero sus tipos no validan valores durante la ejecución. Se necesita una estrategia uniforme que separe la forma del contrato HTTP, las reglas del dominio y la integridad persistente, y que produzca errores estables sin filtrar información sensible.

## Decisión

| Responsabilidad | Tecnología o patrón aprobado |
|---|---|
| DTO de entrada HTTP | `class-validator` |
| Transformación controlada | `class-transformer` |
| Integración global | `ValidationPipe` de NestJS |
| OpenAPI | `@nestjs/swagger` |
| Reglas de dominio | Value Objects y servicios de dominio propios |
| Configuración/variables de entorno | Esquema validado al arrancar |
| Persistencia | Constraints y tipos PostgreSQL |
| Errores HTTP | `application/problem+json` basado en RFC 9457 |

## Validación por capas

1. El borde HTTP valida estructura, tipos, formatos, rangos y campos admitidos mediante DTO concretos.
2. La capa de aplicación convierte el DTO validado en comando o consulta y agrega el contexto confiable de tenant/actor.
3. El dominio aplica invariantes y reglas de negocio mediante Value Objects, agregados y servicios de dominio.
4. PostgreSQL aplica tipos, nulabilidad, claves, unicidad, referencias, checks y RLS como última defensa.
5. Las respuestas de error se traducen a un contrato HTTP uniforme; no se exponen excepciones internas.

La validación del cliente mejora la experiencia, pero nunca sustituye estas capas.

## Configuración global

Cada servicio HTTP instalará un `ValidationPipe` global equivalente a:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: {
      target: false,
      value: false,
    },
    exceptionFactory: buildValidationProblem,
  }),
);
```

La configuración exacta podrá endurecerse por servicio, pero no podrá desactivar silenciosamente el rechazo de propiedades desconocidas ni exponer objeto/valor en errores.

## Reglas para DTO

1. Los DTO de entrada son clases concretas; no interfaces ni tipos borrados en ejecución.
2. Los imports de DTO usados por NestJS no serán `import type`.
3. Cada propiedad aceptada tendrá validadores explícitos.
4. Los DTO no contienen lógica de negocio ni acceden a repositorios.
5. Los DTO no se reutilizan como entidades de dominio, filas Kysely o modelos de persistencia.
6. Parámetros de ruta y consulta usan DTO o pipes explícitos como `ParseUUIDPipe`.
7. Las conversiones implícitas ambiguas quedan prohibidas; fechas, booleanos, números y enumeraciones se transforman de forma explícita y comprobable.
8. `PartialType`, `PickType`, `OmitType` e `IntersectionType` se importan desde `@nestjs/swagger` cuando el DTO forma parte de OpenAPI.
9. Un PATCH valida presencia y contenido sin convertir `null`, vacío y ausencia en equivalentes.
10. La sanitización no se confunde con validación: preservar el valor original permitido y escapar según el contexto de salida.

## Reglas de dominio

Las restricciones que dependen del estado o significado del negocio no se expresarán exclusivamente mediante decoradores HTTP. Entre ellas:

- expediente abierto para incorporar documentos;
- transición documental permitida;
- autorización por tenant, dependencia o clasificación;
- unicidad con significado de negocio;
- retención, bloqueo legal y disposición;
- límites contractuales o cuotas;
- consistencia entre documento, versión y objeto almacenado.

Estas reglas devolverán errores de dominio tipados. La capa HTTP los traducirá sin acoplar el dominio a NestJS.

## Configuración y variables de entorno

- Cada macroservicio define un esquema tipado para toda variable requerida.
- La aplicación falla de forma inmediata al arrancar si falta una variable, tiene formato inválido o combina opciones incompatibles.
- No se usan valores predeterminados inseguros para secretos, tenant, cifrado, autenticación o conexiones productivas.
- Los mensajes de arranque identifican la clave/configuración inválida sin imprimir su valor secreto.
- La tecnología concreta del esquema de configuración se decidirá al definir configuración y secretos; el comportamiento anterior es vinculante.

## Persistencia

Los validadores de aplicación no reemplazan constraints PostgreSQL. Las migraciones administradas por `node-pg-migrate` definirán, según corresponda:

- `NOT NULL`;
- tipos y dominios PostgreSQL;
- claves primarias y foráneas;
- índices únicos, incluyendo `tenant_id`;
- restricciones `CHECK`;
- políticas RLS;
- invariantes que sean locales y seguras de imponer en la base propietaria del servicio.

Los errores de constraint se mapearán a errores internos tipados y después a Problem Details; no se devolverán mensajes, nombres internos o SQL del driver.

## Contrato de errores HTTP

El tipo de contenido será `application/problem+json`. La forma base será:

```json
{
  "type": "https://errors.example.com/validation/invalid-request",
  "title": "Solicitud inválida",
  "status": 400,
  "detail": "Uno o más campos no cumplen el contrato.",
  "instance": "/api/documents",
  "code": "VALIDATION_FAILED",
  "correlationId": "01J...",
  "errors": [
    {
      "field": "name",
      "code": "LENGTH_OUT_OF_RANGE"
    }
  ]
}
```

Reglas:

1. `type`, `code` y códigos de campo son estables y aptos para clientes; `title` y `detail` son texto localizado o presentable.
2. `instance` no incluye secretos ni parámetros sensibles.
3. `correlationId` permite ubicar la evidencia operativa sin exponer stack trace.
4. No se devuelven clase de excepción, SQL, rutas internas, tokens, valores secretos o stack trace.
5. Los errores de autenticación y autorización no revelan la existencia de recursos de otro tenant.
6. Un filtro global traduce excepciones conocidas; las desconocidas producen un problema genérico 500 y registro interno sanitizado.
7. OpenAPI documenta los problemas comunes y los endpoints documentan los específicos del dominio.

El dominio y la API usarán códigos internos definidos por el proyecto; no se expondrán directamente mensajes predeterminados de `class-validator` como contrato estable.

## Archivos y contenido no confiable

La validación de un DTO de carga no acredita el archivo. Conforme a ADR-016, el pipeline también verifica tamaño, MIME declarado y detectado, firma binaria, checksum, SHA-256, antivirus y estado de cuarentena. El nombre recibido se trata como metadato no confiable y nunca define la clave del objeto.

## Alternativas no seleccionadas

- Zod como estándar backend: válido técnicamente, pero no elegido para DTO HTTP por requerir integración adicional con el modelo NestJS/Swagger aprobado.
- Validación manual en controladores: dispersa reglas y genera respuestas inconsistentes.
- Validación solo en frontend: permite entradas inválidas desde integraciones y clientes manipulados.
- Validación solo en PostgreSQL: detecta demasiado tarde y acopla el contrato HTTP al almacenamiento.
- Reutilizar DTO como entidad de dominio: mezcla transporte, negocio y persistencia.
- Formato de error propio sin estándar: aumenta el costo para consumidores y observabilidad.

## Consecuencias

### Positivas

- Integración directa con NestJS y generación OpenAPI.
- Rechazo uniforme de datos desconocidos o mal formados.
- Invariantes de negocio independientes del transporte.
- Defensa en profundidad con PostgreSQL.
- Errores consumibles por frontend e integraciones sin filtrar detalles internos.

### Costos y riesgos

- Existe mapeo explícito entre DTO, comandos, dominio y persistencia.
- Los decoradores pueden duplicar parcialmente restricciones documentadas en OpenAPI y formularios.
- `transform: true` exige pruebas contra coerciones inesperadas.
- El catálogo de códigos de error deberá gobernarse y versionarse.

## Criterios de aceptación

1. Todos los endpoints rechazan propiedades no declaradas.
2. DTO importado incorrectamente o sin metadatos se detecta mediante pruebas de contrato.
3. Cadenas ambiguas no se convierten silenciosamente en números, fechas o booleanos válidos.
4. Una regla de dominio se prueba sin iniciar NestJS ni PostgreSQL.
5. Las invariantes persistentes críticas tienen constraint y prueba de migración.
6. Respuestas de error cumplen `application/problem+json` y el esquema OpenAPI.
7. Ningún error 4xx/5xx expone stack trace, SQL, tokens, secretos o valores sensibles.
8. Los códigos de error permanecen estables aunque cambie el texto presentable.
9. La aplicación no arranca con configuración ausente o inválida.
10. Pruebas negativas confirman que un actor no infiere recursos de otro tenant.

## Revisión

Después de POC-001, antes del primer flujo vertical y ante cambios mayores en NestJS, `class-validator`, OpenAPI o el estándar Problem Details.
