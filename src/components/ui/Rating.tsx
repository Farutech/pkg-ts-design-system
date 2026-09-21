import React, { useState, type KeyboardEvent } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { cn } from '@/utils/cn'

export interface RatingProps {
  /** Valor de calificación */
  value?: number
  /** Valor inicial por defecto */
  defaultValue?: number
  /** Callback al cambiar la calificación */
  onChange?: (value: number) => void
  /** Número máximo de estrellas */
  max?: number
  /** Modo solo lectura para promedios */
  readOnly?: boolean
  /** Tamaño de las estrellas */
  size?: 'sm' | 'md' | 'lg'
  /** Mostrar valor numérico al lado */
  showValue?: boolean
  /** Deshabilitar interacción */
  disabled?: boolean
  /** Permitir selección de medias estrellas */
  allowHalf?: boolean
  /** Precisión visual de relleno: 0.5 (mitades) o 'exact' (porcentaje decimal exacto como 4.3) */
  precision?: 0.5 | 'exact'
  className?: string
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

function getFillPercent(index: number, val: number, precision: 0.5 | 'exact'): number {
  if (val >= index + 1) return 100
  if (val <= index) return 0
  const remainder = val - index
  if (precision === 'exact') {
    return Math.round(remainder * 100)
  }
  if (remainder >= 0.75) return 100
  if (remainder >= 0.25) return 50
  return 0
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = 'md',
  showValue = false,
  disabled = false,
  allowHalf = true,
  precision = 0.5,
  className,
}: RatingProps) {
  const [internalValue, setInternalValue] = useState<number>(defaultValue)
  const isControlled = controlledValue !== undefined
  const activeValue = isControlled ? (controlledValue ?? 0) : internalValue
  const [hovered, setHovered] = useState<number | null>(null)

  const interactive = !readOnly && !disabled
  const effectiveValue = hovered ?? activeValue

  const handleSelect = (val: number) => {
    if (!interactive) return
    if (!isControlled) {
      setInternalValue(val)
    }
    onChange?.(val)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return
    const step = allowHalf ? 0.5 : 1
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      handleSelect(Math.min(max, activeValue + step))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      handleSelect(Math.max(step, activeValue - step))
    }
  }

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={
        interactive
          ? `Calificación: ${activeValue} de ${max}`
          : `Valoración: ${activeValue} de ${max} estrellas`
      }
      onKeyDown={handleKeyDown}
    >
      <div
        className="inline-flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: max }, (_, index) => {
          const starIndex = index
          const fillPercent = getFillPercent(starIndex, effectiveValue, precision)

          return (
            <div
              key={index}
              className={cn(
                'relative inline-block select-none',
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              onClick={(e) => {
                if (!interactive) return
                const rect = e.currentTarget.getBoundingClientRect()
                const isLeftHalf = e.clientX - rect.left < rect.width / 2
                const selectedVal = allowHalf && isLeftHalf ? starIndex + 0.5 : starIndex + 1
                handleSelect(selectedVal)
              }}
              onMouseMove={(e) => {
                if (!interactive) return
                const rect = e.currentTarget.getBoundingClientRect()
                const isLeftHalf = e.clientX - rect.left < rect.width / 2
                const hoveredVal = allowHalf && isLeftHalf ? starIndex + 0.5 : starIndex + 1
                setHovered(hoveredVal)
              }}
            >
              {/* Estrella de fondo (vacía) */}
              <StarIcon
                className={cn(SIZES[size], 'text-gray-300 dark:text-gray-600')}
                aria-hidden="true"
              />

              {/* Estrella de frente (relleno parcial o total) */}
              {fillPercent > 0 && (
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-75"
                  style={{ width: `${fillPercent}%` }}
                >
                  <StarIcon
                    className={cn(SIZES[size], 'text-warning max-w-none')}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tabular-nums">
          {activeValue.toFixed(1)}
        </span>
      )}
    </div>
  )
}
