import React, { useEffect } from 'react'
import useTabs from './hooks/useTabs'
import MonacoEditor from './components/EditorMonaco'
import Dumps from './components/Dumps'
import { useSelector } from 'react-redux'
import ThemeChanger from './components/ThemeChanger'

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
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          backgroundColor: theme.colors['editor.background'],
          gridTemplateColumns: '[sidebar] 11rem [main] minmax(0, 1fr)',
          gridTemplateRows: '[header] 2rem [shell] minmax(0, 1fr)'
        }}
      >
        <div style={{ gridColumn: '1 / span 2' }}>
          hello
        </div>
        <div>
          <Dumps />
          <ThemeChanger />
        </div>
        <div>
          <MonacoEditor />
        </div>
      </div>
    </>
  )
}

export default App
