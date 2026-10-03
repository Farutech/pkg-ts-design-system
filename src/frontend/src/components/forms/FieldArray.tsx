import React from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'

export interface FieldArrayItem<T = any> {
  id: string
  data: T
}

export interface FieldArrayProps<T = any> {
  label?: React.ReactNode
  description?: React.ReactNode
  items: FieldArrayItem<T>[]
  onAdd: () => void
  onRemove: (index: number) => void
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
  renderItem: (item: FieldArrayItem<T>, index: number) => React.ReactNode
  addLabel?: string
  maxItems?: number
  minItems?: number
  disabled?: boolean
  className?: string
}

/**
 * FieldArray - Componente empresarial para listas dinámicas de formularios repetitivos
 * (líneas de pedido, direcciones, contactos, teléfonos).
 */
export function FieldArray<T = any>({
  label,
  description,
  items,
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
  renderItem,
  addLabel = 'Agregar elemento',
  maxItems,
  minItems = 0,
  disabled = false,
  className,
}: FieldArrayProps<T>) {
  const canAdd = !disabled && (maxItems === undefined || items.length < maxItems)

  return (
    <div className={cn('w-full space-y-3', className)}>
      {(label || description) && (
        <div>
          {label && (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h4>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {items.map((item, index) => {
          const canRemove = !disabled && items.length > minItems
          const canMoveUp = !disabled && onMoveUp && index > 0
          const canMoveDown = !disabled && onMoveDown && index < items.length - 1

          return (
            <div
              key={item.id}
              className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 transition-shadow hover:shadow-xs"
            >
              <div className="flex-1">
                {renderItem(item, index)}
              </div>

              {/* Controles de ordenamiento y eliminación */}
              <div className="flex items-center gap-1 pt-1">
                {onMoveUp && (
                  <button
                    type="button"
                    onClick={() => onMoveUp(index)}
                    disabled={!canMoveUp}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Mover arriba"
                  >
                    <Icon.ChevronUp size="xs" />
                  </button>
                )}
                {onMoveDown && (
                  <button
                    type="button"
                    onClick={() => onMoveDown(index)}
                    disabled={!canMoveDown}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Mover abajo"
                  >
                    <Icon.ChevronDown size="xs" />
                  </button>
                )}
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    title="Eliminar elemento"
                  >
                    <Icon.Trash size="xs" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {canAdd && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAdd}
          className="flex items-center gap-1 mt-2"
        >
          <Icon.Plus size="xs" />
          <span>{addLabel}</span>
        </Button>
      )}
    </div>
  )
}
