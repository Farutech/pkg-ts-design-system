import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const addonRoot = path.join(root, 'node_modules', '@storybook', 'addon-vitest')
const packagePath = path.join(addonRoot, 'package.json')
const presetPath = path.join(addonRoot, 'dist', 'preset.js')
const vitestPath = path.join(addonRoot, 'dist', 'node', 'vitest.js')

if (!existsSync(packagePath) || !existsSync(presetPath) || !existsSync(vitestPath)) {
  throw new Error('@storybook/addon-vitest is not installed; run npm install first.')
}

const { version } = JSON.parse(readFileSync(packagePath, 'utf8'))
const presetSource = readFileSync(presetPath, 'utf8')
const vitestSource = readFileSync(vitestPath, 'utf8')
const alreadyPatched =
  presetSource.includes('channel.handleEvent(event);') &&
  vitestSource.includes('Failed to synchronize stores in the test runner process') &&
  vitestSource.includes('this.vitest.standalone()')

if (alreadyPatched) {
  execFileSync(process.execPath, ['--check', presetPath], { stdio: 'inherit' })
  execFileSync(process.execPath, ['--check', vitestPath], { stdio: 'inherit' })
  console.log('[storybook-vitest] Upstream store-sync fix already applied.')
  process.exit(0)
}

if (version !== '10.6.0') {
  throw new Error(
    `Unsupported @storybook/addon-vitest ${version}. Verify the upstream implementation before upgrading.`,
  )
}

function replaceOnce(source, search, replacement, description) {
  const occurrences = source.split(search).length - 1
  if (occurrences !== 1) {
    throw new Error(`Expected one ${description} occurrence, found ${occurrences}.`)
  }
  return source.replace(search, replacement)
}

let preset = presetSource
preset = replaceOnce(
  preset,
  'ready = !1, unsubscribeStore, unsubscribeStatusStore, unsubscribeTestProviderStore,',
  'ready = !1, unsubscribeBridges = [],',
  'bridge declarations',
)
preset = replaceOnce(
  preset,
  `let stderr = [], killChild = () => {
    unsubscribeStore?.(), unsubscribeStatusStore?.(), unsubscribeTestProviderStore?.(), child?.kill(), child = null;
  };`,
  `let stderr = [], childErrorReported = !1, killChild = () => {
    for (const unsubscribe of unsubscribeBridges) unsubscribe();
    unsubscribeBridges = [], child?.kill(), child = null;
  };`,
  'child cleanup block',
)
preset = replaceOnce(
  preset,
  `}), unsubscribeStore = store.subscribe(forwardUniversalStoreEvent(STORE_CHANNEL_EVENT_NAME)), unsubscribeStatusStore = internal_universalStatusStore.subscribe(
      forwardUniversalStoreEvent(STATUS_STORE_CHANNEL_EVENT_NAME)
    ), unsubscribeTestProviderStore = internal_universalTestProviderStore.subscribe(
      forwardUniversalStoreEvent(TEST_PROVIDER_STORE_CHANNEL_EVENT_NAME)
    ), child.on("message", (event) => {`,
  `}), unsubscribeBridges = [STORE_CHANNEL_EVENT_NAME, STATUS_STORE_CHANNEL_EVENT_NAME, TEST_PROVIDER_STORE_CHANNEL_EVENT_NAME].map((eventName) => {
      const sourceStore = eventName === STORE_CHANNEL_EVENT_NAME ? store : eventName === STATUS_STORE_CHANNEL_EVENT_NAME ? internal_universalStatusStore : internal_universalTestProviderStore;
      return sourceStore.subscribe(forwardUniversalStoreEvent(eventName));
    }), child.on("message", (event) => {`,
  'store bridge subscriptions',
)
preset = replaceOnce(
  preset,
  `} else event.type === "uncaught-error" ? (store.send({
        type: "FATAL_ERROR",
        payload: event.payload
      }), reject()) : channel.emit(event.type, ...event.args);`,
  `} else if (event.type === "uncaught-error") {
        childErrorReported = !0, store.send({ type: "FATAL_ERROR", payload: event.payload }), reject(event.payload.error);
      } else if ([STORE_CHANNEL_EVENT_NAME, STATUS_STORE_CHANNEL_EVENT_NAME, TEST_PROVIDER_STORE_CHANNEL_EVENT_NAME].includes(event.type)) {
        channel.handleEvent(event);
      } else channel.emit(event.type, ...event.args);`,
  'IPC message handling',
)
preset = replaceOnce(
  preset,
  `throw store.send({
      type: "FATAL_ERROR",
      payload: {
        message: "Failed to start test runner process",
        error: error instanceof Error ? errorToErrorLike(error) : { message: String(error) }
      }
    }), eventQueue.length = 0, error;`,
  `if (!childErrorReported) store.send({
      type: "FATAL_ERROR",
      payload: {
        message: "Failed to start test runner process",
        error: error instanceof Error ? errorToErrorLike(error) : { message: String(error) }
      }
    });
    eventQueue.length = 0;
    throw error;`,
  'startup error handling',
)

const managerStart = `new TestManager({
  store,
  componentTestStatusStore: getStatusStore(STATUS_TYPE_ID_COMPONENT_TEST),
  a11yStatusStore: getStatusStore(STATUS_TYPE_ID_A11Y),
  testProviderStore: getTestProviderStore(ADDON_ID),
  onReady: () => {
    process2.send?.({ type: "ready" });
  },
  storybookOptions: {
    configDir: process2.env.STORYBOOK_CONFIG_DIR || ""
  },
  configLoader: process2.env.STORYBOOK_CONFIG_LOADER
})`
let vitest = vitestSource
vitest = replaceOnce(
  vitest,
  `  experimental_getTestProviderStore
} from "storybook/internal/core-server";`,
  `  experimental_getTestProviderStore,
  internal_universalStatusStore,
  internal_universalTestProviderStore
} from "storybook/internal/core-server";`,
  'core-server imports',
)
vitest = replaceOnce(vitest, 'await this.vitest.init();', 'await this.vitest.standalone();', 'deprecated init call')
vitest = replaceOnce(vitest, managerStart, '', 'early TestManager construction')
vitest = replaceOnce(
  vitest,
  `process2.on("SIGTERM", () => exit(0));`,
  `process2.on("SIGTERM", () => exit(0));
Promise.all([
  store.untilReady(),
  internal_universalStatusStore.untilReady(),
  internal_universalTestProviderStore.untilReady()
]).then(() => ${managerStart}, createUnhandledErrorHandler("Failed to synchronize stores in the test runner process"));`,
  'gated TestManager startup',
)

const presetTemp = `${presetPath}.tmp.mjs`
const vitestTemp = `${vitestPath}.tmp.mjs`
writeFileSync(presetTemp, preset, 'utf8')
writeFileSync(vitestTemp, vitest, 'utf8')
try {
  execFileSync(process.execPath, ['--check', presetTemp], { stdio: 'inherit' })
  execFileSync(process.execPath, ['--check', vitestTemp], { stdio: 'inherit' })
  writeFileSync(presetPath, preset, 'utf8')
  writeFileSync(vitestPath, vitest, 'utf8')
} finally {
  unlinkSync(presetTemp)
  unlinkSync(vitestTemp)
}
console.log('[storybook-vitest] Applied Storybook #36068 store-sync compatibility fix.')

