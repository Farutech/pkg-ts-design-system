/**
 * @farutech/design-system
 * Sistema de diseño oficial de Farutech — Componentes UI, tokens, layouts y hooks reutilizables.
 */

// Tokens y utilidades de estilo
export * from './tokens'

// Componentes UI de catálogo completo (51 componentes)
export * from './components/ui'

// Primitivas de contenido y animación
export { Eyebrow, SectionHeading, type EyebrowProps, type SectionHeadingProps } from './components/Content'
export { Reveal, type RevealProps } from './components/Reveal'

// Provider y temas
export { DesignSystemProvider, useDesignSystem, type DesignSystemProviderProps, type LinkComponent } from './providers/DesignSystemProvider'

// Componentes CRUD
export * from './components/crud'

// Componentes de Layout
export * from './components/layout'

// Componentes de Navegación
export * from './components/navigation'

// Componentes Básicos (Toast, Notification, Toggle)
export * from './components/basic'

// Pantallas y flujos de autenticación
export * from './auth-screens'

// Hooks personalizados
export * from './hooks'

// Stores Zustand
export * from './store'
