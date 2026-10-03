import React from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'

export interface UploadFileItem {
  id: string
  name: string
  size: number
  type?: string
  progress?: number
  status: 'idle' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

export interface FileListProps {
  files: UploadFileItem[]
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  className?: string
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function FileList({ files, onRemove, onRetry, className }: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className={cn('space-y-2 w-full', className)}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-xs"
        >
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0">
              <Icon.Document size="sm" />
            </div>

            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatBytes(file.size)}</span>
                {file.status === 'uploading' && (
                  <span className="text-primary-600 dark:text-primary-400 font-medium">
                    · Subiendo ({file.progress || 0}%)
                  </span>
                )}
                {file.status === 'completed' && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <Icon.Success size="xs" /> Completado
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="text-red-500 flex items-center gap-0.5">
                    <Icon.Error size="xs" /> {file.error || 'Error'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3">
            {file.status === 'error' && onRetry && (
              <button
                type="button"
                onClick={() => onRetry(file.id)}
                className="text-primary-600 hover:text-primary-700 p-1 cursor-pointer"
                title="Reintentar subida"
              >
                <Icon.Refresh size="sm" />
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                title="Eliminar archivo"
              >
                <Icon.Close size="sm" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
