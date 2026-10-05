/**
 * Componente de acciones CRUD (editar, eliminar, ver, duplicar y personalizadas)
 * Soporta modo 'buttons' (iconos compactos con tooltip como en dashboards de alta densidad)
 * y modo 'dropdown' (menú flotante desplegable) con fallback automático.
 */

import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/solid'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export interface Action {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'primary'
  show?: boolean
}

export interface CrudActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  onDuplicate?: () => void
  customActions?: Action[]
  /** Modo de presentación: 'buttons' (iconos compactos), 'dropdown' (menú vertical), 'auto' (botones si <= 3, híbrido si > 3) */
  displayMode?: 'buttons' | 'dropdown' | 'auto'
  className?: string
}

export function CrudActions({
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  customActions = [],
  displayMode = 'auto',
  className,
}: CrudActionsProps) {
  const defaultActions: Action[] = [
    onView && {
      label: 'Ver detalles',
      icon: <EyeIcon className="h-3.5 w-3.5" />,
      onClick: onView,
      variant: 'info' as const,
      show: true,
    },
    onEdit && {
      label: 'Editar',
      icon: <PencilIcon className="h-3.5 w-3.5" />,
      onClick: onEdit,
      variant: 'warning' as const,
      show: true,
    },
    onDuplicate && {
      label: 'Duplicar',
      icon: <DocumentDuplicateIcon className="h-3.5 w-3.5" />,
      onClick: onDuplicate,
      variant: 'default' as const,
      show: true,
    },
    onDelete && {
      label: 'Eliminar',
      icon: <TrashIcon className="h-3.5 w-3.5" />,
      onClick: onDelete,
      variant: 'danger' as const,
      show: true,
    },
  ].filter(Boolean) as Action[]

  const allActions = [...defaultActions, ...customActions].filter((action) => action.show !== false)

  if (allActions.length === 0) return null

  // Colores armonizados para botones de acción rápida
  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'info':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/20'
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20'
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-500/20'
    }
  }

  // Renderizar en modo botones o híbrido
  if (displayMode === 'buttons' || (displayMode === 'auto' && allActions.length <= 3)) {
    return (
      <div className={cn('flex items-center gap-1.5 shrink-0', className)}>
        {allActions.map((action, index) => (
          <button
            key={index}
            type="button"
            title={action.label}
            aria-label={action.label}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick()
            }}
            className={cn(
              'p-1.5 rounded-lg shadow-sm transition-all duration-150 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500/40',
              getButtonStyles(action.variant)
            )}
          >
            {action.icon}
          </button>
        ))}
      </div>
    )
  }

  // Si displayMode === 'auto' y hay más de 3 acciones, mostrar las 2 principales + dropdown para el resto
  if (displayMode === 'auto' && allActions.length > 3) {
    const prominentActions = allActions.slice(0, 2)
    const overflowActions = allActions.slice(2)

    return (
      <div className={cn('flex items-center gap-1.5 shrink-0', className)}>
        {prominentActions.map((action, index) => (
          <button
            key={index}
            type="button"
            title={action.label}
            aria-label={action.label}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick()
            }}
            className={cn(
              'p-1.5 rounded-lg shadow-sm transition-all duration-150 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500/40',
              getButtonStyles(action.variant)
            )}
          >
            {action.icon}
          </button>
        ))}

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            title="Más acciones"
            aria-label="Más acciones"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
          >
            <EllipsisHorizontalIcon className="h-3.5 w-3.5" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 z-[100] mt-1 w-48 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700/80 ring-1 ring-black/5 focus:outline-none overflow-hidden py-1">
            {overflowActions.map((action, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick()
                    }}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3.5 py-2 text-xs transition-colors font-medium',
                      active ? 'bg-gray-50 dark:bg-gray-700/60' : '',
                      action.variant === 'danger'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-200'
                    )}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    )
  }

  // Modo dropdown puro
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <EllipsisVerticalIcon className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-[100] mt-1.5 w-52 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700/80 ring-1 ring-black/5 focus:outline-none overflow-hidden py-1">
        {allActions.map((action, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                }}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium transition-colors',
                  active && 'bg-gray-50 dark:bg-gray-700/60',
                  action.variant === 'danger'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}
