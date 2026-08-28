/**
 * @farutech/design-system — TASK-201 (REQ-DS-01).
 *
 * Tokens + componentes reconciliados. Import recomendado para tree-shaking:
 *   import { Button } from '@farutech/design-system/components/Button'
 *   import '@farutech/design-system/styles.css'
 */
export { DesignSystemProvider, useDesignSystem, type DesignSystemProviderProps, type LinkComponent } from './providers/DesignSystemProvider'
export { tokensToStyle, type DesignTokens } from './tokens/tokens'

export { Button } from './components/Button'
export { Badge, StatusBadge } from './components/Badge'
export { Input } from './components/Input'
export { Alert } from './components/Alert'
export { Spinner } from './components/Spinner'
export { Eyebrow, SectionHeading } from './components/Content'
export { Reveal } from './components/Reveal'
