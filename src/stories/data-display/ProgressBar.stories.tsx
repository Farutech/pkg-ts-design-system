import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useState } from 'react'

/**
 * ProgressBar — barra de progreso con variantes, colores y estados.
 *
 * Soporta: valores deterministas (0-100%), indeterminado (loading),
 * variantes (default, striped, gradient), tamaños (sm, md, lg, xl),
 * y color semántico (primary, success, warning, error, info).
 */
function ProgressDemo() {
  const [progress, setProgress] = useState(65)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Carga de datos</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} label="Progreso" color="primary" size="md" showLabel showSpinner />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>Success</span>
          <ProgressBar value={80} color="success" size="sm" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>Warning</span>
          <ProgressBar value={60} color="warning" size="sm" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>Error</span>
          <ProgressBar value={45} color="error" size="sm" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>Info</span>
          <ProgressBar value={70} color="info" size="sm" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Variant: striped</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>40%</span>
        </div>
        <ProgressBar value={40} variant="striped" color="primary" size="md" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Variant: gradient</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>85%</span>
        </div>
        <ProgressBar value={85} variant="gradient" color="success" size="md" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Indeterminado (loading)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>Cargando...</span>
        </div>
        <ProgressBar variant="indeterminate" showSpinner showLabel loadingMessage="Procesando..." />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <div key={size} style={{ flex: 1, minWidth: '100px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)', marginBottom: '0.125rem', textTransform: 'capitalize' }}>{size}</span>
            <ProgressBar value={60} size={size} />
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: '5-Data Display/ProgressBar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barra de progreso con 4 variantes (default, striped, gradient, indeterminate), 5 colores semánticos y 4 tamaños.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const VariantesYColores: Story = {
  render: () => <ProgressDemo />,
}
