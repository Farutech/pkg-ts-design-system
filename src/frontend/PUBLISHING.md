# Guía Oficial de Versionamiento y Publicación: @farutech/design-system

Esta guía detalla cómo publicar y consumir el paquete `@farutech/design-system` como una biblioteca oficial versionada, evitando dependencias locales rígidas (`file:...`) y habilitando distribución continua en la organización.

---

## 1. Configuración de Credenciales y Tokens

Para publicar o descargar paquetes en registros privados como **GitHub Packages** o públicos como **npm**, se requiere un token de acceso seguro.

### Opción A: GitHub Packages (Recomendado para `@farutech`)
1. Ve a tu cuenta de GitHub: **Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic)**.
2. Genera un token nuevo con los scopes:
   - `write:packages` (publicar paquetes)
   - `read:packages` (descargar paquetes)
   - `repo` (si el repositorio de Farutech es privado)
3. En la raíz de tu proyecto o en tu entorno de desarrollo, crea o edita tu `.env`:
   ```bash
   NODE_AUTH_TOKEN=ghp_TU_TOKEN_DE_GITHUB_AQUI
   ```
4. El archivo `.npmrc` del paquete ya está configurado para interpolar este token:
   ```ini
   @farutech:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

### Opción B: Registro Público npm (npmjs.com)
1. En https://www.npmjs.com/, ve a **Access Tokens -> Generate New Token -> Automation**.
2. Define la variable `NODE_AUTH_TOKEN=npm_TU_TOKEN`.

---

## 2. Flujo de Trabajo para Publicar una Nueva Versión

### Paso 1: Validar Pruebas y Tipos
Antes de publicar, ejecuta la verificación completa del paquete:
```bash
npm run typecheck
npm run lint -- --max-warnings 0
npm test
npm run build
npm run build-storybook
```

### Paso 2: Incrementar la Versión Semántica
Usa el comando estándar de npm para actualizar `package.json` y generar el tag correspondiente:
```bash
# Parche (correcciones de bugs o estilos): 1.0.3 -> 1.0.4
npm version patch

# Menor (nuevos componentes o props compatibles): 1.0.3 -> 1.1.0
npm version minor

# Mayor (breaking changes de arquitectura): 1.0.3 -> 2.0.0
npm version major
```

### Paso 3: Publicar el Paquete
Ejecuta el script de publicación configurado:
```bash
# Para GitHub Packages:
npm run release:gh

# Para registro npmjs:
npm run release:npm
```

---

## 3. Cómo Consumir el Paquete en Aplicaciones (`prd-corp-website`, `admin`, etc.)

### Instalación vía Registro Versionado (Recomendado en Producción/CI)
1. En la aplicación consumidora (ej. `prd-corp-website`), crea o actualiza un archivo `.npmrc`:
   ```ini
   @farutech:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

2. Instala la versión deseada:
   ```bash
   npm install @farutech/design-system@^1.0.3
   ```

3. En el código (`src/main.tsx` o `App.tsx`):
   ```tsx
   import '@farutech/design-system/styles.css';
   import { Button, Badge, Card, StatsCard } from '@farutech/design-system';
   ```

### Desarrollo Local

El paquete se consume mediante el registro versionado. No se recomiendan rutas `file:` relativas entre repositorios, porque rompen la reproducibilidad de CI/CD y el contrato de paquetes FaruTech. Para una validación local, publica una versión canary desde este paquete o utiliza el registro corporativo configurado en el `.npmrc` del consumidor.
