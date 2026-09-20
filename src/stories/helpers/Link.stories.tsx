import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link as FTLink } from '@/components/ui/Link'
import { ArrowTopRightOnSquareIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

/**
 * Link — enlace de texto con variantes, underline y navegación interna/externa.
 *
 * Si está definido el LinkComponent del provider, usa navegación interna.
 * Para enlaces externos, añade `external` o usa href con http(s).
 */
const meta = {
  title: '10-Helpers/Link',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enlace de texto con 4 variantes (default, subtle, brand, muted) y 4 estilos de underline.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Default</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <FTLink href="/dashboard">Ir al dashboard</FTLink>
          <FTLink href="/settings">Configuración</FTLink>
          <FTLink href="/docs">Documentación</FTLink>
          <FTLink href="/help">Centro de ayuda</FTLink>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Con ícono</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <FTLink href="/docs" external>
            Docs externos <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          </FTLink>
          <FTLink href="/next">Ir a siguiente página <ArrowRightIcon className="h-3 w-3" /></FTLink>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Underline variants</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <FTLink href="/docs" underline="hover">underline: hover (default)</FTLink>
          <FTLink href="/docs" underline="always">underline: always</FTLink>
          <FTLink href="/docs" underline="none">underline: none</FTLink>
        </div>
      </div>
    </div>
  ),
}

export const EnlacesExternos: Story = {
  name: 'Enlaces externos (nueva pestaña)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
      <FTLink href="https://tailwindcss.com" external>Tailwind CSS</FTLink>
      <FTLink href="https://react.dev" external>React Documentation</FTLink>
      <FTLink href="https://storybook.js.org" external>Storybook</FTLink>
    </div>
  ),
}
