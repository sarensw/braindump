import React, { useState, useEffect } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { useDoc, usePouch } from 'use-pouchdb'

const Editor = _ => {
  const tabId = '0'

  const [content, setContent] = useState('hello')
  const db = usePouch()

  const options = {
    /* styleActiveLine: true, */
    lineNumbers: true,
    /* lineWrapping: true, */
    theme: 'material',
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

  const exists = async (id) => db.get(tabId)

  const handleChange = async (editor, data, value) => {
    try {
      console.log(value)

      // doc exists
      const doc = await db.get(tabId)
      console.log(doc)
      doc.text = value
      
      await db.put(doc)
    } catch (error) {
      console.log(error)
      if (error.name === 'not_found') {
        await db.put({
          _id: tabId,
          text: value
        })
      } else {
        // log any other error
        console.log(error)
      }
    }
    
  }

  return (
    <>
      <div className='h-screen flex flex-row'>
        <CodeMirror
          value={content}
          onChange={handleChange}
          options={options} />
      </div>
    </>
  )
}

export default Editor
