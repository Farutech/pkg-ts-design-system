import type { ComponentType, SVGProps } from 'react'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: IconSize
  className?: string
  title?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

/**
 * Contrato de Adapter Semántico de Iconos FaruTech:
 * Permite cambiar de librería de iconos (Heroicons, Lucide, Phosphor, custom SVG)
 * sin modificar ningún componente interno del Design System.
 */
export interface IconAdapter {
  ChevronDown: ComponentType<IconProps>
  ChevronUp: ComponentType<IconProps>
  ChevronLeft: ComponentType<IconProps>
  ChevronRight: ComponentType<IconProps>
  ChevronUpDown: ComponentType<IconProps>
  Clear: ComponentType<IconProps>
  Close: ComponentType<IconProps>
  Eye: ComponentType<IconProps>
  EyeOff: ComponentType<IconProps>
  Search: ComponentType<IconProps>
  Spinner: ComponentType<IconProps>
  Check: ComponentType<IconProps>
  Warning: ComponentType<IconProps>
  Info: ComponentType<IconProps>
  Error: ComponentType<IconProps>
  Menu: ComponentType<IconProps>
  More: ComponentType<IconProps>
  Plus: ComponentType<IconProps>
  Minus: ComponentType<IconProps>
  Copy: ComponentType<IconProps>
  ExternalLink: ComponentType<IconProps>
  Filter: ComponentType<IconProps>
  Sort: ComponentType<IconProps>
  SortAsc: ComponentType<IconProps>
  SortDesc: ComponentType<IconProps>
  Calendar: ComponentType<IconProps>
  Clock: ComponentType<IconProps>
  User: ComponentType<IconProps>
  Upload: ComponentType<IconProps>
  Download: ComponentType<IconProps>
  Trash: ComponentType<IconProps>
  Edit: ComponentType<IconProps>
  Help: ComponentType<IconProps>
  Refresh: ComponentType<IconProps>
  Document: ComponentType<IconProps>
  Home: ComponentType<IconProps>
  Success: ComponentType<IconProps>
  Loading: ComponentType<IconProps>
}

export type IconName = keyof IconAdapter

/** Resuelve clases de tamaño Tailwind o dimensiones inline */
export function resolveIconSize(size: IconSize = 'md'): { className?: string; style?: React.CSSProperties } {
  if (typeof size === 'number') {
    return { style: { width: `${size}px`, height: `${size}px` } }
  }

  switch (size) {
    case 'xs':
      return { className: 'h-3.5 w-3.5' }
    case 'sm':
      return { className: 'h-4 w-4' }
    case 'md':
      return { className: 'h-5 w-5' }
    case 'lg':
      return { className: 'h-6 w-6' }
    case 'xl':
      return { className: 'h-7 w-7' }
    default:
      if (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem') || size.endsWith('em'))) {
        return { style: { width: size, height: size } }
      }
      return { className: 'h-5 w-5' }
  }
}
