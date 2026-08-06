# Índice maestro de documentación

| Campo | Valor |
|---|---|
| Código | GDP-IDX-001 |
| Versión | 4.0 |
| Estado | Aprobado (Fase 2 Ejecutada) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Project Manager, Responsable Documentación) |
| Revisores | Álvaro Patiño Cruz (Product Owner), Wilmar Betancur Valencia (Patrocinador) |
| Aprobador | Wilmar Betancur Valencia (Patrocinador) |

## 1. Propósito

Este índice define la arquitectura documental oficial del proyecto, el código de cada familia y el estado inicial de sus entregables. Un nombre incluido no significa que el documento esté aprobado. Los estados permitidos son: `No iniciado`, `Borrador`, `En revisión`, `Aprobado`, `Obsoleto` y `Archivado`.

## 2. Convenciones

- Formato principal: Markdown UTF-8; CSV UTF-8 para matrices; YAML para OpenAPI.
- Nombres sin tildes ni caracteres especiales en los nuevos archivos.
- Códigos: `GDP-<FAMILIA>-<NNN>`; requisitos `RF-<DOM>-NNN`, `RNF-<CAT>-NNN`, reglas `RN-<DOM>-NNN`, casos de uso `CU-<DOM>-NNN`, historias `HU-<DOM>-NNN`, pruebas `CP-<TIPO>-NNN`, controles legales `CL-NNN` y ADR `ADR-NNN`.
- Versión documental: `MAYOR.MENOR`; subir MAYOR ante cambio aprobado de alcance/decisión y MENOR ante mejora compatible.
- Cada documento debe registrar código, versión, estado, propietario, revisores, aprobador, fecha, fuentes, supuestos, decisiones, pendientes e historial.
- Ningún documento pasa a `Aprobado` sin revisión del rol competente y trazabilidad aplicable.

## 3. Catálogo maestro objetivo

El estado indicado corresponde a evidencia física al corte; un elemento anunciado sin archivo permanece `No iniciado`.

### 00_Gestion_Proyecto (`GDP-GPR` / `GDP-ACT` / `GDP-ALC` / `GDP-OBJ` / `GDP-STK` / `GDP-RACI` / `GDP-GLS` / `GDP-CHG` / `GDP-SUP`)

**Fase 1 Ejecutiva — Aprobado 2026-08-05; Actualizado 2026-09-15:**
- `01_Acta_Inicio_Proyecto.md` — **Aprobado v1.1** (Patrocinador, 10 responsables confirmados; Actualizado con datos reales Venus validados 2026-09-15).
- `02_Alcance_Proyecto.md` — **Aprobado v1.0** (Modalidad SaaS, cliente Venus, integraciones).
- `03_Objetivos_Proyecto.md` — **Aprobado v1.0** (12 objetivos + 8 hitos cronograma).
- `04_Interesados_Stakeholders.md` — **Aprobado v1.0** (10 responsables + cliente Venus).
- `05_Matriz_RACI.csv` — **Aprobado v1.0** (10 roles × 34 actividades).
- `06_Glosario.md` — **Aprobado v1.0** (150+ términos técnicos/legales).
- `07_Control_Cambios.md` — **Aprobado v1.0** (9 cambios Fase 1 registrados).
- `15_Supuestos_Restricciones.md` — **Aprobado v1.0** (15 SUP + 12 RES validados Acta).

**Fase 4 — Pre-Desarrollo (Actualizado 2026-08-06):**
- `08_Checklist_Recoleccion_Datos_Venus.md` — **Aprobado v1.0** (Pre-kickoff: 9 secciones, 50+ items, 3 fases, criterio de autorización claro).

**Pendientes (Fase 1):**
- `00_Diagnostico_Inicial_Proyecto.md` — Borrador (archivo heredado).
- `00_Indice_Maestro_Documentacion.md` — Aprobado v4.0 (este archivo, actualizado 2026-08-06).
- `00_Plan_Generacion_Documental.md` — Borrador.
- `00_Inventario_Estado_Documental.md` — Borrador controlado.
- `00_Inventario_Archivos.csv` — Borrador controlado.
- `08_Registro_Decisiones_Arquitectura.md` — No iniciado (referencia a ADR-011..021).
- `09_Riesgos_Proyecto.csv` — Borrador.
- `10_Hoja_Ruta_Producto.md` — Borrador (en 03_Objetivos cronograma).
- `11_Plan_Gestion_Configuracion.md` — Borrador.
- `12_Plan_Gestion_Cambios.md` — Borrador (en 07_Control_Cambios).
- `13_Plan_Gestion_Riesgos.md` — Borrador.
- `14_Plan_Comunicaciones.md` — Borrador.
- `15_Criterios_Gate_Inicio_Desarrollo.md` — Evaluación inicial.
- `16_Baseline_Tecnico_G7.md` — Parcial; workspace/lockfile creados.

