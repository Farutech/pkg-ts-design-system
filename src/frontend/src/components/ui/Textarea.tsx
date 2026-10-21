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
import { Icon } from '@/primitives/icon/Icon'
import { useFormContext } from './Form'
import type { LabelMode } from './input/types'

export type ValidationMode = 'block' | 'error'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'onChange'> {
  label?: ReactNode
  labelMode?: LabelMode
  floatingTitle?: ReactNode
  activeLabel?: ReactNode
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
  /** Habilitar modo colapsable/expandible con botón integrado en cabecera */
  collapsible?: boolean
  /** Estado de expansión inicial en modo collapsible (por defecto false) */
  defaultExpanded?: boolean
  /** Control controlado de expansión */
  isExpanded?: boolean
  /** Callback al alternar expansión */
  onExpandedChange?: (expanded: boolean) => void
  /** Etiqueta personalizada para expandir */
  expandLabel?: ReactNode
  /** Etiqueta personalizada para contraer */
  collapseLabel?: ReactNode
  /** Elemento o acción extra a renderizar en la cabecera del label */
  labelExtra?: ReactNode
}

/**
 * Textarea (Componente de Texto Multilínea):
 * Soporta densidad automática, escala estandarizada ('sm' | 'md' | 'lg' | 'xl'),
 * contador de caracteres, estados de validación y accesibilidad estricta WCAG.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelMode,
      floatingTitle,
      activeLabel,
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
      collapsible = false,
      defaultExpanded = false,
      isExpanded,
      onExpandedChange,
      expandLabel,
      collapseLabel,
      labelExtra,
      value,
      defaultValue,
      maxLength,
      disabled,
      readOnly,
      id,
      ...props
    },
    ref
  ) => {
    const contextDensity = useDensity()
    const activeDensity = propDensity ?? contextDensity

    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded)
    const isEffectivelyExpanded = isExpanded !== undefined ? isExpanded : uncontrolledExpanded

    const handleToggleExpand = () => {
      const next = !isEffectivelyExpanded
      if (isExpanded === undefined) {
        setUncontrolledExpanded(next)
      }
      onExpandedChange?.(next)
    }

    const generatedId = useId()
    const textareaId = id || `ft-textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const descId = `${textareaId}-description`

    const [isFocused, setIsFocused] = useState(false)
    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? '')
    )
    const formContext = useFormContext()
    const effectiveLabelMode: LabelMode = labelMode || (variant === 'floating' ? 'floating' : formContext.defaultLabelMode) || 'external'
    const isFloating = variant === 'floating' || effectiveLabelMode === 'floating' || effectiveLabelMode === 'placeholder'
    const [validationError, setValidationError] = useState<string>('')

    const currentValue = value !== undefined ? String(value) : internalValue
    const isFloatingActive = isFocused || Boolean(currentValue && currentValue.length > 0)

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
      xl: { comfortable: 'p-5 text-xl', compact: 'p-4 text-lg', dense: 'p-3 text-base' },
    }[size][activeDensity]

    const variantStyles = {
      outline: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      default: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      outlined: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
      filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900',
      flushed: 'border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent rounded-none px-0',
      borderless: 'border-none bg-transparent shadow-none px-0',
      underline: 'border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent rounded-none px-0',
      floating: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl',
      lookup: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl',
    }[variant]

    const statusStyles = {
      default: 'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      error: 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900 dark:text-red-100',
      warning: 'border-amber-500 dark:border-amber-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
      success: 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
      info: 'border-blue-500 dark:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    }[activeStatus]

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }[resize]

    return (
      <div className={cn('flex flex-col text-left', fullWidth && 'w-full')}>
        {!isFloating && (label || collapsible || labelExtra) && effectiveLabelMode !== 'hidden' && (
          <div className="flex items-center justify-between mb-1 gap-2">
            {label && (
              <label
                htmlFor={textareaId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {label}
                {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
              </label>
            )}
            <div className="flex items-center gap-2 ml-auto">
              {labelExtra}
              {collapsible && (
                <button
                  type="button"
                  onClick={handleToggleExpand}
                  className="text-[11px] font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline cursor-pointer select-none transition-colors"
                  aria-expanded={isEffectivelyExpanded}
                >
                  {isEffectivelyExpanded ? (collapseLabel ?? 'Contraer') : (expandLabel ?? '+ Desplegar')}
                </button>
              )}
            </div>
          </div>
        )}
        {!isFloating && label && effectiveLabelMode === 'hidden' && (
          <label htmlFor={textareaId} className="sr-only">
            {label}
          </label>
        )}

        <div className="relative w-full">
          {isFloating && (
            <span
              className={cn(
                'absolute left-3.5 pointer-events-none transition-all duration-200 ease-out select-none transform origin-top-left z-10',
                isFloatingActive
                  ? 'top-1.5 text-[10px] font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase scale-95'
                  : 'top-3.5 text-xs text-gray-500 dark:text-gray-400 font-normal scale-100'
              )}
            >
              {isFloatingActive && (floatingTitle || activeLabel)
                ? (floatingTitle || activeLabel)
                : (label || props.placeholder)}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </span>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            value={currentValue}
            onChange={handleChange}
            rows={collapsible ? (isEffectivelyExpanded ? (props.rows ?? 2) : 1) : props.rows}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            aria-invalid={activeStatus === 'error' ? 'true' : activeStatus === 'success' ? 'false' : undefined}
            data-status={activeStatus}
            aria-disabled={disabled ? 'true' : undefined}
            aria-readonly={readOnly ? 'true' : undefined}
            aria-describedby={cn(displayError && errorId, displayDesc && descId) || undefined}
            className={cn(
              'w-full rounded-md transition-all outline-none',
              collapsible && !isEffectivelyExpanded
                ? 'min-h-[36px] max-h-[38px] py-1.5 resize-none overflow-hidden'
                : 'min-h-[70px]',
              'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
              isFloating ? 'pt-6 px-3.5 pb-2 text-sm' : paddingClasses,
              variantStyles,
              statusStyles,
              (!collapsible || isEffectivelyExpanded) && resizeStyles,
              disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
              readOnly && 'bg-gray-50 dark:bg-gray-800/50 cursor-default',
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
