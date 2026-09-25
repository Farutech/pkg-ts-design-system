/**
 * Chip — chip/etiqueta removible o seleccionable (Material Chips, AntD Tag).
 * Diferencia con Badge: el Chip es interactivo (onDelete / onClick).
 */
import type { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export type ChipVariant = 'neutral' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'outline'

export interface ChipProps {
  children: ReactNode
  variant?: ChipVariant
  /** Avatar/icono a la izquierda. */
  icon?: ReactNode
  /** Muestra botón de eliminar (X). */
  onDelete?: () => void
  /** Chip clickeable (filtro/selección). */
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  className?: string
}

const VARIANTS: Record<ChipVariant, string> = {
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  primary: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  outline:
    'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-200',
}

export function Chip({
  children,
  variant = 'neutral',
  icon,
  onDelete,
  onClick,
  selected = false,
  disabled = false,
  className,
}: ChipProps) {
  const isInteractive = Boolean(onClick) && !disabled

  const content = (
    <>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {onDelete && !disabled && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          aria-label="Eliminar"
          className={cn(
            '-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full',
            'opacity-70 transition-opacity hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
          )}
        >
          <XMarkIcon className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </>
  )

  const base = cn(
    'inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
    'transition-colors',
    VARIANTS[variant],
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={cn(
          base,
          'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          selected && 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-gray-900',
        )}
      >
        {content}
      </button>
    )
  }

  return <span className={base}>{content}</span>
}