### 01_Requisitos (`GDP-REQ`)

**Fase 1 Ejecutiva — Actualizado 2026-08-05:**
- `15_Supuestos_Restricciones.md` — **Aprobado v1.0** (15 SUP + 12 RES validados).

**Fase 2 Actividad 1-2 — Actualizado 2026-08-05:**
- `01_ERS_SRS_Gestion_Documental.md` — **Aprobado v1.0** (flujo vertical 12-paso).
- `02_Catalogo_Requisitos_Funcionales.md` — **Aprobado v1.0** (41 RF, flujo vertical).
- `03_Catalogo_Requisitos_No_Funcionales.md` — **Aprobado v1.0** (21 RNF, validaciones Acta).
- `04_Reglas_Negocio.md` — **Aprobado v1.0** (22 reglas, flujo vertical).
- `05_Actores_Roles_Permisos.md` — **Aprobado v1.0** (10 actores, flujo vertical).
- `08_Criterios_Aceptacion.md` — **Aprobado v1.0** (42 CA, flujo vertical).
- `09_Matriz_Trazabilidad.csv` — **Aprobado v1.0** (42 RF trazados, 100% cobertura).

**Fase 2 Actividad 1 — Nuevos documentos:**
- `06_Catalogo_Mensajes.md` — **Aprobado v1.0** (6 CMD, 21 EVT flujo vertical).
- `07_Catalogo_Validaciones.md` — **Aprobado v1.0** (60+ validaciones, flujo vertical).
- `10_Catalogo_Errores.md` — **Aprobado v1.0** (60+ códigos error RFC 9457).
- `11_Backlog_MVP_Futuro.md` — **Aprobado v1.0** (13 épicas, 49 US, 300 puntos).

**Fase 2 Actividad 2 — Nuevos documentos:**
- `12_Validacion_Trazabilidad.md` — **Aprobado v1.0** (RF-RNF-CA-CP 100% cobertura).

**Pendientes (a iniciar Fase 2-A3):**
- `06_Casos_Uso.md` — No iniciado.
- `07_Historias_Usuario.md` — No iniciado.
- `13_Backlog_Detallado.md` — Parcial (backlog en 11_Backlog_MVP_Futuro.md).

### 02_Analisis (`GDP-ANA`)

- `01_Analisis_Procesos_Negocio.md`; `02_Mapa_Procesos.md`; `03_Flujos_Documentales.md`; `04_Analisis_Actores.md`; `05_Analisis_Datos_Personales.md`; `06_Analisis_Riesgos_Privacidad.md`; `07_Analisis_Riesgos_Seguridad.md`; `08_Analisis_Interoperabilidad.md`; `09_Analisis_Multiempresa.md`; `10_Analisis_Conservacion_Digital.md`; `11_Analisis_TRD_TVD.md`; `12_Analisis_Brechas.md`.
- `13_Perfil_Capacidad_Operacion.md` — **Borrador**.

### 03_Arquitectura (`GDP-ARQ`)

- `01_Arquitectura_Software.md`; `02_Principios_Arquitectura.md`; `06_Diagrama_Despliegue.md`; `07_Diagrama_Integraciones.md`; `08_Diagrama_Seguridad.md`; `09_Diagrama_Multiempresa.md`; `10_Decisiones_ADR.md`; `11_Estrategia_Escalabilidad.md`; `12_Estrategia_Alta_Disponibilidad.md`; `13_Estrategia_Observabilidad.md`; `14_Estrategia_Backup_Recuperacion.md` — **No iniciados**.
- `05_Vista_Componentes_C4.md` — **Borrador para validación; seis macroservicios**.
- `15_Modelo_Amenazas.md` — **Borrador para revisión de seguridad; STRIDE**.
- `03_Vista_Contexto_C4.md` — **Borrador**.
- `04_Vista_Contenedores_C4.md` — **Borrador**.
- `16_Mapa_Dominios.md` — **Borrador**.
- `17_Matriz_Responsabilidades_Propiedad_Datos.csv` — **Borrador**.
- `18_Catalogo_Eventos_Comunicaciones.md` — **Borrador**.
- `19_Estrategia_Consistencia_Distribuida.md` — **Borrador para validación**.
- `ADR-011_Arquitectura_Distribuida_Macroservicios.md` — **Aprobado**.
- `ADR-012_Stack_Tecnologico_Base.md` — **Aprobado**.
- `ADR-013_Autenticacion_Keycloak_OIDC_OAuth2.md` — **Aprobado**.
- `ADR-014_Mensajeria_AWS_EventBridge_SQS.md` — **Aprobado**.
- `ADR-015_Acceso_PostgreSQL_Migraciones.md` — **Aprobado**.
- `ADR-016_Almacenamiento_Objetos_S3_MinIO.md` — **Aprobado**.
- `ADR-017_Validacion_Backend_Contratos_Errores.md` — **Aprobado**.
- `ADR-018_Librerias_Arquitectura_Frontend.md` — **Aprobado**.
- `ADR-019_Estrategia_Pruebas_Automatizadas.md` — **Aprobado**.
- `ADR-020_Observabilidad_OpenTelemetry.md` — **Aprobado**.
- `ADR-021_Mensajeria_Privada_RabbitMQ.md` — **Aprobado**.
- `20_Plan_Pruebas_Concepto.md` — **Borrador**.
- `21_Matriz_ADR_Documentos.md` — **Borrador controlado**.
- `22_Catalogo_Maestro_Stack_Versiones.md` — **Borrador controlado**.

