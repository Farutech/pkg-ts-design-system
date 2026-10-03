import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropzone } from '../Dropzone'
import { FileList } from '../FileList'
import { UploadProgress } from '../UploadProgress'

describe('Fase 4 — Suite de Carga de Archivos (Upload)', () => {
  describe('Dropzone', () => {
    it('debe aceptar archivos válidos y rechazar archivos que exceden el tamaño máximo', () => {
      const onAccepted = vi.fn()
      const onRejected = vi.fn()

      render(
        <Dropzone
          maxSizeBytes={1024} // 1KB
          onFilesAccepted={onAccepted}
          onFilesRejected={onRejected}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toBeInTheDocument()

      const validFile = new File(['a'.repeat(500)], 'test-valid.png', { type: 'image/png' })
      const oversizedFile = new File(['a'.repeat(2000)], 'test-large.png', { type: 'image/png' })

      fireEvent.change(input, {
        target: { files: [validFile, oversizedFile] },
      })

      expect(onAccepted).toHaveBeenCalledWith([validFile])
      expect(onRejected).toHaveBeenCalledWith([
        expect.objectContaining({ file: oversizedFile }),
      ])
    })
  })

  describe('FileList', () => {
    it('debe renderizar la lista de archivos con sus estados y botón de eliminación', async () => {
      const user = userEvent.setup()
      const onRemove = vi.fn()

      const files = [
        { id: '1', name: 'factura.pdf', size: 2048, status: 'completed' as const },
        { id: '2', name: 'foto.jpg', size: 1024, status: 'uploading' as const, progress: 45 },
      ]

      render(<FileList files={files} onRemove={onRemove} />)

      expect(screen.getByText('factura.pdf')).toBeInTheDocument()
      expect(screen.getByText('foto.jpg')).toBeInTheDocument()
      expect(screen.getByText(/completado/i)).toBeInTheDocument()

      const removeBtns = screen.getAllByTitle('Eliminar archivo')
      await user.click(removeBtns[0])

      expect(onRemove).toHaveBeenCalledWith('1')
    })
  })

  describe('UploadProgress', () => {
    it('debe mostrar el porcentaje de progreso y barra correspondiente', () => {
      render(
        <UploadProgress
          progress={75}
          fileName="documento-fiscal.pdf"
          status="uploading"
        />
      )

      expect(screen.getByText('documento-fiscal.pdf')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })
})
