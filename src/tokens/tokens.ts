/**
 * Mapa TS de tokens — tipa los overrides que acepta <DesignSystemProvider theme={...}>.
 * Las claves coinciden 1:1 con las custom properties de tokens.css (sin el prefijo --ft-).
 */
export type DesignTokens = {
  colorBackground?: string
  colorSurface?: string
  colorSurfaceHover?: string
  colorBorder?: string
  colorForeground?: string
  colorMutedForeground?: string
  colorPrimary?: string
  colorPrimaryHover?: string
  colorOnPrimary?: string
  colorAccent?: string
  colorSpark?: string
  colorSuccess?: string
  colorSuccessSoft?: string
  colorWarning?: string
  colorWarningSoft?: string
  colorDanger?: string
  colorDangerSoft?: string
  colorInfo?: string
  colorInfoSoft?: string
  fontSans?: string
  fontMono?: string
  radiusSm?: string
  radiusMd?: string
  radiusLg?: string
  radiusFull?: string
}

/** camelCase -> --ft-kebab-case */
export function tokensToStyle(tokens: DesignTokens): Record<string, string> {
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    if (value === undefined) continue
    const cssVar = `--ft-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`
    style[cssVar] = value
  }
  return style
}
