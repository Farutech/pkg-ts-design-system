import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DatePicker, DateRangePicker } from '@/components/ui/DatePicker'
import { useState } from 'react'

const meta = {
  title: '4-Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector de fechas con popover calendar, soporte de hora y rango. Incluye presets rapidos y validacion min/max.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Etiqueta del selector de fecha' },
    mode: {
      control: 'select',
      options: ['date', 'time', 'datetime'],
      description: 'Modo de seleccion',
    },
    placeholder: { control: 'text', description: 'Texto sugerido cuando no hay valor' },
    disabled: { control: 'boolean', description: 'Deshabilita la interaccion' },
    clearable: { control: 'boolean', description: 'Permite limpiar la seleccion' },
    className: { control: 'text', description: 'Clases CSS para el contenedor' },
  },
  args: {
    label: 'Fecha de entrega pactada',
    mode: 'date',
    placeholder: 'DD/MM/AAAA',
    disabled: false,
    clearable: true,
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    return <ControlledDatePicker {...args} />
  },
}

function ControlledDatePicker(props: any) {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <div className="w-[360px]">
      <DatePicker {...props} value={date} onChange={setDate} />
    </div>
  )
}

export const ModoFecha: Story = {
  name: 'Modo Fecha (Solo Fecha)',
  args: {
    label: 'Fecha de nacimiento',
    mode: 'date',
    placeholder: 'DD/MM/YYYY',
  },
  render: (args: any) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return (
      <div style={{ width: '360px' }}>
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const clearButton = canvas.getByRole('button', { name: 'Limpiar fecha' })
    await expect(clearButton.parentElement?.closest('button')).toBeNull()
    await userEvent.click(clearButton)
    await expect(canvas.getByRole('button', { name: /DD\/MM\/YYYY/i })).toBeInTheDocument()
  },
}

export const ModoHora: Story = {
  name: 'Modo Hora (Solo Hora)',
  args: {
    label: 'Hora de inicio de reunion',
    mode: 'time',
    placeholder: 'HH:mm',
  },
  render: (args: any) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return (
      <div style={{ width: '360px' }}>
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    )
  },
}

export const ModoFechaYHora: Story = {
  name: 'Modo Fecha y Hora (Datetime)',
  args: {
    label: 'Cita de mantenimiento',
    mode: 'datetime',
    placeholder: 'DD/MM/YYYY HH:mm',
  },
  render: (args: any) => {
    const [date, setDate] = useState<Date | null>(new Date())
    return (
      <div style={{ width: '360px' }}>
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    )
  },
}

export const ConRangoYPresets: Story = {
  name: 'Rango con presets',
  render: () => {
    const [range, setRange] = useState<[Date | null, Date | null]>([null, null])
    return (
      <div style={{ width: '440px' }}>
        <DateRangePicker
          label="Periodo de reporte"
          value={range}
          onChange={setRange}
          presets={['today', 'thisWeek', 'thisMonth', 'lastMonth']}
        />
      </div>
    )
  },
}
