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

/**
 * ============================================================================
 *  Escalas de paleta — familias y tonalidades (DRY)
 * ============================================================================
 * Cada familia expone 11 tonalidades (50–950) como custom properties
 * `--ft-<familia>-<tono>` con canales RGB. En tokens de React se escriben
 * planas: `success500`, `danger100`, `secondary950` (camelCase).
 */
export type PaletteFamily =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type PaletteShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950

export const PALETTE_SHADES: readonly PaletteShade[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const

export const PALETTE_FAMILIES: readonly PaletteFamily[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
] as const

/** Claves planas de tonalidad: `success500`, `primary950`, ... */
export type ScaleTokens = {
  [F in PaletteFamily as `${F}${PaletteShade}`]?: string
}

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
  colorSecondary?: string
  colorSecondarySoft?: string
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
} & ScaleTokens

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

/** Claves de la paleta primitiva que Tailwind consume como canales RGB. @deprecated Usa PALETTE_SHADES */
export const PRIMARY_SHADES = PALETTE_SHADES
export type PrimaryShade = PaletteShade

/** camelCase -> `--ft-kebab-case` */
export function tokenToCssVar(key: string): string {
  return `--ft-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`
}

/** `success500` -> `--ft-success-500` | `colorPrimary` -> `--ft-color-primary` */
function scaleKeyToCssVar(key: string): string | undefined {
  const match = /^([a-z]+)(50|100|200|300|400|500|600|700|800|900|950)$/.exec(key)
  if (!match) return undefined
  if (!(PALETTE_FAMILIES as readonly string[]).includes(match[1])) return undefined
  return `--ft-${match[1]}-${match[2]}`
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

/**
 * Traduce overrides de tokens a custom properties inline para el `style` de React.
 *
 * - Tonalidades planas (`success500`, `secondary950`) -> `--ft-success-500` con
 *   canales RGB (habilita `bg-success-500/30` en Tailwind).
 * - Semánticos (`colorSuccess`) -> `--ft-color-success` Y sincronizan su tono
 *   base en la escala (`--ft-success-600`) para que las utilidades sigan el tema.
 */
export function tokensToStyle(tokens: DesignTokens): Record<string, string> {
  const style: Record<string, string> = {}

  /* Semántico -> tono base de su escala (y su hover/soft) */
  const SEMANTIC_SCALE_SYNC: Record<string, readonly [string, PaletteShade]> = {
    colorPrimary: ['primary', 600],
    colorPrimaryHover: ['primary', 700],
    colorPrimarySoft: ['primary', 100],
    colorSecondary: ['secondary', 600],
    colorSecondarySoft: ['secondary', 100],
    colorAccent: ['accent', 500],
    colorSpark: ['warning', 500],
    colorSuccess: ['success', 600],
    colorSuccessSoft: ['success', 100],
    colorWarning: ['warning', 600],
    colorWarningSoft: ['warning', 100],
    colorDanger: ['danger', 600],
    colorDangerSoft: ['danger', 100],
    colorInfo: ['info', 600],
    colorInfoSoft: ['info', 100],
  }

  for (const [key, value] of Object.entries(tokens)) {
    if (value === undefined || value === '') continue

    const channels = colorToRgbChannels(value)
    const scaleVar = scaleKeyToCssVar(key)

    // Tonalidad de escala: emitir canales RGB (`--ft-danger-700`)
    if (scaleVar && channels) {
      style[scaleVar] = channels
      continue
    }
    if (scaleVar) {
      style[scaleVar] = value
      continue
    }

    style[tokenToCssVar(key)] = value

    // El semántico sincroniza su tono base para que Tailwind (bg-danger-600,
    // text-success-700...) siga el mismo override en caliente.
    const sync = SEMANTIC_SCALE_SYNC[key]
    if (sync && channels) style[`--ft-${sync[0]}-${sync[1]}`] = channels
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

