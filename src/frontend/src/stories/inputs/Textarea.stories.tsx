import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '@/components/ui/Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
}
export default meta

export const Default: StoryObj<typeof Textarea> = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <Textarea
        label="Observaciones Técnicas"
        placeholder="Escribe las especificaciones o condiciones del servicio..."
        rows={3}
        showCount
        maxLength={200}
      />
    </div>
  ),
}

export const FloatingMode: StoryObj<typeof Textarea> = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <Textarea
        label="Describe detalladamente el requerimiento operativo"
        floatingTitle="DESCRIPCIÓN DEL REQUERIMIENTO"
        labelMode="floating"
        rows={3}
      />
    </div>
  ),
}
