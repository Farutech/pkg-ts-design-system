import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

/**
 * Breadcrumb — Rastro de navegación con variantes y soporte de home icon.
 */
const meta = {
  title: '3-Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Breadcrumb de navegación. El prop `items` acepta un array de `{ label, href }`. `showHome` muestra el ícono de casa.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    items: [
      { label: 'Ventas', href: '/ventas' },
      { label: 'Órdenes', href: '/ventas/ordenes' },
    ],
    showHome: true,
  },
}

export const Profundo: Story = {
  name: 'Ruta profunda (4 niveles)',
  args: {
    items: [
      { label: 'CRM', href: '/crm' },
      { label: 'Clientes', href: '/crm/clientes' },
      { label: 'García & Asociados', href: '/crm/clientes/123' },
      { label: 'Historial de compras', href: '/crm/clientes/123/compras' },
    ],
    showHome: true,
  },
}

export const SinHome: Story = {
  name: 'Sin ícono de home',
  args: {
    items: [
      { label: 'Configuración', href: '/settings' },
      { label: 'Perfil', href: '/settings/profile' },
    ],
    showHome: false,
  },
}
