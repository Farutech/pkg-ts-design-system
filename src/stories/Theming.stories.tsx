import type { Meta, StoryObj } from '@storybook/react-vite'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'

/**
 * Theming en vivo — el requisito clave: personalizar la librería SIN fork.
 *
 * Los controles de abajo mutan los tokens de este subárbol a través de
 * `<DesignSystemProvider theme={...}>`. Todo lo renderizado dentro (componentes
 * ft-*, utilidades Tailwind y radios) responde en caliente.
 */
interface CustomThemeArgs {
  colorPrimary: string
  colorPrimaryHover: string
  colorAccent: string
  radiusLg: number
  fontSans: string
}

function ThemePreview({ args }: { args: CustomThemeArgs }) {
  const tokens = {
    colorPrimary: args.colorPrimary,
    colorPrimaryHover: args.colorPrimaryHover,
    colorAccent: args.colorAccent,
    radiusLg: `${args.radiusLg}rem`,
    fontSans: args.fontSans,
  }

  return (
    <div className="w-full max-w-3xl">
      <DesignSystemProvider theme={tokens}>
        <div className="grid gap-6 rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Guardar cambios</Button>
            <Button variant="outline">Cancelar</Button>
            <Button variant="ghost">Descartar</Button>
            <Badge variant="primary">Plan Pro</Badge>
            <Chip variant="primary" onDelete={() => undefined}>
              Farutech
            </Chip>
          </div>

          <Card>
            <div className="grid gap-4">
              <Slider value={72} onChange={() => undefined} label="Progreso del onboarding" formatValue={(v) => `${v}%`} />
              <SegmentedControl
                value="mensual"
                onChange={() => undefined}
                options={[
                  { value: 'mensual', label: 'Mensual' },
                  { value: 'anual', label: 'Anual' },
                  { value: 'empresarial', label: 'Empresarial' },
                ]}
              />
              <Alert variant="info" title="Tokens aplicados">
                Primary <code>{args.colorPrimary}</code> · Radius <code>{args.radiusLg}rem</code> · Fuente{' '}
                <code>{args.fontSans.split(',')[0]}</code>
              </Alert>
            </div>
          </Card>
        </div>
      </DesignSystemProvider>
    </div>
  )
}

const PRESETS = {
  Farutech: { colorPrimary: '#2563eb', colorPrimaryHover: '#1d4ed8', colorAccent: '#10b981' },
  Violeta: { colorPrimary: '#7c3aed', colorPrimaryHover: '#6d28d9', colorAccent: '#f59e0b' },
  Esmeralda: { colorPrimary: '#059669', colorPrimaryHover: '#047857', colorAccent: '#3b82f6' },
  Coral: { colorPrimary: '#f43f5e', colorPrimaryHover: '#e11d48', colorAccent: '#8b5cf6' },
} as const

const meta = {
  title: 'Guía/Theming',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Cambia los controles y observa cómo botones, chips, slider, segmented control y radios se actualizan al instante. En las apps reales, los mismos valores van en `<DesignSystemProvider theme={{ ... }}>` o en `:root { --ft-color-primary: ... }`.',
      },
    },
  },
} satisfies Meta<CustomThemeArgs>

export default meta
type Story = StoryObj<typeof meta>

export const CustomTheme: Story = {
  name: 'CustomTheme (en vivo)',
  argTypes: {
    colorPrimary: { control: 'color', description: 'Color de acciones primarias y foco' },
    colorPrimaryHover: { control: 'color', description: 'Hover de las acciones primarias' },
    colorAccent: { control: 'color', description: 'Color de acento (links, badges)' },
    radiusLg: { control: { type: 'range', min: 0, max: 2, step: 0.125 }, description: 'Radio grande (rem)' },
    fontSans: {
      control: 'select',
      options: [
        'Inter, sans-serif',
        'Outfit, sans-serif',
        "'JetBrains Mono', monospace",
        'Georgia, serif',
      ],
      description: 'Familia tipográfica base',
    },
  },
  args: {
    colorPrimary: PRESETS.Farutech.colorPrimary,
    colorPrimaryHover: PRESETS.Farutech.colorPrimaryHover,
    colorAccent: PRESETS.Farutech.colorAccent,
    radiusLg: 0.75,
    fontSans: 'Inter, sans-serif',
  },
  render: (args) => <ThemePreview args={args} />,
}

export const PresetsDeMarca: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
      {Object.entries(PRESETS).map(([name, preset]) => (
        <DesignSystemProvider
          key={name}
          theme={{ colorPrimary: preset.colorPrimary, colorPrimaryHover: preset.colorPrimaryHover, colorAccent: preset.colorAccent }}
        >
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <span className="text-sm font-semibold">{name}</span>
            <div className="flex items-center gap-2">
              <Button size="sm">Primario</Button>
              <Badge variant="primary">Badge</Badge>
              <span
                className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-900"
                style={{ background: 'var(--ft-color-primary)' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </DesignSystemProvider>
      ))}
    </div>
  ),
}
