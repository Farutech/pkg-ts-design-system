import type { Meta, StoryObj } from '@storybook/react-vite'
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

export const ConFormulario: Story = {
  name: 'Modal con formulario',
  render: () => (
    <ModalDemo title="Agregar usuario">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--ft-color-foreground)' }}>
            Nombre completo
          </label>
          <input
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--ft-color-border)', background: 'var(--ft-color-surface)', color: 'var(--ft-color-foreground)', outline: 'none', boxSizing: 'border-box' }}
            placeholder="María García"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--ft-color-foreground)' }}>
            Correo electrónico
          </label>
          <input
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--ft-color-border)', background: 'var(--ft-color-surface)', color: 'var(--ft-color-foreground)', outline: 'none', boxSizing: 'border-box' }}
            type="email"
            placeholder="maria@empresa.com"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--ft-color-border)' }}>
          <Button variant="ghost">Cancelar</Button>
          <Button>Guardar usuario</Button>
        </div>
      </div>
    </ModalDemo>
  ),
}
