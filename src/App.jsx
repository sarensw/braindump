import React from 'react'
import Editor from './components/Editor'

const App = _ => {
  return (
    <>
      <div className='flex flex-col p-2 h-full font-mono'>
        <h1 className='text-green-500 b-2'>Hello World!</h1>
        <Editor />
      </div>
    </>
  )
}

export default App
