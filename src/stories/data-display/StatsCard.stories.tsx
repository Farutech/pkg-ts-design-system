import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsCard } from '@/components/ui/StatsCard'
import {
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

/**
 * StatsCard — Tarjeta de estadísticas / KPI con tendencias, íconos y sparklines.
 */
const meta = {
  title: '5-Data Display/StatsCard',
  component: StatsCard,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info', 'gray'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    title: { control: 'text' },
    value: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Usuarios activos',
    value: '12,456',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tarjeta KPI con valor principal, tendencia porcentual, ícono y descripción.',
      },
    },
  },
} satisfies Meta<typeof StatsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <UsersIcon className="h-6 w-6" />,
    change: { value: 12.5, trend: 'up', label: 'vs mes anterior' },
    description: 'Usuarios con sesión activa',
  },
}

export const DashboardKPIs: Story = {
  name: 'Dashboard KPIs',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '700px' }}>
      <StatsCard
        title="Ingresos del mes"
        value="$184,290"
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        variant="success"
        change={{ value: 18.2, trend: 'up', label: 'vs octubre' }}
        description="Objetivo: $200,000"
      />
      <StatsCard
        title="Órdenes activas"
        value="1,847"
        icon={<ShoppingCartIcon className="h-6 w-6" />}
        variant="primary"
        change={{ value: 7.4, trend: 'up', label: 'esta semana' }}
        description="145 pendientes de envío"
      />
      <StatsCard
        title="Tasa de conversión"
        value="3.24%"
        icon={<ChartBarIcon className="h-6 w-6" />}
        variant="info"
        change={{ value: 0.8, trend: 'down', label: 'vs semana pasada' }}
        description="Desde 4,201 visitas"
      />
      <StatsCard
        title="Tiempo promedio respuesta"
        value="2.4h"
        icon={<ClockIcon className="h-6 w-6" />}
        variant="warning"
        change={{ value: 15, trend: 'up', label: 'peor que ayer' }}
        description="SLA objetivo: 1.5h"
      />
    </div>
  ),
}

export const Tamaños: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <StatsCard title="Small" value="1,234" size="sm" icon={<UsersIcon className="h-5 w-5" />} variant="primary" change={{ value: 5, trend: 'up' }} />
      <StatsCard title="Medium" value="1,234" size="md" icon={<UsersIcon className="h-6 w-6" />} variant="primary" change={{ value: 5, trend: 'up' }} />
      <StatsCard title="Large" value="1,234" size="lg" icon={<UsersIcon className="h-7 w-7" />} variant="primary" change={{ value: 5, trend: 'up' }} />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px' }}>
      <StatsCard title="Ingresos" value="..." loading />
      <StatsCard title="Usuarios" value="..." loading />
    </div>
  ),
}
