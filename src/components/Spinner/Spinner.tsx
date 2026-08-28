/**
 * Spinner (TASK-201) — indicador de carga neutro, decorativo por defecto.
 */
import clsx from 'clsx'
import './Spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  /** Texto para lectores de pantalla; si es undefined el spinner es aria-hidden. */
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  return (
    <span
      className={clsx('ft-spinner', `ft-spinner--${size}`, className)}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  )
}
