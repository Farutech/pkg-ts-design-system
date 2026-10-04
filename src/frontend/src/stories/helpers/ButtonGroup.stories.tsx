import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { Button } from '@/components/ui/Button'

const meta = {
  title: '10-Helpers/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Agrupa botones con bordes compartidos, orientacion horizontal o vertical y variantes visuales.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Disposicion de los botones agrupados',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined'],
      description: 'Variante de contorno',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamano del grupo',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para el contenedor',
    },
  },
  args: {
    orientation: 'horizontal',
    variant: 'outlined',
    size: 'md',
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args}>
        <Button variant="ghost">Dia</Button>
        <Button variant="ghost">Semana</Button>
        <Button variant="ghost">Mes</Button>
        <Button variant="ghost">Ano</Button>
      </ButtonGroup>
    </div>
  ),
}

export const Vertical: Story = {
  name: 'Orientacion Vertical',
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args}>
        <Button variant="outline">Copiar</Button>
        <Button variant="outline">Duplicar</Button>
        <Button variant="danger">Eliminar</Button>
      </ButtonGroup>
    </div>
  ),
}
