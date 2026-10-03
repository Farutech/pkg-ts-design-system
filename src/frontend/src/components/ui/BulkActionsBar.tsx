import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Button } from './Button'

export interface BulkActionItem {
  id: string
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  disabled?: boolean
}

export interface BulkActionsBarProps {
  /** Cantidad de elementos actualmente seleccionados */
  selectedCount: number
  /** Callback para limpiar la selección actual */
  onClearSelection?: () => void
  /** Lista de acciones rápidas */
  actions?: BulkActionItem[]
  /** Nodos de acción personalizados (reemplaza o complementa actions) */
  children?: ReactNode
  /** Si debe flotar fijo al fondo de la pantalla (default: true) */
  floating?: boolean
  className?: string
}

/**
 * BulkActionsBar:
 * Barra flotante animada que emerge cuando hay 1 o más elementos seleccionados
 * en una tabla o lista, facilitando operaciones masivas (exportar, eliminar, cambiar estado).
 */
export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  actions = [],
  children,
  floating = true,
  className,
}: BulkActionsBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div
      role="region"
      aria-label="Acciones masivas de selección"
      className={cn(
        'z-40 flex items-center justify-between gap-4 px-4 py-2.5 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4',
        floating
          ? 'fixed bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-[90vw]'
          : 'w-full my-3',
        className
      )}
    >
      {/* Contador y botón de deseleccionar */}
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center bg-primary-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">
          {selectedCount === 1 ? '1 elemento seleccionado' : `${selectedCount} seleccionados`}
        </span>

        {onClearSelection && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-xs text-gray-400 hover:text-white underline ml-1 cursor-pointer transition-colors"
          >
            Deseleccionar
          </button>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant={action.variant ?? 'secondary'}
            onClick={action.onClick}
            disabled={action.disabled}
            className="text-xs"
          >
            {action.icon && <span className="mr-1.5">{action.icon}</span>}
            {action.label}
          </Button>
        ))}

        {children}
      </div>
    </div>
  )
}
