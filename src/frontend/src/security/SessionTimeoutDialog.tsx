import { useState, useEffect, useRef, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'

export interface SessionTimeoutDialogProps {
  /** Tiempo de inactividad antes de advertir (en milisegundos). Default: 15 minutos (900,000 ms) */
  idleTimeoutMs?: number
  /** Tiempo de cuenta regresiva en el modal de advertencia (en segundos). Default: 60 segundos */
  warningCountdownSeconds?: number
  /** Callback para refrescar el token / extender sesión */
  onExtendSession: () => Promise<void> | void
  /** Callback cuando la sesión expira definitivamente */
  onSessionExpired: () => void
  /** Desactivar el detector (ej. si no está autenticado) */
  enabled?: boolean
}

/**
 * SessionTimeoutDialog - Componente empresarial para monitoreo de inactividad,
 * prevención de secuestro de sesión y renovación segura de tokens.
 */
export function SessionTimeoutDialog({
  idleTimeoutMs = 15 * 60 * 1000,
  warningCountdownSeconds = 60,
  onExtendSession,
  onSessionExpired,
  enabled = true,
}: SessionTimeoutDialogProps) {
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(warningCountdownSeconds)
  const [isExtending, setIsExtending] = useState(false)

  const lastActivityRef = useRef<number>(0)
  const warningTimerRef = useRef<any>(null)
  const countdownIntervalRef = useRef<any>(null)

  const handleActivity = useCallback(() => {
    if (isWarningOpen) return // No resetear si ya está en pantalla de advertencia
    lastActivityRef.current = Date.now()
  }, [isWarningOpen])

  // Escucha de eventos de interacción del usuario
  useEffect(() => {
    if (!enabled) return
    lastActivityRef.current = Date.now()

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    const onEvent = () => handleActivity()

    events.forEach((ev) => window.addEventListener(ev, onEvent, { passive: true }))

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onEvent))
    }
  }, [enabled, handleActivity])

  // Chequeo periódico de inactividad
  useEffect(() => {
    if (!enabled) return

    warningTimerRef.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityRef.current
      if (idleTime >= idleTimeoutMs && !isWarningOpen) {
        setIsWarningOpen(true)
        setSecondsLeft(warningCountdownSeconds)
      }
    }, 1000)

    return () => {
      if (warningTimerRef.current) clearInterval(warningTimerRef.current)
    }
  }, [enabled, idleTimeoutMs, isWarningOpen, warningCountdownSeconds])

  // Cuenta regresiva cuando la advertencia está abierta
  useEffect(() => {
    if (!isWarningOpen) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      return
    }

    countdownIntervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current)
          setIsWarningOpen(false)
          onSessionExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [isWarningOpen, onSessionExpired])

  const handleExtend = async () => {
    setIsExtending(true)
    try {
      await onExtendSession()
      lastActivityRef.current = Date.now()
      setIsWarningOpen(false)
    } finally {
      setIsExtending(false)
    }
  }

  const handleLogout = () => {
    setIsWarningOpen(false)
    onSessionExpired()
  }

  const progressPercentage = (secondsLeft / warningCountdownSeconds) * 100

  return (
    <Modal
      isOpen={isWarningOpen}
      onClose={() => {}} // Previene cierre accidental sin acción
      title="Su sesión está a punto de expirar"
      size="sm"
    >
      <div className="space-y-4 py-2">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Icon.Warning size="lg" className="shrink-0" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Por motivos de seguridad, su sesión se cerrará automáticamente en:
          </p>
        </div>

        <div className="text-center py-3">
          <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            {secondsLeft}s
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Si desea continuar trabajando, presione "Extender Sesión".
          </p>
        </div>

        {/* Barra de progreso de cuenta regresiva */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isExtending}
          >
            Cerrar Sesión
          </Button>
          <Button
            variant="primary"
            onClick={handleExtend}
            isLoading={isExtending}
          >
            Extender Sesión
          </Button>
        </div>
      </div>
    </Modal>
  )
}
