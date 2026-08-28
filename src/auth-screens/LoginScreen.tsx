import { useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'

/**
 * LoginScreen (TASK-203 / REQ-DS-03) — migrado de dashboard/pages/auth/LoginPage.tsx
 * sin dependencias de negocio ni de router.
 *
 * SECURITY (doc 08): el componente NO conoce el backend ni decide el mecanismo
 * de almacenamiento del token. Recibe `onSubmit` por props y expone el payload
 * de éxito en `onSuccess` para que la app consumidora decida almacenamiento
 * (localStorage, cookie, memoria) y navegación.
 */
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface LoginScreenProps<TPayload = unknown> {
  onSubmit: (values: LoginCredentials) => Promise<TPayload>
  onSuccess?: (payload: TPayload) => void
  onForgotPassword?: () => void
  brandName?: string
  title?: string
  submitLabel?: string
  className?: string
}

export function LoginScreen<TPayload = unknown>({
  onSubmit,
  onSuccess,
  onForgotPassword,
  brandName = 'FaruTech',
  title = 'Accede a tu cuenta',
  submitLabel = 'Iniciar sesión',
  className,
}: LoginScreenProps<TPayload>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const payload = await onSubmit({ email, password, remember })
      onSuccess?.(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={clsx('ft-auth', className)}>
      <form className="ft-auth__card" onSubmit={handleSubmit}>
        <div className="ft-auth__header">
          <div className="ft-auth__logo" aria-hidden="true">
            {brandName.slice(0, 1).toUpperCase()}
          </div>
          <h1 className="ft-auth__title">{title}</h1>
          <p className="ft-auth__subtitle">{brandName}</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Input
          id="login-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="login-password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="ft-auth__remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Recordarme
        </label>

        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          {submitLabel}
        </Button>

        {onForgotPassword && (
          <button type="button" className="ft-auth__link" onClick={onForgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </form>
    </div>
  )
}