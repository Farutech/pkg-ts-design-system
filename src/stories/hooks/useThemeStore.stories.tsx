import type { Meta, StoryObj } from '@storybook/react-vite'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/Button'

/**
 * useThemeStore — demo interactivo del store de tema.
 *
 * Muestra cómo usar setTheme, toggleTheme y leer el tema actual
 * desde el store zustand de forma reactiva.
 */
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'

function UseThemeStoreDemo() {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    const effective = newTheme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme
    document.documentElement.setAttribute('data-theme', effective)
    document.documentElement.style.colorScheme = effective
  }

  const handleToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    handleSetTheme(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '480px', maxWidth: '100%' }}>
      {/* Panel de Control de Tema */}
      <div style={{
        padding: '1.25rem',
        background: 'var(--ft-color-surface)',
        border: '1px solid var(--ft-color-border)',
        borderRadius: '0.75rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>Estado en store:</p>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--ft-color-primary)', fontFamily: 'monospace' }}>
              Modo actual: {theme.toUpperCase()}
            </h3>
          </div>
          <Badge variant={theme === 'dark' ? 'primary' : 'success'}>
            {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
          </Badge>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleSetTheme(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                theme === t
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t === 'light' ? '☀️ Claro' : t === 'dark' ? '🌙 Oscuro' : '💻 Sistema'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" size="sm" onClick={handleToggle}>
            Alternar tema (Toggle)
          </Button>
        </div>
      </div>

      {/* Preview interactivo en tiempo real */}
      <Card className="p-4 space-y-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white m-0">
          Vista previa en tiempo real (Reacciona al tema)
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
          Este card, inputs, badges y botones cambian automáticamente de tokens de color según el tema activo en <code>useThemeStore</code>.
        </p>

        <div className="space-y-2 pt-2">
          <Input label="Campo de prueba" placeholder="Escribe aquí..." defaultValue="Diseño Farutech" />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Notificaciones push activas</span>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="primary">Botón Primario</Button>
            <Button size="sm" variant="secondary">Botón Secundario</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

const meta = {
  title: '9-Hooks & Stores/useThemeStore',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Demostración interactiva del store useThemeStore (zustand). Alterna entre light, dark y system.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Interactivo: Story = {
  render: () => <UseThemeStoreDemo />,
}
