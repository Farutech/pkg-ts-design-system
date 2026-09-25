import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline'

/**
 * LandingApp — landing SaaS con TopNav multinivel + Hero + Testimonials + CTA.
 * TopNav con menú de 3 niveles, hero, testimonios y CTA.
 */

export const TESTIMONIALS = [
  { name: 'Ana García', role: 'CTO — TechCorp', avatar: 'AG', content: 'Los componentes del design system nos ahorraron 3 meses de desarrollo. La accesibilidad y dark mode funcionan de primer día.', rating: 5 },
  { name: 'Carlos López', role: 'Lead Frontend — DataFlow', avatar: 'CL', content: 'La API es súper consistente. Pasar de MUI fue transparente gracias a las props bien documentadas.', rating: 5 },
  { name: 'María Torres', role: 'UX Designer — Innovatech', avatar: 'MT', content: 'El modo temático custom es increíble. Creamos nuestra marca en 2 horas sin tocar el código de los componentes.', rating: 4 },
]

function HeroSection() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, var(--ft-color-primary-100) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '680px', position: 'relative' }}>
        <Badge variant="success">🚀 Versión 2.0 disponible</Badge>
        <h1 style={{ margin: '1.5rem 0 0.5rem', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}>
          Construye aplicaciones Farutech <span style={{ color: 'var(--ft-color-primary)' }}>más rápido</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--ft-color-muted-foreground)', marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Diseño consistente, accesible y personalizable para todos los productos de la familia Farutech.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button size="lg"><HomeIcon className="h-5 w-5 mr-2" />Ver demo</Button>
          <Button size="lg" variant="outline"><ChartBarIcon className="h-5 w-5 mr-2" />Documentación</Button>
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ label: 'Components', value: '24+' }, { label: 'Tokens', value: '96' }, { label: 'A11y', value: 'WCAG AA' }, { label: 'Stars', value: '4.8★' }].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ft-color-primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: '11-Templates/Landing App SaaS',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
