import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { useState } from 'react'

/**
 * Modal - Dialogo modal con overlay con blur, focus trap y cierre por Escape.
 * Permite cambiar parametros interactivamente desde la tabla de Controles de Storybook.
 */
const meta: Meta<any> = {
  title: '7-Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ventana modal accesible (WAI-ARIA) con focus trap, backdrop blur y slots flexibles para header, children y footer.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Estado de visibilidad del modal',
    },
    title: {
      control: 'text',
      description: 'Titulo principal mostrado en el encabezado',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitulo o descripcion contextual bajo el titulo',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Ancho maximo del contenedor modal',
    },
    closeButton: {
      control: 'boolean',
      description: 'Muestra u oculta la X de cierre en la esquina superior derecha',
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales para el contenedor principal',
    },
    bodyClassName: {
      control: 'text',
      description: 'Clases CSS para el contenedor del cuerpo (children)',
    },
    headerClassName: {
      control: 'text',
      description: 'Clases CSS para el encabezado',
    },
    footerClassName: {
      control: 'text',
      description: 'Clases CSS para el pie del modal',
    },
    onClose: { action: 'closed' },
  },
  args: {
    isOpen: true,
    title: 'Confirmar operacion',
    subtitle: 'Verifique los detalles antes de aplicar los cambios en el sistema',
    size: 'md',
    closeButton: true,
  },
}

export default meta
type Story = StoryObj<any>

/**
 * Modal interactivo vinculado a los Controles de Storybook.
 * Cambia los valores en la tabla inferior para ver el comportamiento en tiempo real.
 */
export const Default: Story = {
  render: (args: any) => (
    <Modal isOpen={args.isOpen ?? true} onClose={args.onClose ?? (() => {})} {...args}>
      <div className="space-y-4 text-slate-300">
        <p>
          Este contenido es aceptado como <code className="text-violet-400 font-mono bg-violet-950/40 px-1.5 py-0.5 rounded">children</code> y se adapta al tamano seleccionado.
        </p>
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          Tip: Puedes modificar el tamano (<code className="text-amber-300">size</code>), activar o desactivar el boton de cierre (<code className="text-amber-300">closeButton</code>), o cambiar los textos directamente en la pestana <strong>Controls</strong>.
        </div>
      </div>
    </Modal>
  ),
}

/**
 * Modal con Botones y Acciones en el Footer
 */
export const ConFooter: Story = {
  args: {
    title: 'Eliminar cliente',
    subtitle: 'Esta accion no se puede deshacer de forma automatica.',
    size: 'sm',
  },
  render: (args: any) => (
    <Modal isOpen={args.isOpen ?? true} onClose={args.onClose ?? (() => {})} {...args} footer={
        <>
          <Button variant="ghost" onClick={args.onClose}>Cancelar</Button>
          <Button variant="danger" onClick={args.onClose}>Eliminar permanentemente</Button>
        </>
      }
    >
      <p className="text-slate-300 text-sm">
        ¿Estas completamente seguro de que deseas eliminar este registro del catalogo?
      </p>
    </Modal>
  ),
}

/**
 * Modal con Estilos CSS Personalizados aplicados a todo el control
 */
export const EstilosPersonalizados: Story = {
  args: {
    title: 'Edicion VIP de Operacion',
    subtitle: 'Demostracion de className, bodyClassName y headerClassName personalizados',
    size: 'lg',
    className: 'border-indigo-500/40 shadow-[0_20px_60px_rgba(99,102,241,0.25)] bg-gradient-to-b from-[#181a29] to-[#0f111c]',
    headerClassName: 'bg-indigo-950/30 border-indigo-500/20',
    bodyClassName: 'p-7',
  },
  render: (args: any) => (
    <Modal isOpen={args.isOpen ?? true} onClose={args.onClose ?? (() => {})} {...args} footer={
        <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-500" onClick={args.onClose}>
          Aceptar cambios
        </Button>
      }
    >
      <div className="space-y-3 text-slate-200">
        <p className="text-sm">
          Este modal implementa clases CSS especificas para el contenedor, cabecera y cuerpo sin romper la accesibilidad ni las animaciones.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-400">Total Facturado</span>
            <p className="text-base font-bold text-emerald-400">$1,450,000</p>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-400">Estado de Orden</span>
            <p className="text-base font-bold text-indigo-400">En Produccion</p>
          </div>
        </div>
      </div>
    </Modal>
  ),
}

function FormModalDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    active: true,
  })

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Abrir Modal con Formulario
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear nuevo colaborador"
        subtitle="Ingresa los datos del nuevo miembro del equipo"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsOpen(false)
          }}
          className="flex flex-col gap-4 py-1"
        >
          <Input
            label="Nombre completo *"
            placeholder="Ej. Maria Garcia"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Correo electronico corporativo *"
            type="email"
            placeholder="maria@farutech.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Select
            label="Rol de acceso"
            value={formData.role}
            onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Administrador (Acceso total)' },
              { value: 'editor', label: 'Editor (Gestion de contenidos)' },
              { value: 'viewer', label: 'Visualizador (Solo lectura)' },
            ]}
          />

          <div className="pt-1">
            <Switch
              label="Usuario activo de inmediato"
              description="Permite el inicio de sesion una vez creado"
              checked={formData.active}
              onChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700/60 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar colaborador
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export const ConFormulario: Story = {
  name: 'Modal con formulario (C-19)',
  render: () => <FormModalDemo />,
}

function ModalDemo({ title = 'Confirmar accion' }: { title?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)' }}>
            ¿Estas seguro de que deseas continuar con esta accion? No se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const TestInteraccion: Story = {
  name: 'Test: Apertura de Modal e Interaccion',
  render: () => <ModalDemo title="Dialogo Interactivo" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByRole('button', { name: /abrir modal/i })
    await userEvent.click(openBtn)
    
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await expect(within(dialog).getByText(/dialogo interactivo/i)).toBeInTheDocument()
    
    const cancelBtn = within(dialog).getByRole('button', { name: /cancelar/i })
    await userEvent.click(cancelBtn)
  },
}

export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y Atributos ARIA',
  render: () => (
    <Modal isOpen={true} onClose={fn()} title="Accesibilidad WAI-ARIA">
      <p>Contenido accesible para lectores de pantalla.</p>
    </Modal>
  ),
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(within(dialog).getByRole('button', { name: /cerrar modal/i })).toBeInTheDocument()
  },
}
