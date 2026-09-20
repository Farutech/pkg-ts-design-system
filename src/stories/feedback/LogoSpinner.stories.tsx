import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogoSpinner } from '@/components/ui/LogoSpinner'
import { Spinner } from '@/components/ui/Spinner'

/**
 * LogoSpinner — animaciones de logo de carga.
 *
 * 3 variantes: spin (rotación 2D), flipHorizontal (giro lateral),
 * y flip (3D vertical coin flip). Incluye opción de invertir colores.
 */
const meta = {
  title: '6-Feedback/LogoSpinner',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animaciones de logo de carga. 3 variantes: spin, flipHorizontal, flip (3D). Reseptivo a /Logo.png.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Spin: Story = {
  name: 'Spin (rotación 2D)',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <LogoSpinner variant="spin" size="sm" />
      <LogoSpinner variant="spin" size="md" />
      <LogoSpinner variant="spin" size="lg" />
      <LogoSpinner variant="spin" size="xl" />
    </div>
  ),
}

export const FlipHorizontal: Story = {
  name: 'Flip horizontal',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <LogoSpinner variant="flipHorizontal" size="md" />
      <LogoSpinner variant="flipHorizontal" size="lg" />
    </div>
  ),
}

export const Flip3D: Story = {
  name: 'Flip 3D (moneda)',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <LogoSpinner variant="flip" size="md" />
      <LogoSpinner variant="flip" size="lg" invertColors />
    </div>
  ),
}

export const ConSpinner: Story = {
  name: 'Spinner básico (alternativa)',
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Spinner size="sm" variant="circle" />
      <Spinner size="md" variant="circle" />
      <Spinner size="lg" variant="circle" />
      <Spinner size="xl" variant="circle" />
      <Spinner size="xl" variant="circle" />
    </div>
  ),
}
