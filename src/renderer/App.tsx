import React, { FunctionComponent, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { keys, handleKeyDownEvent } from './hotkeys'
import PageContainer from './pages/PageContainer'
import { useAppSelector } from './hooks'
import WindowsButtons from './components/WindowsButtons'
import PopupContainer from './components/PopupContainer'
import log from './log'
// lic 6FB42E21-E09C4924-937ACF0A-80C86FA0
const App: FunctionComponent = _ => {
  const platform = useAppSelector(state => state.app.platform)
  const colors = useAppSelector(state => state.themeNew.colors)

  useEffect(() => {
    log.debug('loading app')

    return () => {
      log.debug('unloading app')
    }
  }, [])

  useHotkeys(keys, (event) => {
    handleKeyDownEvent(event, 'window', null)
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
        {platform === 'linux' && <div className='h-4' />}
        {platform !== 'linux' &&
          <div
            className='grid grid-cols-3 content-center drag'
            style={{
              backgroundColor: colors.titleBar.activeBackground,
              color: colors.titleBar.activeForeground,
              borderBottomColor: colors.titleBar.borderBottom,
              borderBottomWidth: colors.titleBar.borderBottom === null ? '1px' : '0px',
              // WebkitAppRegion: 'drag',
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
            {platform === 'win32' && <WindowsButtons />}
          </div>}

        <div className='font-mono'>
          <PageContainer />
        </div>

        <PopupContainer />
      </div>
    </>
  )
}

export default App
