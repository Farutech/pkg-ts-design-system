import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'

function DrawerDemo({ position = 'right', size = 'md', title = 'Panel lateral' }: {
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'full'
  title?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir Drawer ({position})</Button>
      <Drawer isOpen={open} onClose={() => setOpen(false)} title={title} position={position} size={size}
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Guardar</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Nombre" placeholder="Ingresa el nombre" />
          <Input label="Correo" type="email" placeholder="correo@empresa.com" />
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
            Posición: <strong>{position}</strong> · Tamaño: <strong>{size}</strong>
          </p>
        </div>
      </Drawer>
    </>
  )
}

const meta = {
  title: '7-Overlays/Drawer',
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Panel lateral deslizable desde cualquier borde. Ideal para edición en contexto sin perder el estado de la página.' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Derecha: Story = {
  name: 'Desde la derecha (predeterminado)',
  render: () => <DrawerDemo position="right" title="Editar usuario" />,
}

export const Izquierda: Story = {
  name: 'Desde la izquierda',
  render: () => <DrawerDemo position="left" title="Filtros avanzados" />,
}

export const Grande: Story = {
  name: 'Tamaño grande',
  render: () => <DrawerDemo position="right" size="lg" title="Detalle del pedido" />,
}

export const Completo: Story = {
  name: 'Pantalla completa',
  render: () => <DrawerDemo position="right" size="full" title="Editor completo" />,
}
