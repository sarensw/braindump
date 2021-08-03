import React, { useEffect } from 'react'
import useTabs from './hooks/useTabs'
import MonacoEditor from './components/EditorMonaco'
import Dumps from './components/Dumps'
import { useSelector } from 'react-redux'
import ThemeChanger from './components/ThemeChanger'

const App = _ => {
  const colors = useSelector(state => state.theme.colors)
  const { loadTabs } = useTabs()

  useEffect(() => {
    // load the tabs exactly once, then show them
    loadTabs()
  }, [])

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          backgroundColor: colors['editor.background'],
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[title] 1.6rem [header] 2.2rem [main] minmax(0, 1fr)'
        }}
      >
        <div
          className='text-center text-sm items-end select-none'
          style={{
            backgroundColor: colors['titleBar.activeBackground'],
            color: colors.foreground,
            '-webkit-app-region': 'drag'
          }}
        >
          <div className='self-center'>braindump</div>
        </div>
        <div>
          <div
            className='flex flex-row'
            style={{
              backgroundColor: colors['editorGroupHeader.tabsBackground']
            }}
          >
            <Dumps />
            <div className='flex-grow' />
            <ThemeChanger />
          </div>
        </div>
        <div>
          <MonacoEditor />
        </div>
      </div>
    </>
  )
}

export default App
