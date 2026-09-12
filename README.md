# FaruTech — Design System

[![npm](https://img.shields.io/badge/npm-v1.0.3-CB3837?logo=npm)](https://github.com/orgs/Farutech/packages)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

Componentes UI, tokens configurables y temas oficiales para todos los frontends de **FaruTech** (`website`, `intranet`, `kronix`, `cli-*`).
Fuente única de verdad de componentes, tokens, estilos y patrones de interfaz de usuario de FaruTech.

---

## 📦 Instalación vía GitHub Packages

Este paquete se publica exclusivamente en el registro corporativo de **GitHub Packages**:

### 1. Configurar `.npmrc` en tu proyecto
Crea o edita un archivo `.npmrc` en el frontend consumidor:

```ini
@farutech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> **Nota para desarrollo local:** Puedes definir `GITHUB_TOKEN` en tu archivo `.env` o en tu archivo global `~/.npmrc` con un Personal Access Token (PAT) de GitHub con alcance `read:packages`.

### 2. Instalar el paquete

```bash
npm install @farutech/design-system@1.0.3
```

---

## 🎨 Uso de Componentes y Estilos

### Importación global
Importa componentes y estilos CSS semánticos:

```tsx
import { Button, Alert, Badge } from '@farutech/design-system'
import '@farutech/design-system/styles.css'

export function HeroBanner() {
  return (
    <div className="p-6">
      <Alert variant="info" title="Bienvenido a FaruTech">
        Plataforma empresarial de ingeniería.
      </Alert>
      <Button variant="primary" size="lg" className="mt-4">
        Comenzar
      </Button>
    </div>
  )
}
```

### Pantallas Ricas de Autenticación (Auth Screens)
Incluye las pantallas completas de inicio de sesión y registro corporativo con diseño dual (split de dos columnas), medidor interactivo de fortaleza de contraseñas y panel de marca:

```tsx
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '@farutech/design-system/auth-screens'

export function LoginPage() {
  return (
    <LoginScreen 
      onLogin={async (credentials) => {
        await authService.login(credentials)
      }}
      logoUrl="/assets/Logo_Full.png"
    />
  )
}
```

---

## 🌈 Tokens y Sistema de Temas HSL

Los componentes consumen variables CSS (`--ft-*`) basadas en el espacio HSL:
- Paleta semántica: Primary (`--ft-primary-h`, `--ft-primary-s`, `--ft-primary-l`), Secondary, Accent, Dark, Light.
- Modo claro y modo oscuro nativos (`<html data-theme="dark">`).
- Tipografía corporativa (Inter / Outfit) y radios de curvatura consistentes.

---

## 🛠️ Desarrollo y Contribución

```bash
# 1. Instalar dependencias
npm install

# 2. Type-checking
npm run typecheck

# 3. Pruebas unitarias
npm test

# 4. Compilar paquete (dist/ con declaraciones .d.ts y styles.css)
npm run build
```

---

## 🚀 Pipeline de Publicación Automatizada (CI/CD)

El paquete se compila y publica automáticamente a GitHub Packages mediante GitHub Actions en `.github/workflows/publish-npm.yml` al crear un tag de versión:

```bash
git tag v1.0.3
git push origin v1.0.3
```

---

## 📄 Licencia

PROPRIETARY © 2026 FaruTech. Todos los derechos reservados.
