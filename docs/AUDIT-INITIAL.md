# Auditoría inicial de BLOXFORGE

Fecha: 2026-10-20

## Alcance verificado

- Aplicación web vanilla: `index.html`, `style.css`, `script.js` y recursos gráficos.
- Backend Node.js sin framework en `server.js`; almacenamiento local JSON bajo `local-data/`.
- Autenticación local propia: hash scrypt, sesión en memoria y cookie HttpOnly/SameSite.
- Adaptador Supabase y SQL de marketplace presentes como preparación, no evidencia de conexión activa.
- Pruebas Node integradas disponibles en `auth.test.js`, `validate-content.test.js` y `static.test.cjs`.
- Recursos duplicados entre `assets/` y `public/images/courses/`; el backend actual sirve lista permitida desde la raíz.

## Hallazgos importantes

1. El directorio de trabajo no contiene `.git`; no se puede verificar rama, remotos, historial ni crear un respaldo Git confiable.
2. No se encontró un archivo `AGENTS.md` dentro del workspace. El documento externo RTK no fue accesible desde el sandbox.
3. `server.js` enlaza a `127.0.0.1` y su backend local no es un destino de producción escalable.
4. El origen CSRF está fijado a puerto local; producción requerirá una lista de orígenes configurada por ambiente.
5. Supabase no está conectado por defecto: ejemplos y adaptador apuntan a tablas `bf_*`, sin evidencia de proyecto/organización verificados.
6. La raíz mezcla aplicación, SQL, tests y documentos con sufijos `(1)`; reorganizar sin actualizar pruebas/rutas puede romper la app.
7. Varias etiquetas se muestran con mojibake en terminal. Hay que validar encoding antes de normalizar archivos.

## Protección y límites

No se modificó ninguna base remota, no se aplicaron migraciones, no se subió código y no se publicó el sitio. No se creó un backup verificable porque el workspace carece de `.git` y el sandbox solo permite escritura dentro de esta carpeta; los archivos se conservaron en su ubicación.

## Siguiente paso seguro

Crear/seleccionar un repositorio Git canónico y guardar un snapshot antes de refactorizar. Luego comparar contra `blox-forge/BloxForge`, identificar Supabase por nombre y organización, y solo después diseñar una migración no destructiva. Mantener pagos desactivados.
