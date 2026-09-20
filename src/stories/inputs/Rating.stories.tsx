import type { Meta, StoryObj } from '@storybook/react-vite'
import { Rating } from '@/components/ui/Rating'
import { useState } from 'react'

/**
 * Rating — selector de estrellas para calificaciones.
 *
 * Soporta interactivo (cambiar valor) y solo lectura (mostrar promedio),
 * sizes múltiples y muestra del valor numérico.
 */
const meta = {
  title: '4-Inputs/Rating',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector de estrellas para calificaciones. Soporta interactivo, solo lectura, mostrar valor numérico y 3 tamaños.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CalificacionInteractiva: Story = {
  render: () => {
    const [rating, setRating] = useState(3)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '480px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Calificación interactiva</p>
          <Rating value={rating} onChange={setRating} showValue />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            Valor actual: <span style={{ fontFamily: 'monospace', color: 'var(--ft-color-foreground)' }}>{rating} / 5</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Solo lectura (promedio)</p>
          <Rating value={4.5} readOnly showValue size="lg" />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            Promedio: <span style={{ fontFamily: 'monospace', color: 'var(--ft-color-foreground)' }}>4.5 / 5</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {[
            { value: 3, size: 'sm' as const, label: 'sm' },
            { value: 4, size: 'md' as const, label: 'md' },
            { value: 5, size: 'lg' as const, label: 'lg' },
          ].map(({ value, size, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <Rating value={value} size={size} readOnly />
              <span style={{ fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const SoloLectura: Story = {
  name: 'Solo lectura (promedio)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '360px' }}>
      {[
        { value: 5, label: 'Excelente', description: 'Calificación promedio' },
        { value: 4, label: 'Buena', description: 'Calificación promedio' },
        { value: 3, label: 'Regular', description: 'Calificación promedio' },
        { value: 2, label: 'Baja', description: 'Calificación promedio' },
        { value: 1, label: 'Pobre', description: 'Calificación promedio' },
      ].map(({ value, label, description }) => (
        <div key={value} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            {description}: <strong>{label}</strong>
          </p>
          <Rating value={value} readOnly showValue size="md" />
        </div>
      ))}
    </div>
  ),
}
