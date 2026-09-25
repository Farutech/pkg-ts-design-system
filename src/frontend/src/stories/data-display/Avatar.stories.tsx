import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '@/components/ui/Avatar'

const meta = {
  title: '5-Data Display/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    shape: { control: 'radio', options: ['circle', 'square', 'rounded'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'away', 'busy'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: { name: 'María García', size: 'md', shape: 'circle' },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar de usuario con imagen, iniciales como fallback, indicador de estado y múltiples tamaños y formas.',
      },
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConIniciales: Story = {
  name: 'Con iniciales',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar name="Ana López" size="xs" />
      <Avatar name="Carlos Ruiz" size="sm" />
      <Avatar name="María García" size="md" />
      <Avatar name="Juan Pérez" size="lg" />
      <Avatar name="Laura Martínez" size="xl" />
      <Avatar name="Roberto Silva" size="2xl" />
    </div>
  ),
}

export const ConEstado: Story = {
  name: 'Con indicador de estado',
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Ana" size="lg" status="online" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Online</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Carlos" size="lg" status="offline" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Offline</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="María" size="lg" status="away" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Ausente</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Juan" size="lg" status="busy" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Ocupado</p>
      </div>
    </div>
  ),
}

export const Formas: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="FT" size="xl" shape="circle" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Circle</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="FT" size="xl" shape="rounded" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Rounded</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="FT" size="xl" shape="square" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--ft-color-muted-foreground)' }}>Square</p>
      </div>
    </div>
  ),
}

export const GrupoDeAvatares: Story = {
  name: 'Grupo de avatares',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {['Ana L', 'Carlos R', 'María G', 'Juan P'].map((name, i) => (
        <div key={name} style={{ marginLeft: i === 0 ? 0 : '-0.75rem', zIndex: 4 - i, position: 'relative' }}>
          <Avatar name={name} size="md" />
        </div>
      ))}
      <div style={{ marginLeft: '-0.75rem', zIndex: 0 }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '50%',
          background: 'var(--ft-color-surface)',
          border: '2px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--ft-color-muted-foreground)',
          boxShadow: '0 0 0 2px white',
        }}>
          +8
        </div>
      </div>
    </div>
  ),
}
