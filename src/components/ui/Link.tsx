/**
 * Link — enlace del Design System.
 * Usa el `LinkComponent` registrado en <DesignSystemProvider> (react-router,
 * Next, etc.) para rutas internas, y <a> para URLs externas.
 */
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useDesignSystem } from '@/providers/DesignSystemProvider'
import { cn } from '@/utils/cn'

export type LinkVariant = 'default' | 'primary' | 'quiet' | 'nav'

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Ruta interna (usa el LinkComponent del host) o URL absoluta. */
  href: string
  children: ReactNode
  variant?: LinkVariant
  external?: boolean
  underline?: 'always' | 'hover' | 'none'
}

const VARIANTS: Record<LinkVariant, string> = {
  default: 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400',
  primary: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300',
  quiet: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
  nav: 'text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400',
}

const UNDERLINES = {
  always: 'underline',
  hover: 'hover:underline',
  none: 'no-underline',
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, variant = 'default', external = false, underline = 'hover', className, ...props },
  ref,
) {
  const { LinkComponent } = useDesignSystem()
  const classes = cn(
    'inline-flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded',
    VARIANTS[variant],
    UNDERLINES[underline],
    className,
  )

  const isExternal = external || /^(https?:)?\/\//i.test(href)

  if (!isExternal && LinkComponent) {
    return (
      <LinkComponent href={href} className={classes}>
        {children}
      </LinkComponent>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
})
