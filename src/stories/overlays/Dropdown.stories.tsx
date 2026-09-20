import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from '@/components/ui/Dropdown'
import { UserIcon, CogIcon, BellIcon, ArrowLeftOnRectangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

/**
 * Dropdown — Menú desplegable con ítems, dividers, badges y acciones async.
 *
 * Usa @headlessui/react Menu internamente. Cada ítem puede tener ícono,
 * danger style, divider y onClick personalizado.
 */
const userMenuItems = [
  { value: 'profile', label: 'Mi perfil', icon: UserIcon, onClick: () => alert('Perfil') },
  { value: 'settings', label: 'Configuración', icon: CogIcon, onClick: () => alert('Configuración') },
  { value: 'notifications', label: 'Notificaciones', icon: BellIcon, onClick: () => alert('Notificaciones') },
  { value: 'divider', label: '', divider: true },
  { value: 'logout', label: 'Cerrar sesión', icon: ArrowLeftOnRectangleIcon, onClick: () => alert('Logout'), danger: true },
]

const projectMenuItems = [
  { value: 'project-1', label: 'Proyecto Alpha', icon: UserIcon, onClick: () => {} },
  { value: 'project-2', label: 'Proyecto Beta', icon: UserIcon, onClick: () => {} },
  { value: 'project-3', label: 'Proyecto Gamma', icon: UserIcon, onClick: () => {} },
]

const meta = {
  title: '7-Overlays/Dropdown',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown usando @headlessui/react. Soporta ítems con ícono, dividers, danger style y menús async con loading state.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MenuDeUsuario: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '320px' }}>
        <Dropdown
          label="Usuario"
          items={userMenuItems}
          value={value}
          onChange={setValue}
          variant="default"
          size="md"
        />
        <Dropdown
          label="Proyecto"
          items={projectMenuItems}
          placeholder="Seleccionar proyecto"
          variant="outlined"
          size="md"
        />
        <Dropdown
          label="Acción rápida"
          items={[{ value: 'edit', label: 'Editar', icon: ArrowRightIcon, onClick: () => alert('Editar') }]}
          variant="ghost"
          size="sm"
        />
      </div>
    )
  },
}
