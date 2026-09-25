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
  { id: 'apple', label: 'Manzana', description: 'Fruta rosada y crujiente' },
  { id: 'banana', label: 'Banana', description: 'Fruta amarilla y dulce' },
  { id: 'orange', label: 'Naranja', description: 'Cítrica y vitamínica' },
  { id: 'grape', label: 'Uva', description: 'Pequeñas Bayas de vino' },
  { id: 'mango', label: 'Mango', description: 'Tropical y jugosa' },
  { id: 'pineapple', label: 'Piña', description: 'Tropical deliciosa' },
  { id: 'strawberry', label: 'Fresa', description: 'Roja y aromática' },
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
          onChange={(nextValue) => setValue(typeof nextValue === 'string' ? nextValue : nextValue[0] ?? '')}
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
          onChange={(nextValue) => setValue(Array.isArray(nextValue) ? nextValue : [nextValue])}
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
          onChange={(nextValue) => setValue(typeof nextValue === 'string' ? nextValue : nextValue[0] ?? '')}
          searchable
          searchPlaceholder="Buscar..."
          minSearchChars={1}
        />
      </div>
    )
  },
}

export const BusquedaApiDebounce: Story = {
  name: 'Búsqueda remota API con Debounce (Anexo C)',
  render: () => {
    const [value, setValue] = useState('')
    const [queryLog, setQueryLog] = useState<string[]>([])

    // Simular API con delay de 400ms
    const handleApiSearch = async (query: string) => {
      setQueryLog((prev) => [...prev.slice(-4), `Consultando API: "${query}"`])
      await new Promise((resolve) => setTimeout(resolve, 400))
      return FRUITS.filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
    }

    return (
      <div style={{ width: '320px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', marginBottom: '0.5rem' }}>
          Aplica debounce de 300ms y descarta consultas previas, ejecutando solo la última consulta (Anexo C).
        </p>
        <ListBox
          label="Búsqueda remota (simulada)"
          options={FRUITS}
          value={value}
          onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
          searchable
          searchPlaceholder="Escribe para consultar API..."
          onSearch={handleApiSearch}
          debounceMs={300}
        />
        {queryLog.length > 0 && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--ft-color-muted)', borderRadius: '6px', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 600 }}>Log de consultas API:</span>
            {queryLog.map((log, i) => (
              <div key={i} style={{ fontFamily: 'monospace' }}>{log}</div>
            ))}
          </div>
        )}
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
