import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar } from '@/components/layout/Navbar'

/**
 * Navbar — Barra superior con breadcrumbs, notificaciones y menú de usuario.
 *
 * El Navbar lee la ruta actual de useLocation y los breadcrumbs de un
 * mapeo interno. Este story lo renderiza standalone para demostrar su apariencia.
 */
const meta = {
  title: '2-Layout/Navbar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navbar superior con búsqueda, breadcrumbs contextuales, notificaciones y menú de usuario. Componente clave del layout de aplicación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ConBreadcrumbs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ft-color-background)', padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'var(--ft-color-muted-foreground)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ft-color-foreground)', marginBottom: '0.5rem' }}>
            Página de ejemplo
          </p>
          <p>Los breadcrumbs se actualizan automáticamente según la ruta.</p>
        </div>
      </main>
    </div>
  ),
}
