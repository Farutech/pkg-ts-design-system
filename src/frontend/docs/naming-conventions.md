# Estándares de Nomenclatura del Proyecto (Naming Conventions)

Este documento establece las directrices estrictas y canónicas de nomenclatura para directorios, archivos, componentes, módulos, pruebas y documentación en el FaruTech Design System (`@farutech/design-system`).

---

## 1. Directorios (`kebab-case` o `lowercase`)
Todos los directorios a lo largo de todo el repositorio deben escribirse en minúsculas continuas o separadas por guión (`kebab-case`). **Nunca** en PascalCase o camelCase.

- **Código fuente**:
  - `src/components/ui/`
  - `src/components/layout/`
  - `src/components/forms/`
  - `src/components/crud/`
  - `src/components/content/`
  - `src/components/reveal/`
  - `src/primitives/field-shell/`
  - `src/primitives/icon/`
  - `src/tokens/`
  - `src/hooks/`
  - `src/store/`
  - `src/utils/`
  - `src/styles/`
  - `src/auth-screens/`
- **Pruebas**:
  - `tests/unit/components/ui/`
  - `tests/unit/hooks/`
  - `tests/unit/store/`
  - `tests/unit/primitives/`
- **Historias de Storybook**:
  - `stories/inputs/`
  - `stories/data-display/`
  - `stories/feedback/`
- **Documentación**:
  - `docs/`
  - `docs/hooks/`
  - `docs/components/`
  - `docs/stores/`

---

## 2. Archivos de Componentes React (`PascalCase.tsx`)
Todos los componentes de interfaz o primitivas de UI en React deben usar `PascalCase.tsx`:
- `Button.tsx`
- `Input.tsx`
- `FieldShell.tsx`
- `DataTable.tsx`
- `CRUDPage.tsx`
- `IconSlot.tsx`
- `DesignSystemProvider.tsx`

---

## 3. Archivos de Hooks, Utilidades, Stores y Tipos (`camelCase.ts` o `kebab-case.ts`)
- **Hooks de React**: Prefijo `use` en `camelCase.ts` (ej. `useDebounce.ts`, `useMaskedValue.ts`, `usePagination.ts`).
- **Utilidades**: `camelCase.ts` o `kebab-case.ts` (ej. `cn.ts`).
- **Stores de Zustand**: Sufijo `Store` en `camelCase.ts` (ej. `toastStore.ts`, `themeStore.ts`).
- **Tokens y Tipos**: `kebab-case.ts` o `camelCase.ts` descriptivo (ej. `tokens.ts`, `input.ts`, `input-types.ts`, `types.ts`).
- **Scripts de Node/Automatización**: `kebab-case.mjs` o `kebab-case.ts` (ej. `verify-exports.mjs`, `patch-storybook-vitest-store.mjs`).

---

## 4. Archivos de Pruebas Unitarias (`*.test.ts` / `*.test.tsx`)
Deben reflejar con precisión el artefacto bajo prueba y ubicarse en `tests/unit/`:
- Para componentes: `<Componente>.test.tsx` (ej. `Input.test.tsx`, `ButtonAndIconSlot.test.tsx`).
- Para hooks: `<useHook>.test.ts` (ej. `useDebounce.test.ts`).
- Para stores: `<store>.test.ts` (ej. `toastStore.test.ts`).
- Para utilidades/tokens: `<modulo>.test.ts` (ej. `cn.test.ts`, `tokens.test.ts`).
- Archivo de configuración central de pruebas: `tests/setup.ts`.

---

## 5. Historias y Documentación de Storybook (`*.stories.tsx` / `*.mdx`)
- Historias de componentes: `<Componente>.stories.tsx` (ej. `Button.stories.tsx`, `Input.stories.tsx`).
- Documentos de Storybook: `<Tema>.mdx` (ej. `Introduction.mdx`, `Tokens.mdx`).

---

## 6. Documentación Técnica (`docs/*.md`)
- Todos los documentos internos en `docs/` deben usar **estrictamente `kebab-case.md`**:
  - `docs/architecture.md`
  - `docs/naming-conventions.md`
  - `docs/pkg-audit-and-integral-plan.md`
  - `docs/maintenance-and-architecture.md`
  - `docs/hooks/hooks-reference.md`
  - `docs/components/ui-components.md`
  - `docs/stores/stores-reference.md`
- Solo los archivos estándar de distribución y repositorio raíz mantienen mayúsculas canónicas:
  - `README.md`
  - `MIGRATION.md`
  - `PUBLISHING.md`
