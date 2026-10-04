import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  bodyClassName?: string
  headerClassName?: string
  footerClassName?: string
  style?: import('react').CSSProperties
  children?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'default'
  hover?: boolean
}

export function Card({
  children,
  header,
  footer,
  padding = 'md',
  hover = false,
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'card rounded-xl border border-slate-700/60 bg-slate-900/60 shadow-sm text-slate-100',
        hover && 'hover:shadow-md hover:border-slate-600 transition-all cursor-pointer',
        className
      )}
      {...props}
    >
      {header && (
        <div className={cn('px-6 py-4 border-b border-slate-700/60 dark:border-gray-700', headerClassName)}>
          {header}
        </div>
      )}
      
      <div className={cn(paddings[padding], bodyClassName)}>
        {children}
      </div>
      
      {footer && (
        <div className={cn('px-6 py-4 border-t border-slate-700/60 dark:border-gray-700 bg-slate-950/40 dark:bg-gray-800/50', footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-100 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-400 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
