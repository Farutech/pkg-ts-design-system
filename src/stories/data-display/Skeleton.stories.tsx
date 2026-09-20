import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '@/components/ui/Skeleton'

const meta = {
  title: '5-Data Display/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Placeholders de carga animados. Usa variantes: `text`, `circle`, `rectangle`, `card`.' } },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const ListaDeUsuarios: Story = {
  name: 'Lista de usuarios (skeleton)',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem', borderRadius: '0.75rem',
          background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)',
        }}>
          <Skeleton variant="circle" width={44} height={44} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
          <Skeleton variant="rectangle" width={60} height={24} />
        </div>
      ))}
    </div>
  ),
}

export const DashboardSkeleton: Story = {
  name: 'Dashboard (skeleton)',
  render: () => (
    <div style={{ width: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>
            <Skeleton variant="text" width="50%" height={12} />
            <Skeleton variant="text" width="70%" height={28} style={{ marginTop: '0.75rem' }} />
            <Skeleton variant="text" width="40%" height={12} style={{ marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>
      <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)' }}>
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="rectangle" width="100%" height={200} style={{ marginTop: '1rem' }} />
      </div>
    </div>
  ),
}
