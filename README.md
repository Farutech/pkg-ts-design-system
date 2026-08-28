# FaruTech — Design System

Componentes UI, tokens configurables y temas para los frontends de **FaruTech**
(`website`, `admin`, `intranet`). Un solo lugar donde un cambio de diseño se
aplica a todos los consumidores.

> Fuente única de verdad de componentes, tokens, estilos y patrones de UI de
> todos los frontends de FaruTech.

## Instalación (npm público — sin credenciales)

```bash
npm install @farutech/design-system
```

Importa solo lo que usas (tree-shaking por entrada de componente):

```tsx
import { Button } from '@farutech/design-system'
import '@farutech/design-system/styles.css'

export function CTA() {
  return <Button variant="primary" size="lg">Hablemos</Button>
}
```

Import individual de componente (máximo ahorro para `website`):

```tsx
import { Button } from '@farutech/design-system/components/Button'
```

## Tokens y temas

Los componentes consumen variables CSS (`--ft-*`) desde `tokens.css`; ninguno
fija valores de color/tipografía/espaciado. Tema oscuro incluido:

```tsx
import '@farutech/design-system/tokens.css'
// <html data-theme="dark"> aplica el tema oscuro
```

Cada app puede sobrescribir variables o definir su propio bloque `:root` sin
fork del paquete.

## Estado

- Catálogo en construcción: 8/51 componentes reconciliados (Button, Badge/Tag/
  StatusBadge, Input, Alert, Spinner, Content, Reveal). Checklist: `MIGRATION.md`.
- Consumidores previstos: `Farutech/website`, `Farutech/admin`, `Farutech/intranet`.

## Desarrollo

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # vite build + declaraciones .d.ts + tokens.css
```

El `prepublishOnly` corre typecheck + tests + build automáticamente.

## Publicación

Público en el registro npm (npmjs.com), sin requerir credenciales a los
consumidores. El repo fuente `Farutech/design-system` permanece privado.

```bash
npm version patch && npm publish   # requiere: cuenta/scope @farutech + token
```

O vía tag `v*` (workflow `.github/workflows/publish.yml` con secreto `NPM_TOKEN`).

## License

UNLICENSED (© FaruTech) — todo uso externo requiere autorización explícita.
