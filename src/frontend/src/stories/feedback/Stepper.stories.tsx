import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from '@/components/ui/Stepper'
const sampleSteps = [
  { label: 'Paso 1', title: 'Datos del cliente', description: 'Nombre, NIT, direccion' },
  { label: 'Paso 2', title: 'Items de entrega', description: 'Servicios de afilado y productos' },
  { label: 'Paso 3', title: 'Programacion', description: 'Fecha y hora de entrega pactada' },
  { label: 'Paso 4', title: 'Facturacion', description: 'Metodo de pago y comprobante' },
]

const meta = {
  title: '6-Feedback/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Indicador de progreso de pasos secuenciales para formularios y wizards con soporte horizontal y vertical.',
      },
    },
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 4, step: 1 },
      description: 'Paso actualmente activo (1-indexado)',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Disposicion de los pasos',
    },
    allowClickAhead: {
      control: 'boolean',
      description: 'Permite hacer clic para avanzar a pasos posteriores',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para el contenedor',
    },
  },
  args: {
    currentStep: 2,
    orientation: 'horizontal',
    allowClickAhead: true,
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args: any) => {
    return (
      <div className="w-[620px] p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
        <Stepper currentStep={args.currentStep ?? 1} steps={sampleSteps} {...args} />
      </div>
    )
  },
}

export const Vertical: Story = {
  name: 'Orientacion vertical',
  args: {
    orientation: 'vertical',
    currentStep: 2,
  },
  render: (args: any) => (
    <div className="w-[360px] p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
      <Stepper currentStep={args.currentStep ?? 1} steps={sampleSteps} {...args} />
    </div>
  ),
}
