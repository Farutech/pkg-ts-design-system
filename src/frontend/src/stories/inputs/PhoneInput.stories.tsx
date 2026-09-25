import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useState } from 'react'

/**
 * PhoneInput — Input de teléfono con selección de país y código de país automático.
 *
 * Soporta búsqueda de países, validación de patrón, y muestra el dial code.
 */
const meta = {
  title: '4-Inputs/PhoneInput',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input de teléfono con selector de país. Incluye dial code automático, búsqueda de países y validación por patrón.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ConSeleccionDePais: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <PhoneInput
          label="Teléfono de contacto"
          value={value}
          onChange={setValue}
          defaultCountry="CO"
          placeholder="Número de teléfono"
          showSearch
          pattern={/^[0-9]*$/}
        />
        {value && (
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', fontFamily: 'monospace' }}>
            Valor: {value}
          </p>
        )}
      </div>
    )
  },
}

export const ConError: Story = {
  name: 'Con validación de error',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <PhoneInput
          label="Teléfono (solo números)"
          value={value}
          onChange={setValue}
          defaultCountry="MX"
          error="Ingresa solo números"
          pattern={/^[0-9]+$/}
          validationMode="error"
        />
      </div>
    )
  },
}

export const VariosPaises: Story = {
  name: 'Cambio de país por defecto',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px' }}>
      {(['CO', 'US', 'MX', 'ES', 'AR'] as const).map((code) => (
        <PhoneInput
          key={code}
          label={`Teléfono — ${code}`}
          value=""
          onChange={() => {}}
          defaultCountry={code}
          placeholder="Número de teléfono"
        />
      ))}
    </div>
  ),
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Escribe un número y valida que el dial code se anteponga.
 */
export const TestInteraccion: Story = {
  name: 'Test: Escritura e Interacción',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '400px' }}>
        <PhoneInput
          label="Teléfono de prueba"
          value={value}
          onChange={setValue}
          defaultCountry="CO"
          placeholder="Número de teléfono"
        />
        {value && <p style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{value}</p>}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/número de teléfono/i)
    await userEvent.type(input, '3214567890')
    await expect(canvas.getByText('+573214567890')).toBeInTheDocument()
  },
}

/**
 * 3. Test de Accesibilidad y Validación:
 * Verifica etiqueta, dial code visible y mensaje de error.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  render: () => (
    <div style={{ width: '400px' }}>
      <PhoneInput
        label="Teléfono bloqueado"
        value=""
        onChange={() => {}}
        defaultCountry="CO"
        error="Número requerido"
        disabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/teléfono bloqueado/i)).toBeInTheDocument()
    await expect(canvas.getByText('+57')).toBeInTheDocument()
    await expect(canvas.getByText(/número requerido/i)).toBeInTheDocument()
  },
}
