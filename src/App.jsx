import React from 'react'
import Editor from './components/Editor'

const App = _ => {
  return (
    <>
      <div style={{ background: '#eceff4' }} 
        className='flex flex-col p-2 h-full font-mono'>
        <Editor />
      </div>
    </>
  )
}

export default App
