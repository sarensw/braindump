import React, { ReactElement, useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { Direction } from '../common/direction'
import { useAppSelector } from '../hooks'
import { moveFile, setLastUsedFile } from '../services/fileService'
import { set } from '../store/storeApp'
import { setCurrentHeaders } from '../store/storeEditor'
import { setCurrentFile } from '../store/storeFiles'
import Page from './Page'

const FilesPage: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files)
  const colors = useAppSelector(state => state.themeNew.colors)
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

  useHotkeys(['command+up', 'command+down'].join(','), (event) => {
    if (event.key === 'ArrowUp') moveFile(Direction.Up)
    if (event.key === 'ArrowDown') moveFile(Direction.Down)
  })

  useHotkeys('enter', (event) => {
    if (selected === null) return
    event.preventDefault()
    dispatch(set('editor'))
    dispatch(setCurrentFile(selected))
    setLastUsedFile(selected).then(() => {}, () => {})
  }, [selected])

  return (
    <Page>
      <div
        className='mt-2 font-mono'
        style={{
        }}
      >
        <ul>
          {files.files?.map((file, index) => {
            if (file.id === selected) {
              return <li key={index} className='h-6 flex flex-row items-center' style={{ paddingLeft: '26px', background: colors.files.selectedForeground }}>{file.name}</li>
            } else {
              return <li key={index} className='h-6 flex flex-row items-center' style={{ paddingLeft: '26px' }}>{file.name}</li>
            }
          })}
        </ul>
      </div>
    </Page>
  )
}

export default FilesPage
