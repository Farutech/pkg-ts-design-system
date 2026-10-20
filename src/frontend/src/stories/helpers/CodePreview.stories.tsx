import type { Meta } from '@storybook/react-vite'
import { CodePreview } from '@/components/ui/CodePreview'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

/**
 * CodePreview — componente de documentación con pestañas Vista / Código.
 *
 * Permite mostrar una vista renderizada y su código fuente lado a lado
 * (o en pestañas). Incluye botón de copiar código al portapapeles.
 */
const meta = {
  title: '10-Helpers/CodePreview',
  component: CodePreview,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Título del preview' },
    description: { control: 'text', description: 'Descripción del componente' },
    language: { control: 'select', options: ['tsx', 'ts', 'jsx', 'js', 'html', 'css'], description: 'Lenguaje del código' },
    showGrid: { control: 'boolean', description: 'Mostrar rejilla entre preview y código' },
    minHeight: { control: 'text', description: 'Altura mínima del contenedor' },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de documentación con pestañas Vista / Código. Incluye botón de copiar código al portapapeles.',
      },
    },
  },
} satisfies Meta

export default meta

export const ComponenteConCodigo = {
  render: () => (
    <CodePreview
      title="Button Primary"
      description="Botón principal para acciones importantes. Soporta 7 variantes y 3 tamaños."
      preview={<Button variant="primary" size="lg">Guardar cambios</Button>}
      code={'<Button variant="primary" size="lg">\n  Guardar cambios\n</Button>'}
      language="tsx"
      minHeight="180px"
    />
  ),
}

export const VariasVariantes = {
  name: 'Varias variantes en una preview',
  render: () => (
    <CodePreview
      title="Badge variantes"
      description="8 variantes disponibles: default, neutral, outline, primary, success, danger, warning, info."
      preview={
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      }
      code={`<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>`}
      language="tsx"
      showGrid
    />
  ),
}

export const SinTitulo = {
  name: 'Sin título (solo preview + código)',
  render: () => (
    <CodePreview
      preview={<Button variant="outline">Cancelar</Button>}
      code={'<Button variant="outline">Cancelar</Button>'}
      language="tsx"
      minHeight="80px"
    />
  ),
}
