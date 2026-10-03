import { useState, useCallback } from 'react'

export interface UseDisclosureProps {
  defaultIsOpen?: boolean
  isOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

/**
 * Hook para gestionar estados de apertura/cierre (modales, drawers, dropdowns)
 * soportando tanto estado controlado como no controlado.
 */
export function useDisclosure(props: UseDisclosureProps = {}) {
  const { defaultIsOpen = false, isOpen: controlledIsOpen, onOpen, onClose } = props
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultIsOpen)

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen

  const open = useCallback(() => {
    if (!isControlled) {
      setUncontrolledIsOpen(true)
    }
    onOpen?.()
  }, [isControlled, onOpen])

  const close = useCallback(() => {
    if (!isControlled) {
      setUncontrolledIsOpen(false)
    }
    onClose?.()
  }, [isControlled, onClose])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return {
    isOpen,
    open,
    close,
    toggle,
    onOpen: open,
    onClose: close,
    onToggle: toggle,
  }
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>
