/**
 * Timeline — línea de tiempo vertical de eventos/estados (AntD Timeline).
 */
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TimelineItem {
  /** Título del hito. */
  title: ReactNode
  /** Detalle opcional bajo el título. */
  description?: ReactNode
  /** Marca de tiempo (texto, ej. "Hoy 10:24"). */
  time?: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
  /** Icono personalizado en el nodo (por defecto un punto). */
  icon?: ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const DOT_COLORS: Record<NonNullable<TimelineItem['color']>, string> = {
  primary: 'bg-primary-600 ring-primary-100 dark:ring-primary-900/40',
  success: 'bg-success ring-green-100 dark:ring-green-900/40',
  warning: 'bg-warning ring-yellow-100 dark:ring-yellow-900/40',
  danger: 'bg-danger ring-red-100 dark:ring-red-900/40',
  gray: 'bg-gray-400 ring-gray-100 dark:ring-gray-800',
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('m-0 flex list-none flex-col p-0', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Columna de nodos */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'z-10 mt-1 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full ring-4',
                  DOT_COLORS[item.color ?? 'primary'],
                )}
              >
                {item.icon && <span className="[&>svg]:h-2 [&>svg]:w-2 text-white">{item.icon}</span>}
              </span>
              {!isLast && <span className="w-px flex-1 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
            </div>
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="m-0 text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                {item.time && <span className="text-xs text-gray-400">{item.time}</span>}
              </div>
              {item.description && (
                <div className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
