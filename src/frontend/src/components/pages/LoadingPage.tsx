import React from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'

export interface LoadingPageProps {
  title?: string
  message?: string
  progress?: number
  fullScreen?: boolean
  className?: string
}

export function LoadingPage({
  title = 'Cargando aplicación...',
  message = 'Por favor espere mientras preparamos los datos.',
  progress,
  fullScreen = true,
  className,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-950',
        fullScreen ? 'fixed inset-0 z-50 min-h-screen' : 'min-h-[400px] w-full',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Icon.Loading size="md" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        {title}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
        {message}
      </p>

      {progress !== undefined && (
        <div className="w-64 max-w-xs mt-6 space-y-1.5">
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
