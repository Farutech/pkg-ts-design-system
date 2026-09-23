import fs from 'node:fs'
import path from 'node:path'

/**
 * Patch for Storybook UniversalStore follower timeout on Windows.
 * Increases the hardcoded 1-second timeout (1e3) to 30 seconds (30e3)
 * so that Vitest test runner process has sufficient time to spawn and reply on Windows.
 */
const files = [
  'node_modules/storybook/dist/_node-chunks/chunk-HFXQZX54.js',
  'node_modules/storybook/dist/_browser-chunks/chunk-MOVZJCSM.js',
  'node_modules/storybook/dist/preview/runtime.js',
  'node_modules/storybook/dist/manager/globals-runtime.js',
]

for (const rel of files) {
  const file = path.resolve(process.cwd(), rel)
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8')
    if (content.includes('UniversalStoreFollowerTimeoutError(this.id));\n    }, 1e3)')) {
      content = content.replaceAll(
        'UniversalStoreFollowerTimeoutError(this.id));\n    }, 1e3)',
        'UniversalStoreFollowerTimeoutError(this.id));\n    }, 30e3)'
      )
      fs.writeFileSync(file, content, 'utf8')
      console.log(`[Patch] Successfully patched follower timeout in ${rel}`)
    }
  }
}
