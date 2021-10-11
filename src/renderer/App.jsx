import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { keys, handleKeyDownEvent } from './hotkeys'
import PageContainer from './pages/PageContainer'
import { set as setPage } from './store/storeApp'

const App = _ => {
  const dispatch = useDispatch()
  const colors = useSelector(state => state.theme.colors)

  useHotkeys(keys, (event) => {
    handleKeyDownEvent(event, 'window')
  })

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          backgroundColor: colors['editor.background'],
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[title] 1.8rem [container] minmax(0, 1fr)'
        }}
      >
        <div
          className='grid grid-cols-3 content-center'
          style={{
            backgroundColor: colors['titleBar.activeBackground'],
            color: colors['titleBar.activeForeground'],
            '-webkit-app-region': 'drag'
          }}
        >
          <div />
          <div className='text-center text-xs select-none self-center'>braindump</div>
          <div className='flex flex-row justify-end gap-2 pr-2'>
            <button onClick={() => dispatch(setPage('editor'))}>e</button>
            <button onClick={() => dispatch(setPage('settings'))}>s</button>
          </div>
        </div>
        <PageContainer />
      </div>
    </>
  )
}

export default App
