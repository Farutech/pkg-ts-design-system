/**
 * SideNavItem — Ítem reutilizable de navegación lateral.
 *
 * Elemento base de un menú lateral: icono, etiqueta, descripción opcional,
 * badge opcional y estado activo. Pensado para apps consumidoras que componen
 * su propio menú sin depender de react-router ni de los stores del DS
 * (a diferencia de `layout/Sidebar`, que exige router + ConfigContext).
 *
 * Estilos 100% tokens (`primary-*`, `gray-*`, variantes `dark:`) — sin colores
 * quemados (REQ-DS-01). El `className` del consumidor siempre gane vía `cn()`.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface SideNavItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> {
  /** Etiqueta principal del ítem */
  label: string
  /** Descripción secundaria opcional (se muestra debajo de la etiqueta) */
  description?: string
  /** Ícono (SVG o componente) alineado a la izquierda */
  icon?: ReactNode
  /** Contenido del badge a la derecha (contador, texto corto) */
  badge?: ReactNode
  /** Clase adicional para personalizar el badge (color por app) */
  badgeClassName?: string
  /** Estado activo/seleccionado del ítem */
  active?: boolean
  /** Acción al hacer clic */
  onClick?: () => void
}

export function SideNavItem({
  label,
  description,
  icon,
  badge,
  badgeClassName,
  active = false,
  onClick,
  className,
  disabled,
  ...props
}: SideNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-primary-500/40 bg-primary-500/10 text-primary-600 font-medium dark:text-primary-300'
          : 'border-transparent text-gray-600 hover:bg-gray-100/70 dark:text-gray-400 dark:hover:bg-gray-700/40',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold">{label}</span>
          {badge !== undefined && badge !== null && (
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold',
                'bg-primary-500/15 text-primary-600 dark:text-primary-300',
                badgeClassName
              )}
            >
              {badge}
            </span>
          )}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-xs font-normal text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
      </span>
    </button>
  )
}

export default SideNavItem
