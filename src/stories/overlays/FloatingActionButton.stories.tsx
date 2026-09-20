import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton'
import { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon, LinkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

/**
 * FloatingActionButton — FAB (Floating Action Button) con acciones expandibles.
 *
 * Cuando tiene acciones, al hacer clic se expande mostrando las acciones flotantes.
 * Sin acciones, funciona como un botón flotante simple.
 */
function FABDemo() {
  const [created, setCreated] = useState(false)

  const actions = [
    { label: 'Nuevo usuario', icon: <PlusIcon className="h-5 w-5" />, onClick: () => { setCreated(true) } },
    { label: 'Nueva orden', icon: <MagnifyingGlassIcon className="h-5 w-5" />, onClick: () => alert('Nueva orden') },
    { label: 'Nuevo proyecto', icon: <LinkIcon className="h-5 w-5" />, onClick: () => alert('Nuevo proyecto') },
    { label: 'Chat de soporte', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, onClick: () => alert('Chat') },
  ]

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--ft-color-background)' }}>
      <FloatingActionButton
        icon={<PlusIcon className="h-6 w-6" />}
        label="Acciones principales"
        onClick={() => alert('Acción principal')}
        actions={actions}
        position="bottom-right"
        size="md"
        variant="primary"
        offset={24}
      />

      {created && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.75rem 1.5rem',
          background: 'var(--ft-color-success)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.3s ease',
        }}>
          ✓ Usuario creado exitosamente
        </div>
      )}
    </div>
  )
}

const meta = {
  title: '7-Overlays/FloatingActionButton',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'FAB (Floating Action Button) con acciones expandibles. Se expande al hacer clic para mostrar acciones secundarias flotantes.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ConAccionesExpandibles: Story = {
  render: () => <FABDemo />,
}

export const SimpleFAB: Story = {
  name: 'FAB simple (sin acciones)',
  render: () => (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--ft-color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FloatingActionButton
        icon={<PlusIcon className="h-6 w-6" />}
        label="Nuevo registro"
        onClick={() => alert('Nuevo registro')}
        position="bottom-right"
        size="lg"
        variant="primary"
        offset={32}
      />
    </div>
  ),
}

export const VariosColores: Story = {
  name: 'Variantes de color',
  render: () => (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--ft-color-background)', display: 'flex', gap: '1.5rem', padding: '2rem' }}>
      <FloatingActionButton
        icon={<PlusIcon className="h-5 w-5" />}
        label="Primary"
        onClick={() => {}}
        position="bottom-right"
        size="sm"
        variant="primary"
        offset={24}
      />
      <FloatingActionButton
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
        label="Secundary"
        onClick={() => {}}
        position="bottom-right"
        size="sm"
        variant="secondary"
        offset={24}
      />
      <FloatingActionButton
        icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
        label="Success"
        onClick={() => {}}
        position="bottom-right"
        size="sm"
        variant="success"
        offset={24}
      />
    </div>
  ),
}
