/**
 * Migración mecánica: `clsx` -> `cn` (utilidad oficial del Design System).
 * - Reemplaza el import de clsx por el import relativo a src/utils/cn.
 * - Reemplaza las llamadas `clsx(...)` por `cn(...)`.
 * Ejecutar una sola vez: node scripts/migrate-clsx-to-cn.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const files = [
  ...globSync('src/**/*.tsx', { cwd: root }),
  ...globSync('src/**/*.ts', { cwd: root }),
  ...globSync('.storybook/**/*.tsx', { cwd: root }),
]

let migrated = 0

for (const file of files) {
  const absolute = path.join(root, file)
  const original = readFileSync(absolute, 'utf8')
  if (!original.includes("from 'clsx'")) continue

  const relativeImport = path
    .relative(path.dirname(absolute), path.join(root, 'src/utils/cn'))
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '')
  const importPath = relativeImport.startsWith('.') ? relativeImport : `./${relativeImport}`

  let updated = original
    .replace(/import \{ clsx, type ClassValue \} from 'clsx'\r?\n/, `import { cn, type ClassValue } from '${importPath}'\n`)
    .replace(/import clsx from 'clsx';?\r?\n/, `import { cn } from '${importPath}'\n`)
    .replace(/\bclsx\(/g, 'cn(')

  if (updated !== original) {
    writeFileSync(absolute, updated, 'utf8')
    migrated++
    console.log(`cn migrated: ${file} -> ${importPath}`)
  }
}

console.log(`archivos migrados: ${migrated}`)
