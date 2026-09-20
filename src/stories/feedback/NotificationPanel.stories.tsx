import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationPanel } from '@/components/ui/NotificationPanel'
import { useState } from 'react'

type DemoNotification = {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  read: boolean
  timestamp: Date
  onClick?: () => void
}

/**
 * NotificationPanel — panel de notificaciones con bell button.
 *
 * Usa Popover de @headlessui/react. Soporta filtros (all/unread),
 *marcar como leído, marcar todos como leídos y enlaces.
 */
function NotificationPanelDemo() {
  const [notifications, setNotifications] = useState<DemoNotification[]>([
    { id: '1', type: 'success', title: 'Orden enviada', message: 'Orden #1234 ha sido enviada correctamente', read: false, timestamp: new Date('2024-01-15T10:30:00'), onClick: undefined },
    { id: '2', type: 'warning', title: 'Stock bajo', message: 'El producto "iPhone 15 Pro" tiene stock bajo (3 unidades)', read: false, timestamp: new Date('2024-01-15T09:15:00'), onClick: undefined },
    { id: '3', type: 'info', title: 'Nuevo comentario', message: 'Carlos respondió en el ticket #45', read: false, timestamp: new Date('2024-01-14T16:45:00'), onClick: undefined },
    { id: '4', type: 'error', title: 'Error en exportación', message: 'No se pudo exportar el reporte debido a timeout', read: true, timestamp: new Date('2024-01-14T14:00:00'), onClick: undefined },
    { id: '5', type: 'success', title: 'Usuario creado', message: 'María García fue creada exitosamente', read: true, timestamp: new Date('2024-01-13T11:00:00'), onClick: undefined },
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <NotificationPanel
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
        limit={5}
        showAllLink="/notifications"
      />

      <div style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
        Unread: <span style={{ fontWeight: 600, color: 'var(--ft-color-danger)' }}>{unreadCount}</span>
      </div>
    </div>
  )
}

const meta = {
  title: '6-Feedback/NotificationPanel',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel de notificaciones con bell button. Soporta márkear como leído, filtros todos/leídos y enlaces externos.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PanelDeNotificaciones: Story = {
  render: () => <NotificationPanelDemo />,
}
