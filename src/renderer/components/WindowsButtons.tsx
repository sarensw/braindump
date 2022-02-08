import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'

const WindowsButtons: React.FunctionComponent = (): ReactElement => {
  const app = useAppSelector(state => state.app)

  const buttonAction = (action: string): void => {
    console.log(action)
    window.__preload.send({
      channel: 'windows/controls',
      payload: {
        action
      }
    })
  }

  return (
    <div
      id='window-controls'
      className='grid absolute'
      style={{
        gridTemplateColumns: 'repeat(3, 46px)',
        top: 0,
        right: 0,
        height: '26px'
      }}
    >

      <div
        id='min-button'
        className='button flex'
        style={{
          gridRow: '1 / span 1',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          gridColumn: 1
        }}
        onClick={() => buttonAction('minimize')}
      >
        <img className='icon' srcSet='icons/min-k-10.png 1x, icons/min-k-12.png 1.25x, icons/min-k-15.png 1.5x, icons/min-k-15.png 1.75x, icons/min-k-20.png 2x, icons/min-k-20.png 2.25x, icons/min-k-24.png 2.5x, icons/min-k-30.png 3x, icons/min-k-30.png 3.5x' draggable='false' />
      </div>

      {!app.windowMaximized &&
        <div
          id='max-button'
          className='button flex'
          style={{
            gridRow: '1 / span 1',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gridColumn: 2
          }}
          onClick={() => buttonAction('maximize')}
        >
          <img className='icon' srcSet='icons/max-k-10.png 1x, icons/max-k-12.png 1.25x, icons/max-k-15.png 1.5x, icons/max-k-15.png 1.75x, icons/max-k-20.png 2x, icons/max-k-20.png 2.25x, icons/max-k-24.png 2.5x, icons/max-k-30.png 3x, icons/max-k-30.png 3.5x' draggable='false' />
        </div>}

      {app.windowMaximized &&
        <div
          id='restore-button'
          className='button flex'
          style={{
            gridRow: '1 / span 1',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gridColumn: 2
          }}
          onClick={() => buttonAction('unmaximize')}
        >
          <img className='icon' srcSet='icons/restore-k-10.png 1x, icons/restore-k-12.png 1.25x, icons/restore-k-15.png 1.5x, icons/restore-k-15.png 1.75x, icons/restore-k-20.png 2x, icons/restore-k-20.png 2.25x, icons/restore-k-24.png 2.5x, icons/restore-k-30.png 3x, icons/restore-k-30.png 3.5x' draggable='false' />
        </div>}

      <div
        id='close-button'
        className='flex'
        style={{
          gridRow: '1 / span 1',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          gridColumn: 3
        }}
        onClick={() => buttonAction('close')}
      >
        <img className='icon' srcSet='icons/close-k-10.png 1x, icons/close-k-12.png 1.25x, icons/close-k-15.png 1.5x, icons/close-k-15.png 1.75x, icons/close-k-20.png 2x, icons/close-k-20.png 2.25x, icons/close-k-24.png 2.5x, icons/close-k-30.png 3x, icons/close-k-30.png 3.5x' draggable='false' />
      </div>

    </div>
  )
}

export default WindowsButtons
