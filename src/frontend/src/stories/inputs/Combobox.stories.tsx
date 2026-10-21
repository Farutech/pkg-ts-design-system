import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Combobox } from '@/components/ui/Combobox'
import { useState } from 'react'

const meta: Meta<typeof Combobox> = {
  title: '4-Inputs/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Etiqueta del campo' },
    placeholder: { control: 'text', description: 'Texto de sugerencia' },
    floatingTitle: { control: 'text', description: 'Título para modo floating' },
    labelMode: {
      control: 'select',
      options: ['external', 'floating', 'placeholder', 'hidden'],
      description: 'Modo de visualización de la etiqueta',
    },
    disabled: { control: 'boolean', description: 'Estado deshabilitado' },
    error: { control: 'text', description: 'Mensaje de error' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  args: {
    label: 'Buscar Cliente',
    placeholder: 'Escribe el nombre o NIT...',
    disabled: false,
    error: undefined,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de texto interactivo con búsqueda y filtrado dinámico en tiempo real.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Buscar Cliente',
    placeholder: 'Escribe el nombre o NIT...',
  },
  render: (args) => {
    const [selected, setSelected] = useState('')
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <Combobox
          {...args}
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

export const FloatingTitle: Story = {
  name: 'Título Flotante',
  args: {
    label: 'Selecciona un proveedor de aceros',
    floatingTitle: 'PROVEEDOR PRINCIPAL',
    labelMode: 'floating',
  },
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

/**
 * Test de interacción: selecciona una opción y valida onValueChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Selección e Interacción',
  args: {
    label: 'Buscar Cliente',
    placeholder: 'Escribe el nombre o NIT...',
    onValueChange: fn(),
  },
  render: (args) => {
    const [selected, setSelected] = useState('')
    return (
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
        <Combobox
          {...args}
          value={selected}
          onValueChange={(v) => {
            setSelected(v)
            args.onValueChange?.(v)
          }}
          options={[
            { value: '1', label: 'Inversiones Farutech S.A.S.' },
            { value: '2', label: 'Afilamos Operaciones Industriales' },
          ]}
        />
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', { name: /buscar cliente/i })
    await userEvent.click(combobox)
    const option = await within(document.body).findByText('Afilamos Operaciones Industriales')
    await userEvent.click(option)
    await expect(args.onValueChange).toHaveBeenCalled()
  },
}

/**
 * Test de accesibilidad: verifica rol combobox y label.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'Campo bloqueado',
    disabled: true,
    placeholder: 'No editable',
  },
  render: (args) => (
    <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
      <Combobox {...args} options={[]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', { name: /campo bloqueado/i })
    await expect(combobox).toBeInTheDocument()
    await expect(combobox).toBeDisabled()
  },
}
