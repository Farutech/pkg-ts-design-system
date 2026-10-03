import { useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  children: ReactNode
  /** Contenedor HTML específico donde montar el portal */
  container?: HTMLElement | null
  /** ID del elemento contenedor (si no existe, se crea automáticamente en document.body) */
  containerId?: string
}

function getPortalNode(container?: HTMLElement | null, containerId = 'ft-portal-root'): HTMLElement | null {
  if (typeof document === 'undefined') return null
  if (container) return container

  let node = document.getElementById(containerId)
  if (!node) {
    node = document.createElement('div')
    node.id = containerId
    node.setAttribute('data-ft-portal-container', 'true')
    document.body.appendChild(node)
  }
  return node
}

const emptySubscribe = () => () => {}

/**
 * Portal (Primitiva Headless):
 * Renderiza nodos fuera del flujo DOM actual (útil para Modales, Popovers, Toasts, Tooltips).
 * Es 100% seguro para SSR y no produce fallos de hidratación.
 */
export function Portal({
  children,
  container,
  containerId = 'ft-portal-root',
}: PortalProps) {
  const mountNode = useSyncExternalStore(
    emptySubscribe,
    () => getPortalNode(container, containerId),
    () => null
  )

  if (!mountNode) {
    return null
  }

  return createPortal(children, mountNode)
}
