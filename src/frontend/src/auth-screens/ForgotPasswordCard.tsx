/**
 * ForgotPasswordCard - Componente modular de recuperación de credenciales
 * Puede incrustarse en modales, drawers o contenedores de layout.
 */

import React, { useState, type ReactNode, type FormEvent } from 'react'
import { cn } from '@/utils/cn'
import { Input, Button, Alert } from '@/components/ui'
import type { LabelMode } from '@/tokens/inputTypes'
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export interface ForgotPasswordCardProps {
  /** Callback para procesar la recuperación de contraseña */
  onSubmit: (values: { email: string }) => Promise<any>
  /** Callback tras envío exitoso */
  onSuccess?: (payload: any) => void
  /** Callback al pulsar botón 'Volver al login' */
  onBack?: () => void
  /** Acción o botón personalizado */
  customAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }

  title?: ReactNode
  subtitle?: ReactNode
  labelMode?: LabelMode
  submitText?: string
  className?: string
}

export function ForgotPasswordCard({
  onSubmit,
  onSuccess,
  onBack,
  customAction,
  title = 'Recuperar Contraseña',
  subtitle = 'Ingresa tu correo para recibir las instrucciones de restablecimiento',
  labelMode = 'floating',
  submitText = 'Enviar enlace de recuperación',
  className,
}: ForgotPasswordCardProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim()) {
      setErrorMsg('Por favor ingresa tu correo electrónico.')
      return
    }

    setLoading(true)
    try {
      const result = await onSubmit({ email })
      setSuccess(true)
      onSuccess?.(result)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al procesar la solicitud. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn('w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 sm:p-8 text-center', className)}>
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Enlace enviado
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Hemos enviado un correo a <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span> con las instrucciones para restablecer tu contraseña.
        </p>

        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full mt-6 h-10 text-xs"
            icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="left"
          >
            Volver a Iniciar Sesión
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 sm:p-8 text-left transition-all',
        className
      )}
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3">
          <EnvelopeIcon className="h-5 w-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {errorMsg && (
        <Alert variant="danger" className="mb-5 text-xs">
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Correo Electrónico"
          floatingTitle="CORREO ELECTRÓNICO"
          labelMode={labelMode}
          placeholder="tu.correo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 h-11 text-sm font-semibold shadow-md shadow-primary-500/20"
          loading={loading}
        >
          {submitText}
        </Button>

        {customAction && (
          <Button
            type="button"
            variant="outline"
            onClick={customAction.onClick}
            disabled={loading}
            className="w-full h-10 text-xs"
            icon={customAction.icon} iconPosition="left"
          >
            {customAction.label}
          </Button>
        )}

        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={loading}
            className="w-full h-10 text-xs text-gray-500"
            icon={<ArrowLeftIcon className="h-4 w-4" />} iconPosition="left"
          >
            Volver a Iniciar Sesión
          </Button>
        )}
      </form>
    </div>
  )
}
