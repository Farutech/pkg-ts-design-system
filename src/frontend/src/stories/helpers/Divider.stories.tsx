import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider, SectionHeader as SectionHeaderComponent } from '@/components/ui/Divider'
import { Button } from '@/components/ui/Button'

/**
 * Divider — separador horizontal o vertical con o sin label.
 *
 * Soporta 3 variantes de línea (solid, dashed, dotted), 3 niveles de
 * espaciado (sm, md, lg) y label opcional centrado.
 */
const meta = {
  title: '10-Helpers/Divider',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Separador horizontal o vertical con 3 variantes de línea y label opcional centrado.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Divider />
      <Divider variant="dashed" spacing="lg" />
      <Divider variant="dotted" spacing="lg" />
      <Divider label="Continuar con..." orientation="horizontal" spacing="lg" />
      <Divider label="Sección 2" orientation="horizontal" variant="dashed" spacing="lg" />
    </div>
  ),
}

export const Vertical: Story = {
  name: 'Vertical (inline)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--ft-color-surface)', borderRadius: '0.5rem' }}>
      <Button variant="outline">Opción A</Button>
      <Divider orientation="vertical" />
      <Button variant="outline">Opción B</Button>
      <Divider orientation="vertical" />
      <Button variant="outline">Opción C</Button>
    </div>
  ),
}

export const SectionHeader: Story = {
  name: 'SectionHeader (utility)',
  render: () => (
    <div style={{ width: '400px' }}>
      <SectionHeaderComponent title="Configuración de cuenta" subtitle="Administra tu perfil y preferencias" />
      <Divider />
      <SectionHeaderComponent title="Preferencias de notificaciones" subtitle="Elige qué notificaciones recibir" />
    </div>
  ),
}
