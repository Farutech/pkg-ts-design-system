import {
  forwardRef,
  useState,
  useId,
  useRef,
  useCallback,
  type ChangeEvent,
  type FocusEvent,
} from 'react'
import { cn } from '@/utils/cn'
import { FieldShell } from '@/primitives/field-shell/FieldShell'
import { Icon } from '@/primitives/icon/Icon'
import { useMaskedValue, type MaskConfig, type MaskType } from '@/hooks/useMaskedValue'
import { useFormContext } from './Form'
import { formatPhoneNumber } from './input/inputBehaviors'
import type {
  InputProps as BaseInputProps,
  InputSize,
  InputStatus,
  InputVariant,
  InputType,
  LabelMode,
  ValidationMode,
  LookupOption,
  SurfaceVariant,
} from './input/types'

export type {
  InputSize,
  InputStatus,
  InputVariant,
  InputType,
  LabelMode,
  ValidationMode,
  LookupOption,
  SurfaceVariant,
}

export interface InputProps extends Omit<BaseInputProps, 'onChange'> {
  /** Configuración de máscara o tipo predefinido ('currency' | 'phone' | 'date' | 'percent' | 'document') */
  mask?: MaskConfig | MaskType
  /** Si debe desenmascarar / mostrar dato transparente en foco (por defecto true) */
  unmaskOnFocus?: boolean
  /** Callback estándar onChange */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /** Callback de valor limpio y formateado */
  onValueChange?: (cleanValue: string, formattedValue?: string) => void
}

