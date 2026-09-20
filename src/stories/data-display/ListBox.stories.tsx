import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListBox } from '@/components/ui/ListBox'
import { useState } from 'react'

/**
 * ListBox — lista de opciones seleccionables con búsqueda y modo múltiple.
 *
 * Soporta búsqueda inline, opciones con iconos, modo single/multiple,
 * estados de loading y validación de error.
 */
const FRUITS = [
  { id: 'apple', label: 'Manzana', description: 'Fruta rosada y crujiente', icon: null },
  { id: 'banana', label: 'Banana', description: 'Fruta amarilla y dulce', icon: null },
  { id: 'orange', label: 'Naranja', description: 'Cítrica y vitamínica', icon: null },
  { id: 'grape', label: 'Uva', description: 'Pequeñas Bayas de vino', icon: null },
  { id: 'mango', label: 'Mango', description: 'Tropical y jugosa', icon: null },
  { id: 'pineapple', label: 'Piña', description: 'Tropical deliciosa', icon: null },
  { id: 'strawberry', label: 'Fresa', description: 'Roja y aromática', icon: null },
]

const meta = {
  title: '5-Data Display/ListBox',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lista de opciones seleccionables con búsqueda inline, modo single/multiple, estados de loading y validación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SingleSelection: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '280px' }}>
        <ListBox
          label="Selecciona una fruta"
          options={FRUITS}
          value={value}
          onChange={setValue}
          placeholder="Elige una opción..."
        />
        {value && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            Seleccionado: <span style={{ fontFamily: 'monospace' }}>{value}</span>
          </p>
        )}
      </div>
    )
  },
}

export const MultipleSelection: Story = {
  name: 'Selección múltiple',
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <div style={{ width: '280px' }}>
        <ListBox
          label="Frutas favoritas (múltiples)"
          options={FRUITS}
          value={value}
          onChange={setValue}
          multiple
          allowDeselect
          placeholder="Elige varias opciones..."
        />
        {value.length > 0 && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
            {value.length} seleccionado(s): <span style={{ fontFamily: 'monospace' }}>{value.join(', ')}</span>
          </p>
        )}
      </div>
    )
  },
}

export const ConBusqueda: Story = {
  name: 'Con búsqueda',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '280px' }}>
        <ListBox
          label="Buscar fruta"
          options={FRUITS}
          value={value}
          onChange={setValue}
          searchable
          searchPlaceholder="Buscar..."
          minSearchChars={1}
        />
      </div>
    )
  },
}

export const ConError: Story = {
  name: 'Con estado de error',
  render: () => (
    <div style={{ width: '280px' }}>
      <ListBox
        label="Selecciona una opción"
        options={FRUITS}
        value=""
        onChange={() => {}}
        error="Debes seleccionar al menos una opción"
      />
    </div>
  ),
}
