import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, StatusBadge } from '@/components/ui/Badge'

/**
 * Badge — Etiqueta visual para estados, categorías y contadores.
 * Soporta 8 variantes, 3 tamaños, dot indicator y modo monospace.
 */
const meta = {
  title: '5-Data Display/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'neutral', 'outline', 'primary', 'success', 'danger', 'warning', 'info'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
    mono: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Nuevo', variant: 'primary', size: 'md', dot: false, mono: false },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Etiqueta para estados, categorías, versiones y contadores. `StatusBadge` es un helper con estados predefinidos.',
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const Tamaños: Story = {
  name: 'Tamaños',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const ConDot: Story = {
  name: 'Con punto indicador',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
      <Badge variant="success" dot>Activo</Badge>
      <Badge variant="warning" dot>Pendiente</Badge>
      <Badge variant="danger" dot>Error</Badge>
      <Badge variant="info" dot>Procesando</Badge>
    </div>
  ),
}

export const Mono: Story = {
  name: 'Modo monospace (versiones)',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Badge mono variant="outline">v1.2.0</Badge>
      <Badge mono variant="primary">v2.0.0-beta</Badge>
      <Badge mono variant="success">stable</Badge>
      <Badge mono variant="warning">deprecated</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  name: 'StatusBadge (estados predefinidos)',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
      <StatusBadge status="live" label="En vivo" />
      <StatusBadge status="wip" label="En progreso" />
      <StatusBadge status="dev" label="Desarrollo" />
      <StatusBadge status="error" label="Error" />
    </div>
  ),
}
