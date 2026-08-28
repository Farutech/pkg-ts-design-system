import { useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'

/**
 * ForgotPasswordScreen (TASK-203 / REQ-DS-03) — migrado de
 * dashboard/pages/auth/ForgotPasswordPage.tsx.
 *
 * Dos flujos segun `method` (misma logica de estados que el original:
 * input -> sent -> error), pero sin ConfigContext: el metodo y el correo de
 * contacto se reciben por props.
 */
export interface ForgotPasswordValues {
  email: string
}

export interface ForgotPasswordScreenProps<TPayload = unknown> {
  onSubmit: (values: ForgotPasswordValues) => Promise<TPayload>
  onSuccess?: (payload: TPayload) => void
  onBack?: () => void
  method?: 'email' | 'admin_request'
  adminEmail?: string
  brandName?: string
  title?: string
  className?: string
}

export function ForgotPasswordScreen<TPayload = unknown>({
  onSubmit,
  onSuccess,
  onBack,
  method = 'email',
  adminEmail = 'soporte@farutech.com',
  brandName = 'FaruTech',
  title = 'Recuperar contraseña',
  className,
}: ForgotPasswordScreenProps<TPayload>) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'input' | 'sent' | 'error'>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const payload = await onSubmit({ email })
      onSuccess?.(payload)
      setStep('sent')
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setStep('input')
    setError(null)
  }

  return (
    <div className={clsx('ft-auth', className)}>
      <div className="ft-auth__card">
        <div className="ft-auth__header">
          <div className="ft-auth__logo" aria-hidden="true">
            {brandName.slice(0, 1).toUpperCase()}
          </div>
          <h1 className="ft-auth__title">{title}</h1>
          <p className="ft-auth__subtitle">
            {method === 'email'
              ? 'Te enviaremos un enlace para restablecer tu contraseña'
              : 'Tu solicitud será revisada por un administrador'}
          </p>
        </div>

        {step === 'input' && (
          <form className="ft-auth__card-body" onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Input
              id="forgot-email"
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading} disabled={loading}>
              Enviar solicitud
            </Button>

            {onBack && (
              <button type="button" className="ft-auth__link" onClick={onBack}>
                ← Volver al inicio de sesión
              </button>
            )}
          </form>
        )}

        {step === 'sent' && (
          <div className="ft-auth__sent">
            <Alert variant={method === 'admin_request' ? 'info' : 'success'}>
              {method === 'admin_request' ? (
                <>
                  Tu solicitud fue enviada al equipo de administración. Te contactarán a:{' '}
                  <strong>{adminEmail}</strong>
                </>
              ) : (
                <>Te enviamos un enlace de recuperación a <strong>{email}</strong>.</>
              )}
            </Alert>
            <Button variant="secondary" onClick={handleReset}>
              Hacer otra solicitud
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="ft-auth__sent">
            <Alert variant="danger">{error ?? 'Error al procesar la solicitud.'}</Alert>
            <Button variant="secondary" onClick={handleReset}>
              Intentar nuevamente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}