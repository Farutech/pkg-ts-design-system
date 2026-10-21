import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Textarea } from '@/components/ui/Textarea'

const meta: Meta<typeof Textarea> = {
  title: '4-Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Etiqueta del área de texto' },
    placeholder: { control: 'text', description: 'Texto sugerido cuando está vacío' },
    floatingTitle: { control: 'text', description: 'Título flotante para modo labelMode="floating"' },
    labelMode: {
      control: 'select',
      options: ['external', 'floating', 'placeholder', 'hidden'],
      description: 'Modo de visualización de la etiqueta',
    },
    rows: { control: 'number', description: 'Número de filas visibles' },
    maxLength: { control: 'number', description: 'Longitud máxima de caracteres' },
    showCount: { control: 'boolean', description: 'Mostrar contador de caracteres' },
    disabled: { control: 'boolean', description: 'Estado deshabilitado' },
    readOnly: { control: 'boolean', description: 'Modo solo lectura' },
    error: { control: 'text', description: 'Mensaje de error de validación' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  args: {
    label: 'Observaciones Técnicas',
    placeholder: 'Escribe las especificaciones o condiciones del servicio...',
    rows: 3,
    showCount: false,
    maxLength: 200,
    disabled: false,
    readOnly: false,
    labelMode: 'external',
    error: undefined,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Área de texto multilínea con label, contador de caracteres, modo floating y validación de error.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Observaciones Técnicas',
    placeholder: 'Escribe las especificaciones o condiciones del servicio...',
    rows: 3,
    showCount: true,
    maxLength: 200,
  },
}

export const FloatingMode: Story = {
  name: 'Modo Floating',
  args: {
    label: 'Describe detalladamente el requerimiento operativo',
    floatingTitle: 'DESCRIPCIÓN DEL REQUERIMIENTO',
    labelMode: 'floating',
    rows: 3,
  },
}

export const ConError: Story = {
  name: 'Con error',
  args: {
    label: 'Observaciones',
    error: 'Este campo es obligatorio',
    rows: 3,
  },
}

export const Deshabilitado: Story = {
  args: {
    label: 'Área bloqueada',
    disabled: true,
    rows: 3,
  },
}

/**
 * Test de interacción: escribe texto y valida onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  args: {
    label: 'Observaciones de prueba',
    placeholder: 'Escribe aquí...',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: /observaciones de prueba/i })
    await userEvent.type(textarea, 'Texto de prueba del textarea')
    await expect(textarea).toHaveValue('Texto de prueba del textarea')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * Test de accesibilidad: verifica rol, label y mensaje de error.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'Área de texto bloqueada',
    disabled: true,
    error: 'Campo requerido',
    rows: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: /área de texto bloqueada/i })
    await expect(textarea).toBeInTheDocument()
    await expect(textarea).toBeDisabled()
    await expect(canvas.getByText(/campo requerido/i)).toBeInTheDocument()
  },
}
