# 🏗️ Arquitectura del Sistema

## 📐 Visión General

FaruTech Admin Panel es una aplicación empresarial construida con arquitectura moderna, escalable y mantenible.

### Stack Tecnológico

```
├── ⚛️  React 19.1.1          # UI Framework
├── 📘 TypeScript 5.x         # Type Safety
├── ⚡ Vite 7.2.2             # Build Tool
├── 🎨 Tailwind CSS 3.x       # Styling
├── 🔄 React Router 7.x       # Routing
├── 🗄️  Zustand 5.x            # State Management
├── 🔍 React Query 5.x        # Server State
├── 📊 Chart.js & Recharts    # Visualizations
└── 🎭 Framer Motion 12.x     # Animations
```

---

## 📁 Estructura del Proyecto

La convención corporativa mantiene todo el código ejecutable del Design System dentro de `src/frontend/`. La raíz de `src/frontend/` es el paquete npm y contiene su código fuente en `src/`, Storybook, pruebas, configuraciones y documentación.

```text
pkg-ts-design-system/
├── src/
│   └── frontend/
│       ├── .storybook/              # Configuración y addons de Storybook
│       ├── docs/                    # Documentación técnica
│       ├── public/                  # Assets servidos por Storybook
│       ├── scripts/                 # Utilidades de mantenimiento del paquete
│       ├── src/                     # Código fuente, stories y pruebas
│       │   ├── auth-screens/        # Flujos y pantallas de autenticación
│       │   ├── components/          # Componentes UI, layout, navegación y CRUD
│       │   ├── config/              # Configuración de la librería
│       │   ├── contexts/            # Contextos React
│       │   ├── hooks/               # Hooks reutilizables y sus tests
│       │   ├── providers/           # DesignSystemProvider y contratos
│       │   ├── shims/               # Alias de runtime para builds externos
│       │   ├── store/               # Stores Zustand y sus tests
│       │   ├── stories/             # Stories y pruebas de componentes
│       │   ├── styles/              # CSS de componentes y estilos base
│       │   ├── tokens/              # Tokens y preset de Tailwind
│       │   ├── utils/               # Utilidades internas
│       │   ├── index.ts             # Entry point público
│       │   ├── styles.css           # Entry point de estilos
│       │   └── test-setup.ts        # Setup de Vitest/jsdom
│       ├── dist/                    # JS, declaraciones y estilos publicados
│       ├── package.json             # Contrato npm y scripts
│       ├── package-lock.json        # Lockfile reproducible
│       ├── tsconfig.json            # Type-check de src + Storybook
│       ├── tsconfig.build.json      # Declaraciones de publicación
│       ├── vite.config.ts           # Build de librería y entry points públicos
│       ├── vitest.config.ts         # Proyectos unit y Storybook
│       └── tailwind.config.js       # Tokens y contenido de Tailwind
```

---

## 🔄 Flujo de Datos

### Arquitectura en Capas

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  (React Components, Pages, UI)                       │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Pages    │  │ Layout   │  │ UI       │          │
│  │          │  │          │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   Business Logic Layer               │
│  (Custom Hooks, Services)                            │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ useAuth  │  │ useApi   │  │ useCrud  │          │
│  │          │  │          │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   State Management Layer             │
│  (Zustand Stores, React Query Cache)                 │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ auth     │  │ module   │  │ theme    │          │
│  │ Store    │  │ Store    │  │ Store    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   Data Layer                          │
│  (API Services, LocalStorage, SessionStorage)        │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ REST API │  │ Storage  │  │ Cache    │          │
│  │          │  │          │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
Login Page
    ↓
useAuth() hook
    ↓
api.post('/auth/login')
    ↓
authStore.setTokens()
    ↓
localStorage/sessionStorage
    ↓
Navigate to Dashboard
    ↓
RequireAuth HOC verifies token
    ↓
Load user data via React Query
    ↓
Render protected content
```

### Flujo de Navegación entre Módulos

```
Usuario selecciona módulo en ModuleSwitcher
    ↓
moduleStore.setCurrentModule(moduleId)
    ↓
useMenu() detecta cambio de módulo
    ↓
getMenu(moduleId) con caché de 5min
    ↓
Sidebar muestra nuevo menú
    ↓
Navigator navega a ruta del módulo
    ↓
ContentSuspense muestra LogoSpinner
    ↓
React lazy-load carga componente de página
    ↓
Página se renderiza con fade-in
```

**IMPORTANTE:** El módulo activo NO cambia automáticamente cuando navegas a diferentes rutas. Solo cambia cuando el usuario hace clic explícitamente en el ModuleSwitcher. Esto permite rutas compartidas entre módulos sin perder contexto. Ver [MODULE_STABILITY_FIX.md](./MODULE_STABILITY_FIX.md).

---

## 🎨 Patrones de Diseño

### 1. **Compound Components**

```tsx
// Componentes que trabajan juntos de forma composable
<Card>
  <CardHeader title="Usuarios" />
  <CardBody>
    <DataTable data={users} />
  </CardBody>
  <CardFooter>
    <Button>Ver Más</Button>
  </CardFooter>
</Card>
```

### 2. **Render Props**

```tsx
// Componente que delega renderizado
<DataTable
  data={users}
  columns={columns}
  renderRow={(user) => (
    <CustomRow user={user} onEdit={handleEdit} />
  )}
