import React, { ReactElement, useEffect } from 'react'
import Popup from '../Popup'
import { useAppSelector } from '../../hooks'

const FileSelectorPopup: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files.files)
  const currentFile = useAppSelector(state => state.files.current)
  const colors = useAppSelector(state => state.themeNew.colors)

  const container = React.createRef<HTMLUListElement>()
  const refs = files?.reduce((acc, value) => {
    acc[value.id] = React.createRef()
    return acc
  }, {}) ?? []

  useEffect(() => {
    if (refs === undefined || currentFile === null || container === null || container.current === null || refs[currentFile].current === null) return

    const element = refs[currentFile].current
    if (element.getBoundingClientRect().top < container.current.getBoundingClientRect().top) {
      element.scrollIntoView()
    } else if (element.getBoundingClientRect().bottom > container.current.getBoundingClientRect().bottom) {
      element.scrollIntoView(false)
    }
  }, [currentFile])

  return (
    <Popup>
      <div
        className='p-1 h-full'
      >
        <ul
          ref={container}
          className='overflow-y-hidden overflow-x-hidden h-full'
        >
          {files?.map((file, index) => {
            return (
              <li
                ref={refs[file.id]}
                key={index}
                className='px-1 whitespace-nowrap text-left'
                style={{
                  background: (file.id === currentFile ? colors.files.selectedForeground : '')
                }}
              >
                {file.name}
              </li>
            )
          })}
        </ul>
      </div>
    </Popup>
  )
}

export default FileSelectorPopup
