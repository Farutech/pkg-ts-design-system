import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@/components/ui/Switch'
import { fn } from '@storybook/test'

const meta = {
  title: '4-Inputs/Switch',
  component: Switch,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: { label: 'Notificaciones por correo', checked: false, onChange: fn() },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Toggle switch accesible. Controlado mediante `checked` + `onChange`.' } },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Grupo: Story = {
  name: 'Grupo de switches',
  render: () => (
    <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[
        { label: 'Notificaciones push', description: 'Recibir alertas en el navegador', defaultChecked: true },
        { label: 'Correos de resumen', description: 'Resumen semanal de actividad', defaultChecked: true },
        { label: 'Notificaciones de marketing', description: 'Novedades y ofertas del equipo', defaultChecked: false },
        { label: 'Actualizaciones del sistema', description: 'Mantenimientos y cambios técnicos', defaultChecked: false },
      ].map(({ label, description, defaultChecked }) => (
        <Switch key={label} label={label} description={description} defaultChecked={defaultChecked} onChange={() => {}} />
      ))}
    </div>
  ),
}
