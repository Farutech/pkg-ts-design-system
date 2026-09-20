import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar } from '@/components/layout/Sidebar'

/**
 * Sidebar — Panel lateral de navegación con módulos y categorías multinivel.
 *
 * Nota: El componente Sidebar lee su configuración de las stores y contextos
 * del Design System (useSidebarStore, useModuleStore, useMenu). Este story
 * renderiza el componente standalone para demostrar su apariencia.
 */
const meta = {
  title: '2-Layout/Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sidebar lateral con navegación multinivel, módulos, badges de notificación y colapsado. Se integra con useSidebarStore y useModuleStore.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Standalone: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--ft-color-background)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--ft-color-muted-foreground)', padding: '2rem' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ft-color-foreground)', marginBottom: '0.5rem' }}>
            Sidebar + contenido
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            El sidebar se conecta a useSidebarStore, useModuleStore y useMenu.
          </p>
        </div>
      </div>
    </div>
  ),
}
