# @farutech/design-system (v1.1.1)

Biblioteca oficial de componentes UI, tokens tematizables, componentes CRUD, hooks y utilidades de **FaruTech**.

---

## 📦 Instalación

Configura tu archivo `.npmrc` para autenticarte contra GitHub Packages:

```ini
@farutech:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Instala el paquete en tu proyecto:

```bash
npm install @farutech/design-system@1.1.1
```

---

## 🚀 Configuración y Uso

### 1. Importar estilos globales y Provider
En el punto de entrada de tu aplicación (`main.tsx` o `App.tsx`):

```tsx
import React from 'react';
import { DesignSystemProvider } from '@farutech/design-system';
import '@farutech/design-system/styles.css';

export function Root() {
  return (
    <DesignSystemProvider colorMode="dark">
      <App />
    </DesignSystemProvider>
  );
}
```

---

## 🧩 Guía de Componentes Principales

### 1. Paginación Estandarizada (`CrudPagination`)
Control completo de paginación para tablas densas y vistas operativas:

```tsx
import { CrudPagination } from '@farutech/design-system';

<CrudPagination
  currentPage={paginaActual}
  totalPages={totalPaginas}
  perPage={filasPorPagina}
  total={totalRegistros}
  onPageChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
  perPageOptions={[10, 25, 50, 100]}
  onPerPageChange={(nuevoTamano) => {
    setFilasPorPagina(nuevoTamano);
    setPaginaActual(1);
  }}
/>
```

### 2. Tarjetas (`Card` y `CardHeader`)
Contenedor modular con paddings predefinidos y compatibilidad de clases:

```tsx
import { Card, CardHeader, Button } from '@farutech/design-system';

<Card
  padding="md"
  header={
    <CardHeader
      title="Gestión de Documentos"
      subtitle="Parámetros y numeración consecutiva Novasoft"
      action={<Button variant="primary" size="sm">+ Nuevo</Button>}
    />
  }
>
  <p className="text-sm text-slate-300">Contenido del panel...</p>
</Card>
```

### 3. Modales Accesibles (`Modal`)
Gestión automática de foco, teclado y clic exterior:

```tsx
import { Modal, Button, Input } from '@farutech/design-system';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Autorización de Excepción"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button variant="primary" type="submit" form="auth-form">Autorizar</Button>
    </>
  }
>
  <form id="auth-form" onSubmit={handleAuth}>
    <Input label="PIN de Autorización" type="password" required fullWidth />
  </form>
</Modal>
```

---

## 🎨 Storybook & Visual Tests

Storybook 10 está configurado con soporte para:
* **Controls**: Manipulación reactiva de propiedades.
* **Viewports**: Simulación responsiva de móvil, tableta, laptop y escritorio.
* **A11y**: Auditoría de contraste y reglas WCAG en tiempo real.
* **Chromatic**: Pruebas de regresión visual en CI (`.github/workflows/chromatic.yml`).

```bash
# Modo desarrollo local
npm run storybook

# Generar documentación estática
npm run build-storybook
```

---

## 📋 Control de Cambios (Changelog v1.1.1)

* **Paginación**: Soporte configurable para `perPageOptions` en `CrudPagination` y navegación por teclado.
* **Tipos**: Exportación explícita de `className` y `style` en `CardProps`.
* **DTS**: Corrección de resolución de imports de React en archivos `.d.ts` para consumidores externos.
* **Storybook**: Integración de addon Chromatic y corrección de codificación UTF-8 en documentación MDX.
