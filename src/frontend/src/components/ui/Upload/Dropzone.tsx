import React, { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'
import { Button } from '@/components/ui/Button'
import { useI18n } from '@/i18n/I18nContext'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'

export interface DropzoneProps {
  /** Formatos de archivo aceptados (ej. 'image/*', '.pdf,.docx') */
  accept?: string
  /** Tamaño máximo permitido en bytes (default: 10MB = 10 * 1024 * 1024) */
  maxSizeBytes?: number
  /** Permitir selección de múltiples archivos */
  multiple?: boolean
  /** Desactivar el componente */
  disabled?: boolean
  /** Callback al seleccionar o soltar archivos válidos */
  onFilesAccepted?: (files: File[]) => void
  /** Callback ante archivos rechazados con el motivo */
  onFilesRejected?: (rejected: Array<{ file: File; reason: string }>) => void
  /** Densidad del dropzone */
  density?: Density
  /** Mensaje o slot personalizado en lugar del texto predeterminado */
  customSlot?: React.ReactNode
  className?: string
}

export function Dropzone({
  accept,
  maxSizeBytes = 10 * 1024 * 1024,
  multiple = true,
  disabled = false,
  onFilesAccepted,
  onFilesRejected,
  density: propDensity,
  customSlot,
  className,
}: DropzoneProps) {
  const { t } = useI18n()
  const contextDensity = useDensity()
  const activeDensity = propDensity || contextDensity

  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const paddingClass = {
    comfortable: 'p-8',
    compact: 'p-6',
    dense: 'p-4',
  }[activeDensity]

  const validateFiles = useCallback(
    (files: FileList | File[]) => {
      const accepted: File[] = []
      const rejected: Array<{ file: File; reason: string }> = []

      const acceptList = accept
        ? accept.split(',').map((item) => item.trim().toLowerCase())
        : []

      Array.from(files).forEach((file) => {
        // Validación de tamaño
        if (file.size > maxSizeBytes) {
          const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024))
          rejected.push({
            file,
            reason: t('fileUpload.maxSizeError', { maxSize: `${maxSizeMB}MB` }),
          })
          return
        }

        // Validación de tipo MIME / extensión
        if (acceptList.length > 0) {
          const fileName = file.name.toLowerCase()
          const fileType = file.type.toLowerCase()

          const matches = acceptList.some((rule) => {
            if (rule.startsWith('.')) {
              return fileName.endsWith(rule)
            }
            if (rule.endsWith('/*')) {
              const prefix = rule.slice(0, -2)
              return fileType.startsWith(prefix)
            }
            return fileType === rule
          })

          if (!matches) {
            rejected.push({
              file,
              reason: t('fileUpload.invalidTypeError', { formats: accept || '' }),
            })
            return
          }
        }

        accepted.push(file)
      })

      if (accepted.length > 0) {
        onFilesAccepted?.(accepted)
      }
      if (rejected.length > 0) {
        onFilesRejected?.(rejected)
      }
    },
    [accept, maxSizeBytes, onFilesAccepted, onFilesRejected, t]
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateFiles(e.target.files)
    }
    // Resetear valor para permitir seleccionar el mismo archivo nuevamente si fue eliminado
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const triggerBrowse = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      triggerBrowse()
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerBrowse}
      className={cn(
        'w-full flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        paddingClass,
        isDragOver
          ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 ring-4 ring-primary-500/20 scale-[1.005]'
          : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/70',
        disabled && 'opacity-60 cursor-not-allowed pointer-events-none bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {customSlot || (
        <>
          <div className="p-3.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 mb-3 transition-transform group-hover:scale-110">
            <Icon.Upload size="md" />
          </div>

          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {isDragOver
              ? t('fileUpload.dragActiveText')
              : t('fileUpload.dragDropText')}
          </p>

          {!isDragOver && (
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  triggerBrowse()
                }}
                disabled={disabled}
              >
                {t('fileUpload.browseButton')}
              </Button>
            </div>
          )}

          {accept && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Formatos soportados: {accept}
            </p>
          )}
        </>
      )}
    </div>
  )
}
