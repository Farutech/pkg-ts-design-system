import { useState, useMemo, useRef, useEffect, forwardRef } from 'react'
import { Input, type InputProps } from './Input'
import { COUNTRIES, findCountryByCode, type CountryData } from '@/utils/countries'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export type { CountryData }
export { COUNTRIES }

export interface PhoneInputProps
  extends Omit<InputProps, 'type' | 'onChange' | 'value' | 'defaultValue'> {
  /** Valor completo con prefijo internacional (ej: "+573001234567") o número nacional */
  value?: string
  /** Valor por defecto para formularios no controlados */
  defaultValue?: string
  /** Código ISO del país inicial (por defecto 'CO' para Colombia) */
  defaultCountry?: string
  /** Callback estándar al cambiar el teléfono */
  onChange?: (fullNumber: string, country: CountryData, nationalNumber: string) => void
  /** Callback simple con el número internacional completo */
  onValueChange?: (fullNumber: string) => void
  /** Mostrar campo de búsqueda en el menú de países (por defecto true) */
  showSearch?: boolean
}

/**
 * PhoneInput - Componente de teléfono internacional basado en el Lego `Input`.
 *
 * Características:
 * - Selector de país desacoplado como addon exterior: previene borrar accidentalmente el prefijo.
 * - Muestra bandera + prefijo fijo (ej: 🇨🇴 +57).
 * - Búsqueda de países por nombre, código ISO o indicativo.
 * - Colombia (CO) y principales países ordenados con prioridad.
 * - Hereda automáticamente todo el sistema de labels (por fuera, centrado, horizontal o flotante interior).
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      defaultValue = '',
      defaultCountry = 'CO',
      onChange,
      onValueChange,
      placeholder = '300 123 4567',
      showSearch = true,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryData>(() =>
      findCountryByCode(defaultCountry)
    )
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Extracción de número nacional y país desde el valor
    const rawInitial = value !== undefined ? value : defaultValue
    const matchedFromValue = useMemo(() => {
      if (!rawInitial) return null
      // Buscar si el valor comienza con algún prefijo conocido
      return COUNTRIES.find((c) => rawInitial.startsWith(c.dialCode)) || null
    }, [rawInitial])

    const activeCountry = matchedFromValue || selectedCountry

    // Extraer solo los dígitos del número nacional
    const nationalNumber = useMemo(() => {
      if (!rawInitial) return ''
      if (rawInitial.startsWith(activeCountry.dialCode)) {
        return rawInitial.slice(activeCountry.dialCode.length).trim()
      }
      return rawInitial.replace(/^\+?\d{1,4}/, '').trim() || rawInitial
    }, [rawInitial, activeCountry])

    const [internalNational, setInternalNational] = useState(nationalNumber)

    useEffect(() => {
      if (value !== undefined) {
        if (value.startsWith(activeCountry.dialCode)) {
          setInternalNational(value.slice(activeCountry.dialCode.length).trim())
        } else {
          setInternalNational(value)
        }
      }
    }, [value, activeCountry])

    const filteredCountries = useMemo(() => {
      if (!searchQuery.trim()) return COUNTRIES
      const q = searchQuery.toLowerCase()
      return COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.dialCode.includes(q)
      )
    }, [searchQuery])

    const handleNumberChange = (val: string) => {
      // Filtrar solo dígitos y espacios
      const cleaned = val.replace(/[^\d\s]/g, '')
      setInternalNational(cleaned)
      const digitsOnly = cleaned.replace(/\s+/g, '')
      const full = digitsOnly ? `${activeCountry.dialCode}${digitsOnly}` : ''
      onChange?.(full, activeCountry, digitsOnly)
      onValueChange?.(full)
    }

    const handleSelectCountry = (country: CountryData, close: () => void) => {
      setSelectedCountry(country)
      close()
      setSearchQuery('')
      const digitsOnly = internalNational.replace(/\s+/g, '')
      const full = digitsOnly ? `${country.dialCode}${digitsOnly}` : ''
      onChange?.(full, country, digitsOnly)
      onValueChange?.(full)
    }

    const countryAddon = (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              disabled={disabled}
              className={cn(
                'flex items-center gap-1.5 h-full px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 outline-none transition-colors select-none',
                open ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
              aria-label={`Seleccionar país. Actual: ${activeCountry.name} (${activeCountry.dialCode})`}
            >
              <span className="text-base leading-none select-none">{activeCountry.flag}</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{activeCountry.dialCode}</span>
              <ChevronDownIcon
                className={cn('w-3.5 h-3.5 text-gray-400 transition-transform duration-200', open && 'rotate-180')}
              />
            </Popover.Button>

            <Popover.Panel className="absolute top-full left-0 mt-1 z-50 w-72 max-h-72 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl flex flex-col animate-fadeIn">
              {showSearch && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0">
                  <div className="relative flex items-center">
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar país o prefijo..."
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-1">
                {filteredCountries.length === 0 ? (
                  <p className="p-4 text-center text-xs text-gray-400">No se encontraron países</p>
                ) : (
                  filteredCountries.map((c) => {
                    const isSelected = c.code === activeCountry.code
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCountry(c, close)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors',
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base select-none">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="font-mono text-gray-400 dark:text-gray-500 ml-2 shrink-0">
                          {c.dialCode}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    )

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        addonBefore={countryAddon}
        placeholder={placeholder}
        value={internalNational}
        onValueChange={handleNumberChange}
        disabled={disabled}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
