/**
 * LoginCard - Componente compuesto modular de autenticación
 * Permite incrustar un flujo completo de login dentro de un modal, card, drawer o página dedicada.
 * Gestiona automáticamente el almacenamiento del token (localStorage, sessionStorage, cookie, memory)
 * y soporta acciones personalizadas inyectadas por el consumidor.
 */

import React, { useState, type ReactNode, type FormEvent } from 'react'
import { cn } from '@/utils/cn'
import { Input, PasswordInput, Button, Checkbox, Alert } from '@/components/ui'
import type { LabelMode } from '@/tokens/inputTypes'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export type TokenStorageMode = 'localStorage' | 'sessionStorage' | 'memory' | 'none'

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

export interface LoginResult {
  token?: string
  accessToken?: string
  jwt?: string
  user?: any
  [key: string]: any
}

export interface CustomAuthAction {
  label: string
  onClick: () => void
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export interface LoginCardProps {
  /** Callback principal que procesa las credenciales y devuelve el resultado con token */
  onSubmit: (credentials: LoginCredentials) => Promise<LoginResult | void>
  /** Callback disparado tras autenticación exitosa */
  onSuccess?: (result: LoginResult | void) => void
  /** Callback disparado si ocurre un error */
  onError?: (error: Error | string) => void

  /** Modo de almacenamiento automático del token recibido */
  tokenStorage?: TokenStorageMode
  /** Clave bajo la cual se almacena el token en storage (por defecto: 'ft_auth_token') */
  tokenKey?: string
  /** Callback opcional cuando se extrae y almacena el token */
  onTokenReceived?: (token: string, result: LoginResult) => void

  /** Acción o botón personalizado adicional (ej. "Ingreso Corporativo SSO", "Escanear Carnet", etc.) */
  customAction?: CustomAuthAction
  /** Callback cuando el usuario pulsa en "¿Olvidaste tu contraseña?" */
  onForgotPassword?: () => void
  /** Callback cuando el usuario pulsa en registrarse */
  onRegister?: () => void

  /** Título del encabezado */
  title?: ReactNode
  /** Subtítulo o descripción */
  subtitle?: ReactNode
  /** URL del logotipo */
  logoUrl?: string
  /** Nodo JSX del logotipo */
  logoNode?: ReactNode

  /** Modo de etiqueta para los campos ('floating' | 'external') */
  labelMode?: LabelMode
  /** Etiqueta del botón de submit */
  submitText?: string
  /** Clase CSS para el contenedor */
  className?: string
  /** Footer personalizado */
  customFooter?: ReactNode
}

export function LoginCard({
  onSubmit,
  onSuccess,
  onError,
  tokenStorage = 'localStorage',
  tokenKey = 'ft_auth_token',
  onTokenReceived,
  customAction,
  onForgotPassword,
  onRegister,
  title = 'Iniciar Sesión',
  subtitle = 'Ingresa tus credenciales para acceder a la plataforma',
  logoUrl,
  logoNode,
  labelMode = 'floating',
  submitText = 'Iniciar Sesión',
  className,
  customFooter,
}: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const saveToken = (token: string) => {
    try {
      if (tokenStorage === 'localStorage' && typeof window !== 'undefined') {
        window.localStorage.setItem(tokenKey, token)
      } else if (tokenStorage === 'sessionStorage' && typeof window !== 'undefined') {
        window.sessionStorage.setItem(tokenKey, token)
      }
    } catch (err) {
      console.warn('[LoginCard] No se pudo guardar el token en storage:', err)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.')
      return
    }

    setLoading(true)
    try {
      const result = await onSubmit({ email, password, remember })
      
      // Auto-detección y persistencia de token
      if (result && typeof result === 'object') {
        const extractedToken = result.token || result.accessToken || result.jwt
        if (extractedToken && typeof extractedToken === 'string') {
          saveToken(extractedToken)
          onTokenReceived?.(extractedToken, result)
        }
      }

      onSuccess?.(result)
    } catch (err: any) {
      const msg = err?.message || 'Credenciales incorrectas. Verifica tus datos e intenta nuevamente.'
      setErrorMsg(msg)
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 sm:p-8 text-left transition-all',
        className
      )}
    >
      {/* Header con Logo y Título */}
      <div className="flex flex-col items-center text-center mb-6">
        {logoNode ? (
          <div className="mb-4">{logoNode}</div>
        ) : logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-12 w-auto mb-4 object-contain" />
        ) : null}

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Alerta de Error */}
      {errorMsg && (
        <Alert variant="danger" className="mb-5 text-xs">
          {errorMsg}
        </Alert>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Correo Electrónico"
          floatingTitle="CORREO ELECTRÓNICO"
          labelMode={labelMode}
          placeholder="tu.usuario@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          disabled={loading}
        />

        <PasswordInput
          label="Contraseña"
          floatingTitle="CONTRASEÑA"
          labelMode={labelMode}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <Checkbox
            label="Recordarme"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={loading}
          />

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium focus:outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 h-11 text-sm font-semibold shadow-md shadow-primary-500/20"
          loading={loading}
          icon={<ArrowRightIcon className="h-4 w-4" />} iconPosition="right"
        >
          {submitText}
        </Button>

        {/* Acción Personalizada Inyectada */}
        {customAction && (
          <Button
            type="button"
            variant={customAction.variant || 'outline'}
            onClick={customAction.onClick}
            disabled={loading}
            className="w-full h-10 text-xs font-medium"
            icon={customAction.icon || <SparklesIcon className="h-4 w-4" />} iconPosition="left"
          >
            {customAction.label}
          </Button>
        )}
      </form>

      {/* Registro o Footer adicional */}
      {onRegister && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          ¿No tienes una cuenta aún?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline ml-1"
          >
            Registrarse
          </button>
        </div>
      )}

      {customFooter}
    </div>
  )
}
