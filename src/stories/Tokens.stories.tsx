import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DesignTokens } from '@/tokens/tokens'
import { tokensToStyle } from '@/tokens/tokens'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

/**
 * Tabla de colores del Design System — todos derivan de los tokens canónicos
 * `--ft-*`. Cualquier color puede sobreescribirse por app sin fork.
 */
const COLOR_TOKENS: Array<{ name: string; cssVar: string; usage: string }> = [
  { name: 'Primary', cssVar: '--ft-color-primary', usage: 'Acciones primarias, enlaces, foco' },
  { name: 'Primary hover', cssVar: '--ft-color-primary-hover', usage: 'Hover de acciones primarias' },
  { name: 'Accent', cssVar: '--ft-color-accent', usage: 'Acentos secundarios, éxito de marca' },
  { name: 'Spark', cssVar: '--ft-color-spark', usage: 'Novedades, campañas' },
  { name: 'Success', cssVar: '--ft-color-success', usage: 'Confirmaciones' },
  { name: 'Warning', cssVar: '--ft-color-warning', usage: 'Advertencias' },
  { name: 'Danger', cssVar: '--ft-color-danger', usage: 'Errores, acciones destructivas' },
  { name: 'Info', cssVar: '--ft-color-info', usage: 'Mensajes informativos' },
  { name: 'Surface', cssVar: '--ft-color-surface', usage: 'Fondos de tarjetas y paneles' },
  { name: 'Border', cssVar: '--ft-color-border', usage: 'Bordes y divisores' },
  { name: 'Foreground', cssVar: '--ft-color-foreground', usage: 'Texto principal' },
  { name: 'Muted foreground', cssVar: '--ft-color-muted-foreground', usage: 'Texto secundario' },
]

function TokensTable() {
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-semibold">Swatch</th>
            <th className="px-4 py-2 font-semibold">Token</th>
            <th className="px-4 py-2 font-semibold">Uso recomendado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {COLOR_TOKENS.map((token) => (
            <tr key={token.cssVar}>
              <td className="px-4 py-2">
                <span
                  className="inline-block h-8 w-16 rounded-lg border border-gray-200 dark:border-gray-600"
                  style={{ background: `var(${token.cssVar})` }}
                  aria-hidden="true"
                />
              </td>
              <td className="px-4 py-2 font-mono text-xs">{token.cssVar}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{token.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta = {
  title: 'Guía/Tokens',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Los tokens son la fuente única de verdad. Se definen en `src/tokens/tokens.css` como custom properties `--ft-*` y se pueden sobreescribir a nivel `:root`, por subárbol con `DesignSystemProvider theme={...}` o en vivo con los controles de la story **Theming/CustomTheme**.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PaletaDeColores: Story = {
  render: () => <TokensTable />,
}

export const TokensComoCss: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
        {`:root {
  /* Tema de marca (ej. violeta) */
  --ft-color-primary: #7c3aed;
  --ft-color-primary-hover: #6d28d9;
  --ft-primary-600: 124 58 237;   /* canales RGB para utilidades Tailwind */
  --ft-radius-lg: 1rem;           /* radios más suaves */
  --ft-font-sans: 'Outfit', sans-serif;
}`}
      </pre>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        Las utilidades Tailwind (<code className="font-mono">bg-primary-600</code>,{' '}
        <code className="font-mono">text-primary-700</code>…) apuntan a los mismos canales
        <code className="font-mono"> --ft-primary-*</code>, por lo que el tema se propaga a TODA la librería.
      </p>
    </div>
  ),
}

export const PrevisualizacionDeComponentes: Story = {
  render: () => (
    <Card className="w-[28rem]">
      <div className="grid gap-3">
        <p className="m-0 text-sm text-gray-600 dark:text-gray-300">
          Esta tarjeta, botón y badge usan exclusivamente tokens. Cambia el tema en la story{' '}
          <strong>Theming/CustomTheme</strong> y vuelve a verlos aquí.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Acción primaria</Button>
          <Button variant="outline">Secundaria</Button>
          <Badge variant="primary">Nuevo</Badge>
        </div>
      </div>
    </Card>
  ),
}

/** Tokens expuestos para el control en vivo de la story CustomTheme. */
export const DEFAULT_TOKENS_EXAMPLE: DesignTokens = tokensToStyle({
  colorPrimary: '#7c3aed',
})
