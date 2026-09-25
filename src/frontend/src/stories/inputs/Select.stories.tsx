import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
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

/**
 * 2. Test de Funcionalidad e Interacción:
 * Selecciona una opción del select nativo y valida el evento onChange.
 */
export const TestInteraccion: Story = {
  name: 'Test: Selección e Interacción',
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: /país de residencia/i })
    await userEvent.selectOptions(select, 'mx')
    await expect(select).toHaveValue('mx')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * 3. Test de Accesibilidad y Roles ARIA:
 * Verifica etiqueta accesible, mensaje de error y estado deshabilitado.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  args: {
    label: 'País bloqueado',
    disabled: true,
    error: 'Selección requerida',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: /país bloqueado/i })
    await expect(select).toBeInTheDocument()
    await expect(select).toBeDisabled()
    await expect(canvas.getByText(/selección requerida/i)).toBeInTheDocument()
  },
}

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
