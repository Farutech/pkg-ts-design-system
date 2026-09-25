import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import dts from 'vite-plugin-dts'

const sourceRoot = path.resolve(import.meta.dirname, 'src')

/**
 * Build de la librería (@farutech/design-system).
 *
 * - 12 entry points públicos (raíz + subpaths del `exports` de package.json).
 * - TODAS las dependencias de runtime quedan externas: el `dist` no duplica
 *   código de react, headlessui, zustand, recharts, etc.
 * - Los `.d.ts` salen de `tsconfig.build.json` (excluye tests, stories y docs).
 * - Los estilos se compilan aparte con Tailwind CLI (`npm run build:styles`)
 *   hacia `dist/styles.css`.
 */
const runtimeDependencies = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
  '@headlessui/react',
  '@heroicons/react',
  '@tanstack/react-table',
  'clsx',
  'framer-motion',
  'react-router-dom',
  'recharts',
  'tailwind-merge',
  'zustand',
]

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: './dist',
      entryRoot: sourceRoot,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/__tests__/**',
        'src/**/*.stories.tsx',
        'src/docs/**',
        'src/test-setup.ts',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': sourceRoot,

      'use-sync-external-store/shim/with-selector.js': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/shim/with-selector': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/with-selector.js': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/with-selector': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/shim/index.js': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store.ts',
      ),

      'use-sync-external-store/shim': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store.ts',
      ),

      'use-sync-external-store': path.resolve(
        sourceRoot,
        'shims/use-sync-external-store.ts',
      ),
    },
  },

  build: {
    lib: {
      entry: {
        index: path.resolve(sourceRoot, 'index.ts'),
        'components/ui': path.resolve(
          sourceRoot,
          'components/ui/index.ts',
        ),
        'components/crud': path.resolve(
          sourceRoot,
          'components/crud/index.ts',
        ),
        'components/layout': path.resolve(
          sourceRoot,
          'components/layout/index.ts',
        ),
        'components/basic': path.resolve(
          sourceRoot,
          'components/basic/index.ts',
        ),
        'components/navigation': path.resolve(
          sourceRoot,
          'components/navigation/index.ts',
        ),
        'auth-screens': path.resolve(
          sourceRoot,
          'auth-screens/index.ts',
        ),
        hooks: path.resolve(sourceRoot, 'hooks/index.ts'),
        store: path.resolve(sourceRoot, 'store/index.ts'),
        providers: path.resolve(sourceRoot, 'providers/index.ts'),
        tokens: path.resolve(sourceRoot, 'tokens/index.ts'),
        utils: path.resolve(sourceRoot, 'utils/index.ts'),
      },
      formats: ['es'],
    },

    rollupOptions: {
      external: (id) =>
        runtimeDependencies.some(
          (dep) => id === dep || id.startsWith(`${dep}/`),
        ),

      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },

    sourcemap: true,
    minify: false,
  },
})