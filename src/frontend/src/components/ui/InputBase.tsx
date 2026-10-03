import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'outline' | 'filled' | 'borderless' | 'underline'
export type InputStatus = 'default' | 'error' | 'warning' | 'success'

export interface InputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  density?: Density
  variant?: InputVariant
  status?: InputStatus
  fullWidth?: boolean
  hasLeftContent?: boolean
  hasRightContent?: boolean
}

/**
 * InputBase (Primitiva Interna de Input):
 * Encapsula la apariencia física, altura, tipografía, bordes y foco del elemento <input>.
 * Soporta densidad automática (comfortable, compact, dense), tamaños y variantes.
 */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  (
    {
      size = 'md',
      density: propDensity,
      variant = 'outline',
      status = 'default',
      fullWidth = true,
      hasLeftContent = false,
      hasRightContent = false,
      disabled,
      readOnly,
      className,
      ...props
    },
    ref
  ) => {
    const contextDensity = useDensity()
    const activeDensity = propDensity ?? contextDensity

    // Clases de altura y espaciado según densidad y tamaño
    const sizeClasses = {
      sm: {
        comfortable: 'h-9 text-sm px-2.5',
        compact: 'h-8 text-xs px-2',
        dense: 'h-6 text-xs px-1.5',
      },
      md: {
        comfortable: 'h-11 text-base px-3.5',
        compact: 'h-9 text-sm px-3',
        dense: 'h-7 text-xs px-2',
      },
      lg: {
        comfortable: 'h-14 text-lg px-4',
        compact: 'h-11 text-base px-3.5',
        dense: 'h-9 text-sm px-2.5',
      },
    }[size][activeDensity]

    // Clases por variante
    const variantClasses = {
      outline:
        'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      filled:
        'border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:bg-white dark:focus:bg-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      borderless:
        'border-none bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0 shadow-none px-0',
      underline:
        'border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent rounded-none px-0 focus:border-primary-500 focus:ring-0',
    }[variant]

    // Clases por status
    const statusClasses = {
      default: '',
      error:
        'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-100',
      warning:
        'border-amber-500 dark:border-amber-500 focus:border-amber-500 focus:ring-amber-500/20',
      success:
        'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
    }[status]

    return (
      <input
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          'w-full transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500',
          sizeClasses,
          variantClasses,
          statusClasses,
          hasLeftContent && 'pl-9',
          hasRightContent && 'pr-9',
          disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
          readOnly && 'bg-gray-50 dark:bg-gray-800/50 cursor-default',
          !fullWidth && 'w-auto',
          className
        )}
        {...props}
      />
    )
  }
)

InputBase.displayName = 'InputBase'
