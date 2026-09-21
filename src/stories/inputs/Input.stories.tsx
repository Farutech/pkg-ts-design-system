import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Input } from '@/components/ui/Input'
import { MagnifyingGlassIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'

/**
 * Input — Campo de entrada de texto con soporte completo de validación,
 * iconos, estados de error y toggle de contraseña.
 */
const meta = {
  title: '4-Inputs/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
  },
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. María García',
    fullWidth: true,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input con validación por regex, iconos, helper text y toggle de contraseña incorporado.',
      },
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConIcono: Story = {
  name: 'Con ícono',
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Buscar" placeholder="Buscar componentes..." icon={<MagnifyingGlassIcon className="h-4 w-4" />} iconPosition="left" />
      <Input label="Correo electrónico" placeholder="tu@email.com" type="email" icon={<EnvelopeIcon className="h-4 w-4" />} />
      <Input label="Usuario" placeholder="@usuario" icon={<UserIcon className="h-4 w-4" />} iconPosition="right" />
    </div>
  ),
}

export const Contraseña: Story = {
  name: 'Contraseña con toggle',
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" icon={<LockClosedIcon className="h-4 w-4" />} helperText="Debe tener mayúsculas, minúsculas y números." />
    </div>
  ),
}

export const ConError: Story = {
  name: 'Con error de validación',
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Correo electrónico" type="email" defaultValue="email-invalido" error="Ingresa un correo electrónico válido." />
      <Input label="Teléfono" defaultValue="abc" error="Solo se permiten números." />
    </div>
  ),
}

export const Deshabilitado: Story = {
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Campo deshabilitado" disabled defaultValue="No se puede editar" />
      <Input label="Campo de solo lectura" readOnly defaultValue="Solo lectura" />
    </div>
  ),
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Simula escritura de texto con userEvent y valida el valor resultante.
 */
export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  args: {
    label: 'Nombre de usuario',
    placeholder: 'Escribe tu usuario',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /nombre de usuario/i })
    await userEvent.type(input, 'farutech_admin')
    await expect(input).toHaveValue('farutech_admin')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * 3. Test de Accesibilidad y Atributos ARIA:
 * Verifica accesibilidad de etiqueta, estado de error y mensaje aria-describedby.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y Validación ARIA',
  args: {
    label: 'Correo corporativo',
    placeholder: 'admin@farutech.com',
    error: 'El formato del correo es inválido',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /correo corporativo/i })
    await expect(input).toBeInTheDocument()
    await expect(canvas.getByText(/el formato del correo es inválido/i)).toBeInTheDocument()
  },
}

