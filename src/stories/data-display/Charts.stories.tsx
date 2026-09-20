import type { Meta, StoryObj } from '@storybook/react-vite'
import { Charts, ChartLine, ChartBar, ChartArea, ChartPie, ChartRadar } from '@/components/ui/Charts'

/**
 * Charts — galería completa de gráficos del Design System.
 *
 * Todos los componentes son wrappers de Recharts con estilos consistentes,
 * soporte de dark mode y colores derivados del token del sistema.
 */
const LINE_DATA = [
  { month: 'Ene', revenue: 4200, users: 180 },
  { month: 'Feb', revenue: 5100, users: 220 },
  { month: 'Mar', revenue: 4800, users: 200 },
  { month: 'Abr', revenue: 6200, users: 280 },
  { month: 'May', revenue: 5800, users: 260 },
  { month: 'Jun', revenue: 7400, users: 320 },
  { month: 'Jul', revenue: 6900, users: 300 },
]

const BAR_DATA = [
  { product: 'Laptops', sales: 240, profit: 96 },
  { product: 'Smartphones', sales: 480, profit: 144 },
  { product: 'Tablets', sales: 120, profit: 36 },
  { product: 'Wearables', sales: 180, profit: 54 },
  { product: 'Audio', sales: 320, profit: 80 },
]

const AREA_DATA = [
  { day: 'Lun', visits: 120, sessions: 85 },
  { day: 'Mar', visits: 200, sessions: 145 },
  { day: 'Mié', visits: 180, sessions: 130 },
  { day: 'Jue', visits: 240, sessions: 175 },
  { day: 'Vie', visits: 310, sessions: 220 },
  { day: 'Sáb', visits: 190, sessions: 150 },
  { day: 'Dom', visits: 110, sessions: 80 },
]

const PIE_DATA = [
  { name: 'Navegador', value: 42 },
  { name: 'Redes sociales', value: 28 },
  { name: 'Email', value: 15 },
  { name: 'Directo', value: 10 },
  { name: 'Otros', value: 5 },
]

const RADAR_DATA = [
  { skill: 'React', score: 85 },
  { skill: 'TypeScript', score: 90 },
  { skill: 'Node.js', score: 72 },
  { skill: 'Bases de datos', score: 68 },
  { skill: 'DevOps', score: 55 },
  { skill: 'Testing', score: 78 },
]

const meta = {
  title: '5-Data Display/Charts',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Gráficos unificados con Recharts: Line, Bar, Area, Pie y Radar. Todos usan los tokens de color del Design System.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ChartLine: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Evolución de ingresos</h3>
      <ChartLine data={LINE_DATA} xAxisKey="month" dataKey="revenue" height={260} />
    </div>
  ),
}

export const ChartBar: Story = {
  name: 'Gráfico de barras',
  render: () => (
    <div style={{ width: '600px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Ventas por producto</h3>
      <ChartBar data={BAR_DATA} xAxisKey="product" dataKey="sales" height={260} />
    </div>
  ),
}

export const ChartArea: Story = {
  name: 'Gráfico de área',
  render: () => (
    <div style={{ width: '600px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Visitas diarias (stacked)</h3>
      <ChartArea data={AREA_DATA} xAxisKey="day" dataKey="visits" height={260} stacked />
    </div>
  ),
}

export const ChartPie: Story = {
  name: 'Gráfico circular (donut)',
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Fuente de tráfico</h3>
      <ChartPie data={PIE_DATA} nameKey="name" dataKey="value" height={280} donut />
    </div>
  ),
}

export const ChartRadar: Story = {
  name: 'Gráfico de radar',
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Habilidades del equipo</h3>
      <ChartRadar data={RADAR_DATA} angleKey="skill" dataKey="score" height={300} />
    </div>
  ),
}

export const TodosLosGraficos: Story = {
  name: 'Galería completa',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '600px' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Ingresos mensuales</h3>
        <ChartLine data={LINE_DATA} xAxisKey="month" dataKey="revenue" height={220} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Ventas por producto</h3>
        <ChartBar data={BAR_DATA} xAxisKey="product" dataKey="sales" height={220} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Fuente de tráfico</h3>
        <ChartPie data={PIE_DATA} nameKey="name" dataKey="value" height={240} donut />
      </div>
    </div>
  ),
}
