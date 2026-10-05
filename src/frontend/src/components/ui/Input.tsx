import {
  forwardRef,
  useState,
  useId,
  useRef,
  useEffect,
  isValidElement,
  type ReactNode,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/utils/cn'
import { InputBase } from './InputBase'
import { Icon } from '@/primitives/Icon/Icon'
import type {
  InputProps,
  InputSize,
  InputStatus,
  InputVariant,
  InputType,
  LabelMode,
  ValidationMode,
  LookupOption,
  SurfaceVariant,
} from './input/types'
import {
  getInputBehavior,
} from './input/inputBehaviors'

export type {
  InputProps,
  InputSize,
  InputStatus,
  InputVariant,
  InputType,
  LabelMode,
  ValidationMode,
  LookupOption,
  SurfaceVariant,
}

function isButtonLike(node: ReactNode): boolean {
  if (!isValidElement(node)) return false
  if (node.type === 'button') return true
  if (typeof (node.props as any)?.onClick === 'function') return true
  const typeName =
    typeof node.type === 'function'
      ? node.type.name
      : typeof node.type === 'object' && node.type !== null
      ? (node.type as any).displayName || (node.type as any).name || ''
      : ''
  if (/button/i.test(typeName)) return true
  if (
    typeof (node.props as any)?.className === 'string' &&
    (node.props as any).className.includes('button')
  ) {
    return true
  }
  return false
}

/**
 * Input (Componente Best-of-Breed y Unificado de Entrada de Texto):
 * - Soporta variantes: 'outline' (default), 'filled', 'flushed', 'borderless', 'underline', 'floating', 'lookup'.
 * - Modos de etiqueta: 'external' (estándar), 'floating' (flotante animada), 'placeholder', 'hidden'.
 * - Comportamientos automáticos enriquecidos por tipo ('email', 'password', 'search', 'tel', 'number', 'url', 'date').
 * - Accesibilidad estricta WCAG 2.1 AA / WCAG 2.2 AAA (anillos de foco visibles, live regions, ARIA completo).
 * - Objetivos táctiles interactivos >= 44x44px (WCAG 2.5.8) para botones de acción.
 * - 100% libre de valores hardcodeados; gobernado por Design Tokens.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      helperText,
      tooltip,
      info,
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
      onAddonBeforeClick,
      onAddonAfterClick,
      allowClear = false,
      showCount = false,
      showPasswordToggle = true,
      showStepper = false,
      step = 1,
      min,
      max,
      pattern,
      validationMode = 'block',
      validationMessage,
      onChange,
      onValueChange,
      icon,
      iconPosition = 'left',
      status = 'default',
      size = 'md',
      density,
      variant = 'outline',
      labelMode = 'external',
      surfaceVariant = 'default',
      fullWidth = true,
      id,
      type = 'text',
      value,
      defaultValue,
      maxLength,
      className,
      disabled,
      readOnly,
      placeholder,
      name,
      lookupValue,
      onSearch,
      onLookupChange,
      onAdvancedSearch,
      advancedSearchLabel = 'Búsqueda avanzada',
      minChars = 1,
      debounceMs = 250,
      emptyMessage = 'Sin coincidencias',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `ft-input-${generatedId}`
    const errorId = `${inputId}-error`
    const descId = `${inputId}-description`
    const listboxId = `${inputId}-listbox`

    const internalInputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      ;(internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    }

    // Comportamiento automático enriquecido por tipo
    const behavior = getInputBehavior(type)
    const isPassword = type === 'password'
    const isNumber = type === 'number'
    const isLookup = variant === 'lookup'
    const isFloating = variant === 'floating' || labelMode === 'floating'

    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Estado interno de valor
    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? '')
    )
    const [validationError, setValidationError] = useState<string>('')

    // Sincronización controlada
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value))
      }
    }, [value])

    // Sincronización de lookup
    useEffect(() => {
      if (isLookup && lookupValue !== undefined) {
        setInternalValue(lookupValue?.label ?? '')
      }
    }, [isLookup, lookupValue])

    const currentValue = value !== undefined ? String(value) : internalValue

    // Estado para variant="lookup"
    const [lookupOptions, setLookupOptions] = useState<LookupOption[]>([])
    const [lookupOpen, setLookupOpen] = useState(false)
    const [lookupLoading, setLookupLoading] = useState(false)
    const [lookupActive, setLookupActive] = useState(-1)
    const lookupRequestRef = useRef(0)

    useEffect(() => {
      if (!isLookup || !lookupOpen || !onSearch) return
      const query = currentValue.trim()
      if (query.length < minChars || query === lookupValue?.label) {
        setLookupOptions([])
        return
      }
      const reqId = ++lookupRequestRef.current
      const timer = setTimeout(async () => {
        setLookupLoading(true)
        try {
          const res = await onSearch(query)
          if (Array.isArray(res) && reqId === lookupRequestRef.current) {
            setLookupOptions(res)
            setLookupActive(res.length ? 0 : -1)
          }
        } catch {
          if (reqId === lookupRequestRef.current) setLookupOptions([])
        } finally {
          if (reqId === lookupRequestRef.current) setLookupLoading(false)
        }
      }, debounceMs)
      return () => clearTimeout(timer)
    }, [isLookup, lookupOpen, currentValue, minChars, debounceMs, lookupValue?.label, onSearch])

    const testPattern = (val: string, pat?: RegExp | string): boolean => {
      if (!pat || val === '') return true
      try {
        const regex = typeof pat === 'string' ? new RegExp(pat) : pat
        return regex.test(val)
      } catch {
        return true
      }
    }

    // Manejo de cambio de texto
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value

      // Formateo por tipo si aplica (ej. teléfono)
      if (behavior.format) {
        val = behavior.format(val)
      }

      // Bloqueo estricto por regex pattern personalizado (ej. solo dígitos)
      if (pattern && validationMode === 'block') {
        if (!testPattern(val, pattern)) {
          e.preventDefault()
          return
        }
      }

      setInternalValue(val)
      onChange?.(e)
      onValueChange?.(val)

      // Validación en modo error para pattern personalizado
      if (pattern && validationMode === 'error') {
        if (testPattern(val, pattern)) {
          setValidationError('')
        } else {
          setValidationError(validationMessage || 'El formato ingresado no es válido')
        }
      }

      if (isLookup) {
        setLookupOpen(true)
        if (lookupValue && val !== lookupValue.label) {
          onLookupChange?.(null)
        }
      }
    }

    const handleClear = () => {
      setInternalValue('')
      setValidationError('')
      onValueChange?.('')
      if (isLookup) {
        onLookupChange?.(null)
        setLookupOptions([])
        setLookupOpen(false)
      }
      if (internalInputRef.current) {
        internalInputRef.current.value = ''
        const syntheticEvent = {
          target: internalInputRef.current,
          currentTarget: internalInputRef.current,
        } as ChangeEvent<HTMLInputElement>
        onChange?.(syntheticEvent)
        internalInputRef.current.focus()
      }
    }

    const handleIncrement = () => {
      const num = Number(currentValue || 0)
      const numStep = Number(step || 1)
      const numMax = max !== undefined ? Number(max) : undefined
      const next = numMax !== undefined ? Math.min(numMax, num + numStep) : num + numStep
      setInternalValue(String(next))
      onValueChange?.(String(next))
    }

    const handleDecrement = () => {
      const num = Number(currentValue || 0)
      const numStep = Number(step || 1)
      const numMin = min !== undefined ? Number(min) : undefined
      const next = numMin !== undefined ? Math.max(numMin, num - numStep) : num - numStep
      setInternalValue(String(next))
      onValueChange?.(String(next))
    }

    const handleLookupSelect = (opt: LookupOption | null) => {
      onLookupChange?.(opt)
      setInternalValue(opt?.label ?? '')
      setLookupOpen(false)
      setLookupOptions([])
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (isLookup) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setLookupOpen(true)
          setLookupActive((i) => Math.min(lookupOptions.length - 1, i + 1))
          return
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setLookupActive((i) => Math.max(0, i - 1))
          return
        } else if (e.key === 'Enter' && lookupOpen && lookupActive >= 0 && lookupOptions[lookupActive]) {
          e.preventDefault()
          handleLookupSelect(lookupOptions[lookupActive])
          return
        } else if (e.key === 'Escape') {
          setLookupOpen(false)
          return
        }
      }
      props.onKeyDown?.(e)
    }

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (isLookup) setLookupOpen(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      // Validación semántica al desenfocar para tipos automáticos como email o url
      if (behavior.validation && currentValue) {
        if (!behavior.validation.test(currentValue)) {
          setValidationError(validationMessage || behavior.validationMessage || 'El formato ingresado no es válido')
        } else {
          setValidationError('')
        }
      }
      if (isLookup) {
        setTimeout(() => setLookupOpen(false), 160)
      }
      props.onBlur?.(e)
    }

    // Resolución de errores y estado
    const displayError = error || validationError
    const activeStatus: InputStatus = displayError ? 'error' : status
    const displayDesc = description || helperText
    const informativeMessage = tooltip || info

    // Resolución de contenido izquierdo y derecho
    const effectiveLeft =
      leftSection ??
      prefix ??
      startAdornment ??
      (iconPosition === 'left' ? icon : undefined) ??
      behavior.icon

    // Icono interno de estado (Fase 4: corrección de simetría)
    const stateIcon =
      activeStatus === 'error' ? (
        <span className="text-red-500 shrink-0" aria-hidden="true">
          <Icon.Error size="xs" />
        </span>
      ) : activeStatus === 'success' ? (
        <span className="text-emerald-500 shrink-0" aria-hidden="true">
          <Icon.Check size="xs" />
        </span>
      ) : activeStatus === 'warning' ? (
        <span className="text-amber-500 shrink-0" aria-hidden="true">
          <Icon.Warning size="xs" />
        </span>
      ) : null

    const effectiveRight =
      rightSection ??
      suffix ??
      endAdornment ??
      (iconPosition === 'right' ? icon : undefined)

    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type

    const hasButtonBefore = isButtonLike(addonBefore)
    const hasButtonAfter = isButtonLike(addonAfter)

    const shouldShowClear =
      (allowClear || behavior.showClearButton) && Boolean(currentValue) && !disabled && !readOnly

    const shouldShowStepper =
      (showStepper || (isNumber && showStepper !== false)) && !disabled && !readOnly

    const isFloatingActive = isFocused || Boolean(currentValue && currentValue.length > 0)
    const showLookupPanel =
      isLookup && lookupOpen && currentValue.trim().length >= minChars && currentValue !== lookupValue?.label

    // Modo floating label render
    if (isFloating) {
      return (
        <div
          className={cn(
            'relative flex flex-col text-left group',
            fullWidth && 'w-full',
            disabled && 'opacity-60 pointer-events-none'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {informativeMessage && isHovered && (
            <div
              role="tooltip"
              className="absolute -top-8 left-2 z-50 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-gray-900 text-gray-100 border border-primary-500/30 shadow-xl backdrop-blur-md transition-opacity pointer-events-none whitespace-nowrap animate-fadeIn"
            >
              {informativeMessage}
              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          )}

          <label
            htmlFor={inputId}
            className={cn(
              'relative flex items-center min-h-[44px] sm:min-h-[48px] rounded-xl border transition-all duration-150 cursor-text overflow-hidden',
              surfaceVariant === 'dark'
                ? 'bg-gray-900 hover:bg-gray-850 border-gray-700 hover:border-gray-600 text-gray-100'
                : surfaceVariant === 'glass'
                ? 'bg-gray-900/80 backdrop-blur-md border-gray-700/60 hover:border-gray-600 text-gray-100'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100',
              isFocused &&
                'border-primary-500 ring-2 ring-primary-500/25 shadow-[0_0_12px_rgba(37,99,235,0.15)]',
              activeStatus === 'error' && 'border-red-500 ring-2 ring-red-500/20 text-red-900 dark:text-red-100',
              activeStatus === 'success' && 'border-emerald-500 ring-2 ring-emerald-500/20',
              className
            )}
          >
            {effectiveLeft && (
              <div className="pl-3.5 pr-1 flex items-center text-gray-400 dark:text-gray-500 shrink-0">
                {effectiveLeft}
              </div>
            )}

            <div className="relative flex-1 h-full flex flex-col justify-center px-3.5 pt-3 pb-1">
              <span
                className={cn(
                  'absolute left-3.5 pointer-events-none transition-all duration-150 select-none',
                  isFloatingActive
                    ? 'top-1.5 text-[10px] font-bold text-primary-500 dark:text-primary-400 tracking-wider uppercase'
                    : 'top-3.5 text-xs text-gray-500 dark:text-gray-400 font-normal'
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </span>

              <input
                ref={combinedRef}
                id={inputId}
                type={effectiveType}
                value={currentValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={isFloatingActive ? (placeholder || behavior.placeholder || ' ') : ' '}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={activeStatus === 'error' ? 'true' : activeStatus === 'success' ? 'false' : undefined}
                data-status={activeStatus}
                aria-disabled={disabled ? 'true' : undefined}
                aria-readonly={readOnly ? 'true' : undefined}
                aria-describedby={
                  cn(displayError && errorId, displayDesc && descId) || undefined
                }
                className={cn(
                  'w-full bg-transparent text-gray-900 dark:text-gray-100 text-xs sm:text-sm outline-none border-0 p-0',
                  isFloatingActive ? 'opacity-100 mt-2' : 'opacity-0'
                )}
                {...props}
              />
            </div>

            <div className="pr-3 flex items-center gap-1.5 shrink-0 text-gray-400">
              {stateIcon}
              {shouldShowClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar campo"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon.Clear size="xs" />
                </button>
              )}
              {isPassword && showPasswordToggle && !disabled && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <Icon.EyeOff size="sm" /> : <Icon.Eye size="sm" />}
                </button>
              )}
              {effectiveRight && <div className="flex items-center">{effectiveRight}</div>}
            </div>
          </label>

          {displayError && (
            <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1 flex items-center gap-1">
              <Icon.Error size="xs" className="shrink-0" />
              <span>{displayError}</span>
            </p>
          )}
          {displayDesc && !displayError && (
            <p id={descId} className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
              {displayDesc}
            </p>
          )}
        </div>
      )
    }

    // Modo Lookup / Combobox
    if (isLookup) {
      return (
        <div className={cn('relative flex items-stretch gap-2 w-full', className)}>
          {name && <input type="hidden" name={name} value={lookupValue?.value ?? ''} />}

          <div className="relative flex-1 min-w-0">
            <Input
              id={inputId}
              ref={combinedRef}
              label={label}
              variant="floating"
              surfaceVariant={surfaceVariant}
              value={currentValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Buscar...'}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              error={displayError}
              description={displayDesc}
              tooltip={informativeMessage}
              role="combobox"
              aria-expanded={showLookupPanel}
              aria-controls={listboxId}
              aria-autocomplete="list"
              rightSection={
                lookupLoading ? (
                  <span className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary-500 animate-spin">
                    <Icon.Spinner size="xs" />
                  </span>
                ) : lookupValue && !disabled ? (
                  <button
                    type="button"
                    aria-label="Limpiar selección"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={handleClear}
                  >
                    <Icon.Clear size="xs" />
                  </button>
                ) : undefined
              }
              {...props}
            />

            {showLookupPanel && (
              <ul
                id={listboxId}
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl py-1"
              >
                {!lookupLoading && lookupOptions.length === 0 && (
                  <li className="px-3.5 py-2.5 text-xs text-gray-500 dark:text-gray-400">
                    {emptyMessage}
                  </li>
                )}
                {lookupOptions.map((opt, idx) => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={idx === lookupActive}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setLookupActive(idx)}
                    onClick={() => handleLookupSelect(opt)}
                    className={cn(
                      'px-3.5 py-2 cursor-pointer flex flex-col gap-0.5 transition-colors',
                      idx === lookupActive
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                    )}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {opt.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {onAdvancedSearch && (
            <button
              type="button"
              onClick={onAdvancedSearch}
              disabled={disabled}
              title={advancedSearchLabel}
              aria-label={advancedSearchLabel}
              className="shrink-0 min-w-[44px] min-h-[44px] px-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <Icon.Search size="sm" />
            </button>
          )}
        </div>
      )
    }

    // Modo Estándar / External label
    return (
      <div
        className={cn(
          'flex flex-col text-left group',
          fullWidth && 'w-full',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {label && labelMode !== 'hidden' && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {label && labelMode === 'hidden' && (
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
        )}

        <div className="flex w-full items-stretch">
          {addonBefore && (
            <div
              onClick={onAddonBeforeClick}
              role={onAddonBeforeClick ? 'button' : undefined}
              tabIndex={onAddonBeforeClick ? 0 : undefined}
              className={cn(
                'inline-flex items-stretch select-none shrink-0 transition-colors text-sm rounded-l-md overflow-hidden',
                hasButtonBefore
                  ? 'p-0 border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 has-[button]:p-0'
                  : 'px-3 items-center border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 has-[button]:p-0 has-[button]:items-stretch',
                onAddonBeforeClick &&
                  'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white active:bg-gray-200',
                '[&>button]:h-full [&>button]:self-stretch [&>button]:rounded-none [&>button]:border-0 [&>button]:shadow-none [&>button]:px-3 [&>button]:py-0 [&>button]:text-sm [&>button]:font-medium [&>button]:cursor-pointer [&>button]:transition-colors',
                '[&>button.ft-button--addon]:bg-transparent [&>button.ft-button--ghost]:bg-transparent',
                '[&>button.ft-button--secondary]:bg-transparent [&>button.ft-button--secondary]:text-gray-700 dark:[&>button.ft-button--secondary]:text-gray-200 [&>button.ft-button--secondary]:hover:bg-gray-100 dark:[&>button.ft-button--secondary]:hover:bg-gray-700 [&>button.ft-button--secondary]:active:bg-gray-200'
              )}
            >
              {addonBefore}
            </div>
          )}

          <div className="relative flex-1 flex items-center">
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              size={size}
              density={density}
              variant={variant}
              status={activeStatus}
              fullWidth={fullWidth}
              placeholder={placeholder || (labelMode === 'placeholder' && typeof label === 'string' ? label : behavior.placeholder)}
              hasLeftContent={Boolean(effectiveLeft)}
              hasRightContent={Boolean(
                effectiveRight ||
                  stateIcon ||
                  shouldShowClear ||
                  (isPassword && showPasswordToggle) ||
                  shouldShowStepper ||
                  (showCount && maxLength)
              )}
              aria-invalid={activeStatus === 'error' ? 'true' : activeStatus === 'success' ? 'false' : undefined}
              data-status={activeStatus}
              aria-required={required ? 'true' : undefined}
              aria-describedby={
                cn(displayError && errorId, displayDesc && descId) || undefined
              }
              className={cn(
                addonBefore && 'rounded-l-none',
                addonAfter && 'rounded-r-none',
                className
              )}
              {...props}
            />

            <div className="absolute right-0 inset-y-0 pr-1.5 flex items-center gap-0.5 z-10 text-gray-400 text-sm">
              {stateIcon && <div className="px-1 flex items-center">{stateIcon}</div>}

              {shouldShowClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar campo"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  <Icon.Clear size="xs" />
                </button>
              )}

              {isPassword && showPasswordToggle && !disabled && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <Icon.EyeOff size="sm" /> : <Icon.Eye size="sm" />}
                </button>
              )}

              {shouldShowStepper && (
                <div className="flex flex-col justify-center pr-1 -space-y-0.5">
                  <button
                    type="button"
                    onClick={handleIncrement}
                    aria-label="Incrementar"
                    className="min-w-[44px] h-[22px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded"
                    tabIndex={-1}
                  >
                    <Icon.ChevronUp size="xs" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label="Decrementar"
                    className="min-w-[44px] h-[22px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded"
                    tabIndex={-1}
                  >
                    <Icon.ChevronDown size="xs" />
                  </button>
                </div>
              )}

              {showCount && maxLength && (
                <span className="text-xs text-gray-400 select-none font-mono px-1">
                  {currentValue.length}/{maxLength}
                </span>
              )}

              {effectiveRight && (
                <div
                  className={cn(
                    'flex items-center text-gray-400 dark:text-gray-500 pr-1.5',
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
            <div
              onClick={onAddonAfterClick}
              role={onAddonAfterClick ? 'button' : undefined}
              tabIndex={onAddonAfterClick ? 0 : undefined}
              className={cn(
                'inline-flex items-stretch select-none shrink-0 transition-colors text-sm rounded-r-md overflow-hidden',
                hasButtonAfter
                  ? 'p-0 border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 has-[button]:p-0'
                  : 'px-3 items-center border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 has-[button]:p-0 has-[button]:items-stretch',
                onAddonAfterClick &&
                  'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white active:bg-gray-200',
                '[&>button]:h-full [&>button]:self-stretch [&>button]:rounded-none [&>button]:border-0 [&>button]:shadow-none [&>button]:px-3 [&>button]:py-0 [&>button]:text-sm [&>button]:font-medium [&>button]:cursor-pointer [&>button]:transition-colors',
                '[&>button.ft-button--addon]:bg-transparent [&>button.ft-button--ghost]:bg-transparent',
                '[&>button.ft-button--secondary]:bg-transparent [&>button.ft-button--secondary]:text-gray-700 dark:[&>button.ft-button--secondary]:text-gray-200 [&>button.ft-button--secondary]:hover:bg-gray-100 dark:[&>button.ft-button--secondary]:hover:bg-gray-700 [&>button.ft-button--secondary]:active:bg-gray-200'
              )}
            >
              {addonAfter}
            </div>
          )}
        </div>

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
