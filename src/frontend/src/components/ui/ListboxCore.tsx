import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  type UIEvent,
  type HTMLAttributes,
} from 'react'
import { cn } from '@/utils/cn'
import { useDensity, useVirtualizationConfig } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'
import {
  type DataMappingProps,
  resolveOptionValue,
  resolveOptionLabel,
} from './DataMapping'
import { Icon } from '@/primitives/Icon/Icon'

export interface ListboxCoreProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: T[]
  /** Clave o claves seleccionadas actualmente */
  selectedKey?: string | string[]
  /** Callback al seleccionar una opción */
  onSelectKey?: (key: string, item: T) => void
  /** Selección múltiple */
  multiple?: boolean
  /** Configuración de mapeo de datos desacoplado */
  mapping?: DataMappingProps<T>
  /** Estado de virtualización: true (fuerza), false (desactiva), undefined (auto por umbral) */
  virtualized?: boolean
  /** Altura estimada de cada elemento en px para virtualización (default según densidad: 36px) */
  itemHeight?: number
  /** Altura máxima del contenedor de la lista (default: 260px) */
  maxHeight?: number | string
  density?: Density
  loading?: boolean
  loadingMessage?: ReactNode
  emptyMessage?: ReactNode
  /** Callback para sincronizar el elemento activo enfocado */
  onActiveIndexChange?: (index: number, key: string) => void
  /** ID base para atributos aria-activedescendant */
  idPrefix?: string
}

/**
 * ListboxCore (Primitiva Headless de Lista y Virtualización):
 * Base de Select, Combobox, Autocomplete, MultiSelect y EntityPicker.
 * Soporta virtualización matemática sin dependencias externas pesadas,
 * navegación por teclado ARIA APG 1.2 y mapeo genérico de entidades.
 */
