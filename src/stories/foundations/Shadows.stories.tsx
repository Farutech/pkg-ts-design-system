import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * Shadows — Tokens de sombras del Design System
 *
 * Las sombras se combinan con bordes y radios para crear profundidad
 * consistente en tarjetas, modales, tooltips y estados elevados.
 */
const SHADOW_LEVELS = [
  { name: 'xs', cssVar: '--ft-shadow-xs', description: 'Subtle inline hover lift', usage: 'Botones, chips, tags en hover' },
  { name: 'sm', cssVar: '--ft-shadow-sm', description: 'Small elevated surface', usage: 'Dropdown menús, popovers pequeños' },
  { name: 'md', cssVar: '--ft-shadow-md', description: 'Standard card elevation', usage: 'Cards, paneles de contenido' },
  { name: 'lg', cssVar: '--ft-shadow-lg', description: 'Drawer y modal backdrop', usage: 'Drawers, modales, tooltips' },
  { name: 'xl', cssVar: '--ft-shadow-xl', description: 'High elevation for emphasis', usage: 'Floating action buttons, overlays' },
  { name: '2xl', cssVar: '--ft-shadow-2xl', description: 'Max elevation — modales críticos', usage: 'Command palette, diálogos emergentes' },
]

function ShadowCard({ name, cssVar, description, usage }: { name: string; cssVar: string; description: string; usage: string }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--ft-color-border)',
        background: 'var(--ft-color-surface)',
        boxShadow: `var(${cssVar})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '0.5rem',
          background: 'var(--ft-color-primary)',
          marginBottom: '1rem',
          boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
        }}
      />
      <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>
        {name}
      </h3>
      <code style={{ display: 'block', fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
        {cssVar}
      </code>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.8125rem', color: 'var(--ft-color-foreground)' }}>{description}</p>
      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)' }}>{usage}</span>
    </div>
  )
}

function ShadowsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div style={{ padding: '1rem', background: 'var(--ft-color-surface)', borderRadius: '0.5rem', border: '1px solid var(--ft-color-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>
          Hover sobre cada card para ver el efecto de elevación
        </h3>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          Las sombras son custom properties que se pueden sobreescribir en <code>:root</code> o con <code>DesignSystemProvider</code>.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {SHADOW_LEVELS.map((shadow) => (
          <ShadowCard key={shadow.cssVar} {...shadow} />
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: '1-Foundations/Shadows',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Escala de sombras del Design System. Cada nivel tiene un propósito específico: desde elevación sutil en hover hasta modales flotantes.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const EscalaDeSombras: Story = {
  name: 'Escala completa',
  render: () => <ShadowsPage />,
}
