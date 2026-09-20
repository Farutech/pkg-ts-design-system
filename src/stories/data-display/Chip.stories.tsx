import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from '@/components/ui/Chip'
import { fn } from '@storybook/test'

const meta = {
  title: '5-Data Display/Chip',
  component: Chip,
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
  args: { children: 'React', variant: 'default', size: 'md', onDelete: fn() },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Chip/Tag eliminable. El botón de cierre aparece cuando se pasa `onDelete`.' } },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Chip variant="default" onDelete={() => {}}>Default</Chip>
      <Chip variant="primary" onDelete={() => {}}>Primary</Chip>
      <Chip variant="success" onDelete={() => {}}>Success</Chip>
      <Chip variant="warning" onDelete={() => {}}>Warning</Chip>
      <Chip variant="danger" onDelete={() => {}}>Danger</Chip>
      <Chip variant="info" onDelete={() => {}}>Info</Chip>
    </div>
  ),
}

export const SinEliminar: Story = {
  name: 'Sin botón eliminar',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Chip variant="primary">TypeScript</Chip>
      <Chip variant="success">React</Chip>
      <Chip variant="info">Tailwind</Chip>
      <Chip variant="warning">Storybook</Chip>
    </div>
  ),
}

export const FiltrosActivos: Story = {
  name: 'Filtros activos',
  render: () => {
    const filters = ['Región: Norte', 'Estado: Activo', 'Tipo: Premium', 'Fecha: Este mes']
    return (
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)', marginBottom: '0.75rem' }}>Filtros aplicados:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filters.map((f) => (
            <Chip key={f} variant="primary" onDelete={() => alert(`Eliminar: ${f}`)}>
              {f}
            </Chip>
          ))}
        </div>
      </div>
    )
  },
}
