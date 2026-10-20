import type { ReactNode } from 'react'
import { InboxIcon } from '@heroicons/react/24/outline'

/**
 * data-table/DataTableStates.tsx — Estados visuales del DataTable (Fase 4)
 *
 * Empty / Loading / Error extraídos del monolito para reutilización
 * en DataTable, CRUDPage y consumidores externos.
 */

export interface DataTableEmptyStateProps {
  message?: string
  icon?: ReactNode
  /** Slot totalmente personalizado (toma precedencia sobre message/icon) */
  slot?: ReactNode
  /** Texto de ayuda contextual cuando hay búsqueda activa */
  hasActiveSearch?: boolean
}

export function DataTableEmptyState({
  message = 'No hay registros disponibles',
  icon,
  slot,
  hasActiveSearch = false,
}: DataTableEmptyStateProps) {
  if (slot) return <>{slot}</>

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {icon || <InboxIcon className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {message}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {hasActiveSearch
          ? 'Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.'
          : 'Comienza agregando nuevos registros usando el botón de arriba.'}
      </p>
    </div>
  )
}

export interface DataTableLoadingStateProps {
  /** Número de filas skeleton */
  rows?: number
}

export function DataTableLoadingState({ rows = 5 }: DataTableLoadingStateProps) {
  return (
    <div className="animate-pulse space-y-3 p-4" role="status" aria-label="Cargando registros">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  )
}
