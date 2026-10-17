/**
 * ============================================================================
 *  Paleta — generación de escalas 50–950 desde UN color + presets
 * ============================================================================
 *
 *  El Design System trae su paleta canónica "de fábrica" (tokens.css). Este
 *  módulo permite al consumidor ADAPTARLA sin fork:
 *
 *    // 1. De un solo color genera la escala completa (11 tonalidades):
 *    <DesignSystemProvider theme={createColorScale('#7c3aed')}>
 *
 *    // 2. O combinar familias con definePalette:
 *    <DesignSystemProvider theme={definePalette({ primary: '#7c3aed', danger: '#e11d48' })}>
 *
 *    // 3. O partir de un preset listo:
 *    <DesignSystemProvider theme={PALETTE_PRESETS.violet}>
 *
 *  El algoritmo trabaja en HSL: mantiene el tono del color base y varía la
 *  luminosidad siguiendo la curva de la escala (50 casi blanco → 950 casi
 *  negro), con saturación levemente decreciente en los extremos. Sin deps.
 *
 *  Regla DRY: este módulo es el ÚNICO lugar donde se definen escalas en TS;
 *  tokens.css replica los valores canónicos (ver CANONICAL_SCALES espejo).
 * ============================================================================
 */
import type { DesignTokens, PaletteFamily, PaletteShade } from './tokens'
import { PALETTE_FAMILIES, PALETTE_SHADES, colorToRgbChannels } from './tokens'

/* ------------------------------------------------------------------ tipos */

export type ColorScaleHex = Record<PaletteShade, string>

export type PartialColorScale = Partial<Record<PaletteShade, string>>

/**
 * Entrada aceptada por `createColorScale`:
 * - hex/rgb/css -> se genera la escala completa (el color es la base / 600)
 * - objeto     -> se usan los tonos provistos y los faltantes se generan
 */
export type ScaleInput = string | PartialColorScale

/* ------------------------------------------------- curva de tonalidades */

/**
 * Luz relativa objetivo por tono (0–1), derivada de la escala Tailwind.
 * La base del usuario se ancla en 600; 50 se acerca a blanco, 950 a negro.
 */
const SHADE_LIGHTNESS: Record<PaletteShade, number> = {
  50: 0.97,
  100: 0.94,
  200: 0.88,
  300: 0.8,
  400: 0.69,
  500: 0.62,
  600: 0.5,
  700: 0.42,
  800: 0.35,
  900: 0.27,
  950: 0.16,
}

/** Saturación relativa (×) — los extremos pierden algo de croma. */
const SHADE_SATURATION_FACTOR: Record<PaletteShade, number> = {
  50: 0.35,
  100: 0.5,
  200: 0.65,
  300: 0.8,
  400: 0.92,
  500: 1,
  600: 1,
  700: 1,
  800: 0.95,
  900: 0.9,
  950: 0.85,
}

/* ------------------------------------------------------- conversores CSS */

/** `#rrggbb` | `#rgb` | `rgb(r g b)` -> `[h, s, l]` (h: 0–360, s/l: 0–1). */
function colorToHsl(input: string): [number, number, number] | undefined {
  const channels = colorToRgbChannels(input)
  if (!channels) return undefined
  const [r8, g8, b8] = channels.split(/\s+/).map((n) => Number(n) / 255)
  const max = Math.max(r8, g8, b8)
  const min = Math.min(r8, g8, b8)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l] // gris

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r8) h = ((g8 - b8) / d + (g8 < b8 ? 6 : 0)) * 60
  else if (max === g8) h = ((b8 - r8) / d + 2) * 60
  else h = ((r8 - g8) / d + 4) * 60
  return [h, s, l]
}

