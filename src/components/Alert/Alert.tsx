/**
 * Alert (TASK-201) — feedback semántico, dismissible opcional.
 */
import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import './Alert.css'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: ReactNode
  children?: ReactNode
  /** Si se define, muestra botón de cerrar (accesible). */
  onClose?: () => void
  className?: string
}

export function Alert({ variant = 'info', title, children, onClose, className }: AlertProps) {
  const [closed, setClosed] = useState(false)
  if (closed) return null

  return (
    <div role={variant === 'danger' ? 'alert' : 'status'} className={clsx('ft-alert', `ft-alert--${variant}`, className)}>
      <div className="ft-alert__content">
        {title && <p className="ft-alert__title">{title}</p>}
        {children && <div className="ft-alert__body">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="ft-alert__close"
          aria-label="Cerrar aviso"
          onClick={() => {
            setClosed(true)
            onClose()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
