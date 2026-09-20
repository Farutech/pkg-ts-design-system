import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type BadgeVariant = 'neutral' | 'default' | 'outline' | 'primary' | 'success' | 'danger' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  mono?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  mono = false,
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  }

  const sizes: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'ft-badge',
        `ft-badge--${variant}`,
        `ft-badge--${size}`,
        mono && 'ft-badge--mono font-mono',
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className="ft-badge__dot w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"
          aria-hidden="true"
        />
      )}
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

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? 'neutral'} dot>
      {label ?? status}
    </Badge>
  )
}

