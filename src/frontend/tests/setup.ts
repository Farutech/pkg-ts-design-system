import '@testing-library/jest-dom/vitest'

/**
 * Node >= 24/26 habilita Web Storage experimental. Sin `--localstorage-file`
 * los accessors de `localStorage`/`sessionStorage` existen pero devuelven
 * `undefined`, y Vitest/jsdom no logran sustituirlos. Cualquier test que
 * llame a `localStorage.clear()` explota. Instalamos un Storage en memoria
 * cuando el de entorno está ausente o roto.
 */
class MemoryStorage implements Storage {
  private readonly map = new Map<string, string>()

  get length() {
    return this.map.size
  }

  clear() {
    this.map.clear()
  }

  getItem(key: string) {
    const normalized = String(key)
    return this.map.has(normalized) ? this.map.get(normalized)! : null
  }

  key(index: number) {
    return [...this.map.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.map.delete(String(key))
  }

  setItem(key: string, value: string) {
    this.map.set(String(key), String(value))
  }
}

function isUsableStorage(value: unknown): value is Storage {
  return Boolean(value) && typeof (value as Storage).getItem === 'function' && typeof (value as Storage).setItem === 'function'
}

function installStorage(name: 'localStorage' | 'sessionStorage') {
  const current = (globalThis as Record<string, unknown>)[name]
  if (isUsableStorage(current)) return

  const storage = new MemoryStorage()
  const descriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
    writable: true,
    value: storage,
  }

  try {
    Object.defineProperty(globalThis, name, descriptor)
  } catch {
    ;(globalThis as Record<string, unknown>)[name] = storage
  }

  if (typeof window !== 'undefined' && (window as unknown) !== globalThis) {
    try {
      Object.defineProperty(window, name, descriptor)
    } catch {
      ;(window as unknown as Record<string, unknown>)[name] = storage
    }
  }
}

installStorage('localStorage')
installStorage('sessionStorage')

/**
 * jsdom does not implement Canvas. Recharts only needs a small deterministic
 * 2D surface for component rendering in tests, so provide a no-op context
 * instead of flooding the runner with "Not implemented" console errors.
 */
function installCanvasMock(): void {
  const contexts = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>()

  const getContext = (context: HTMLCanvasElement) => {
    const existing = contexts.get(context)
    if (existing) return existing

    const gradient = { addColorStop: () => undefined }
    const target: Record<PropertyKey, unknown> = {
      canvas: context,
      measureText: (value: string) => ({
        width: String(value).length * 8,
        actualBoundingBoxAscent: 8,
        actualBoundingBoxDescent: 2,
      }),
      getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1, colorSpace: 'srgb' }),
      createLinearGradient: () => gradient,
      createRadialGradient: () => gradient,
      getLineDash: () => [],
      getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    }

    const mocked = new Proxy(target, {
      get: (source, property) => property in source ? Reflect.get(source, property) : () => undefined,
      set: (source, property, value) => {
        source[property] = value
        return true
      },
    }) as unknown as CanvasRenderingContext2D
    contexts.set(context, mocked)
    return mocked
  }

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: getContext,
  })
}

if (typeof HTMLCanvasElement !== 'undefined') installCanvasMock()

function installJsdomBrowserMocks() {
  if (typeof Element !== 'undefined' && typeof Element.prototype.getAnimations !== 'function') {
    Object.defineProperty(Element.prototype, 'getAnimations', {
      configurable: true,
      value: () => [],
    })
  }

  if (typeof window !== 'undefined') {
    const getComputedStyle = window.getComputedStyle.bind(window)
    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: (element: Element) => getComputedStyle(element),
    })
  }
}

installJsdomBrowserMocks()
