# FaruTech — Design System

Este repositorio contiene el Design System oficial de FaruTech como paquete npm `@farutech/design-system`. El código ejecutable, Storybook, pruebas y configuración frontend viven bajo [`src/frontend/`](./src/frontend/).

## Desarrollo

Desde la raíz del repositorio:

```bash
cd src/frontend
npm ci
npm run typecheck
npm run lint -- --max-warnings 0
npm test
npm run build
npm run build-storybook
npm run storybook
```

El paquete se publica únicamente con los artefactos generados en `src/frontend/dist/`. La API pública y los ejemplos de consumo se documentan en [`src/frontend/README.md`](./src/frontend/README.md).

## Consumidores

Los frontends FaruTech consumen la dependencia publicada mediante npm; no deben enlazar rutas locales en configuración de producción. Consulte `engineering-hub/docs/02_standards/cloud-platform/06-packages-library.md` para la política de paquetes.

## Contrato del repositorio

- [`repository.yaml`](./repository.yaml) define el contrato de orquestación.
- `.github/` contiene los pipelines del repositorio.
- `.kilo/` no forma parte del paquete y no debe versionarse.
