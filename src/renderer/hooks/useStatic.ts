function useStatic<T> (staticId: string): {
  store: (id: string, obj: T) => void
  retrieve: (id: string) => T | null
  remove: (id: string) => void
} {
  const ensureStaticId = (): void => {
    if (window.__usestore == null) {
      window.__usestore = {}
    }
    if (window.__usestore[staticId] == null) {
      window.__usestore[staticId] = {}
    }
  }

  const store = (id: string, obj: T): void => {
    ensureStaticId()
    window.__usestore[staticId][id] = obj
  }

  const retrieve = (id: string): T | null => {
    ensureStaticId()
    if (window.__usestore[staticId][id] == null) {
      return null
    }
    return window.__usestore[staticId][id]
  }

  const remove = (id: string): void => {
    ensureStaticId()
    if (window.__usestore[staticId][id] == null) {
      delete window.__usestore[staticId][id]
    }
  }

  return {
    store,
    retrieve,
    remove
  }
}

export default useStatic
