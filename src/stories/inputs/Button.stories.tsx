import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/ui/Button'
import {
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

/**
 * Button — El componente de acción principal del Design System.
 *
 * Soporta 7 variantes, 3 tamaños, iconos y estado de carga.
 * Puede renderizarse como `<button>`, `<a>` (href externo) o
 * como el `LinkComponent` del provider (navegación interna).
 */
const meta = {
  title: '4-Inputs/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'ghost', 'outline'],
      description: 'Estilo visual del botón',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón',
    },
    loading: { control: 'boolean', description: 'Estado de carga' },
    disabled: { control: 'boolean', description: 'Estado deshabilitado' },
    fullWidth: { control: 'boolean', description: 'Ocupa el ancho completo del contenedor' },
    children: { control: 'text', description: 'Texto del botón' },
  },
  args: {
    children: 'Guardar cambios',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón de acción. Soporta `href` para links externos y `to` para navegación interna con el router del provider.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Story principal con todos los controles activos */
export const Default: Story = {}

/** Todas las variantes de color */
export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

/** Tres tamaños disponibles */
export const Tamaños: Story = {
  name: 'Tamaños',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
}

/** Botones con íconos a izquierda y derecha */
export const ConIcono: Story = {
  name: 'Con ícono',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button icon={<PlusIcon className="h-4 w-4" />}>Agregar</Button>
      <Button variant="danger" icon={<TrashIcon className="h-4 w-4" />}>Eliminar</Button>
      <Button variant="outline" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>Exportar</Button>
      <Button variant="ghost" icon={<HeartIcon className="h-4 w-4" />} iconPosition="right">Me gusta</Button>
      <Button variant="success" icon={<CheckIcon className="h-4 w-4" />}>Confirmar</Button>
      <Button icon={<ArrowRightIcon className="h-4 w-4" />} iconPosition="right">Siguiente</Button>
    </div>
  ),
}

/** Estado de carga — spinner + texto bloqueado */
export const EstadoCarga: Story = {
  name: 'Estado de carga',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button loading>Guardando...</Button>
      <Button variant="outline" loading>Procesando</Button>
      <Button variant="danger" loading size="lg">Eliminando</Button>
    </div>
  ),
}

/** Estado deshabilitado */
export const Deshabilitado: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button disabled>Primary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="danger" disabled>Danger</Button>
    </div>
  ),
}

/** Ancho completo del contenedor */
export const AnchoCompleto: Story = {
  name: 'Ancho completo',
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Button fullWidth>Iniciar sesión</Button>
      <Button fullWidth variant="outline">Registrarse</Button>
      <Button fullWidth variant="ghost">¿Olvidaste tu contraseña?</Button>
    </div>
  ),
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Simula interacción real con userEvent y verifica ejecución de callbacks.
 */
export const TestInteraccion: Story = {
  name: 'Test: Interacción de Usuario',
  args: {
    children: 'Hacer clic aquí',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /hacer clic aquí/i })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica roles accesibles de botón, estado disabled y prevención de clics.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    children: 'Botón Bloqueado',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /botón bloqueado/i })
    await expect(button).toBeInTheDocument()
    await expect(button).toBeDisabled()
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
