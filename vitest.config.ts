import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Configuración de pruebas unitarias / integración (jsdom).
 * - `npm run test`           -> ejecución única
 * - `npm run test:coverage`  -> con reporte y umbrales de cobertura
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'use-sync-external-store/shim/with-selector.js': path.resolve(__dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/shim/with-selector': path.resolve(__dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/with-selector.js': path.resolve(__dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/with-selector': path.resolve(__dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/shim/index.js': path.resolve(__dirname, './src/shims/use-sync-external-store.ts'),
      'use-sync-external-store/shim': path.resolve(__dirname, './src/shims/use-sync-external-store.ts'),
      'use-sync-external-store': path.resolve(__dirname, './src/shims/use-sync-external-store.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/*.stories.{ts,tsx}',
        'src/test-setup.ts',
        'src/docs/**',
        'src/shims/**',
        'src/index.ts',
        'src/**/index.ts',
        'src/**/*.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 55,
      },
    },
  },
})
