import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

/**
 * Card - Contenedor flexible con soporte para cabecera, pie, paddings variables y estilos personalizados.
 */
const meta = {
  title: '3-Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tarjeta multiuso con soporte para estados hover, configuracion de padding y personalizacion completa via className y bodyClassName.',
      },
    },
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Espaciado interno del cuerpo de la tarjeta',
    },
    hover: {
      control: 'boolean',
      description: 'Aplica elevacion y cursor pointer al pasar el mouse',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para el contenedor exterior de la tarjeta',
    },
    bodyClassName: {
      control: 'text',
      description: 'Clases CSS para el cuerpo interior (children)',
    },
    headerClassName: {
      control: 'text',
      description: 'Clases CSS para el encabezado de la tarjeta',
    },
    footerClassName: {
      control: 'text',
      description: 'Clases CSS para el pie de la tarjeta',
    },
  },
  args: {
    padding: 'md',
    hover: true,
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px]">
      <Card
        {...args}
        header={
          <CardHeader
            title="Resumen Financiero"
            subtitle="Corte operativo al dia de hoy"
            action={<Badge variant="success">Activo</Badge>}
          />
        }
        footer={
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Ultima actualizacion: Hace 5m</span>
            <Button size="sm" variant="ghost">Ver detalles</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            Tarjeta configurable desde los controles de Storybook. Modifica <code className="text-violet-400">padding</code>, <code className="text-violet-400">hover</code> y clases de estilo en vivo.
          </p>
          <div className="p-3 bg-slate-800/60 rounded-lg flex justify-between items-center">
            <span className="text-xs text-slate-400">Saldo en Caja</span>
            <span className="text-sm font-bold text-emerald-400">$3,420,000 COP</span>
          </div>
        </div>
      </Card>
    </div>
  ),
}

export const Simple: Story = {
  name: 'Tarjeta Simple sin Header',
  render: (args) => (
    <div className="w-[360px]">
      <Card {...args}>
        <h4 className="text-base font-semibold text-white mb-1">Operacion Rapida</h4>
        <p className="text-xs text-slate-400 mb-3">Acceso directo a la creacion de tickets de afilado.</p>
        <Button variant="primary" size="sm" className="w-full">Comenzar registro</Button>
      </Card>
    </div>
  ),
}

export const EstilosPersonalizados: Story = {
  name: 'Con Clases CSS Personalizadas',
  args: {
    className: 'border-violet-500/50 bg-gradient-to-br from-violet-950/40 to-slate-900 shadow-xl shadow-violet-950/20',
    hover: true,
    padding: 'lg',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Card {...args}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/40 flex items-center justify-center font-bold">
            DS
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Design System 1.1.2</h4>
            <p className="text-xs text-violet-300">Tailwind CSS + Tokens HSL</p>
          </div>
        </div>
      </Card>
    </div>
  ),
}
