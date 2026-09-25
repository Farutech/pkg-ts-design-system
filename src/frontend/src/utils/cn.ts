/**
 * `cn()` — combinador de clases oficial del Design System.
 *
 * Combina `clsx` (condicionales) con `tailwind-merge` (resolución de conflictos)
 * para que el `className` del consumidor SIEMPRE gane sobre los estilos de
 * variante/tamaño del componente:
 *
 * ```tsx
 * <Button variant="primary" className="bg-red-500" />  // gana bg-red-500
 * <Card className="rounded-none" />                    // gana rounded-none
 * ```
 *
 * Se amplía tailwind-merge con los grupos propios del Design System
 * (rounded-ft-*, shadow-ft*, z-<capa>) para que también se resuelvan.
 */
import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: [{ 'rounded-ft': ['sm', 'md', 'lg', 'xl', 'full'] }],
      shadow: [{ 'shadow-ft': ['', 'sm', 'lg', 'xl'] }],
      z: [{ z: ['dropdown', 'sticky', 'overlay', 'modal', 'popover', 'toast', 'tooltip'] }],
    },
  },
})

/** Une clases resolviendo conflictos de Tailwind (última gana). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
