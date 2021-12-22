import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'

const HotkeyPeek: React.FunctionComponent = (): ReactElement => {
  const hotkeys = useAppSelector(state => state.hotkeys)

  return (
    <>
      {hotkeys.map((hk, i) => {
        return (
          <div key={i}>{hk.key}</div>
        )
      })}
    </>
  )
}

export default HotkeyPeek
