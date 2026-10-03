import React from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'

export interface UploadProgressProps {
  /** Porcentaje de carga (0 a 100) */
  progress: number
  /** Estado de la carga */
  status?: 'uploading' | 'completed' | 'error' | 'paused'
  /** Nombre del archivo asociado */
  fileName?: string
  /** Mensaje de estado o error opcional */
  message?: string
  /** Callback para cancelar la subida */
  onCancel?: () => void
  /** Callback para reintentar la subida */
  onRetry?: () => void
  className?: string
}

export function UploadProgress({
  progress,
  status = 'uploading',
  fileName,
  message,
  onCancel,
  onRetry,
  className,
}: UploadProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const statusColors = {
    uploading: 'bg-primary-600',
    completed: 'bg-emerald-600',
    error: 'bg-red-600',
    paused: 'bg-amber-500',
  }[status]

  return (
    <div className={cn('w-full space-y-1.5 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
          {fileName || 'Subiendo archivo...'}
        </span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {clampedProgress}%
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 ease-out rounded-full', statusColors)}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-0.5">
        <span>{message || (status === 'completed' ? 'Carga completada' : status === 'error' ? 'Error en la subida' : 'Subiendo...')}</span>

        <div className="flex items-center gap-2">
          {status === 'error' && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
            >
              Reintentar
            </button>
          )}
          {status === 'uploading' && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-red-500 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Icon.Close size="xs" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
