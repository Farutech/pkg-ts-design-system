import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from '@/components/ui/IconButton'
import { BellIcon, MagnifyingGlassIcon, CogIcon, UserIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

/**
 * IconButton — botón de ícono puro con variantes y tamaños.
 *
 * Soporta variantes: ghost (default), solid, outline.
 * Tamaños: sm (32px), md (40px, default), lg (48px).
 * Opción de bordes redondeados (rounded).
 */
const meta = {
  title: '10-Helpers/IconButton',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón de ícono puro con 3 variantes, 3 tamaños y opción de bordes redondeados.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Variantes: Story = {
  render: () => {
    const [count, setCount] = useState(0)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <IconButton icon={<BellIcon className="h-5 w-5" />} variant="ghost" aria-label="Notificaciones" />
          <IconButton icon={<MagnifyingGlassIcon className="h-5 w-5" />} variant="solid" aria-label="Buscar" />
          <IconButton icon={<CogIcon className="h-5 w-5" />} variant="outline" aria-label="Configuración" />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <IconButton icon={<UserIcon className="h-5 w-5" />} size="sm" variant="ghost" aria-label="Perfil (sm)" />
          <IconButton icon={<UserIcon className="h-5 w-5" />} size="md" variant="ghost" aria-label="Perfil (md)" />
          <IconButton icon={<UserIcon className="h-5 w-5" />} size="lg" variant="ghost" aria-label="Perfil (lg)" />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <IconButton icon={<CheckIcon className="h-5 w-5" />} variant="solid" size="md" rounded aria-label="Confirmar" />
          <IconButton icon={<TrashIcon className="h-5 w-5" />} variant="solid" size="md" rounded aria-label="Eliminar" style={{ color: 'red' }} />
          <IconButton icon={<PlusIcon className="h-5 w-5" />} variant="solid" size="md" rounded aria-label="Agregar" />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <IconButton icon={<UserIcon className="h-5 w-5" />} variant="ghost" onClick={() => setCount(c => c + 1)} aria-label="Click counter" />
          <span style={{ fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
            Clicks: <strong>{count}</strong>
          </span>
        </div>
      </div>
    )
  },
}

function CheckIcon(props: any) {
  return <svg {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
}
