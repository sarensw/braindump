import React, { useEffect } from 'react'
import useTabs from './hooks/useTabs'
import MonacoEditor from './components/EditorMonaco'
import Dumps from './components/Dumps'
import { useSelector } from 'react-redux'

const App = _ => {
  const theme = useSelector(state => state.theme.theme)
  const { loadTabs } = useTabs()

  useEffect(() => {
    // load the tabs exactly once, then show them
    loadTabs()
  }, [])

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 flex flex-row' style={{
          backgroundColor: theme.colors['editor.background']
        }}
      >
        <div className='w-44'>
          <Dumps />
        </div>
        <div className='flex-auto'>
          <MonacoEditor />
        </div>
      </div>
    </>
  )
}

export default App
