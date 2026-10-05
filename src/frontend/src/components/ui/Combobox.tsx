import {
  useState,
  useId,
  forwardRef,
  useMemo,
  type ReactNode,
  type ChangeEvent,
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
import { useFormContext } from './Form'
import type { LabelMode } from './input/types'

export interface ComboboxOption {
  value: string | number
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export interface ComboboxProps<T = ComboboxOption> extends DataMappingProps<T> {
  options: T[]
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string, item: T | null) => void
  onValueChange?: (value: string) => void

  label?: ReactNode
  labelMode?: LabelMode
  floatingTitle?: ReactNode
  activeLabel?: ReactNode
  description?: ReactNode
  error?: ReactNode
  placeholder?: string
  required?: boolean
  disabled?: boolean

  size?: InputSize
  density?: Density
  status?: InputStatus
  fullWidth?: boolean

  prefix?: ReactNode
  allowClear?: boolean
  name?: string
  id?: string
  className?: string
  emptyMessage?: ReactNode
  virtualized?: boolean
  maxDropdownHeight?: number | string
}

/**
 * Combobox:
 * Campo de texto interactivo con lista filtrable en tiempo real mientras el usuario digita.
 */
export const Combobox = forwardRef(function Combobox<T = ComboboxOption>(
  {
    options = [],
    value,
    defaultValue,
    onChange,
    onValueChange,
    label,
    labelMode,
    floatingTitle,
    activeLabel,
    description,
    error,
    placeholder = 'Escribe o selecciona...',
    required,
    disabled = false,
    size = 'md',
    density: propDensity,
    status: _status = 'default',
    fullWidth = true,
    prefix = <Icon.Search size="xs" />,
    allowClear = true,
    name,
    id,
    className,
    emptyMessage = 'No se encontraron coincidencias',
    virtualized,
    maxDropdownHeight = 260,
    valueKey,
    textKey,
    textTemplate,
    renderOption,
    isOptionDisabled,
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const contextDensity = useDensity()
  const activeDensity = propDensity ?? contextDensity

  const formContext = useFormContext()
  const effectiveLabelMode: LabelMode = labelMode || formContext.defaultLabelMode || 'external'
  const isFloating = effectiveLabelMode === 'floating' || effectiveLabelMode === 'placeholder'
  const generatedId = useId()
  const comboboxId = id || `ft-combobox-${generatedId}`

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ''
  )
  const [searchQuery, setSearchQuery] = useState('')

  const currentValue = value !== undefined ? String(value) : internalValue

  const selectedItem = useMemo(() => {
    return options.find((opt) => resolveOptionValue(opt, valueKey) === currentValue) ?? null
  }, [options, currentValue, valueKey])

  // Filtrado local de opciones según lo digitado
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options
    const q = searchQuery.toLowerCase()
    return options.filter((opt) => {
      const labelText = resolveOptionLabel(opt, textKey, textTemplate).toLowerCase()
      const valText = resolveOptionValue(opt, valueKey).toLowerCase()
      return labelText.includes(q) || valText.includes(q)
    })
  }, [options, searchQuery, textKey, textTemplate, valueKey])

  const handleSelect = (key: string, item: T) => {
    setInternalValue(key)
    setSearchQuery('')
    setIsOpen(false)
    onChange?.(key, item)
    onValueChange?.(key)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue('')
    setSearchQuery('')
    onChange?.('', null)
    onValueChange?.('')
  }

  const displayInputValue = isOpen
    ? searchQuery
    : selectedItem
    ? resolveOptionLabel(selectedItem, textKey, textTemplate)
    : searchQuery

  const heightClasses = {
    sm: { comfortable: 'h-9 text-sm px-2.5', compact: 'h-8 text-xs px-2', dense: 'h-6 text-xs px-1.5' },
    md: { comfortable: 'h-11 text-base px-3.5', compact: 'h-9 text-sm px-3', dense: 'h-7 text-xs px-2' },
    lg: { comfortable: 'h-14 text-lg px-4', compact: 'h-11 text-base px-3.5', dense: 'h-9 text-sm px-2.5' },
    xl: { comfortable: 'h-16 text-xl px-5', compact: 'h-12 text-lg px-4', dense: 'h-10 text-base px-3' },
  }[size][activeDensity]

  return (
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div ref={ref} className={cn('flex flex-col relative text-left', fullWidth && 'w-full')}>
        {!isFloating && label && effectiveLabelMode !== 'hidden' && (
          <label htmlFor={comboboxId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {name && <input type="hidden" name={name} value={currentValue} />}

        <div
          className={cn(
            'flex items-center justify-between border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md outline-none transition-colors',
            heightClasses,
            isFloating && 'min-h-[48px]',
            isOpen && 'ring-2 ring-primary-500/20 border-primary-500',
            error && 'border-red-500 ring-red-500/20',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
            className
          )}
        >
          <div className={cn("flex items-center gap-2 w-full relative", isFloating && "pt-3.5")}>
            {isFloating && (
              <span
                className={cn(
                  'absolute left-0 pointer-events-none transition-all duration-200 ease-out select-none transform origin-top-left',
                  (isOpen || Boolean(currentValue) || Boolean(searchQuery))
                    ? 'top-[-8px] text-[10px] font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase scale-95'
                    : 'top-0.5 text-xs text-gray-500 dark:text-gray-400 font-normal scale-100'
                )}
              >
                {(isOpen || Boolean(currentValue) || Boolean(searchQuery)) && (floatingTitle || activeLabel)
                  ? (floatingTitle || activeLabel)
                  : (label || placeholder)}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </span>
            )}
            {prefix && <span className="text-gray-400 shrink-0">{prefix}</span>}
            <input
              id={comboboxId}
              type="text"
              value={displayInputValue}
              onChange={handleInputChange}
              onFocus={() => !disabled && setIsOpen(true)}
              placeholder={
                isFloating
                  ? ((isOpen || Boolean(currentValue)) ? (selectedItem ? resolveOptionLabel(selectedItem, textKey, textTemplate) : placeholder) : '')
                  : (selectedItem ? resolveOptionLabel(selectedItem, textKey, textTemplate) : placeholder)
              }
              disabled={disabled}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {allowClear && (Boolean(currentValue) || Boolean(searchQuery)) && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Limpiar campo"
                className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                <Icon.Clear size="xs" />
              </button>
            )}

            <button
              type="button"
              tabIndex={-1}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon.ChevronDown
                size="xs"
                className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
              />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <ListboxCore
              items={filteredOptions}
              selectedKey={currentValue}
              onSelectKey={handleSelect}
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
}) as <T = ComboboxOption>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

;(Combobox as any).displayName = 'Combobox'
