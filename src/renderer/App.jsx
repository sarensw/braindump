import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { keys, handleKeyDownEvent } from './hotkeys'
import PageContainer from './pages/PageContainer'
import { useAppSelector } from './hooks'
import HotkeyPeek from './components/HotkeyPeek'
import WindowsButtons from './components/WindowsButtons'

const App = _ => {
  const app = useAppSelector(state => state.app)
  const colors = useAppSelector(state => state.themeNew.colors)
  const settings = useAppSelector(state => state.settings)

  useHotkeys(keys, (event) => {
    handleKeyDownEvent(event, 'window')
  })

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          color: colors.foreground,
          backgroundColor: colors.background,
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[title] auto [container] minmax(0, 1fr) [hotkey] auto'
        }}
      >
        {app.platform === 'linux' && <div className='h-4' />}
        {app.platform !== 'linux' &&
          <div
            className='grid grid-cols-3 content-center'
            style={{
              backgroundColor: colors.titleBar.activeBackground,
              color: colors.titleBar.activeForeground,
              borderBottomColor: colors.titleBar.borderBottom,
              borderBottomWidth: colors.titleBar.borderBottom ? '1px' : '0px',
              WebkitAppRegion: 'drag',
              height: '24px'
            }}
          ><div />
            <div
              className='text-center select-none self-center'
              style={{
                fontSize: '1em'
              }}
            >Braindump
            </div>
            {app.platform === 'win32' && <WindowsButtons />}
          </div>}

        <div className='font-mono'>
          <PageContainer />
        </div>

        <div className='font-mono max-w-full'>
          {settings['app.hotkeys.show'] && <HotkeyPeek />}
        </div>
      </div>
    </>
  )
}

export default App
