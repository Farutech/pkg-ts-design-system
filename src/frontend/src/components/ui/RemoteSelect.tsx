import {
  useState,
  useRef,
  useId,
  forwardRef,
  type ReactNode,
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
import { useAsyncDataSource } from '@/hooks/useAsyncDataSource'
import { ClickOutside } from '@/primitives/ClickOutside'
import { Icon } from '@/primitives/Icon/Icon'

export interface RemoteSelectProps<T> extends DataMappingProps<T> {
  /** Función asíncrona de carga de datos que recibe la consulta y el AbortSignal */
  loadOptions: (query: string, context: { signal: AbortSignal }) => Promise<T[]>
  /** Milisegundos de espera para debounce (default: 300) */
  debounceMs?: number
  /** Mínimo de caracteres para disparar búsqueda (default: 0) */
  minChars?: number
  /** Valor seleccionado actual (controlado) */
  value?: string | number
  /** Callback al cambiar la selección */
  onChange?: (value: string, item: T) => void
  onValueChange?: (value: string) => void

  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  placeholder?: string
  searchPlaceholder?: string
  required?: boolean
  disabled?: boolean

  size?: InputSize
  density?: Density
  variant?: InputVariant
  status?: InputStatus
  fullWidth?: boolean

  prefix?: ReactNode
  suffix?: ReactNode
  allowClear?: boolean

  name?: string
  id?: string
  className?: string
  emptyMessage?: ReactNode
  loadingMessage?: ReactNode
  virtualized?: boolean
  maxDropdownHeight?: number | string
}

/**
 * RemoteSelect:
 * Selector asíncrono empresarial con debounce, cancelación automática con AbortController,
 * caché LRU y mapeo declarativo desacoplado de entidades.
 */
export const RemoteSelect = forwardRef(function RemoteSelect<T>(
  {
    loadOptions,
    debounceMs = 300,
    minChars = 0,
    value,
    onChange,
    onValueChange,
    label,
    description,
    error,
    placeholder = 'Seleccionar...',
    searchPlaceholder = 'Buscar...',
    required,
    disabled = false,
    size = 'md',
    density: propDensity,
    variant: _variant = 'outline',
    status: _status = 'default',
    fullWidth = true,
    prefix,
    suffix: _suffix,
    allowClear = true,
    name,
    id,
    className,
    emptyMessage = 'No se encontraron resultados',
    loadingMessage = 'Buscando...',
    virtualized,
    maxDropdownHeight = 260,
    valueKey,
    textKey,
    textTemplate,
    renderOption,
    renderValue,
    isOptionDisabled,
  }: RemoteSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const contextDensity = useDensity()
  const activeDensity = propDensity ?? contextDensity

  const generatedId = useId()
  const selectId = id || `ft-remoteselect-${generatedId}`

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(value !== undefined ? String(value) : '')
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null)

  const currentValue = value !== undefined ? String(value) : internalValue
  const searchInputRef = useRef<HTMLInputElement>(null)

  const {
    data: options,
    isLoading,
    search,
    query,
  } = useAsyncDataSource<T>({
    loadData: loadOptions,
    debounceMs,
    minChars,
    immediate: true,
  })

  // Sincronizar entidad seleccionada si aparece en los datos cargados
  const foundInOptions = options.find(
    (opt) => resolveOptionValue(opt, valueKey) === currentValue
  )
  const activeItem = foundInOptions ?? selectedEntity

  const selectedDisplayLabel = activeItem
    ? resolveOptionLabel(activeItem, textKey, textTemplate)
    : ''

  const handleSelect = (key: string, item: T) => {
    setInternalValue(key)
    setSelectedEntity(item)
    setIsOpen(false)
    onChange?.(key, item)
    onValueChange?.(key)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue('')
    setSelectedEntity(null)
    onChange?.('', {} as T)
    onValueChange?.('')
  }

  const handleOpen = () => {
    if (disabled) return
    setIsOpen(true)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 50)
  }

  const heightClasses = {
    sm: { comfortable: 'h-9 text-sm px-2.5', compact: 'h-8 text-xs px-2', dense: 'h-6 text-xs px-1.5' },
    md: { comfortable: 'h-11 text-base px-3.5', compact: 'h-9 text-sm px-3', dense: 'h-7 text-xs px-2' },
    lg: { comfortable: 'h-14 text-lg px-4', compact: 'h-11 text-base px-3.5', dense: 'h-9 text-sm px-2.5' },
  }[size][activeDensity]

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div
        ref={ref}
        className={cn('flex flex-col relative text-left', fullWidth && 'w-full')}
      >
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {name && <input type="hidden" name={name} value={currentValue} />}

        {/* Trigger principal */}
        <div
          id={selectId}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          onClick={handleOpen}
          className={cn(
            'flex items-center justify-between cursor-pointer border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md outline-none',
            heightClasses,
            error && 'border-red-500 focus-within:ring-red-500',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {prefix && <span className="text-gray-400">{prefix}</span>}
            {activeItem ? (
              renderValue ? (
                renderValue(activeItem)
              ) : (
                <span className="truncate">{selectedDisplayLabel}</span>
              )
            ) : (
              <span className="text-gray-400 dark:text-gray-500 truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {allowClear && Boolean(currentValue) && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Limpiar selección"
                className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                <Icon.Clear size="xs" />
              </button>
            )}

            {isLoading ? (
              <Icon.Spinner size="xs" className="text-primary-600" />
            ) : (
              <Icon.ChevronDown
                size="xs"
                className={cn('text-gray-400 transition-transform duration-200', isOpen && 'rotate-180')}
              />
            )}
          </div>
        </div>

        {/* Popover con Buscador integrado y ListboxCore */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <Icon.Search size="xs" className="text-gray-400 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-sm bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              {isLoading && <Icon.Spinner size="xs" className="text-primary-600 shrink-0" />}
            </div>

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

        {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
        {description && !error && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
    </ClickOutside>
  )
}) as <T>(
  props: RemoteSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

;(RemoteSelect as any).displayName = 'RemoteSelect'
