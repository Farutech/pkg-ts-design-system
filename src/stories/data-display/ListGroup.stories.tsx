import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListGroup } from '@/components/ui/ListGroup'
import { HomeIcon, UserGroupIcon, CogIcon, BellIcon, DocumentTextIcon, EnvelopeIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

/**
 * ListGroup — lista de elementos con iconos, badges y estado activo.
 *
 * Soporta variantes: default (con bordes redondeados), flush (sin bordes)
 * y bordered (con borde exterior). Cada item puede tener ícono, contenido,
 * badge y estado activo.
 */
const NAV_ITEMS = [
  { id: 'home', content: 'Inicio', icon: HomeIcon, active: true },
  { id: 'dashboard', content: 'Dashboard', icon: CogIcon },
  { id: 'users', content: 'Usuarios', icon: UserGroupIcon, badge: 3 },
  { id: 'notifications', content: 'Notificaciones', icon: BellIcon, badge: 8 },
  { id: 'documents', content: 'Documentos', icon: DocumentTextIcon },
  { id: 'inbox', content: 'Band de entrada', icon: EnvelopeIcon, badge: 12 },
  { id: 'history', content: 'Historial', icon: ClockIcon },
  { id: 'settings', content: 'Configuración', icon: CogIcon, active: false },
]

const meta = {
  title: '5-Data Display/ListGroup',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lista con iconos, badges y estado activo. 3 variantes: default, flush y bordered.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ListaDeNavegacion: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <ListGroup items={NAV_ITEMS} variant="default" />
    </div>
  ),
}

export const Flush: Story = {
  name: 'Variante flush (sin bordes)',
  render: () => (
    <div style={{ width: '280px' }}>
      <ListGroup items={NAV_ITEMS.slice(0, 4)} variant="flush" />
    </div>
  ),
}

export const Bordered: Story = {
  name: 'Variante bordered (con borde exterior)',
  render: () => (
    <div style={{ width: '280px' }}>
      <ListGroup items={NAV_ITEMS.slice(0, 5)} variant="bordered" />
    </div>
  ),
}

export const ConBadges: Story = {
  name: 'Con badges de conteo',
  render: () => (
    <div style={{ width: '280px' }}>
      <ListGroup items={NAV_ITEMS.filter(i => i.badge !== undefined)} variant="default" />
    </div>
  ),
}
