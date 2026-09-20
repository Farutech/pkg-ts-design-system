import type { Meta, StoryObj } from '@storybook/react-vite'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

/**
 * MainLayout — Layout completo de aplicación con Sidebar + Navbar + contenido.
 *
 * Este story usa `layout: 'fullscreen'` porque el layout necesita ocupar
 * toda la ventana para demostrar correctamente el sidebar y el navbar.
 */
function LayoutContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm">Exportar</Button>
          <Button size="sm">Nuevo registro</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatsCard
          title="Usuarios activos"
          value="1,234"
          change={{ value: 12, trend: 'up' }}
          icon="users"
        />
        <StatsCard
          title="Ingresos del mes"
          value="$45,670"
          change={{ value: 8, trend: 'up' }}
          icon="currency"
        />
        <StatsCard
          title="Órdenes pendientes"
          value="23"
          change={{ value: 3, trend: 'down' }}
          icon="shopping-cart"
        />
        <StatsCard
          title="Tasa de conversión"
          value="3.2%"
          change={{ value: 0.5, trend: 'up' }}
          icon="chart"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge variant="success">En línea</Badge>
        <Badge variant="warning">Pendiente</Badge>
        <Badge variant="danger">Crítico</Badge>
        <Avatar name="Ana García" size="sm" status="online" />
        <Avatar name="Carlos López" size="sm" status="away" />
        <Avatar name="María Torres" size="sm" />
      </div>

      <div style={{ padding: '1.5rem', border: '1px dashed var(--ft-color-border)', borderRadius: '0.5rem', background: 'var(--ft-color-surface)' }}>
        <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
          Contenido de la página — el sidebar y navbar se renderizan automáticamente por <code>MainLayout</code>.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '2-Layout/MainLayout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Layout completo de aplicación: Sidebar lateral + Navbar superior + área de contenido principal. El sidebar se colapsa automáticamente en móvil.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AplicacionCompleta: Story = {
  render: () => <MainLayout><LayoutContent /></MainLayout>,
}
