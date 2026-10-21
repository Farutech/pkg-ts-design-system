import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PasswordInput } from '@/components/ui/PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: '4-Inputs/PasswordInput',
  component: PasswordInput,
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
    showToggle: { control: 'boolean', description: 'Mostrar botón para alternar visibilidad' },
    disabled: { control: 'boolean', description: 'Estado deshabilitado' },
    readOnly: { control: 'boolean', description: 'Modo solo lectura' },
    error: { control: 'text', description: 'Mensaje de error de validación' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  args: {
    label: 'Contraseña Corporativa',
    placeholder: '••••••••••••',
    showToggle: true,
    disabled: false,
    readOnly: false,
    error: undefined,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input de contraseña con botón para mostrar/ocultar caracteres y validación.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Contraseña Corporativa',
    placeholder: '••••••••••••',
    showToggle: true,
  },
}

export const FloatingTitle: Story = {
  name: 'Título Flotante',
  args: {
    label: 'Ingresa tu clave de acceso',
    floatingTitle: 'CLAVE DE ACCESO',
    labelMode: 'floating',
  },
}

export const ConError: Story = {
  name: 'Con error',
  args: {
    label: 'Contraseña',
    error: 'La contraseña debe tener al menos 8 caracteres',
    showToggle: true,
  },
}

export const Deshabilitado: Story = {
  args: {
    label: 'Contraseña bloqueada',
    disabled: true,
    showToggle: true,
  },
}

/**
 * Test de interacción: escribe contraseña y valida onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  args: {
    label: 'Contraseña de prueba',
    showToggle: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // <input type="password"> no expone el rol "textbox" (ARIA in HTML);
    // la consulta correcta y robusta es por label asociado (for/id).
    const input = canvas.getByLabelText(/contraseña de prueba/i)
    await userEvent.type(input, 'MiClave123!')
    await expect(input).toHaveValue('MiClave123!')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * Test de accesibilidad: verifica rol, label y estado deshabilitado.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'Contraseña bloqueada',
    disabled: true,
    error: 'Campo requerido',
    showToggle: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText(/contraseña bloqueada/i)
    await expect(input).toBeInTheDocument()
    await expect(input).toBeDisabled()
    await expect(canvas.getByText(/campo requerido/i)).toBeInTheDocument()
  },
}
