import type { Meta, StoryObj } from '@storybook/react-vite'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'

/**
 * useToast — demo interactivo del hook de notificaciones.
 *
 * Muestra cómo agregar, remover, limpiar y actualizar toasts
 * usando el hook useToast y el store useToastStore.
 */
function UseToastDemo() {
  const { toasts, addToast, removeToast, clearToasts } = useToast()

  const addRandomToast = () => {
    const types: Array<'success' | 'error' | 'warning' | 'info' | 'loading'> = ['success', 'error', 'warning', 'info', 'loading']
    const messages = [
      'Archivo guardado correctamente',
      'Error de conexión, intente nuevamente',
      'Su sesión expirará en 5 minutos',
      'Nueva actualización disponible',
      'Procesando datos...',
    ]
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    addToast({ type: randomType, title: 'Notificación', message: randomMsg })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '440px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button variant="primary" size="sm" onClick={() => addRandomToast()}>
          + Nueva notificación aleatoria
        </Button>
        <Button variant="outline" size="sm" onClick={() => clearToasts()}>
          Limpiar todas
        </Button>
      </div>

      <div style={{ padding: '1rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>
          Toasts activos: <span style={{ color: 'var(--ft-color-primary)', fontFamily: 'monospace' }}>{toasts.length}</span>
        </p>
        {toasts.length === 0 && (
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)', fontStyle: 'italic' }}>
            No hay notificaciones activas
          </p>
        )}
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: 'var(--ft-color-background)',
              border: '1px solid var(--ft-color-border)',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              marginBottom: '0.25rem',
            }}
          >
            <span style={{ fontWeight: 600, textTransform: 'capitalize', minWidth: '60px' }}>{toast.type}</span>
            <span style={{ color: 'var(--ft-color-muted-foreground)', flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem', background: 'var(--ft-color-background)', border: '1px dashed var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          💡 Usa el hook <code>useToast()</code> en tus componentes para agregar notificaciones. El ToastContainer se renderiza una vez en tu app root.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '9-Hooks & Stores/useToast',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Demostración interactiva del hook useToast. Agrega, remueve y limpia notificaciones en tiempo real.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Interactivo: Story = {
  render: () => <UseToastDemo />,
}
