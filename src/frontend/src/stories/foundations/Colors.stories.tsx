import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CANONICAL_SCALES, PALETTE_PRESETS, definePalette } from '@/tokens/palette'
import type { PaletteFamily } from '@/tokens/tokens'

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
      { name: 'Secondary', var: '--ft-color-secondary', description: 'Acciones secundarias, acentos de marca' },
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
  tags: ['autodocs'],
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

/* ==========================================================================
   Escalas — 7 familias × 11 tonalidades (50–950)
   ========================================================================== */

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const FAMILIES: PaletteFamily[] = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']

function ScalesPage() {
  return (
    <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {FAMILIES.map((family) => (
        <div key={family}>
          <h2 style={{
            fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem',
            color: 'var(--ft-color-foreground)', textTransform: 'capitalize',
          }}>
            {family}
          </h2>
          <div style={{ display: 'flex', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--ft-color-border)' }}>
            {SHADES.map((shade) => {
              const cssVar = `--ft-${family}-${shade}`
              return (
                <div
                  key={shade}
                  title={`${cssVar} — #${CANONICAL_SCALES[family][shade]}`}
                  style={{
                    flex: 1, height: '3rem', display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'center', background: `var(${cssVar})`, cursor: 'pointer',
                  }}
                  onClick={() => navigator.clipboard.writeText(cssVar)}
                >
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 600, padding: '0.15rem 0',
                    color: shade >= 600 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.55)',
                  }}>
                    {shade}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export const Escalas: Story = {
  name: 'Escalas 50–950',
  parameters: {
    docs: {
      description: {
        story:
          'Cada familia (primary, secondary, accent, success, warning, danger, info) expone 11 tonalidades como canales RGB (`--ft-<familia>-<tono>`), habilitando utilidades como `bg-danger-700/30` en Tailwind.',
      },
    },
  },
  render: () => <ScalesPage />,
}

/* ==========================================================================
   Presets de marca + definePalette — sobreescritura de primary sin fork
   ========================================================================== */

const PRESET_NAMES = Object.keys(PALETTE_PRESETS) as Array<keyof typeof PALETTE_PRESETS>

function PresetRow({ name, theme }: { name: string; theme: Parameters<typeof DesignSystemProvider>[0]['theme'] }) {
  return (
    <DesignSystemProvider theme={theme}>
      <div style={{
        border: '1px solid var(--ft-color-border)', borderRadius: '0.75rem',
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
        background: 'var(--ft-color-surface)',
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'capitalize' }}>{name}</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button size="sm">Primario</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Badge variant="primary">Badge</Badge>
        </div>
        <div style={{ display: 'flex', height: '1.25rem', borderRadius: '0.25rem', overflow: 'hidden' }}>
          {SHADES.map((shade) => (
            <div key={shade} style={{ flex: 1, background: `var(--ft-primary-${shade})` }} />
          ))}
        </div>
      </div>
    </DesignSystemProvider>
  )
}

function PresetsPage() {
  return (
    <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {PRESET_NAMES.map((name) => (
        <PresetRow key={name} name={name} theme={PALETTE_PRESETS[name]} />
      ))}
    </div>
  )
}

export const Presets: Story = {
  name: 'Presets de marca',
  parameters: {
    docs: {
      description: {
        story:
          'Listos para usar: `<DesignSystemProvider theme={PALETTE_PRESETS.violet}>`. Cada preset reemplaza la familia primary completa (11 tonos + semánticos) manteniendo el resto de la paleta.',
      },
    },
  },
  render: () => <PresetsPage />,
}

const BASE_COLORS = ['#7c3aed', '#e11d48', '#0d9488', '#ea580c'] as const

function DefinePalettePage() {
  return (
    <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {BASE_COLORS.map((hex) => (
        <PresetRow key={hex} name={`definePalette({ primary: ${hex} })`} theme={definePalette({ primary: hex })} />
      ))}
    </div>
  )
}

export const GenerarDesdeUnColor: Story = {
  name: 'definePalette (un color → 11 tonos)',
  parameters: {
    docs: {
      description: {
        story:
          '`createColorScale(hex)` genera la escala 50–950 en HSL desde UN color base (sin dependencias). `definePalette` la convierte en tokens y ancla los semánticos (colorPrimary, soft, ...).',
      },
    },
  },
  render: () => <DefinePalettePage />,
}
