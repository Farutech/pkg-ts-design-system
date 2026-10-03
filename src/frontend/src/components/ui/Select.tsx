import {
  useState,
  useRef,
  useId,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { cn } from '@/utils/cn'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'
import type { InputSize, InputStatus, InputVariant } from './InputBase'
import {
  type DataMappingProps,
  resolveOptionValue,
  resolveOptionLabel,
} from './DataMapping'
import { ListboxCore } from './ListboxCore'
import { ClickOutside } from '@/primitives/ClickOutside'
import { Icon } from '@/primitives/Icon/Icon'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  [key: string]: unknown
}

export interface SelectProps<T = SelectOption> extends DataMappingProps<T> {
  /** Opciones estáticas o dinámicas */
  options?: T[]
  /** Valor seleccionado actual (controlado) */
  value?: string | number
  /** Valor inicial por defecto */
  defaultValue?: string | number

  /**
   * Contrato único y canónico de selección de valor (Enterprise Design System API).
   * Emite directamente el valor serializado y la entidad original `T`.
   */
  onValueChange?: (value: string, item?: T) => void

  /**
   * @deprecated Utilice `onValueChange(value, item)`. `onChange` será eliminado en v2.0.0.
   * Si requiere transformar a un evento sintético de formulario HTML, use `createLegacySelectHandler`.
   */
  onChange?: (value: string, item?: T) => void

  /** Habilitar campo de búsqueda/filtro dentro del selector */
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => Promise<T[]> | void
  debounceMs?: number

  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  placeholder?: string
  required?: boolean
  disabled?: boolean

  size?: InputSize
  density?: Density
  variant?: InputVariant
  status?: InputStatus
  fullWidth?: boolean

  prefix?: ReactNode
  suffix?: ReactNode
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  allowClear?: boolean

  /** Nombre del campo para serialización en formularios estándar */
  name?: string
  id?: string
  className?: string

  /** Estado de carga asíncrona */
  isLoading?: boolean
  loadingMessage?: ReactNode
  emptyMessage?: ReactNode

  /** Forzar o desactivar virtualización en la lista */
  virtualized?: boolean
  maxDropdownHeight?: number | string
}

/**
 * Select (Componente Unificado de Selección):
 * Construido sobre ListboxCore y DataMappingProps.
 * Elimina la dualidad del select nativo y ofrece una experiencia homogénea,
 * accesible y virtualizada tanto para listas estáticas como remotas.
 */
