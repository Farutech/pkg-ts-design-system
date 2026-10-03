import { useState, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  children: ReactNode
  /** Contenedor HTML específico donde montar el portal */
  container?: HTMLElement | null
  /** ID del elemento contenedor (si no existe, se crea automáticamente en document.body) */
  containerId?: string
}

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
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return

    if (container) {
      setMountNode(container)
      return
    }

    let node = document.getElementById(containerId)
    let created = false

    if (!node) {
      node = document.createElement('div')
      node.id = containerId
      node.setAttribute('data-ft-portal-container', 'true')
      document.body.appendChild(node)
      created = true
    }

    setMountNode(node)

    return () => {
      // Si fue creado dinámicamente y ya no tiene hijos, limpiarlo
      if (created && node && node.childNodes.length === 0 && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }
  }, [container, containerId])

  if (!mountNode) {
    return null
  }

  return createPortal(children, mountNode)
}