/**
 * Input - Componente unificado y accesible de entrada de texto (Arquitectura Lego / SOLID).
 * 
 * Capacidades:
 * - Soporta modos de etiqueta: 'external' (superior) y 'floating' (flotante interna con placeholder dinámico).
 * - Soporta máscaras con dato transparente en foco (Focus Unmasked / Blur Formatted).
 * - Objetivos táctiles mínimos y dimensiones fluidas gobernadas por tokens.
 * - Desacoplado internamente mediante FieldShell y useMaskedValue (<200 líneas de código).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      floatingTitle,
      activeLabel,
      description,
      error,
      helperText,
      tooltip,
      required = false,
      disabled = false,
      readOnly = false,
      status = 'default',
      size: _size = 'md',
      labelMode: explicitLabelMode,
      labelPlacement: explicitPlacement,
      labelAlign: explicitAlign,
      variant = 'outline',
      surfaceVariant: _surfaceVariant = 'default',
      fullWidth = true,
      type = 'text',
      value: controlledValue,
      defaultValue = '',
      placeholder,
      prefix,
      suffix,
      leftSection,
      rightSection,
      startAdornment,
      endAdornment,
      allowClear = false,
      showPasswordToggle = true,
      mask,
      unmaskOnFocus = true,
      onChange,
      onValueChange,
      onFocus,
      onBlur,
      className,
      style,
      pattern: rawPattern,
      validationMode,
      validationMessage: _validationMessage,
      leftSectionWidth: _leftSectionWidth,
      rightSectionWidth: _rightSectionWidth,
      leftSectionPointerEvents: _leftSectionPointerEvents,
      rightSectionPointerEvents: _rightSectionPointerEvents,
      addonBefore,
      addonAfter,
      onAddonBeforeClick,
      onAddonAfterClick,
      showCount,
      showStepper: _showStepper,
      lookupValue: _lookupValue,
      onSearch: _onSearch,
      onLookupChange: _onLookupChange,
      onAdvancedSearch,
      advancedSearchLabel,
      minChars: _minChars,
      debounceMs: _debounceMs,
      emptyMessage: _emptyMessage,
      info: _info,
      icon: _icon,
      iconPosition: _iconPosition,
      density: _density,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `ft-input-${generatedId}`
    const innerRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)

    const formContext = useFormContext()

    // Resolución de disposición y modo de etiqueta
    const effectiveLabelPlacement =
      explicitPlacement ||
      (variant === 'floating' || explicitLabelMode === 'floating'
        ? 'inside'
        : explicitLabelMode === 'hidden' || !label
        ? 'hidden'
        : formContext.defaultLabelPlacement || (formContext.defaultLabelMode === 'floating' ? 'inside' : 'top'))

    const effectiveLabelAlign =
      explicitAlign || formContext.defaultLabelAlign || 'left'

    const effectiveLabelMode: LabelMode =
      effectiveLabelPlacement === 'inside'
        ? 'floating'
        : effectiveLabelPlacement === 'hidden'
        ? 'hidden'
        : 'external'

    const isFloating = effectiveLabelPlacement === 'inside'

    // Integración de máscara con patrón foco transparente / blur formateado
    const {
      displayValue,
      rawValue: _rawValue,
      hasValue,
      isFocused,
      handleFocus: onMaskFocus,
      handleBlur: onMaskBlur,
      handleChange: onMaskChange,
    } = useMaskedValue({
      value: controlledValue !== undefined ? String(controlledValue) : undefined,
      defaultValue: defaultValue !== undefined ? String(defaultValue) : '',
      mask,
      unmaskOnFocus,
      onChange: (clean, formatted) => {
        if (onValueChange) {
          onValueChange(clean, formatted)
        }
      },
    })

    const isPassword = type === 'password'
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        onMaskFocus()
        if (onFocus) onFocus(e)
      },
      [onFocus, onMaskFocus]
    )

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        onMaskBlur()
        if (onBlur) onBlur(e)
      },
      [onBlur, onMaskBlur]
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (validationMode === 'block' && rawPattern) {
          const regex = typeof rawPattern === 'string' ? new RegExp(rawPattern) : rawPattern
          if (val && !regex.test(val)) {
            return
          }
        }
        const formattedVal = type === 'tel' && !mask ? formatPhoneNumber(val) : val
        onMaskChange(formattedVal)
        if (onChange) onChange(e)
      },
      [onChange, onMaskChange, validationMode, rawPattern, type, mask]
    )

    const handleClear = useCallback(() => {
      onMaskChange('')
      if (innerRef.current) {
        innerRef.current.value = ''
        innerRef.current.focus()
      }
      if (onValueChange) onValueChange('')
    }, [onMaskChange, onValueChange])

    // Secciones derecha/izquierda combinadas
    const effectiveLeft = leftSection || prefix || startAdornment
    const shouldShowClear = allowClear && hasValue && !disabled && !readOnly

    const effectiveRight = (
      <div className="flex items-center gap-1 shrink-0">
        {showCount && props.maxLength && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono select-none mr-1">
            {displayValue.length}/{props.maxLength}
          </span>
        )}

        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar campo"
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <Icon.Clear size="xs" />
          </button>
        )}

        {isPassword && showPasswordToggle && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <Icon.EyeOff size="xs" /> : <Icon.Eye size="xs" />}
          </button>
        )}

        {variant === 'lookup' && onAdvancedSearch && (
          <button
            type="button"
            onClick={onAdvancedSearch}
            aria-label={advancedSearchLabel || 'Búsqueda avanzada'}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <Icon.Search size="xs" />
          </button>
        )}

        {rightSection || suffix || endAdornment}
      </div>
    )

    // Placeholder contextual para floating label
    const effectivePlaceholder =
      isFloating
        ? isFocused
          ? placeholder || ' '
          : ' '
        : placeholder

    const inputShell = (
      <FieldShell
        id={inputId}
        label={label}
        floatingTitle={floatingTitle || activeLabel}
        labelMode={effectiveLabelMode}
        labelPlacement={effectiveLabelPlacement}
        labelAlign={effectiveLabelAlign}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        status={status}
        error={error}
        helperText={helperText}
        description={description}
        tooltip={tooltip}
        hasValue={hasValue}
        isFocused={isFocused}
        leftSection={effectiveLeft}
        rightSection={effectiveRight}
        fullWidth={fullWidth}
        className={cn(fullWidth && 'w-full', (addonBefore || addonAfter) && 'rounded-none border-0')}
        style={style}
      >
        <input
          ref={(node) => {
            ;(innerRef as any).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as any).current = node
          }}
          id={inputId}
          role={variant === 'lookup' ? 'combobox' : undefined}
          aria-autocomplete={variant === 'lookup' ? 'list' : undefined}
          type={effectiveType}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={effectivePlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-required={required ? 'true' : undefined}
          aria-invalid={status === 'error' || Boolean(error) ? 'true' : (status && status !== 'default' ? 'false' : undefined)}
          data-status={status}
          aria-describedby={
            cn(error && `${inputId}-error`, (helperText || description) && `${inputId}-desc`) ||
            undefined
          }
          className={cn(
            'w-full bg-transparent text-gray-900 dark:text-gray-100 outline-none border-0 p-0 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500',
            disabled && 'cursor-not-allowed text-gray-500'
          )}
          pattern={typeof rawPattern === 'string' ? rawPattern : rawPattern?.source}
          {...props}
        />
      </FieldShell>
    )

    if (addonBefore || addonAfter) {
      return (
        <div className={cn('flex items-stretch w-full rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-900', className)}>
          {addonBefore && (
            <div
              onClick={onAddonBeforeClick}
              className={cn(
                'flex items-center px-3 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 select-none shrink-0',
                onAddonBeforeClick && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {addonBefore}
            </div>
          )}
          <div className="flex-1 min-w-0">{inputShell}</div>
          {addonAfter && (
            <div
              onClick={onAddonAfterClick}
              className={cn(
                'flex items-center px-3 bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 select-none shrink-0',
                onAddonAfterClick && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {addonAfter}
            </div>
          )}
        </div>
      )
    }

    return inputShell
  }
)

Input.displayName = 'Input'
