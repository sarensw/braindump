import React, { ReactElement } from 'react'
import { useAppSelector } from '../hooks'
import FileSelectorPopup from './popups/FileSelectorPopup'

const PopupContainer: React.FunctionComponent = (): ReactElement => {
  const visiblePopup = useAppSelector(state => state.app.visiblePopup)

  return (
    <>
      {visiblePopup === 'fileSelector' && <FileSelectorPopup />}
    </>
  )
}

export default PopupContainer
