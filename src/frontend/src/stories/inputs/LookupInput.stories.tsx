import type { Meta, StoryObj } from '@storybook/react-vite'
import { LookupInput, type LookupOption } from '@/components/ui/LookupInput'
import { useState } from 'react'

const sampleClients: LookupOption[] = [
  { value: '1', label: 'Restaurante El Carbon', description: 'NIT: 900.123.456-1 · Cali' },
  { value: '2', label: 'Carniceria La Granja', description: 'NIT: 800.654.321-2 · Palmira' },
  { value: '3', label: 'Salsamentaria Los Andes', description: 'NIT: 901.888.777-3 · Yumbo' },
  { value: '4', label: 'Peluqueria & Spa Bella', description: 'NIT: 1144.999.000-4 · Cali Sur' },
  { value: '5', label: 'Maderas y Cuchillas Industriales', description: 'NIT: 890.333.222-5 · Jamundi' },
]

const meta = {
  title: '2-Inputs/LookupInput',
  component: LookupInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input de busqueda avanzada y autocompletado para entidades (clientes, items, terceros) con debounce, soporte para teclado (Enter, Esc, flechas) y modal de busqueda avanzada.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Etiqueta flotante del input',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita la interaccion del campo',
    },
    required: {
      control: 'boolean',
      description: 'Marca el campo como requerido con asterisco',
    },
    debounceMs: {
      control: 'number',
      description: 'Tiempo de espera en milisegundos antes de consultar',
    },
    minChars: {
      control: 'number',
      description: 'Minimo de caracteres para disparar la busqueda',
    },
    emptyMessage: {
      control: 'text',
      description: 'Mensaje mostrado si no hay resultados',
    },
    advancedSearchLabel: {
      control: 'text',
      description: 'Tooltip del boton de busqueda avanzada',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para el contenedor',
    },
  },
  args: {
    label: 'Buscar cliente por nombre o NIT',
    required: true,
    disabled: false,
    debounceMs: 150,
    minChars: 1,
    emptyMessage: 'No se encontraron clientes registrados',
    advancedSearchLabel: 'Abrir busqueda avanzada de clientes',
  },
} as Meta<any>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: (args) => {
    return <LookupControlledDemo {...args} />
  },
}

function LookupControlledDemo(props: any) {
  const [selected, setSelected] = useState<LookupOption | null>(null)

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    return sampleClients.filter(
      (c) => c.label.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
    )
  }

  return (
    <div className="w-[480px] space-y-3">
      <LookupInput
        {...props}
        value={selected}
        onChange={setSelected}
        onSearch={handleSearch}
        onAdvancedSearch={() => alert('Boton de busqueda avanzada presionado. Abre modal de catalogo.')}
      />
      {selected && (
        <div className="p-3 bg-violet-950/30 border border-violet-500/30 rounded-xl text-xs text-violet-200">
          <strong>Seleccion actual:</strong> {selected.label} ({selected.description})
        </div>
      )}
    </div>
  )
}

export const ConValorInicial: Story = {
  name: 'Con Seleccion Previa',
  render: (args) => {
    return (
      <div className="w-[480px]">
        <LookupInput label="Cliente Seleccionado" {...args} value={sampleClients[0]}
          onSearch={(query) => {
            const q = query.toLowerCase()
            return sampleClients.filter((c) => c.label.toLowerCase().includes(q))
          }}
        />
      </div>
    )
  },
}
