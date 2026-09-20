import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup } from '@/components/ui/RadioGroup'

/**
 * RadioGroup — selector de opciones mutuamente excluyentes.
 *
 * Soporta 3 variantes: default ( radios ), card ( tarjetas con borde ),
 * y button ( botones segmentados ). Orientación horizontal o vertical.
 */
const meta = {
  title: '4-Inputs/RadioGroup',
  component: RadioGroup,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    variant: { control: 'radio', options: ['default', 'card', 'button'] },
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
  },
  args: {
    label: 'Selecciona una opción',
    options: [
      { value: 'option-a', label: 'Opción A', description: 'Descripción de la opción A' },
      { value: 'option-b', label: 'Opción B', description: 'Descripción de la opción B' },
      { value: 'option-c', label: 'Opción C', description: 'Descripción de la opción C' },
    ],
    onChange: () => undefined,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'RadioGroup usando @headlessui/react. 3 variantes visuales, orientación flexible y accesibilidad completa.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default', orientation: 'vertical' },
}

export const Card: Story = {
  name: 'Variante card',
  args: {
    label: 'Selecciona un plan',
    variant: 'card',
    orientation: 'vertical',
    options: [
      { value: 'free', label: 'Gratis', description: 'Funciones básicas para empezar' },
      { value: 'pro', label: 'Pro', description: 'Todas las funciones para equipos' },
      { value: 'enterprise', label: 'Enterprise', description: 'Solución completa a medida' },
    ],
  },
}

export const Button: Story = {
  name: 'Variante button (segmented)',
  args: {
    label: 'Tipo de prueba',
    variant: 'button',
    orientation: 'horizontal',
    options: [
      { value: 'unit', label: 'Unitarias' },
      { value: 'integration', label: 'Integración' },
      { value: 'e2e', label: 'E2E' },
    ],
  },
}

export const ConError: Story = {
  name: 'Con estado de error',
  args: {
    label: 'Tipo de pago',
    variant: 'default',
    error: 'Debes seleccionar al menos una opción',
    options: [
      { value: 'credit', label: 'Tarjeta de crédito' },
      { value: 'debit', label: 'Tarjeta de débito' },
      { value: 'transfer', label: 'Transferencia bancaria' },
    ],
  },
}
