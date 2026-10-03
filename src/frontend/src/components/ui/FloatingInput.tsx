import {
  forwardRef,
  useState,
  useId,
  useRef,
  type ReactNode,
  type InputHTMLAttributes,
  type ChangeEvent,
  type FocusEvent,
} from 'react'
import { cn } from '@/utils/cn'

export interface FloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Etiqueta flotante que asciende a título al hacer clic o al contener valor */
  label: string
  /** Mensaje informativo o tooltip que aparece al pasar el cursor (hover) */
  tooltip?: ReactNode
  /** Alias para tooltip */
  info?: ReactNode
  /** Mensaje de error para validación */
  error?: ReactNode
  /** Marca el campo como requerido */
  required?: boolean
  /** Icono o elemento prefijo */
  prefix?: ReactNode
  /** Icono o elemento sufijo */
  suffix?: ReactNode
  /** Callback simplificado de cambio de valor */
  onValueChange?: (value: string) => void
  /** Variante visual de la superficie */
  surfaceVariant?: 'dark' | 'glass' | 'default'
  /** Ancho completo */
  fullWidth?: boolean
}

/**
 * FloatingInput - Input con etiqueta flotante inmediata y tooltip informativo en hover.
 * 
 * Cumple con el estándar Ordeon / FaruTech:
 * - Al hacer clic/foco o contener texto, la etiqueta asciende de inmediato a título superior.
 * - Si se define `tooltip` o `info`, se muestra un mensaje informativo contextual en hover.
 * - Sin información adicional, no despliega nada para mantener la sobriedad visual.
 */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      tooltip,
      info,
      error,
      required,
      prefix,
      suffix,
      onValueChange,
      onChange,
      onFocus,
      onBlur,
      className,
      surfaceVariant = 'dark',
      fullWidth = true,
      value,
      defaultValue,
      id,
      type = 'text',
      placeholder = ' ',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `ft-floating-input-${generatedId}`
    const internalInputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      ;(internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    }

    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [internalVal, setInternalVal] = useState<string>(
      String(value ?? defaultValue ?? '')
    )

    const currentValue = value !== undefined ? String(value) : internalVal
    const isFloating = isFocused || Boolean(currentValue && currentValue.length > 0)
    const informativeMessage = tooltip || info

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInternalVal(e.target.value)
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

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
        {/* Tooltip contextual informativo que se muestra en hover si existe */}
        {informativeMessage && isHovered && (
          <div
            role="tooltip"
            className="absolute -top-8 left-2 z-50 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-slate-900/95 text-slate-100 border border-violet-500/30 shadow-xl backdrop-blur-md transition-opacity pointer-events-none whitespace-nowrap animate-fadeIn"
          >
            {informativeMessage}
            <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900/95" />
          </div>
        )}

        {/* Contenedor del campo */}
        <label
          htmlFor={inputId}
          className={cn(
            'relative flex items-center min-h-[52px] rounded-xl border transition-all duration-150 cursor-text overflow-hidden',
            // Superficies
            surfaceVariant === 'dark' &&
              'bg-[#16171e] hover:bg-[#1a1b24] border-[#2f313d] hover:border-[#404354]',
            surfaceVariant === 'glass' &&
              'bg-slate-900/70 backdrop-blur-md border-slate-700/60 hover:border-slate-600',
            surfaceVariant === 'default' &&
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
            // Estados de foco y error
            isFocused &&
              'border-violet-500 ring-2 ring-violet-500/25 bg-[#181922] shadow-[0_0_12px_rgba(139,92,246,0.15)]',
            error && 'border-red-500 ring-2 ring-red-500/20',
            className
          )}
        >
          {prefix && (
            <div className="pl-3.5 pr-1 flex items-center text-slate-400 shrink-0">
              {prefix}
            </div>
          )}

          <div className="relative flex-1 h-full flex flex-col justify-center px-3.5 pt-3 pb-1">
            {/* Etiqueta flotante / Título */}
            <span
              className={cn(
                'absolute left-3.5 pointer-events-none transition-all duration-150 select-none',
                isFloating
                  ? 'top-1.5 text-[10px] font-bold text-violet-400 tracking-wider uppercase'
                  : 'top-3.5 text-xs text-slate-400 font-normal'
              )}
            >
              {label}
              {required && <span className="text-red-400 ml-0.5">*</span>}
            </span>

            {/* Input nativo */}
            <input
              ref={combinedRef}
              id={inputId}
              type={type}
              value={value !== undefined ? value : internalVal}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isFloating ? placeholder : ' '}
              disabled={disabled}
              className={cn(
                'w-full bg-transparent text-slate-100 text-xs sm:text-sm outline-none border-0 p-0',
                isFloating ? 'opacity-100 mt-2' : 'opacity-0'
              )}
              {...props}
            />
          </div>

          {suffix && (
            <div className="pr-3.5 pl-1 flex items-center text-slate-400 shrink-0">
              {suffix}
            </div>
          )}
        </label>

        {/* Mensaje de error inferior */}
        {error && (
          <span className="text-[11px] text-red-400 font-medium mt-1 ml-1 flex items-center gap-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'
