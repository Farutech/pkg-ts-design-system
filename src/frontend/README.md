# @farutech/design-system

Paquete oficial de componentes, tokens, hooks, stores y pantallas de autenticación de FaruTech.

## Desarrollo

```bash
npm ci
npm run typecheck
npm run lint -- --max-warnings 0
npm test
npm run build
npm run build-storybook
npm run storybook
```

Storybook utiliza `src/` como código fuente y carga los assets desde `public/`. Las pruebas unitarias y de interacción están co-localizadas en `src/`.

## Consumo

```tsx
import { Button, Alert, Badge } from '@farutech/design-system'
import '@farutech/design-system/styles.css'
```

La documentación de arquitectura, componentes, hooks, stores y publicación está en [`docs/`](./docs/).