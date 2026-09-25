import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '@/components/ui/Tabs'
import {
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

/**
 * Tabs — Navegación por pestañas con tres variantes visuales.
 */

const TABS_CONTENT = [
  {
    id: 'perfil',
    label: 'Perfil',
    icon: UserIcon,
    content: (
      <div style={{ padding: '1.5rem', color: 'var(--ft-color-foreground)' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>Información personal</h3>
        <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
          Aquí va el contenido del perfil del usuario: nombre, correo, teléfono, dirección, etc.
        </p>
      </div>
    ),
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: ShieldCheckIcon,
    content: (
      <div style={{ padding: '1.5rem', color: 'var(--ft-color-foreground)' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>Contraseña y autenticación</h3>
        <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
          Cambio de contraseña, autenticación de dos factores, sesiones activas.
        </p>
      </div>
    ),
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: BellIcon,
    content: (
      <div style={{ padding: '1.5rem', color: 'var(--ft-color-foreground)' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>Preferencias de notificación</h3>
        <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
          Correo electrónico, push notifications, SMS y resúmenes diarios.
        </p>
      </div>
    ),
  },
  {
    id: 'facturacion',
    label: 'Facturación',
    icon: CreditCardIcon,
    content: (
      <div style={{ padding: '1.5rem', color: 'var(--ft-color-foreground)' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>Plan y método de pago</h3>
        <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
          Información de suscripción, historial de pagos y cambio de plan.
        </p>
      </div>
    ),
  },
]

const meta = {
  title: '3-Navigation/Tabs',
  component: Tabs,
  argTypes: {
    variant: { control: 'radio', options: ['line', 'pills', 'enclosed'] },
  },
  args: {
    tabs: TABS_CONTENT,
    variant: 'line',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Navegación por pestañas con 3 variantes: `line` (subrayado), `pills` (cápsulas) y `enclosed` (recuadro).',
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {
  name: 'Variante Line (predeterminada)',
  args: { variant: 'line' },
}

export const Pills: Story = {
  name: 'Variante Pills',
  args: { variant: 'pills' },
}

export const Enclosed: Story = {
  name: 'Variante Enclosed',
  args: { variant: 'enclosed' },
}

export const ConIconos: Story = {
  name: 'Con íconos',
  args: { variant: 'line', tabs: TABS_CONTENT },
}
