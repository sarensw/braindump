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

  const getKeyName = (key: string): string => {
    key = key.replace('command+', '⌘')
    key = key.replace('up', '↓')
    key = key.replace('down', '↑')
    return key
  }

  return (
    <>
      <div className='flex flex-row gap-1 p-2 text-sm flex-wrap'>
        {hotkeys.map((hk, i) => {
          return (
            <div key={i} className='flex flex-row items-center w-48'>
              <div className='w-16 flex pr-2 leading-4 justify-end'><Key>{getKeyName(hk.key)}</Key></div>
              <div style={{ color: '#686868' }}>{hk.description}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HotkeyPeek
