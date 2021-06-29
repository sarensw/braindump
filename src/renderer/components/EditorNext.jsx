import { oneDark } from '@codemirror/theme-one-dark'
import React, { useEffect, useRef } from 'react'
import { Braindown } from '../braindown/index'
import { braindumpExtensions, EditorView, EditorState } from '../extensions/extensions'
import { newTask } from '../extensions/extensionTask'
import { newDate } from '../extensions/extensionDate'
import useStorageFile from '../hooks/useStorageFile'

const EditorNext = _ => {
  const tabId = '0'
  const editor = useRef(null)
  let editorView = null

  const { getDocument, saveDocument } = useStorageFile()

  useEffect(_ => {
    const loadEditor = async _ => {
      console.log('mount editor')
      const currentEditor = editor.current
      const extensions = [
        newTask(),
        newDate(),
        braindumpExtensions,
        oneDark,
        Braindown(),
        EditorView.lineWrapping
        // EditorView.updateListener.of(update => {
        //   if (editorView) {
        //     handler.handleTextInput(editorView, update.changes)
        //   }
        // })
      ]

      let doc = {
        text: '# Welcome to braindump'
      }
      try {
        doc = await getDocument(tabId)
      } catch (err) {
        // new document, no need to do anything
      }

      const state = EditorState.create({
        doc,
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
    const text = editorView.state.doc.toString()
    await saveDocument(tabId, text)
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
