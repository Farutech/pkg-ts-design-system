import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
      outDir: './dist',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/__tests__/**', 'src/docs/**'],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'components/ui': path.resolve(__dirname, 'src/components/ui/index.ts'),
        'components/crud': path.resolve(__dirname, 'src/components/crud/index.ts'),
        'components/layout': path.resolve(__dirname, 'src/components/layout/index.ts'),
        'components/basic': path.resolve(__dirname, 'src/components/basic/index.ts'),
        'components/navigation': path.resolve(__dirname, 'src/components/navigation/index.ts'),
        'auth-screens': path.resolve(__dirname, 'src/auth-screens/index.ts'),
        tokens: path.resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css'
          }
          return '[name].js'
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
})
