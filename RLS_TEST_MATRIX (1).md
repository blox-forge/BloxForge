# BLOXFORGE — KIT PARA COPILOT SIN ACCESO A OTROS REPOSITORIOS

**Objetivo:** permitir que GitHub Copilot Agent prepare o implemente la integración de la academia ORIGINAL en la carpeta local, sin necesitar los repositorios de documentación ni que ChatGPT tenga permiso sobre el Supabase del compañero.

## Copiar dentro de VS Code
1. Descomprime este ZIP dentro de la carpeta raíz del proyecto abierto en VS Code. La carpeta se llamará `BLOXFORGE_COPILOT_KIT/`. **No sustituye index.html, style.css, script.js, auth-client.js ni ningún archivo del proyecto.**
2. En Copilot Agent pega el contenido COMPLETO de `BLOXFORGE_COPILOT_KIT/PROMPT_COPILOT_AGENT.md` o envía el mensaje: `Lee BLOXFORGE_COPILOT_KIT/PROMPT_COPILOT_AGENT.md y ejecuta sus instrucciones. El resto del kit está disponible localmente.`
3. Copilot podrá inspeccionar el frontend, comparar la migración propuesta con la base y preparar la integración.

## Qué incluye el ZIP
- `PROMPT_COPILOT_AGENT.md`: instrucciones autocontenidas para el Agent.
- `supabase/migrations/20261018_01_marketplace_free.sql`: propuesta SQL de 11 tablas (perfiles, solicitudes, creadores, staff, cursos, lecciones, inscripciones, progreso, revisiones, denuncias y auditoría). **NO SE HA EJECUTADO.**
- `examples/`: cliente Supabase con key pública y funciones de Auth/progreso/cursos. Son ADAPTADORES, no reemplazos del sitio.
- `docs/RLS_TEST_MATRIX.md`: matriz de pruebas de autorización y pagos.
- `docs/ESTADO_Y_BLOQUEOS.md`: resultado real de la auditoría, datos de Supabase y pasos humanos.
- `docs/POLITICAS_Y_PRIORIDADES.md`: reglas editoriales y criterios de creadores.
- `tests/static.test.cjs`: pruebas locales de integridad del kit.
- `.env.example` y `.gitignore.example`: plantillas de configuración, sin secretos.

## Regla crítica antes de ejecutar migraciones
Los proyectos Supabase actualmente visibles por la conexión de ChatGPT son de ADRS; **no son BLOXFORGE**. La organización del compañero `blox-forge's Org` todavía devuelve falta de permisos al conector actual. Su `organization_id` es `zwiwvtqcpckuashtaajm`, que NO es un project ref. Por tanto, **no se ha aplicado ningún SQL**.

Para resolver: el usuario acepta la invitación al org en Supabase y verifica el panel; Copilot inicia sesión con la sesión local autorizada y lee el project ref concreto. Solo después compara las tablas y propone migración de desarrollo. No copies tokens de invitación ni secretos a chats o Git.

## Alcance de esta etapa
Registro real, usuarios, roles, solicitudes, revisión humana y cursos GRATUITOS. No pagos en vivo, no Stripe Connect todavía, no uploads sin verificación, no mensajería adultos-menores.

## Validación
Desde la carpeta del kit: `node --test tests/static.test.cjs`.
Son tests estáticos; NO validan que RLS funcione en un Supabase real. Copilot debe probarlo con las sesiones adecuadas.
