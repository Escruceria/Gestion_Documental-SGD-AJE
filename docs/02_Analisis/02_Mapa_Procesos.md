# Mapa de Procesos — Venus Ingeniería AS-IS

| Campo | Valor |
|---|---|
| Código | GDP-ANA-002 |
| Versión | 0.1 |
| Estado | Borrador para validación |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Product Owner) |
| Validación requerida | Venus Ingeniería (taller 2026-09-15) |

## Propósito

Diagrama los flujos documentales de Venus en formato fácil de validar: radicación, expedientes, búsqueda, disposición.

---

## 1. Macro-procesos

```
GESTIÓN DOCUMENTAL VENUS
│
├─ Radicación Entrada (300/día)
│  ├─ Recibir comunicación
│  ├─ Registrar en log
│  ├─ Numerar consecutivo
│  ├─ Fechar
│  └─ Distribuir a responsable
│
├─ Radicación Salida (200/día)
│  ├─ Redactar
│  ├─ Supervisar
│  ├─ Numerar
│  ├─ Enviar
│  └─ Guardar evidencia
│
├─ Gestión Expedientes (5.000 abiertos)
│  ├─ Crear expediente
│  ├─ Clasificar (serie/subserie/tipo)
│  ├─ Incorporar documentos
│  ├─ Mantener índice
│  └─ Cerrar y archivar
│
├─ Búsqueda y Consulta (Ad hoc)
│  ├─ Buscar por criterio
│  ├─ Navegar estructura
│  ├─ Validar acceso
│  └─ Abrir/descargar
│
└─ Transferencia y Disposición (Anual)
   ├─ Evaluar vigencia
   ├─ Empacar
   ├─ Transferir a histórico
   └─ Eliminar o destruir
```

---

## 2. Flujo detallado: Radicación de entrada

```
VENUS: Radicación de entrada (AS-IS)

Comunicación externa
       │
       ↓
Recepcionista: Recibe comunicación (email/postal/mesa)
       │
       ├─ Imprimir (si digital)
       ├─ Anotar hora de recepción
       └─ Pasar a secretaria
       │
       ↓
Secretaria: Radicar entrada
       │
       ├─ Abrir Excel/log manual
       ├─ Asignar número consecutivo (¿reinicia año? ¿por dpto?)
       ├─ Registrar:
       │  ├─ Número radicación
       │  ├─ Fecha/hora
       │  ├─ Remitente
       │  ├─ Asunto
       │  └─ Dependencia destino
       ├─ Guardar copia digital (¿dónde? Google Drive? Carpeta compartida?)
       ├─ Imprimir comprobante (¿por correo? ¿manual?)
       └─ Distribuir a responsable
       │
       ↓
Responsable: Recibe radicación
       │
       └─ Archivo en carpeta de proyecto/área
            │
            └─ Acceso restringido: ¿quién puede ver?

Problemas identificados (validar):
- ¿Qué pasa si se pierde el número consecutivo?
- ¿Cómo se garantiza que llegó?
- ¿Dónde queda el original?
- ¿Cuánto tiempo en cada paso?
```

---

## 3. Flujo detallado: Expediente

```
VENUS: Gestión de expedientes (AS-IS)

Necesidad operacional (proyecto, cliente, caso)
       │
       ↓
Gestor documental: Crear expediente
       │
       ├─ Crear carpeta (física en bóveda / digital en Google Drive)
       ├─ Asignar número de expediente (¿secuencial? ¿por serie?)
       ├─ Completar metadatos:
       │  ├─ Clasificación (serie/subserie)
       │  ├─ Asunto
       │  ├─ Responsable
       │  └─ Fecha de apertura
       └─ Crear índice (¿manual? ¿Excel?)
       │
       ↓
Usuarios: Incorporar documentos
       │
       ├─ Radicar entrada/salida dentro expediente
       ├─ Guardar documentos operativos
       ├─ Actualizar índice manualmente
       └─ Versionar: ¿hay cambios? ¿quién autoriza?
       │
       ↓
Gestor documental: Mantener índice
       │
       ├─ Revisión periódica (¿mensual? ¿anual?)
       ├─ Validar completitud
       ├─ Preparar para cierre
       └─ [⏳ Decisión] Transferir o eliminar
       │
       ↓
Cierre de expediente
       │
       └─ Archivar permanentemente o destruir
            (¿después de cuántos años? ¿quién autoriza?)

Problemas (validar):
- ¿Hay duplicación de documentos en múltiples carpetas?
- ¿Se actualiza el índice siempre?
- ¿Hay expedientes "perdidos"?
- ¿Cuánto tiempo se dedica a mantener?
```

---

## 4. Flujo detallado: Búsqueda

