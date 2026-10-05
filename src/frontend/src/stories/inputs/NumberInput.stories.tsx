import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberInput } from '@/components/ui/NumberInput'

const meta: Meta<typeof NumberInput> = {
  title: 'Components/Inputs/NumberInput',
  component: NumberInput,
}
export default meta

export const Default: StoryObj<typeof NumberInput> = {
  render: () => {
    const [val, setVal] = useState(10)
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <NumberInput
          label="Cantidad de Cuchillas"
          value={val}
          onChange={(val) => setVal(val ?? 0)}
          min={1}
          max={100}
          step={1}
        />
        <p className="text-xs text-gray-500 font-mono">Valor: {val}</p>
      </div>
    )
  },
}
