/**
 * ConfigProvider / DesignSystemProvider (FaruTech Design System):
 * - Inyecta overrides de tokens como CSS custom properties en un subárbol
 *   (cada app tematiza sin fork del paquete).
 * - Controla el nivel de densidad (comfortable, compact, dense) para tablas y controles.
 * - Soporta temas light, dark y high-contrast (WCAG 2.2 AAA).
 * - Soporta dirección de lectura (ltr / rtl) y localización (locale).
 * - Configura umbrales de virtualización automática (listas > 80, tablas > 100).
 * - Integra IconProvider para adapters intercambiables (Heroicons, Lucide, Phosphor, SVG).
 * - Permite registrar el LinkComponent del router anfitrión sin acoplamiento duro.
 */
import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { DesignTokens, Density } from '@/tokens/tokens'
import { tokensToStyle, densityToStyle } from '@/tokens/tokens'
import type { IconAdapter } from '@/primitives/Icon/IconAdapter'
import { IconProvider } from '@/primitives/Icon/IconContext'

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

export interface VirtualizationConfig {
  /** Umbral de elementos en listas o comboboxes a partir del cual se activa virtualización automática (default: 80) */
  listThreshold?: number
  /** Umbral de filas en tablas a partir del cual se activa virtualización automática (default: 100) */
  tableThreshold?: number
}

export type ColorMode = 'light' | 'dark' | 'high-contrast'
export type Direction = 'ltr' | 'rtl'

export interface ConfigContextValue {
  LinkComponent?: LinkComponent
  brand?: BrandConfig
  density: Density
  locale: string
  colorMode?: ColorMode
  dir: Direction
  virtualization: {
    listThreshold: number
    tableThreshold: number
  }
}

const defaultBrandConfig: BrandConfig = {
  appName: 'FaruTech',
  showCreator: true,
  creatorName: 'FaruTech',
  creatorUrl: 'https://farutech.com',
  creatorPrefix: 'Desarrollado por',
}

const defaultConfigValue: ConfigContextValue = {
  brand: defaultBrandConfig,
  density: 'compact',
  locale: 'es-CO',
  dir: 'ltr',
  virtualization: {
    listThreshold: 80,
    tableThreshold: 100,
  },
}

const ConfigContext = createContext<ConfigContextValue>(defaultConfigValue)

/** Hook que devuelve la configuración completa activa */
export function useConfig(): ConfigContextValue {
  return useContext(ConfigContext)
}

/** Alias para retrocompatibilidad con useDesignSystem() */
export function useDesignSystem(): ConfigContextValue {
  return useConfig()
}

/** Hook que devuelve la densidad activa ('comfortable' | 'compact' | 'dense') */
export function useDensity(): Density {
  return useConfig().density
}

/** Hook que devuelve los umbrales de virtualización */
export function useVirtualizationConfig(): { listThreshold: number; tableThreshold: number } {
  return useConfig().virtualization
}

/** Hook que devuelve la configuración de marca activa del árbol */
export function useBrandConfig(): BrandConfig {
  const { brand } = useConfig()
  return useMemo(() => ({
    ...defaultBrandConfig,
    ...brand,
  }), [brand])
}

/** Hook que devuelve el locale activo */
export function useLocale(): string {
  return useConfig().locale
}

/** Hook que devuelve la dirección del texto */
export function useDirection(): Direction {
  return useConfig().dir
}

export interface ConfigProviderProps {
  children: ReactNode
  /** Overrides de tokens (camelCase) aplicados a este subárbol */
  theme?: DesignTokens
  /** Nivel de densidad visual: 'comfortable' (56px/44px), 'compact' (44px/36px, default), 'dense' (32px/28px) */
  density?: Density
  /** Modo de color: 'light' | 'dark' | 'high-contrast'. Hereda del padre si no se especifica */
  colorMode?: ColorMode
  /** Configuración global de marca para Navbar, Footers y Pantallas */
  brand?: BrandConfig
  /** Componente de enlace del router host (ej. react-router <Link> o Next.js Link) */
  linkComponent?: LinkComponent
  /** Idioma / Locale activo (ej. 'es-CO', 'en-US') */
  locale?: string
  /** Dirección del texto ('ltr' o 'rtl') */
  dir?: Direction
  /** Configuración de umbrales para virtualización automática */
  virtualization?: VirtualizationConfig
  /** Adapter opcional para sustituir los iconos internos del sistema */
  iconAdapter?: Partial<IconAdapter>
  className?: string
  style?: CSSProperties
}

/**
 * ConfigProvider:
 * Plataforma central de configuración temática, densidad, accesibilidad y adapters
 * para todo el ecosistema FaruTech.
 */
export function ConfigProvider({
  children,
  theme,
  density,
  colorMode,
  brand,
  linkComponent,
  locale,
  dir,
  virtualization,
  iconAdapter,
  className,
  style,
}: ConfigProviderProps) {
  const parent = useContext(ConfigContext)

  const activeDensity = density ?? parent.density
  const activeLocale = locale ?? parent.locale
  const activeDir = dir ?? parent.dir
  const activeColorMode = colorMode ?? parent.colorMode

  const activeVirtualization = useMemo(() => ({
    listThreshold: virtualization?.listThreshold ?? parent.virtualization.listThreshold,
    tableThreshold: virtualization?.tableThreshold ?? parent.virtualization.tableThreshold,
  }), [virtualization, parent.virtualization])

  const activeBrand = useMemo(() => {
    if (!brand && !parent.brand) return defaultBrandConfig
    return { ...defaultBrandConfig, ...parent.brand, ...brand }
  }, [brand, parent.brand])

  const tokenStyle = useMemo(() => tokensToStyle(theme ?? {}), [theme])
  const densityStyle = useMemo(() => densityToStyle(activeDensity), [activeDensity])

  const contextValue = useMemo<ConfigContextValue>(() => ({
    LinkComponent: linkComponent ?? parent.LinkComponent,
    brand: activeBrand,
    density: activeDensity,
    locale: activeLocale,
    colorMode: activeColorMode,
    dir: activeDir,
    virtualization: activeVirtualization,
  }), [
    linkComponent,
    parent.LinkComponent,
    activeBrand,
    activeDensity,
    activeLocale,
    activeColorMode,
    activeDir,
    activeVirtualization,
  ])

  const mergedStyle: CSSProperties = {
    ...tokenStyle,
    ...densityStyle,
    ...style,
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      <IconProvider adapter={iconAdapter}>
        <div
          className={className}
          data-theme={activeColorMode}
          data-density={activeDensity}
          dir={activeDir}
          style={mergedStyle}
        >
          {children}
        </div>
      </IconProvider>
    </ConfigContext.Provider>
  )
}

/**
 * DesignSystemProvider:
 * Alias 100% retrocompatible de ConfigProvider
 */
export const DesignSystemProvider = ConfigProvider
export type DesignSystemProviderProps = ConfigProviderProps
