import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'
import styled from 'styled-components'

const Key = styled.div`
  border: 1px solid #cdcdcd;
  border-radius: 2px;
  padding: 1px 2px;
  text-align: center;
  background-color: #ececec;
  color: #686868;
`

const HotkeyPeek: React.FunctionComponent = (): ReactElement => {
  const hotkeys = useAppSelector(state => state.hotkeys)

  const getKeyName = (key: string | string[]): JSX.Element[] => {
    const keys = Array<JSX.Element>()
    if (Array.isArray(key)) {
      for (const hk of key) {
        let k = hk
        k = k.replace('command+', '⌘')
        k = k.replace('up', '↓')
        k = k.replace('down', '↑')
        keys.push(<Key className='ml-1'>{k}</Key>)
      }
    } else {
      let k = key
      k = k.replace('command+', '⌘')
      k = k.replace('up', '↓')
      k = k.replace('down', '↑')
      keys.push(<Key>{k}</Key>)
    }
    return keys
  }

  return (
    <>
      <div className='flex flex-row gap-1 p-2 text-sm flex-wrap'>
        {hotkeys.map((hk, i) => {
          return (
            <div key={i} className='flex flex-row items-center w-48'>
              <div className='w-16 flex pr-2 leading-4 justify-end'>{getKeyName(hk.key)}</div>
              <div style={{ color: '#686868' }}>{hk.description}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HotkeyPeek
