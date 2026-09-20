/**
 * SegmentedControl — grupo de opciones exclusivas (iOS/Bootstrap button group).
 * Radio group accesible con rol="radiogroup" y flechas de teclado.
 */
import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  /** Ocupa todo el ancho disponible. */
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

const SIZES = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const enabled = options.filter((option) => !option.disabled)
    const currentIndex = enabled.findIndex((option) => option.value === value)
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % enabled.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + enabled.length) % enabled.length
    }

    if (nextIndex !== null) {
      event.preventDefault()
      const next = enabled[nextIndex]
      onChange(next.value)
      const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      const target = Array.from(buttons ?? []).find((button) => button.dataset.value === next.value)
      target?.focus()
    }
  }

  return (
    <div className={cn('inline-flex flex-col gap-1', fullWidth && 'w-full', className)}>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1',
          fullWidth && 'w-full',
          disabled && 'opacity-50',
        )}
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              data-value={option.value}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              disabled={disabled || option.disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                SIZES[size],
                selected
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              )}
            >
              {option.icon && <span className="inline-flex [&>svg]:h-4 [&>svg]:w-4">{option.icon}</span>}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
