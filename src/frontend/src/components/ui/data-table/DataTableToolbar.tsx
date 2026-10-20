import { useState } from 'react'
import type { ReactNode } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon } from '@heroicons/react/24/outline'
import type { Table } from '@tanstack/react-table'
import { cn } from '@/utils/cn'
import type { Density } from '@/tokens/tokens'
import { ClickOutside } from '@/primitives'
import { Input } from '../Input'
import { Button } from '../Button'
import type { DataTableFilter, DataTableGlobalAction } from './types'

/**
 * data-table/DataTableToolbar.tsx — Barra superior del DataTable (Fase 4)
 *
 * Búsqueda + acciones globales + visibilidad de columnas + densidad.
 * Componente controlado: todo el estado vive en DataTable.
 */

export interface DataTableToolbarProps<T extends { id: string | number }> {
  table: Table<T>
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  globalActions?: DataTableGlobalAction[]
  selectedRows?: Set<string | number>
  hasSelection?: boolean
  filters?: DataTableFilter[]
  activeFiltersCount?: number
  showFilters?: boolean
  onToggleFilters?: () => void
  showColumnVisibility?: boolean
  showDensitySwitcher?: boolean
  density?: Density
  onDensityChange?: (density: Density) => void
  toolbarSlot?: ReactNode
  toolbarClassName?: string
}


export function DataTableToolbar<T extends { id: string | number }>({
  table,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearch,
  globalActions = [],
  selectedRows = new Set(),
  hasSelection = false,
  filters = [],
  activeFiltersCount = 0,
  showFilters = false,
  onToggleFilters,
  showColumnVisibility = false,
  showDensitySwitcher = false,
  density = 'compact',
  onDensityChange,
  toolbarSlot,
  toolbarClassName,
}: DataTableToolbarProps<T>) {
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)
  const hasFilters = filters.length > 0
  const visibleGlobalActions = globalActions.filter(
    (action) => !action.showOnlyWhenSelected || hasSelection,
  )
  const hasToolbar =
    searchable ||
    visibleGlobalActions.length > 0 ||
    hasFilters ||
    showColumnVisibility ||
    showDensitySwitcher ||
    Boolean(toolbarSlot)

  if (!hasToolbar) return null

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center justify-between', toolbarClassName)}>
      {searchable && (
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            prefix={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
            className="w-full"
            allowClear
            density={density}
          />
        </div>
      )}

      {toolbarSlot}

      <div className="flex gap-2 flex-wrap items-center justify-end">
        {hasFilters && (
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="sm"
            onClick={onToggleFilters}
            className="whitespace-nowrap"
          >
            <FunnelIcon className="h-4 w-4 mr-1.5" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        )}

        {showColumnVisibility && (
          <ClickOutside onClickOutside={() => setShowColumnDropdown(false)}>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="whitespace-nowrap"
                title="Visibilidad de columnas"
              >
                <EyeIcon className="h-4 w-4 mr-1.5" />
                Columnas
              </Button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-30">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-1">
                    Mostrar columnas
                  </div>
                  <div className="max-h-60 overflow-y-auto px-2 space-y-1">
                    {table.getAllLeafColumns().map((col) => {
                      if (col.id === 'actions' || col.id === '__select__') return null
                      const headerText = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id
                      return (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={col.getIsVisible()}
                            onChange={col.getToggleVisibilityHandler()}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          {headerText}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </ClickOutside>
        )}

        {showDensitySwitcher && (
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
            {(['comfortable', 'compact', 'dense'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDensityChange?.(d)}
                className={cn(
                  'px-2 py-1 rounded capitalize font-medium transition-colors',
                  density === d
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white',
                )}
              >
                {d === 'comfortable' ? 'Cómoda' : d === 'compact' ? 'Compacta' : 'Densa'}
              </button>
            ))}
          </div>
        )}

        {visibleGlobalActions.map((action, index) => {
          const isDisabled = action.requiresSelection && !hasSelection
          return (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size="sm"
              onClick={() => action.onClick(selectedRows)}
              disabled={isDisabled}
              className="whitespace-nowrap"
            >
              {action.icon && <span className="mr-1.5">{action.icon}</span>}
              {action.label}
              {action.requiresSelection && hasSelection && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                  {selectedRows.size}
                </span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
