# 🏛️ Guía de Arquitectura, Principios y Mantenimiento — `@farutech/design-system`

Esta guía establece los principios de ingeniería, patrones de diseño y procedimientos operativos para garantizar que `@farutech/design-system` se mantenga **limpio, mantenible, extensible y testeable** a lo largo de su ciclo de vida.

---

## 1. Paradigma Arquitectónico: Domain-Driven UI & Layered Architecture

El Design System no es una colección desordenada de componentes, sino una arquitectura por capas estructurada bajo los conceptos de **Domain-Driven Design (DDD)** adaptados al frontend:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 5: Application Patterns & Templates (CRUDPage, AppShell, Pages) │
├────────────────────────────────────────────────────────────────────────┤
│  Layer 4: Composite Components (DataTable, FormWizard, Upload, Pickers)│
├────────────────────────────────────────────────────────────────────────┤
│  Layer 3: UI Primitives & Elements (Button, Input, Select, Badge)      │
├────────────────────────────────────────────────────────────────────────┤
│  Layer 2: Headless Primitives & Hooks (Portal, FocusTrap, useStorage)  │
├────────────────────────────────────────────────────────────────────────┤
│  Layer 1: Foundations & Tokens (Colors, Typography, Spacing, Density)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Bounded Contexts en el Design System

1. **Foundations (`src/tokens/`)**:
   - Define el vocabulario visual de la marca y de los tenants: colores semánticos (HaroTech, Clientes, Marca Blanca), escalas tipográficas, radios, elevaciones y el motor de **Densidad** (`comfortable`, `compact`, `dense`).
2. **Headless Primitives (`src/primitives/`)**:
   - Aislamiento de accesibilidad y comportamiento DOM puro sin estilos fijos.
   - `Portal`: Renderizado fuera del árbol DOM respetando SSR e hidratación.
   - `FocusTrap`: Contención de foco accesible para modales y draweres.
   - `ClickOutside`: Detección agnóstica de interacciones externas.
   - `IconAdapter`: Inversión de dependencias para iconos (sustituible vía `DesignSystemProvider`).
3. **Selection & Data Engine (`src/components/ui/`, `src/hooks/`)**:
   - `ListboxCore`: Lógica de selección, foco de teclado ARIA APG y virtualización.
   - `DataMapping<T>`: Desacopla la forma de los datos del componente visual.
   - `useAsyncDataSource`: Caché LRU, debounce, deduplicación y cancelación con `AbortController`.
4. **Forms Engine (`src/components/forms/`)**:
   - `FormField`: Contexto de accesibilidad compartida (`id`, `aria-describedby`, `aria-invalid`).
   - `FieldArray<T>`: Inserción, remoción y reordenamiento de colecciones dinámicas.
   - `FormWizard`: Asistente multi-paso con validación por etapas.
5. **Security & Session (`src/security/`)**:
   - `TokenStorage`: Aislamiento de almacenamiento (`memory`, `cookie`, `sessionStorage`, `localStorage`).
   - `SessionTimeoutDialog`: Prevención de expiración con cuenta regresiva accesible.
6. **Localization (`src/i18n/`)**:
   - `I18nProvider` y `useI18n`: Diccionarios tipados con interpolación de variables.

---

## 2. Principios SOLID Aplicados a Componentes React

### S — Single Responsibility Principle (SRP)
- **Cada componente o hook tiene un único propósito bien delimitado.**
- *Ejemplo*: `DataTable` no realiza peticiones HTTP; delega la orquestación a `useServerDataTable` o al consumidor. `Select` no implementa la lógica de listas desde cero; delega en `ListboxCore`. `Dropzone` solo captura y valida archivos; delega el renderizado de la lista a `FileList`.

### O — Open/Closed Principle (OCP)
- **Abierto a extensión, cerrado a modificación.**
- Los componentes se extienden mediante:
  1. **Slots nombrados**: `<CRUDPage slots={{ filterBar: ..., actions: ... }} />`.
  2. **Render-props**: `<EntityPicker renderItem={(item, selected) => ...} />`.
  3. **Inversión de dependencias**: Adaptador de iconos `IconAdapter` permite sustituir `@heroicons/react` por Lucide o FontAwesome sin tocar el código fuente del componente.
  4. **Sobrescritura de clases**: Uso de `cn()` con `tailwind-merge` para combinar estilos sin romper las variantes base.

### L — Liskov Substitution Principle (LSP)
- **Los componentes deben sustituir fielmente a sus primitivas HTML sin efectos secundarios.**
- Todos los componentes base (`Button`, `Input`, `Textarea`) extienden sus atributos nativos (`React.ButtonHTMLAttributes<HTMLButtonElement>`, etc.), preservando `ref`, `disabled`, `tabIndex`, `onFocus`, `onBlur`.

### I — Interface Segregation Principle (ISP)
- **Interfaces pequeñas, cohesivas y no forzar props innecesarias.**
- *Ejemplo*: `EntityPickerProps<T extends { id: string | number }>` solo exige que la entidad tenga un identificador. `DataMapping<T>` permite mapear cualquier estructura de datos a un contrato visual sin obligar a mutar los modelos de backend.

