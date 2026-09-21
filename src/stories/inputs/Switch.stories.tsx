import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@/components/ui/Switch'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

const meta = {
  title: '4-Inputs/Switch',
  component: Switch,
  argTypes: {
    label: { control: 'text', description: 'Texto de la etiqueta' },
    description: { control: 'text', description: 'Texto secundario explicativo' },
    disabled: { control: 'boolean', description: 'Deshabilitar el interruptor' },
    checked: { control: 'boolean', description: 'Valor controlado' },
    defaultChecked: { control: 'boolean', description: 'Valor inicial por defecto' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Tamaño del switch' },
    color: { control: 'select', options: ['primary', 'success', 'warning', 'error'], description: 'Color activo' },
  },
  args: {
    label: 'Notificaciones por correo',
    defaultChecked: false,
    size: 'md',
    color: 'primary',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggle switch interactivo y accesible. Soporta modo controlado (`checked` + `onChange`) o no controlado (`defaultChecked`). Funciona como un checkbox amigable.',
      },
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Interactivo (Clic para alternar)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchButton = canvas.getByRole('switch')
    expect(switchButton.getAttribute('aria-checked')).toBe('false')
    await userEvent.click(switchButton)
    expect(switchButton.getAttribute('aria-checked')).toBe('true')
  },
}

export const Grupo: Story = {
  name: 'Grupo de switches interactivos',
  render: () => (
    <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[
        { label: 'Notificaciones push', description: 'Recibir alertas en el navegador', defaultChecked: true },
        { label: 'Correos de resumen', description: 'Resumen semanal de actividad', defaultChecked: true },
        { label: 'Notificaciones de marketing', description: 'Novedades y ofertas del equipo', defaultChecked: false },
        { label: 'Actualizaciones del sistema', description: 'Mantenimientos y cambios técnicos', defaultChecked: false },
      ].map(({ label, description, defaultChecked }) => (
        <Switch key={label} label={label} description={description} defaultChecked={defaultChecked} />
      ))}
    </div>
  ),
}