function hueToRgb(p: number, q: number, tRaw: number): number {
  let t = tRaw
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

/** `[h, s, l]` -> `#rrggbb` */
function hslToHex(h: number, s: number, l: number): string {
  if (s === 0) {
    const gray = Math.round(l * 255)
      .toString(16)
      .padStart(2, '0')
    return `#${gray}${gray}${gray}`
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hk = (((h % 360) + 360) % 360) / 360
  const r = Math.round(hueToRgb(p, q, hk + 1 / 3) * 255)
  const g = Math.round(hueToRgb(p, q, hk) * 255)
  const b = Math.round(hueToRgb(p, q, hk - 1 / 3) * 255)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/* ------------------------------------------------------------- generador */

/**
 * Genera una escala completa 50–950 desde un color base.
 *
 * - `string` -> el color queda anclado en el tono 600 y el resto se curva.
 * - `object` -> conserva los tonos provistos y genera solo los faltantes.
 */
export function createColorScale(input: ScaleInput): ColorScaleHex {
  if (typeof input !== 'string') {
    const anchor = input[600] ?? input[500] ?? input[700] ?? '#2563eb'
    const scale = { ...createColorScale(anchor) }
    for (const shade of PALETTE_SHADES) {
      const provided = input[shade]
      if (provided) scale[shade] = provided
    }
    return scale
  }

  const hsl = colorToHsl(input)
  if (!hsl) throw new Error(`createColorScale: color no soportado "${input}"`)
  const [h, s, l] = hsl

  const scale = {} as ColorScaleHex
  for (const shade of PALETTE_SHADES) {
    // 600 conserva exactamente el color base; el resto sigue la curva.
    if (shade === 600) {
      scale[shade] = hslToHex(h, s, l)
      continue
    }
    const targetL = SHADE_LIGHTNESS[shade]
    const targetS = Math.min(1, s * SHADE_SATURATION_FACTOR[shade])
    // Mezcla 85% curva objetivo + 15% intención del base (respeta colores
    // ya muy claros/oscuros que el usuario quiera anclar).
    const blendedL = l + (targetL - l) * 0.85
    scale[shade] = hslToHex(h, targetS, blendedL)
  }
  return scale
}

/** Escala hex -> tokens de sobreescritura (canales RGB) para el provider. */
export function scaleToTokens(
  family: PaletteFamily,
  scale: ColorScaleHex,
): DesignTokens {
  const tokens: DesignTokens = {}
  for (const shade of PALETTE_SHADES) {
    const channels = colorToRgbChannels(scale[shade])
    if (channels) {
      tokens[`${family}${shade}` as keyof DesignTokens] = channels as never
    }
  }
  return tokens
}

const SOFT_BY_FAMILY: Record<string, PaletteFamily> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

/**
 * Combina overrides por familia en un único objeto `DesignTokens` listo para
 * `<DesignSystemProvider theme={...}>`. Cada familia aporta:
 *   - sus 11 tonalidades (`primary500`, `danger100`, ...) como canales RGB
 *   - su semántico (`colorDanger`) anclado al tono 600 (500 para accent)
 *   - su `soft` (`colorDangerSoft`) anclado al tono 100
 *
 *   definePalette({ primary: '#7c3aed', danger: '#e11d48' })
 */
export function definePalette(
  overrides: Partial<Record<PaletteFamily, ScaleInput>>,
): DesignTokens {
  const tokens: DesignTokens = {}

  for (const family of PALETTE_FAMILIES) {
    const input = overrides[family]
    if (!input) continue

    const scale = createColorScale(input)
    Object.assign(tokens, scaleToTokens(family, scale))

    const cap = family.charAt(0).toUpperCase() + family.slice(1)
    const semanticKey = `color${cap}` as keyof DesignTokens
    tokens[semanticKey] = scale[family === 'accent' ? 500 : 600] as never

    if (SOFT_BY_FAMILY[family]) {
      tokens[`color${cap}Soft` as keyof DesignTokens] = scale[100] as never
    }
  }

  return tokens
}

/* --------------------------------------------------------------- presets */

/** Escala canónica por familia — espejo de tokens.css (fuente única TS). */
export const CANONICAL_SCALES: Record<PaletteFamily, ColorScaleHex> = {
  primary: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
    400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
    800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
  },
  secondary: {
    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
    400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
    800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
  },
  accent: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
    400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
    800: '#065f46', 900: '#064e3b', 950: '#022c22',
  },
  success: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
    400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
    800: '#166534', 900: '#14532d', 950: '#052e16',
  },
  warning: {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
    400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
    800: '#92400e', 900: '#78350f', 950: '#451a03',
  },
  danger: {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
    400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
    800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a',
  },
  info: {
    50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
    400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
    800: '#075985', 900: '#0c4a6e', 950: '#082f49',
  },
}

const ROSE_SCALE: ColorScaleHex = {
  50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
  400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
  800: '#9f1239', 900: '#881337', 950: '#4c0519',
}

/**
 * Presets de marca listos para usar — solo sobreescriben `primary` (el resto
 * de familias conserva la paleta canónica):
 *
 *   <DesignSystemProvider theme={PALETTE_PRESETS.violet}>
 */
export const PALETTE_PRESETS = {
  blue: definePalette({ primary: CANONICAL_SCALES.primary }),
  violet: definePalette({ primary: CANONICAL_SCALES.secondary }),
  emerald: definePalette({ primary: CANONICAL_SCALES.accent }),
  rose: definePalette({ primary: ROSE_SCALE }),
  amber: definePalette({ primary: CANONICAL_SCALES.warning }),
} as const

export type PalettePresetName = keyof typeof PALETTE_PRESETS
