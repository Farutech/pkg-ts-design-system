/**
 * Tokens de Entrada (Input, Textarea, Select, etc.) - Sistema de Diseño Farutech
 * Centraliza colores semánticos, espaciados, dimensiones de altura y estados visuales.
 */

export const inputColorTokens = {
  surface: {
    default: 'var(--ft-color-surface, #ffffff)',
    hover: 'var(--ft-color-surface-hover, #f9fafb)',
    disabled: 'var(--ft-color-surface-disabled, #f9fafb)',
    readonly: 'var(--ft-color-surface-readonly, rgba(249, 250, 251, 0.8))',
    dark: 'var(--ft-dark-color-surface, #141414)',
    darkHover: 'var(--ft-dark-color-surface-hover, #1f1f1f)',
  },
  border: {
    default: 'var(--ft-color-border, #d1d5db)',
    focus: 'var(--ft-color-primary, #2563eb)',
    error: 'var(--ft-color-danger, #ef4444)',
    success: 'var(--ft-color-success, #22c55e)',
    warning: 'var(--ft-color-warning, #f59e0b)',
    disabled: 'var(--ft-color-border-disabled, #d1d5db)',
    dark: 'var(--ft-dark-color-border, #2a2a2a)',
    darkHover: 'var(--ft-dark-color-border-strong, #3f3f46)',
  },
  text: {
    default: 'var(--ft-color-foreground, #111827)',
    placeholder: 'var(--ft-color-text-placeholder, #9ca3af)',
    error: 'var(--ft-color-danger, #ef4444)',
    success: 'var(--ft-color-success, #16a34a)',
    warning: 'var(--ft-color-warning, #d97706)',
    disabled: 'var(--ft-color-muted-foreground, #9ca3af)',
    muted: 'var(--ft-color-muted-foreground, #6b7280)',
  },
  icon: {
    default: 'var(--ft-color-icon-default, #9ca3af)',
    error: 'var(--ft-color-danger, #ef4444)',
    success: 'var(--ft-color-success, #22c55e)',
    warning: 'var(--ft-color-warning, #f59e0b)',
  },
  ring: {
    focus: 'var(--ft-ring-color, rgba(37, 99, 235, 0.2))',
    error: 'rgba(239, 68, 68, 0.2)',
    success: 'rgba(34, 197, 94, 0.2)',
    warning: 'rgba(245, 158, 11, 0.2)',
  },
} as const

export const inputSpacingTokens = {
  paddingX: {
    sm: 'var(--ft-spacing-2, 0.5rem)',
    md: 'var(--ft-spacing-3, 0.75rem)',
    lg: 'var(--ft-spacing-4, 1rem)',
    xl: 'var(--ft-spacing-5, 1.25rem)',
  },
  paddingY: {
    sm: 'var(--ft-spacing-1-5, 0.375rem)',
    md: 'var(--ft-spacing-2, 0.5rem)',
    lg: 'var(--ft-spacing-2-5, 0.625rem)',
    xl: 'var(--ft-spacing-3, 0.75rem)',
  },
} as const

export const inputSizeTokens = {
  sm: {
    height: '2rem', // 32px
    fontSize: '0.75rem', // 12px
    radius: '0.25rem', // 4px
    paddingX: '0.625rem', // 10px
  },
  md: {
    height: '2.25rem', // 36px
    fontSize: '0.875rem', // 14px
    radius: '0.375rem', // 6px
    paddingX: '0.75rem', // 12px
  },
  lg: {
    height: '2.5rem', // 40px
    fontSize: '1rem', // 16px
    radius: '0.5rem', // 8px
    paddingX: '1rem', // 16px
  },
  xl: {
    height: '3rem', // 48px
    fontSize: '1.125rem', // 18px
    radius: '0.75rem', // 12px
    paddingX: '1.25rem', // 20px
  },
} as const

export const inputStateTokens = {
  error: {
    icon: 'Error',
    color: inputColorTokens.border.error,
    textColor: inputColorTokens.text.error,
    ringColor: inputColorTokens.ring.error,
  },
  success: {
    icon: 'Check',
    color: inputColorTokens.border.success,
    textColor: inputColorTokens.text.success,
    ringColor: inputColorTokens.ring.success,
  },
  warning: {
    icon: 'Warning',
    color: inputColorTokens.border.warning,
    textColor: inputColorTokens.text.warning,
    ringColor: inputColorTokens.ring.warning,
  },
} as const
