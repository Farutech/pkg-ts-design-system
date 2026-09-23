import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsCard } from '@/components/ui/StatsCard'
import { ChartArea, ChartPie } from '@/components/ui/Charts'
import { Badge } from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import {
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

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
  { key: 'page', header: 'Página', align: 'left' as const },
  { key: 'visitors', header: 'Visitas', align: 'right' as const },
  { key: 'avgTime', header: 'Tiempo prom.', align: 'center' as const },
  { key: 'bounce', header: 'Bounce', align: 'center' as const },
]

const TOP_PAGES_ROWS = [
  { id: '1', cells: { page: '/dashboard', visitors: '4,230', avgTime: '3:42', bounce: '28%' } },
  { id: '2', cells: { page: '/analytics', visitors: '3,102', avgTime: '5:15', bounce: '22%' } },
  { id: '3', cells: { page: '/products', visitors: '2,841', avgTime: '2:30', bounce: '45%' } },
  { id: '4', cells: { page: '/pricing', visitors: '1,920', avgTime: '4:08', bounce: '31%' } },
  { id: '5', cells: { page: '/blog', visitors: '1,540', avgTime: '6:22', bounce: '19%' } },
]

interface AnalyticsTemplateProps {
  appName?: string
  title?: string
  subtitle?: string
  periodLabel?: string
  statusLabel?: string
}

function AnalyticsDashboardView({
  appName,
  title = 'Analítica del Sitio',
  subtitle,
  periodLabel = 'Este mes',
  statusLabel = 'En línea',
}: AnalyticsTemplateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: 'var(--ft-color-background)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          {appName && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ft-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {appName}
            </span>
          )}
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--ft-color-foreground)' }}>{title}</h1>
          {subtitle && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>{subtitle}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="primary">{periodLabel}</Badge>
          <Badge variant="success">{statusLabel}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatsCard title="Visitantes totales" value="14,923" change={{ value: 18.4, trend: 'up' }} icon={<UsersIcon className="w-6 h-6" />} variant="primary" />
        <StatsCard title="Sesiones únicas" value="8,741" change={{ value: 12.1, trend: 'up', label: '%' }} icon={<ChartBarIcon className="w-6 h-6" />} variant="info" />
        <StatsCard title="Tasa de rebote" value="31.2%" change={{ value: 4.3, trend: 'down' }} icon={<ArrowTrendingDownIcon className="w-6 h-6" />} variant="success" />
        <StatsCard title="Páginas vistas" value="42,350" change={{ value: 8.7, trend: 'up' }} icon={<EyeIcon className="w-6 h-6" />} variant="warning" />
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
  )
}

const meta = {
  title: '11-Templates/Dashboard Analytics',
  component: AnalyticsDashboardView,
  parameters: {
    docs: {
      description: {
        component: 'Dashboard analítica altamente parametrizable: StatsCards KPI + ChartArea tendencias + ChartPie distribución + tabla top páginas. Se adapta a cualquier cliente o proyecto interno.',
      },
    },
  },
  argTypes: {
    appName: { control: 'text', description: 'Nombre del producto o cliente' },
    title: { control: 'text', description: 'Título del reporte' },
    subtitle: { control: 'text', description: 'Subtítulo o descripción' },
    periodLabel: { control: 'text', description: 'Texto del badge de período' },
    statusLabel: { control: 'text', description: 'Texto del badge de estado' },
  },
} satisfies Meta<typeof AnalyticsDashboardView>

export default meta
type Story = StoryObj<typeof meta>

export const FarutechAnalytics: Story = {
  name: '1. FaruTech Analytics (Por defecto)',
  args: {
    appName: 'FaruTech Platform',
    title: 'Analítica del Sitio Web',
    subtitle: 'Métricas de rendimiento en tiempo real',
    periodLabel: 'Este mes',
    statusLabel: 'En vivo',
  },
}

export const ClientAppAnalytics: Story = {
  name: '2. Cliente — Afilamos Operaciones',
  args: {
    appName: 'Afilamos Operaciones',
    title: 'Métricas de Producción y Despachos',
    subtitle: 'Panel ejecutivo para supervisores y directores de planta',
    periodLabel: 'Q3 2026',
    statusLabel: 'Sincronizado',
  },
}

export const WhiteLabelAnalytics: Story = {
  name: '3. Marca Blanca — Ordeon Logistics',
  args: {
    appName: 'Ordeon Logistics Portal',
    title: 'Dashboard de Indicadores Logísticos',
    subtitle: 'Consolidado multi-almacén sin marcas de proveedor',
    periodLabel: 'Hoy',
    statusLabel: 'Operativo',
  },
}

