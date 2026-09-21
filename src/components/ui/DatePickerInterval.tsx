import React, { useState } from 'react'
import { DatePicker } from './DatePicker'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface DatePickerIntervalProps {
  /** Fecha/hora inicial seleccionada */
  startDate?: Date | string | null
  /** Fecha/hora final seleccionada */
  endDate?: Date | string | null
  /** Callback cuando cambia el rango de fechas */
  onChange?: (range: { startDate: Date | null; endDate: Date | null }) => void
  /** Modo de selección */
  mode?: 'date' | 'time' | 'datetime'
  /** Label superior para todo el intervalo */
  label?: string
  /** Label del campo de inicio */
  startLabel?: string
  /** Label del campo de fin */
  endLabel?: string
  /** Placeholder para el campo de inicio */
  startPlaceholder?: string
  /** Placeholder para el campo de fin */
  endPlaceholder?: string
  /** Límite inferior global de fecha */
  minDate?: Date
  /** Límite superior global de fecha */
  maxDate?: Date
  /** Deshabilitar componente */
  disabled?: boolean
  /** Mensaje de error personalizado */
  error?: string
  /** Clase CSS adicional */
  className?: string
  /** Permitir limpiar valores */
  clearable?: boolean
}

/**
 * DatePickerInterval — Componente para selección de intervalos de fecha y hora.
 * 
 * Valida de forma estricta que la fecha/hora de fin sea mayor o igual a la fecha de inicio.
 * Bloquea en el calendario y selectores de la fecha de fin todas las fechas anteriores a la de inicio.
 */
export function DatePickerInterval({
  startDate: propStartDate,
  endDate: propEndDate,
  onChange,
  mode = 'date',
  label,
  startLabel = 'Desde',
  endLabel = 'Hasta',
  startPlaceholder,
  endPlaceholder,
  minDate,
  maxDate,
  disabled = false,
  error: customError,
  className,
  clearable = true,
}: DatePickerIntervalProps) {
  const [internalStart, setInternalStart] = useState<Date | null>(
    propStartDate ? (typeof propStartDate === 'string' ? new Date(propStartDate) : propStartDate) : null
  )
  const [internalEnd, setInternalEnd] = useState<Date | null>(
    propEndDate ? (typeof propEndDate === 'string' ? new Date(propEndDate) : propEndDate) : null
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  const activeStart = propStartDate !== undefined
    ? (propStartDate ? (typeof propStartDate === 'string' ? new Date(propStartDate) : propStartDate) : null)
    : internalStart

  const activeEnd = propEndDate !== undefined
    ? (propEndDate ? (typeof propEndDate === 'string' ? new Date(propEndDate) : propEndDate) : null)
    : internalEnd

  const handleStartChange = (newStart: Date | null) => {
    setInternalStart(newStart)
    let newEnd = activeEnd

    // Si la fecha de fin actual es anterior a la nueva fecha de inicio, resetear o ajustar fin
    if (newStart && activeEnd && activeEnd.getTime() < newStart.getTime()) {
      newEnd = null
      setInternalEnd(null)
      setValidationError('La fecha de fin debe ser posterior a la fecha de inicio')
    } else {
      setValidationError(null)
    }

    onChange?.({ startDate: newStart, endDate: newEnd })
  }

  const handleEndChange = (newEnd: Date | null) => {
    if (newEnd && activeStart && newEnd.getTime() < activeStart.getTime()) {
      setValidationError('La fecha final debe ser mayor o igual a la fecha inicial')
      return
    }

    setValidationError(null)
    setInternalEnd(newEnd)
    onChange?.({ startDate: activeStart, endDate: newEnd })
  }

  const displayedError = customError || validationError

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Selector Fecha Inicial */}
        <div className="flex-1">
          <DatePicker
            label={startLabel}
            value={activeStart}
            onChange={handleStartChange}
            mode={mode}
            minDate={minDate}
            maxDate={maxDate}
            placeholder={startPlaceholder || (mode === 'datetime' ? 'Inicio: fecha y hora' : 'Fecha inicio')}
            disabled={disabled}
            clearable={clearable}
            error={displayedError ? ' ' : undefined}
          />
        </div>

        <div className="hidden sm:flex items-center justify-center pt-6 text-gray-400">
          <ArrowRightIcon className="h-5 w-5" />
        </div>

        {/* Selector Fecha Final — Bloquea fechas anteriores a activeStart */}
        <div className="flex-1">
          <DatePicker
            label={endLabel}
            value={activeEnd}
            onChange={handleEndChange}
            mode={mode}
            minDate={activeStart || minDate}
            maxDate={maxDate}
            placeholder={endPlaceholder || (mode === 'datetime' ? 'Fin: fecha y hora' : 'Fecha fin')}
            disabled={disabled}
            clearable={clearable}
            error={displayedError ? ' ' : undefined}
          />
        </div>
      </div>

      {displayedError && displayedError.trim() !== '' && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
          {displayedError}
        </p>
      )}
    </div>
  )
}
