import React, { useEffect, useRef } from 'react'
import PouchDB from 'pouchdb'
import { convertToRaw, convertFromRaw, EditorState, ContentState } from 'draft-js'

const useStorage = _ => {
  /** @type {import('pouchdb')} */
  const pdb = useRef(new PouchDB('braindump'))

  useEffect(() => {
    if (pdb) {
      const db = pdb.current
      db.info().then(info => {
        console.log(info)
      })
    }
    return () => {
      // don't close as this breaks the editor with every reload
      /* if (db) {
        db.current.close()
      } */
    }
  }, [pdb])

  /**
   * 
   * @param {import('draft-js').EditorState} input 
   */
  const store = input => {
    const blocks = convertToRaw(input.getCurrentContent()).blocks
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n')
    try {
      const db = pdb.current
      db.get('0').catch(function (err) {
        if (err.name === 'not_found') {
          return {
            '_id': '0',
            'name': 'tab 1',
            'lines': value.split('\n')
          }
        }
      }).then(function (doc) {
        doc.lines = value.replace(/\n\s*\n\s*\n/g, "\n\n").split('\n')
        return db.put(doc)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const load = async _ => {
    if (pdb) {
      const db = pdb.current
      console.log('aload')
      const doc = await db.get('0')
      console.log('aloaded')
      const raw = doc.lines.join('\n')
      const contentState = ContentState.createFromText(raw)
      return contentState
    } else {
      return ContentState.createFromText('empty')
    }
  }

  return {
    store,
    load
  }
}

export default useStorage