```
VENUS: Búsqueda y consulta (AS-IS)

Usuario necesita encontrar documento/expediente
       │
       ↓
¿Dónde busca?
       │
       ├─ Opción A: Navegación manual (Windows Explorer)
       │  └─ Buscar en carpetas compartidas
       │     └─ Resultado: Encontró o no (¿50/50?)
       │
       ├─ Opción B: Google Drive search
       │  └─ Buscar por texto, fecha, propietario
       │     └─ Resultado: Limitado a Drive
       │
       ├─ Opción C: Recordar número/asunto
       │  └─ Abrir Excel de radicaciones
       │     └─ Navegar a carpeta manual
       │
       └─ Opción D: Preguntar a gestor documental
          └─ Esperar respuesta

Validaciones de acceso:
- [⏳ VALIDAR] ¿Restricción por proyecto/área?
- [⏳ VALIDAR] ¿Auditoría de quién accedió?
- [⏳ VALIDAR] ¿Documentos confidenciales marcados?

Problemas (validar):
- ¿Cuál es la tasa de éxito de búsqueda?
- ¿Cuánto tiempo tarda encontrar documento?
- ¿Hay documentos que "desaparecen"?
```

---

## 5. Matriz de actores × procesos

| Proceso | Recepcionista | Secretaria | Gestor | Especialista | Supervisor | Archivo | Compliance |
|---|---|---|---|---|---|---|
| Radicar entrada | Recibir | Numerar, fechar | Validar | — | Revisar si solicita | — | — |
| Radicar salida | — | Crear | Numerar | Originador | Aprobar | — | — |
| Expediente crear | — | — | Crear, clasificar | Usar | — | — | Validar |
| Expediente mantener | — | — | Mantener índice | Actualizar | — | — | Auditar |
| Búsqueda | — | — | Asesorar | Buscar | Buscar | Consultar | Auditar |
| Disposición | — | — | Evaluar | — | Autorizar | Ejecutar | Validar |

---

## 6. Estructura de clasificación actual

**[⏳ VALIDAR CON VENUS]**

Ejemplo probable:

```
SERIES DOCUMENTALES
│
├─ Gestión Administrativa
│  ├─ Recursos Humanos
│  │  ├─ Contratos de empleados
│  │  ├─ Nómina
│  │  └─ Beneficios
│  ├─ Contabilidad
│  │  ├─ Facturas recibidas
│  │  ├─ Facturas emitidas
│  │  └─ Comprobantes pagos
│  └─ Compras y Proveedores
│
├─ Proyectos (por cliente/proyecto)
│  ├─ Proyecto A
│  │  ├─ Propuesta
│  │  ├─ Contrato
│  │  ├─ Comunicaciones
│  │  └─ Entregas
│  └─ Proyecto B
│
├─ Legal y Contratos
│  ├─ Contratos clientes
│  ├─ Acuerdos internos
│  └─ Litigios
│
└─ Cumplimiento
   ├─ Auditorías
   ├─ Certificaciones
   └─ Reportes
```

---

## 7. Información de entrada a partir de flujo vertical

**Flujo vertical (12-paso SGD) vinculado a Venus:**

| Paso | Proceso Venus | RF SGD | Validación |
|---|---|---|---|
| 1 | Setup organización | RF-IAM-001 | ⏳ Confirmar estructura |
| 2 | Invitar usuarios | RF-IAM-003 | ⏳ Confirmar actores |
| 3 | Vincular identidades | RF-IAM-004 | ⏳ Confirmar AD/Google |
| 4 | Cambio tenant | RF-IAM-008 | ⏳ N/A (un tenant) |
| 5 | Series/tipos | RF-DOC-001 | ⏳ Mapear estructura actual |
| 6 | Crear documento | RF-DOC-004 | ⏳ Nuevos documentos o existentes |
| 7 | Solicitar carga | RF-DOC-005 | ⏳ Cómo hoy se adjuntan |
| 8 | Confirmar carga | RF-DOC-006 | ⏳ Validar completitud |
| 9 | Procesar archivo | RF-DOC-007 | ⏳ Antivirus, cifrado hoy |
| 10 | Registrar versión | RF-DOC-009 | ⏳ Control versiones actual |
| 11 | Radicar entrada | RF-COR-001 | ⏳ Procesos radicación |
| 12 | Auditar evento | RF-AUD-001 | ⏳ Logging, trazas hoy |

---

## Pendientes

- [ ] Taller de procesos con Venus (2026-09-15)
- [ ] Validar con Juridico: retención, firma, auditoría
- [ ] Medir tiempos en cada paso
- [ ] Cuantificar problemas/dolor
- [ ] Confirmar herramientas actuales
- [ ] Mapear datos sensibles

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-08-05 | Procesos diagramados, validación pendiente Venus. | Álvaro Patiño Cruz |
