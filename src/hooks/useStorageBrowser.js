import { usePouch } from 'use-pouchdb'

const useStorageBrowser = _ => {
  const db = usePouch()

  const getDocument = async tabId => {
    const doc = await db.get(tabId)
    return doc.text
  }

  const saveDocument = async (tabId, text) => {
    try {
      // doc exists
      const doc = await db.get(tabId)
      doc.text = text

      await db.put(doc)
    } catch (error) {
      console.log(error)
      if (error.name === 'not_found') {
        await db.put({
          _id: tabId,
          text: text
        })
      } else {
        // log any other error
        console.error(error.name)
        console.log(error)
      }
    } finally {
      console.log('saved')
    }
  }

  return {
    getDocument,
    saveDocument
  }
}

export default useStorageBrowser
