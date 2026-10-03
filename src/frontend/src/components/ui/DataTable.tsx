/**
 * DataTable - Componente de tabla de datos empresarial de alto rendimiento.
 * 
 * Características Best-of-Breed:
 * - ✅ Virtualización automática transparente (> umbral ConfigProvider) + escape hatch (`virtualized={true | false}`).
 * - ✅ Sistema de densidad configurable (`comfortable`, `compact`, `dense`) con switcher opcional.
 * - ✅ Control dinámico de visibilidad de columnas (Column Visibility popover).
 * - ✅ Barra flotante de acciones masivas integrada (`BulkActionsBar`).
 * - ✅ Búsqueda integrada y debounce.
 * - ✅ Filtros tipados (texto, select, multiselect, date, daterange, number, color, location).
 * - ✅ Selección simple y múltiple reactiva.
 * - ✅ Responsive (cards mobile adaptativas).
 * - ✅ Ordenamiento por columnas y paginación enterprise.
 */

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState, VisibilityState } from '@tanstack/react-table'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  InboxIcon,
  FunnelIcon,
  XMarkIcon,
  EyeIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import type { Density } from '@/tokens/tokens'
import { useDensity, useVirtualizationConfig } from '@/providers/DesignSystemProvider'
import { ClickOutside } from '@/primitives/ClickOutside'
import { BulkActionsBar } from './BulkActionsBar'
import type { BulkActionItem } from './BulkActionsBar'
import { Card } from './Card'
import { Input } from './Input'
import { Select } from './Select'
import { Button } from './Button'
import { DatePicker, DateRangePicker } from './DateControls'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'

/**
 * Configuración de paginación
 */
export interface DataTablePagination {
  page: number
  perPage: number
  total: number
  totalPages?: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

/**
 * Tipo de filtro
 */
export type FilterType = 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'numberrange' | 'location' | 'color'

/**
 * Configuración de filtro
 */
export interface DataTableFilter {
  /** ID del filtro (debe coincidir con el accessorKey de la columna) */
  id: string
  /** Etiqueta del filtro */
  label: string
  /** Tipo de filtro */
  type: FilterType
  /** Opciones para select/multiselect */
  options?: Array<{ label: string; value: string | number }>
  /** Placeholder del input */
  placeholder?: string
  /** Ancho del filtro (clases de Tailwind) */
  width?: string
  /** Valor por defecto */
  defaultValue?: any
}

/**
 * Estado de filtros activos
 */
export type FilterState = Record<string, any>

/**
 * Acción global de la tabla
 */
export interface DataTableGlobalAction {
  /** Etiqueta del botón */
  label: string
  /** Ícono opcional */
  icon?: ReactNode
  /** Variante de estilo */
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  /** Función onClick: si requiresSelection=true, recibe los IDs seleccionados */
  onClick: (selectedIds?: Set<string | number>) => void
  /** Requiere que haya filas seleccionadas para habilitarse */
  requiresSelection?: boolean
  /** Mostrar solo cuando hay selección */
  showOnlyWhenSelected?: boolean
}

/**
 * Acciones por fila
 */
export interface DataTableActions<T = any> {
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onDuplicate?: (row: T) => void
  custom?: Array<{
    label: string
    icon?: ReactNode
    onClick: (row: T) => void
    variant?: 'default' | 'danger'
    show?: (row: T) => boolean
  }>
}

/**
 * Props del componente DataTable
 */
export interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: ColumnDef<T, any>[]
  
  // Estados
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  emptySlot?: ReactNode
  
  // Paginación
  pagination?: DataTablePagination
  /** Mostrar header también en footer (útil para tablas largas) */
  showFooter?: boolean
  
  // Búsqueda
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  
  // Filtros
  filters?: DataTableFilter[]
  filterValues?: FilterState
  onFilterChange?: (filters: FilterState) => void

  // Control Remoto / Server-Side Ready
  /** Estado de ordenamiento controlado (permite delegar el orden al servidor) */
  sorting?: SortingState
  /** Callback cuando cambia el ordenamiento (emite el nuevo SortingState al backend) */
  onSortingChange?: (sorting: SortingState) => void
  /** Forzar modo manual de ordenamiento (evita reordenar en cliente cuando data ya viene ordenada) */
  manualSorting?: boolean
  /** Forzar modo manual de paginación (evita paginar en cliente cuando data ya es la página actual) */
  manualPagination?: boolean
  /** Forzar modo manual de filtros (evita filtrar en cliente cuando el backend aplica los filtros) */
  manualFiltering?: boolean
  
