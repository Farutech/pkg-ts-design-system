import type {
  ChangeEvent,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react'
import type { Density } from '@/tokens/tokens'

// === ENUMS / UNIONS ===
export type InputSize = 'sm' | 'md' | 'lg' | 'xl'
export type InputVariant =
  | 'outline'
  | 'filled'
  | 'flushed'
  | 'borderless'
  | 'underline'
  | 'floating'
  | 'lookup'
export type InputStatus = 'default' | 'error' | 'success' | 'warning' | 'info'
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
export type LabelMode = 'external' | 'floating' | 'placeholder' | 'hidden'
export type ValidationMode = 'block' | 'error' | 'none'
export type SurfaceVariant = 'dark' | 'glass' | 'default'

// === COMPORTAMIENTOS POR TIPO ===
export interface InputBehavior {
  icon?: ReactNode
  validation?: RegExp
  validationMessage?: string
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'url' | 'email' | 'search'
  format?: (value: string) => string
  placeholder?: string
  showClearButton?: boolean
  showPasswordToggle?: boolean
  showStepper?: boolean
}

// === OPCIONES DE BÚSQUEDA / LOOKUP ===
export interface LookupOption {
  value: string
  label: string
  description?: string
  data?: unknown
}

// === CONTRATO PRINCIPAL: INPUT PROPS ===
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'prefix' | 'pattern'> {
  // --- Contenido ---
  /** Label accesible vinculado automáticamente con htmlFor */
  label?: ReactNode
  /** Título o etiqueta elevada personalizada cuando el control está enfocado o con valor (si difiere del label/placeholder en reposo) */
  floatingTitle?: ReactNode
  /** Alias para floatingTitle */
  activeLabel?: ReactNode
  /** Placeholder textual */
  placeholder?: string
  /** Descripción o mensaje de ayuda */
  description?: ReactNode
  /** Mensaje de error (fuerza status='error' y aria-invalid='true') */
  error?: ReactNode
  /** Helper text alternativo (compatibilidad) */
  helperText?: ReactNode
  /** Mensaje informativo o tooltip que aparece en hover */
  tooltip?: ReactNode

  // --- Estado ---
  /** Marca el campo como requerido con asterisco y aria-required */
  required?: boolean
  /** Deshabilita el campo y controles */
  disabled?: boolean
  /** Solo lectura */
  readOnly?: boolean
  /** Estado de validación semántico */
  status?: InputStatus

  // --- Dimensiones y Variantes ---
  /** Tamaño del input ('sm' | 'md' | 'lg' | 'xl') */
  size?: InputSize
  /** Densidad del sistema (comfortable, compact, dense) */
  density?: Density
  /** Variante visual de la superficie y bordes */
  variant?: InputVariant
  /** Modo de presentación de la etiqueta */
  labelMode?: LabelMode
  /** Superficie específica para variantes oscura/vidrio */
  surfaceVariant?: SurfaceVariant
  /** Ancho completo (100%) */
  fullWidth?: boolean

  // --- Comportamiento y Validación ---
  /** Tipo HTML del input (con comportamientos enriquecidos) */
  type?: InputType | string
  /** Regex pattern para validación */
  pattern?: RegExp | string
  /** Modo de validación: 'block' bloquea inválidos, 'error' muestra mensaje */
  validationMode?: ValidationMode
  /** Mensaje personalizado si falla pattern */
  validationMessage?: string

  // --- Secciones y Addons ---
  /** Contenido interno a la izquierda (icono o texto) */
  leftSection?: ReactNode
  /** Contenido interno a la derecha (icono, botón o texto) */
  rightSection?: ReactNode
  leftSectionWidth?: number | string
  rightSectionWidth?: number | string
  leftSectionPointerEvents?: 'auto' | 'none'
  rightSectionPointerEvents?: 'auto' | 'none'

  /** Addon exterior izquierdo (acoplado por fuera del borde) */
  addonBefore?: ReactNode
  /** Addon exterior derecho (acoplado por fuera del borde) */
  addonAfter?: ReactNode
  /** Callback de clic en addonBefore */
  onAddonBeforeClick?: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  /** Callback de clic en addonAfter */
  onAddonAfterClick?: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void

  // --- Utilidades Interactivas ---
  /** Muestra botón para limpiar texto rápidamente (target >= 44px) */
  allowClear?: boolean
  /** Muestra contador de caracteres actuales y límite (requiere maxLength) */
  showCount?: boolean
  /** Toggle de visibilidad de contraseña (target >= 44px) */
  showPasswordToggle?: boolean
  /** Muestra stepper (+/-) para tipo number (target >= 44px) */
  showStepper?: boolean
  step?: number | string
  min?: number | string
  max?: number | string

  // --- Callbacks ---
  /** Callback nativo con ChangeEvent */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /** Callback simplificado con solo el valor string */
  onValueChange?: (value: string) => void

  // --- Props de Búsqueda / Lookup (variant="lookup") ---
  /** Nombre del input hidden para FormData */
  name?: string
  /** Opción seleccionada actualmente en modo lookup */
  lookupValue?: LookupOption | null
  /** Proveedor asíncrono o síncrono de opciones para búsqueda */
  onSearch?: ((query: string) => void) | ((query: string) => Promise<LookupOption[]> | LookupOption[])
  /** Callback cuando se selecciona o limpia una opción de lookup */
  onLookupChange?: (option: LookupOption | null) => void
  /** Abre modal o panel de búsqueda avanzada */
  onAdvancedSearch?: () => void
  /** Etiqueta accesible del botón de búsqueda avanzada */
  advancedSearchLabel?: string
  /** Mínimo de caracteres para buscar en lookup */
  minChars?: number
  /** Debounce de búsqueda en ms */
  debounceMs?: number
  /** Mensaje si no hay resultados */
  emptyMessage?: string

  // --- Props Deprecadas con soporte garantizado ---
  /** @deprecated Utilice `leftSection` */
  prefix?: ReactNode
  /** @deprecated Utilice `rightSection` */
  suffix?: ReactNode
  /** @deprecated Utilice `leftSection` */
  startAdornment?: ReactNode
  /** @deprecated Utilice `rightSection` */
  endAdornment?: ReactNode
  /** @deprecated Utilice `description` o `tooltip` */
  info?: ReactNode
  /** @deprecated Utilice `leftSection` con Icon component */
  icon?: ReactNode
  /** @deprecated Utilice `leftSection` o `rightSection` */
  iconPosition?: 'left' | 'right'
}

// === CONTRATO PARA COMPONENTES DE TRANSICIÓN / DEPRECADOS ===
export interface FloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label: string
  tooltip?: ReactNode
  info?: ReactNode
  error?: ReactNode
  required?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  onValueChange?: (value: string) => void
  surfaceVariant?: SurfaceVariant
  fullWidth?: boolean
}

export interface LookupInputProps {
  label: string
  name?: string
  value?: LookupOption | null
  onChange?: (option: LookupOption | null) => void
  onSearch: (query: string) => Promise<LookupOption[]> | LookupOption[]
  onAdvancedSearch?: () => void
  advancedSearchLabel?: string
  tooltip?: ReactNode
  required?: boolean
  disabled?: boolean
  minChars?: number
  debounceMs?: number
  emptyMessage?: string
  className?: string
}
