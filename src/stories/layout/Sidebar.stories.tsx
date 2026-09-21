import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar } from '@/components/layout/Sidebar'
import type { SidebarProps } from '@/components/layout/Sidebar'

/**
 * Sidebar — Panel lateral de navegación con módulos y categorías multinivel.
 *
 * Altamente dinámico y parametrizable:
 * - Admite `appName` personalizado
 * - Conmutable con o sin atribución de creador (`showCreator`, `creatorName`, `creatorUrl`)
 * - Soporta menús y módulos propios de cualquier aplicación
 */
const meta = {
  title: '2-Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sidebar lateral con navegación multinivel, módulos, badges de notificación, colapsado y personalización de marca para cualquier proyecto interno o cliente.',
      },
    },
  },
  argTypes: {
    appName: { control: 'text', description: 'Nombre de la aplicación a mostrar en la cabecera' },
    showCreator: { control: 'boolean', description: 'Mostrar atribución al creador al pie (false para marca blanca)' },
    creatorName: { control: 'text', description: 'Nombre del creador' },
    creatorPrefix: { control: 'text', description: 'Prefijo del creador' },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

function SidebarStoryContainer(props: SidebarProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', height: '560px', background: 'var(--ft-color-background)', border: '1px solid var(--ft-color-border)', borderRadius: '8px', overflow: 'hidden' }}>
      <Sidebar {...props} />
      <div style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'var(--ft-color-muted-foreground)' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ft-color-foreground)', marginBottom: '0.5rem' }}>
            {props.appName || 'Aplicación'}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Sidebar configurado para: <strong>{props.appName || 'FaruTech'}</strong>
          </p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Atribución creador: {props.showCreator !== false ? `Visible (${props.creatorName || 'FaruTech'})` : 'Oculta (Marca blanca pura)'}
          </p>
        </div>
      </div>
    </div>
  )
}

export const FaruTechDefault: Story = {
  name: '1. FaruTech (Por defecto con crédito)',
  render: (args) => <SidebarStoryContainer {...args} />,
  args: {
    appName: 'FaruTech',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorPrefix: 'Desarrollado por',
  },
}

export const ClientAppAfilamos: Story = {
  name: '2. Cliente — Afilamos Operaciones',
  render: (args) => <SidebarStoryContainer {...args} />,
  args: {
    appName: 'Afilamos Operaciones',
    showCreator: true,
    creatorName: 'FaruTech',
    creatorPrefix: 'Desarrollado por',
  },
}

export const WhiteLabel: Story = {
  name: '3. Marca Blanca — Sin Creador',
  render: (args) => <SidebarStoryContainer {...args} />,
  args: {
    appName: 'Portal Corporativo',
    showCreator: false,
  },
}

