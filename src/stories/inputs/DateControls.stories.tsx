import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DatePicker as AdvancedDatePicker,
  DateRangePicker as AdvancedDateRangePicker,
  TimeRangePicker as AdvancedTimeRangePicker,
} from '@/components/ui/DateControls'
import type { SingleDatePickerProps, DateRangePickerProps, TimeRangePickerProps } from '@/components/ui/DateControls'

/**
 * DateControls — Suite completa de controles de fecha y hora.
 *
 * Incluye SingleDatePicker, DateRangePicker con presets, y TimeRangePicker.
 * Todos se integran con el locale del store para formato automático en español.
 */
const meta: Meta = {
  title: '4-Inputs/DateControls',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Suite completa de controles de fecha y hora integrados con el locale del store (español). Incluye presets rápidos, navegación avanzada y validación.',
      },
    },
  },
}

export default meta

export const SingleDatePicker: StoryObj<SingleDatePickerProps> = {
  name: 'SingleDatePicker',
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return (
      <div className="w-80">
        <AdvancedDatePicker
          {...args}
          value={date}
          onChange={(newDate) => setDate(newDate)}
        />
      </div>
    )
  },
  args: {
    label: 'Fecha del evento',
    placeholder: 'dd/mm/aaaa',
    clearable: true,
    placement: 'bottom',
    showTime: false,
  },
}

export const DateRangePicker: StoryObj<DateRangePickerProps> = {
  name: 'DateRangePicker con presets',
  render: (args) => {
    const [range, setRange] = useState<[Date | null, Date | null]>([new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)])
    return (
      <div className="w-96">
        <AdvancedDateRangePicker
          {...args}
          value={range}
          onChange={(newRange) => setRange(newRange)}
        />
      </div>
    )
  },
  args: {
    label: 'Rango de fechas',
    placeholder: 'dd/mm/aaaa — dd/mm/aaaa',
    clearable: true,
    presets: ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'last7days', 'last30days'],
  },
}

export const TimeRangePicker: StoryObj<TimeRangePickerProps> = {
  name: 'TimeRangePicker',
  render: (args) => {
    const [timeRange, setTimeRange] = useState<[string, string]>(['09:00', '18:00'])
    return (
      <div className="w-80">
        <AdvancedTimeRangePicker
          {...args}
          value={timeRange}
          onChange={(newRange) => setTimeRange(newRange)}
        />
      </div>
    )
  },
  args: {
    label: 'Horario de atención',
    placeholder: '09:00 — 18:00',
    minTime: '06:00',
    maxTime: '22:00',
    step: 30,
  },
}
