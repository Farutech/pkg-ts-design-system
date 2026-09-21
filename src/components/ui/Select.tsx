/**
 * Componente Select reutilizable con soporte para carga asíncrona
 * Puede recibir datos directamente (hardcoded) o cargarlos desde una API
 */

import { forwardRef, useMemo } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'
import { ListBox } from './ListBox'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  /** Opciones estáticas (hardcoded) */
  options?: SelectOption[]
  /** Datos cargados asíncronamente (prioriza sobre options) */
  asyncData?: SelectOption[]
  /** Estado de carga asíncrona */
  isLoading?: boolean
  /** Mensaje mientras se cargan los datos */
  loadingMessage?: string
  /** Mensaje cuando no hay opciones disponibles */
  emptyMessage?: string
  fullWidth?: boolean
  placeholder?: string
  /** Habilitar campo input para digitar y filtrar elementos (C-11 / Anexo C) */
  searchable?: boolean
  /** Placeholder del input de búsqueda */
  searchPlaceholder?: string
  /** Callback para búsqueda remota / llamada a API con debounce */
  onSearch?: (query: string) => Promise<SelectOption[]> | void
  /** Milisegundos de debounce para la búsqueda (default: 300ms) */
  debounceMs?: number
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      asyncData,
      isLoading = false,
      loadingMessage = 'Cargando...',
      emptyMessage = 'No hay opciones disponibles',
      fullWidth = true,
      placeholder,
      searchable = false,
      searchPlaceholder = 'Buscar opción...',
      onSearch,
      debounceMs = 300,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(7)}`
    
    // Priorizar asyncData sobre options si está disponible
    const finalOptions = useMemo(() => {
      if (asyncData !== undefined) {
        return asyncData
      }
      return options
    }, [asyncData, options])

    // Si es searchable, delegamos al componente ListBox con modo de búsqueda y debounce
    if (searchable) {
      const listBoxOptions = finalOptions.map((opt) => ({
        id: String(opt.value),
        label: opt.label,
        disabled: opt.disabled,
      }))

      return (
        <ListBox
          options={listBoxOptions}
          value={props.value !== undefined ? String(props.value) : undefined}
          onChange={(val) => {
            if (typeof props.onChange === 'function') {
              props.onChange({ target: { value: val } } as any)
            }
          }}
          label={label}
          placeholder={placeholder}
          className={cn(fullWidth && 'w-full', className)}
          error={error}
          searchable
          searchPlaceholder={searchPlaceholder}
          onSearch={
            onSearch
              ? async (query) => {
                  const res = await onSearch(query)
                  if (Array.isArray(res)) {
                    return res.map((item) => ({
                      id: String(item.value),
                      label: item.label,
                      disabled: item.disabled,
                    }))
                  }
                  return []
                }
              : undefined
          }
          debounceMs={debounceMs}
          loading={isLoading}
          emptyMessage={emptyMessage}
        />
      )
    }

    const hasOptions = finalOptions && finalOptions.length > 0
    const isDisabled = disabled || (isLoading && !hasOptions)

    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'input w-full appearance-none pr-10',
              error && 'border-red-500 focus:ring-red-500',
              (!hasOptions && !isLoading) && 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed',
              isLoading && 'opacity-50 cursor-wait',
              className
            )}
            disabled={isDisabled || !hasOptions}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {isLoading ? (
              <option value="" disabled>
                {loadingMessage}
              </option>
            ) : !hasOptions ? (
              <option value="" disabled>
                {emptyMessage}
              </option>
            ) : (
              finalOptions.map((option) => (
                <option 
                  key={String(option.value)} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            )}
          </select>

          {/* Icono de loading o chevrón */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <Spinner size="sm" className="text-primary-600" />
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