export function ListboxCore<T>({
  items,
  selectedKey,
  onSelectKey,
  multiple = false,
  mapping = {},
  virtualized,
  itemHeight: propItemHeight,
  maxHeight = 260,
  density: propDensity,
  loading = false,
  loadingMessage = 'Cargando opciones...',
  emptyMessage = 'No se encontraron resultados',
  onActiveIndexChange,
  idPrefix = 'ft-opt',
  className,
  ...props
}: ListboxCoreProps<T>) {
  const contextDensity = useDensity()
  const activeDensity = propDensity ?? contextDensity
  const virtConfig = useVirtualizationConfig()

  // Altura del ítem según densidad
  const defaultHeight = {
    comfortable: 44,
    compact: 36,
    dense: 28,
  }[activeDensity]

  const itemHeight = propItemHeight ?? defaultHeight

  // Decisión de virtualización (3 estados)
  const isVirtualized = useMemo(() => {
    if (virtualized === true) return true
    if (virtualized === false) return false
    return items.length > virtConfig.listThreshold
  }, [virtualized, items.length, virtConfig.listThreshold])

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // Conjunto normalizado de claves seleccionadas
  const selectedSet = useMemo(() => {
    if (selectedKey === undefined || selectedKey === null) return new Set<string>()
    if (Array.isArray(selectedKey)) return new Set(selectedKey.map(String))
    return new Set([String(selectedKey)])
  }, [selectedKey])

  // Índice activo seguro ante cambios de longitud en items
  const safeActiveIndex = items.length > 0 ? Math.min(activeIndex, items.length - 1) : 0

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (isVirtualized) {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }

  // Cálculo de ventana visible (Windowing matemático)
  const numericMaxHeight = typeof maxHeight === 'number' ? maxHeight : 260
  const visibleCount = Math.ceil(numericMaxHeight / itemHeight)
  const buffer = 4

  const startIndex = isVirtualized
    ? Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    : 0
  const endIndex = isVirtualized
    ? Math.min(items.length, Math.floor(scrollTop / itemHeight) + visibleCount + buffer)
    : items.length

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, localIdx) => ({
      item,
      globalIndex: startIndex + localIdx,
      key: resolveOptionValue(item, mapping.valueKey),
      label: resolveOptionLabel(item, mapping.textKey, mapping.textTemplate),
    }))
  }, [items, startIndex, endIndex, mapping])

  const selectOptionByIndex = useCallback(
    (index: number) => {
      const target = items[index]
      if (!target) return
      if (mapping.isOptionDisabled?.(target)) return

      const key = resolveOptionValue(target, mapping.valueKey)
      onSelectKey?.(key, target)
    },
    [items, mapping, onSelectKey]
  )

  // Navegación con teclado
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (items.length === 0 || loading) return

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = safeActiveIndex < items.length - 1 ? safeActiveIndex + 1 : 0
        setActiveIndex(next)
        onActiveIndexChange?.(next, resolveOptionValue(items[next], mapping.valueKey))
        scrollToIndex(next)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = safeActiveIndex > 0 ? safeActiveIndex - 1 : items.length - 1
        setActiveIndex(prev)
        onActiveIndexChange?.(prev, resolveOptionValue(items[prev], mapping.valueKey))
        scrollToIndex(prev)
        break
      }
      case 'Home': {
        e.preventDefault()
        setActiveIndex(0)
        onActiveIndexChange?.(0, resolveOptionValue(items[0], mapping.valueKey))
        scrollToIndex(0)
        break
      }
      case 'End': {
        e.preventDefault()
        const last = items.length - 1
        setActiveIndex(last)
        onActiveIndexChange?.(last, resolveOptionValue(items[last], mapping.valueKey))
        scrollToIndex(last)
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        selectOptionByIndex(safeActiveIndex)
        break
      }
    }
  }

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return
    const elTop = index * itemHeight
    const elBottom = elTop + itemHeight
    const currentScroll = containerRef.current.scrollTop
    const viewHeight = containerRef.current.clientHeight

    if (elTop < currentScroll) {
      containerRef.current.scrollTop = elTop
    } else if (elBottom > currentScroll + viewHeight) {
      containerRef.current.scrollTop = elBottom - viewHeight
    }
  }

  const topOffset = isVirtualized ? startIndex * itemHeight : 0
  const bottomOffset = isVirtualized ? Math.max(0, (items.length - endIndex) * itemHeight) : 0

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-multiselectable={multiple ? 'true' : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
      style={{ maxHeight }}
      className={cn(
        'overflow-y-auto focus:outline-none select-none text-left p-1',
        className
      )}
      {...props}
    >
      {loading && (
        <div className="flex items-center justify-center p-4 gap-2 text-sm text-gray-500">
          <Icon.Spinner size="sm" className="text-primary-600" />
          <span>{loadingMessage}</span>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-400">
          {emptyMessage}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div style={{ paddingTop: topOffset, paddingBottom: bottomOffset }}>
          {visibleItems.map(({ item, globalIndex, key, label }) => {
            const isSelected = selectedSet.has(key)
            const isActive = globalIndex === safeActiveIndex
            const isDisabled = Boolean(mapping.isOptionDisabled?.(item))

            return (
              <div
                key={key}
                id={`${idPrefix}-${key}`}
                role="option"
                aria-selected={isSelected ? 'true' : 'false'}
                aria-disabled={isDisabled ? 'true' : undefined}
                style={{ height: itemHeight }}
                onClick={() => {
                  if (!isDisabled) {
                    setActiveIndex(globalIndex)
                    selectOptionByIndex(globalIndex)
                  }
                }}
                onMouseEnter={() => {
                  if (!isDisabled) {
                    setActiveIndex(globalIndex)
                    onActiveIndexChange?.(globalIndex, key)
                  }
                }}
                className={cn(
                  'flex items-center px-2.5 rounded-md cursor-pointer text-sm transition-colors',
                  isActive && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  isSelected && 'font-medium text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30',
                  isSelected && isActive && 'bg-primary-100/60 dark:bg-primary-900/40',
                  isDisabled && 'opacity-40 cursor-not-allowed bg-transparent text-gray-400'
                )}
              >
                {mapping.renderOption ? (
                  mapping.renderOption(item, { selected: isSelected, active: isActive })
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{label}</span>
                    {isSelected && (
                      <Icon.Check size="xs" className="text-primary-600 shrink-0 ml-2" />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
