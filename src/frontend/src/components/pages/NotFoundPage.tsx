import React from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'

export interface NotFoundPageProps {
  title?: string
  message?: string
  onGoHome?: () => void
  onGoBack?: () => void
  homeUrl?: string
  fullScreen?: boolean
  className?: string
}

export function NotFoundPage({
  title = 'Página no encontrada',
  message = 'La ruta o recurso solicitado no existe, ha cambiado de ubicación o se encuentra temporalmente no disponible.',
  onGoHome,
  onGoBack,
  homeUrl = '/',
  fullScreen = true,
  className,
}: NotFoundPageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-950',
        fullScreen ? 'fixed inset-0 z-50 min-h-screen' : 'min-h-[450px] w-full',
        className
      )}
    >
      <span className="text-7xl sm:text-8xl font-black text-gray-200 dark:text-gray-800 tracking-tighter select-none">
        404
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight -mt-4">
        {title}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-2">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {onGoBack && (
          <Button variant="secondary" onClick={onGoBack}>
            Regresar
          </Button>
        )}
        {onGoHome ? (
          <Button variant="primary" onClick={onGoHome} className="flex items-center gap-1.5">
            <Icon.Home size="xs" />
            <span>Volver al Inicio</span>
          </Button>
        ) : (
          <a href={homeUrl}>
            <Button variant="primary" className="flex items-center gap-1.5">
              <Icon.Home size="xs" />
              <span>Volver al Inicio</span>
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
