import {
  forwardRef,
  useState,
  useId,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/utils/cn'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'
import type { InputSize, InputStatus, InputVariant } from './InputBase'
import { Icon } from '@/primitives/Icon/Icon'

export type ValidationMode = 'block' | 'error'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'onChange'> {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  required?: boolean
  size?: InputSize
  density?: Density
  variant?: InputVariant | 'default' | 'outlined'
  status?: InputStatus
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  showCount?: boolean
  fullWidth?: boolean
  /** Regex pattern para validación de entrada */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Callback cuando el valor cambia */
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  /** Callback simplificado de valor */
  onValueChange?: (value: string) => void
}

/**
 * Textarea (Componente de Texto Multilínea):
 * Soporta densidad automática, contador de caracteres, estados de validación y accesibilidad.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      helperText,
      required,
      size = 'md',
      density: propDensity,
      variant = 'outline',
      status = 'default',
      resize = 'vertical',
      showCount = false,
      fullWidth = true,
      className,
      pattern,
      validationMode = 'block',
      onChange,
      onValueChange,
      value,
      defaultValue,
      maxLength,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const contextDensity = useDensity()
    const activeDensity = propDensity ?? contextDensity

    const generatedId = useId()
    const textareaId = id || `ft-textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const descId = `${textareaId}-description`

    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? '')
    )
    const [validationError, setValidationError] = useState<string>('')

    const currentValue = value !== undefined ? String(value) : internalValue

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value

      if (pattern) {
        if (validationMode === 'block') {
          if (val === '' || pattern.test(val)) {
            setValidationError('')
            setInternalValue(val)
            onChange?.(e)
            onValueChange?.(val)
          } else {
            e.preventDefault()
          }
        } else {
          setInternalValue(val)
          if (val === '' || pattern.test(val)) {
            setValidationError('')
          } else {
            setValidationError('El formato ingresado no es válido')
          }
          onChange?.(e)
          onValueChange?.(val)
        }
      } else {
        setInternalValue(val)
        onChange?.(e)
        onValueChange?.(val)
      }
    }

    const displayError = error || validationError
    const activeStatus: InputStatus = displayError ? 'error' : status
    const displayDesc = description || helperText

    // Clases por tamaño y densidad
    const paddingClasses = {
      sm: { comfortable: 'p-2.5 text-sm', compact: 'p-2 text-xs', dense: 'p-1.5 text-xs' },
      md: { comfortable: 'p-3.5 text-base', compact: 'p-3 text-sm', dense: 'p-2 text-xs' },
      lg: { comfortable: 'p-4 text-lg', compact: 'p-3.5 text-base', dense: 'p-2.5 text-sm' },
    }[size][activeDensity]

    const variantStyles = {
      outline: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      default: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      outlined: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900',
      borderless: 'border-none bg-transparent shadow-none px-0',
      underline: 'border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent rounded-none px-0',
    }[variant]

    const statusStyles = {
      default: 'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      error: 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      warning: 'border-amber-500 dark:border-amber-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
      success: 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
    }[activeStatus]

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }[resize]

    return (
      <div className={cn('flex flex-col text-left', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <textarea
            ref={ref}
            id={textareaId}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={activeStatus === 'error' ? 'true' : undefined}
            aria-required={required ? 'true' : undefined}
            aria-describedby={cn(displayError && errorId, displayDesc && descId) || undefined}
            className={cn(
              'w-full rounded-md transition-colors outline-none min-h-[80px]',
              'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
              paddingClasses,
              variantStyles,
              statusStyles,
              resizeStyles,
              disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
              className
            )}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute right-2 bottom-2 text-xs text-gray-400 select-none font-mono bg-white/80 dark:bg-gray-900/80 px-1 rounded pointer-events-none">
              {currentValue.length}/{maxLength}
            </div>
          )}
        </div>

        {displayError && (
          <p id={errorId} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <Icon.Error size="xs" className="shrink-0" />
            <span>{displayError}</span>
          </p>
        )}

        {displayDesc && !displayError && (
          <p id={descId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {displayDesc}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
