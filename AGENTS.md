# Easymailing Zendesk Theme

Tema del Help Center de Easymailing (Zendesk Guide, `ayuda.easymailing.com`). Plantillas Handlebars + assets; sin proceso de build.

## Estructura

- `templates/` — plantillas Handlebars (home, article, section, search, …)
- `style.css` / `script.js` — estilos y JS globales del tema
- `assets/` — imágenes y ficheros que se suben con el tema
- `settings/` — grupos de ajustes visibles en el editor de Guide
- `translations/` — textos del tema por idioma
- `manifest.json` — metadatos y settings del tema (`api_version: 1`)

## Flujo de trabajo

- No hay build ni dependencias: los archivos se editan tal cual.
- Preview/subida: `npx @zendesk/zcli themes preview|import|update` o desde Guide Admin → Customize design.
- La KB pública se puede auditar sin token vía la API del Help Center: `https://ayuda.easymailing.com/api/v2/help_center/es/articles.json` (también `categories.json`, `sections.json`).

## Reglas

- Cambios de contenido de artículos NO van en este repo (se gestionan en Zendesk); aquí solo plantillas, estilos y settings del tema.
