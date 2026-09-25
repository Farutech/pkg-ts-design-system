import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, within } from 'storybook/test'
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
  component: Rating,
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

export const ConDecimalesYMedios: Story = {
  name: 'Decimales (4.3) y Medias Estrellas (C-17 / N-03)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '420px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Valor de BD exacto (4.3 con precisión 'exact')</p>
        <Rating value={4.3} precision="exact" readOnly showValue size="lg" />
        <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          Relleno exacto proporcional del 30% en la 5ta estrella.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Media estrella (4.5 con precisión 0.5)</p>
        <Rating value={4.5} precision={0.5} readOnly showValue size="lg" />
        <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          Redondeo a mitad visual (media estrella).
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Interactivo con medias estrellas (allowHalf)</p>
        <Rating defaultValue={3.5} allowHalf showValue size="lg" />
        <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          Haz clic o hover en la mitad izquierda o derecha de cada estrella.
        </span>
      </div>
    </div>
  ),
}

export const SoloLectura: Story = {
  name: 'Solo lectura (promedio)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '360px' }}>
      {[
        { value: 5, label: 'Excelente', description: 'Calificación promedio' },
        { value: 4.3, label: 'Muy Buena (4.3)', description: 'Calificación promedio con decimal' },
        { value: 3.5, label: 'Buena (3.5)', description: 'Calificación promedio con media estrella' },
        { value: 2, label: 'Baja', description: 'Calificación promedio' },
        { value: 1, label: 'Pobre', description: 'Calificación promedio' },
      ].map(({ value, label, description }) => (
        <div key={value} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            {description}: <strong>{label}</strong>
          </p>
          <Rating value={value} precision="exact" readOnly showValue size="md" />
        </div>
      ))}
    </div>
  ),
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Navega con teclado sobre el radiogroup y valida onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Interacción por Teclado',
  args: {
    onChange: fn(),
  },
  render: (args) => (
    <Rating
      defaultValue={2}
      onChange={args.onChange}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', { name: /calificación: 2 de 5/i })
    await expect(group).toBeInTheDocument()
    fireEvent.keyDown(group, { key: 'ArrowRight' })
    await expect(args.onChange).toHaveBeenCalledWith(2.5)
    await expect(group).toHaveAttribute('aria-label', 'Calificación: 2.5 de 5')
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica etiqueta accesible de solo lectura y valor mostrado.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  render: () => <Rating value={4.5} readOnly showValue />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rating = canvas.getByRole('img', { name: /valoración: 4\.5 de 5 estrellas/i })
    await expect(rating).toBeInTheDocument()
    await expect(rating).toHaveAttribute('aria-label', 'Valoración: 4.5 de 5 estrellas')
  },
}
