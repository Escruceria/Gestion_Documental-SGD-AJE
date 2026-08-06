# Perfil de capacidad y operación

| Campo | Valor |
|---|---|
| Código | GDP-ANA-013 |
| Versión | 1.0 |
| Estado | Aprobado (Venus validado en Acta v1.0) |
| Fecha | 2026-08-05 |
| Propietarios | Álvaro Patiño Cruz (Product Owner), Neffer Anais Martínez (Operaciones) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), Antonio José Escrucería Uribe (Seguridad), David Ernesto Antequera Martínez (QA) |

## 1. Propósito

Definir una carga de referencia verificable para diseñar y probar el MVP. Las cifras son objetivos de ingeniería, no garantías contractuales, hasta que exista un cliente piloto, datos reales y pruebas reproducibles.

## 2. Unidades de medida

- **Usuario registrado:** identidad con al menos una membresía.
- **Sesión activa:** sesión no expirada; no implica actividad simultánea.
- **Usuario concurrente activo:** usuario que emite al menos una solicitud durante una ventana móvil de 60 segundos.
- **RPS:** solicitudes HTTP por segundo en el límite de entrada.
- **p95/p99:** percentil de latencia medido del lado servidor, excluyendo transferencia completa de archivos cuando se indique.
- **Documento:** entidad lógica; puede contener varias versiones y archivos.
- **Radicación:** operación confirmada con consecutivo único por tenant/configuración.

## 3. Escenarios de capacidad

**Venus Ingeniería (Piloto) — Validado en Acta v1.0:**

| Escenario | Tenants | Usuarios registrados | Concurrentes activos | RPS sostenidas | Documentos acumulados | Radicaciones/día | Usar |
|---|---:|---:|---:|---:|---:|---:|---|
| **CAP-PIL-VENUS** | 1 | 45 | 20-50 (evolución meses 1-12) | 10-30 | 5.000 inicial | 500 total (300 entrada, 200 salida) | **Piloto Venus (Referencia POC)** |
| CAP-MVP | 100 | 50.000 | 500 | 300 | 5.000.000 | 25.000 | Objetivo post-piloto |
| CAP-GRO | 500 | 200.000 | 2.000 | 1.200 | 25.000.000 | 100.000 | Crecimiento escalable |

**Crecimiento Venus estimado:** 30% anual (Acta v1.0).
- Mes 12: 50 usuarios → 65 usuarios estimados
- Mes 24: 65 → 85 usuarios
- Mes 36: 85 → 110 usuarios

**Referencia de aceptación:** CAP-PIL-VENUS es gate POC. CAP-MVP es target comercial futuro.

## 4. Mezcla de carga CAP-MVP

| Perfil | Porcentaje | Concurrentes aprox. | Operación dominante |
|---|---:|---:|---|
| PERF-01 Navegación/consultas | 35 % | 175 | Listados, bandejas, detalle |
| PERF-02 Búsqueda | 20 % | 100 | Texto y filtros autorizados |
| PERF-03 Documento/expediente | 15 % | 75 | Consulta de metadatos e índice |
| PERF-04 Escritura | 10 % | 50 | Crear/actualizar metadatos |
| PERF-05 Radicación | 8 % | 40 | Entrada/salida y comprobante |
| PERF-06 Transferencia de archivo | 7 % | 35 | URL firmada a almacenamiento |
| PERF-07 Reportes | 3 % | 15 | Básicos síncronos o trabajos |
| PERF-08 Administración | 2 % | 10 | Configuración, usuarios, permisos |

## 5. Perfil documental — Venus Ingeniería (Acta v1.0 validado)

| Variable | Venus CAP-PIL | Regla |
|---|---:|---|
| Radicaciones promedio/día | 500 (300 entrada + 200 salida) | Acta v1.0 confirmado |
| Pico radicaciones/hora | 100 | Supuesto distribuido 8h operativo |
| Documentos nuevos/día | 1.000 | 1MB promedio → 1GB/día |
| Archivo promedio | 1 MB | Estimado Venus (validar en taller) |
| Archivo web máximo | 100 MB | Configurable, inicio conservador |
| Total por radicación | 100 MB | Documentos + adjuntos |
| Expedientes simultáneos | 5.000 | Acta v1.0 confirmado |
| Crecimiento anual | 30% | Acta v1.0 confirmado |

**Validaciones requeridas (taller 2026-09-15):**
- Distribución real de tamaños de archivo
- Picos horarios en radicación
- Patrón de búsqueda (cuántas búsquedas/usuario/día)
- Frecuencia de actualización de documentos
- Requisitos de versioning
| Archivos por radicación | 20 | Configurable |
| Contenido a OCR | 30 % | Supuesto; cola desacoplada |
| Retención documental | Variable | Nunca fijar globalmente; TRD/base legal |

## 6. Objetivos de servicio para prueba

