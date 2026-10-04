import { cn } from '@/utils/cn'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

/** Opciones por defecto para "registros por página". */
export const DEFAULT_PER_PAGE_OPTIONS: number[] = [10, 25, 50, 100]

export interface CrudPaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  /**
   * Opciones configurables para el selector "Por página".
   * Si no se provee, usa {@link DEFAULT_PER_PAGE_OPTIONS}.
   * Ejemplo: `[5, 10, 25, 50]` para catálogos pequeños.
   */
  perPageOptions?: number[]
  /** Permite saltar a una página específica escribiendo el número. */
  showJumpToPage?: boolean
  /** Variante de tema: 'dark' para aplicaciones tipo Ordeon, 'default' para dashboard claro */
  variant?: 'dark' | 'default' | 'transparent'
  className?: string
}

/**
 * Obtiene hasta 5 valores dinámicos centrados en la página actual.
 */
export function getDynamicPages(current: number, total: number, maxVisible = 5): number[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  const pages: number[] = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

export function CrudPagination({
  currentPage,
  totalPages,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  showJumpToPage = true,
  variant = 'dark',
  className,
}: CrudPaginationProps) {
  const dynamicPages = getDynamicPages(currentPage, Math.max(1, totalPages))
  const isDark = variant === 'dark' || variant === 'transparent'

  // Estado local para "saltar a página". Se sincroniza cuando cambia la página externa.
  const [jumpValue, setJumpValue] = useState<string>(String(currentPage))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJumpValue(String(currentPage))
  }, [currentPage])

  const handleJump = () => {
    const parsed = Number(jumpValue)
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= Math.max(1, totalPages)) {
      onPageChange(Math.floor(parsed))
    } else {
      setJumpValue(String(currentPage))
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t select-none transition-colors',
        isDark
          ? 'bg-[#15161d] border-[#292a34] text-slate-400'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
        variant === 'transparent' && 'bg-transparent border-transparent',
        className
      )}
    >
      {/* Columna 1: Resumen de conteo y páginas (Izquierda) */}
      <div className="flex items-center min-w-0">
        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium tracking-wide">
          Página <span className={cn('font-bold', isDark ? 'text-slate-200' : 'text-gray-900 dark:text-white')}>{currentPage}</span> de{' '}
          <span className={cn('font-bold', isDark ? 'text-slate-200' : 'text-gray-900 dark:text-white')}>{Math.max(1, totalPages)}</span> ·{' '}
          <span>{total}</span> elementos totales
        </p>
      </div>

      {/* Columna 2: Navegación de páginas centrada (Centro) */}
      <div className="flex items-center justify-center">
        <nav className="inline-flex items-center gap-1" aria-label="Navegación de páginas">
          {/* Botón Primera Página («) */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="Primera página"
            aria-label="Primera página"
            className={cn(
              'h-8 w-8 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-all',
              isDark
                ? 'bg-[#1c1d26] border-[#313342] text-slate-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:border-[#262732]'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40',
              'disabled:cursor-not-allowed'
            )}
          >
            <ChevronDoubleLeftIcon className="h-3.5 w-3.5" />
          </button>

          {/* Botón Anterior (‹) */}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title="Página anterior"
            aria-label="Página anterior"
            className={cn(
              'h-8 w-8 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-all',
              isDark
                ? 'bg-[#1c1d26] border-[#313342] text-slate-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:border-[#262732]'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40',
              'disabled:cursor-not-allowed'
            )}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>

          {/* Botones numéricos de página */}
          {dynamicPages.map((page) => {
            const isCurrent = page === currentPage
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'h-8 min-w-8 px-2.5 inline-flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm',
                  isCurrent
                    ? 'bg-violet-600 border border-violet-500 text-white shadow-violet-500/20'
                    : isDark
                    ? 'bg-[#1c1d26] border border-[#313342] text-slate-300 hover:border-violet-500 hover:text-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            )
          })}

          {/* Botón Siguiente (›) */}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            title="Página siguiente"
            aria-label="Página siguiente"
            className={cn(
              'h-8 w-8 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-all',
              isDark
                ? 'bg-[#1c1d26] border-[#313342] text-slate-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:border-[#262732]'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40',
              'disabled:cursor-not-allowed'
            )}
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>

          {/* Botón Última Página (») */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Última página"
            aria-label="Última página"
            className={cn(
              'h-8 w-8 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-all',
              isDark
                ? 'bg-[#1c1d26] border-[#313342] text-slate-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:border-[#262732]'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40',
              'disabled:cursor-not-allowed'
            )}
          >
            <ChevronDoubleRightIcon className="h-3.5 w-3.5" />
          </button>
        </nav>
      </div>

      {/* Columna 3: Selector por página + Salto directo (Derecha) */}
      {onPerPageChange && (
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>Por página</span>
            <select
              aria-label="Registros por página"
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className={cn(
                'h-8 rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer transition-colors',
                isDark
                  ? 'bg-[#1c1d26] border-[#313342] text-slate-200 focus:border-violet-500'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500'
              )}
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {showJumpToPage && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span>Ir a</span>
              <input
                type="number"
                min={1}
                max={Math.max(1, totalPages)}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleJump()
                  }
                }}
                onBlur={handleJump}
                aria-label="Saltar a página específica"
                className={cn(
                  'h-8 w-14 rounded-lg border px-2 py-1 text-xs font-semibold outline-none text-center transition-colors',
                  isDark
                    ? 'bg-[#1c1d26] border-[#313342] text-slate-200 focus:border-violet-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500'
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

