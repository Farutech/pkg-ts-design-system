import { useState, type ReactNode, type FormEvent } from 'react'
import { cn } from '@/utils/cn'
import { Input, PasswordInput, Button, Checkbox, Alert } from '@/components/ui'
import { Icon } from '@/primitives/Icon/Icon'
import { useBrandConfig } from '@/providers/DesignSystemProvider'

export type LoginProvider = string | {
  id: string
  name: string
  icon?: ReactNode
  onClick?: () => void
}

export interface LoginPageProps {
  /** Callback principal de autenticación con credenciales */
  onLogin?: (credentials: { email: string; password: string; remember: boolean }) => Promise<void | unknown>
  /** Alias compatible con onLogin */
  onSubmit?: (credentials: { email: string; password: string; remember: boolean }) => Promise<void | unknown>
  /** Callback para autenticación mediante proveedores federados / SSO */
  onProviderLogin?: (provider: string) => void
  /** Callback al solicitar recuperación de contraseña */
  onForgotPassword?: () => void
  /** Callback al solicitar registro */
  onRegister?: () => void

  /** Título principal de la pantalla de bienvenida */
  title?: string
  /** Subtítulo o instrucciones */
  subtitle?: string
  /** Proveedores de SSO a mostrar (ej: ['google', 'microsoft'] o con objetos completos) */
  providers?: Array<LoginProvider>

  /** Slot: Logo superior */
  logo?: ReactNode
  /** Slot: Encabezado personalizado */
  header?: ReactNode
  /** Slot: Pie de página / Avisos legales */
  footer?: ReactNode
  /** Slot: Panel lateral de marca / Marketing */
  sidePanel?: ReactNode
  /** Título del panel lateral por defecto */
  sidePanelTitle?: string
  /** Descripción del panel lateral por defecto */
  sidePanelDescription?: string
  /** Badge del panel lateral por defecto */
  sidePanelBadge?: string
  /** Slot: Enlaces adicionales */
  extraLinks?: ReactNode

  defaultRemember?: boolean
  className?: string
}

/**
 * LoginPage (Patrón Compuesto Enterprise):
 * Pantalla completa de autenticación que sigue la regla estricta de composición:
 * NO acepta children libres desestructurados; expone slots nombrados (logo, header, footer, sidePanel)
 * y delega el manejo de estados de carga y errores de forma accesible y reactiva.
 */
export function LoginPage({
  onLogin,
  onSubmit,
  onProviderLogin,
  onForgotPassword,
  onRegister,
  title = 'Iniciar Sesión',
  subtitle = 'Ingresa tus credenciales para acceder al sistema',
  providers = [],
  logo,
  header,
  footer,
  sidePanel,
  sidePanelTitle,
  sidePanelDescription,
  sidePanelBadge,
  extraLinks,
  defaultRemember = false,
  className,
}: LoginPageProps) {
  const brand = useBrandConfig()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(defaultRemember)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage('Por favor ingresa tanto tu correo como tu contraseña.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const loginFn = onLogin || onSubmit
      if (loginFn) {
        await loginFn({ email, password, remember })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al autenticar. Verifica tus credenciales.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('min-h-screen flex w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100', className)}>
      {/* Columna Principal de Formulario */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 max-w-xl mx-auto w-full">
        {/* Header / Logo */}
        <div className="mb-8">
          {logo ?? (brand.logoNode || (brand.logoUrl && <img src={brand.logoUrl} alt={brand.appName} className="h-9 w-auto mb-4" />))}

          {header ?? (
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="mb-6">
            <Alert variant="danger" title="Error de Acceso">
              {errorMessage}
            </Alert>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo Corporativo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.com"
            required
            prefix={<Icon.User size="xs" />}
            disabled={isLoading}
          />

          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between text-sm mt-1">
            <Checkbox
              checked={remember}
              onChange={(checked) => setRemember(Boolean(checked))}
              label="Recordar sesión"
              disabled={isLoading}
            />

            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Ingresar al Sistema
          </Button>
        </form>

        {/* Proveedores SSO */}
        {providers.length > 0 && (
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
              <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                O continuar con
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {providers.map((p, idx) => {
                const isObj = typeof p === 'object' && p !== null
                const key = isObj ? p.id : String(p)
                const name = isObj ? p.name : String(p)
                const icon = isObj ? p.icon : null
                const clickHandler = isObj && p.onClick ? p.onClick : () => onProviderLogin?.(key)

                return (
                  <Button
                    key={key || idx}
                    type="button"
                    variant="outline"
                    onClick={clickHandler}
                    disabled={isLoading}
                    className="capitalize text-xs font-medium"
                  >
                    {icon && <span className="mr-1.5">{icon}</span>}
                    {name}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Registro / Enlaces adicionales */}
        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-gray-500">
          {onRegister && (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Solicitar acceso
              </button>
            </p>
          )}

          {extraLinks}
        </div>

        {/* Footer legal */}
        {footer && (
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-center">
            {footer}
          </div>
        )}
      </div>

      {/* Panel Lateral de Marca (Desktop) */}
      {(sidePanel || sidePanelTitle || sidePanelDescription) && (
        <div className="hidden lg:flex flex-1 relative bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-12 items-center justify-center">
          {sidePanel ?? (
            <div className="max-w-md space-y-4">
              {sidePanelBadge && (
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                  {sidePanelBadge}
                </span>
              )}
              {sidePanelTitle && (
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {sidePanelTitle}
                </h2>
              )}
              {sidePanelDescription && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {sidePanelDescription}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
