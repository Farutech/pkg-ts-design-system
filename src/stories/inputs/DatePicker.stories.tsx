import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker, DateTimePicker, DateRangePicker } from '@/components/ui/DatePicker'
import { useState } from 'react'

/**
 * DatePicker — selector de fechas profesional con vue de popover.
 *
 * Soporta fecha simple, datetime con selector de hora, y rango con presets rápidos.
 * El formato de fecha se rederives del locale del store.
 */
function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null)
  const [dateTime, setDateTime] = useState<Date | null>(null)
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <DatePicker
        label="Fecha de nacimiento"
        value={date}
        onChange={setDate}
        minDate={new Date('1950-01-01')}
        maxDate={new Date()}
        clearable
      />
      <DateTimePicker
        label="Fecha y hora del evento"
        value={dateTime}
        onChange={setDateTime}
        showTime
        clearable
      />
      <DateRangePicker
        label="Rango de fechas"
        value={range}
        onChange={setRange}
        presets={['today', 'thisWeek', 'thisMonth', 'lastMonth']}
      />
      {date && (
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          Fecha seleccionada: <span style={{ fontFamily: 'monospace' }}>{date.toLocaleDateString('es-ES')}</span>
        </p>
      )}
    </div>
  )
}

const meta = {
  title: '4-Inputs/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector de fechas con popover calendar, soporte de hora y rango. Incluye presets rápidos y validación min/max.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SeleccionDeFecha: Story = {
  render: () => <DatePickerDemo />,
}

export const DatePickerSimple: Story = {
  name: 'Solo fecha (sin hora)',
  args: {
    label: 'Fecha de vencimiento',
    placeholder: 'DD/MM/YYYY',
  },
  render: (args: any) => {
    const [date, setDate] = useState<Date | null>(null)
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
          label="Período de reporte"
          value={range}
          onChange={setRange}
          presets={['today', 'thisWeek', 'thisMonth', 'lastMonth']}
        />
      </div>
    )
  },
}
