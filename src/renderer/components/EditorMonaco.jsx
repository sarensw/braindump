import React from 'react'
import Editor from '@monaco-editor/react'

const MonacoEditor = _ => {
  return (
    <>
      <Editor
        height='200px'
        width='100%'
        language='markdown'
        theme='dark'
        value='// write your asdasdcode here'
      />
    </>
  )
}

export default MonacoEditor
