import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePickerInterval, type DatePickerIntervalProps } from '@/components/ui/DatePickerInterval'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

/**
 * DatePickerInterval — Selector de Intervalo de Fechas y Horas con Validación Estricta.
 *
 * Cumple con el Anexo B:
 * - Valida automáticamente que fecha fin > fecha inicio.
 * - Bloquea en el selector de fecha fin cualquier selección anterior a la fecha de inicio.
 * - Soporta modos 'date', 'time' y 'datetime'.
 */
const meta: Meta<typeof DatePickerInterval> = {
  title: '4-Inputs/DatePickerInterval',
  component: DatePickerInterval,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente para selección de intervalos de fecha/hora. Valida que la fecha final sea superior a la inicial y bloquea fechas previas automáticamente.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['date', 'time', 'datetime'],
      description: 'Modo de selección del intervalo (fecha, hora o fecha y hora)',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilitar campos del intervalo',
    },
    clearable: {
      control: 'boolean',
      description: 'Permitir botón de limpiar fechas',
    },
  },
}

export default meta
type Story = StoryObj<typeof DatePickerInterval>

export const Default: Story = {
  name: 'Intervalo de Fecha (Por Defecto)',
  render: (args) => {
    const [range, setRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    })
    return (
      <div className="w-[500px] max-w-full">
        <DatePickerInterval
          {...args}
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={setRange}
        />
      </div>
    )
  },
  args: {
    label: 'Rango de fechas de reserva',
    startLabel: 'Check-in',
    endLabel: 'Check-out',
    mode: 'date',
  },
}

export const DateTimeInterval: Story = {
  name: 'Intervalo de Fecha y Hora (DateTime)',
  render: (args) => {
    const [range, setRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    })
    return (
      <div className="w-[540px] max-w-full">
        <DatePickerInterval
          {...args}
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={setRange}
        />
      </div>
    )
  },
  args: {
    label: 'Ventana de mantenimiento programado',
    startLabel: 'Inicio mantenimiento',
    endLabel: 'Fin mantenimiento',
    mode: 'datetime',
  },
}

export const ValidationInteraction: Story = {
  name: 'Validación Interactiva de Rango',
  render: (args) => {
    const [range, setRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
      startDate: new Date(2026, 8, 15),
      endDate: new Date(2026, 8, 20),
    })
    return (
      <div className="w-[500px] max-w-full">
        <DatePickerInterval
          {...args}
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={setRange}
        />
      </div>
    )
  },
  args: {
    label: 'Periodo de vigencia de contrato',
    mode: 'date',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    // Verifica que existan los botones de los dos inputs (start y end)
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  },
}
