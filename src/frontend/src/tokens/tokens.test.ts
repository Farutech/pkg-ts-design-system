import { describe, it, expect } from 'vitest'
import {
  tokenToCssVar,
  colorToRgbChannels,
  tokensToStyle,
  tokensToCssText,
  defaultTokens,
  PRIMARY_SHADES,
} from './tokens'

describe('tokens utility', () => {
  it('converts camelCase token keys to kebab-case css variables with --ft- prefix', () => {
    expect(tokenToCssVar('colorPrimary')).toBe('--ft-color-primary')
    expect(tokenToCssVar('colorSurfaceHover')).toBe('--ft-color-surface-hover')
    expect(tokenToCssVar('radiusLg')).toBe('--ft-radius-lg')
  })

  it('converts hex colors to rgb channels correctly', () => {
    expect(colorToRgbChannels('#ffffff')).toBe('255 255 255')
    expect(colorToRgbChannels('#000')).toBe('0 0 0')
    expect(colorToRgbChannels('#2563eb')).toBe('37 99 235')
  })

  it('converts rgb/rgba colors to rgb channels', () => {
    expect(colorToRgbChannels('rgb(10, 20, 30)')).toBe('10 20 30')
    expect(colorToRgbChannels('rgba(10, 20, 30, 0.5)')).toBe('10 20 30')
  })

  it('handles pre-normalized rgb channels and unsupported formats', () => {
    expect(colorToRgbChannels('124 58 237')).toBe('124 58 237')
    expect(colorToRgbChannels('oklch(0.7 0.1 200)')).toBeUndefined()
  })

  it('transforms tokens to inline React style object', () => {
    const style = tokensToStyle({
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#1d4ed8',
      radiusMd: '0.75rem',
      primary500: '#3b82f6',
    })

    expect(style['--ft-color-primary']).toBe('#2563eb')
    expect(style['--ft-primary-600']).toBe('37 99 235')
    expect(style['--ft-color-primary-hover']).toBe('#1d4ed8')
    expect(style['--ft-primary-700']).toBe('29 78 216')
    expect(style['--ft-radius-md']).toBe('0.75rem')
    expect(style['--ft-primary500']).toBe('59 130 246')
  })

  it('generates valid CSS text with selector', () => {
    const css = tokensToCssText({ colorPrimary: '#2563eb' }, ':root')
    expect(css).toContain(':root {')
    expect(css).toContain('--ft-color-primary: #2563eb;')
    expect(css).toContain('--ft-primary-600: 37 99 235;')
  })

  it('exports defaultTokens and PRIMARY_SHADES constants', () => {
    expect(defaultTokens.colorPrimary).toBe('#2563eb')
    expect(PRIMARY_SHADES).toContain(600)
    expect(PRIMARY_SHADES.length).toBe(11)
  })
})
