import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { readdirSync, statSync, existsSync } from 'node:fs'

/**
 * Build de librería (TASK-201):
 * - Entrada: src/index.ts + un entry por componente (tree-shaking / import individual).
 * - CSS: tokens y estilos de componente se emiten como hojas planas, no inline JS.
 * - react/react-dom quedan externos (peer dependency).
 */
const componentsDir = resolve(__dirname, 'src/components')
const componentEntries = existsSync(componentsDir)
  ? readdirSync(componentsDir).filter((d) => statSync(resolve(componentsDir, d)).isDirectory())
      .reduce((acc, d) => {
        acc[`components/${d}/index`] = resolve(componentsDir, d, 'index.ts')
        return acc
      }, {} as Record<string, string>)
  : {}

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['development'],
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'clsx'],
      output: {
        preserveModules: false,
        assetFileNames: (asset) => (asset.name === 'style.css' ? 'styles.css' : asset.name ?? '[name]'),
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: false,
  },
})
