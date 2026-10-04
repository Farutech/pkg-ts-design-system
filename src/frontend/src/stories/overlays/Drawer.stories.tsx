import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer, type DrawerProps } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'

const meta = {
  title: '7-Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel lateral deslizable (offcanvas) con backdrop blur y soporte para posiciones (left, right, top, bottom) y tamanos (sm, md, lg, xl, full).',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Estado de visibilidad del panel',
    },
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Lado desde el cual se desliza el panel',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Ancho o alto del panel segun su orientacion',
    },
    title: {
      control: 'text',
      description: 'Titulo en la cabecera del drawer',
    },
    hideCloseButton: {
      control: 'boolean',
      description: 'Oculta el boton de cerrar (X)',
    },
    className: {
      control: 'text',
      description: 'Clases CSS personalizadas para el panel',
    },
    bodyClassName: {
      control: 'text',
      description: 'Clases CSS para el cuerpo (children)',
    },
    onClose: { action: 'closed' },
  },
  args: {
    isOpen: true,
    position: 'right',
    size: 'md',
    title: 'Editar datos del cliente',
    hideCloseButton: false,
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args: any) => (
    <Drawer isOpen={args.isOpen ?? true} onClose={args.onClose ?? (() => {})} {...args}
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={args.onClose}>Cancelar</Button>
          <Button variant="primary" onClick={args.onClose}>Guardar cambios</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300">
        <p className="text-sm text-slate-400">
          Edita los parametros desde la tabla de <strong>Controls</strong> en Storybook para cambiar la posicion y dimensiones del Drawer en vivo.
        </p>
        <Input label="Nombre de la empresa" defaultValue="Afilamos S.A.S." />
        <Input label="NIT / Documento" defaultValue="901.442.119-4" />
        <Input label="Correo de facturacion" defaultValue="facturacion@afilamos.com" />
      </div>
    </Drawer>
  ),
}

function InteractiveDrawerDemo({ position = 'right', size = 'md', title = 'Panel lateral' }: Partial<DrawerProps>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Abrir Drawer ({position})</Button>
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        position={position}
        size={size}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Guardar</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 py-2 text-slate-300">
          <Input label="Nombre" placeholder="Ingresa el nombre" />
          <Input label="Correo" type="email" placeholder="correo@empresa.com" />
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs">
            Posicion: <strong>{position}</strong> | Tamano: <strong>{size}</strong>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export const Derecha: Story = {
  name: 'Desde la derecha',
  render: () => <InteractiveDrawerDemo position="right" title="Editar usuario" />,
}

export const Izquierda: Story = {
  name: 'Desde la izquierda (Filtros)',
  render: () => <InteractiveDrawerDemo position="left" title="Filtros avanzados de busqueda" />,
}

export const Grande: Story = {
  name: 'Tamano grande (lg)',
  render: () => <InteractiveDrawerDemo position="right" size="lg" title="Detalle completo de solicitud" />,
}
