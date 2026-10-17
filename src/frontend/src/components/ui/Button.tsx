import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useDesignSystem } from '@/providers/DesignSystemProvider'
import { IconSlot } from '@/primitives/icon/IconSlot'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline' | 'addon'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Icono directo (lucide-react, svg o ReactNode) */
  icon?: ReactNode
  /** Alias para icono a la izquierda */
  leftIcon?: ReactNode
  /** Alias para icono a la derecha */
  rightIcon?: ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  isLoading?: boolean
  fullWidth?: boolean
  /** Permitir salto de línea explícito (por defecto false: prohíbe saltos automáticos) */
  allowWrap?: boolean
  /** Ruta interna — renderiza el LinkComponent del provider si existe */
  to?: string
  /** URL externa — renderiza <a> */
  href?: string
  external?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    leftIcon,
    rightIcon,
    iconPosition = 'left',
    loading = false,
    isLoading = false,
    fullWidth = false,
    allowWrap = false,
    to,
    href,
    external,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isButtonLoading = loading || isLoading
  const { LinkComponent } = useDesignSystem()

  const effectiveLeftIcon = leftIcon ?? (iconPosition === 'left' ? icon : undefined)
  const effectiveRightIcon = rightIcon ?? (iconPosition === 'right' ? icon : undefined)

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    outline:
      'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500',
    addon:
      'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-700 border-0 rounded-none shadow-none font-medium',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const classes = cn(
    baseStyles,
    'ft-button ft-inline-action',
    `ft-button--${variant}`,
    `ft-button--${size}`,
    !allowWrap && 'whitespace-nowrap',
    fullWidth && 'ft-button--full w-full',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  )

  const content = (
    <>
      {isButtonLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isButtonLoading && effectiveLeftIcon && (
        <IconSlot icon={effectiveLeftIcon} className="mr-2 shrink-0" />
      )}

      {children && (
        <span
          className={cn(
            'inline-flex items-center gap-2 [&>svg]:shrink-0',
            !allowWrap && 'whitespace-nowrap'
          )}
        >
          {children}
        </span>
      )}

      {!isButtonLoading && effectiveRightIcon && (
        <IconSlot icon={effectiveRightIcon} className="ml-2 shrink-0" />
      )}
    </>
  )

  if (to && LinkComponent) {
    return (
      <LinkComponent href={to} className={classes}>
        {content}
      </LinkComponent>
    )
  }

  if (to || href) {
    const url = to ?? href ?? '#'
    return (
      <a
        href={url}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-busy={isButtonLoading || undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isButtonLoading}
      aria-busy={isButtonLoading || undefined}
      {...props}
    >
      {content}
    </button>
  )
})

Button.displayName = 'Button'
