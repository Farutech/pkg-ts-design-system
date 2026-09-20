/**
 * Componente Modal reutilizable con Headless UI
 */

import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

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
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-[#111827] text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh]',
                  sizes[size]
                )}
              >
                {(title || closeButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md z-20">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {closeButton && (
                      <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                <div className="px-6 py-5 overflow-y-auto flex-1 overscroll-contain text-slate-700 dark:text-slate-300">
                  {children}
                </div>

                {footer && (
                  <div className="px-6 py-4 bg-slate-50/90 dark:bg-[#0b0f19]/90 border-t border-slate-200 dark:border-slate-800 shrink-0 sticky bottom-0 z-20 flex items-center justify-end gap-3 backdrop-blur-md">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>

            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
