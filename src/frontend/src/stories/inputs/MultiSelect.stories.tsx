import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MultiSelect } from '@/components/ui/MultiSelect'

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/Inputs/MultiSelect',
  component: MultiSelect,
}
export default meta

export const Default: StoryObj<typeof MultiSelect> = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['afilado', 'balanceo'])
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <MultiSelect
          label="Servicios Requeridos"
          value={selected}
          onChange={setSelected}
          options={[
            { value: 'afilado', label: 'Afilado de Precisión' },
            { value: 'rectificado', label: 'Rectificado Cilíndrico' },
            { value: 'balanceo', label: 'Balanceo Dinámico' },
            { value: 'recubrimiento', label: 'Recubrimiento TiN / AlTiN' },
          ]}
        />
      </div>
    )
  },
}
