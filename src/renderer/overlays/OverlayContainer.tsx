import React, { ReactElement, FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import log from '../log'
import { FileOverlay } from './FileOverlay'
import { SearchOverlay } from './SearchOverlay'

const EmptyOverlay: FunctionComponent = (): ReactElement => {
  return (
    <></>
  )
}

const OverlayContainer: FunctionComponent = (): ReactElement => {
  const appOverlay = useAppSelector(state => state.app.overlay)
  const [overlay, setOverlay] = useState<FunctionComponent>(() => EmptyOverlay)

  useEffect(() => {
    log.debug(`app overlay changed to ${String(appOverlay)}`)
    if (appOverlay === 'search') setOverlay(() => SearchOverlay)
    else if (appOverlay === 'files/quick_change') setOverlay(() => FileOverlay)
    else setOverlay(() => EmptyOverlay)
  }, [appOverlay])

  return React.createElement(overlay, {})
}

export default OverlayContainer
