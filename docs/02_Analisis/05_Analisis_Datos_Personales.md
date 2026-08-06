# Análisis de Datos Personales y Restricciones — Venus AS-IS

| Campo | Valor |
|---|---|
| Código | GDP-ANA-005 |
| Versión | 0.1 |
| Estado | Borrador validación |
| Fecha | 2026-08-05 |
| Propietario | Álvaro Patiño Cruz (Datos), Óscar Hoyos (Jurídico) |

## Datos personales identificados (Venus)

### Categoría 1: Empleados
- Nombres, cédulas, direcciones
- Teléfonos, emails
- Nómina, beneficios
- Antecedentes disciplinarios
- Datos de contacto de emergencia

**Restricción:** LSRPD, consentimiento requerido

### Categoría 2: Clientes/Contratistas
- Nombres, cédulas/NIT
- Datos contacto
- Información contractual
- Datos comerciales

**Restricción:** Confidencialidad comercial

### Categoría 3: Terceros
- Beneficiarios de proveedores
- Datos en comunicaciones

**Restricción:** [⏳ VALIDAR]

---

## Clasificación de documentos

| Clasificación | Ejemplos | Acceso | Retención |
|---|---|---|---|
| Público | Políticas, organigramas | Todos | Según norma |
| Interno | Procedimientos, manuales | Empleados | Según norma |
| Confidencial | Contratos, estrategia | Autorizados | [⏳ VALIDAR] |
| Secreto | Datos personales sensibles | Restringido | [⏳ VALIDAR] |

---

## Retención normativa (Venus)

**[⏳ VALIDAR CON JURÍDICO]**

- Nómina: 2-5 años post-empleado
- Facturas: 5-7 años (tributario)
- Contratos: Vigencia + X años
- Comunicaciones: 1-3 años
- Datos personales: Fin de relación + plazo legal

---

## Validaciones requeridas

**Jurídica (Óscar Hoyos):**
- [ ] Fuentes normativas por tipo documento
- [ ] Términos retención específicos
- [ ] Requisitos de destrucción certificada
- [ ] Cumplimiento LSRPD en SGD

**Datos (Álvaro Patiño):**
- [ ] DPIA inicial (privacy impact assessment)
- [ ] Mapeo datos personales
- [ ] Consentimientos requeridos

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-08-05 | Datos y restricciones AS-IS, validaciones requeridas. | Álvaro Patiño Cruz |
