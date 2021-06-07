import React, { useState, useEffect, useRef } from 'react'
import { Braindown } from '../braindown/index'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { usePouch } from 'use-pouchdb'
import handler from '../text/handler'

const Editor = _ => {
  const tabId = '0'
  const editorInstance = useRef(null)

  const [content, setContent] = useState('hello')
  const db = usePouch()

  const options = {
    /* styleActiveLine: true, */
    lineNumbers: true,
    lineWrapping: true,
    theme: 'material',
    mode: 'braindown'
    /* autofocus: true, */
    /* scrollbarStyle: 'overlay', */
    /* indentUnit: 4,
    tabSize: 4,
    indentWithTabs: true,
    cursorScrollMargin: 40, */
    /* foldOptions: {
      rangeFinder: CodeMirror.fold.indent,
      scanUp: true,
      widget: ' … ',
    }, */
    /* foldGutter: true,
    gutters: ['CodeMirror-foldgutter'], */
    /* extraKeys */
  }

  useEffect(async () => {
    const doc = await db.get(tabId)
    setContent(doc.text)
  }, [])

  const saveDoc = async editor => {
    try {
      // doc exists
      const doc = await db.get(tabId)
      doc.text = editorInstance.current.getValue()

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

  const handleChange = async (editor, data, value) => {
    if (!data.origin) {
      // ignore when the change happened because of replaceRanger or other methods
      return
    }

    handler.handleTextInput(editor, data)
  }

  return (
    <>
      <div className='h-screen flex flex-row'>
        <CodeMirror
          editorDidMount={editor => { editorInstance.current = editor }}
          value={content}
          onChange={handleChange}
          options={options}
        />
      </div>
    </>
  )
}

export default Editor
