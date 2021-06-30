import { useDispatch } from 'react-redux'
import { set as setDocumentText } from '../store/storeDocument'

const useStorageFile = _ => {
  const dispatch = useDispatch()

  const textLoaded = text => {
    console.log('text loaaaaaaaaaaaaded')
    dispatch(setDocumentText(text))
  }
  // const storage = new Storage()

  const loadDocument = tabId => {
    try {
      // storage.saveDocument(tabId, text)
      const result = window.__preload.load({
        fileName: tabId,
        textLoaded
      })

      return result
    } catch (error) {
      console.log(error)
      return 'Error: ' + error.message
    } finally {
      console.log('saved')
    }
  }

  const saveDocument = (tabId, text) => {
    try {
      // storage.saveDocument(tabId, text)
      window.__preload.save({
        tabId,
        text
      })
    } catch (error) {
      console.log(error)
    } finally {
      console.log('saved')
    }
  }

  return {
    loadDocument,
    saveDocument
  }
}

export default useStorageFile
