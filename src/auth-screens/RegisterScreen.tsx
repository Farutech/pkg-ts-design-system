import { useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'

/**
 * RegisterScreen (TASK-203 / REQ-DS-03 / REQ-BE-05) — NO existia en ningun
 * frontend; se construye conectada al endpoint real del backend Lumen:
 *   POST /register  -> { message, requires_confirmation, confirmation_url_dev? }
 * (validacion: name<=120, email unico, password>=8 — minimos replicados en
 * el cliente para UX, la autoridad real la mantiene el backend).
 *
 * Sin backend fijo: `onSubmit` viene por props (SECURITY doc 08).
 */
export interface RegisterValues {
  name: string
  email: string
  password: string
}

export interface RegisterScreenProps<TPayload = unknown> {
  onSubmit: (values: RegisterValues) => Promise<TPayload>
  onSuccess?: (payload: TPayload) => void
  onLoginLink?: () => void
  brandName?: string
  title?: string
  submitLabel?: string
  className?: string
}

export function RegisterScreen<TPayload = unknown>({
  onSubmit,
  onSuccess,
  onLoginLink,
  brandName = 'FaruTech',
  title = 'Crea tu cuenta',
  submitLabel = 'Registrarme',
  className,
}: RegisterScreenProps<TPayload>) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = await onSubmit({ name, email, password })
      onSuccess?.(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el registro. Intenta de nuevo.')
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
          id="register-name"
          label="Nombre completo"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="register-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="register-password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          hint="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <Input
          id="register-confirm"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={8}
          required
        />

        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          {submitLabel}
        </Button>

        {onLoginLink && (
          <button type="button" className="ft-auth__link" onClick={onLoginLink}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        )}
      </form>
    </div>
  )
}