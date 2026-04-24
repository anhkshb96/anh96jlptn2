export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const store = new Map<string, string>()
    const mockStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, String(val)),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (n: number) => ([...store.keys()][n] ?? null),
      get length() { return store.size },
    }
    ;(globalThis as unknown as Record<string, unknown>).localStorage = mockStorage
  }
}
