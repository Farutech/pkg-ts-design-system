import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordInput } from '@/components/ui/PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Inputs/PasswordInput',
  component: PasswordInput,
}
export default meta

export const Default: StoryObj<typeof PasswordInput> = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <PasswordInput
        label="Contraseña Corporativa"
        placeholder="••••••••••••"
        showToggle={true}
      />
    </div>
  ),
}

export const FloatingTitle: StoryObj<typeof PasswordInput> = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <PasswordInput
        label="Ingresa tu clave de acceso"
        floatingTitle="CLAVE DE ACCESO"
        labelMode="floating"
      />
    </div>
  ),
}
