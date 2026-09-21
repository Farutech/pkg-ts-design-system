/**
 * DesignSystemProvider (TASK-201):
 * - Inyecta overrides de tokens como CSS custom properties en un subárbol
 *   (cada app tematiza sin fork del paquete — doc 08 req. 4).
 * - Permite registrar el LinkComponent del router de la app consumidora,
 *   para que Button soporte navegación interna sin dependencia dura de
 *   react-router (el paquete no puede imponer un router).
 */
import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react'
import type { DesignTokens } from '@/tokens/tokens'
import { tokensToStyle } from '@/tokens/tokens'

export type LinkComponent = (props: { href: string; children: ReactNode; className?: string }) => ReactNode

export interface BrandUserConfig {
  name?: string
  email?: string
  role?: string
  avatarUrl?: string
}

export interface BrandConfig {
  /** Nombre de la aplicación o producto (ej: "Afilamos Operaciones", "Ordeon", "Portal Clientes") */
  appName?: string
  /** Alias compatible con appName */
  brandName?: string
  /** URL del logo */
  logoUrl?: string
  /** Nodo JSX del logo (SVG o elemento personalizado) */
  logoNode?: ReactNode
  /** Si se debe mostrar la atribución al creador al pie (default: true). False para marca blanca pura */
  showCreator?: boolean
  /** Nombre del creador de la plataforma (default: "FaruTech") */
  creatorName?: string
  /** URL del enlace del creador (default: "https://farutech.com") */
  creatorUrl?: string
  /** Prefijo del creador (default: "Desarrollado por") */
  creatorPrefix?: string
  /** Datos del usuario actual para el Navbar y perfiles */
  user?: BrandUserConfig
}

export interface DesignSystemContextValue {
  LinkComponent?: LinkComponent
  brand?: BrandConfig
}

const defaultBrandConfig: BrandConfig = {
  appName: 'FaruTech',
  showCreator: true,
  creatorName: 'FaruTech',
  creatorUrl: 'https://farutech.com',
  creatorPrefix: 'Desarrollado por',
}

const DesignSystemContext = createContext<DesignSystemContextValue>({
  brand: defaultBrandConfig,
})

export function useDesignSystem(): DesignSystemContextValue {
  return useContext(DesignSystemContext)
}

/** Hook que devuelve la configuración de marca activa del árbol */
export function useBrandConfig(): BrandConfig {
  const { brand } = useDesignSystem()
  return useMemo(() => ({
    ...defaultBrandConfig,
    ...brand,
  }), [brand])
}

export interface DesignSystemProviderProps {
  children: ReactNode
  /** Overrides de tokens (camelCase) aplicados solo a este subárbol. */
  theme?: DesignTokens
  /** Configuración global de marca (appName, logo, showCreator, etc.) para todos los componentes hijos */
  brand?: BrandConfig
  /** 'dark' activa el tema oscuro vía data-theme; default hereda. */
  colorMode?: 'light' | 'dark'
  /** Componente de enlace del router host (ej. react-router <Link>). */
  linkComponent?: LinkComponent
  className?: string
  style?: CSSProperties
}

export function DesignSystemProvider({
  children,
  theme,
  brand,
  colorMode,
  linkComponent,
  className,
  style,
}: DesignSystemProviderProps) {
  const tokenStyle = useMemo(() => tokensToStyle(theme ?? {}), [theme])
  const ctx = useMemo(() => ({
    LinkComponent: linkComponent,
    brand,
  }), [linkComponent, brand])

  return (
    <DesignSystemContext.Provider value={ctx}>
      <div
        className={className}
        data-theme={colorMode === 'dark' ? 'dark' : undefined}
        style={{ ...tokenStyle, ...style }}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  )
}
