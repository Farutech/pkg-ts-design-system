import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useState } from 'react'

/**
 * ImageUpload — Upload de imágenes con drag & drop, preview y validación.
 *
 * Soporta arrastrar archivos, clic para seleccionar, preview en tiempo real,
 * validación de tamaño y tipo, y aspect ratio configurable.
 */
const meta = {
  title: '4-Inputs/ImageUpload',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Upload de imágenes con drag & drop, preview en tiempo real, validación de tamaño/tipo y aspect ratio configurable.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UploadDeImagen: Story = {
  render: () => {
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '380px', alignItems: 'center' }}>
        <ImageUpload
          label="Foto de perfil"
          currentImage={preview}
          onImageChange={(f, url) => { setFile(f ?? null); setPreview(url) }}
          helperText="Arrastra una imagen o haz clic para seleccionar. Máximo 2MB."
          aspectRatio="square"
          maxSizeMB={2}
          accept="image/png,image/jpeg,image/webp"
        />
        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
              Archivo: <span style={{ fontFamily: 'monospace', color: 'var(--ft-color-foreground)' }}>{file?.name}</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-color-muted-foreground)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              Preview: {preview.slice(0, 60)}…
            </p>
          </div>
        )}
      </div>
    )
  },
}

export const ConAspectRatioWide: Story = {
  name: 'Aspect ratio wide (16:9)',
  render: () => (
    <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ImageUpload
        label="Imagen de portada"
        currentImage={null}
        onImageChange={() => {}}
        helperText="Imágenes de portada para perfiles públicos."
        aspectRatio="wide"
        maxSizeMB={5}
      />
    </div>
  ),
}

export const ConAspectRatioSquare: Story = {
  name: 'Aspect ratio square (1:1)',
  render: () => (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ImageUpload
        label="Avatar"
        currentImage={null}
        onImageChange={() => {}}
        helperText="Avatar cuadrado para perfil."
        aspectRatio="square"
        maxSizeMB={1}
      />
    </div>
  ),
}
