import {
  useState,
  useId,
  forwardRef,
  useMemo,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { cn } from '@/utils/cn'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'
import type { InputSize, InputStatus } from './InputBase'
import {
  type DataMappingProps,
  resolveOptionValue,
  resolveOptionLabel,
} from './DataMapping'
import { ListboxCore } from './ListboxCore'
import { ClickOutside } from '@/primitives/ClickOutside'
import { Icon } from '@/primitives/Icon/Icon'

export interface MultiSelectOption {
  value: string | number
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export interface MultiSelectProps<T = MultiSelectOption> extends DataMappingProps<T> {
  options: T[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[], items: T[]) => void
  onValueChange?: (values: string[]) => void

  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  placeholder?: string
  required?: boolean
  disabled?: boolean

  size?: InputSize
  density?: Density
  status?: InputStatus
  fullWidth?: boolean

  allowClear?: boolean
  name?: string
  id?: string
  className?: string
  emptyMessage?: ReactNode
  virtualized?: boolean
  maxDropdownHeight?: number | string
}

/**
 * MultiSelect:
 * Selector de selección múltiple con chips interactivos, botón de borrado masivo
 * y lista de opciones virtualizada.
 */
export const MultiSelect = forwardRef(function MultiSelect<T = MultiSelectOption>(
  {
    options = [],
    value,
    defaultValue,
    onChange,
    onValueChange,
    label,
    description,
    error,
    placeholder = 'Selecciona opciones...',
    required,
    disabled = false,
    size: _size = 'md',
    density: propDensity,
    status: _status = 'default',
    fullWidth = true,
    allowClear = true,
    name,
    id,
    className,
    emptyMessage = 'No hay más opciones',
    virtualized,
    maxDropdownHeight = 260,
    valueKey,
    textKey,
    textTemplate,
    renderOption,
    isOptionDisabled,
  }: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const contextDensity = useDensity()
  const activeDensity = propDensity ?? contextDensity

  const generatedId = useId()
  const selectId = id || `ft-multiselect-${generatedId}`

  const [isOpen, setIsOpen] = useState(false)
  const [internalValues, setInternalValues] = useState<string[]>(
    value ?? defaultValue ?? []
  )

  const currentValues = value ?? internalValues

  // Mapa de clave -> objeto
  const optionsMap = useMemo(() => {
    const map = new Map<string, T>()
    for (const opt of options) {
      map.set(resolveOptionValue(opt, valueKey), opt)
    }
    return map
  }, [options, valueKey])

  const selectedItems = useMemo(() => {
    return currentValues
      .map((k) => optionsMap.get(k))
      .filter((item): item is T => item !== undefined)
  }, [currentValues, optionsMap])

  const handleSelectKey = (key: string, _item: T) => {
    let nextValues: string[]
    if (currentValues.includes(key)) {
      nextValues = currentValues.filter((k) => k !== key)
    } else {
      nextValues = [...currentValues, key]
    }

    const nextItems = nextValues
      .map((k) => optionsMap.get(k))
      .filter((i): i is T => i !== undefined)

    setInternalValues(nextValues)
    onChange?.(nextValues, nextItems)
    onValueChange?.(nextValues)
  }

  const handleRemoveItem = (keyToRemove: string, e: MouseEvent) => {
    e.stopPropagation()
    const nextValues = currentValues.filter((k) => k !== keyToRemove)
    const nextItems = nextValues
      .map((k) => optionsMap.get(k))
      .filter((i): i is T => i !== undefined)

    setInternalValues(nextValues)
    onChange?.(nextValues, nextItems)
    onValueChange?.(nextValues)
  }

  const handleClearAll = (e: MouseEvent) => {
    e.stopPropagation()
    setInternalValues([])
    onChange?.([], [])
    onValueChange?.([])
  }

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div ref={ref} className={cn('flex flex-col relative text-left', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {name && (
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(currentValues)}
          />
        )}

        {/* Trigger contenedor de chips */}
        <div
          id={selectId}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex flex-wrap items-center gap-1.5 p-1.5 min-h-[38px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md outline-none cursor-pointer',
            isOpen && 'ring-2 ring-primary-500/20 border-primary-500',
            error && 'border-red-500 ring-red-500/20',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
            className
          )}
        >
          {selectedItems.length === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500 px-1.5">{placeholder}</span>
          ) : (
            selectedItems.map((item) => {
              const k = resolveOptionValue(item, valueKey)
              const labelText = resolveOptionLabel(item, textKey, textTemplate)
              return (
                <span
                  key={k}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                >
                  <span className="truncate max-w-[120px]">{labelText}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(k, e)}
                      aria-label={`Eliminar ${labelText}`}
                      className="hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <Icon.Close size="xs" />
                    </button>
                  )}
                </span>
              )
            })
          )}

          <div className="flex items-center gap-1 ml-auto shrink-0 pr-1">
            {allowClear && currentValues.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                aria-label="Limpiar todos"
                className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                tabIndex={-1}
              >
                <Icon.Clear size="xs" />
              </button>
            )}

            <Icon.ChevronDown
              size="xs"
              className={cn('text-gray-400 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <ListboxCore
              items={options}
              selectedKey={currentValues}
              onSelectKey={handleSelectKey}
              multiple
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
}) as <T = MultiSelectOption>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

;(MultiSelect as any).displayName = 'MultiSelect'
