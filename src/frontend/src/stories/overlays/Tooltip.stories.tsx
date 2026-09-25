import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from '@/components/ui/Tooltip'
import { Button } from '@/components/ui/Button'

/**
 * Tooltip — Mensajes contextuales que aparecen al hover o focus.
 *
 * Soporta 4 posiciones (top, bottom, left, right), delays editables,
 * y tipos: info, danger, warning, success.
 */
const meta = {
  title: '7-Overlays/Tooltip',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip contextual con 4 posiciones, tipos semánticos y delay configurable. Aparece al hover o focus del elemento trigger.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Posiciones: Story = {
  name: '4 posiciones',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
          <div key={pos} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Tooltip content={`Tooltip ${pos}`} position={pos}>
              <Button variant="outline">Hover aquí</Button>
            </Tooltip>
            <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)', textTransform: 'capitalize' }}>
              {pos}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const TiposSemanticos: Story = {
  name: 'Tipos semánticos',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
      {(['default', 'error', 'warning', 'success', 'info'] as const).map((type) => (
        <Tooltip key={type} content={`${type}`} type={type} showIcon>
          <Button variant="outline">{type}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const ConDelay: Story = {
  name: 'Con delay personalizado',
  parameters: {
    docs: {
      description: {
        story: 'El delay por defecto es 200ms. Puedes ajustarlo para tooltips que necesitan más o menos tiempo.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Tooltip content="Aparece rápido (50ms)" delay={50}>
        <Button variant="outline">Rápido</Button>
      </Tooltip>
      <Tooltip content="Aparece normal (200ms)" delay={200}>
        <Button variant="outline">Normal</Button>
      </Tooltip>
      <Tooltip content="Aparece lento (500ms)" delay={500}>
        <Button variant="outline">Lento</Button>
      </Tooltip>
    </div>
  ),
}