### 04_Base_Datos (`GDP-DAT`)

- `01_Modelo_Conceptual.md` — **Borrador para validación**.
- `02_Modelo_Logico.md` — **Borrador para validación; seis servicios**.
- `03_Modelo_Fisico.md` — **No iniciado; posterior a POC y decisiones físicas**.
- `04_Diagrama_ER.md` — **Borrador lógico; seis diagramas**.
- `05_Diccionario_Datos.md` — **Borrador lógico**.
- `06_Catalogo_Entidades.md` — **Borrador para validación**.
- `07_Reglas_Integridad.md` — **Borrador; 20 invariantes**.
- `08_Estrategia_Indexacion.md`; `09_Estrategia_Particionamiento.md`; `10_Estrategia_Auditoria_BD.md` — **No iniciados**.
- `11_Estrategia_Migraciones.md` — **Borrador; sin migraciones productivas**.
- `12_Estrategia_Retencion_Datos.md`; `13_Estrategia_Anonimizacion.md`; `14_Estrategia_Cifrado.md` — **No iniciados**.
- `15_Modelo_Multitenant.md` — **Borrador bloqueante hasta POC-001**.

### 05_Backend (`GDP-BE`)

- `01_Arquitectura_Backend.md`; `02_Modulos_Backend.md` — **No iniciados**.
- `03_Convenciones_API.md` — **Borrador contractual**.
- `04_Especificacion_OpenAPI.yaml` — **Borrador OpenAPI 3.1 validado semánticamente**.
- `05_Catalogo_Endpoints.md` — **Borrador; siete operaciones verticales**.
- `06_Autenticacion_Autorizacion.md` — **Borrador para seguridad**.
- `07_Gestion_Errores.md`; `08_Validaciones.md` — **Borradores contractuales**.
- `09_Auditoria.md` — **No iniciado**.
- `10_Procesamiento_Asincrono.md` — **Borrador contractual**.
- `11_Seguridad_API.md` — **No iniciado**.
- `12_Idempotencia.md` — **Borrador contractual**.
- `13_Rate_Limiting.md`; `14_Versionamiento_API.md`; `15_Estrategia_Pruebas_Backend.md` — **No iniciados**.
- `16_Especificacion_AsyncAPI.yaml` — **Borrador AsyncAPI 3.0; sintaxis y referencias validadas**.

### 06_Frontend (`GDP-FE`)

- `01_Arquitectura_Frontend.md`; `02_Mapa_Pantallas.md`; `03_Rutas_Navegacion.md`; `04_Componentes_UI.md`; `05_Sistema_Diseno.md`; `06_Accesibilidad.md`; `07_Gestion_Estado.md`; `08_Manejo_Formularios.md`; `09_Validaciones_Cliente.md`; `10_Manejo_Errores.md`; `11_Matriz_Roles_Pantallas.md`; `12_Prototipos_Textuales.md`; `13_Mensajes_Usuario.md`; `14_Estrategia_Pruebas_Frontend.md`.

### 07_Seguridad_Privacidad (`GDP-SEG`)

- `01_Politica_Seguridad.md`; `02_Modelo_Amenazas_STRIDE.md`; `03_Matriz_Riesgos_Seguridad.csv`; `04_Controles_OWASP.md`; `05_Gestion_Identidades.md`; `06_Gestion_Secretos.md`; `07_Cifrado.md`; `08_Gestion_Sesiones.md`; `09_Gestion_Vulnerabilidades.md`; `10_Gestion_Incidentes.md`; `11_Plan_Respuesta_Incidentes.md`; `12_Plan_Continuidad.md`; `13_Plan_Recuperacion_Desastres.md`; `14_Privacidad_Desde_Diseno.md`; `15_Evaluacion_Impacto_Privacidad.md`; `16_Matriz_Datos_Personales.csv`; `17_Inventario_Bases_Datos.csv`; `18_Procedimiento_Derechos_Titulares.md`; `19_Politica_Retencion_Eliminacion.md`; `20_Matriz_Accesos.md`.

