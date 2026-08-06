# ADR-016 - Almacenamiento de objetos con Amazon S3 y MinIO

| Campo | Valor |
|---|---|
| ID | ADR-016 |
| Estado | Aceptada |
| Fecha | 2026-07-16 |
| Decisor | Propietario del proyecto |
| Relacionados | ADR-003, ADR-004, ADR-010, ADR-011, ADR-012, ADR-014, ADR-015 |

## Contexto

La plataforma debe almacenar originales, versiones, derivados y exportaciones sin introducir binarios en PostgreSQL. También debe soportar operación SaaS en AWS e instalaciones privadas, aislamiento multitenant, cargas grandes, cuarentena, integridad, retención documental, bloqueo legal y eliminación autorizada.

La compatibilidad con la API S3 no garantiza por sí sola paridad de comportamiento entre proveedores. Por ello, el dominio no dependerá directamente del SDK de AWS ni del cliente de MinIO, y las capacidades críticas se verificarán mediante POC.

## Decisión

- Amazon S3 será el almacenamiento de objetos de la modalidad SaaS.
- MinIO será el almacenamiento de referencia para despliegues privados.
- Ambos se integrarán mediante un puerto propio y adaptadores de infraestructura.
- PostgreSQL conservará metadatos, estados, hashes y referencias; S3/MinIO conservará el contenido binario.
- Las claves de objeto serán opacas, únicas e inmutables; una nueva versión documental siempre crea una nueva clave.
- La carga será directa mediante URL prefirmada y multipart hacia cuarentena.
- Un objeto solo pasará al almacenamiento canónico después de validar tamaño, tipo, antivirus e integridad.
- Los buckets canónicos tendrán versionado habilitado como defensa técnica; el versionado documental de negocio seguirá siendo autoritativo en PostgreSQL.
- El cifrado será SSE-KMS, con una clave administrada por la organización por ambiente como configuración base.
- Las claves KMS dedicadas por cliente serán una capacidad opcional para requisitos contractuales o regulatorios, no la configuración predeterminada.
- La retención WORM será selectiva, no universal, y se aplicará en un bucket dedicado a objetos que la requieran.
- Las descargas requerirán autorización previa y URL prefirmada de vigencia corta.

## Organización lógica

| Clase | Propósito | Versionado | Eliminación automática |
|---|---|---|---|
| `quarantine` | Cargas no verificadas | No requerido | Multipart incompleto y residuos según política |
| `records` | Originales y versiones aceptadas | Sí | Solo por disposición autorizada |
| `derivatives` | OCR, miniaturas y representaciones | Según necesidad | Ligada al documento padre |
| `exports-temp` | Paquetes de descarga temporales | No requerido | Entre 24 y 72 horas |
| `records-locked` | Objetos sujetos a WORM o bloqueo legal | Sí | Prohibida mientras exista retención o hold |

Los nombres físicos incluirán sistema, ambiente y región conforme a IaC. No se creará un bucket por tenant como regla general; el aislamiento se implementará mediante prefijos, autorización de aplicación, políticas IAM y pruebas negativas.

## Convención de claves

```text
tenants/{tenantId}/documents/{documentId}/versions/{versionId}/objects/{objectId}
```

Reglas vinculantes:

1. La aplicación genera todos los identificadores y claves.
2. El cliente no puede seleccionar libremente bucket ni clave.
3. La clave no contiene nombre original, correo, número de documento ni otra PII.
4. No se sobrescribe una clave existente.
5. El nombre original permanece como metadato protegido en PostgreSQL.
6. Toda operación valida tenant, documento, versión y estado antes de emitir acceso temporal.

## Flujo de incorporación

1. El servicio documental registra una sesión de carga pendiente e idempotente.
2. Emite una URL prefirmada multipart limitada a una clave de cuarentena controlada.
3. El cliente carga directamente al proveedor sin atravesar la memoria de la API.
4. Al confirmar, el servicio consulta el objeto y valida tamaño y checksum recibido.
5. Un trabajador asíncrono valida MIME real, antivirus y SHA-256 mediante streaming.
6. Si el resultado es limpio, copia el objeto a una clave canónica inmutable, registra la versión del proveedor y publica el resultado mediante outbox.
7. Si falla, mantiene el objeto bloqueado y aplica la política de incidente/cuarentena.
8. La reconciliación periódica detecta sesiones abandonadas, objetos huérfanos y referencias faltantes.

## Metadatos mínimos

La referencia persistida incluirá, como mínimo:

```text
storage_provider
bucket
object_key
provider_version_id
size_bytes
declared_media_type
detected_media_type
sha256
provider_checksum
status
encryption_key_reference
retention_until
legal_hold_status
created_at
verified_at
```

El SHA-256 de aplicación representa la huella de integridad documental. El checksum del proveedor valida transferencia/almacenamiento. El ETag no se tratará como MD5 ni como huella documental, especialmente con multipart.

