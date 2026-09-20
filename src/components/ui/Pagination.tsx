/**
 * Pagination — paginación autónoma (números, elipsis, prev/next).
 * Bootstrap-style; también la usa CrudPagination internamente.
 */
import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface PaginationProps {
  /** Página actual (1-indexed). */
  page: number
  /** Total de páginas. */
  totalPages: number
  onChange: (page: number) => void
  /** Ventana de páginas visibles alrededor de la actual. */
  siblingCount?: number
  showFirstLast?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

function buildPageList(page: number, totalPages: number, siblingCount: number): (number | 'ellipsis')[] {
  const totalSlots = siblingCount * 2 + 5
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const left = Math.max(2, page - siblingCount)
  const right = Math.min(totalPages - 1, page + siblingCount)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < totalPages - 1

  const items: (number | 'ellipsis')[] = [1]
  if (showLeftEllipsis) items.push('ellipsis')
  for (let i = left; i <= right; i += 1) items.push(i)
  if (showRightEllipsis) items.push('ellipsis')
  items.push(totalPages)
  return items
}

const SIZES = {
  sm: 'h-8 min-w-8 text-xs',
  md: 'h-10 min-w-10 text-sm',
  lg: 'h-12 min-w-12 text-base',
}

const BASE_BUTTON = [
  'inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600',
  'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  'disabled:opacity-40 disabled:cursor-not-allowed',
].join(' ')

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  disabled = false,
  className,
}: PaginationProps) {
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages))
  const items = buildPageList(safePage, totalPages, siblingCount)
  // El anillo de foco sigue a la página activa (navegación por teclado).
  const [focusedPage, setFocusedPage] = useState<number | null>(null)

  useEffect(() => {
    setFocusedPage(null)
  }, [safePage])

  const goTo = (target: number) => {
    if (disabled) return
    const next = Math.min(Math.max(1, target), totalPages)
    if (next !== safePage) onChange(next)
  }

  return (
    <nav aria-label="Paginación" className={cn('flex items-center gap-1', className)}>
      {showFirstLast && (
        <button
          type="button"
          className={cn(BASE_BUTTON, SIZES[size])}
          onClick={() => goTo(1)}
          disabled={disabled || safePage === 1}
          aria-label="Ir a la primera página"
        >
          «
        </button>
      )}
      <button
        type="button"
        className={cn(BASE_BUTTON, SIZES[size])}
        onClick={() => goTo(safePage - 1)}
        disabled={disabled || safePage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <ul className="flex items-center gap-1 list-none m-0 p-0">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li
              key={`ellipsis-${index}`}
              className={cn('inline-flex items-center justify-center px-2 text-gray-400', SIZES[size])}
              aria-hidden="true"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => goTo(item)}
                disabled={disabled}
                aria-current={item === safePage ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg border transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                  SIZES[size],
                  item === safePage
                    ? 'border-primary-600 bg-primary-600 text-white font-medium'
                    : BASE_BUTTON,
                  focusedPage === item && 'ring-2 ring-primary-500',
                )}
                onFocus={() => setFocusedPage(item)}
                onBlur={() => setFocusedPage(null)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={cn(BASE_BUTTON, SIZES[size])}
        onClick={() => goTo(safePage + 1)}
        disabled={disabled || safePage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {showFirstLast && (
        <button
          type="button"
          className={cn(BASE_BUTTON, SIZES[size])}
          onClick={() => goTo(totalPages)}
          disabled={disabled || safePage === totalPages}
          aria-label="Ir a la última página"
        >
          »
        </button>
      )}
    </nav>
  )
}
