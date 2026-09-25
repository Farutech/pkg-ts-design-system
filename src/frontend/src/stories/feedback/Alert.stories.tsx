import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Alert } from '@/components/ui/Alert'

/**
 * Alert — Mensajes contextuales con variantes semánticas.
 * Soporta título, contenido, icono automático y botón de cierre.
 */
const meta = {
  title: '6-Feedback/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'danger', 'warning', 'info'],
    },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    variant: 'info',
    title: 'Información importante',
    children: 'Este es un mensaje informativo del sistema.',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de alerta con 5 variantes semánticas. El ícono se asigna automáticamente según la variante.',
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variantes: Story = {
  render: () => (
    <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Alert variant="success" title="¡Operación exitosa!">
        El usuario ha sido guardado correctamente en el sistema.
      </Alert>
      <Alert variant="info" title="Información">
        El proceso de sincronización puede tardar hasta 5 minutos.
      </Alert>
      <Alert variant="warning" title="Advertencia">
        Esta acción no se puede deshacer. Procede con precaución.
      </Alert>
      <Alert variant="error" title="Error">
        No se pudo conectar con el servidor. Intenta de nuevo.
      </Alert>
      <Alert variant="danger" title="Acción destructiva">
        Estás a punto de eliminar todos los registros del módulo.
      </Alert>
    </div>
  ),
}

export const SinTitulo: Story = {
  name: 'Sin título',
  render: () => (
    <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Alert variant="success">El formulario fue enviado correctamente.</Alert>
      <Alert variant="warning">Hay cambios sin guardar en el documento.</Alert>
      <Alert variant="info">Recuerda actualizar tus datos de perfil.</Alert>
    </div>
  ),
}

export const ConBotónCerrar: Story = {
  name: 'Con botón cerrar',
  render: () => (
    <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Alert variant="success" title="¡Guardado!" onClose={() => alert('Cerrado')}>
        Los cambios se han guardado correctamente.
      </Alert>
      <Alert variant="warning" title="Sesión por expirar" onClose={() => alert('Cerrado')}>
        Tu sesión expirará en 5 minutos. Guarda tu trabajo.
      </Alert>
    </div>
  ),
}

export const ConContenidoRich: Story = {
  name: 'Contenido enriquecido',
  render: () => (
    <div style={{ width: '480px' }}>
      <Alert variant="info" title="Novedades en v1.2.0">
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
          <li>Nuevo componente <strong>TopNav</strong> con multinivel</li>
          <li>Storybook 10 con 60+ stories</li>
          <li>Migración de tests a play functions</li>
        </ul>
      </Alert>
    </div>
  ),
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Simula clic en el botón de cerrar y valida la invocación de onClose.
 */
export const TestInteraccion: Story = {
  name: 'Test: Botón de Cierre e Interacción',
  args: {
    variant: 'warning',
    title: 'Aviso importante',
    children: 'Puedes cerrar este aviso en cualquier momento.',
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const closeBtn = canvas.getByRole('button')
    await userEvent.click(closeBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Valida la existencia del rol alert y la visibilidad de su título y contenido.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y Rol Alert',
  args: {
    variant: 'error',
    title: 'Error de conexión',
    children: 'No se pudo sincronizar la información con el servidor.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alertElement = canvas.getByRole('alert')
    await expect(alertElement).toBeInTheDocument()
    await expect(canvas.getByText(/error de conexión/i)).toBeInTheDocument()
    await expect(canvas.getByText(/no se pudo sincronizar/i)).toBeInTheDocument()
  },
}

