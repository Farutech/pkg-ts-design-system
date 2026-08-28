/**
 * Input (TASK-201) — control base con label, error y hint.
 * Reescrito con tokens (en dashboard tenía Tailwind quemado).
 * Accesibilidad: label asociado por id generado, aria-invalid, aria-describedby.
 */
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import './Input.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, inputSize = 'md', className, id, required, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={clsx('ft-input', className)}>
      {label && (
        <label className="ft-input__label" htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx('ft-input__field', `ft-input__field--${inputSize}`, error && 'ft-input__field--error')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...props}
      />
      {error ? (
        <p className="ft-input__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="ft-input__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
})
