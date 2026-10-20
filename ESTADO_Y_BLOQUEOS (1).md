# Pruebas reales indispensables en el Supabase verificado (no simuladas)

Configura en un entorno de pruebas a: anónimo, estudiante A, estudiante B, solicitante pendiente, creador aprobado A, creador aprobado B, moderador/admin verificado. Nunca uses cuentas reales de alumnos.

| ID | Prueba | Resultado esperado |
|---|---|---|
| 01 | anónimo lista cursos publicados | ALLOW |
| 02 | anónimo obtiene curso borrador | DENY |
| 03 | anónimo lee lección privada de curso pagado | DENY |
| 04 | estudiante A lee progreso B | DENY |
| 05 | estudiante A edita progreso B | DENY |
| 06 | estudiante A inserta solicitud pending | ALLOW |
| 07 | solicitante pendiente se autoaprueba | DENY |
| 08 | usuario no aprobado crea curso | DENY |
| 09 | creador aprobado crea curso con price_cents=0 draft | ALLOW |
| 10 | creador asigna status=published desde frontend | DENY |
| 11 | creador edita curso de otro creador | DENY |
| 12 | creador edita curso ya publicado directamente | DENY |
| 13 | creador sube lección a su draft | ALLOW |
| 14 | creador sube lección a curso de otro | DENY |
| 15 | estudiante inserta enrollment directamente | DENY |
| 16 | RPC de enrollment free en curso publicado gratuito | ALLOW |
| 17 | RPC de enrollment free en curso pagado | DENY |
| 18 | RPC de enrollment free en draft | DENY |
| 19 | usuario anónimo invoca RPC | DENY |
| 20 | estudiante progreso en curso sin enrollment | DENY |
| 21 | estudiante progreso en lección de curso distinto | DENY |
| 22 | estudiante lee report privado ajeno | DENY |
| 23 | estudiante crea su propio reporte | ALLOW |
| 24 | usuario asigna bf_staff admin a sí mismo | DENY |
| 25 | usuario escribe revisión o audit_event | DENY |
| 26 | acceso a assets premium por URL pública o adivinada | DENY cuando exista storage |
| 27 | publicar edición no revisada | DENY |
| 28 | JWT manipulado/localStorage roles falsos | DENY |
| 29 | el cliente contiene sb_secret_ o service_role | FAIL / BLOQUEAR |
| 30 | webhook falso o duplicado crea pago/acceso | DENY al implementar Stripe test |

Los casos 26, 27 y 30 requieren implementación específica antes de vender. Para producción son obligatorios escaneo de archivos, privacidad juvenil, mitigación de abuso de reportes y auditoría de privilegios.
