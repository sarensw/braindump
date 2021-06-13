import React, { useEffect, useRef } from 'react'
import { Braindown } from '../braindown/index'
import { usePouch } from 'use-pouchdb'
import handler from '../text/handler'

import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from '@codemirror/basic-setup'
import { oneDark } from '@codemirror/theme-one-dark'

const EditorNext = _ => {
  const tabId = '0'
  const editor = useRef(null)
  let editorView = null

  const db = usePouch()

  useEffect(_ => {
    const loadEditor = async _ => {
      console.log('mount editor')
      const currentEditor = editor.current
      const extensions = [
        basicSetup,
        oneDark,
        Braindown(),
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (editorView) {
            handler.handleTextInput(editorView, update.changes)
          }
        })
      ]

      const doc = await db.get(tabId)

      const state = EditorState.create({
        doc: doc.text,
        extensions
      })

      const view = new EditorView({
        state,
        parent: currentEditor
      })
      editorView = view
    }
    loadEditor()

    return () => {
      console.log('unmount editor')
      if (editorView) {
        editorView.destroy()
      }
    }
  }, [editor.current])

  const saveDoc = async _ => {
    try {
      // doc exists
      const doc = await db.get(tabId)
      doc.text = editorView.state.doc.toString()

      await db.put(doc)
    } catch (error) {
      console.log(error)
      if (error.name === 'not_found') {
        await db.put({
          _id: tabId,
          text: editor.getValue()
        })
      } else {
        // log any other error
        console.log(error)
      }
    } finally {
      console.log('saved')
    }
  }

  useEffect(() => {
    const timer = setInterval(saveDoc, 2000)
    return () => clearTimeout(timer)
  })

  /* const handleChange = async (editor, data, value) => {
    if (!data.origin) {
      // ignore when the change happened because of replaceRanger or other methods
      return
    }

    handler.handleTextInput(editor, data)
  }
 */
  return (
    <>
      <div className='h-screen flex flex-row'>
        <div className='flex-grow' ref={editor} />
      </div>
    </>
  )
}

export default EditorNext
