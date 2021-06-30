import { oneDark } from '@codemirror/theme-one-dark'
import React, { useEffect, useRef } from 'react'
import { Braindown } from '../braindown/index'
import { braindumpExtensions, EditorView, EditorState } from '../extensions/extensions'
import { newTask } from '../extensions/extensionTask'
import { newDate } from '../extensions/extensionDate'
import useStorageFile from '../hooks/useStorageFile'
import { useSelector } from 'react-redux'

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

function initEditor (currentEditor, additionalExtensions) {
  const state = EditorState.create({
    doc: 'loading...',
    extensions: [
      ...extensions,
      ...additionalExtensions
    ]
  })

  const view = new EditorView({
    state,
    parent: currentEditor
  })

  return view
}

const EditorNext = _ => {
  const tabId = '0'
  const editor = useRef(null)
  let loading = true
  let dirty = false

  const text = useSelector(state => state.document.text)

  let editorView

  const { loadDocument, saveDocument } = useStorageFile()

  useEffect(_ => {
    /* const loadEditor = async _ => {
      console.log('mount editor')
      const currentEditor = editor.current

      try {
        await loadDocument(tabId)
      } catch (err) {
        // new document, no need to do anything
      }

      loading = true

    }
    loadEditor()

    return () => {
      console.log('unmount editor')
      if (editorView) {
        editorView.destroy()
      }
    } */
    editorView = initEditor(
      editor.current,
      [
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            dirty = true
          }
        })
      ])
    loadDocument(tabId)

    return () => {
      console.log('unmount editor')
      if (editorView) {
        editorView.destroy()
      }
    }
  }, [editor.current])

  const saveDoc = async _ => {
    if (loading === false && dirty) {
      const text = editorView.state.doc.toString()
      await saveDocument(tabId, text)
      dirty = false
    }
  }

  useEffect(() => {
    const timer = setInterval(saveDoc, 2000)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    console.log(`useEffect for text: ${text}`)
    if (text) {
      console.log(text)
      const tx = editorView.state.update({ changes: { from: 0, to: editorView.state.doc.length, insert: text } })
      editorView.update([tx])
      loading = false
    }
  }, [text])

  return (
    <>
      <div className='h-screen flex flex-row'>
        <div className='flex-grow' ref={editor} />
      </div>
    </>
  )
}

export default EditorNext
