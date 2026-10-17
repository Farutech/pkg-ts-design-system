import React, { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { DEFAULT_PER_PAGE_OPTIONS } from './CrudPagination'
export { DEFAULT_PER_PAGE_OPTIONS } from './CrudPagination'

export interface Column<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface GlobalAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  disabled?: boolean
  tooltip?: string
}

export interface RowAction<T = any> {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: (record: T) => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  disabled?: (record: T) => boolean
  tooltip?: string
  showInMenu?: boolean
}

export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'multiselect' | 'custom'
  placeholder?: string
  options?: { value: string | number; label: string }[]
  render?: (onChange: (value: any) => void, value: any) => React.ReactNode
}

export interface CRUDTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  globalActions?: GlobalAction[]
  rowActions?: RowAction<T>[]
  onCreate?: () => void
  createLabel?: string
  showCreateButton?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  filters?: FilterConfig[]
  onFilterChange?: (filters: Record<string, any>) => void
  pagination?: boolean
  pageSize?: number
  perPageOptions?: number[];
  showJumpToPage?: boolean;
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  currentPage?: number;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  className?: string;
}

/**
 * CRUDTable
 * 
 * @deprecated CRUDTable ha sido unificado sobre el motor de `DataTable`.
 * Utilice `<DataTable />` o el orquestador `<CRUDPage />` en su lugar.
 * Este shim garantiza compatibilidad al 100% sin breaking changes hasta v2.0.0.
 */
export function CRUDTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  globalActions = [],
  rowActions = [],
  onCreate,
  createLabel = 'Nuevo',
  showCreateButton = true,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pagination = true,
  pageSize = 10,
  currentPage,
  total,
  onPageChange,
  emptyStateTitle = 'Sin datos',
  emptyStateDescription = 'No hay registros disponibles',
  className,
}: CRUDTableProps<T>) {
  const tanstackColumns = useMemo<ColumnDef<T, any>[]>(() => {
    const cols: ColumnDef<T, any>[] = columns.map((col) => ({
      id: String(col.key),
      header: col.label,
      accessorKey: String(col.key),
      enableSorting: col.sortable ?? false,
      cell: col.render
        ? ({ row, getValue }) => col.render!(getValue(), row.original, row.index)
        : undefined,
    }))

    if (rowActions && rowActions.length > 0) {
      cols.push({
        id: '_actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap">
            {rowActions.map((action) => {
              const isDisabled = action.disabled ? action.disabled(row.original) : false
              return (
                <button
                  key={action.id}
                  type="button"
                  title={action.tooltip || action.label}
                  disabled={isDisabled}
                  onClick={() => action.onClick(row.original)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed shrink-0 whitespace-nowrap inline-flex items-center gap-1 [&>svg]:shrink-0"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        ),
      })
    }

    return cols
  }, [columns, rowActions])

  return (
    <div className={className}>
      {(showCreateButton && onCreate) || (globalActions && globalActions.length > 0) ? (
        <div className="mb-4 flex items-center justify-end gap-2 shrink-0 whitespace-nowrap">
          {globalActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              icon={action.icon}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
          {showCreateButton && onCreate && (
            <Button variant="primary" size="sm" onClick={onCreate}>
              {createLabel}
            </Button>
          )}
        </div>
      ) : null}

      <DataTable<T>
        data={data}
        columns={tanstackColumns}
        isLoading={loading}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        pagination={
          pagination
            ? {
                page: currentPage || 1,
                perPage: pageSize || 10,
                total: total || data.length,
                onPageChange: (p) => onPageChange?.(p, pageSize || 10),
              }
            : undefined
        }
        emptyMessage={emptyStateTitle || emptyStateDescription}
      />
    </div>
  )
}
