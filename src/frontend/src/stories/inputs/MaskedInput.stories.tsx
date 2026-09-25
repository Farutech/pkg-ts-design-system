import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { MaskedInput } from '@/components/ui/MaskedInput'
import { useState } from 'react'

/**
 * MaskedInput — Input con máscara de formato automático.
 *
 * Soporta máscaras predefinidas y personalizadas.
 * La validación se aplica en tiempo real.
 */
const meta = {
  title: '4-Inputs/MaskedInput',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input con formato automático por máscara. Máscaras predefinidas para teléfono, fecha, tarjeta, moneda y más.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const EjemplosPredefinidos: Story = {
  render: () => {
    const [phoneCo, setPhoneCo] = useState('')
    const [phoneUs, setPhoneUs] = useState('')
    const [date, setDate] = useState('')
    const [creditCard, setCreditCard] = useState('')
    const [currency, setCurrency] = useState('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '380px' }}>
        <MaskedInput
          label="Teléfono Colombia"
          mask="phone-co"
          value={phoneCo}
          onChange={(value) => setPhoneCo(value)}
          placeholder="+57 321 456 7890"
        />
        <MaskedInput
          label="Teléfono USA"
          mask="phone-us"
          value={phoneUs}
          onChange={(value) => setPhoneUs(value)}
          placeholder="(555) 123-4567"
        />
        <MaskedInput
          label="Fecha de nacimiento"
          mask="date-dmy"
          value={date}
          onChange={(value) => setDate(value)}
          placeholder="DD/MM/YYYY"
        />
        <MaskedInput
          label="Tarjeta de crédito"
          mask="credit-card"
          value={creditCard}
          onChange={(value) => setCreditCard(value)}
          placeholder="1234 5678 9012 3456"
        />
        <MaskedInput
          label="Monto en COP"
          mask="currency-cop"
          value={currency}
          onChange={(value) => setCurrency(value)}
          placeholder="$1.234.567"
        />
        <pre style={{ fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)', fontFamily: 'monospace', background: 'var(--ft-color-surface)', padding: '0.5rem', borderRadius: '0.25rem' }}>
          {`phoneCo: "${phoneCo}"\ndate: "${date}"\ncreditCard: "${creditCard}"\ncurrency: "${currency}"`}
        </pre>
      </div>
    )
  },
}

export const MáscaraPersonalizada: Story = {
  name: 'Máscara personalizada',
  render: () => {
    const [code, setCode] = useState('')
    return (
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <MaskedInput
          label="Código interno (9 dígitos)"
          mask="custom"
          customMask="###-###-###"
          maskChar="#"
          value={code}
          onChange={(value) => setCode(value)}
          placeholder="123-456-789"
        />
        <MaskedInput
          label="Placa vehicular"
          mask="custom"
          customMask="***-####"
          maskChar="*"
          value=""
          onChange={() => {}}
          placeholder="ABC-1234"
        />
      </div>
    )
  },
}

/**
 * 2. Test de Funcionalidad e Interacción:
 * Escribe dígitos de tarjeta y valida el formateo automático.
 */
export const TestInteraccion: Story = {
  name: 'Test: Formateo e Interacción',
  render: () => {
    const [card, setCard] = useState('')
    return (
      <div style={{ width: '360px' }}>
        <MaskedInput
          label="Tarjeta de prueba"
          mask="credit-card"
          value={card}
          onChange={(value) => setCard(value)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /tarjeta de prueba/i })
    await userEvent.type(input, '1234567890123456')
    await expect(input).toHaveValue('1234 5678 9012 3456')
  },
}

/**
 * 3. Test de Accesibilidad y Validación:
 * Verifica etiqueta, error externo y estado deshabilitado.
 */
export const TestAccesibilidad: Story = {
  name: 'Test: Accesibilidad y ARIA',
  render: () => (
    <div style={{ width: '360px' }}>
      <MaskedInput
        label="Documento bloqueado"
        mask="credit-card-cvv"
        maskChar="#"
        value=""
        onChange={() => {}}
        error="Campo requerido"
        disabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /documento bloqueado/i })
    await expect(input).toBeInTheDocument()
    await expect(input).toBeDisabled()
    await expect(input).not.toHaveAttribute('maskchar')
    await expect(canvas.getByText(/campo requerido/i)).toBeInTheDocument()
  },
}
