import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * Spacing — Escala de espaciado
 *
 * Basada en la escala estándar de Tailwind (4px base unit).
 */

const SPACING_SCALE = [
  { token: 'space-1', tailwind: 'p-1 / m-1', value: '4px / 0.25rem' },
  { token: 'space-2', tailwind: 'p-2 / m-2', value: '8px / 0.5rem' },
  { token: 'space-3', tailwind: 'p-3 / m-3', value: '12px / 0.75rem' },
  { token: 'space-4', tailwind: 'p-4 / m-4', value: '16px / 1rem' },
  { token: 'space-5', tailwind: 'p-5 / m-5', value: '20px / 1.25rem' },
  { token: 'space-6', tailwind: 'p-6 / m-6', value: '24px / 1.5rem' },
  { token: 'space-8', tailwind: 'p-8 / m-8', value: '32px / 2rem' },
  { token: 'space-10', tailwind: 'p-10 / m-10', value: '40px / 2.5rem' },
  { token: 'space-12', tailwind: 'p-12 / m-12', value: '48px / 3rem' },
  { token: 'space-16', tailwind: 'p-16 / m-16', value: '64px / 4rem' },
  { token: 'space-20', tailwind: 'p-20 / m-20', value: '80px / 5rem' },
  { token: 'space-24', tailwind: 'p-24 / m-24', value: '96px / 6rem' },
]

const RADII = [
  { token: '--ft-radius-sm', label: 'sm', value: '0.25rem', usage: 'Badges, tags pequeños' },
  { token: '--ft-radius-md', label: 'md', value: '0.375rem', usage: 'Inputs, dropdowns' },
  { token: '--ft-radius-lg', label: 'lg', value: '0.5rem', usage: 'Cards, paneles' },
  { token: '--ft-radius-xl', label: 'xl', value: '0.75rem', usage: 'Modales, drawers' },
  { token: '--ft-radius-2xl', label: '2xl', value: '1rem', usage: 'Heroes, contenedores grandes' },
  { token: '--ft-radius-full', label: 'full', value: '9999px', usage: 'Avatares, pills, badges circulares' },
]

function SpacingPage() {
  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ft-color-foreground)', borderBottom: '1px solid var(--ft-color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          Escala de espaciado (4px base)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SPACING_SCALE.map(({ token, tailwind, value }) => {
            const px = parseInt(value.split('px')[0])
            return (
              <div key={token} style={{
                display: 'grid',
                gridTemplateColumns: '8rem 12rem 1fr',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'var(--ft-color-surface)',
                border: '1px solid var(--ft-color-border)',
              }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--ft-color-primary)' }}>{tailwind}</code>
                <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>{value}</span>
                <div style={{
                  height: '1.25rem',
                  width: `${Math.min(px * 1.5, 300)}px`,
                  background: 'linear-gradient(90deg, var(--ft-color-primary), var(--ft-color-accent))',
                  borderRadius: '0.25rem',
                  opacity: 0.7,
                }} />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ft-color-foreground)', borderBottom: '1px solid var(--ft-color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          Radios de borde
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {RADII.map(({ token, label, value, usage }) => (
            <div key={token} style={{
              padding: '1rem',
              background: 'var(--ft-color-surface)',
              border: '1px solid var(--ft-color-border)',
              borderRadius: `var(${token}, ${value})`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{
                width: '100%',
                height: '3rem',
                background: 'linear-gradient(135deg, var(--ft-color-primary), var(--ft-color-accent))',
                borderRadius: `var(${token}, ${value})`,
                opacity: 0.8,
              }} />
              <code style={{ fontSize: '0.7rem', color: 'var(--ft-color-primary)' }}>{token}</code>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ft-color-foreground)' }}>radius-{label} ({value})</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>{usage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: '1-Foundations/Spacing',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Escala de espaciado basada en 4px (Tailwind standard) y radios de borde controlados por tokens `--ft-radius-*`.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const EscalaDeEspaciado: Story = {
  name: 'Espaciado y radios',
  render: () => <SpacingPage />,
}
