/**
 * Input (TASK-201) — control base con label, error y hint.
 * Reescrito con tokens (en dashboard tenía Tailwind quemado).
 * Accesibilidad: label asociado por id generado, aria-invalid, aria-describedby.
 */
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import './Input.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: ReactNode
  helperText?: ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  showPasswordToggle?: boolean
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    helperText,
    inputSize = 'md',
    icon,
    iconPosition = 'left',
    showPasswordToggle = false,
    fullWidth = true,
    className,
    id,
    type,
    required,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const effectiveHint = hint ?? helperText
  const describedBy = error ? `${inputId}-error` : effectiveHint ? `${inputId}-hint` : undefined

  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const effectiveType = isPassword && showPassword ? 'text' : type

  return (
    <div className={clsx('ft-input', fullWidth && 'w-full', className)}>
      {label && (
        <label className="ft-input__label" htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          className={clsx(
            'ft-input__field',
            `ft-input__field--${inputSize}`,
            error && 'ft-input__field--error',
            icon && iconPosition === 'left' && 'pl-10',
            (icon && iconPosition === 'right' || (isPassword && showPasswordToggle)) && 'pr-10',
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...props}
        />
        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        ) : icon && iconPosition === 'right' ? (
          <span className="absolute right-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="ft-input__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : effectiveHint ? (
        <p className="ft-input__hint" id={`${inputId}-hint`}>
          {effectiveHint}
        </p>
      ) : null}
    </div>
  )
})

