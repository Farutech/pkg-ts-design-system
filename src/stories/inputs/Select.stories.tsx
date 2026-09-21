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
