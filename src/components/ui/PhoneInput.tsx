/**
 * Componente PhoneInput - Input de teléfono con selector de país y validación regex
 */

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

type ValidationMode = 'block' | 'error'

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

const countries: Country[] = [
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
]

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  defaultCountry?: string
  label?: string
  placeholder?: string
  error?: string
  className?: string
  /** Regex pattern para validación (por defecto: solo números) */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Mostrar input de búsqueda para filtrar países */
  showSearch?: boolean
  /** Deshabilitar el componente (modo solo lectura) */
  disabled?: boolean
}

export function PhoneInput({
  value = '',
  onChange,
  defaultCountry = 'US',
  label,
  placeholder = 'Número de teléfono',
  error,
  className,
  pattern = /^[0-9]*$/,
  validationMode = 'block',
  showSearch = false,
  disabled = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === defaultCountry) || countries[0],
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [validationError, setValidationError] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filtrar países según búsqueda
  const filteredCountries = searchQuery
    ? countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery)
      )
    : countries

  const displayError = error || validationError

  // Derivar el número/país visibles desde el valor controlado evita sincronizar
  // con efecto: si cambia `value`, el render siguiente ya muestra el parseo.
  const matchedCountry = value ? countries.find((c) => value.startsWith(c.dialCode)) : undefined
  const activeCountry = matchedCountry ?? selectedCountry
  const displayedPhoneNumber = value
    ? matchedCountry
      ? value.slice(matchedCountry.dialCode.length)
      : value
    : phoneNumber

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (pattern) {
      if (validationMode === 'block') {
        // Solo permitir valores que cumplan el patrón
        if (newValue === '' || pattern.test(newValue)) {
          setPhoneNumber(newValue)
          setValidationError('')
          onChange?.(`${activeCountry.dialCode}${newValue}`)
        }
      } else {
        // Permitir entrada pero mostrar error
        setPhoneNumber(newValue)
        if (newValue === '' || pattern.test(newValue)) {
          setValidationError('')
        } else {
          setValidationError('Solo se permiten números')
        }
        onChange?.(`${activeCountry.dialCode}${newValue}`)
      }
    } else {
      setPhoneNumber(newValue)
      onChange?.(`${activeCountry.dialCode}${newValue}`)
    }
  }


  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
    // Actualizar el valor completo con el nuevo indicativo
    onChange?.(`${country.dialCode}${displayedPhoneNumber}`)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        {/* Country selector */}
        <Listbox value={activeCountry} onChange={handleCountryChange} disabled={disabled}>
          <div className="relative w-32">
            <Listbox.Button
              className={cn(
                'relative w-full cursor-pointer rounded-xl border h-[46px] pl-3 pr-8 text-left flex items-center',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                'bg-white dark:bg-gray-800',
                displayError
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={disabled}
              aria-disabled={disabled}
              // cuando está deshabilitado quitar el pointer cursor
              style={disabled ? { cursor: 'not-allowed' } : undefined}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl leading-none">{activeCountry.flag}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 leading-none">
                  {activeCountry.dialCode}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-72 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
              {showSearch && !disabled && (
                <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar país..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="py-1 max-h-52 overflow-auto">
                {filteredCountries.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No se encontraron países
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <Listbox.Option
                      key={country.code}
                      value={country}
                      className={({ active }) =>
                        cn(
                          'relative cursor-pointer select-none py-2 pl-3 pr-9 mx-1 rounded-lg',
                          active && 'bg-primary-50 dark:bg-primary-900/20'
                        )
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{country.flag}</span>
                          <span className="flex-1">
                            <span
                              className={cn(
                                'block text-sm',
                                selected
                                  ? 'font-semibold text-primary-600 dark:text-primary-400'
                                  : 'font-medium text-gray-900 dark:text-white'
                              )}
                            >
                              {country.name}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {country.dialCode}
                            </span>
                          </span>
                        </div>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </div>
            </Listbox.Options>
          </div>
        </Listbox>

        {/* Phone number input */}
        <div className="flex-1">
          <input
            type="tel"
            value={displayedPhoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className={cn(
              'w-full px-4 h-[46px] border rounded-xl transition-all duration-200',
              'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              displayError
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-600'
            )}
            disabled={disabled}
            aria-disabled={disabled}
            style={disabled ? { backgroundColor: 'transparent' } : undefined}
          />
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{displayError}</p>
      )}
    </div>
  )
}
