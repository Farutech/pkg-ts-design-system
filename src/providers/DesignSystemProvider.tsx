/**
 * DesignSystemProvider (TASK-201):
 * - Inyecta overrides de tokens como CSS custom properties en un subárbol
 *   (cada app tematiza sin fork del paquete — doc 08 req. 4).
 * - Permite registrar el LinkComponent del router de la app consumidora,
 *   para que Button soporte navegación interna sin dependencia dura de
 *   react-router (el paquete no puede imponer un router).
 */
import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react'
import type { DesignTokens } from '../tokens/tokens'
import { tokensToStyle } from '../tokens/tokens'

export type LinkComponent = (props: { href: string; children: ReactNode; className?: string }) => ReactNode

interface DesignSystemContextValue {
  LinkComponent?: LinkComponent
}

const DesignSystemContext = createContext<DesignSystemContextValue>({})

export function useDesignSystem(): DesignSystemContextValue {
  return useContext(DesignSystemContext)
}

export interface DesignSystemProviderProps {
  children: ReactNode
  /** Overrides de tokens (camelCase) aplicados solo a este subárbol. */
  theme?: DesignTokens
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
  colorMode,
  linkComponent,
  className,
  style,
}: DesignSystemProviderProps) {
  const tokenStyle = useMemo(() => tokensToStyle(theme ?? {}), [theme])
  const ctx = useMemo(() => ({ LinkComponent: linkComponent }), [linkComponent])

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
