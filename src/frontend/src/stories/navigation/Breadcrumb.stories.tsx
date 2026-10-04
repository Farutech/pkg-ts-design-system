import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

const meta = {
  title: '3-Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Breadcrumb de navegacion con iconos y soporte responsive.',
      },
    },
  },
  argTypes: {
    showHome: { control: 'boolean', description: 'Muestra icono de inicio' },
    separator: { control: 'text', description: 'Separador visual entre rutas' },
    className: { control: 'text', description: 'Clases CSS para el contenedor' },
  },
  args: {
    items: [
      { label: 'Administracion', href: '/admin' },
      { label: 'Operaciones', href: '/admin/operaciones' },
      { label: 'Detalle de Solicitud', href: '/admin/operaciones/123' },
    ],
    showHome: true,
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Profundo: Story = {
  name: 'Ruta profunda (4 niveles)',
  args: {
    items: [
      { label: 'CRM', href: '/crm' },
      { label: 'Clientes', href: '/crm/clientes' },
      { label: 'Garcia & Asociados', href: '/crm/clientes/123' },
      { label: 'Historial de compras', href: '/crm/clientes/123/compras' },
    ],
    showHome: true,
  },
}