  // Selección
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selected: Set<string | number>) => void
  
  // Acciones masivas
  bulkActions?: BulkActionItem[]
  onClearSelection?: () => void

  // Acciones
  actions?: DataTableActions<T>
  globalActions?: DataTableGlobalAction[]
  onRowClick?: (row: T) => void

  // Virtualización (Modelo de 3 estados: auto si > threshold, true para forzar, false para desactivar)
  virtualized?: boolean
  virtualScrollHeight?: number | string

  // Densidad
  density?: Density
  showDensitySwitcher?: boolean

  // Visibilidad de columnas
  showColumnVisibility?: boolean

  // Slots
  toolbarSlot?: ReactNode
  
  // Responsive
  responsiveCards?: boolean
  
  // Estilos
  className?: string
  wrapped?: boolean
}

/**
 * Componente DataTable
 */
export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No hay registros disponibles',
  emptyIcon,
  emptySlot,
  pagination,
  showFooter = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearch,
  filters = [],
  filterValues = {},
  onFilterChange,
  sorting: propSorting,
  onSortingChange,
  manualSorting,
  manualPagination,
  manualFiltering,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  bulkActions,
  onClearSelection,
  actions,
  globalActions = [],
  onRowClick,
  virtualized,
  virtualScrollHeight = 520,
  density: propDensity,
  showDensitySwitcher = false,
  showColumnVisibility = false,
  toolbarSlot,
  responsiveCards = true,
  className,
  wrapped = true,
}: DataTableProps<T>) {
  const contextDensity = useDensity()
  const virtConfig = useVirtualizationConfig()

  // Control local de densidad si el switcher está activo
  const [currentDensity, setCurrentDensity] = useState<Density>(propDensity || contextDensity)

  useEffect(() => {
    if (propDensity) setCurrentDensity(propDensity)
  }, [propDensity])

  const effectiveDensity = propDensity || currentDensity

  // Modelo de 3 estados de virtualización:
  // - virtualized === true: fuerza virtualización
  // - virtualized === false: desactiva virtualización (escape hatch)
  // - virtualized === undefined: auto si data.length > virtConfig.tableThreshold (default: 100)
  const isVirtualized = virtualized === true || (virtualized !== false && data.length > (virtConfig?.tableThreshold ?? 100))

  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const effectiveSorting = propSorting !== undefined ? propSorting : internalSorting

  const handleSortingChange = useCallback((updaterOrValue: any) => {
    const nextSorting = typeof updaterOrValue === 'function' ? updaterOrValue(effectiveSorting) : updaterOrValue
    setInternalSorting(nextSorting)
    onSortingChange?.(nextSorting)
  }, [effectiveSorting, onSortingChange])

  const isManualSorting = manualSorting ?? Boolean(onSortingChange)
  const isManualPagination = manualPagination ?? Boolean(pagination)
  const isManualFiltering = manualFiltering ?? Boolean(onFilterChange)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)

  // Scroll virtual
  const [scrollTop, setScrollTop] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Agregar columna de acciones si está definida
  const enhancedColumns = useMemo(() => {
    if (!actions) return columns

    const actionsColumn: ColumnDef<T, any> = {
      id: 'actions',
      header: 'Acciones',
      enableHiding: false,
      cell: ({ row }) => (
        <CrudActions
          onView={actions.onView ? () => actions.onView?.(row.original) : undefined}
          onEdit={actions.onEdit ? () => actions.onEdit?.(row.original) : undefined}
          onDelete={actions.onDelete ? () => actions.onDelete?.(row.original) : undefined}
          onDuplicate={actions.onDuplicate ? () => actions.onDuplicate?.(row.original) : undefined}
          customActions={actions.custom?.map((action) => ({
            label: action.label,
            icon: action.icon,
            onClick: () => action.onClick(row.original),
            variant: action.variant,
            show: action.show ? action.show(row.original) : true,
          }))}
        />
      ),
    }

    return [...columns, actionsColumn]
  }, [columns, actions])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting: effectiveSorting,
      columnVisibility,
    },
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: isManualSorting ? undefined : getSortedRowModel(),
    manualSorting: isManualSorting,
    manualPagination: isManualPagination,
    manualFiltering: isManualFiltering,
  })

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)))
    }
  }

  const handleSelectRow = (id: string | number) => {
    if (!onSelectionChange) return
    
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }

  const handleClearSelectionInternal = () => {
    if (onClearSelection) {
      onClearSelection()
    } else if (onSelectionChange) {
      onSelectionChange(new Set())
    }
  }

  const hasSelection = selectedRows.size > 0
  const visibleGlobalActions = globalActions.filter(
    (action) => !action.showOnlyWhenSelected || hasSelection
  )

  // Manejo de filtros
  const handleFilterChange = (filterId: string, value: any) => {
    if (!onFilterChange) return
    
    const newFilters = { ...filterValues, [filterId]: value }
    
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId]
    }
    
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    if (!onFilterChange) return
    onFilterChange({})
  }

  const activeFiltersCount = Object.keys(filterValues).length
  const hasFilters = filters.length > 0

  // Cálculo de filas virtuales
  const rowHeightMap: Record<Density, number> = {
    dense: 36,
    compact: 44,
    comfortable: 54,
  }
  const estimatedRowHeight = rowHeightMap[effectiveDensity]
  const allRows = table.getRowModel().rows
  const totalRowsCount = allRows.length

  const virtualScrollContainerHeight = typeof virtualScrollHeight === 'number' ? virtualScrollHeight : 520
  const startIndex = isVirtualized ? Math.max(0, Math.floor(scrollTop / estimatedRowHeight) - 4) : 0
  const endIndex = isVirtualized ? Math.min(totalRowsCount, Math.ceil((scrollTop + Number(virtualScrollContainerHeight)) / estimatedRowHeight) + 4) : totalRowsCount
  const visibleRows = isVirtualized ? allRows.slice(startIndex, endIndex) : allRows

  const topSpacerHeight = isVirtualized ? startIndex * estimatedRowHeight : 0
  const bottomSpacerHeight = isVirtualized ? Math.max(0, (totalRowsCount - endIndex) * estimatedRowHeight) : 0

  // Clases según densidad
  const thPaddingClass = {
    comfortable: 'px-4 py-3.5 text-xs',
    compact: 'px-3 py-2.5 text-xs',
    dense: 'px-2 py-1.5 text-[11px]',
  }[effectiveDensity]

  const tdPaddingClass = {
    comfortable: 'px-4 py-3.5 text-sm',
    compact: 'px-3 py-2 text-sm',
    dense: 'px-2 py-1 text-xs',
  }[effectiveDensity]

  // Renderizar barra de acciones globales, búsqueda y controles de vista
  const renderToolbar = () => {
    const hasToolbar =
      searchable ||
      visibleGlobalActions.length > 0 ||
      hasFilters ||
      showColumnVisibility ||
      showDensitySwitcher ||
      Boolean(toolbarSlot)

    if (!hasToolbar) return null

    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center justify-between">
        {/* Búsqueda */}
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
              density={effectiveDensity}
            />
          </div>
        )}

        {/* Slot personalizado de Toolbar */}
        {toolbarSlot}

        {/* Acciones globales + Herramientas de visualización */}
        <div className="flex gap-2 flex-wrap items-center justify-end">
          {/* Botón de filtros */}
          {hasFilters && (
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
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

          {/* Selector de columnas */}
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
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-30 animate-in fade-in">
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
                              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="truncate">{headerText}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ClickOutside>
          )}

          {/* Switcher de Densidad */}
          {showDensitySwitcher && (
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-0.5 bg-gray-50 dark:bg-gray-800 text-xs">
              {(['comfortable', 'compact', 'dense'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setCurrentDensity(d)}
                  className={cn(
                    'px-2 py-1 rounded capitalize font-medium transition-colors',
                    effectiveDensity === d
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {d === 'comfortable' ? 'Cómoda' : d === 'compact' ? 'Compacta' : 'Densa'}
                </button>
              ))}
            </div>
          )}

          {/* Acciones globales */}
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

  // Renderizar filtros
  const renderFilters = () => {
    if (!hasFilters || !showFilters) return null

    return (
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FunnelIcon className="h-4 w-4" />
            Filtros Activos
          </h4>
          {activeFiltersCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              <XMarkIcon className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filters.map((filter) => (
            <div key={filter.id} className={filter.width || 'col-span-1'}>
              {renderFilterControl(filter)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar control de filtro según tipo
  const renderFilterControl = (filter: DataTableFilter) => {
    const value = filterValues[filter.id]

    switch (filter.type) {
      case 'text':
        return (
          <Input
            label={filter.label}
            placeholder={filter.placeholder || `Buscar por ${filter.label.toLowerCase()}...`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            density={effectiveDensity}
          />
        )

      case 'select':
        return (
          <Select
            label={filter.label}
            value={value || ''}
            onChange={(val: any) => handleFilterChange(filter.id, typeof val === 'string' ? val : val?.target?.value)}
            options={[
              { label: `Todos los ${filter.label.toLowerCase()}`, value: '' },
              ...(filter.options || []),
            ]}
          />
        )

      case 'multiselect':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <select
              multiple
              value={value || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                handleFilterChange(filter.id, selected)
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mantén Ctrl/Cmd para seleccionar múltiples
            </p>
          </div>
        )

      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <DatePicker
              value={value ? new Date(value) : null}
              onChange={(date) => handleFilterChange(filter.id, date?.toISOString())}
              placeholder={filter.placeholder}
            />
          </div>
        )

      case 'daterange':
        return (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <DateRangePicker
              value={value ? [new Date(value[0]), new Date(value[1])] : [null, null]}
              onChange={(range) => {
                if (range[0] && range[1]) {
                  handleFilterChange(filter.id, [range[0].toISOString(), range[1].toISOString()])
                } else {
                  handleFilterChange(filter.id, null)
                }
              }}
            />
          </div>
        )

      case 'number':
        return (
          <Input
            type="number"
            label={filter.label}
            placeholder={filter.placeholder || `Filtrar por ${filter.label.toLowerCase()}...`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value ? Number(e.target.value) : '')}
            density={effectiveDensity}
          />
        )

      case 'numberrange':
        return (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={value?.min || ''}
                onChange={(e) => {
                  const newValue = { ...(value || {}), min: e.target.value ? Number(e.target.value) : undefined }
                  handleFilterChange(filter.id, newValue.min || newValue.max ? newValue : null)
                }}
                density={effectiveDensity}
              />
              <Input
                type="number"
                placeholder="Máximo"
                value={value?.max || ''}
                onChange={(e) => {
                  const newValue = { ...(value || {}), max: e.target.value ? Number(e.target.value) : undefined }
                  handleFilterChange(filter.id, newValue.min || newValue.max ? newValue : null)
                }}
                density={effectiveDensity}
              />
            </div>
          </div>
        )

      case 'location':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <Input
              placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              prefix={<span className="text-gray-400">📍</span>}
              density={effectiveDensity}
            />
            {filter.options && filter.options.length > 0 && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Ubicaciones disponibles: {filter.options.map(o => o.label).join(', ')}
              </div>
            )}
          </div>
        )

      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            {filter.options && filter.options.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange(filter.id, option.value)}
                    className={cn(
                      'relative w-10 h-10 rounded-lg border-2 transition-all',
                      value === option.value
                        ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: String(option.value) }}
                    title={option.label}
                  >
                    {value === option.value && (
                      <svg
                        className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
                {value && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(filter.id, null)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    title="Limpiar color"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <Input
                  placeholder="#000000"
                  value={value || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="flex-1"
                  density={effectiveDensity}
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(filter.id, null)}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Empty state mejorado con soporte de emptySlot
  const renderEmptyState = () => {
    if (emptySlot) return emptySlot

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          {emptyIcon || <InboxIcon className="h-16 w-16" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {searchValue
            ? 'Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.'
            : 'Comienza agregando nuevos registros usando el botón de arriba.'}
        </p>
      </div>
    )
  }

  // Loading skeleton
  const renderLoadingState = () => (
    <div className="animate-pulse space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  )

  // Renderizar tabla desktop con virtualización matemática
  const renderDesktopTable = () => (
    <div
      ref={scrollContainerRef}
      onScroll={isVirtualized ? handleScroll : undefined}
      style={isVirtualized ? { maxHeight: virtualScrollContainerHeight, overflowY: 'auto' } : undefined}
      className="hidden md:block overflow-x-auto relative"
      data-virtualized={isVirtualized}
      data-density={effectiveDensity}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header con sticky cuando está virtualizada */}
        <thead className={cn('bg-gray-50 dark:bg-gray-800', isVirtualized && 'sticky top-0 z-10 shadow-xs')}>
          <tr>
            {selectable && (
              <th className={cn('w-12 text-center', thPaddingClass)}>
                <input
                  type="checkbox"
                  aria-label="Seleccionar todas las filas"
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {table.getHeaderGroups()[0]?.headers.map((header) => (
              <th
                key={header.id}
                className={cn('text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider', thPaddingClass)}
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="flex flex-col">
                        <ChevronUpIcon
                          className={cn(
                            'h-3 w-3 -mb-1',
                            header.column.getIsSorted() === 'asc' ? 'text-primary-600' : 'text-gray-300'
                          )}
                        />
                        <ChevronDownIcon
                          className={cn(
                            'h-3 w-3',
                            header.column.getIsSorted() === 'desc' ? 'text-primary-600' : 'text-gray-300'
                          )}
                        />
                      </span>
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {/* Top spacer row para virtualización */}
          {topSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: topSpacerHeight, border: 'none' }}>
              <td colSpan={100} style={{ padding: 0, height: topSpacerHeight, border: 'none' }} />
            </tr>
          )}

          {visibleRows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'transition-colors duration-150',
                onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                selectedRows.has(row.original.id) && 'bg-primary-50 dark:bg-primary-900/20'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              {selectable && (
                <td className={cn('w-12 text-center', tdPaddingClass)}>
                  <input
                    type="checkbox"
                    aria-label={`Seleccionar fila ${row.original.id}`}
                    checked={selectedRows.has(row.original.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectRow(row.original.id)
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                </td>
              )}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cn('text-gray-700 dark:text-gray-300', tdPaddingClass)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {/* Bottom spacer row para virtualización */}
          {bottomSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: bottomSpacerHeight, border: 'none' }}>
              <td colSpan={100} style={{ padding: 0, height: bottomSpacerHeight, border: 'none' }} />
            </tr>
          )}
        </tbody>

        {/* Footer (opcional) */}
        {showFooter && (
          <tfoot className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && <th className="w-12" />}
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <th
                  key={`footer-${header.id}`}
                  className={cn('text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider', thPaddingClass)}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )

  // Renderizar cards mobile
  const renderMobileCards = () => {
    if (!responsiveCards) return null

    return (
      <div className="md:hidden space-y-3">
        {allRows.map((row) => (
          <Card
            key={row.id}
            className={cn(
              'p-4',
              onRowClick && 'cursor-pointer active:scale-[0.98]',
              selectedRows.has(row.original.id) && 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
            )}
            onClick={() => onRowClick?.(row.original)}
          >
            {selectable && (
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.original.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectRow(row.original.id)
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seleccionar
                  </span>
                </label>
              </div>
            )}

            <div className="space-y-2">
              {row.getVisibleCells().map((cell) => {
                if (cell.column.id === 'actions') return null

                const header = cell.column.columnDef.header
                const headerText = typeof header === 'string' ? header : cell.column.id

                return (
                  <div key={cell.id} className="flex justify-between items-start gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide min-w-[80px]">
                      {headerText}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-right flex-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                )
              })}
            </div>

            {actions && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <CrudActions
                  onView={actions.onView ? () => actions.onView?.(row.original) : undefined}
                  onEdit={actions.onEdit ? () => actions.onEdit?.(row.original) : undefined}
                  onDelete={actions.onDelete ? () => actions.onDelete?.(row.original) : undefined}
                  onDuplicate={actions.onDuplicate ? () => actions.onDuplicate?.(row.original) : undefined}
                  customActions={actions.custom?.map((action) => ({
                    label: action.label,
                    icon: action.icon,
                    onClick: () => action.onClick(row.original),
                    variant: action.variant,
                    show: action.show ? action.show(row.original) : true,
                  }))}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    )
  }

  const content = (
    <div className={className}>
      {renderToolbar()}
      {renderFilters()}

      {isLoading ? (
        renderLoadingState()
      ) : data.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {renderDesktopTable()}
          {renderMobileCards()}
        </>
      )}

      {/* Paginación */}
      {pagination && data.length > 0 && (
        <div className="mt-4">
          <CrudPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages || Math.ceil(pagination.total / pagination.perPage)}
            perPage={pagination.perPage}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            onPerPageChange={pagination.onPerPageChange}
          />
        </div>
      )}

      {/* BulkActionsBar integrado al seleccionar filas */}
      {selectable && hasSelection && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          onClearSelection={handleClearSelectionInternal}
          actions={bulkActions}
        />
      )}
    </div>
  )

  return wrapped ? <Card>{content}</Card> : content
}
