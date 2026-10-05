import { forwardRef } from 'react'
import { Input } from './Input'
import type { LookupInputProps, LookupOption } from './input/types'

export type { LookupInputProps, LookupOption }

/**
 * LookupInput
 * 
 * @deprecated LookupInput ha sido unificado en el componente `Input`.
 * Utilice `<Input variant="lookup" label="..." onSearch={...} />` en su lugar.
 * Este wrapper garantiza retrocompatibilidad al 100% sin breaking changes.
 */
export const LookupInput = forwardRef<HTMLInputElement, LookupInputProps>(
  ({ value, onChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        variant="lookup"
        lookupValue={value}
        onLookupChange={onChange}
        {...props}
      />
    )
  }
)

LookupInput.displayName = 'LookupInput'
