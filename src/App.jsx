import React from 'react'
import TheEditor from './components/TheEditor'

const App = _ => {
  return (
    <>
      <div className='flex flex-col p-2 h-full font-mono'>
        <h1 className='text-green-500 b-2'>Hello World!</h1>
        <TheEditor />
      </div>
    </>
  )
}

export default App
