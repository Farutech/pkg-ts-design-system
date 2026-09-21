import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

/**
 * Modal — Diálogo modal con overlay, focus trap y cierre por Escape.
 */

function ModalDemo({ title = 'Confirmar acción', children }: { title?: string; children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children || (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)' }}>
              ¿Estás seguro de que deseas continuar con esta acción? No se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>Eliminar</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

const meta = {
  title: '7-Overlays/Modal',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal con focus trap, cierre por Escape, overlay con blur. Usa el prop `isOpen` para controlar el estado.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const Confirmacion: Story = {
  name: 'Modal de confirmación',
  render: () => <ModalDemo title="¿Eliminar registro?" />,
}

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'

function FormModalDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    active: true,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Usuario guardado exitosamente:\nNombre: ${formData.name || 'Sin nombre'}\nCorreo: ${formData.email || 'Sin correo'}\nRol: ${formData.role}`)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Abrir Modal con Formulario
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear nuevo colaborador"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 py-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
            Ingresa los datos del nuevo miembro del equipo. Recibirá un correo de bienvenida con sus credenciales.
          </p>

          <Input
            label="Nombre completo *"
            placeholder="Ej. María García"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Correo electrónico corporativo *"
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
              { value: 'editor', label: 'Editor (Gestión de contenidos)' },
              { value: 'viewer', label: 'Visualizador (Solo lectura)' },
            ]}
          />

          <div className="pt-1">
            <Switch
              label="Usuario activo de inmediato"
              description="Permite el inicio de sesión una vez creado"
              checked={formData.active}
              onChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
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

/**
 * 2. Test de Funcionalidad e Interacción:
 * Simula clic para abrir el diálogo modal y verifica que el contenido se visualice.
 */
export const TestInteraccion: Story = {
  name: 'Test: Apertura de Modal e Interacción',
  render: () => <ModalDemo title="Diálogo Interactivo" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByRole('button', { name: /abrir modal/i })
    await userEvent.click(openBtn)
    
    // El modal se renderiza en un portal en document.body
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await expect(within(dialog).getByText(/diálogo interactivo/i)).toBeInTheDocument()
    
    const cancelBtn = within(dialog).getByRole('button', { name: /cancelar/i })
    await userEvent.click(cancelBtn)
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica el rol dialog, aria-modal="true" y el botón accesible de cierre.
 */
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

