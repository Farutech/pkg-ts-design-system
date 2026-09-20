import type { Meta, StoryObj } from '@storybook/react-vite'
import { useSidebarStore } from '@/store/sidebarStore'
import { Button } from '@/components/ui/Button'

/**
 * useSidebarStore — demo interactivo del store del sidebar.
 *
 * Muestra el estado actual del sidebar (abierto/colapsado/móvil)
 * y permite controlarlo mediante las acciones del store.
 */
function UseSidebarStoreDemo() {
  const { isOpen, isCollapsed, isMobile, sidebarWidth, toggle, collapse, expand, close, setSidebarWidth, setMobile } = useSidebarStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '400px' }}>
      <div style={{
        padding: '1.25rem',
        background: 'var(--ft-color-surface)',
        border: '1px solid var(--ft-color-border)',
        borderRadius: '0.75rem',
      }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>Estado del sidebar</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'isOpen', value: isOpen },
            { label: 'isCollapsed', value: isCollapsed },
            { label: 'isMobile', value: isMobile },
            { label: 'sidebarWidth', value: `${sidebarWidth}px` },
          ].map((field) => (
            <div key={field.label} style={{ padding: '0.5rem', background: 'var(--ft-color-background)', border: '1px solid var(--ft-color-border)', borderRadius: '0.375rem' }}>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.65rem', color: 'var(--ft-color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--ft-color-foreground)', fontFamily: typeof field.value === 'boolean' ? undefined : 'monospace' }}>
                {String(field.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button variant="outline" size="sm" onClick={toggle}>
          🔄 Toggle (isOpen: {String(isOpen)})
        </Button>
        <Button variant="outline" size="sm" onClick={collapse} disabled={!isOpen}>
          📏 Colapsar
        </Button>
        <Button variant="outline" size="sm" onClick={expand} disabled={!isOpen}>
          📏 Expandir
        </Button>
        <Button variant="outline" size="sm" onClick={close} disabled={!isOpen}>
          ✕ Cerrar
        </Button>
        <Button size="sm" onClick={() => setSidebarWidth(Math.max(200, sidebarWidth - 40))}>
          − Ancho ({sidebarWidth}px)
        </Button>
        <Button size="sm" onClick={() => setSidebarWidth(Math.min(400, sidebarWidth + 40))}>
          + Ancho ({sidebarWidth}px)
        </Button>
        <Button variant="outline" size="sm" onClick={() => setMobile(!isMobile)}>
          📱 Toggle móvil ({String(isMobile)})
        </Button>
      </div>

      <div style={{ padding: '0.75rem', background: 'var(--ft-color-background)', border: '1px dashed var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          💡 El sidebar se marca como móvil automáticamente cuando la ventana es menor a 1024px (lógica en MainLayout).
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '9-Hooks & Stores/useSidebarStore',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Demostración interactiva del store useSidebarStore (zustand). Controles para abrir, cerrar, colapsar y ajustar tamaño del sidebar.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Interactivo: Story = {
  render: () => <UseSidebarStoreDemo />,
}