/>
```

### 3. **Higher-Order Components (HOC)**

```tsx
// Envolver componentes con lógica compartida
const ProtectedPage = RequireAuth(DashboardPage)

// Uso
<Route path="/dashboard" element={<ProtectedPage />} />
```

### 4. **Custom Hooks**

```tsx
// Lógica reutilizable en hooks
function useUserManagement() {
  const { items: users, create, update, remove } = useCrud('/api/users')
  const { user: currentUser } = useAuth()
  
  return { users, create, update, remove, currentUser }
}
```

### 5. **Suspense Boundaries**

```tsx
// Cargas granulares sin bloquear toda la UI
<MainLayout>
  <ContentSuspense fallback={<LogoSpinner />}>
    <LazyLoadedPage />
  </ContentSuspense>
</MainLayout>
```

---

## 🔐 Seguridad

### Autenticación

- ✅ JWT Tokens (access + refresh)
- ✅ CSRF Protection
- ✅ HTTP-only cookies para refresh token (producción)
- ✅ Remember me con localStorage/sessionStorage
- ✅ Auto-refresh de tokens
- ✅ Logout automático al expirar

### Autorización

- ✅ Role-based access control (RBAC)
- ✅ Permission-based features
- ✅ Protected routes con RequireAuth
- ✅ Menu filtering por permisos
- ✅ Component-level permissions

### Comunicación

- ✅ HTTPS only (producción)
- ✅ CORS configurado
- ✅ Headers de seguridad
- ✅ Input sanitization
- ✅ XSS protection

---

## ⚡ Performance

### Code Splitting

```tsx
// Lazy loading de páginas
const UsersPage = lazy(() => import('./pages/users/UsersPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))

// Resultado: Chunks separados
dist/assets/UsersPage-ABC123.js        12.5 kB
dist/assets/DashboardPage-DEF456.js    15.2 kB
```

### Bundle Optimization

- ✅ Tree shaking automático (Vite)
- ✅ Minification en producción
- ✅ Gzip compression
- ✅ CSS purging (Tailwind)
- ✅ Image optimization

**Métricas:**
- Initial bundle: ~375 KB
- Lazy chunks: 5-210 KB cada uno
- Total descargado incrementalmente

### Caching Strategy

```tsx
// React Query cache
queryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  }
})

// Menu cache (custom)
const menuCache = new Map<string, MenuCache>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
```

### Memoization

```tsx
// useMemo para cálculos costosos
const filteredData = useMemo(() => {
  return data.filter(item => /* filter logic */)
}, [data, filters])

// useCallback para funciones estables
const handleClick = useCallback(() => {
  // logic
}, [dependencies])
```

---

## 🧪 Testing Strategy

### Unit Tests

```bash
npm run test
```

Cubrir:
- ✅ Componentes UI
- ✅ Custom hooks
- ✅ Utilidades
- ✅ Stores

### Integration Tests

- ✅ Flujos de autenticación
- ✅ CRUD operations
- ✅ Navegación entre módulos
- ✅ Formularios complejos

### E2E Tests

```bash
npm run test:e2e
```

Escenarios:
- Login → Dashboard → CRUD operations → Logout
- Navegación completa por módulos
- Responsive behavior

---

## 📱 Responsive Design

### Breakpoints (Tailwind)

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach

```tsx
// Diseñar primero para móvil
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>

// Sidebar colapsable en móvil
const { isMobile } = useSidebarStore()

{isMobile && isOpen && <Overlay />}
```

### Touch-Friendly

- ✅ Botones de 44x44px mínimo
- ✅ Espaciado generoso en móvil
- ✅ Gestos swipe en carruseles
- ✅ Drawer en lugar de modal en móvil

---

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

Output:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js       # Main bundle
│   ├── index-[hash].css      # Styles
│   ├── [page]-[hash].js      # Lazy chunks
│   └── vendor-[hash].js      # Dependencies
└── Logo.png
```

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_NAME=FaruTech Admin
VITE_VERSION=1.0.0
```

### Hosting

Opciones recomendadas:
- **Vercel**: Deploy automático desde Git
- **Netlify**: SPA routing configurado
- **AWS S3 + CloudFront**: Escalable
- **Docker**: Nginx container

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📊 Monitoring

### Error Tracking

```tsx
// ErrorBoundary captura errores
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Enviar a servicio de logging
    logError(error, errorInfo)
  }}
>
  <App />
</ErrorBoundary>
```

### Analytics

```tsx
// Tracking de navegación
useEffect(() => {
  analytics.pageView(location.pathname)
}, [location])

// Tracking de eventos
const handleButtonClick = () => {
  analytics.event('button_click', {
    category: 'engagement',
    label: 'create_user'
  })
}
```

### Performance Monitoring

```tsx
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

---

## 🔄 Versionado

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  # Bug fix
1.0.0 → 1.1.0  # New feature
1.0.0 → 2.0.0  # Breaking change
```

### Changelog

Ver [CHANGELOG.md](../CHANGELOG.md) para historial completo de versiones.

---

## 📚 Recursos Adicionales

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

---

**FaruTech Admin Panel** - Arquitectura Moderna, Escalable y Mantenible

**Última actualización:** 18 de Noviembre, 2025
