/**
 * ============================================================================
 *  Mapa TS de los tokens del Design System
 * ============================================================================
 *
 *  Las claves camelCase se traducen 1:1 a custom properties CSS
 *  (`colorPrimary` -> `--ft-color-primary`), por lo que
 *  `<DesignSystemProvider theme={{ colorPrimary: '#7c3aed' }}>` tematiza
 *  cualquier subárbol sin fork del paquete.
 *
 *  Tematización "viva" de toda la librería (incluidas las utilidades Tailwind
 *  `bg-primary-600`, `text-primary-700`, ...):
 *    - `colorPrimary`       -> `--ft-color-primary` + canales `--ft-primary-600`
 *    - `colorPrimaryHover`  -> `--ft-color-primary-hover` + canales `--ft-primary-700`
 *    - `primary50..primary950` -> canales de la paleta primitiva (acepta hex,
 *      `rgb(...)` o canales ya normalizados `"124 58 237"`)
 *
 *  Regla: los valores no convertibles a canales RGB se aplican igualmente al
 *  token semántico (compatible con `oklch()`, `color-mix()`, `var()`).
 * ============================================================================
 */

export type DesignTokens = {
  /* ---------------------------------------------------------------- superficie */
  colorBackground?: string
  colorSurface?: string
  colorSurfaceHover?: string
  colorSurfaceRaised?: string
  colorBorder?: string
  colorBorderStrong?: string
  colorForeground?: string
  colorMutedForeground?: string
  colorOverlay?: string

  /* ---------------------------------------------------------------------- marca */
  colorPrimary?: string
  colorPrimaryHover?: string
  colorPrimarySoft?: string
  colorOnPrimary?: string
  colorAccent?: string
  colorSpark?: string

  /* ------------------------------------------------------------------- feedback */
  colorSuccess?: string
  colorSuccessSoft?: string
  colorWarning?: string
  colorWarningSoft?: string
  colorDanger?: string
  colorDangerSoft?: string
  colorInfo?: string
  colorInfoSoft?: string

  /* -------------------------------------------- paleta primitiva (canales RGB) */
  primary50?: string
  primary100?: string
  primary200?: string
  primary300?: string
  primary400?: string
  primary500?: string
  primary600?: string
  primary700?: string
  primary800?: string
  primary900?: string
  primary950?: string

  /* ----------------------------------------------------------------- tipografía */
  fontSans?: string
  fontMono?: string
  textXs?: string
  textSm?: string
  textMd?: string
  textLg?: string
  textXl?: string

  /* -------------------------------------------------------------------- radios */
  radiusSm?: string
  radiusMd?: string
  radiusLg?: string
  radiusXl?: string
  radiusFull?: string

  /* ------------------------------------------------------------------ sombras */
  shadowSm?: string
  shadowMd?: string
  shadowLg?: string
  shadowXl?: string

  /* ---------------------------------------------------------------- densidad */
  densityRowHeight?: string
  densityInputHeight?: string
  densityPaddingX?: string
  densityPaddingY?: string
  densityFontSize?: string
  densityGap?: string
}

export type Density = 'comfortable' | 'compact' | 'dense'

export interface DensityTokens {
  rowHeight: string
  inputHeight: string
  paddingX: string
  paddingY: string
  fontSize: string
  gap: string
}

export const DENSITY_PRESETS: Record<Density, DensityTokens> = {
  comfortable: {
    rowHeight: '3.5rem',
    inputHeight: '2.75rem',
    paddingX: '1rem',
    paddingY: '0.625rem',
    fontSize: '1rem',
    gap: '0.75rem',
  },
  compact: {
    rowHeight: '2.75rem',
    inputHeight: '2.25rem',
    paddingX: '0.75rem',
    paddingY: '0.375rem',
    fontSize: '0.875rem',
    gap: '0.5rem',
  },
  dense: {
    rowHeight: '2rem',
    inputHeight: '1.75rem',
    paddingX: '0.5rem',
    paddingY: '0.25rem',
    fontSize: '0.75rem',
    gap: '0.375rem',
  },
}

