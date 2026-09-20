/**
 * IconButton — botón cuadrado solo con icono (Material style).
 * Exige `aria-label` porque no hay texto visible.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type IconButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icono a renderizar (heroicon u otro SVG). */
  icon: ReactNode
  /** Etiqueta accesible obligatoria (no hay texto visible). */
  'aria-label': string
  variant?: IconButtonVariant
  size?: IconButtonSize
  rounded?: boolean
}

const VARIANTS: Record<IconButtonVariant, string> = {
  solid: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-sm',
  outline:
    'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-primary-500',
  ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-primary-500',
  danger: 'bg-danger text-white hover:brightness-90 focus-visible:ring-danger shadow-sm',
}

const SIZES: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-10 w-10 [&>svg]:h-5 [&>svg]:w-5',
  lg: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'ghost', size = 'md', rounded = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        rounded ? 'rounded-full' : 'rounded-lg',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
})
