# Inventario y estado documental

| Campo | Valor |
|---|---|
| Código | GDP-GPR-000 |
| Versión | 1.0 |
| Estado | Borrador controlado |
| Fecha | 2026-07-16 |
| Propietario | `[RESPONSABLE_DOCUMENTACION]` |
| Revisores | `[PROJECT_MANAGER]`, `[ARQUITECTO]`, `[LIDER_QA]` |
| Aprobador | `[PRODUCT_OWNER]` |

## Propósito

Registrar el inventario real previo a la línea base, evidenciar inconsistencias y preservar la procedencia de fuentes heredadas.

## Fuentes y método

- Inspección recursiva de `C:/proyectos/gestion-documental` el 2026-07-16.
- Lectura de encabezados Markdown/CSV, búsqueda de referencias e IDs y cálculo SHA-256.
- Extracción estructural del DOCX y texto/metadatos de PDF mediante herramientas locales.
- ADR-011 a ADR-021 y catálogo GDP-ARQ-022.

## Hechos encontrados

- Antes de normalizar: 41 archivos documentales, 29 MD, 3 CSV, 1 DOCX y 8 PDF.
- No se encontraron implementaciones productivas ni workspace de aplicación.
- `.git` existe como directorio, pero no es reconocido como repositorio válido; requiere validación humana antes de usar Git.
- La numeración de gobierno estaba desplazada: índice `01`, plan `02` y alcance-roadmap `03`-`11`, mientras referencias internas usaban la numeración objetivo.
- Existían solo `00_Gestion_Proyecto`, `01_Requisitos`, `02_Analisis`, `03_Arquitectura`, `04_Politicas_Legales` vacío y la fuente `05. Normativa`.
- ADR-011 a ADR-021 existen y están aceptados.
- El índice listaba numerosos documentos inexistentes.
- No se detectaron archivos binarios duplicados por SHA-256.
- Varias referencias internas conservaban nombres anteriores y menciones limitadas a ADR-011–014.

## Normalización ejecutada

- Índice y plan pasaron a prefijo `00_` para liberar `01_Acta_Inicio_Proyecto.md`.
- Alcance, objetivos, interesados, RACI, glosario, cambios, ADR, riesgos y roadmap se alinearon con `02` a `10`.
- No se movieron ni renombraron fuentes heredadas.

## Fuentes heredadas preservadas

| Ruta | Tipo | SHA-256 | Observación |
|---|---|---|---|
| `docs/05. Normativa/El Marco Normativo Fundamental.docx` | DOCX | `A36B845FA814CE68DFB16BFDACD20E0B48B230C9C2E7B81235CA6AA046B40E7E` | Síntesis secundaria; requiere validación jurídica especializada. QA visual no disponible por ausencia de LibreOffice. |
| `docs/05. Normativa/00. Leyes/LEY 594 DE 2000.pdf` | PDF | `7470A5D92D45465AAC74F4FAC777E89B4EBCC202C639B9192E0E732F1EF566C4` | 19 páginas; copia con nota de vigencia. Verificar fuente oficial actual. |
| `docs/05. Normativa/00. Leyes/Ley_527_de_1999.pdf` | PDF | `784C1BA9870A2493030D65393C8F5C3A182A1B5F3992072374C3A7FDE5F9FEE8` | 12 páginas; el propio documento advierte que no garantiza vigencia. |
| `docs/05. Normativa/01. Decretos/Decreto_1080_de_2015_Sector_Cultura.pdf` | PDF | `73E2496B2FF3B9241AFEDE1CC7890FF01576ABA64187ECE0898A40E4CDBF2C69` | 223 páginas; compilación a contrastar con fuente oficial vigente. |
| `docs/05. Normativa/01. Decretos/Decreto_2578_de_2012.pdf` | PDF | `DD8E8D6AE93E392D6622DE71AF6003A8A096441D87B23E9878A48BBFF5669610` | 7 páginas; revisar compilación/derogatoria. |
| `docs/05. Normativa/02. Acuerdos/2024-02_29_AcuerdoAGN-FIRMADO.pdf` | PDF | `2D71C6634B3B5762588855F2EAB4CF778720C79DD2E63EAF0FAF1D9415B3F65B` | 158 páginas; Acuerdo 001 de 2024. Aplicabilidad por control pendiente. |
| `docs/05. Normativa/03. Actos administrativos/acuerdo-012-1998.pdf` | PDF | `336E460CC692C2312885EB4C8A244D44355AC812503E3130FAC74A1CAD85861F` | Acto particular de Función Pública, no requisito general. |
| `docs/05. Normativa/03. Actos administrativos/resolucion-536-2017.pdf` | PDF | `D191FE73386BD1E133ADDEE46B7AA545356A9D8E2A73EBCA3BC91072C5F85887` | Escaneado, sin texto útil; requiere revisión visual/jurídica. |
| `docs/05. Normativa/03. Actos administrativos/resolucion-596-2016.pdf` | PDF | `E0DDFA006177726CF9181C6FACCB7AA01E73C376A0C75B7067DAEF1BD152E8AF` | Acto particular de Función Pública. |

## Contradicciones corregidas o por corregir

| Hallazgo | Estado | Tratamiento |
|---|---|---|
| Numeración gobierno desplazada | Corregido | Rutas normalizadas y cambio registrado. |
| Índice con rutas antiguas | En corrección | Actualizar catálogo real al finalizar la fase. |
| Alcance afirma solo ADR-011–014 | Pendiente | Sustituir por ADR-011–021 sin alterar decisiones. |
| Diagnóstico dice almacenamiento pendiente | Pendiente | ADR-016 ya lo resolvió. |
| Roadmap histórico limitado a ADR-014 | Histórico | Conservar historial; actualizar estado vigente. |
| Fuentes normativas mezcladas con estructura objetivo | Controlado | Preservar ruta y registrar como heredadas; no copiar sin necesidad. |
| Faltan documentos para gates G1–G7 | Abierto | Crear contenido sustantivo y evaluar gate. |

## Supuestos

- El repositorio inspeccionado es la fuente de trabajo autorizada.
- No existe todavía cliente piloto ni responsables nominales confirmados.

## Decisiones

- Las fuentes heredadas permanecen intactas en su ruta actual.
- Los nombres nuevos usan ASCII, guion bajo y convenciones GDP.
- Ningún resumen normativo se convierte automáticamente en requisito legal.

## Pendientes

- Validar propietario, aprobadores y cliente piloto.
- Validar Git y procedencia externa de binarios.
- Completar línea base y ejecutar validadores finales.
- Requiere validación jurídica especializada: vigencia, artículo, aplicabilidad y evidencia de cada control legal.

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-07-16 | Inventario inicial, hashes, diagnóstico y normalización registrada. | Codex |
