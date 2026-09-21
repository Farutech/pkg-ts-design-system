import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastContainer, toast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'

/**
 * Toast — notificaciones emergentes (toast notifications).
 *
 * El Toast usa useNotificationStore internamente. Este story demuestra cómo
 * disparar y visualizar notificaciones emergentes de distintos tipos: success, error, warning, info.
 */
function ToastDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '380px' }}>
      <ToastContainer />

      <div>
        <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Disparar notificaciones emergentes (C-18)</h4>
        <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          Haz clic en cualquiera de los botones para ver la notificación animada flotante en la esquina superior derecha:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Button
            variant="success"
            size="sm"
            onClick={() => toast.success('Operación completada exitosamente.', '¡Guardado con éxito!')}
          >
            Toast Success
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => toast.error('No se pudo conectar con el servidor remoto.', 'Error de red')}
          >
            Toast Error
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() => toast.warning('Tu sesión de usuario expirará en 5 minutos.', 'Sesión por expirar')}
          >
            Toast Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Los cambios se sincronizarán en segundo plano.', 'Información')}
          >
            Toast Info
          </Button>
        </div>
      </div>

      <div style={{ padding: '1rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          ✓ Las alertas flotan en la esquina superior derecha con sombra suave y transición.<br />
          ✓ Desaparecen automáticamente tras 5 segundos o al hacer clic en la <strong>×</strong>.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '6-Feedback/Toast',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Notificaciones emergentes tipo toast con 4 variantes (success, error, warning, info). Aparecen en la esquina superior derecha.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const NotificacionesToast: Story = {
  render: () => <ToastDemo />,
}
