import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '@/components/ui/Skeleton'

const meta = {
  title: '5-Data Display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Placeholders de carga animados con soporte para anchos, altos, animaciones y clases CSS.' } },
  },
  argTypes: {
    className: { control: 'text', description: 'Clases CSS para dimensiones y estilo del esqueleto' },
  },
  args: {
    className: 'w-64 h-8 rounded-lg',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800">
      <Skeleton {...args} />
    </div>
  ),
}

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
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden' }}> <Skeleton className="w-full h-full" /> </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ width: '60%', maxWidth: '100%', height: 16 }}> <Skeleton className="w-full h-full" /> </div>
            <div style={{ width: '40%', height: 12 }}> <Skeleton className="w-full h-full" /> </div>
          </div>
          <div style={{ width: 60, height: 24 }}> <Skeleton className="w-full h-full" /> </div>
        </div>
      ))}
    </div>
  ),
}
