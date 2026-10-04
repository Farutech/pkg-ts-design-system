/**
 * Table — tabla presentacional (equivalente a la `.table` de Bootstrap).
 * Para tablas con orden/paginación/acciones usar `DataTable` o `CRUDTable`.
 */
import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface TableColumn {
  key: string
  header: ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  className?: string
}

export interface TableRowData {
  id: string | number
  cells: Record<string, ReactNode>
  className?: string
}

export interface TableProps {
  columns?: TableColumn[]
  rows?: TableRowData[]
  variant?: 'default' | 'striped' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  /** Muestra la fila de encabezado en gris. */
  headerVariant?: 'light' | 'dark'
  emptyState?: ReactNode
  caption?: string
  className?: string
  tableClassName?: string
  headerClassName?: string
  bodyClassName?: string
  style?: React.CSSProperties
  children?: ReactNode
}

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-base',
}

type ThProps = ThHTMLAttributes<HTMLTableCellElement>
type TdProps = TdHTMLAttributes<HTMLTableCellElement>

function Table({ columns = [], rows = [], variant = 'default', size = 'md', headerVariant = 'light', emptyState, caption, className, tableClassName, headerClassName, bodyClassName, style, children }: TableProps) {
  if (children && (!columns.length && !rows.length)) {
    return (
      <div className={cn('w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700', className)} style={style}>
        <table className={cn("w-full border-collapse text-left", tableClassName)}>
          {caption && <caption className="sr-only">{caption}</caption>}
          {children}
        </table>
      </div>
    )
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700', className)} style={style}>
      <table className={cn("w-full border-collapse text-left", tableClassName)}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={cn(headerVariant === 'dark' ? 'bg-gray-800 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/60', headerClassName)}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  'font-semibold',
                  headerVariant === 'dark' ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300',
                  ALIGN[column.align ?? 'left'],
                  SIZES[size],
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn("divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900", bodyClassName)}>
          {rows.length === 0 && emptyState ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60',
                  variant === 'striped' && 'odd:bg-gray-50/60 dark:odd:bg-gray-800/40',
                  variant === 'bordered' && 'border-b border-gray-200 dark:border-gray-700',
                  row.className,
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'text-gray-700 dark:text-gray-300',
                      ALIGN[column.align ?? 'left'],
                      SIZES[size],
                    )}
                  >
                    {row.cells[column.key] ?? null}
                  </td>
                ))}
              </tr>
            ))
          )}
          {children}
        </tbody>
      </table>
    </div>
  )
}

export default Table
export type { ThProps, TdProps }
