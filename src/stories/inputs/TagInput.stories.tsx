import type { Meta, StoryObj } from '@storybook/react-vite'
import TagInput from '@/components/ui/TagInput'
import { useState, useCallback } from 'react'

/**
 * TagInput — Input para seleccionar y crear tags con búsqueda y creación en tiempo real.
 *
 * Soporta tags predefinidos, creación de tags en el fly, búsqueda async,
 * límite máximo de tags y validación personalizada.
 */
const AVAILABLE_TAGS = [
  { id: 'react', label: 'React', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'typescript', label: 'TypeScript', color: 'bg-blue-100 text-blue-700' },
  { id: 'node', label: 'Node.js', color: 'bg-green-100 text-green-700' },
  { id: 'tailwind', label: 'Tailwind CSS', color: 'bg-teal-100 text-teal-700' },
  { id: 'react-query', label: 'React Query', color: 'bg-orange-100 text-orange-700' },
  { id: 'next', label: 'Next.js', color: 'bg-gray-100 text-gray-700' },
  { id: 'graphql', label: 'GraphQL', color: 'bg-pink-100 text-pink-700' },
  { id: 'docker', label: 'Docker', color: 'bg-blue-200 text-blue-900' },
]

const meta = {
  title: '4-Inputs/TagInput',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input para gestión de tags con búsqueda async, creación en el fly, límite máximo y validación.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SelectorDeTags: Story = {
  render: () => {
    const [tags, setTags] = useState<typeof AVAILABLE_TAGS>([])
    const [asyncTags, setAsyncTags] = useState<typeof AVAILABLE_TAGS>([])

    const handleSearch = useCallback(async (query: string) => {
      await new Promise(r => setTimeout(r, 300))
      return AVAILABLE_TAGS.filter(t => t.label.toLowerCase().includes(query.toLowerCase()))
    }, [])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '480px' }}>
        <TagInput
          label="Tecnologías"
          value={tags}
          onChange={setTags}
          availableTags={AVAILABLE_TAGS}
          onSearchTags={handleSearch}
          placeholder="Escribe y presiona Enter..."
          showSearchIcon
          maxTags={5}
        />

        {tags.length > 0 && (
          <div style={{ padding: '0.75rem', background: 'var(--ft-color-surface)', borderRadius: '0.5rem', border: '1px solid var(--ft-color-border)' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ft-color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tags seleccionados
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tags.map((tag) => (
                <span key={tag.id} className={tag.color + ' px-2 py-0.5 rounded-full text-xs font-medium'}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <TagInput
          label="Tags (solo creación)"
          value={[]}
          onChange={() => {}}
          allowCreate
          showSearchIcon={false}
          placeholder="Escribe un tag y presiona Enter..."
        />

        <TagInput
          label="Tags (límite 3, con error)"
          value={[{ id: 'uno', label: 'Uno' }, { id: 'dos', label: 'Dos' }]}
          onChange={() => {}}
          availableTags={[{ id: 'uno', label: 'Uno' }, { id: 'dos', label: 'Dos' }, { id: 'tres', label: 'Tres' }]}
          maxTags={3}
          error="Máximo 3 tags permitidos"
        />
      </div>
    )
  },
}
