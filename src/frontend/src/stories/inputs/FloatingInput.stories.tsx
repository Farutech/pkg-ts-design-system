import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingInput } from '@/components/ui/FloatingInput'
import { useState } from 'react'

const meta = {
  title: '2-Inputs/FloatingInput',
  component: FloatingInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de texto con etiqueta flotante inmediata, elevacion automatica, tooltip informativo en hover y bordes estilizados.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Etiqueta flotante' },
    tooltip: { control: 'text', description: 'Mensaje contextual en tooltip' },
    required: { control: 'boolean', description: 'Marca el campo como obligatorio (*)' },
    disabled: { control: 'boolean', description: 'Deshabilita el input' },
    readOnly: { control: 'boolean', description: 'Modo de solo lectura' },
    error: { control: 'text', description: 'Mensaje de error' },
    className: { control: 'text', description: 'Clases CSS personalizadas' },
  },
  args: {
    label: 'Razon Social / Nombre',
    tooltip: 'Ingrese el nombre legal o comercial registrado ante la DIAN',
    required: true,
    disabled: false,
    readOnly: false,
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args) => {
    return <ControlledFloatingInput {...args} />
  },
}

function ControlledFloatingInput(props: any) {
  const [val, setVal] = useState('')
  return (
    <div className="w-[380px]">
      <FloatingInput
        {...props}
        value={val}
        onValueChange={setVal}
      />
    </div>
  )
}

export const ConValor: Story = {
  name: 'Con Valor Previo',
  render: (args) => (
    <div className="w-[380px]">
      <FloatingInput label="Razon Social / Nombre" {...args} defaultValue="Industrias Metalicas del Valle"
      />
    </div>
  ),
}

export const ConError: Story = {
  name: 'Con Mensaje de Error',
  args: {
    error: 'El campo es requerido para continuar con la facturacion',
  },
  render: (args) => (
    <div className="w-[380px]">
      <FloatingInput label="Razon Social / Nombre" {...args} defaultValue=""
      />
    </div>
  ),
}
