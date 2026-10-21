import React, { useState } from 'react'
import type { Meta } from '@storybook/react-vite'
import { UserPicker, type UserEntity } from '@/components/ui/UserPicker'

const mockUsers: UserEntity[] = [
  { id: '1', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@afilamos.com', role: 'Operario Especialista', department: 'Taller de Afilado' },
  { id: '2', name: 'Diana Morales', email: 'diana.morales@afilamos.com', role: 'Supervisora de Calidad', department: 'Control Calidad' },
  { id: '3', name: 'Andrés Felipe Gómez', email: 'andres.gomez@afilamos.com', role: 'Jefe de Planta', department: 'Operaciones' },
]

const meta: Meta = {
  title: '4-Inputs/UserPicker',
  component: UserPicker,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Etiqueta del campo' },
    placeholder: { control: 'text', description: 'Texto de sugerencia' },
    disabled: { control: 'boolean', description: 'Estado deshabilitado' },
    error: { control: 'text', description: 'Mensaje de error de validación' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector de usuario con avatar, rol y departamento. Búsqueda async y selección de entidad.',
      },
    },
  },
}
export default meta

export const Default = {
  args: {
    label: 'Operario Asignado',
    placeholder: 'Buscar operario...',
  },
  render: (args: any) => {
    const [selected, setSelected] = useState<UserEntity | null>(null)
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <UserPicker
          {...args}
          value={selected}
          onValueChange={setSelected}
          onSearch={(query) => {
            const q = query.toLowerCase()
            return mockUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
          }}
        />
        {selected && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            Asignado a: {selected.name} ({selected.role})
          </p>
        )}
      </div>
    )
  },
}
