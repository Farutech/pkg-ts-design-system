import React from 'react'
import { Switch, type SwitchProps } from '@/components/ui/Switch'

export interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'danger' | 'warning'
}

/**
 * Toggle
 * @deprecated Utilice el componente accesible `<Switch />` de `@farutech/design-system/components/ui`.
 * Este shim garantiza retrocompatibilidad al 100% hasta v2.0.0.
 */
export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  color = 'primary',
  ...rest
}) => {
  const mappedColor: SwitchProps['color'] = color === 'danger' ? 'error' : color
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      color={mappedColor}
      {...rest}
    />
  )
}

export default Toggle
