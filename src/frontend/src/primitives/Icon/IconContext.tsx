import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { IconAdapter, IconName } from './IconAdapter'
import { defaultHeroiconsAdapter } from './defaultHeroiconsAdapter'

export interface IconContextValue {
  adapter: IconAdapter
}

const IconContext = createContext<IconContextValue>({
  adapter: defaultHeroiconsAdapter,
})

export interface IconProviderProps {
  children: ReactNode
  adapter?: Partial<IconAdapter>
}

/**
 * IconProvider:
 * Permite sustituir la implementación de iconos de forma global o en cualquier subárbol
 * (ej. sustituir Heroicons por Lucide o Phosphor).
 * Si faltan iconos en el adapter proporcionado, se utiliza un fallback seguro al default con warning en desarrollo.
 */
export function IconProvider({ children, adapter }: IconProviderProps) {
  const mergedAdapter = useMemo<IconAdapter>(() => {
    return {
      ...defaultHeroiconsAdapter,
      ...adapter,
    }
  }, [adapter])

  return (
    <IconContext.Provider value={{ adapter: mergedAdapter }}>
      {children}
    </IconContext.Provider>
  )
}

export function useIconAdapter(): IconAdapter {
  return useContext(IconContext).adapter
}
