# Estado verificado — 18/10/2026

- El proyecto local visto en VS Code contiene `index.html`, `script.js`, `style.css`, `auth-client.js`, `server.js`, `package.json`, pruebas y archivos gráficos. La vista de login dice **«Prototype local»**; NO es evidencia de Auth Supabase real.
- Repositorio público del compañero `blox-forge/BloxForge` contiene index.html de 99.752 caracteres con Kubo, XP y guardado local; no tiene referencias a Supabase. El proyecto local es otra versión: NO sobrescribir.
- La organización Supabase del compañero `blox-forge's Org` (ID org `zwiwvtqcpckuashtaajm`) se deduce de una invitación de colaboración Supabase, pero el conector actual responde sin permiso. Se desconoce el project ref. NO INVENTAR.
- Los proyectos Supabase visibles: `nybpsknmavsusmesjsuz` (contiene tablas y migraciones ADRS) y `grtqjlkcjswmlqkhrzcr` (ADRS inactivo). NO USAR para BLOXFORGE.
- El SQL de este kit es una PROPUESTA de fase 1; no ejecutada ni validada contra PostgreSQL.
- No se han activado Stripe ni pagos, ni se han migrado cursos/progreso reales.

## Pregunta a Copilot sobre fuente canónica
Elegir opción **1: mantener ambas versiones intactas y comparar procedencia/paridad**. El código local es prioritario para inspección, no se debe sustituir sin confirmación.

## Qué debe decir Copilot si falta acceso al proyecto Supabase
«No puedo confirmar el project ref de BLOXFORGE. Solo conozco la organización `blox-forge's Org`, pero el acceso concreto al proyecto aún no está disponible. No usaré ADRS. Continúo con integraciones locales y pruebas estáticas hasta tener un ref verificado.»
