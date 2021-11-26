import React, { ReactElement, useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { setLastUsedFile } from '../services/fileService'
import { set } from '../store/storeApp'
import { setCurrentHeaders } from '../store/storeEditor'
import { setCurrentFile } from '../store/storeFiles'
import Page from './Page'

const FilesPage: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files)
  const [selected, setSelected] = useState<string | null>(files.current)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCurrentHeaders(null))
  }, [])

  useHotkeys(['up', 'down'].join(','), (event) => {
    if (files.files === null) return
    const currentIndex = files.files.findIndex(f => f.id === selected)
    if (event.key === 'ArrowUp') {
      if (currentIndex === 0) return
      const newSelected = files.files[currentIndex - 1].id
      setSelected(newSelected)
      dispatch(setCurrentFile(newSelected))
    } else {
      if (currentIndex === files.files.length - 1) return
      const newSelected = files.files[currentIndex + 1].id
      setSelected(newSelected)
      dispatch(setCurrentFile(newSelected))
    }
  }, [selected])

  useHotkeys('enter', (event) => {
    if (selected === null) return
    event.preventDefault()
    dispatch(set('editor'))
    dispatch(setCurrentFile(selected))
    setLastUsedFile(selected).then(() => {}, () => {})
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
