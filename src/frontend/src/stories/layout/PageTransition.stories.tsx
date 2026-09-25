import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageTransition } from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

/**
 * PageTransition — Animaciones de transición entre páginas.
 *
 * Usa framer-motion para animar entrada/salida de contenido.
 * Los variants disponibles son: fade, slide, scale.
 */
function TransitionDemo({ variant = 'fade' }: { variant?: 'fade' | 'slide' | 'scale' }) {
  const [page, setPage] = useState(0)
  const pages = [
    { title: 'Página 1', color: 'bg-primary-500', textColor: 'text-white' },
    { title: 'Página 2', color: 'bg-success', textColor: 'text-white' },
    { title: 'Página 3', color: 'bg-warning', textColor: 'text-white' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <Button variant="outline" size="sm" onClick={() => setPage(0)}>Pág. 1</Button>
        <Button variant="outline" size="sm" onClick={() => setPage(1)}>Pág. 2</Button>
        <Button variant="outline" size="sm" onClick={() => setPage(2)}>Pág. 3</Button>
      </div>

      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ft-color-surface)', borderRadius: '0.5rem', border: '1px solid var(--ft-color-border)', overflow: 'hidden' }}>
        <PageTransition key={page} variant={variant}>
          <div style={{
            padding: '2rem',
            background: 'var(--ft-color-primary)',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 600,
            textAlign: 'center',
            minWidth: '200px',
          }}>
            {pages[page].title}
          </div>
        </PageTransition>
      </div>

      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>
        Variante actual: <strong>{variant}</strong> — haz clic en los botones para ver la transición
      </p>
    </div>
  )
}

const meta = {
  title: '2-Layout/PageTransition',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Envuelve el contenido de cada página para agregar animaciones de entrada/salida con framer-motion.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Fade: Story = {
  render: () => <TransitionDemo variant="fade" />,
}

export const Slide: Story = {
  name: 'Slide desde derecha',
  render: () => <TransitionDemo variant="slide" />,
}

export const Scale: Story = {
  name: 'Scale up + fade',
  render: () => <TransitionDemo variant="scale" />,
}
