import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox'
import { fn } from '@storybook/test'

/**
 * Checkbox — casilla de verificación individual y CheckboxGroup para grupos.
 *
 * Soporta label, description, estado disabled, y variantes de size.
 */
const meta = {
  title: '4-Inputs/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: { label: 'Acepto los términos', checked: false, onChange: fn() },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox individual y CheckboxGroup para selección múltiple. Asequible con keyboard y screen readers.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>

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
