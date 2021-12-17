import React from 'react'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { keys, handleKeyDownEvent } from './hotkeys'
import PageContainer from './pages/PageContainer'
import { set as setPage } from './store/storeApp'
import Icon from './components/elements/Icon'
import { useAppSelector } from './hooks'
import { getMenuTemplate } from './services/contextMenuService'

const App = _ => {
  const dispatch = useDispatch()
  const colors = useAppSelector(state => state.themeNew.colors)

  useHotkeys(keys, (event) => {
    handleKeyDownEvent(event, 'window')
  })

  const changeActivePage = (page) => {
    dispatch(setPage(page))
  }

  const showSettings = () => {
    const template = getMenuTemplate('appContext')
    window.__preload.menu(template)
  }

  return (
    <>
      <div
        className='w-screen h-screen bg-red-400 grid overflow-hidden' style={{
          color: colors.foreground,
          backgroundColor: colors.background,
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[title] 28px [container] minmax(0, 1fr)'
        }}
      >
        <div
          className='grid grid-cols-3 content-center'
          style={{
            backgroundColor: colors.titleBar.activeBackground,
            color: colors.titleBar.activeForeground,
            borderBottomColor: colors.titleBar.borderBottom,
            borderBottomWidth: colors.titleBar.borderBottom ? '1px' : '0px',
            '-webkit-app-region': 'drag'
          }}
        >
          <div />
          <div
            className='text-center select-none self-center'
            style={{
              fontSize: '1em'
            }}
          >Braindump
          </div>
          <div className='flex flex-row justify-end gap-2 pr-2'>
            <button className='cursor-pointer' onClick={() => changeActivePage('editor')}>
              <Icon icon='notepad' />
            </button>
            <button onClick={() => showSettings()}>
              <Icon icon='cog' />
            </button>
          </div>
        </div>

        <div className='font-mono'>
          <PageContainer />
        </div>
      </div>
    </>
  )
}

export default App
