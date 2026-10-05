# FaruTech Design System (@farutech/design-system)

<div align="center">

[![Version](https://img.shields.io/badge/version-1.1.6-6366f1.svg?style=flat-square)](https://github.com/Farutech/pkg-ts-design-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Storybook 10](https://img.shields.io/badge/Storybook-10.6-ff4785.svg?style=flat-square)](https://storybook.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat-square)](https://tailwindcss.com/)
[![Chromatic](https://img.shields.io/badge/Visual%20Tests-Chromatic-fc521f.svg?style=flat-square)](https://www.chromatic.com/)

**Sistema de Diseño Empresarial Oficial de FaruTech**  
*Componentes UI accesibles, tokens de diseño tematizables, componentes CRUD de alta densidad y documentación viva en Storybook para aplicaciones web, plataformas operativas y consolas de administración.*

</div>

---

## 📌 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura del Repositorio](#-estructura-del-repositorio)
3. [Instalación desde GitHub Packages](#-instalación-desde-github-packages)
4. [Inicio Rápido](#-inicio-rápido)
5. [Puntos de Entrada y Subpaths](#-puntos-de-entrada-y-subpaths)
6. [Componentes Destacados](#-componentes-destacados)
7. [Storybook y Pruebas Visuales](#-storybook-y-pruebas-visuales)
8. [Publicación y Versionado (x.x.y)](#-publicación-y-versionado-xxy)
9. [Scripts Disponibles](#-scripts-disponibles)

---

## 🌟 Visión General

`@farutech/design-system` es la biblioteca unificada de componentes frontend para todo el ecosistema FaruTech. Construido sobre **React 19 / 18**, **Tailwind CSS 3** y **TypeScript**, provee:

* **Accesibilidad WCAG 2.1 AA**: Navegación por teclado completa, roles ARIA y gestión de foco en modales y overlays.
* **Tema Oscuro de Alto Contraste**: Tokens calibrados para evitar textos oscuros sobre fondos oscuros, garantizando máxima legibilidad en estaciones de trabajo y pantallas táctiles POS.
* **Componentes CRUD Avanzados**: Paginación configurable (`CrudPagination`), tablas enriquecidas (`CRUDTable`), selectores predictivos (`LookupInput`) y layouts administrativos estandarizados.
* **Zero Boilerplate**: Todos los estilos compilados e integrados en un único archivo minificado `styles.css`.

---

## 📂 Estructura del Repositorio

El proyecto utiliza una arquitectura limpia desacoplando la configuración raíz del paquete frontend:

```text
pkg-ts-design-system/
├── .github/
│   └── workflows/
│       ├── publish-npm.yml       # Publicación automática en GitHub Packages (v*)
│       ├── chromatic.yml         # Pruebas visuales y hosting en Chromatic
│       └── test.yml              # CI de calidad (lint, typecheck, tests)
├── package.json                  # Definición raíz (v1.1.1)
├── README.md                     # Documentación principal del repositorio
└── src/
    └── frontend/                 # Paquete fuente compilable (@farutech/design-system)
        ├── .storybook/           # Configuración de Storybook 10 (main, preview, viewports)
        ├── dist/                 # Artefactos compilados para publicación (JS + .d.ts + CSS)
        ├── src/
        │   ├── components/       # UI, CRUD, Layout, Basic, Navigation, Forms, Pages
        │   ├── tokens/           # Tokens de color, tipografía, bordes y sombras
        │   ├── hooks/            # Hooks de paginación, modales, debounce, async
        │   ├── providers/        # DesignSystemProvider y contextos globales
        │   └── stories/          # Stories interactivas y documentación MDX
        ├── package.json          # Configuración del paquete npm (v1.1.1)
        └── vite.config.ts        # Bundler Rollup con 12 entry points y vite-plugin-dts
```

---

## 📦 Instalación desde GitHub Packages

El paquete `@farutech/design-system` se aloja en el registro de **GitHub Packages**.

### 1. Configurar `.npmrc`
En la raíz de tu proyecto consumidor o en tu directorio de usuario (`~/.npmrc`), configura el registro para el scope `@farutech`:

```ini
@farutech:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> **Nota**: Para entornos locales de desarrollo, genera un Personal Access Token (PAT) en GitHub con permisos de `read:packages`.

### 2. Instalar el paquete

```bash
# npm
npm install @farutech/design-system@1.1.6

# pnpm
pnpm add @farutech/design-system@1.1.6

# yarn
yarn add @farutech/design-system@1.1.6
```

---

## 🚀 Inicio Rápido

### 1. Importar Estilos y Provider

Envuelve tu aplicación en el `DesignSystemProvider` e importa la hoja de estilos global:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DesignSystemProvider } from '@farutech/design-system';
import '@farutech/design-system/styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignSystemProvider colorMode="dark">
      <App />
    </DesignSystemProvider>
  </React.StrictMode>
);
```

### 2. Usar Componentes

```tsx
import React, { useState } from 'react';
import { Card, Button, Badge, Input, Modal, CrudPagination } from '@farutech/design-system';
import { Search, Plus } from 'lucide-react';

export function ClientesVista() {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Directorio de Clientes</h2>
          <p className="text-xs text-slate-400">Administración general de terceros</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1 inline" /> Nuevo Cliente
        </Button>
      </div>

      <CrudPagination
        currentPage={pagina}
        totalPages={8}
        perPage={porPagina}
        total={78}
        onPageChange={(nuevaPag) => setPagina(nuevaPag)}
        perPageOptions={[10, 25, 50, 100]}
        onPerPageChange={(nuevoTam) => {
          setPorPagina(nuevoTam);
          setPagina(1);
        }}
      />
    </Card>
  );
}
```

---

## 🗺️ Puntos de Entrada y Subpaths

El paquete expone subpaths modulares para optimizar el tree-shaking:

| Subpath | Tipos (`.d.ts`) | Descripción |
| :--- | :--- | :--- |
| `@farutech/design-system` | `dist/index.d.ts` | Entrada principal con todos los componentes, utilidades y hooks |
| `@farutech/design-system/components/ui` | `dist/components/ui/index.d.ts` | Botones, inputs, modales, alertas, cards, badges |
| `@farutech/design-system/components/crud` | `dist/components/crud/index.d.ts` | `CrudPagination`, `CRUDTable`, filtros y barras de acción |
| `@farutech/design-system/components/layout` | `dist/components/layout/index.d.ts` | `AppShell`, `Sidebar`, `Navbar`, paneles y contenedores |
| `@farutech/design-system/components/navigation` | `dist/components/navigation/index.d.ts` | `Tabs`, `Breadcrumb`, `TopNav`, `Menu` |
| `@farutech/design-system/components/basic` | `dist/components/basic/index.d.ts` | Tipografía, divisores, contenedores básicos |
| `@farutech/design-system/tokens` | `dist/tokens/index.d.ts` | Tokens de colores, escalas, sombras y espaciados |
| `@farutech/design-system/hooks` | `dist/hooks/index.d.ts` | `useCRUD`, `usePagination`, `useModal`, `useDebounce`, etc. |
| `@farutech/design-system/providers` | `dist/providers/index.d.ts` | `DesignSystemProvider`, `ConfigContext`, `I18nProvider` |
| `@farutech/design-system/store` | `dist/store/index.d.ts` | Stores Zustand para tema, sidebar y notificaciones |
| `@farutech/design-system/styles.css` | N/A | Hoja de estilos Tailwind CSS minificada |

---

## 💎 Componentes Destacados

### `CrudPagination`
Diseñado para tablas de alta densidad y flujos administrativos:
* **Selector de tamaño de página configurable**: `perPageOptions={[10, 25, 50, 100]}`.
* **Navegación completa**: Primera página, Anterior, Siguiente, Última página y salto numérico directo.
* **Layout responsivo en 3 columnas**: Resumen a la izquierda, botones al centro y selector a la derecha.

### `Card`
* Contenedor versátil con soporte nativo para `header`, `footer`, `padding` (`none`, `sm`, `md`, `lg`) y efectos `hover`.
* Compatible con `className` y estilos personalizados sin conflictos de tipado.

### Modales y Overlays
* Accesibilidad garantizada con `FocusTrap`, soporte para tecla `Escape` y cierre por clic exterior.
* Tamaños predeterminados: `sm`, `md`, `lg`, `xl`, `full`.

---

## 🎨 Storybook y Pruebas Visuales

El repositorio cuenta con una suite completa de Storybook 10:

```bash
# Iniciar servidor interactivo de desarrollo (puerto 6006)
cd src/frontend
npm run storybook

# Generar bundle estático de producción
npm run build-storybook
```

### ¿Qué aporta la publicación de Storybook?
1. **Documentación Viva**: Permite a diseñadores, desarrolladores y QA inspeccionar el catálogo de componentes en tiempo real.
2. **Controles Interactivos**: Modificación en vivo de props (`variant`, `size`, `disabled`, `state`) para verificar cada variante.
3. **Viewports Responsivos Calibrados**:
   * Mobile Small (375px)
   * Mobile Large (414px)
   * Tablet iPad (768px)
   * Laptop (1280px)
   * Desktop (1440px)
4. **Pruebas de Regresión Visual (Chromatic)**:
   * Cada Pull Request o push a ramas principales ejecuta el workflow `.github/workflows/chromatic.yml`.
   * Chromatic captura snapshots pixel-perfect de cada story en múltiples viewports y detecta cualquier cambio no intencional antes de publicar.

---

## 🏷️ Publicación y Versionado (x.x.y)

El proyecto sigue **Semantic Versioning (SemVer)** con la convención `x.x.y`:
* `x` (Mayor): Cambios de arquitectura o breaking changes en la API.
* `x` (Menor): Nuevos componentes o capacidades retrocompatibles.
* `y` (Parche): Correcciones de errores, ajustes de diseño, mejoras de tipado y optimizaciones.

### Versión Actual: `1.1.1`

### Pasos para publicar una nueva versión:
1. **Verificar calidad**:
   ```bash
   cd src/frontend
   npm run check
   ```
2. **Crear y empujar el tag Git**:
   ```bash
   git tag v1.1.1
   git push origin v1.1.1
   ```
3. **Ejecución Automática**:
   El workflow de GitHub Actions [`.github/workflows/publish-npm.yml`](./.github/workflows/publish-npm.yml) se activa automáticamente:
   * Ejecuta el **Quality Gate** (`lint`, `test`, `build`).
   * Compila los artefactos de producción y genera los `.d.ts`.
   * Publica el paquete en **GitHub Packages** (`https://npm.pkg.github.com/@farutech/design-system`).

---

## 🛠️ Scripts Disponibles

Ejecutables desde `src/frontend/`:

| Comando | Acción |
| :--- | :--- |
| `npm run build` | Compila TypeScript, genera bundles JS y procesa `styles.css` con Tailwind |
| `npm run typecheck` | Valida tipos en todo el proyecto sin emitir archivos |
| `npm run lint` | Analiza el código con ESLint |
| `npm test` | Ejecuta las pruebas unitarias y de integración con Vitest |
| `npm run storybook` | Levanta el entorno interactivo de Storybook |
| `npm run build-storybook` | Genera la versión estática de Storybook en `storybook-static/` |
| `npm run check` | Pipeline completo local: typecheck + lint + build + build-storybook |
| `npm run pack:check` | Simulación en seco (`dry-run`) del tarball que se publicará |

---

<div align="center">

Desarrollado con ❤️ por **FaruTech Engineering** · 2026

</div>