/** Convierte una densidad en custom properties CSS */
export function densityToStyle(density: Density = 'compact'): Record<string, string> {
  const preset = DENSITY_PRESETS[density] ?? DENSITY_PRESETS.compact
  return {
    '--ft-density': density,
    '--ft-density-row-height': preset.rowHeight,
    '--ft-density-input-height': preset.inputHeight,
    '--ft-density-padding-x': preset.paddingX,
    '--ft-density-padding-y': preset.paddingY,
    '--ft-density-font-size': preset.fontSize,
    '--ft-density-gap': preset.gap,
  }
}

/** Claves de la paleta primitiva que Tailwind consume como canales RGB. */
export const PRIMARY_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type PrimaryShade = (typeof PRIMARY_SHADES)[number]

/** camelCase -> `--ft-kebab-case` */
export function tokenToCssVar(key: string): string {
  return `--ft-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`
}

/**
 * Convierte un color a canales RGB ("124 58 237").
 * Acepta `#rgb`, `#rrggbb`, `#rrggbbaa` y `rgb(r g b)` / `rgb(r, g, b)`.
 * Devuelve `undefined` cuando el formato no es convertible (p. ej. `oklch()`).
 */
export function colorToRgbChannels(value: string): string | undefined {
  const input = value.trim()

  const hex = input.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    const raw = hex[1]
    const expanded =
      raw.length === 3 || raw.length === 4
        ? raw
            .slice(0, 3)
            .split('')
            .map((c) => c + c)
            .join('')
        : raw.slice(0, 6)
    const r = Number.parseInt(expanded.slice(0, 2), 16)
    const g = Number.parseInt(expanded.slice(2, 4), 16)
    const b = Number.parseInt(expanded.slice(4, 6), 16)
    return `${r} ${g} ${b}`
  }

  const rgb = input.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i)
  if (rgb) {
    return `${Math.round(Number(rgb[1]))} ${Math.round(Number(rgb[2]))} ${Math.round(Number(rgb[3]))}`
  }

  // Ya viene como canales normalizados ("37 99 235")
  if (/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/.test(input)) return input

  return undefined
}

/** Traduce overrides de tokens a custom properties inline para el `style` de React. */
export function tokensToStyle(tokens: DesignTokens): Record<string, string> {
  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(tokens)) {
    if (value === undefined || value === '') continue

    const isPrimaryScale = /^primary(50|100|200|300|400|500|600|700|800|900|950)$/.test(key)
    const channels = colorToRgbChannels(value)

    if (isPrimaryScale && channels) {
      // Canales para que Tailwind aplique opacidad: bg-primary-600/30
      style[tokenToCssVar(key)] = channels
      continue
    }

    style[tokenToCssVar(key)] = value

    // El color semántico principal sincroniza la paleta primitiva para que las
    // utilidades Tailwind (bg-primary-600, text-primary-700...) sigan el tema.
    if (key === 'colorPrimary' && channels) style['--ft-primary-600'] = channels
    if (key === 'colorPrimaryHover' && channels) style['--ft-primary-700'] = channels
  }

  return style
}

/** Texto CSS listo para inyectar en una hoja de estilos (útil en apps/SSR). */
export function tokensToCssText(tokens: DesignTokens, selector = ':root'): string {
  const declarations = Object.entries(tokensToStyle(tokens))
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n')
  return `${selector} {\n${declarations}\n}`
}

type DefaultTokenKeys =
  | 'colorPrimary'
  | 'colorPrimaryHover'
  | 'colorOnPrimary'
  | 'colorAccent'
  | 'colorSpark'
  | 'radiusMd'
  | 'fontSans'

/** Paleta por defecto del Design System (espejo de tokens.css) — docs y tests. */
export const defaultTokens: Required<Pick<DesignTokens, DefaultTokenKeys>> = {
  colorPrimary: '#2563eb',
  colorPrimaryHover: '#1d4ed8',
  colorOnPrimary: '#ffffff',
  colorAccent: '#10b981',
  colorSpark: '#f59e0b',
  radiusMd: '0.5rem',
  fontSans: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
}