export const Select = forwardRef(function Select<T = SelectOption>(
  {
    options = [],
    value,
    defaultValue,
    onChange,
    onValueChange,
    label,
    description,
    error,
    helperText,
    placeholder = 'Selecciona una opción...',
    required,
    disabled = false,
    size = 'md',
    density: propDensity,
    variant = 'outline',
    status = 'default',
    fullWidth = true,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    allowClear = false,
    name,
    id,
    className,
    isLoading = false,
    loadingMessage = 'Cargando opciones...',
    emptyMessage = 'No hay opciones disponibles',
    virtualized,
    maxDropdownHeight = 260,
    valueKey,
    textKey,
    textTemplate,
    renderOption,
    renderValue,
    isOptionDisabled,
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const contextDensity = useDensity()
  const activeDensity = propDensity ?? contextDensity

  const generatedId = useId()
  const selectId = id || `ft-select-${generatedId}`
  const labelId = `${selectId}-label`
  const errorId = `${selectId}-error`
  const descId = `${selectId}-desc`

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined
      ? String(value)
      : defaultValue !== undefined
      ? String(defaultValue)
      : ''
  )

  const currentValue = value !== undefined ? String(value) : internalValue
  const triggerRef = useRef<HTMLDivElement>(null)

  // Advertencia de deprecación en desarrollo si se utiliza onChange en lugar de onValueChange
  const hasWarnedRef = useRef(false)
  if (process.env.NODE_ENV !== 'production' && onChange && !hasWarnedRef.current) {
    console.warn(
      '[pkg-ts-design-system] Select: La propiedad "onChange" está deprecada y se eliminará en v2.0.0. Utilice el contrato único canónico "onValueChange(value, item)".'
    )
    hasWarnedRef.current = true
  }

  // Encontrar el objeto seleccionado actual
  const selectedItem = options.find(
    (opt) => resolveOptionValue(opt, valueKey) === currentValue
  )

  const selectedDisplayLabel = selectedItem
    ? resolveOptionLabel(selectedItem, textKey, textTemplate)
    : ''

  const handleSelect = (key: string, item: T) => {
    setInternalValue(key)
    setIsOpen(false)
    onChange?.(key, item)
    onValueChange?.(key, item)
    triggerRef.current?.focus()
  }

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setInternalValue('')
    onChange?.('', undefined)
    onValueChange?.('')
  }

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(true)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const displayError = error
  const activeStatus: InputStatus = displayError ? 'error' : status
  const displayDesc = description || helperText

  // Clases por tamaño y densidad
  const heightClasses = {
    sm: { comfortable: 'h-9 text-sm px-2.5', compact: 'h-8 text-xs px-2', dense: 'h-6 text-xs px-1.5' },
    md: { comfortable: 'h-11 text-base px-3.5', compact: 'h-9 text-sm px-3', dense: 'h-7 text-xs px-2' },
    lg: { comfortable: 'h-14 text-lg px-4', compact: 'h-11 text-base px-3.5', dense: 'h-9 text-sm px-2.5' },
  }[size][activeDensity]

  const variantStyles = {
    outline: 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md',
    filled: 'border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md',
    borderless: 'border-none bg-transparent shadow-none px-0',
    underline: 'border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent rounded-none px-0',
  }[variant]

  const statusStyles = {
    default: 'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
    error: 'border-red-500 dark:border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
    warning: 'border-amber-500 dark:border-amber-500',
    success: 'border-emerald-500 dark:border-emerald-500',
  }[activeStatus]

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div
        ref={ref}
        className={cn('flex flex-col relative text-left', fullWidth && 'w-full')}
      >
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Input oculto para compatibilidad con FormData / formularios nativos */}
        {name && <input type="hidden" name={name} value={currentValue} />}

        {/* Fila del Trigger con Addons exteriores */}
        <div className="flex w-full items-stretch relative">
          {addonBefore && (
            <div className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm rounded-l-md shrink-0 select-none">
              {addonBefore}
            </div>
          )}

          {/* Trigger clickeable simulando Input */}
          <div
            ref={triggerRef}
            id={selectId}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-disabled={disabled ? 'true' : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? (typeof placeholder === 'string' ? placeholder : undefined) : undefined}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-required={required ? 'true' : undefined}
            aria-invalid={activeStatus === 'error' ? 'true' : undefined}
            aria-describedby={cn(displayError && errorId, displayDesc && descId) || undefined}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              'flex-1 flex items-center justify-between cursor-pointer select-none outline-none transition-colors',
              heightClasses,
              variantStyles,
              statusStyles,
              disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
              addonBefore && 'rounded-l-none',
              addonAfter && 'rounded-r-none',
              className
            )}
          >
            {/* Lado Izquierdo */}
            <div className="flex items-center gap-2 truncate">
              {prefix && <span className="text-gray-400 shrink-0">{prefix}</span>}
              {selectedItem ? (
                renderValue ? (
                  renderValue(selectedItem)
                ) : (
                  <span className="truncate">{selectedDisplayLabel}</span>
                )
              ) : (
                <span className="text-gray-400 dark:text-gray-500 truncate">
                  {placeholder}
                </span>
              )}
            </div>

            {/* Lado Derecho (Limpieza + Chevron / Spinner) */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {allowClear && Boolean(currentValue) && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar selección"
                  className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <Icon.Clear size="xs" />
                </button>
              )}

              {suffix && <span className="text-gray-400">{suffix}</span>}

              {isLoading ? (
                <Icon.Spinner size="xs" className="text-primary-600" />
              ) : (
                <Icon.ChevronDown
                  size="xs"
                  className={cn(
                    'text-gray-400 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              )}
            </div>
          </div>

          {addonAfter && (
            <div className="inline-flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm rounded-r-md shrink-0 select-none">
              {addonAfter}
            </div>
          )}

          {/* Menú Desplegable Flotante */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <ListboxCore
                items={options}
                selectedKey={currentValue}
                onSelectKey={handleSelect}
                loading={isLoading}
                loadingMessage={loadingMessage}
                emptyMessage={emptyMessage}
                density={activeDensity}
                virtualized={virtualized}
                maxHeight={maxDropdownHeight}
                mapping={{
                  valueKey,
                  textKey,
                  textTemplate,
                  renderOption,
                  isOptionDisabled,
                }}
              />
            </div>
          )}
        </div>

        {/* Mensaje de Error */}
        {displayError && (
          <p id={errorId} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <Icon.Error size="xs" className="shrink-0" />
            <span>{displayError}</span>
          </p>
        )}

        {/* Descripción */}
        {displayDesc && !displayError && (
          <p id={descId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {displayDesc}
          </p>
        )}
      </div>
    </ClickOutside>
  )
}) as <T = SelectOption>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

;(Select as any).displayName = 'Select'

/**
 * Adaptador de compatibilidad para conectar el evento de selección a manejadores legados
 * que esperan un objeto de evento sintético con `{ target: { name, value } }`.
 */
export function createLegacySelectHandler(
  name: string,
  handler?: (event: { target: { name: string; value: string }; currentTarget: { name: string; value: string } }) => void
) {
  return (value: string) => {
    handler?.({
      target: { name, value },
      currentTarget: { name, value },
    })
  }
}
