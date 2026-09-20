import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * Typography — Escala tipográfica del Design System
 *
 * La fuente base es Inter (variable), con fallback a system-ui.
 * Controlada por el token `--ft-font-sans`.
 */

const SCALE = [
  { class: 'text-xs', size: '0.75rem / 12px', label: 'Extra Small', usage: 'Captions, notas al pie, badges' },
  { class: 'text-sm', size: '0.875rem / 14px', label: 'Small', usage: 'Etiquetas de inputs, metadata, tooltips' },
  { class: 'text-base', size: '1rem / 16px', label: 'Base', usage: 'Texto de cuerpo por defecto' },
  { class: 'text-lg', size: '1.125rem / 18px', label: 'Large', usage: 'Párrafos destacados, lead text' },
  { class: 'text-xl', size: '1.25rem / 20px', label: 'XL', usage: 'Subtítulos de sección menores' },
  { class: 'text-2xl', size: '1.5rem / 24px', label: '2XL', usage: 'Títulos de card, h3' },
  { class: 'text-3xl', size: '1.875rem / 30px', label: '3XL', usage: 'Títulos de sección, h2' },
  { class: 'text-4xl', size: '2.25rem / 36px', label: '4XL', usage: 'Títulos de página, h1' },
  { class: 'text-5xl', size: '3rem / 48px', label: '5XL', usage: 'Hero headings, displays' },
]

const WEIGHTS = [
  { class: 'font-normal', value: 400, label: 'Normal' },
  { class: 'font-medium', value: 500, label: 'Medium' },
  { class: 'font-semibold', value: 600, label: 'Semibold' },
  { class: 'font-bold', value: 700, label: 'Bold' },
  { class: 'font-extrabold', value: 800, label: 'Extrabold' },
]

function TypographyScale() {
  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ft-color-foreground)', borderBottom: '1px solid var(--ft-color-border)', paddingBottom: '0.5rem' }}>
        Escala de tamaños
      </h2>
      {SCALE.map(({ class: cls, size, label, usage }) => (
        <div key={cls} style={{
          display: 'grid',
          gridTemplateColumns: '8rem 1fr',
          gap: '1rem',
          alignItems: 'baseline',
          padding: '1rem',
          borderRadius: '0.5rem',
          background: 'var(--ft-color-surface)',
          border: '1px solid var(--ft-color-border)',
        }}>
          <div>
            <code style={{ fontSize: '0.7rem', color: 'var(--ft-color-primary)' }}>{cls}</code>
            <div style={{ fontSize: '0.65rem', color: 'var(--ft-color-muted-foreground)', marginTop: '0.125rem' }}>{size}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--ft-color-muted-foreground)', marginTop: '0.125rem', fontStyle: 'italic' }}>{usage}</div>
          </div>
          <span className={cls} style={{ color: 'var(--ft-color-foreground)', lineHeight: 1.2 }}>
            {label} — El diseño importa
          </span>
        </div>
      ))}

      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ft-color-foreground)', borderBottom: '1px solid var(--ft-color-border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
        Pesos tipográficos
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {WEIGHTS.map(({ class: cls, value, label }) => (
          <div key={cls} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'var(--ft-color-surface)',
            border: '1px solid var(--ft-color-border)',
          }}>
            <code style={{ width: '5rem', fontSize: '0.7rem', color: 'var(--ft-color-primary)', flexShrink: 0 }}>{cls}</code>
            <span style={{ width: '2.5rem', fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)', flexShrink: 0 }}>{value}</span>
            <span className={cls} style={{ fontSize: '1.25rem', color: 'var(--ft-color-foreground)' }}>
              {label} — FaruTech Design System
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ft-color-foreground)', borderBottom: '1px solid var(--ft-color-border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
        Familias tipográficas
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { token: '--ft-font-sans', family: 'Inter, system-ui, sans-serif', label: 'Sans (base)' },
          { token: '--ft-font-mono', family: 'JetBrains Mono, monospace', label: 'Mono (código)' },
        ].map(({ token, family, label }) => (
          <div key={token} style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            background: 'var(--ft-color-surface)',
            border: '1px solid var(--ft-color-border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ft-color-foreground)' }}>{label}</span>
              <code style={{ fontSize: '0.7rem', color: 'var(--ft-color-primary)' }}>{token}</code>
            </div>
            <p style={{ margin: 0, fontFamily: `var(${token})`, fontSize: '1rem', color: 'var(--ft-color-muted-foreground)' }}>
              {family}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontFamily: `var(${token})`, fontSize: '0.875rem', color: 'var(--ft-color-foreground)' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: '1-Foundations/Typography',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Escala tipográfica basada en Tailwind CSS. La familia de fuentes base es Inter con fallback system-ui. Controlada por el token `--ft-font-sans`.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const EscalaCompleta: Story = {
  name: 'Escala completa',
  render: () => <TypographyScale />,
}
