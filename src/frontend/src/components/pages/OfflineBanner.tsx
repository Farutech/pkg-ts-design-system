import React, { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'

export interface OfflineBannerProps {
  offlineMessage?: string
  reconnectedMessage?: string
  onRetry?: () => void
  className?: string
}

export function OfflineBanner({
  offlineMessage = 'Sin conexión a Internet. Trabajando en modo desconectado.',
  reconnectedMessage = 'Conexión restaurada con éxito.',
  onRetry,
  className,
}: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      setIsOnline(true)
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 3500)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && !showReconnected) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        'w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-between shadow-md transition-all sticky top-0 z-50',
        isOnline
          ? 'bg-emerald-600 text-white'
          : 'bg-amber-600 text-white',
        className
      )}
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1">
        {isOnline ? (
          <Icon.Success size="xs" className="shrink-0" />
        ) : (
          <Icon.Warning size="xs" className="shrink-0 animate-pulse" />
        )}
        <span>{isOnline ? reconnectedMessage : offlineMessage}</span>
      </div>

      {!isOnline && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-3 underline hover:opacity-80 cursor-pointer font-bold shrink-0"
        >
          Reintentar
        </button>
      )}
    </aside>
  )
}
