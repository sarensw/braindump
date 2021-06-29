import Storage from './storage'

const useStorageFile = _ => {
  const storage = new Storage()

  const getDocument = tabId => {
    const doc = storage.getDocument(tabId)
    return doc
  }

  const saveDocument = (tabId, text) => {
    try {
      storage.saveDocument(tabId, text)
    } catch (error) {
      console.log(error)
    } finally {
      console.log('saved')
    }
  }

  return {
    getDocument,
    saveDocument
  }
}

export default useStorageFile
