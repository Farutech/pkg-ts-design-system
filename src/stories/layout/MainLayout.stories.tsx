import type { Meta, StoryObj } from '@storybook/react-vite'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

/**
 * MainLayout — Layout completo de aplicación con Sidebar + Navbar + contenido.
 *
 * Altamente dinámico y adaptable a cualquier app:
 * - Recibe `appName`, `showCreator`, `creatorName`, `creatorUrl`
 * - Recibe datos de `user` para el Navbar
 * - Permite pasar `sidebarProps` y `navbarProps` directos
 */
function LayoutContent({ appName }: { appName?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
            {appName ? `Dashboard de ${appName}` : 'Dashboard'}
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
            Panel unificado de operaciones y control de métricas
          </p>
        </div>
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
          Contenido de la aplicación — el Sidebar y Navbar se configuran automáticamente desde las props de <code>MainLayout</code> o desde <code>DesignSystemProvider</code>.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '2-Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Layout completo de aplicación: Sidebar lateral + Navbar superior + área de contenido. Totalmente configurable para cualquier proyecto interno o de cliente.',
      },
    },
  },
  argTypes: {
    appName: { control: 'text', description: 'Nombre de la aplicación' },
    showCreator: { control: 'boolean', description: 'Mostrar creador en el pie del Sidebar' },
    creatorName: { control: 'text', description: 'Nombre del creador' },
    creatorPrefix: { control: 'text', description: 'Prefijo del creador' },
  },
} satisfies Meta<typeof MainLayout>

export default meta
type Story = StoryObj<typeof meta>

export const FaruTechApp: Story = {
  name: '1. FaruTech (Por defecto con crédito)',
  render: (args) => (
    <MainLayout {...args}>
      <LayoutContent appName={args.appName} />
    </MainLayout>
  ),
  args: {
    appName: 'FaruTech Platform',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorPrefix: 'Desarrollado por',
    user: {
      name: 'Admin FaruTech',
      email: 'admin@farutech.com',
      role: 'Superadmin',
    },
  },
}

export const ClienteAfilamosApp: Story = {
  name: '2. Cliente — Afilamos Operaciones',
  render: (args) => (
    <MainLayout {...args}>
      <LayoutContent appName={args.appName} />
    </MainLayout>
  ),
  args: {
    appName: 'Afilamos Operaciones',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorPrefix: 'Desarrollado por',
    user: {
      name: 'Carlos Díaz',
      email: 'cdiaz@afilamos.com',
      role: 'Gerente de Operaciones',
    },
  },
}

export const WhiteLabelApp: Story = {
  name: '3. Marca Blanca — Ordeon Logistics',
  render: (args) => (
    <MainLayout {...args}>
      <LayoutContent appName={args.appName} />
    </MainLayout>
  ),
  args: {
    appName: 'Ordeon Logistics Portal',
    showCreator: false,
    user: {
      name: 'Valeria Rivas',
      email: 'vrivas@ordeon.io',
      role: 'Logistics Director',
    },
  },
}

