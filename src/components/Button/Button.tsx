/**
 * Button — API RECONCILIADA (TASK-201 / doc 08 req. 2).
 *
 * Superset de las dos implementaciones originales, una sola API:
 *  - de dashboard:  variantes solid (primary/secondary/danger/success/warning),
 *                   icon/iconPosition, loading, fullWidth.
 *  - de apps/frontend: outline/ghost, href/to (enlaces), external.
 * `to` usa el LinkComponent registrado en <DesignSystemProvider> (react-router
 * u otro) — el paquete no depende de ningún router.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import { useDesignSystem } from '../../providers/DesignSystemProvider'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  /** Ruta interna — renderiza el LinkComponent del provider (sin router propio). */
  to?: string
  /** URL externa — renderiza <a>. */
  href?: string
  external?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    to,
    href,
    external,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  const { LinkComponent } = useDesignSystem()
  const classes = clsx('ft-button', `ft-button--${variant}`, `ft-button--${size}`, fullWidth && 'ft-button--full', className)

  const content = (
    <>
      {loading && <span className="ft-button__spinner" aria-hidden="true" />}
      {!loading && icon && iconPosition === 'left' && <span className="ft-button__icon">{icon}</span>}
      <span className="ft-button__label">{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="ft-button__icon">{icon}</span>}
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
        aria-busy={loading || undefined}
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  )
})
