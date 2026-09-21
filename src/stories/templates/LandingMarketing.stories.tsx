import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Link } from '@/components/ui/Link'
import { useThemeStore } from '@/store/themeStore'

/**
 * LandingMarketing — landing de producto con Hero, Features, Pricing y Footer.
 */

const PRICING = [
  { name: 'Starter', price: '0', period: 'indefinido', desc: 'Proyectos personales', features: ['5 componentes premium', '1 proyecto', 'Soporte community'], cta: 'Comenzar gratis', popular: false },
  { name: 'Pro', price: '29', period: '/mes', desc: 'Para equipos profesionales', features: ['Todos los componentes', 'Proyectos ilimitados', 'Soporte prioritario', 'Dashboard Analytics'], cta: 'Prueba gratis', popular: true },
  { name: 'Enterprise', price: '99', period: '/mes', desc: 'Para organizaciones', features: ['Todo de Pro', 'Support 24/7', 'SLA garantizado', 'Implementación personalizada'], cta: 'Contactar', popular: false },
]

function HeroSection() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: isDark ? 'var(--ft-color-gray-900)' : 'linear-gradient(135deg, var(--ft-color-primary-500), var(--ft-color-accent))', color: 'white' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Badge variant="primary">Nuevo: v2.0 disponible</Badge>
        <h1 style={{ margin: '1.5rem 0 0.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
          El sistema de diseño para aplicaciones Farutech
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
          Componentes UI accesibles, tokens tematizables y documentación viva para website, admin, intranet y futuras aplicaciones.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button size="lg" variant="secondary">Comenzar ahora</Button>
          <Link href="/docs" external style={{ color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 500 }}>
            Ver documentación →
          </Link>
        </div>
      </div>
    </div>
  )
}

function LandingMarketing() {
  return (
    <>
      <HeroSection />
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Planes para cada equipo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {PRICING.map((plan) => (
            <article key={plan.name} style={{ padding: '1.5rem', border: '1px solid var(--ft-color-gray-200)', borderRadius: '0.75rem' }}>
              {plan.popular && <Badge variant="primary">Más popular</Badge>}
              <h3>{plan.name}</h3>
              <p>{plan.desc}</p>
              <strong style={{ fontSize: '2rem' }}>{plan.price}€</strong> <span>{plan.period}</span>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Button variant={plan.popular ? 'primary' : 'secondary'}>{plan.cta}</Button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

const meta = {
  title: '11-Templates/Landing Marketing',
  component: LandingMarketing,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LandingMarketing>

export default meta

export const Default: StoryObj<typeof LandingMarketing> = {}
