import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlobalLoading } from '@/components/ui/GlobalLoading'

/**
 * GlobalLoading — pantalla de carga completa que cubre toda la aplicación.
 *
 * 4 variantes de animación (random, spin, flipHorizontal, flip) y
 * tamaño configurable. Incluye mensaje opcional.
 */
const meta = {
  title: '6-Feedback/GlobalLoading',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pantalla de carga completa para la aplicación. 4 variantes de animación, tamaño configurable y mensaje opcional.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LoadingCompleto: Story = {
  render: () => (
    <GlobalLoading variant="random" size="xl" message="Cargando aplicación..." />
  ),
}

export const SpinVariant: Story = {
  name: 'Spin (rotación)',
  render: () => <GlobalLoading variant="spin" size="xl" message="Iniciando sesión..." />,
}

export const SinMensaje: Story = {
  name: 'Sin mensaje',
  render: () => <GlobalLoading variant="random" size="lg" />,
}
