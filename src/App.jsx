import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/neat.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/javascript/javascript.js'

import React from 'react'
import Editor from './components/Editor'

const App = _ => {
  return (
    <>
      <Editor />
    </>
  )
}

export default App
