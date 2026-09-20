import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateControls, type SingleDatePickerProps, type DateRangePickerProps, type TimeRangePickerProps } from '@/components/ui/DateControls'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

/**
 * DateControls — Suite completa de controles de fecha y hora.
 *
 * Incluye SingleDatePicker, DateRangePicker con presets, y TimeRangePicker.
 * Todos se integran con el locale del store para formato automático en español.
 */
const DATE_CONTROLS_SINGLE: SingleDatePickerProps = {
  label: 'Fecha del evento',
  placeholder: 'dd/mm/aaaa',
  value: undefined,
  onChange: () => {},
  minDate: undefined,
  maxDate: undefined,
  clearable: true,
  dateFormat: 'dd/MM/yyyy',
  placement: 'bottom',
}

const DATE_CONTROLS_RANGE: DateRangePickerProps = {
  label: 'Rango de fechas',
  placeholder: 'dd/mm/aaaa — dd/mm/aaaa',
  value: undefined,
  onChange: () => {},
  clearable: true,
  presets: ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'last7days', 'last30days'],
  dateFormat: 'dd/MM/yyyy',
  placement: 'bottom',
}

const meta = {
  title: '4-Inputs/DateControls',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Suite completa de controles de fecha y hora integrados con el locale del store (español). Incluye presets rápidos y validación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SingleDatePicker: Story = {
  name: 'SingleDatePicker',
  args: DATE_CONTROLS_SINGLE,
}

export const DateRangePicker: Story = {
  name: 'DateRangePicker con presets',
  args: DATE_CONTROLS_RANGE,
}

export const TimeRangePicker: Story = {
  name: 'TimeRangePicker',
  args: {
    label: 'Horario de atención',
    placeholder: '09:00 — 17:00',
    value: undefined,
    onChange: () => {},
    minTime: '06:00',
    maxTime: '22:00',
    step: 30,
    clearable: true,
    placement: 'bottom',
  } as any,
}
