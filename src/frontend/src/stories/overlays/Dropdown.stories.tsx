import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from '@/components/ui/Dropdown'
import { UserIcon, CogIcon, BellIcon, ArrowLeftOnRectangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const userMenuItems = [
  { value: 'profile', label: 'Mi perfil', icon: UserIcon, onClick: () => alert('Perfil') },
  { value: 'settings', label: 'Configuracion', icon: CogIcon, onClick: () => alert('Configuracion') },
  { value: 'notifications', label: 'Notificaciones', icon: BellIcon, onClick: () => alert('Notificaciones') },
  { value: 'divider', label: '', divider: true },
  { value: 'logout', label: 'Cerrar sesion', icon: ArrowLeftOnRectangleIcon, onClick: () => alert('Logout'), danger: true },
]

const meta = {
  title: '7-Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Menu desplegable con soporte para items con icono, separadores, estados de peligro y estilos personalizables.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Texto del boton trigger' },
    placeholder: { control: 'text', description: 'Texto cuando no hay seleccion' },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'ghost'],
      description: 'Estilo visual del boton',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamano del dropdown',
    },
    
    className: { control: 'text', description: 'Clases CSS para el contenedor' },
  },
  args: {
    label: 'Opciones de Cuenta',
    variant: 'default',
    size: 'md',
    
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args) => {
    return <ControlledDropdown {...args} />
  },
}

function ControlledDropdown(props: any) {
  const [val, setVal] = useState<string | undefined>()
  return (
    <div className="py-20 w-64">
      <Dropdown
        {...props}
        items={userMenuItems}
        value={val}
        onChange={setVal}
      />
    </div>
  )
}

export const MenuDeUsuario: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 w-64 py-16">
        <Dropdown
          label="Usuario Activo"
          items={userMenuItems}
          variant="default"
          size="md"
        />
        <Dropdown
          label="Accion rapida"
          items={[{ value: 'edit', label: 'Editar registro', icon: ArrowRightIcon, onClick: () => alert('Editar') }]}
          variant="ghost"
          size="sm"
        />
      </div>
    )
  },
}
