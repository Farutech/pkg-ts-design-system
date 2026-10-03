import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoadingPage } from '../LoadingPage'
import { ErrorPage } from '../ErrorPage'
import { NotFoundPage } from '../NotFoundPage'
import { OfflineBanner } from '../OfflineBanner'

describe('Fase 4 — Suite de Páginas de Estado de Aplicación', () => {
  it('LoadingPage debe renderizar título y mensaje', () => {
    render(<LoadingPage title="Cargando sistema..." message="Espere por favor" fullScreen={false} />)
    expect(screen.getByText('Cargando sistema...')).toBeInTheDocument()
    expect(screen.getByText('Espere por favor')).toBeInTheDocument()
  })

  it('ErrorPage debe mostrar código de error e ID de incidente, y soportar botón de reintento', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ErrorPage
        errorCode="503"
        incidentId="INC-TEST-99"
        onRetry={onRetry}
        fullScreen={false}
      />
    )

    expect(screen.getByText(/código de error 503/i)).toBeInTheDocument()
    expect(screen.getByText('INC-TEST-99')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /reintentar/i })
    await user.click(retryBtn)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('NotFoundPage debe mostrar el error 404 y botón de volver al inicio', () => {
    render(<NotFoundPage fullScreen={false} homeUrl="/dashboard" />)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument()
  })

  it('OfflineBanner debe mostrar el mensaje cuando no hay conexión', () => {
    // Simular offline
    vi.stubGlobal('navigator', { onLine: false })

    render(<OfflineBanner offlineMessage="Red desconectada" />)
    expect(screen.getByText('Red desconectada')).toBeInTheDocument()

    vi.unstubAllGlobals()
  })
})
