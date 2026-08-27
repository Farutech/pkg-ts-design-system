# FaruTech — Design System

Design System de **FaruTech** — paquete compartido (privado; se publicará a
GitHub Packages cuando pase la validación de seguridad de TASK-202).

> Responsabilidad única: **fuente única de verdad** de componentes, tokens,
> estilos y patrones de UI de todos los frontends de FaruTech.

## Estado
- **Repo nuevo — aún sin código.** El inventario y reconciliación se ejecutan
  en **TASK-201** (REQ-DS-01/DS-04, spec en `docs/08`).
- Consumidores previstos: `Farutech/website`, `Farutech/admin`,
  `Farutech/intranet`.
- **No publicar el paquete** ni cambiar visibilidad antes de la validación de
  seguridad de TASK-202 (límite del plan maestro).

## Relación con otros repos
| Repo | Relación |
|---|---|
| `Farutech/website` | consumidor (sitio público) |
| `Farutech/admin` | consumidor (panel admin, TASK-301) |
| `Farutech/intranet` | consumidor (cuando se defina GAP-07) |
