import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 w-full ${sizeClasses[size]} my-8 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all animate-scaleUp text-slate-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md shrink-0">
            {title && (
              <h3 id="modal-title" className="text-lg font-bold text-white tracking-tight">
                {title}
              </h3>
            )}
            {closeButton && (
              <button
                type="button"
                aria-label="Cerrar modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 text-slate-200 text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}

export default Modal
