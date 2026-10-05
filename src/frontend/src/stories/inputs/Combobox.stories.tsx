import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox } from '@/components/ui/Combobox'

const meta: Meta<typeof Combobox> = {
  title: 'Components/Inputs/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component: 'Campo de texto interactivo con búsqueda y filtrado dinámico en tiempo real.',
      },
    },
  },
}
export default meta

export const Default: StoryObj<typeof Combobox> = {
  render: () => {
    const [selected, setSelected] = useState('')
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <Combobox
          label="Buscar Cliente"
          placeholder="Escribe el nombre o NIT..."
          value={selected}
          onValueChange={setSelected}
          options={[
            { value: '1', label: 'Inversiones Farutech S.A.S. (NIT 900.555.123)' },
            { value: '2', label: 'Afilamos Operaciones Industriales (NIT 890.333.444)' },
            { value: '3', label: 'Aceros & Cuchillas del Norte (NIT 800.111.222)' },
            { value: '4', label: 'Distribuidora Central de Herramientas (NIT 830.999.888)' },
          ]}
        />
        <p className="text-xs text-gray-500 font-mono">Selección: {selected || 'Ninguna'}</p>
      </div>
    )
  },
}

export const FloatingTitle: StoryObj<typeof Combobox> = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <Combobox
        label="Selecciona un proveedor de aceros"
        floatingTitle="PROVEEDOR PRINCIPAL"
        labelMode="floating"
        options={[
          { value: 'bohler', label: 'Böhler Especial Steels Colombia' },
          { value: 'sandvik', label: 'Sandvik Coromant Herramientas' },
          { value: 'uddeholm', label: 'Uddeholm Aceros Grado Herramienta' },
        ]}
      />
    </div>
  ),
}
