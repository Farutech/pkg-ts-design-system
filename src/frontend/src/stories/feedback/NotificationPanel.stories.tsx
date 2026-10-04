import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationPanel } from '@/components/ui/NotificationPanel'
import { useState } from 'react'

const initialNotifications = [
  { id: '1', type: 'success' as const, title: 'Orden enviada', message: 'Orden #1234 ha sido enviada correctamente', read: false, timestamp: new Date() },
  { id: '2', type: 'warning' as const, title: 'Stock bajo', message: 'El producto "Cuchilla Circular 10" tiene stock bajo', read: false, timestamp: new Date() },
  { id: '3', type: 'info' as const, title: 'Nuevo ticket', message: 'Cliente solicito mantenimiento urgente', read: false, timestamp: new Date() },
]

const meta = {
  title: '6-Feedback/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel de notificaciones con campana interactiva, contador de no leidos, filtros y borrado.',
      },
    },
  },
  argTypes: {
    limit: { control: 'number', description: 'Limite de notificaciones mostradas en el panel' },
    showAllLink: { control: 'text', description: 'Enlace a la pagina completa de notificaciones' },
    className: { control: 'text', description: 'Clases CSS para el panel' },
  },
  args: {
    limit: 5,
    showAllLink: '/admin/notificaciones',
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args: any) => {
    return <InteractiveNotificationDemo {...args} />
  },
}

function InteractiveNotificationDemo(props: any) {
  const [items, setItems] = useState(initialNotifications)

  return (
    <div className="flex items-center gap-4 py-20">
      <NotificationPanel
        {...props}
        notifications={items}
        onMarkAsRead={(id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllAsRead={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
        onDelete={(id) => setItems(prev => prev.filter(n => n.id !== id))}
      />
      <span className="text-xs text-slate-400">
        Haz clic en la campana para desplegar el panel interactivo.
      </span>
    </div>
  )
}
