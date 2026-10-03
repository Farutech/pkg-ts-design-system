import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'

export interface ErrorPageProps {
  title?: string
  message?: string
  errorCode?: string | number
  incidentId?: string
  error?: Error | null
  onRetry?: () => void
  onGoBack?: () => void
  onGoHome?: () => void
  fullScreen?: boolean
  className?: string
}

export function ErrorPage({
  title = 'Ha ocurrido un error inesperado',
  message = 'Nuestro equipo técnico ha sido notificado. Por favor intente nuevamente en unos instantes.',
  errorCode = '500',
  incidentId,
  error,
  onRetry,
  onGoBack,
  onGoHome,
  fullScreen = true,
  className,
}: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const effectiveIncident = incidentId || `ERR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-950',
        fullScreen ? 'fixed inset-0 z-50 min-h-screen' : 'min-h-[450px] w-full',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 shadow-sm">
        <Icon.Error size="lg" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
        Código de Error {errorCode}
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
        {title}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-2">
        {message}
      </p>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300 mt-4">
        <span>ID Incidente:</span>
        <span className="font-semibold select-all">{effectiveIncident}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="flex items-center gap-1.5">
            <Icon.Refresh size="xs" />
            <span>Reintentar</span>
          </Button>
        )}
        {onGoBack && (
          <Button variant="secondary" onClick={onGoBack}>
            Regresar
          </Button>
        )}
        {onGoHome && (
          <Button variant="ghost" onClick={onGoHome}>
            Ir al Inicio
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-8 max-w-lg w-full text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline cursor-pointer"
          >
            {showDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
          </button>

          {showDetails && (
            <pre className="mt-2 p-3 rounded-lg bg-gray-900 text-red-400 font-mono text-xs overflow-x-auto border border-gray-800">
              {error.stack || error.message}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
