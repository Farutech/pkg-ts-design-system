import {
  forwardRef,
  useState,
  useId,
  useRef,
  type ReactNode,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { cn } from '@/utils/cn'
import { InputBase, type InputBaseProps, type InputStatus } from './InputBase'
import { Icon } from '@/primitives/Icon/Icon'

export type ValidationMode = 'block' | 'error'

export interface InputProps extends Omit<InputBaseProps, 'onChange' | 'prefix' | 'pattern'> {
  /** Label accesible vinculado automáticamente con htmlFor */
  label?: ReactNode
  /** Descripción o mensaje de ayuda */
  description?: ReactNode
  /** Mensaje de error (fuerza status='error' y aria-invalid='true') */
  error?: ReactNode
  /** Helper text alternativo (compatibilidad) */
  helperText?: ReactNode
  /** Marca el campo como requerido con asterisco y aria-required */
  required?: boolean

  /** Prefijo textual o icono dentro del contenedor del input (lado izquierdo) */
  prefix?: ReactNode
  /** Sufijo textual o icono dentro del contenedor del input (lado derecho) */
  suffix?: ReactNode
  /** Alias Mantine para contenido izquierdo */
  leftSection?: ReactNode
  /** Alias Mantine para contenido derecho */
  rightSection?: ReactNode
  leftSectionWidth?: number | string
  rightSectionWidth?: number | string
  leftSectionPointerEvents?: 'auto' | 'none'
  rightSectionPointerEvents?: 'auto' | 'none'
  /** Alias MUI para contenido izquierdo */
  startAdornment?: ReactNode
  /** Alias MUI para contenido derecho */
  endAdornment?: ReactNode

  /** Addon exterior izquierdo (acoplado por fuera del borde del input) */
  addonBefore?: ReactNode
  /** Addon exterior derecho (acoplado por fuera del borde del input) */
  addonAfter?: ReactNode

  /** Muestra botón para limpiar rápidamente el valor */
  allowClear?: boolean
  /** Muestra contador de caracteres actuales y límite (requiere maxLength) */
  showCount?: boolean

  /** Regex pattern para validación de entrada */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Callback nativo de cambio */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /** Callback simplificado con solo el valor string */
  onValueChange?: (value: string) => void

  /** Toggle de visibilidad de contraseña para inputs de tipo password */
  showPasswordToggle?: boolean

  /** Prop de icono legacy (retrocompatibilidad) */
  icon?: ReactNode
  /** Posición de icono legacy */
  iconPosition?: 'left' | 'right'
}

/**
 * Input (Componente Best-of-Breed de Entrada de Texto):
 * Sintetiza los mejores patrones de Bootstrap (addons), Ant Design (prefix/suffix/allowClear/showCount),
 * Mantine (left/rightSection), MUI (adornments) y React Aria (accesibilidad estricta).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      helperText,
      required,
      prefix,
      suffix,
      leftSection,
      rightSection,
      leftSectionWidth,
      rightSectionWidth,
      leftSectionPointerEvents = 'auto',
      rightSectionPointerEvents = 'auto',
      startAdornment,
      endAdornment,
      addonBefore,
      addonAfter,
      allowClear = false,
      showCount = false,
      pattern,
      validationMode = 'block',
      onChange,
      onValueChange,
      showPasswordToggle = true,
      icon,
      iconPosition = 'left',
      status = 'default',
      size = 'md',
      density,
      variant = 'outline',
      fullWidth = true,
      id,
      type,
      value,
      defaultValue,
      maxLength,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `ft-input-${generatedId}`
    const errorId = `${inputId}-error`
    const descId = `${inputId}-description`

    const internalInputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      ;(internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    }

    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? '')
    )
    const [validationError, setValidationError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    // Sincronizar internalValue si es controlado
    const currentValue = value !== undefined ? String(value) : internalValue

    const isPassword = type === 'password'
    const effectiveType = isPassword && showPassword ? 'text' : type

    const effectiveLeft =
      leftSection ??
      prefix ??
      startAdornment ??
      (icon && iconPosition === 'left' ? icon : null)

    const effectiveRight =
      rightSection ??
      suffix ??
      endAdornment ??
      (icon && iconPosition === 'right' ? icon : null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setInternalValue('')
      setValidationError('')
      onValueChange?.('')

      if (internalInputRef.current) {
        internalInputRef.current.value = ''
        // Disparar evento de input sintético para formularios reactivos
        const event = new Event('input', { bubbles: true })
        internalInputRef.current.dispatchEvent(event)
        internalInputRef.current.focus()
      }
    }

    const displayError = error || validationError
    const activeStatus: InputStatus = displayError ? 'error' : status
    const displayDesc = description || helperText

    return (
      <div className={cn('flex flex-col text-left', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Contenedor con soporte de addonBefore / addonAfter externos */}
        <div className="flex w-full items-stretch">
          {addonBefore && (
            <div className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-l-md select-none shrink-0">
              {addonBefore}
            </div>
          )}

          {/* Caja principal del input con slots internos */}
          <div className="relative flex-1 flex items-center">
            {/* Contenido Izquierdo */}
            {effectiveLeft && (
              <div
                className={cn(
                  'absolute left-0 inset-y-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 z-10 text-sm',
                  leftSectionPointerEvents === 'none' && 'pointer-events-none'
                )}
                style={leftSectionWidth ? { width: leftSectionWidth } : undefined}
              >
                {effectiveLeft}
              </div>
            )}

            <InputBase
              ref={combinedRef}
              id={inputId}
              type={effectiveType}
              value={currentValue}
              onChange={handleChange}
              disabled={disabled}
              maxLength={maxLength}
              size={size}
              density={density}
              variant={variant}
              status={activeStatus}
              fullWidth={fullWidth}
              hasLeftContent={Boolean(effectiveLeft)}
              hasRightContent={Boolean(
                effectiveRight ||
                (allowClear && currentValue) ||
                (isPassword && showPasswordToggle) ||
                (showCount && maxLength)
              )}
              aria-invalid={activeStatus === 'error' ? 'true' : undefined}
              aria-required={required ? 'true' : undefined}
              aria-describedby={cn(
                displayError && errorId,
                displayDesc && descId
              ) || undefined}
              className={cn(
                addonBefore && 'rounded-l-none',
                addonAfter && 'rounded-r-none',
                className
              )}
              {...props}
            />

            {/* Controles y Contenido Derecho */}
            <div className="absolute right-0 inset-y-0 pr-2.5 flex items-center gap-1.5 z-10 text-gray-400 text-sm">
              {/* Botón allowClear */}
              {allowClear && Boolean(currentValue) && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar campo"
                  className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  <Icon.Clear size="xs" />
                </button>
              )}

              {/* Password visibility toggle */}
              {isPassword && showPasswordToggle && !disabled && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <Icon.EyeOff size="sm" /> : <Icon.Eye size="sm" />}
                </button>
              )}

              {/* Contador de caracteres (showCount) */}
              {showCount && maxLength && (
                <span className="text-xs text-gray-400 select-none font-mono">
                  {currentValue.length}/{maxLength}
                </span>
              )}

              {/* Contenido derecho personalizado */}
              {effectiveRight && (
                <div
                  className={cn(
                    'flex items-center text-gray-400 dark:text-gray-500',
                    rightSectionPointerEvents === 'none' && 'pointer-events-none'
                  )}
                  style={rightSectionWidth ? { width: rightSectionWidth } : undefined}
                >
                  {effectiveRight}
                </div>
              )}
            </div>
          </div>

          {addonAfter && (
            <div className="inline-flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-r-md select-none shrink-0">
              {addonAfter}
            </div>
          )}
        </div>

        {/* Mensaje de Error (Live Region accesible) */}
        {displayError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <Icon.Error size="xs" className="shrink-0" />
            <span>{displayError}</span>
          </p>
        )}

        {/* Descripción o Helper Text */}
        {displayDesc && !displayError && (
          <p id={descId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {displayDesc}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
