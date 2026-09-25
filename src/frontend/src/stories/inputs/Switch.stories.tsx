import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@/components/ui/Switch'
import { expect, fn, userEvent, within } from 'storybook/test'

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

/** 1. Test de Renderizado Visual Básico */
export const Default: Story = {}

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

/** 2. Test de Funcionalidad e Interacción */
export const TestInteraccion: Story = {
  name: 'Test: Alternancia de Estado e Interacción',
  args: {
    label: 'Modo oscuro automático',
    defaultChecked: false,
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchButton = canvas.getByRole('switch', { name: /modo oscuro automático/i })
    await expect(switchButton).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(switchButton)
    await expect(switchButton).toHaveAttribute('aria-checked', 'true')
  },
}

/** 3. Test de Accesibilidad y Atributos ARIA */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y Estado Deshabilitado',
  args: {
    label: 'Sincronización en la nube',
    disabled: true,
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchButton = canvas.getByRole('switch', { name: /sincronización en la nube/i })
    await expect(switchButton).toBeInTheDocument()
    await expect(switchButton).toBeDisabled()
    await expect(switchButton).toHaveAttribute('aria-checked', 'true')
  },
}

