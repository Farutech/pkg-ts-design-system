import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * Icons — Galería de @heroicons/react disponibles en el Design System
 *
 * Usa la misma librería de iconos que todos los componentes internos.
 * Disponible en variantes outline (24px) y solid (24px).
 */

import { useState } from 'react'
import * as OutlineIcons from '@heroicons/react/24/outline'
import * as SolidIcons from '@heroicons/react/24/solid'

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>

function IconGallery({ icons, filter }: { icons: Record<string, IconComponent>; filter: string }) {
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const filteredEntries = Object.entries(icons).filter(([name]) =>
    name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleCopy = (name: string, variant: 'outline' | 'solid') => {
    const importStr = `import { ${name} } from '@heroicons/react/24/${variant}'`
    navigator.clipboard.writeText(importStr)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 1500)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.5rem' }}>
      {filteredEntries.map(([name, Icon]) => (
        <button
          key={name}
          onClick={() => handleCopy(name, 'outline')}
          title={`Copiar import de ${name}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.75rem 0.5rem',
            borderRadius: '0.5rem',
            border: `1px solid ${copiedName === name ? 'var(--ft-color-success)' : 'var(--ft-color-border)'}`,
            background: copiedName === name ? 'rgba(var(--ft-success-600), 0.05)' : 'var(--ft-color-surface)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--ft-color-foreground)' }} />
          <span style={{
            fontSize: '0.55rem',
            color: 'var(--ft-color-muted-foreground)',
            textAlign: 'center',
            lineHeight: 1.3,
            wordBreak: 'break-all',
          }}>
            {name.replace(/Icon$/, '')}
          </span>
        </button>
      ))}
    </div>
  )
}

function IconsPage({ filter = '', variant = 'outline' }: { filter?: string; variant?: 'outline' | 'solid' }) {
  const icons = variant === 'outline' ? OutlineIcons : SolidIcons
  const count = Object.keys(icons).filter(name =>
    name.toLowerCase().includes(filter.toLowerCase())
  ).length

  return (
    <div style={{ maxWidth: '900px' }}>
      <p style={{ color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Mostrando <strong>{count}</strong> de {Object.keys(icons).length} íconos.
        Haz clic en cualquier ícono para copiar su import al portapapeles.
      </p>
      <IconGallery icons={icons as Record<string, IconComponent>} filter={filter} />
    </div>
  )
}

const meta = {
  title: '1-Foundations/Icons',
  argTypes: {
    filter: {
      control: 'text',
      description: 'Filtrar por nombre del ícono',
    },
    variant: {
      control: 'radio',
      options: ['outline', 'solid'],
      description: 'Variante del ícono',
    },
  },
  args: {
    filter: '',
    variant: 'outline',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Galería completa de `@heroicons/react`. Haz clic en cualquier ícono para copiar su import. Usa el control **filter** para buscar por nombre.',
      },
    },
  },
} satisfies Meta<{ filter: string; variant: 'outline' | 'solid' }>

export default meta
type Story = StoryObj<typeof meta>

export const Outline: Story = {
  args: { variant: 'outline', filter: '' },
  render: (args) => <IconsPage {...args} />,
}

export const Solid: Story = {
  args: { variant: 'solid', filter: '' },
  render: (args) => <IconsPage {...args} />,
}

export const Busqueda: Story = {
  name: 'Búsqueda de íconos',
  args: { filter: 'chart', variant: 'outline' },
  render: (args) => <IconsPage {...args} />,
}
