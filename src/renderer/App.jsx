import React from 'react'
import MonacoEditor from './components/EditorMonaco'
import Dumps from './components/Dumps'
import { useSelector } from 'react-redux'
import ThemeChanger from './components/ThemeChanger'
import Search from './components/Search'

const App = _ => {
  const colors = useSelector(state => state.theme.colors)

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          backgroundColor: colors['editor.background'],
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[title] 1.6rem [search] 2.0rem [header] 2.2rem [main] minmax(0, 1fr)'
        }}
      >
        <div
          className='text-center text-sm items-end select-none pt-0.5'
          style={{
            backgroundColor: colors['titleBar.activeBackground'],
            color: colors['titleBar.activeForeground'],
            '-webkit-app-region': 'drag'
          }}
        >
          <div className='self-center text-xs mt-1'>braindump</div>
        </div>
        <div>
          <Search />
        </div>
        <div>
          <div
            className='grid'
            style={{
              backgroundColor: colors['editorGroupHeader.tabsBackground'],
              gridTemplateColumns: '1fr 26px 120px'
            }}
          >
            <Dumps />
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
