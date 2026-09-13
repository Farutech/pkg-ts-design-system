/**
 * Badge — API RECONCILIADA (TASK-201 / doc 08 req. 2).
 *
 * Superset de las implementaciones originales, una sola API:
 *  - de dashboard:  Badge variantes semanticas + size.
 *  - de apps/frontend: Tag (chip mono neutral) y StatusBadge (punto de estado).
 * Mapeo de migracion: dashboard 'default' -> 'neutral'; Tag -> variant='outline'
 * mono; StatusBadge -> preset <StatusBadge status=...> basado en este Badge.
 */
import type { ReactNode } from 'react'
import clsx from 'clsx'
import './Badge.css'

export type BadgeVariant = 'neutral' | 'default' | 'outline' | 'primary' | 'success' | 'danger' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  /** Punto de estado a la izquierda (cubre el caso StatusBadge). */
  dot?: boolean
  /** Tipografía mono (cubre el caso Tag del website). */
  mono?: boolean
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'md', dot = false, mono = false, className }: BadgeProps) {
  const normalizedVariant = variant === 'default' ? 'neutral' : variant
  return (
    <span
      className={clsx(
        'ft-badge',
        `ft-badge--${normalizedVariant}`,
        `ft-badge--${size}`,
        mono && 'ft-badge--mono',
        className,
      )}
    >
      {dot && <span className="ft-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  live: 'success',
  success: 'success',
  wip: 'warning',
  warning: 'warning',
  dev: 'info',
  info: 'info',
  error: 'danger',
  danger: 'danger',
}

/** Preset oficial para estados (migra StatusBadge de apps/frontend sin duplicar Badge). */
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? 'neutral'} dot>
      {label ?? status}
    </Badge>
  )
}
