import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  /** Subtítulo o descripción explicativa bajo el título */
  subtitle?: ReactNode
  description?: ReactNode
  /** Icono representativo en el encabezado del modal */
  icon?: ReactNode
  children: ReactNode
  /** Botones principales del footer (e.g. Cancelar y Guardar) */
  footer?: ReactNode
  /** Acciones auxiliares o secundarias ubicadas en el extremo izquierdo (e.g. Eliminar) */
  extraActions?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  icon,
  children,
  footer,
  extraActions,
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

  const effectiveSubtitle = subtitle || description

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop con desenfoque suave agradable */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 w-full ${sizeClasses[size]} my-8 bg-[#1a1b24] border border-[#333544] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col max-h-[90vh] transform transition-all animate-scaleUp text-slate-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono y subtítulo */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2f3d] bg-[#15161e] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                {title && (
                  <h3 id="modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {title}
                  </h3>
                )}
                {effectiveSubtitle && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate font-normal">
                    {effectiveSubtitle}
                  </p>
                )}
              </div>
            </div>

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

        {/* Footer con distribución de botones básicos y adicionales */}
        {(footer || extraActions) && (
          <div className="px-6 py-4 bg-[#15161e] border-t border-[#2d2f3d] shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {extraActions}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              {footer}
            </div>
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
