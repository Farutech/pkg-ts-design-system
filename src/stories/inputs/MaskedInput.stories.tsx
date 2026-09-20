import type { Meta, StoryObj } from '@storybook/react-vite'
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