| ID | Operación | Objetivo | Condición |
|---|---|---|---|
| SLO-PERF-001 | Consultas comunes | p95 ≤ 2 s; p99 ≤ 5 s | CAP-MVP, sin transferencia de archivo |
| SLO-PERF-002 | Búsqueda simple | p95 ≤ 3 s; p99 ≤ 6 s | Filtros y permisos aplicados |
| SLO-PERF-003 | Escritura de metadatos | p95 ≤ 2 s | Sin trabajo asíncrono final |
| SLO-PERF-004 | Confirmar radicación | p95 ≤ 3 s | Archivo ya aceptado/cuarentenado |
| SLO-PERF-005 | Reporte básico | p95 ≤ 10 s | Dataset limitado y paginado |
| SLO-PERF-006 | Aceptar trabajo asíncrono | p95 ≤ 2 s | Persistencia + outbox confirmadas |
| SLO-ERR-001 | Error técnico HTTP | < 0,5 % | Excluye validaciones 4xx esperadas |
| SLO-SEC-001 | Fuga cross-tenant | 0 | Todas las pruebas negativas |
| SLO-DATA-001 | Duplicación de radicado | 0 | Incluye reintentos/concurrencia |
| SLO-DATA-002 | Pérdida de evento confirmado | 0 | Outbox + reconciliación |

Disponibilidad, RPO y RTO permanecen pendientes (`Q-005`). Valores de diseño preliminares para evaluación: 99,9 % mensual, RPO ≤ 15 minutos y RTO ≤ 4 horas; no son compromisos hasta aprobación.

## 7. Estrategia de escalamiento

| Recurso | Señal | Acción inicial | Umbral de evolución |
|---|---|---|---|
| Web/BFF | CPU, latencia, RPS | Réplicas horizontales | Saturación sostenida/p95 incumplido |
| Servicios API | CPU, RPS, pool DB | Réplicas por dominio | Escalar solo dominio afectado |
| Workers | Profundidad/edad de cola | Aumentar consumidores | Edad supera SLO del trabajo |
| PostgreSQL | CPU, IOPS, locks, conexiones | Índices/pooling/tuning | Separar instancia por servicio/tenant grande |
| Búsqueda | p95, corpus, reindexación | FTS/GIN | OpenSearch con evidencia de incumplimiento |
| Objeto | Capacidad/throughput | S3/MinIO | Partición/bucket/dedicación por política |
| Auditoría | Tasa y volumen | Partición temporal | Almacenamiento especializado/archivo |

## 8. Operación normal y degradada

- El frontend y APIs permanecen disponibles si OCR/notificaciones están retrasados; muestran estado pendiente.
- Ningún archivo queda disponible antes del veredicto requerido de seguridad.
- Si el bus falla, la operación local confirmada conserva evento en outbox y se publica al recuperar servicio.
- Si notificación falla, la radicación no se duplica; se reintenta el envío.
- Si búsqueda está degradada, se habilitan consultas limitadas por metadatos sin omitir autorización.
- Si auditoría obligatoria no puede persistirse, las operaciones críticas definidas fallan de forma segura; el catálogo decidirá cuáles.
- El generador de consecutivos debe soportar concurrencia, idempotencia y modo de contingencia autorizado.

## 9. Pruebas requeridas

1. Carga CAP-MVP sostenida 60 minutos.
2. Pico de 1.000 concurrentes durante 10 minutos.
3. Resistencia de 8 horas con mezcla de carga.
4. Stress hasta identificar saturación y recuperación.
5. Pruebas de cola con ráfaga y workers degradados.
6. Carga de archivos sin almacenar el cuerpo completo en memoria del API.
7. Concurrencia de consecutivos e idempotencia.
8. Aislamiento cross-tenant bajo carga.
9. Restore y reconciliación de eventos.

## 10. Supuestos por validar

| ID | Supuesto | Dueño | Evidencia requerida |
|---|---|---|---|
| SUP-CAP-001 | 25.000 radicaciones/día representa el horizonte MVP. | Product Owner | Datos del piloto/proyección comercial |
| SUP-CAP-002 | 30 % de archivos requiere OCR. | Gestión documental | Muestra representativa |
| SUP-CAP-003 | Archivo promedio de 5 MB. | Operaciones | Histograma de muestra |
| SUP-CAP-004 | 500 concurrentes es objetivo suficiente del MVP. | Patrocinador | Clientes/planes previstos |
| SUP-CAP-005 | 99,9 %, RPO 15 min y RTO 4 h son económicamente viables. | Patrocinador/Operaciones | Análisis costo-riesgo |

## 11. Criterio de aprobación

El perfil se aprueba cuando cliente piloto, volúmenes, distribución de archivos, SLO, RPO/RTO y costo objetivo hayan sido confirmados; hasta entonces las pruebas se etiquetarán contra `CAP-MVP-0.1`.

