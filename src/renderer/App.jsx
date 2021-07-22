import React, { useEffect } from 'react'
import useTabs from './hooks/useTabs'
import Dumps from './components/Dumps'
import MonacoEditor from './components/EditorMonaco'

const App = _ => {
  const { loadTabs } = useTabs()

  useEffect(() => {
    // load the tabs exactly once, then show them
    loadTabs()
  }, [])

  return (
    <>
      <Dumps />
      <MonacoEditor />
    </>
  )
}

export default App
