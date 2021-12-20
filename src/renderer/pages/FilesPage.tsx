import React, { ReactElement, useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { Direction } from '../common/direction'
import { FilesHeader } from '../components/FilesHeader'
import { useAppSelector } from '../hooks'
import { moveFile, setLastUsedFile } from '../services/fileService'
import { setActivePage } from '../store/storeApp'
import { setCurrentHeaders } from '../store/storeEditor'
import { setCurrentFile } from '../store/storeFiles'
import Page from './Page'

const FilesPage: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files.files)
  const currentFile = useAppSelector(state => state.files.current)
  const colors = useAppSelector(state => state.themeNew.colors)
  const [selected, setSelected] = useState<string | null>(currentFile)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCurrentHeaders(null))
  }, [])

  useHotkeys(['up', 'down'].join(','), (event) => {
    if (files === null) return
    const currentIndex = files.findIndex(f => f.id === selected)
    if (event.key === 'ArrowUp') {
      if (currentIndex === 0) return
      const newSelected = files[currentIndex - 1].id
      setSelected(newSelected)
      dispatch(setCurrentFile(newSelected))
    } else {
      if (currentIndex === files.length - 1) return
      const newSelected = files[currentIndex + 1].id
      setSelected(newSelected)
      dispatch(setCurrentFile(newSelected))
    }
  }, [selected, files])

  useHotkeys(['command+up', 'command+down'].join(','), (event) => {
    if (event.key === 'ArrowUp') moveFile(Direction.Up)
    if (event.key === 'ArrowDown') moveFile(Direction.Down)
  })

  useHotkeys('enter', (event) => {
    if (selected === null) return
    event.preventDefault()
    dispatch(setActivePage('editor'))
    dispatch(setCurrentFile(selected))
    setLastUsedFile(selected).then(() => {}, () => {})
  }, [selected])

  /* useHotkeys(['a'].join(','), (event) => {
    dispatch(setFilesSearch(event.key))
  }) */

  let previousCluster = ''

  return (
    <Page>
      <FilesHeader />
      <div
        className='mt-2'
        style={{
        }}
      >
        <ul>
          {files?.map((file, index) => {
            const cluster = file.cluster === undefined || file.cluster === null ? '' : file.cluster
            const hideHeader = cluster === previousCluster
            previousCluster = cluster
            const itemPadding = cluster === '' ? '26px' : '46px'
            if (file.id === selected) {
              return (
                <>
                  {!hideHeader && <li key={`braindump_files_header_${index}`} className='h-6 flex flex-row items-center font-bold' style={{ paddingLeft: '26px', color: colors.editorTokens.header.foreground }}>{file.cluster}</li>}
                  <li key={index} className='h-6 flex flex-row items-center' style={{ paddingLeft: itemPadding, background: colors.files.selectedForeground }}>{file.name}</li>
                </>
              )
            } else {
              return (
                <>
                  {!hideHeader && <li key={`braindump_files_header_${index}`} className='h-6 flex flex-row items-center font-bold' style={{ paddingLeft: '26px', color: colors.editorTokens.header.foreground }}>{file.cluster}</li>}
                  <li key={index} className='h-6 flex flex-row items-center' style={{ paddingLeft: itemPadding }}>{file.name}</li>
                </>
              )
            }
          })}
        </ul>
      </div>
    </Page>
  )
}

export default FilesPage
