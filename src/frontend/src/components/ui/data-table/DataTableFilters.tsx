import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Density } from '@/tokens/tokens'
import { cn } from '@/utils/cn'
import { Input } from '../Input'
import { Select } from '../Select'
import { Button } from '../Button'
import { DatePicker, DateRangePicker } from '../DateControls'
import type { DataTableFilter, FilterState, FilterValue } from './types'

/**
 * data-table/DataTableFilters.tsx — Panel de filtros tipados (Fase 4)
 */

export interface DataTableFiltersProps {
  filters: DataTableFilter[]
  filterValues: FilterState
  onFilterChange: (filterId: string, value: FilterValue) => void
  onClearFilters: () => void
  activeFiltersCount: number
  density?: Density
}

export function DataTableFilters({
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  density = 'compact',
}: DataTableFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FunnelIcon className="h-4 w-4" />
          Filtros Activos
        </h4>
        {activeFiltersCount > 0 && (
          <Button variant="secondary" size="sm" onClick={onClearFilters} className="text-xs">
            <XMarkIcon className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filters.map((filter) => (
          <div key={filter.id} className={filter.width || 'col-span-1'}>
            <DataTableFilterControl
              filter={filter}
              value={filterValues[filter.id]}
              onChange={(value) => onFilterChange(filter.id, value)}
              density={density}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface DataTableFilterControlProps {
  filter: DataTableFilter
  value: FilterValue
  onChange: (value: FilterValue) => void
  density?: Density
}

export function DataTableFilterControl({ filter, value, onChange, density = 'compact' }: DataTableFilterControlProps) {
  switch (filter.type) {
    case 'text':
      return (
        <Input
          label={filter.label}
          placeholder={filter.placeholder || `Buscar por ${filter.label.toLowerCase()}...`}
          value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
          onChange={(e) => onChange(e.target.value)}
          density={density}
        />
      )
    case 'select':
      return (
        <Select
          label={filter.label}
          value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
          onChange={(val: unknown) => onChange(typeof val === 'string' ? val : '')}
          options={[
            { label: `Todos`, value: '' },
            ...(filter.options || []),
          ]}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          label={filter.label}
          value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          density={density}
        />
      )
    case 'date':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          <DatePicker
            value={typeof value === 'string' ? new Date(value) : null}
            onChange={(date: Date | null) => onChange(date?.toISOString() ?? null)}
            placeholder={filter.placeholder}
          />
        </div>
      )
    case 'multiselect': {
      const selectedValues = Array.isArray(value) ? (value as string[]) : []
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          <select
            multiple
            value={selectedValues}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => option.value)
              onChange(selected)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {filter.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Mantén Ctrl/Cmd para seleccionar múltiples
          </p>
        </div>
      )
    }

    case 'daterange': {
      const raw = Array.isArray(value) ? (value as [string, string]) : [null, null] as [null, null]
      const parsed: [Date | null, Date | null] = [
        raw[0] ? new Date(raw[0] as string) : null,
        raw[1] ? new Date(raw[1] as string) : null,
      ]
      return (
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          <DateRangePicker
            value={parsed}
            onChange={(r) => {
              if (r[0] && r[1]) onChange([r[0].toISOString(), r[1].toISOString()])
              else onChange(null)
            }}
          />
        </div>
      )
    }

    case 'numberrange': {
      const obj = (typeof value === 'object' && value !== null && !Array.isArray(value))
        ? (value as { min?: number | string; max?: number | string })
        : {}
      return (
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mínimo"
              value={obj.min !== undefined ? String(obj.min) : ''}
              onChange={(e) => {
                const next = { ...obj, min: e.target.value ? Number(e.target.value) : undefined }
                onChange(next.min || next.max ? next : null)
              }}
              density={density}
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={obj.max !== undefined ? String(obj.max) : ''}
              onChange={(e) => {
                const next = { ...obj, max: e.target.value ? Number(e.target.value) : undefined }
                onChange(next.min || next.max ? next : null)
              }}
              density={density}
            />
          </div>
        </div>
      )
    }

    case 'location':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          <Input
            placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            prefix={<span className="text-gray-400">📍</span>}
            density={density}
          />
          {filter.options && filter.options.length > 0 && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Ubicaciones disponibles: {filter.options.map((o) => o.label).join(', ')}
            </div>
          )}
        </div>
      )

    case 'color':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {filter.label}
          </label>
          {filter.options && filter.options.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => onChange(String(option.value))}
                  className={cn(
                    'relative w-10 h-10 rounded-lg border-2 transition-all',
                    value === option.value
                      ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800 border-primary-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
                  )}
                  style={{ backgroundColor: String(option.value) }}
                  title={option.label}
                >
                  {value === option.value && (
                    <svg
                      className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow-lg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
              {Boolean(value) && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  title="Limpiar color"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={typeof value === 'string' ? value : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <Input
                placeholder="#000000"
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
                density={density}
              />
              {Boolean(value) && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}
