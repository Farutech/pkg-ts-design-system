#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, '..')
const pkgPath = path.join(pkgRoot, 'package.json')

if (!existsSync(pkgPath)) {
  console.error(`[verify-exports] package.json not found at: ${pkgPath}`)
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const exportsMap = pkg.exports

if (!exportsMap || typeof exportsMap !== 'object') {
  console.error('[verify-exports] package.json does not contain an "exports" field')
  process.exit(1)
}

console.log(`[verify-exports] Validating published exports for ${pkg.name}@${pkg.version}...`)

let failed = false
let count = 0

for (const [subpath, target] of Object.entries(exportsMap)) {
  count++
  if (typeof target === 'string') {
    const resolvedPath = path.resolve(pkgRoot, target)
    if (!existsSync(resolvedPath)) {
      console.error(`❌ Export "${subpath}" -> "${target}" does NOT exist at: ${resolvedPath}`)
      failed = true
    } else {
      console.log(`  ✓ ${subpath} -> ${target}`)
    }
    continue
  }

  if (typeof target === 'object' && target !== null) {
    const importTarget = target.import
    const typesTarget = target.types

    if (!importTarget) {
      console.error(`❌ Export "${subpath}" is missing an "import" condition`)
      failed = true
    } else {
      const resolvedImport = path.resolve(pkgRoot, importTarget)
      if (!existsSync(resolvedImport)) {
        console.error(`❌ Export "${subpath}" import "${importTarget}" not found at: ${resolvedImport}`)
        failed = true
      }
    }

    if (!typesTarget) {
      console.error(`❌ Export "${subpath}" is missing a "types" condition`)
      failed = true
    } else {
      const resolvedTypes = path.resolve(pkgRoot, typesTarget)
      if (!existsSync(resolvedTypes)) {
        console.error(`❌ Export "${subpath}" types "${typesTarget}" not found at: ${resolvedTypes}`)
        failed = true
      }
    }

    if (importTarget && typesTarget && existsSync(path.resolve(pkgRoot, importTarget)) && existsSync(path.resolve(pkgRoot, typesTarget))) {
      console.log(`  ✓ ${subpath} (import + types verified)`)
    }
  }
}

if (failed) {
  console.error(`\n❌ [verify-exports] Verification failed. Please run "npm run build" first.`)
  process.exit(1)
}

console.log(`\n✅ [verify-exports] All ${count} subpath exports verified successfully!`)
process.exit(0)
