import type { Meta, StoryObj } from '@storybook/react'
import { StatsCard } from '@/components/ui/StatsCard'
import { ChartArea, ChartPie } from '@/components/ui/Charts'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Table } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'

/**
 * DashboardAnalytics — dashboard de analítica con StatsCards, gráficos y tabla top pages.
 */

const AREA_DATA = [
  { day: 'Lun', visits: 1200, sessions: 850 },
  { day: 'Mar', visits: 1800, sessions: 1300 },
  { day: 'Mié', visits: 1650, sessions: 1200 },
  { day: 'Jue', visits: 2100, sessions: 1600 },
  { day: 'Vie', visits: 2800, sessions: 2100 },
  { day: 'Sáb', visits: 1900, sessions: 1400 },
  { day: 'Dom', visits: 1100, sessions: 750 },
]

const PIE_DATA = [
  { name: 'Navegador directo', value: 38 },
  { name: 'Búsqueda orgánica', value: 29 },
  { name: 'Redes sociales', value: 18 },
  { name: 'Email marketing', value: 10 },
  { name: 'Otros', value: 5 },
]

const TOP_PAGES_COLUMNS = [
  { key: 'page', header: 'Página', align: 'left' },
  { key: 'visitors', header: 'Visitas', align: 'right' },
  { key: 'avgTime', header: 'Tiempo prom.', align: 'center' },
  { key: 'bounce', header: 'Bounce', align: 'center' },
]

const TOP_PAGES_ROWS = [
  { id: '1', cells: { page: '/dashboard', visitors: '4,230', avgTime: '3:42', bounce: '28%' } },
  { id: '2', cells: { page: '/analytics', visitors: '3,102', avgTime: '5:15', bounce: '22%' } },
  { id: '3', cells: { page: '/products', visitors: '2,841', avgTime: '2:30', bounce: '45%' } },
  { id: '4', cells: { page: '/pricing', visitors: '1,920', avgTime: '4:08', bounce: '31%' } },
  { id: '5', cells: { page: '/blog', visitors: '1,540', avgTime: '6:22', bounce: '19%' } },
]

const meta = {
  title: '11-Templates/Dashboard Analytics',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard analítica: StatsCards KPI + ChartArea tendencias + ChartPie distribución + tabla top páginas.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DashboardDeAnalitica: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', height: '100vh', overflow: 'auto', background: 'var(--ft-color-background)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Analítica del Sitio</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="primary">Este mes</Badge>
          <Badge variant="success">En línea</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatsCard title="Visitantes totales" value="14,923" change="+18.4%" changeType="positive" icon="users" />
        <StatsCard title="Sesiones únicas" value="8,741" change={{ value: 12.1, trend: 'up', label: '%' }} icon="chart" />
        <StatsCard title="Tasa de rebote" value="31.2%" change="-4.3%" changeType="positive" icon="arrow" />
        <StatsCard title="Páginas vistas" value="42,350" change="+8.7%" changeType="positive" icon="eye" />
      </div>

      <Card style={{ padding: '1.5rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Tendencia de visitas (7 días)</h2>
          <Badge variant="success">+22% vs sem. anterior</Badge>
        </div>
        <div style={{ height: '220px' }}>
          <ChartArea data={AREA_DATA} xAxisKey="day" dataKey="visits" height={220} showLegend={false} />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ padding: '1.25rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.75rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Fuente de tráfico</h2>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <ChartPie data={PIE_DATA} nameKey="name" dataKey="value" height={220} donut />
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.75rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Top 5 páginas</h2>
          <Table columns={TOP_PAGES_COLUMNS} rows={TOP_PAGES_ROWS} variant="striped" size="sm" headerVariant="dark" />
        </Card>
      </div>
    </div>
  ),
}