### D — Dependency Inversion Principle (DIP)
- **Los módulos de alto nivel no dependen de librerías concretas de bajo nivel; ambos dependen de abstracciones.**
- *Ejemplo*: Los componentes no hacen `import { CheckIcon } from '@heroicons/react/24/outline'`; consumen `Icon.Check` provisto por el contexto de `IconAdapter`. De esta forma, si el consumidor no usa Heroicons, la librería no rompe ni infla el bundle.

---

## 3. Protocolo de Mantenimiento y Creación de Nuevos Componentes

Para agregar o modificar un componente en el Design System, sigue estrictamente este flujo de 7 pasos:

```
1. Contrato TypeScript  ──>  2. Primitivas Headless / Lógica
          │                               │
          ▼                               ▼
3. Componente Accesible  ──>  4. Exportación en Barrels (ui/index.ts, index.ts)
          │                               │
          ▼                               ▼
5. Test Unitario (Vitest)──>  6. Historia Storybook (con prueba play)
          │                               │
          ▼                               ▼
7. Verificación: typecheck, build y pack:check
```

### Paso 1: Definir el Contrato TypeScript
- Ubicación: `src/components/ui/`, `src/components/forms/`, etc.
- Exportar la interfaz de props: `export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> { ... }`.
- Si involucra selección o cambio de valor, usar el **contrato único canónico**: `onValueChange: (value: T) => void`.

### Paso 2: Implementar Accesibilidad ARIA
- Añadir roles semánticos (`role="alert"`, `role="listbox"`, `role="dialog"`).
- Vincular mensajes de error y ayuda mediante `aria-describedby` y `aria-invalid`.
- Manejar foco con `FocusTrap` si es un modal o drawer.

### Paso 3: Exportar en Barrels
- Exportar en el `index.ts` de su directorio (ej. `src/components/forms/index.ts`).
- Exportar en la raíz de la librería `src/index.ts`.
- Si es un nuevo entry point público, añadirlo a `package.json` (`exports`) y `vite.config.ts` (`lib.entry`).

### Paso 4: Crear la Suite de Pruebas Unitarias
- Ubicación: En `__tests__/` adyacente o nombrado `MyComponent.test.tsx`.
- Cubrir: renderizado inicial, accesibilidad ARIA, interacción de teclado/clic, estados de error y deshabilitado.

### Paso 5: Crear la Historia en Storybook con Prueba `play`
- Ubicación: `src/stories/<categoria>/MyComponent.stories.tsx`.
- Usar la taxonomía oficial de títulos:
  - `4-Inputs/MyComponent`
  - `5-Overlays/MyComponent`
  - `6-Feedback/MyComponent`
  - `7-Helpers/MyComponent`
  - `8-Templates/MyComponent`
- Implementar una función `play: async ({ canvasElement }) => { ... }` con `@storybook/test` para que se ejecute en `npm run test:storybook`.

### Paso 6: Verificación de Calidad
Ejecutar la suite completa:
```bash
# 1. Verificación estricta de tipos:
npm run typecheck

# 2. Pruebas unitarias:
npm run test:unit

# 3. Pruebas de historias Storybook:
npm run test:storybook

# 4. Compilación del bundle de producción y hojas de estilo:
npm run build

# 5. Simulación de empaquetado npm:
npm run pack:check
```

---

## 4. Política de Versionamiento y Deprecación (SemVer)

El Design System sigue **SemVer (Semantic Versioning)** estricto:

- **PATCH (`x.x.1`)**: Corrección de bugs internos, mejoras de accesibilidad o ajustes de estilo que no cambian props ni comportamiento público.
- **MINOR (`x.1.0`)**: Nuevos componentes, nuevas props opcionales en componentes existentes, nuevas utilidades o hooks. Retrocompatible al 100%.
- **MAJOR (`2.0.0`)**: Eliminación de props deprecadas, renombramiento de contratos obligatorios o cambios en peerDependencies mínimas.

### Política de Deprecación
1. Toda prop o componente deprecado debe marcarse con `@deprecated` en JSDoc explicando el reemplazo.
2. En modo desarrollo (`process.env.NODE_ENV !== 'production'`), debe emitirse una advertencia `console.warn` con el prefijo `[pkg-ts-design-system]`.
3. Ninguna funcionalidad se elimina en una versión MINOR; se garantiza una ventana de deprecación mínima de una versión MINOR antes de ser retirada en la siguiente versión MAJOR.

---

## 5. Buenas Prácticas para el Consumo en Aplicaciones

1. **Envuelve tu App con `DesignSystemProvider`**:
   Configura el tema (`light`, `dark`), la densidad (`compact`, `comfortable`), y opcionalmente el adaptador de iconos.
2. **Utiliza `I18nProvider` para Localización**:
   Permite cambiar de idioma dinámicamente (`es`, `en`) o inyectar traducciones personalizadas de la empresa.
3. **Tokens Semánticos sobre Clases Ad-hoc**:
   Usa variables CSS (`var(--ft-color-primary)`, `var(--ft-radius-lg)`) o clases Tailwind temáticas (`bg-primary-600`, `text-slate-900`) en lugar de colores hex fijos para asegurar soporte multi-tenant y modo oscuro.