## Seguridad y acceso

1. Acceso público bloqueado en todos los buckets.
2. TLS obligatorio y CORS limitado a orígenes aprobados.
3. URLs prefirmadas de descarga con vigencia inicial de uno a cinco minutos; no se almacenan como dato permanente.
4. Roles distintos para firma de cargas, procesamiento, lectura, disposición y administración.
5. La identidad que firma una URL posee únicamente las acciones y prefijos necesarios.
6. SSE-KMS con clave por ambiente; políticas de clave e IAM aplican mínimo privilegio.
7. En MinIO, SSE-KMS se respaldará con un administrador externo de claves aprobado.
8. Operaciones críticas de lectura, retención y eliminación dejan evidencia auditable sin exponer secretos ni URLs firmadas.
9. El aislamiento por prefijo complementa, pero no reemplaza, la autorización de aplicación.

## Retención, WORM y disposición

- WORM no se habilitará universalmente porque impediría disposiciones legítimas y aumentaría el costo operativo.
- Los objetos con obligación de inmutabilidad se copiarán o incorporarán en `records-locked` con retención o legal hold explícito por versión.
- El plazo deriva de la TRD/TVD, acto administrativo, investigación o política aplicable; no se improvisa en infraestructura.
- Una regla lifecycle no puede eliminar contenido canónico solo por antigüedad.
- La eliminación física requiere decisión de disposición autorizada, ausencia de retención/hold, evidencia auditable e idempotencia.
- Las transiciones a clases frías se definirán según frecuencia de acceso, RTO de recuperación y costo.

## Contrato de portabilidad

El puerto interno cubrirá carga multipart, finalización/aborto, consulta de metadatos, copia, descarga temporal, eliminación y, cuando esté soportado y habilitado, retención/legal hold. Las capacidades opcionales se expondrán explícitamente; no se simularán silenciosamente.

Los servicios de dominio no importarán SDK de AWS o MinIO. Los adaptadores traducirán errores, checksums, IDs de versión, cifrado y condiciones del proveedor a tipos internos estables.

## Alternativas no seleccionadas

- Solo Amazon S3: simplifica SaaS, pero no cubre el despliegue privado aprobado.
- Solo MinIO también en SaaS: añade operación de clúster sin ventaja frente al servicio administrado de AWS.
- Binarios en PostgreSQL: perjudica backups, crecimiento, transferencia y escalado de la base transaccional.
- Bucket por tenant: aumenta proliferación y complejidad operativa; podrá evaluarse como excepción de aislamiento dedicado.
- WORM universal: incompatible con documentos sin obligación de retención y con disposiciones autorizadas.
- Clave KMS por tenant obligatoria: incrementa políticas, cuotas, costo y operación sin necesidad general demostrada.
- Cifrado administrado por la aplicación o SSE-C: eleva riesgo de manejo de claves y queda fuera del estándar inicial.

## Consecuencias

### Positivas

- SaaS usa almacenamiento administrado y el despliegue privado conserva una ruta compatible.
- Los binarios escalan independientemente de PostgreSQL.
- Cuarentena, integridad, versionado y WORM selectivo soportan el ciclo documental.
- La clave por ambiente ofrece una base segura con complejidad contenida.

### Costos y riesgos

- Debe mantenerse y probarse más de un adaptador.
- Base de datos y objetos tienen consistencia eventual y requieren reconciliación.
- Copiar desde cuarentena consume tiempo, solicitudes y almacenamiento temporal.
- Versionado, retenciones y clases frías requieren control de costos y procedimientos de recuperación.
- La equivalencia S3/MinIO debe demostrarse, no presumirse.

## Criterios de aceptación

1. POC-002 ejecuta el mismo contrato esencial contra S3 y MinIO.
2. Un archivo de 500 MB se carga multipart y procesa por streaming sin crecimiento proporcional de memoria API.
3. Ningún archivo en cuarentena puede descargarse como documento disponible.
4. SHA-256 y checksum del proveedor se verifican y una alteración produce rechazo/alerta.
5. El versionado recupera una versión técnica sin sustituir el modelo de versiones de negocio.
6. WORM y legal hold se prueban solo en la clase dedicada, incluida la denegación de borrado.
7. Una identidad de tenant no obtiene ni firma acceso a objetos de otro tenant.
8. La rotación/configuración KMS por ambiente no exige cambiar lógica de dominio.
9. Las URLs vencidas, manipuladas o reutilizadas fuera de política fallan de forma segura.
10. La reconciliación identifica cargas incompletas y objetos o referencias huérfanas.

## Revisión

Después de POC-002, antes del piloto, al incorporar una instalación privada real o ante requisitos de aislamiento, residencia, retención o claves dedicadas por cliente.
