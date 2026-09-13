/**
 * Spinner (TASK-201) — indicador de carga neutro, decorativo por defecto.
 */
import clsx from 'clsx'
import './Spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  /** Texto para lectores de pantalla; si es undefined el spinner es aria-hidden. */
  label?: string
  className?: string
}

export function Spinner({ size = 'md', color, label, className }: SpinnerProps) {
  return (
    <span
      className={clsx('ft-spinner', `ft-spinner--${size}`, className)}
      style={color ? { borderTopColor: color } : undefined}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  )
}
