import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastContainer } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

/**
 * Toast — notificaciones emergentes (toast notifications).
 *
 * El Toast usa useNotificationStore internamente. Este story demuestra cómo
 * agregar notificaciones de distintos tipos: success, error, warning, info.
 */
function ToastDemo() {
  type Notification = {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    read: boolean
    createdAt: Date
  }

  const [, setNotifications] = useState<Notification[]>([])

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}`
    setNotifications((prev) => [...prev, { id, type, title, message, read: false, createdAt: new Date() }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 4000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '360px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button variant="success" size="sm" onClick={() => addToast('success', '¡Éxito!', 'Operación completada correctamente')}>
          Success
        </Button>
        <Button variant="danger" size="sm" onClick={() => addToast('error', 'Error', 'No se pudo completar la operación')}>
          Error
        </Button>
        <Button variant="warning" size="sm" onClick={() => addToast('warning', 'Advertencia', 'Tu sesión expirará pronto')}>
          Warning
        </Button>
        <Button variant="outline" size="sm" onClick={() => addToast('info', 'Información', 'Los cambios se guardarán automáticamente')}>
          Info
        </Button>
      </div>

      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
        <ToastContainer />
      </div>

      <div style={{ padding: '1rem', background: 'var(--ft-color-surface)', border: '1px solid var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          Los toasts desaparecen automáticamente después de 4 segundos. Haz clic en × para cerrarlos manualmente.
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
