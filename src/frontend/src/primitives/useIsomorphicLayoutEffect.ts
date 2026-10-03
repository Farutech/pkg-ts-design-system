import { useEffect, useLayoutEffect } from 'react'

/**
 * useIsomorphicLayoutEffect:
 * Resuelve el warning de React SSR al usar useLayoutEffect en el servidor.
 * En el cliente ejecuta useLayoutEffect para cálculos antes del pintado;
 * en SSR ejecuta useEffect para evitar advertencias de hidratación.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
