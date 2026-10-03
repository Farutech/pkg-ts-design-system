import React from 'react'
import type { IconName, IconProps } from './IconAdapter'
import { useIconAdapter } from './IconContext'
import { defaultHeroiconsAdapter } from './defaultHeroiconsAdapter'

export interface DynamicIconProps extends IconProps {
  name: IconName
}

/**
 * Componente dinámico de icono:
 * `<Icon name="Search" size="sm" />`
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const adapter = useIconAdapter()
  const IconComponent = adapter[name] ?? defaultHeroiconsAdapter[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent {...props} />
}

function createSemanticIcon(name: IconName) {
  const SemanticIconComponent = (props: IconProps) => {
    const adapter = useIconAdapter()
    const Component = adapter[name] ?? defaultHeroiconsAdapter[name]
    return <Component {...props} />
  }
  SemanticIconComponent.displayName = `Icon.${name}`
  return SemanticIconComponent
}

/**
 * Namespace semántico unificado de Iconos del Design System:
 * Uso ergonómico: `<Icon.ChevronDown />`, `<Icon.Clear />`, `<Icon.Search />`, etc.
 */
export const Icon = Object.assign(DynamicIcon, {
  ChevronDown: createSemanticIcon('ChevronDown'),
  ChevronUp: createSemanticIcon('ChevronUp'),
  ChevronLeft: createSemanticIcon('ChevronLeft'),
  ChevronRight: createSemanticIcon('ChevronRight'),
  ChevronUpDown: createSemanticIcon('ChevronUpDown'),
  Clear: createSemanticIcon('Clear'),
  Close: createSemanticIcon('Close'),
  Eye: createSemanticIcon('Eye'),
  EyeOff: createSemanticIcon('EyeOff'),
  Search: createSemanticIcon('Search'),
  Spinner: createSemanticIcon('Spinner'),
  Check: createSemanticIcon('Check'),
  Warning: createSemanticIcon('Warning'),
  Info: createSemanticIcon('Info'),
  Error: createSemanticIcon('Error'),
  Menu: createSemanticIcon('Menu'),
  More: createSemanticIcon('More'),
  Plus: createSemanticIcon('Plus'),
  Minus: createSemanticIcon('Minus'),
  Copy: createSemanticIcon('Copy'),
  ExternalLink: createSemanticIcon('ExternalLink'),
  Filter: createSemanticIcon('Filter'),
  Sort: createSemanticIcon('Sort'),
  SortAsc: createSemanticIcon('SortAsc'),
  SortDesc: createSemanticIcon('SortDesc'),
  Calendar: createSemanticIcon('Calendar'),
  Clock: createSemanticIcon('Clock'),
  User: createSemanticIcon('User'),
  Upload: createSemanticIcon('Upload'),
  Download: createSemanticIcon('Download'),
  Trash: createSemanticIcon('Trash'),
  Edit: createSemanticIcon('Edit'),
  Help: createSemanticIcon('Help'),
  Refresh: createSemanticIcon('Refresh'),
  Document: createSemanticIcon('Document'),
  Home: createSemanticIcon('Home'),
  Success: createSemanticIcon('Success'),
  Loading: createSemanticIcon('Loading'),
})
