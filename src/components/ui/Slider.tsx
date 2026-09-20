/**
 * Slider — input range accesible con marcas y relleno de color.
 * Material Slider / Bootstrap 5 range.
 */
import { useId, type ChangeEvent } from 'react'
import { cn } from '@/utils/cn'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  /** Marca los extremos con el valor min/max. */
  showBounds?: boolean
  /** Formatea el valor junto a la etiqueta. */
  formatValue?: (value: number) => string
  className?: string
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  hint,
  error,
  disabled = false,
  showBounds = false,
  formatValue,
  className,
}: SliderProps) {
  const autoId = useId()
  const sliderId = `slider-${autoId.replace(/:/g, '')}`
  const clamped = Math.min(Math.max(value, min), max)
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value))
  }

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      {(label || formatValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={sliderId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {formatValue && (
            <span
              className={cn(
                'text-sm font-semibold tabular-nums',
                error ? 'text-danger' : 'text-primary-600 dark:text-primary-400',
              )}
            >
              {formatValue(clamped)}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${sliderId}-error` : hint ? `${sliderId}-hint` : undefined}
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700',
          'h-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform',
          '[&::-webkit-slider-thumb]:hover:scale-110',
          '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
        )}
        style={{ background: `linear-gradient(to right, var(--ft-color-primary) ${percent}%, var(--ft-color-border) ${percent}%)` }}
      />
      {showBounds && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatValue ? formatValue(min) : min}</span>
          <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      )}
      {error ? (
        <p id={`${sliderId}-error`} role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${sliderId}-hint`} className="m-0 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
