import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, type TooltipType } from '@/components/ui/Tooltip'
import { Button } from '@/components/ui/Button'

const meta: Meta<any> = {
  title: '7-Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip contextual con 4 posiciones, variantes semanticas, soporte para iconos y delay configurable.',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Texto o nodo mostrado dentro del tooltip',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Posicion relativa respecto al elemento activador',
    },
    type: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
      description: 'Variante semantica de color',
    },
    delay: {
      control: 'number',
      description: 'Retardo en milisegundos antes de mostrarse',
    },
    showIcon: {
      control: 'boolean',
      description: 'Muestra un icono acorde a la variante',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para el tooltip',
    },
  },
  args: {
    content: 'Guarda los cambios realizados en el formulario',
    position: 'top',
    type: 'default',
    delay: 150,
    showIcon: true,
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args: any) => (
    <div className="py-12">
      <Tooltip content={args.content || "Informacion relevante"} {...args}>
        <Button variant="primary">Pasa el cursor aqui</Button>
      </Tooltip>
    </div>
  ),
}

export const Posiciones: Story = {
  name: '4 posiciones',
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center py-12">
      {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
        <Tooltip key={pos} content={`Tooltip en posicion ${pos}`} position={pos}>
          <Button variant="outline">Hover ({pos})</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const TiposSemanticos: Story = {
  name: 'Tipos semanticos',
  render: () => (
    <div className="flex flex-wrap gap-4 justify-center py-12">
      {(['default', 'info', 'success', 'warning', 'error'] as const).map((type: TooltipType) => (
        <Tooltip key={type} content={`Mensaje de tipo ${type}`} type={type} showIcon>
          <Button variant="outline" className="capitalize">{type}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
