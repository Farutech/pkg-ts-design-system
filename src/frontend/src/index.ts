/**
 * @farutech/design-system
 * Sistema de diseño oficial de Farutech — Componentes UI, tokens, layouts y hooks reutilizables.
 */

// Tokens y utilidades de estilo
export * from './tokens/index'

// Componentes UI de catálogo completo (51 componentes)
export * from './components/ui/index'

// Primitivas de contenido y animación
export { Eyebrow, SectionHeading, type EyebrowProps, type SectionHeadingProps } from './components/Content/index'
export { Reveal, type RevealProps } from './components/Reveal/index'

// Primitivas Headless y Sistema de Iconos
export * from './primitives/index'

// Provider, configuración y temas
export {
  ConfigProvider,
  DesignSystemProvider,
  useConfig,
  useDesignSystem,
  useDensity,
  useVirtualizationConfig,
  useLocale,
  useDirection,
  useBrandConfig,
  type ConfigProviderProps,
  type DesignSystemProviderProps,
  type LinkComponent,
  type BrandConfig,
  type BrandUserConfig,
  type VirtualizationConfig,
  type ColorMode,
  type Direction,
} from './providers/DesignSystemProvider'

// Componentes CRUD
export * from './components/crud/index'

// Componentes de Layout
export * from './components/layout/index'

// Componentes de Navegación
export * from './components/navigation/index'

// Componentes Básicos (Toast, Notification, Toggle)
export * from './components/basic/index'

// Pantallas y flujos de autenticación
export * from './auth-screens/index'

// Formularios estructurados y compuestos
export * from './components/forms/index'

// Seguridad y almacenamiento de credenciales
export * from './security/index'

// Internacionalización y localización dinámica
export * from './i18n/index'

// Estados de aplicación y páginas de sistema
export * from './components/pages/index'

// Hooks personalizados
export * from './hooks/index'

// Stores Zustand
export * from './store/index'
