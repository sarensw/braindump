import React, { ReactElement, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { set } from '../store/storeApp'
import { setCurrentFile } from '../store/storeFiles'
import Page from './Page'

const FilesPage: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files)
  const [selected, setSelected] = useState<string | null>(files.current)
  const dispatch = useDispatch()

  useHotkeys(['up', 'down'].join(','), (event) => {
    if (files.files === null) return
    const currentIndex = files.files.findIndex(f => f.id === selected)
    if (event.key === 'ArrowUp') {
      if (currentIndex === 0) return
      const newSelected = files.files[currentIndex - 1].id
      setSelected(newSelected)
    } else {
      if (currentIndex === files.files.length - 1) return
      const newSelected = files.files[currentIndex + 1].id
      setSelected(newSelected)
    }
  }, [selected])

  useHotkeys('enter', (event) => {
    if (selected === null) return
    event.preventDefault()
    dispatch(set('editor'))
    dispatch(setCurrentFile(selected))
  }, [selected])

  return (
    <Page>
      <ul>
        {files.files?.map((file, index) => {
          if (file.id === selected) {
            return <li key={index} className='bg-green-200'>{file.name}</li>
          } else {
            return <li key={index}>{file.name}</li>
          }
        })}
      </ul>
    </Page>
  )
}

export default FilesPage