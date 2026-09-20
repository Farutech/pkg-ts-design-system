import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { Button } from '@/components/ui/Button'

/**
 * ButtonGroup — agrupa botones relacionados visualmente.
 *
 * Soporta orientación horizontal (default) y vertical,
 * tamaño (sm, md, lg) y variante outlined (con borde exterior).
 */
function ButtonGroupDemo() {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Tabs horizontal (default)</p>
        <ButtonGroup orientation="horizontal">
          <Button variant={activeTab === 'today' ? 'primary' : 'ghost'} onClick={() => setActiveTab('today')}>
            Hoy
          </Button>
          <Button variant={activeTab === 'week' ? 'primary' : 'ghost'} onClick={() => setActiveTab('week')}>
            Semana
          </Button>
          <Button variant={activeTab === 'month' ? 'primary' : 'ghost'} onClick={() => setActiveTab('month')}>
            Mes
          </Button>
        </ButtonGroup>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Orientación vertical</p>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Cancelar</Button>
          <Button variant="primary">Guardar</Button>
          <Button variant="danger">Eliminar</Button>
        </ButtonGroup>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Variante outlined (con borde exterior)</p>
        <ButtonGroup orientation="horizontal" variant="outlined" size="md">
          <Button variant="ghost">Izquierda</Button>
          <Button variant="ghost">Centro</Button>
          <Button variant="ghost">Derecha</Button>
        </ButtonGroup>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Con tamaños</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ButtonGroup orientation="horizontal" size="sm">
            <Button variant="ghost">Pequeño</Button>
            <Button variant="ghost">Pequeño</Button>
          </ButtonGroup>
          <ButtonGroup orientation="horizontal" size="md">
            <Button variant="ghost">Mediano</Button>
            <Button variant="ghost">Mediano</Button>
          </ButtonGroup>
          <ButtonGroup orientation="horizontal" size="lg">
            <Button variant="ghost">Grande</Button>
            <Button variant="ghost">Grande</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: '10-Helpers/ButtonGroup',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Agrupa botones relacionados visualmente con borde compartido. Orientación horizontal/vertical, tamaños y variante outlined.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AgrupacionDeBotones: Story = {
  render: () => <ButtonGroupDemo />,
}
