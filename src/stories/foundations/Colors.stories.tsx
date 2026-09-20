import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

/**
 * Colors — Paleta de colores del Design System
 *
 * Todos los colores derivan de custom properties `--ft-*`.
 * Haz clic en cualquier swatch para copiar el token al portapapeles.
 */

const COLOR_GROUPS = [
  {
    title: 'Colores de marca',
    tokens: [
      { name: 'Primary', var: '--ft-color-primary', description: 'Acciones primarias, enlaces, foco' },
      { name: 'Primary Hover', var: '--ft-color-primary-hover', description: 'Hover de acciones primarias' },
      { name: 'Accent', var: '--ft-color-accent', description: 'Acentos secundarios, éxito de marca' },
      { name: 'Spark', var: '--ft-color-spark', description: 'Novedades, campañas, highlights' },
    ],
  },
  {
    title: 'Estados semánticos',
    tokens: [
      { name: 'Success', var: '--ft-color-success', description: 'Confirmaciones, acciones exitosas' },
      { name: 'Warning', var: '--ft-color-warning', description: 'Advertencias, acciones de precaución' },
      { name: 'Danger', var: '--ft-color-danger', description: 'Errores, acciones destructivas' },
      { name: 'Info', var: '--ft-color-info', description: 'Mensajes informativos, ayuda contextual' },
    ],
  },
  {
    title: 'Superficie y fondo',
    tokens: [
      { name: 'Background', var: '--ft-color-background', description: 'Fondo del canvas principal' },
      { name: 'Surface', var: '--ft-color-surface', description: 'Tarjetas, paneles, contenedores' },
      { name: 'Border', var: '--ft-color-border', description: 'Bordes, divisores, separadores' },
      { name: 'Foreground', var: '--ft-color-foreground', description: 'Texto principal' },
      { name: 'Muted Foreground', var: '--ft-color-muted-foreground', description: 'Texto secundario, placeholders' },
    ],
  },
]

function ColorSwatch({ name, cssVar, description }: { name: string; cssVar: string; description: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(cssVar).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copiar ${cssVar}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--ft-color-border)',
        background: 'var(--ft-color-surface)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
      }}
    >
      <span
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '0.5rem',
          background: `var(${cssVar})`,
          flexShrink: 0,
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--ft-color-foreground)' }}>
          {name}
        </span>
        <code style={{ display: 'block', fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)', fontFamily: 'monospace' }}>
          {cssVar}
        </code>
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)', marginTop: '0.125rem' }}>
          {description}
        </span>
      </span>
      <span style={{
        fontSize: '0.7rem',
        color: copied ? 'var(--ft-color-success)' : 'var(--ft-color-muted-foreground)',
        fontWeight: copied ? 700 : 400,
        transition: 'color 0.2s',
        flexShrink: 0,
      }}>
        {copied ? '✓ Copiado' : '📋 Copiar'}
      </span>
    </button>
  )
}

function ColorsPage() {
  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {COLOR_GROUPS.map((group) => (
        <div key={group.title}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--ft-color-foreground)',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--ft-color-border)',
          }}>
            {group.title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {group.tokens.map((token) => (
              <ColorSwatch key={token.var} name={token.name} cssVar={token.var} description={token.description} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: '1-Foundations/Colors',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Paleta de colores del Design System. Todos son custom properties `--ft-*` que se pueden sobrescribir en `:root` sin fork. Haz clic en cualquier swatch para copiar el token.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Paleta: Story = {
  name: 'Paleta completa',
  render: () => <ColorsPage />,
}
