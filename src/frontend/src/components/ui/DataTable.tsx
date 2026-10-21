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
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState, VisibilityState, Updater } from '@tanstack/react-table'
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import type { Density } from '@/tokens/tokens'
import { useDensity, useVirtualizationConfig } from '@/providers/DesignSystemProvider'
import { BulkActionsBar } from './BulkActionsBar'
import { Card } from './Card'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'
import { DataTableToolbar } from './data-table/DataTableToolbar'
import { DataTableFilters } from './data-table/DataTableFilters'
import { DataTableEmptyState, DataTableLoadingState } from './data-table/DataTableStates'

import type {
  DataTableProps,
  FilterValue,
} from './data-table/types'
/**
 * Tipos canónicos del DataTable — fuente única: ./data-table/types (Fase 4).
 * Se re-exportan para mantener la API pública 100% compatible (sin breaking changes).
 */
export type {
  DataTablePagination,
  FilterType,
  FilterValue,
  DataTableFilter,
  FilterState,
  DataTableGlobalAction,
  DataTableActions,
  DataTableColumn,
} from './data-table/types'
export type { DataTableProps } from './data-table/types'

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
  exportTools,
  onExport,
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
  tableClassName,
  headerClassName,
  toolbarClassName,
  paginationClassName,
  rowClassName,
  style,
  children,
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

  const handleSortingChange = useCallback((updaterOrValue: Updater<SortingState>) => {
    const nextSorting = typeof updaterOrValue === 'function' ? updaterOrValue(effectiveSorting) : updaterOrValue
    setInternalSorting(nextSorting)
    onSortingChange?.(nextSorting)
  }, [effectiveSorting, onSortingChange])

  const isManualSorting = manualSorting ?? Boolean(onSortingChange)
  const isManualPagination = manualPagination ?? Boolean(pagination)
  const isManualFiltering = manualFiltering ?? Boolean(onFilterChange)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showFilters, setShowFilters] = useState(false)

  // Scroll virtual
  const [scrollTop, setScrollTop] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Agregar columna de acciones si está definida
  const enhancedColumns = useMemo(() => {
    if (!actions) return columns

    const actionsColumn: ColumnDef<T, FilterValue> = {
      id: 'actions',
      header: 'Acciones',
      enableHiding: false,
      cell: ({ row }) => (
        <CrudActions
          onView={actions.onView ? () => actions.onView?.(row.original) : undefined}
          onEdit={actions.onEdit ? () => actions.onEdit?.(row.original) : undefined}
          onDelete={actions.onDelete ? () => actions.onDelete?.(row.original) : undefined}
          onDuplicate={actions.onDuplicate ? () => actions.onDuplicate?.(row.original) : undefined}
          displayMode={actions.displayMode ?? "auto"}
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

  // Manejo de filtros
  const handleFilterChange = (filterId: string, value: FilterValue) => {
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

  // Barra superior — delegada a DataTableToolbar (Fase 4: subcomponentes atómicos)

  const renderToolbar = () => (
    <DataTableToolbar
      table={table}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      onSearch={onSearch}
      globalActions={globalActions}
      selectedRows={selectedRows}
      hasSelection={hasSelection}
      filters={filters}
      activeFiltersCount={activeFiltersCount}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
      showColumnVisibility={showColumnVisibility}
      showDensitySwitcher={showDensitySwitcher}
      density={effectiveDensity}
      onDensityChange={setCurrentDensity}
      toolbarSlot={toolbarSlot}
      toolbarClassName={toolbarClassName}
    />
  )

  // Panel de filtros — delegado a DataTableFilters (Fase 4)

  const renderFilters = () =>
    hasFilters && showFilters ? (
      <DataTableFilters
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        density={effectiveDensity}
      />
    ) : null

  // Estados vacío/carga — delegados a DataTableStates (Fase 4)

  const renderEmptyState = () => (
    <DataTableEmptyState
      message={emptyMessage}
      icon={emptyIcon}
      slot={emptySlot}
      hasActiveSearch={Boolean(searchValue)}
    />
  )

  const renderLoadingState = () => <DataTableLoadingState />

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
      <table className={cn("min-w-full divide-y divide-gray-200 dark:divide-gray-700", tableClassName)}>
        {/* Header con sticky cuando está virtualizada */}
        <thead className={cn('bg-gray-50 dark:bg-gray-800', isVirtualized && 'sticky top-0 z-10 shadow-xs', headerClassName)}>
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

          {visibleRows.map((row) => {
            const customRowClass = typeof rowClassName === 'function' ? rowClassName(row.original, visibleRows.indexOf(row)) : rowClassName;
            return (
            <tr
              key={row.id}
              className={cn(
                'transition-colors duration-150',
                customRowClass,
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
          )})}

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
                  displayMode={actions.displayMode ?? "auto"}
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


  const handleExportClick = (format: 'print' | 'csv' | 'pdf' | 'excel') => {
    if (onExport) {
      onExport(format)
    } else {
      if (format === 'print') {
        window.print()
      } else {
        alert(`Exportando datos en formato ${format.toUpperCase()}...`)
      }
    }
  }

  const renderExportBar = () => {
    if (!exportTools) return null
    const allowedFormats = Array.isArray(exportTools)
      ? exportTools
      : (['print', 'csv', 'pdf', 'excel'] as const)

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {allowedFormats.includes('print') && (
          <button
            type="button"
            onClick={() => handleExportClick('print')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span>🖨</span>
            <span>Imprimir</span>
          </button>
        )}
        {allowedFormats.includes('csv') && (
          <button
            type="button"
            onClick={() => handleExportClick('csv')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span>📄</span>
            <span>CSV</span>
          </button>
        )}
        {allowedFormats.includes('pdf') && (
          <button
            type="button"
            onClick={() => handleExportClick('pdf')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span>📑</span>
            <span>PDF</span>
          </button>
        )}
        {allowedFormats.includes('excel') && (
          <button
            type="button"
            onClick={() => handleExportClick('excel')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span>📊</span>
            <span>Excel</span>
          </button>
        )}
      </div>
    )
  }

  const content = (
    <div className={className} style={style}>
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

      {/* Children opcional: slot para contenido adicional, sub-tablas o resúmenes */}
      {typeof children === 'function'
        ? children({ table, data, selectedRows })
        : children}

      {/* Barra de Exportación y Paginación */}
      {(exportTools || (pagination && data.length > 0)) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="order-2 sm:order-1 w-full sm:w-auto">
            {renderExportBar()}
          </div>
          {pagination && data.length > 0 && (
            <div className={cn("order-1 sm:order-2 w-full sm:w-auto", paginationClassName)}>
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
