/**
 * Rating — selector de estrellas (AntD/MUI Rating).
 * Soporta solo-lectura (para promedios) y control por teclado.
 */
import { useState, type KeyboardEvent } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { cn } from '@/utils/cn'

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  /** Solo lectura (mostrar promedio). */
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Muestra el valor numérico (ej. "4.5"). */
  showValue?: boolean
  disabled?: boolean
  className?: string
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Rating({
  value,
  onChange,
  max = 5,
  readOnly = false,
  size = 'md',
  showValue = false,
  disabled = false,
  className,
}: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const interactive = !readOnly && !disabled && Boolean(onChange)
  const effectiveValue = hovered ?? value

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onChange) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(Math.min(max, value + 1))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(Math.max(1, value - 1))
    }
  }

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? `Calificación: ${value} de ${max}` : `Valoración: ${value} de ${max} estrellas`}
      onKeyDown={handleKeyDown}
    >
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: max }, (_, index) => {
          const star = index + 1
          const filled = star <= Math.round(effectiveValue)
          const starNode = (
            <StarIcon
              className={cn(
                SIZES[size],
                'transition-colors',
                filled ? 'text-warning' : 'text-gray-300 dark:text-gray-600',
                interactive && 'cursor-pointer',
              )}
              aria-hidden="true"
            />
          )

          if (!interactive) return <span key={star}>{starNode}</span>

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHovered(star)}
              disabled={disabled}
              aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
              className={cn(
                'rounded p-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                'hover:scale-110 disabled:cursor-not-allowed',
              )}
            >
              {starNode}
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
