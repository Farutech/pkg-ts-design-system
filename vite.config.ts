import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import dts from 'vite-plugin-dts'

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
      entryRoot: './src',
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
      '@': path.resolve(import.meta.dirname, './src'),

      'use-sync-external-store/shim/with-selector.js': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/shim/with-selector': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/with-selector.js': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/with-selector': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store-with-selector.ts',
      ),

      'use-sync-external-store/shim/index.js': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store.ts',
      ),

      'use-sync-external-store/shim': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store.ts',
      ),

      'use-sync-external-store': path.resolve(
        import.meta.dirname,
        './src/shims/use-sync-external-store.ts',
      ),
    },
  },

  build: {
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, 'src/index.ts'),
        'components/ui': path.resolve(
          import.meta.dirname,
          'src/components/ui/index.ts',
        ),
        'components/crud': path.resolve(
          import.meta.dirname,
          'src/components/crud/index.ts',
        ),
        'components/layout': path.resolve(
          import.meta.dirname,
          'src/components/layout/index.ts',
        ),
        'components/basic': path.resolve(
          import.meta.dirname,
          'src/components/basic/index.ts',
        ),
        'components/navigation': path.resolve(
          import.meta.dirname,
          'src/components/navigation/index.ts',
        ),
        'auth-screens': path.resolve(
          import.meta.dirname,
          'src/auth-screens/index.ts',
        ),
        hooks: path.resolve(import.meta.dirname, 'src/hooks/index.ts'),
        store: path.resolve(import.meta.dirname, 'src/store/index.ts'),
        providers: path.resolve(import.meta.dirname, 'src/providers/index.ts'),
        tokens: path.resolve(import.meta.dirname, 'src/tokens/index.ts'),
        utils: path.resolve(import.meta.dirname, 'src/utils/index.ts'),
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