import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '@/components/ui/Select'

const meta = {
  title: '4-Inputs/Select',
  component: Select,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'País de residencia',
    options: [
      { value: '', label: 'Selecciona un país' },
      { value: 'co', label: 'Colombia' },
      { value: 'mx', label: 'México' },
      { value: 'es', label: 'España' },
      { value: 'ar', label: 'Argentina' },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Select nativo accesible con label, error y helper text.' } },
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {}
export const ConError: Story = { name: 'Con error', args: { error: 'Este campo es obligatorio' } }
export const Deshabilitado: Story = { args: { disabled: true } }

export const ConFiltradoInput: Story = {
  name: 'Con input para filtrar (C-11)',
  args: {
    label: 'País (con búsqueda)',
    searchable: true,
    searchPlaceholder: 'Escribe para filtrar países...',
    options: [
      { value: 'co', label: 'Colombia' },
      { value: 'mx', label: 'México' },
      { value: 'es', label: 'España' },
      { value: 'ar', label: 'Argentina' },
      { value: 'cl', label: 'Chile' },
      { value: 'pe', label: 'Perú' },
      { value: 'ec', label: 'Ecuador' },
      { value: 'uy', label: 'Uruguay' },
      { value: 'cr', label: 'Costa Rica' },
      { value: 'pa', label: 'Panamá' },
    ],
  },
}

export const ConDebounceApi: Story = {
  name: 'Llamada a API con Debounce (Anexo C)',
  render: () => {
    const handleSearch = async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 350))
      const allCountries = [
        { value: 'co', label: 'Colombia' },
        { value: 'mx', label: 'México' },
        { value: 'es', label: 'España' },
        { value: 'ar', label: 'Argentina' },
        { value: 'br', label: 'Brasil' },
        { value: 'ca', label: 'Canadá' },
        { value: 'us', label: 'Estados Unidos' },
        { value: 'de', label: 'Alemania' },
        { value: 'fr', label: 'Francia' },
        { value: 'jp', label: 'Japón' },
      ]
      return allCountries.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    }

    return (
      <div style={{ width: '320px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', marginBottom: '0.5rem' }}>
          Permite input para digitar con debounce, ejecutando solo la última consulta remota (Anexo C).
        </p>
        <Select
          label="País (Búsqueda API remota)"
          searchable
          searchPlaceholder="Digita para buscar en API..."
          onSearch={handleSearch}
          debounceMs={300}
        />
      </div>
    )
  },
}
