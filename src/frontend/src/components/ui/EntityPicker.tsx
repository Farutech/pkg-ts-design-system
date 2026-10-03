import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/primitives/Icon/Icon'
import { useDebounce } from '@/hooks/useDebounce'

export interface EntityPickerProps<T extends { id: string | number }> {
  label?: string
  placeholder?: string
  value?: T | null
  onValueChange?: (entity: T | null) => void
  onSearch: (query: string) => Promise<T[]> | T[]
  renderItem: (entity: T, isSelected: boolean) => React.ReactNode
  renderTrigger?: (entity: T) => React.ReactNode
  title?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
}

/**
 * EntityPicker - Selector modal empresarial para selección de entidades complejas de negocio
 * (clientes, proveedores, productos, centros de costos).
 */
export function EntityPicker<T extends { id: string | number }>({
  label,
  placeholder = 'Buscar y seleccionar...',
  value,
  onValueChange,
  onSearch,
  renderItem,
  renderTrigger,
  title = 'Seleccionar elemento',
  disabled = false,
  clearable = true,
  className,
}: EntityPickerProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 250)

  const handleOpen = async () => {
    if (disabled) return
    setIsOpen(true)
    setIsLoading(true)
    try {
      const items = await onSearch('')
      setResults(items)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!isOpen) return
    let active = true

    async function execute() {
      setIsLoading(true)
      try {
        const items = await onSearch(debouncedSearch)
        if (active) setResults(items)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    execute()
    return () => {
      active = false
    }
  }, [debouncedSearch, isOpen, onSearch])

  const handleSelect = (entity: T) => {
    onValueChange?.(entity)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.(null)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Disparador */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpen()
          }
        }}
        className={cn(
          'w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-left transition-colors cursor-pointer select-none',
          disabled && 'opacity-60 cursor-not-allowed pointer-events-none bg-gray-100 dark:bg-gray-900'
        )}
      >
        <div className="flex-1 truncate mr-2">
          {value ? (
            renderTrigger ? (
              renderTrigger(value)
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {(value as any).name || (value as any).title || value.id}
              </span>
            )
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              title="Limpiar"
            >
              <Icon.Close size="xs" />
            </button>
          )}
          <Icon.Search size="sm" />
        </div>
      </div>

      {/* Modal de búsqueda y selección */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        size="md"
      >
        <div className="space-y-4">
          <Input
            prefix={<Icon.Search size="sm" className="text-gray-400" />}
            placeholder="Escriba para filtrar resultados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Icon.Loading size="sm" className="animate-spin text-primary-600" />
                <span>Buscando resultados...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No se encontraron registros coincidentes
              </div>
            ) : (
              results.map((item) => {
                const isSelected = value?.id === item.id

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSelect(item)
                    }}
                    className={cn(
                      'p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 ring-1 ring-primary-500'
                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex-1">{renderItem(item, isSelected)}</div>
                    {isSelected && <Icon.Success size="sm" className="text-primary-600 ml-2 shrink-0" />}
                  </div>
                )
              })
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
