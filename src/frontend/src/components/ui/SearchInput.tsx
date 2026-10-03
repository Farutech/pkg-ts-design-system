import { forwardRef, type KeyboardEvent } from 'react'
import { Input, type InputProps } from './Input'
import { Icon } from '@/primitives/Icon/Icon'

export interface SearchInputProps extends InputProps {
  /** Callback invocado al presionar Enter o limpiar el campo */
  onSearch?: (query: string) => void
}

/**
 * SearchInput:
 * Campo de búsqueda con icono de lupa preconfigurado, botón de limpieza rápida y evento onSearch.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      prefix = <Icon.Search size="sm" />,
      allowClear = true,
      placeholder = 'Buscar...',
      onSearch,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value)
      }
      onKeyDown?.(e)
    }

    return (
      <Input
        ref={ref}
        type="search"
        prefix={prefix}
        allowClear={allowClear}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onValueChange={(val) => {
          if (val === '' && onSearch) {
            onSearch('')
          }
          props.onValueChange?.(val)
        }}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
