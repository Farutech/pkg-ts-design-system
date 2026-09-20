/**
 * Utilidad temporal: des-envuelve bloques `@layer X { ... }` de un archivo CSS
 * dejando las reglas como CSS plano (Tailwind no debe purgar clases dinámicas
 * como `ft-button--${variant}` porque el scanner no puede verlas).
 * Uso: node scripts/unwrap-layers.mjs <archivo.css> [...]
 */
import { readFileSync, writeFileSync } from 'node:fs'

function unwrap(source) {
  const lines = source.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const match = lines[i].match(/^\s*@layer\s+[a-z]+\s*\{\s*$/)
    if (!match) {
      out.push(lines[i])
      i++
      continue
    }
    // Encontrar la llave de cierre balanceada
    let depth = 1
    let j = i + 1
    const inner = []
    while (j < lines.length && depth > 0) {
      const line = lines[j]
      depth += (line.match(/\{/g) ?? []).length
      depth -= (line.match(/\}/g) ?? []).length
      if (depth > 0) inner.push(line)
      j++
    }
    for (const line of inner) out.push(line.startsWith('  ') ? line.slice(2) : line)
    i = j
  }
  return out.join('\n')
}

for (const file of process.argv.slice(2)) {
  const original = readFileSync(file, 'utf8')
  const result = unwrap(original)
  writeFileSync(file, result, 'utf8')
  console.log(`unwrapped: ${file}`)
}
