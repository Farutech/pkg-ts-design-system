import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from '@/components/ui/ProgressBar'

const meta = {
  title: '5-Data Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barra de progreso con soporte para porcentajes, estado indeterminado, gradientes, striped y colores semanticos.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Porcentaje de progreso (0-100)',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info'],
      description: 'Color semantico de la barra',
    },
    variant: {
      control: 'select',
      options: ['default', 'striped', 'gradient', 'indeterminate'],
      description: 'Estilo de visualizacion del progreso',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Grosor de la barra',
    },
    showLabel: { control: 'boolean', description: 'Muestra el texto del porcentaje' },
    showSpinner: { control: 'boolean', description: 'Muestra spinner animado' },
    className: { control: 'text', description: 'Clases CSS para el contenedor' },
  },
  args: {
    value: 65,
    color: 'primary',
    variant: 'default',
    size: 'md',
    showLabel: true,
    showSpinner: false,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px] p-6 bg-slate-900/40 rounded-xl border border-slate-800">
      <ProgressBar {...args} />
    </div>
  ),
}

export const Gradiente: Story = {
  name: 'Con Gradiente y Animacion',
  args: {
    value: 85,
    variant: 'gradient',
    color: 'success',
    size: 'lg',
    showLabel: true,
  },
  render: (args) => (
    <div className="w-[420px] p-6 bg-slate-900/40 rounded-xl border border-slate-800">
      <ProgressBar {...args} />
    </div>
  ),
}

export const Indeterminado: Story = {
  name: 'Modo Indeterminado (Cargando)',
  args: {
    variant: 'indeterminate',
    loadingMessage: 'Procesando archivo de corte...',
    showSpinner: true,
    showLabel: true,
  },
  render: (args) => (
    <div className="w-[420px] p-6 bg-slate-900/40 rounded-xl border border-slate-800">
      <ProgressBar {...args} />
    </div>
  ),
}
