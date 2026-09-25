/**
 * LoginScreen - Componente reutilizable de autenticación
 * 
 * @example
 * ```tsx
 * <LoginScreen
 *   onSubmit={async (credentials) => {
 *     const response = await fetch('/api/login', { ... })
 *     return response.json()
 *   }}
 *   onForgotPassword={() => navigate('/forgot-password')}
 *   onRegister={() => navigate('/register')}
 *   logoUrl="/logo.png"
 *   brandName="Mi Aplicación"
 * />
 * ```
 */

import { useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react'
import { SparklesIcon, ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline'
import { Button, Input, Checkbox, Alert } from '@/components/ui'

export interface LoginScreenProps {
  /** Callback que recibe email/password y retorna Promise con el resultado del login */
  onSubmit: (credentials: { email: string; password: string; remember: boolean }) => Promise<any>
  /** Callback invocado cuando el login es exitoso */
  onSuccess?: (result: any) => void
  /** Callback cuando el usuario hace clic en "Olvidé mi contraseña" */
  onForgotPassword?: () => void
  /** Callback cuando el usuario quiere registrarse */
  onRegister?: () => void
  /** Nombre de la aplicación (ej: "Afilamos Operaciones", "Ordeon", "Portal Clientes") */
  appName?: string
  /** Nombre de la marca o aplicación (alias compatible hacia atrás) */
  brandName?: string
  /** URL del logo de la aplicación */
  logoUrl?: string
  /** Elemento personalizado para el logo (SVG, icono o ReactNode) */
  logoNode?: ReactNode
  /** Descripción o subtítulo debajo del nombre de la aplicación */
  description?: string
  /** Etiqueta de badge encima del título (o false/vacio para no mostrar) */
  accessTag?: string
  /** Texto personalizado para el label de email */
  emailLabel?: string
  /** Placeholder para el email */
  emailPlaceholder?: string
  /** Texto personalizado para el label de contraseña */
  passwordLabel?: string
  /** Placeholder para la contraseña */
  passwordPlaceholder?: string
  /** Texto del botón de inicio de sesión */
  submitButtonText?: string
  /** Texto mientras se procesa el inicio de sesión */
  loadingButtonText?: string
  /** Texto personalizado para el checkbox de recordar */
  rememberLabel?: string
  /** Texto para el enlace de contraseña olvidada */
  forgotPasswordText?: string
  /** Si debe mostrar la opción de registrarse */
  showRegister?: boolean
  /** Texto previo al enlace de registro */
  registerPromptText?: string
  /** Texto del enlace de registro */
  registerLinkText?: string
  /** Si se debe mostrar el crédito del creador al pie (default: true). Pon false para marca blanca pura */
  showCreator?: boolean
  /** Nombre del creador de la plataforma (default: "FaruTech") */
  creatorName?: string
  /** URL del creador (default: "https://farutech.com") */
  creatorUrl?: string
  /** Prefijo del creador (default: "Desarrollado por") */
  creatorPrefix?: string
  /** Título del panel lateral de bienvenida */
  welcomeTitle?: string
  /** Subtítulo del panel lateral de bienvenida */
  welcomeSubtitle?: string
  /** Contenido adicional para el pie del formulario */
  footerContent?: ReactNode
  /** Loading state externo (opcional, si no se usa el interno del componente) */
  isLoading?: boolean
  /** Clases CSS adicionales para el contenedor principal */
  className?: string
}

export function LoginScreen({
  onSubmit,
  onSuccess,
  onForgotPassword,
  onRegister,
  appName,
  brandName,
  logoUrl = '/Logo.png',
  logoNode,
  description = 'Ingresa tus credenciales para continuar',
  accessTag = 'Acceso',
  emailLabel = 'Correo electrónico',
  emailPlaceholder = 'tu@email.com',
  passwordLabel = 'Contraseña',
  passwordPlaceholder = '••••••••',
  submitButtonText = 'Iniciar sesión',
  loadingButtonText = 'Iniciando sesión...',
  rememberLabel = 'Recordarme',
  forgotPasswordText = '¿Olvidaste tu contraseña?',
  showRegister = false,
  registerPromptText = '¿No tienes una cuenta?',
  registerLinkText = 'Regístrate aquí',
  showCreator = true,
  creatorName = 'FaruTech',
  creatorUrl = 'https://farutech.com',
  creatorPrefix = 'Desarrollado por',
  welcomeTitle = 'Bienvenido de nuevo',
  welcomeSubtitle = 'Accede a tu panel para gestionar todos los aspectos de tu aplicación',
  footerContent,
  isLoading: externalIsLoading,
  className = '',
}: LoginScreenProps) {
  const effectiveAppName = brandName || appName || 'FaruTech'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSubmittingValue = externalIsLoading ?? isSubmitting

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await onSubmit({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      })

      if (result && result.success === false && result.error) {
        setError(result.error)
      } else if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo and branding */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30 ring-4 ring-primary-200 dark:ring-primary-900/50 transform group-hover:scale-105 transition-all duration-300">
                  {logoNode ? (
                    logoNode
                  ) : (
                    <img
                      src={logoUrl}
                      alt={`${effectiveAppName} Logo`}
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = `<span class="text-2xl font-bold text-white">${effectiveAppName.slice(0, 2).toUpperCase()}</span>`
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {effectiveAppName}
            </h1>
            {accessTag && (
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1 flex items-center justify-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                {accessTag}
              </p>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Error alert */}
            {error && (
              <Alert variant="error" title="Error de autenticación">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              {/* Email input */}
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                label={emailLabel}
                placeholder={emailPlaceholder}
                icon={<UserIcon className="h-5 w-5" />}
                iconPosition="left"
              />

              {/* Password input */}
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                label={passwordLabel}
                placeholder={passwordPlaceholder}
                showPasswordToggle={true}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  label={rememberLabel}
                />
              </div>

              {onForgotPassword && (
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    {forgotPasswordText}
                  </button>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmittingValue}
              fullWidth
              size="lg"
              className="group"
            >
              {isSubmittingValue ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {loadingButtonText}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {submitButtonText}
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              )}
            </Button>

            {/* Register link */}
            {showRegister && onRegister && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {registerPromptText}{' '}
                  <button
                    type="button"
                    onClick={onRegister}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    {registerLinkText}
                  </button>
                </p>
              </div>
            )}

            {/* Creator / White-label section */}
            {showCreator && creatorName && (
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
                {creatorPrefix}{' '}
                {creatorUrl ? (
                  <a
                    href={creatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline text-gray-600 dark:text-gray-400 transition-colors"
                  >
                    {creatorName}
                  </a>
                ) : (
                  <span className="font-medium text-gray-600 dark:text-gray-400">{creatorName}</span>
                )}
              </div>
            )}

            {footerContent && <div className="mt-4">{footerContent}</div>}
          </form>
        </div>
      </div>

      {/* Right side - Decorative gradient (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{welcomeTitle}</h2>
            <p className="text-primary-100 text-lg">
              {welcomeSubtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
