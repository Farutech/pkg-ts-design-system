import { describe, it, expect } from 'vitest'
import {
  createColorScale,
  definePalette,
  scaleToTokens,
  CANONICAL_SCALES,
  PALETTE_PRESETS,
} from '@/tokens/palette'
import { PALETTE_SHADES, tokensToStyle } from '@/tokens/tokens'

describe('paleta — generación de escalas 50–950', () => {
  it('createColorScale genera las 11 tonalidades desde un hex', () => {
    const scale = createColorScale('#2563eb')
    expect(Object.keys(scale)).toHaveLength(11)
    for (const shade of PALETTE_SHADES) {
      expect(scale[shade]).toMatch(/^#[0-9a-f]{6}$/)
    }
    // El color base queda anclado en el 600
    expect(scale[600]).toBe('#2563eb')
  })

  it('la escala generada es monocromática y decreciente en luz', () => {
    const scale = createColorScale('#3b82f6')
    const lightness = PALETTE_SHADES.map((shade) => {
      const [r, g, b] = [
        parseInt(scale[shade].slice(1, 3), 16),
        parseInt(scale[shade].slice(3, 5), 16),
        parseInt(scale[shade].slice(5, 7), 16),
      ]
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    })
    // Estrictamente decreciente de 50 (más claro) a 950 (más oscuro)
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1])
    }
  })

  it('acepta escala parcial y rellena los tonos faltantes', () => {
    const scale = createColorScale({ 500: '#f43f5e' })
    expect(scale[500]).toBe('#f43f5e')
    expect(scale[600]).toMatch(/^#[0-9a-f]{6}$/)
    expect(scale[50]).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('escala hex -> tokens con canales RGB por familia', () => {
    const tokens = scaleToTokens('danger', CANONICAL_SCALES.danger)
    expect(tokens.danger600).toBe('220 38 38')
    expect(tokens.danger100).toBe('254 226 226')
    expect(tokens.danger950).toBe('69 10 10')
  })

  it('definePalette combina familias y ancla semánticos + soft', () => {
    const tokens = definePalette({ danger: '#e11d48' })

    // Semánticos anclados
    expect(tokens.colorDanger).toBe('#e11d48')
    expect(tokens.colorDangerSoft).toMatch(/^#/)
    // Escala completa generada
    expect(tokens.danger500).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/)
    expect(tokens.danger950).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/)
    // No toca familias no provistas
    expect(tokens.colorPrimary).toBeUndefined()
    expect(tokens.primary600).toBeUndefined()
  })

  it('los tokens de definePalette son consumibles por tokensToStyle', () => {
    const tokens = definePalette({ primary: '#7c3aed' })
    const style = tokensToStyle(tokens)
    expect(style['--ft-color-primary']).toBe('#7c3aed')
    expect(style['--ft-primary-600']).toBe('124 58 237')
    expect(style['--ft-color-primary-soft']).toBeDefined()
  })

  it('CANONICAL_SCALES tiene las 7 familias con 11 tonos', () => {
    for (const family of ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info'] as const) {
      expect(Object.keys(CANONICAL_SCALES[family])).toHaveLength(11)
    }
  })

  it('PALETTE_PRESETS exporta 5 presets con primary completo', () => {
    expect(Object.keys(PALETTE_PRESETS)).toEqual([
      'blue',
      'violet',
      'emerald',
      'rose',
      'amber',
    ])
    // Cada preset debe anclar colorPrimary + primary600
    for (const preset of Object.values(PALETTE_PRESETS)) {
      expect(preset.colorPrimary).toMatch(/^#/)
      expect(preset.primary600).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/)
    }
  })
})
