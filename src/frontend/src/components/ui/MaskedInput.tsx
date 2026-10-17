import { forwardRef, useMemo } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input, type LabelMode, type InputSize } from './Input'
import type { MaskConfig, MaskType } from '@/hooks/useMaskedValue'

export type PredefinedMask = 
  | 'phone-co'          // +57 xxx xxx xxxx
  | 'phone-us'          // (xxx) xxx-xxxx
  | 'phone-intl'        // +xx xxx xxx xxxx
  | 'date-dmy'          // DD/MM/YYYY
  | 'date-mdy'          // MM/DD/YYYY
  | 'time-24'           // HH:MM
  | 'time-12'           // HH:MM AM/PM
  | 'credit-card'       // xxxx xxxx xxxx xxxx
  | 'credit-card-exp'   // MM/YY
  | 'credit-card-cvv'   // xxx
  | 'ssn'               // xxx-xx-xxxx
  | 'zip-code'          // xxxxx or xxxxx-xxxx
  | 'currency-cop'      // $x,xxx,xxx
  | 'currency-usd'      // $x,xxx.xx
  | 'percentage'        // xx.xx%
  | 'custom'

const PREDEFINED_ENGINES: Record<PredefinedMask, MaskConfig> = {
  'phone-co': {
    type: 'phone',
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 10)
      if (!c) return ''
      if (c.length <= 3) return `+57 ${c}`
      if (c.length <= 6) return `+57 ${c.slice(0, 3)} ${c.slice(3)}`
      return `+57 ${c.slice(0, 3)} ${c.slice(3, 6)} ${c.slice(6, 10)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 10),
  },
  'phone-us': {
    type: 'phone',
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 10)
      if (!c) return ''
      if (c.length <= 3) return `(${c}`
      if (c.length <= 6) return `(${c.slice(0, 3)}) ${c.slice(3)}`
      return `(${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 10)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 10),
  },
  'phone-intl': {
    type: 'phone',
    format: (val) => val ? `+${val.replace(/\D/g, '')}` : '',
    parse: (val) => val.replace(/\D/g, ''),
  },
  'date-dmy': {
    type: 'date',
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 8)
      if (!c) return ''
      if (c.length <= 2) return c
      if (c.length <= 4) return `${c.slice(0, 2)}/${c.slice(2)}`
      return `${c.slice(0, 2)}/${c.slice(2, 4)}/${c.slice(4, 8)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 8),
  },
  'date-mdy': {
    type: 'date',
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 8)
      if (!c) return ''
      if (c.length <= 2) return c
      if (c.length <= 4) return `${c.slice(0, 2)}/${c.slice(2)}`
      return `${c.slice(0, 2)}/${c.slice(2, 4)}/${c.slice(4, 8)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 8),
  },
  'time-24': {
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 4)
      if (!c) return ''
      if (c.length <= 2) return c
      return `${c.slice(0, 2)}:${c.slice(2, 4)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 4),
  },
  'time-12': {
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 4)
      if (!c) return ''
      if (c.length <= 2) return c
      return `${c.slice(0, 2)}:${c.slice(2, 4)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 4),
  },
  'credit-card': {
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 16)
      return c.match(/.{1,4}/g)?.join(' ') || c
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 16),
  },
  'credit-card-exp': {
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 4)
      if (c.length <= 2) return c
      return `${c.slice(0, 2)}/${c.slice(2, 4)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 4),
  },
  'credit-card-cvv': {
    format: (val) => val.replace(/\D/g, '').slice(0, 4),
    parse: (val) => val.replace(/\D/g, '').slice(0, 4),
  },
  'ssn': {
    format: (val) => {
      const c = val.replace(/\D/g, '').slice(0, 9)
      if (c.length <= 3) return c
      if (c.length <= 5) return `${c.slice(0, 3)}-${c.slice(3)}`
      return `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5, 9)}`
    },
    parse: (val) => val.replace(/\D/g, '').slice(0, 9),
  },
  'zip-code': {
    format: (val) => val.replace(/\D/g, '').slice(0, 5),
    parse: (val) => val.replace(/\D/g, '').slice(0, 5),
  },
  'currency-cop': {
    type: 'currency',
    format: (val) => {
      const c = val.replace(/\D/g, '')
      return c ? `$ ${Number(c).toLocaleString('es-CO')}` : ''
    },
    parse: (val) => val.replace(/\D/g, ''),
  },
  'currency-usd': {
    type: 'currency',
    format: (val) => {
      const c = val.replace(/[^\d.]/g, '')
      if (!c) return ''
      const parts = c.split('.')
      const intPart = parseInt(parts[0] || '0', 10).toLocaleString('en-US')
      return parts.length > 1 ? `$${intPart}.${parts[1].slice(0, 2)}` : `$${intPart}`
    },
    parse: (val) => val.replace(/[^\d.]/g, ''),
  },
  'percentage': {
    type: 'percent',
    format: (val) => {
      const c = val.replace(/[^\d.]/g, '')
      return c ? `${c}%` : ''
    },
    parse: (val) => val.replace(/[^\d.]/g, ''),
  },
  'custom': {
    format: (val) => val,
    parse: (val) => val,
  },
}

export interface MaskedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  size?: InputSize
  mask?: PredefinedMask
  customMask?: string
  customFormatter?: (value: string) => string
  customUnformatter?: (formatted: string) => string
  maskChar?: string
  value?: string
  onChange?: (unmaskedValue: string, formattedValue: string) => void
  label?: string
  floatingTitle?: string
  labelMode?: LabelMode
  description?: string
  error?: string
  helperText?: string
  required?: boolean
  unmaskOnFocus?: boolean
  showValidationIcon?: boolean
}

/**
 * MaskedInput - Componente de entrada con máscara y dato transparente en foco (Focus Unmasked / Blur Formatted).
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask = 'phone-co',
      customFormatter,
      customUnformatter,
      value,
      onChange,
      unmaskOnFocus = true,
      labelMode,
      ...props
    },
    ref
  ) => {
    const activeEngine = useMemo<MaskConfig>(() => {
      const base = PREDEFINED_ENGINES[mask] || PREDEFINED_ENGINES.custom
      return {
        type: base.type || 'custom',
        format: customFormatter || base.format,
        parse: customUnformatter || base.parse,
        unmaskOnFocus,
      }
    }, [mask, customFormatter, customUnformatter, unmaskOnFocus])

    return (
      <Input
        ref={ref}
        value={value}
        mask={activeEngine}
        unmaskOnFocus={unmaskOnFocus}
        labelMode={labelMode}
        onValueChange={(clean, formatted) => {
          if (onChange) {
            onChange(clean, formatted || clean)
          }
        }}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
