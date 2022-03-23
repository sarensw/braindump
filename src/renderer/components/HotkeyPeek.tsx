import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'
import styled from 'styled-components'

const Key = styled.div`
  border: 1px solid ${props => props.theme.button.foregroundLight};
  border-radius: 2px;
  padding: 1px 2px;
  text-align: center;
  background-color: ${props => props.theme.button.background};
  color: ${props => props.theme.button.foregroundLight};
`

const HotkeyPeek: React.FunctionComponent = (): ReactElement => {
  const hotkeys = useAppSelector(state => state.hotkeys)
  const colors = useAppSelector(state => state.themeNew.colors)

  const getKeyName = (key: string | string[], i: number): JSX.Element[] => {
    const keys = Array<JSX.Element>()
    if (Array.isArray(key)) {
      for (const hk of key) {
        let k = hk
        k = k.replace('command+', '⌘')
        k = k.replace('up', '↓')
        k = k.replace('down', '↑')
        keys.push(<Key key={`name_${i}_${hk}`} className='ml-1'>{k}</Key>)
      }
    } else {
      let k = key
      k = k.replace('command+', '⌘')
      k = k.replace('up', '↓')
      k = k.replace('down', '↑')
      keys.push(<Key key={`name_${i}_${key}`}>{k}</Key>)
    }
    return keys
  }

  return (
    <>
      <div className='flex flex-row gap-1 p-2 text-sm flex-wrap'>
        {hotkeys.map((hk, i) => {
          return (
            <div key={i} className='flex flex-row items-center w-48'>
              <div key={`key_${i}`} className='w-16 flex pr-2 leading-4 justify-end'>{getKeyName(hk.key, i)}</div>
              <div key={`desc_${i}`} style={{ color: colors.foregroundLight }}>{hk.description}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HotkeyPeek
