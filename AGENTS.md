# Entrada de agente — pkg-ts-design-system

## Propósito local

Paquete compartido de componentes, tokens y utilidades de interfaz FaruTech.

Fuentes locales que debes revisar según la tarea: `README.md`, `src/frontend/README.md`, documentación y Storybook. Confirma API, estilos y consumidores antes de cambiar un componente.

La fuente de verdad sobre este repositorio es su `README.md` y, si existe, `repository.yaml`.
Este directorio es un repositorio Git independiente, aunque comparta carpeta con otros repos.

## Dónde buscar contexto

- Para trabajo FaruTech, lee `../engineering-hub/AGENTS.md` y `../engineering-hub/docs/09_ai/README.md`.
- Para estándares, skills o cambios entre repos, lee `../engineering-hub/docs/09_ai/06-ecosystem-workspace.md` y usa `../engineering-hub/ecosystem.yaml` para ubicar dependencias.
- Para cambios multi-repo, carga la skill `../engineering-hub/.agents/skills/cross-repo-change/SKILL.md` y lee el `AGENTS.md` de cada repo afectado.
- Para componentes, tokens o temas, combina `../engineering-hub/.agents/skills/frontend-change/SKILL.md` y `../engineering-hub/.agents/skills/design-taste-frontend/SKILL.md` junto con la documentación real de este design system.
- Lee las reglas locales de `.agents/rules/` solo cuando apliquen al archivo o producto que cambias.
- Si el Hub no está disponible, limita el trabajo a inspección de solo lectura y reporta el contexto faltante.

## Validación

- Consulta scripts del paquete, tests y workflows. Para cambios visuales, revisa también las historias/validaciones visuales configuradas.
- Actualiza la documentación local afectada. Informa validaciones ejecutadas y resultados; no afirmes que una prueba pasó si no se ejecutó.
- Mantén los cambios dentro del alcance, conserva trabajo previo y no expongas secretos.
- No publiques artefactos, despliegues ni migres datos sin autorización explícita.
