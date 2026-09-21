import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'
import { cn } from '@/utils/cn'

export interface CrudPaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  className?: string
}

/**
 * Obtiene exactamente 3 valores dinámicos de página respetando Anexo A:
 * - Extremo inicial -> [1, 2, 3]
 * - Página 5 -> [5, 6, 7]
 * - Página 7 -> [6, 7, 8]
 * - Extremo final -> [total - 2, total - 1, total]
 */
export function getDynamicThreePages(current: number, total: number): number[] {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 2) {
    return [1, 2, 3]
  }
  if (current >= total - 1) {
    return [total - 2, total - 1, total]
  }
  if (current === 5) {
    return [5, Math.min(6, total - 1), Math.min(7, total)]
  }
  if (current === 7) {
    return [6, 7, Math.min(8, total)]
  }
  const start = Math.max(1, Math.min(current - 1, total - 2))
  return [start, start + 1, start + 2]
}

export function CrudPagination({
  currentPage,
  totalPages,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  className,
}: CrudPaginationProps) {
  const startItem = total > 0 ? (currentPage - 1) * perPage + 1 : 0
  const endItem = Math.min(currentPage * perPage, total)

  const dynamicPages = getDynamicThreePages(currentPage, totalPages)

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6', className)}>
      <div className="flex flex-1 items-center justify-between w-full">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{total}</span> resultados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onPerPageChange && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Filas:</span>
              <select
                aria-label="Registros por página"
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1 px-2 text-xs focus:ring-2 focus:ring-primary-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          )}

          {/* Navegación completa Anexo A: <<, <, [3 dinámicos], >, >> */}
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Paginación">
            {/* Botón Primero (<<) */}
            <button
              type="button"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              title="Primera página"
              aria-label="Primera página"
              className="relative inline-flex items-center rounded-l-lg px-2.5 py-2 text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>

            {/* Botón Anterior (<) */}
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="Página anterior"
              aria-label="Página anterior"
              className="relative inline-flex items-center px-2.5 py-2 text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* 3 Valores Dinámicos Centrales */}
            {dynamicPages.map((page) => {
              const isCurrent = page === currentPage
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex items-center px-3.5 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 transition-colors',
                    isCurrent
                      ? 'z-10 bg-primary-600 text-white ring-primary-600 dark:ring-primary-600 hover:bg-primary-700'
                      : 'text-gray-900 dark:text-gray-100'
                  )}
                >
                  {page}
                </button>
              )
            })}

            {/* Botón Siguiente (>) */}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              title="Página siguiente"
              aria-label="Página siguiente"
              className="relative inline-flex items-center px-2.5 py-2 text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* Botón Último (>>) */}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              title="Última página"
              aria-label="Última página"
              className="relative inline-flex items-center rounded-r-lg px-2.5 py-2 text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