### 08_Cumplimiento_Legal (`GDP-LEG`)

- `01_Matriz_Cumplimiento_Legal.csv`; `02_Marco_Normativo.md`; `03_Matriz_Normas_Requisitos.md`; `04_Evidencias_Cumplimiento.md`; `05_Propiedad_Intelectual.md`; `06_Inventario_Licencias_Software.csv`; `07_Modelo_Cesion_Derechos.md`; `08_Contrato_Transmision_Datos.md`; `09_Acuerdo_Confidencialidad.md`; `10_Lista_Verificacion_Legal.md`.

### 09_Politicas_Legales (`GDP-POL`)

- `01_Politica_Tratamiento_Datos.md`; `02_Aviso_Privacidad.md`; `03_Terminos_Condiciones.md`; `04_Politica_Cookies.md`; `05_Politica_Seguridad_Informacion.md`; `06_Politica_Conservacion_Documental.md`; `07_Politica_Uso_Aceptable.md`; `08_Acuerdo_Nivel_Servicio.md`; `09_Politica_Respaldo.md`; `10_Politica_Eliminacion_Segura.md`.

### 10_Pruebas (`GDP-TST`)

- `01_Estrategia_Pruebas.md`; `02_Plan_Pruebas.md` — **Borradores para aprobación; ejecución no iniciada**.
- `03_Casos_Prueba_Funcionales.md` — **Diseñado; 42 CP materializados**.
- `04_Casos_Prueba_Seguridad.md`; `05_Casos_Prueba_Privacidad.md` — **Diseñados; no ejecutados**.
- `06_Casos_Prueba_Rendimiento.md` — **Diseño provisional; umbrales pendientes**.
- `07_Casos_Prueba_Accesibilidad.md`; `08_Casos_Prueba_Integraciones.md` — **Diseñados; no ejecutados**.
- `09_Matriz_Trazabilidad_Pruebas.csv` — **Borrador validado; 42 RF/42 CP**.
- `10_Criterios_Entrada_Salida.md` — **Borrador para aprobación**.
- `11_Plan_Pruebas_Aceptacion.md` — **Borrador; cliente piloto pendiente**.
- `12_Plan_Pruebas_Recuperacion.md`; `13_Plan_Pruebas_Backup.md` — **Diseñados; no ejecutados**.
- `14_Plan_Pruebas_Multitenant.md` — **Diseñado; bloqueante hasta POC-001**.

### 11_Despliegue_Operacion (`GDP-OPS`)

- `01_Arquitectura_Despliegue.md`; `02_Ambientes.md`; `03_Pipeline_CI_CD.md`; `04_Estrategia_Configuracion.md`; `05_Variables_Entorno.md`; `06_Infraestructura_AWS.md`; `07_Monitoreo.md`; `08_Logs.md`; `09_Alertas.md`; `10_Backup_Restore.md`; `11_Escalamiento.md`; `12_Runbooks.md`; `13_Checklist_Produccion.md`; `14_Plan_Mantenimiento.md`; `15_Plan_Actualizaciones.md`.

### 12_Manuales (`GDP-MAN`)

- `01_Manual_Administrador.md`; `02_Manual_Gestion_Documental.md`; `03_Manual_Radicador.md`; `04_Manual_Usuario.md`; `05_Manual_Ciudadano.md`; `06_Manual_Auditor.md`; `07_Manual_Soporte.md`; `08_Manual_Instalacion.md`; `09_Manual_Configuracion.md`; `10_Manual_Recuperacion.md`.

## 4. Fuentes heredadas

El directorio `docs/05. Normativa` es fuente de entrada, no parte de la línea base aprobada. No debe eliminarse ni sobrescribirse. Su contenido está inventariado con SHA-256; toda norma debe citar fuente oficial, vigencia y aplicabilidad antes de convertirse en requisito.

## 5. Diagramas obligatorios

Los diagramas Mermaid se distribuirán entre arquitectura, análisis, requisitos, datos y operación: contexto C4, contenedores, componentes, despliegue, ER, integraciones, seguridad, multitenancy, autenticación, registro, radicaciones de entrada/salida, expediente, incorporación, versiones, aprobación, firma, préstamo, transferencia, disposición, privacidad, pago, facturación, auditoría y recuperación de incidentes.

## 6. Control del índice

Este archivo se actualizará en cada entrega documental. Cada alta, baja, cambio de nombre o cambio de estado deberá registrarse también en `07_Control_Cambios.md`. Los enlaces se incorporarán cuando existan los archivos; se evita crear documentos vacíos solo para completar la estructura.
