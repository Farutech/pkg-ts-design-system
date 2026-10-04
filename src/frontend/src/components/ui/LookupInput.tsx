import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/utils/cn'
import { FloatingInput } from './FloatingInput'

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
)
const SEARCH = 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35'
const CLOSE = 'M18 6 6 18M6 6l12 12'
const SPINNER = 'M21 12a9 9 0 1 1-6.22-8.56'

export interface LookupOption {
  /** Identificador que se envía en el formulario (ej. UUID del cliente) */
  value: string
  /** Texto principal mostrado */
  label: string
  /** Texto secundario (código, documento, teléfono…) */
  description?: string
  /** Datos arbitrarios del registro para que el consumidor los recupere */
  data?: unknown
}

export interface LookupInputProps {
  /** Etiqueta flotante */
  label: string
  /** Nombre del input oculto que transporta `value` en FormData */
  name?: string
  /** Opción seleccionada (controlado) */
  value?: LookupOption | null
  /** Se dispara al seleccionar o limpiar */
  onChange?: (option: LookupOption | null) => void
  /** Proveedor de sugerencias (local o remoto) */
  onSearch: (query: string) => Promise<LookupOption[]> | LookupOption[]
  /** Si se define, muestra el botón de búsqueda avanzada a la derecha */
  onAdvancedSearch?: () => void
  /** Texto accesible / tooltip del botón de búsqueda avanzada */
  advancedSearchLabel?: string
  /** Tooltip informativo en hover del campo */
  tooltip?: ReactNode
  required?: boolean
  disabled?: boolean
  /** Caracteres mínimos para consultar (por defecto 1) */
  minChars?: number
  /** Debounce en ms (por defecto 250) */
  debounceMs?: number
  /** Mensaje cuando no hay resultados */
  emptyMessage?: string
  className?: string
}

/**
 * LookupInput - Campo de búsqueda con autocompletado y acceso a búsqueda avanzada.
 *
 * - Digitar filtra sugerencias (teclado: ↑ ↓ Enter Esc).
 * - El botón de lupa a la derecha abre criterios avanzados definidos por el consumidor.
 * - El valor seleccionado viaja en un input oculto (`name`) para formularios no controlados.
 */
export function LookupInput({
  label,
  name,
  value,
  onChange,
  onSearch,
  onAdvancedSearch,
  advancedSearchLabel = 'Búsqueda avanzada',
  tooltip,
  required,
  disabled,
  minChars = 1,
  debounceMs = 250,
  emptyMessage = 'Sin coincidencias',
  className,
}: LookupInputProps) {
  const listId = useId()
  const [text, setText] = useState(value?.label ?? '')
  const [options, setOptions] = useState<LookupOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const requestRef = useRef(0)

  // Sincroniza el texto cuando el valor cambia desde fuera (ej. búsqueda avanzada)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(value?.label ?? '')
  }, [value?.value, value?.label])

  useEffect(() => {
    if (!open) return
    const query = text.trim()
    if (query.length < minChars || query === value?.label) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions([])
      return
    }
    const requestId = ++requestRef.current
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await onSearch(query)
        if (requestId === requestRef.current) {
          setOptions(result)
          setActive(result.length ? 0 : -1)
        }
      } catch {
        if (requestId === requestRef.current) setOptions([])
      } finally {
        if (requestId === requestRef.current) setLoading(false)
      }
    }, debounceMs)
    return () => clearTimeout(timer)
    // onSearch se omite intencionalmente para no relanzar en cada render del consumidor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, open, minChars, debounceMs, value?.label])

  const select = (option: LookupOption | null) => {
    onChange?.(option)
    setText(option?.label ?? '')
    setOpen(false)
    setOptions([])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && open && active >= 0 && options[active]) {
      e.preventDefault()
      select(options[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showPanel = open && text.trim().length >= minChars && text !== value?.label

  return (
    <div className={cn('relative flex items-stretch gap-2 w-full', className)}>
      {name && <input type="hidden" name={name} value={value?.value ?? ''} />}

      <div className="relative flex-1 min-w-0">
        <FloatingInput
          label={label}
          tooltip={tooltip}
          required={required}
          disabled={disabled}
          value={text}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          onValueChange={(v) => {
            setText(v)
            setOpen(true)
            if (value && v !== value.label) onChange?.(null)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          suffix={
            loading ? (
              <Icon d={SPINNER} className="w-4 h-4 animate-spin text-violet-400" />
            ) : value && !disabled ? (
              <button
                type="button"
                aria-label="Limpiar selección"
                className="p-1 rounded-md hover:bg-white/5 hover:text-slate-200"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(null)}
              >
                <Icon d={CLOSE} className="w-3.5 h-3.5" />
              </button>
            ) : undefined
          }
        />

        {showPanel && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-auto rounded-xl border border-[#2f313d] bg-[#1a1b24] shadow-2xl py-1"
          >
            {!loading && options.length === 0 && (
              <li className="px-3.5 py-2.5 text-xs text-slate-500">{emptyMessage}</li>
            )}
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={index === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(option)}
                className={cn(
                  'px-3.5 py-2 cursor-pointer flex flex-col gap-0.5',
                  index === active ? 'bg-violet-500/15' : 'hover:bg-white/5'
                )}
              >
                <span className="text-sm text-slate-100">{option.label}</span>
                {option.description && (
                  <span className="text-[11px] text-slate-400">{option.description}</span>
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
          className="shrink-0 w-[52px] min-h-[52px] rounded-xl border border-[#2f313d] bg-[#16171e] text-slate-300 hover:text-violet-300 hover:border-violet-500/60 hover:bg-[#1a1b24] transition-colors flex items-center justify-center disabled:opacity-50"
        >
          <Icon d={SEARCH} className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

LookupInput.displayName = 'LookupInput'
