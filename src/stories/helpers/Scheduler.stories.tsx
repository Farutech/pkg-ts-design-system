import type { Meta, StoryObj } from '@storybook/react-vite'
import { Scheduler } from '@/components/ui/Scheduler'

/**
 * Scheduler — calendario/agenda profesional con citas y vista de múltiples modos.
 *
 * Vistas: day, week, month, bimonth, quarter, semester, year.
 * Soporta agregar/editar/eliminar citas, filtrado por estado y navegación.
 */
const SAMPLE_APPOINTMENTS = [
  {
    id: 'apt-1',
    title: 'Reunión de equipo',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 30),
    description: 'Revisión semanal del sprint',
  },
  {
    id: 'apt-2',
    title: 'Entrevista de cliente',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 15, 15, 0),
    description: 'Cliente potencial — Tech Corp',
  },
  {
    id: 'apt-3',
    title: 'Lanzamiento de features',
    start: new Date(2024, 0, 16, 9, 0),
    end: new Date(2024, 0, 16, 10, 0),
    description: 'Demo de nuevas funcionalidades',
  },
  {
    id: 'apt-4',
    title: 'Call de seguimiento',
    start: new Date(2024, 0, 17, 11, 0),
    end: new Date(2024, 0, 17, 11, 30),
    description: 'Seguimiento post-entrega',
  },
  {
    id: 'apt-5',
    title: 'Review de código',
    start: new Date(2024, 0, 17, 15, 0),
    end: new Date(2024, 0, 17, 16, 0),
    description: 'Revisión del PR #42',
  },
]

const meta = {
  title: '10-Helpers/Scheduler',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Calendario/agenda profesional con múltiples vistas (day, week, month, etc.), citas, filtrado por estado y navegación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CalendarioMensual: Story = {
  render: () => (
    <Scheduler
      appointments={SAMPLE_APPOINTMENTS}
      onAppointmentsChange={() => {}}
      config={{}}
      defaultView="month"
      defaultDate={new Date(2024, 0, 1)}
    />
  ),
}

export const VistaDeDia: Story = {
  name: 'Vista de día (agenda)',
  render: () => (
    <Scheduler
      appointments={SAMPLE_APPOINTMENTS}
      onAppointmentsChange={() => {}}
      config={{}}
      defaultView="day"
      defaultDate={new Date(2024, 0, 15)}
    />
  ),
}

export const VistaDeSemana: Story = {
  name: 'Vista de semana',
  render: () => (
    <Scheduler
      appointments={SAMPLE_APPOINTMENTS}
      onAppointmentsChange={() => {}}
      config={{}}
      defaultView="week"
      defaultDate={new Date(2024, 0, 15)}
    />
  ),
}
