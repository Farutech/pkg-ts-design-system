import type { ReactNode, CSSProperties } from 'react'
import type { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import type { Density } from '@/tokens/tokens'
import type { BulkActionItem } from '../BulkActionsBar'

/**
 * data-table/types.ts — Tipos canónicos del DataTable (Fase 4: DataTable Desacoplado)
 *
 * Fuente única de verdad para paginación, filtros, acciones y props.
 * DataTable.tsx re-exporta estos tipos para mantener compatibilidad total.
 */

/** Configuración de paginación */
export interface DataTablePagination {
  page: number
  perPage: number
  total: number
  totalPages?: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

/** Tipo de filtro soportado por DataTableFilters */
export type FilterType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'number'
  | 'numberrange'
  | 'location'
  | 'color'

/** Valor individual de filtro (unión estricta; `FilterState` preserva compat legada) */
export type FilterValue = string | number | boolean | string[] | number[] | [string, string] | { min?: number | string; max?: number | string } | null | undefined

/** Configuración de filtro */
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
  defaultValue?: FilterValue
}

/** Estado de filtros activos (Record abierto por compatibilidad con consumidores 1.x) */
export type FilterState = Record<string, FilterValue>

/** Acción global de la tabla */
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

/** Acciones por fila */
export interface DataTableActions<T = unknown> {
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onDuplicate?: (row: T) => void
  /** Modo de visualización: "buttons" (iconos compactos), "dropdown" (menú), "auto" */
  displayMode?: 'buttons' | 'dropdown' | 'auto'
  custom?: Array<{
    label: string
    icon?: ReactNode
    onClick: (row: T) => void
    variant?: 'default' | 'danger'
    show?: (row: T) => boolean
  }>
}

/** Tipo de columna pública del DataTable */
export type DataTableColumn<T extends { id: string | number }> = ColumnDef<T, FilterValue>

/**
 * Props del componente DataTable — contrato público canónico.
 */
export interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: ColumnDef<T, FilterValue>[]

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

  // Herramientas de Exportación (Print, CSV, PDF, Excel)
  exportTools?: boolean | Array<'print' | 'csv' | 'pdf' | 'excel'>
  onExport?: (format: 'print' | 'csv' | 'pdf' | 'excel') => void

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
  tableClassName?: string
  headerClassName?: string
  toolbarClassName?: string
  paginationClassName?: string
  rowClassName?: string | ((row: T, index: number) => string)
  style?: CSSProperties
  children?: ReactNode | ((props: { table: Table<T>; data: T[]; selectedRows: Set<string | number> }) => ReactNode)
  wrapped?: boolean
}
