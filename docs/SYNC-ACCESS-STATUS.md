# Estado de acceso y sincronización

Verificado el 20-10-2026 desde el workspace local.

## Git local y GitHub

- La carpeta `BLOXFORGE-idea-copy-20261018-1616` no contiene `.git`; no hay rama ni remotos locales que conservar.
- `gh auth status` no se pudo ejecutar: GitHub CLI (`gh`) no está instalado/disponible en PATH.
- `git clone https://github.com/blox-forge/BloxForge.git bloxforge-original-compare` falló por DNS/red: `Could not resolve host: github.com`. No se modificó el proyecto local.
- El conector confirma `blox-forge/BloxForge` (main público, permisos push informados) y `marcel380/BLOXFORGE` (main privado, permisos admin), pero no proporciona un checkout local para comparar/subir el árbol completo.
- Según la inspección anterior, el repo original contiene solamente `index.html`; no se debe sobrescribir main con la app local sin una rama/PR revisable.

Comandos de sincronización cuando esté disponible GitHub CLI y conectividad:

```powershell
gh auth status
git clone https://github.com/blox-forge/BloxForge.git bloxforge-original-compare
Set-Location bloxforge-original-compare
git switch -c codex/bloxforge-local-integration
# Copiar e integrar los archivos revisados desde la copia local, excluyendo .env,
# local-data, backups, node_modules y datos privados.
npm test
git status --short
git add <archivos-revisados>
git commit -m "Integrate BLOXFORGE application"
git push -u origin codex/bloxforge-local-integration
gh pr create --base main --head codex/bloxforge-local-integration
```

## Supabase

- El conector presenta solo la organización `marcelkharraz@gmail.com's Org`, ID `bbojmkbgarzrxqtkrrme`; no presenta `blox-forge's Org`.
- Proyecto activo `nybpsknmavsusmesjsuz`, nombre `marcelkharraz@gmail.com`: no está identificado como BLOXFORGE y sus tablas inspeccionadas corresponden a clientes/proyectos de otra aplicación. No usar.
- Proyecto `grtqjlkcjswmlqkhrzcr`, nombre `AI Dev Rescue Studio`: excluido expresamente. No usar.
- No se identificó un project ref de BLOXFORGE. No se aplicó SQL ni se leyeron/escribieron datos de ADRS.

Para continuar, conectar en Codex una cuenta/organización Supabase que muestre `blox-forge's Org` y volver a listar proyectos; verificar nombre, propietario, tablas y Auth antes de migrar.
