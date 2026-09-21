import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox'

/**
 * Checkbox — casilla de verificación individual y CheckboxGroup para grupos.
 *
 * Soporta label, description, estado disabled, y variantes de size.
 */
const meta: Meta<typeof Checkbox> = {
  title: '4-Inputs/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: { label: 'Acepto los términos', checked: false, onChange: () => {} },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox individual y CheckboxGroup para selección múltiple. Asequible con keyboard y screen readers.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConDescripcion: Story = {
  name: 'Con descripción',
  args: {
    label: 'Notificaciones por correo',
    description: 'Recibe alertas importantes directamente en tu correo electrónico.',
    checked: true,
  },
}

export const Deshabilitado: Story = {
  args: { label: 'Opción deshabilitada', disabled: true },
}

export const GrupoDeCheckboxes: Story = {
  name: 'CheckboxGroup (selección múltiple)',
  parameters: {
    docs: {
      description: {
        story: 'CheckboxGroup renderiza múltiples checkboxes con valor array y onChange colectivo.',
      },
    },
  },
  render: () => {
    const options = [
      { value: 'dashboard', label: 'Dashboard', description: 'Ver panel de estadísticas' },
      { value: 'reports', label: 'Reportes', description: 'Acceder a reportes mensuales' },
      { value: 'users', label: 'Usuarios', description: 'Administrar usuarios del sistema' },
      { value: 'settings', label: 'Configuración', description: 'Ajustes generales de la app' },
    ]
    return (
      <div style={{ width: '380px' }}>
        <CheckboxGroup
          label="Módulos del panel"
          options={options}
          value={['dashboard', 'reports']}
          onChange={() => {}}
        />
      </div>
    )
  },
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Simula clic sobre la casilla de verificación y valida el evento onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Clic e Interacción',
  args: {
    label: 'Acepto recibir comunicaciones',
    checked: false,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: /acepto recibir comunicaciones/i })
    await userEvent.click(checkbox)
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica roles, estado de deshabilitado y prevención de eventos.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'Términos obligatorios bloqueados',
    disabled: true,
    checked: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: /términos obligatorios bloqueados/i })
    await expect(checkbox).toBeInTheDocument()
    await expect(checkbox).toBeDisabled()
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}

