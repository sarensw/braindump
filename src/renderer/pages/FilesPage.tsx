import React, { ReactElement, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Direction } from '../common/direction'
import { FilesHeader } from '../components/FilesHeader'
import { useAppSelector } from '../hooks'
import { moveFile, setLastUsedFile } from '../services/fileService'
import { setActivePage } from '../store/storeApp'
import { setCurrentHeaders } from '../store/storeEditor'
import { CurrentFileWithPosition, setCurrentFile } from '../store/storeFiles'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'
import Page from './Page'

const FilesPage: React.FunctionComponent = (): ReactElement => {
  const files = useAppSelector(state => state.files.files)
  const currentFile = useAppSelector(state => state.files.current)
  const colors = useAppSelector(state => state.themeNew.colors)
  const [selected, setSelected] = useState<CurrentFileWithPosition | null>(currentFile)
  const dispatch = useDispatch()

  const container = React.createRef<HTMLDivElement>()
  const refs = files?.reduce((acc, value) => {
    acc[value.id] = React.createRef()
    return acc
  }, {}) ?? []

  useEffect(() => {
    dispatch(setCurrentHeaders(null))
    setSelected(currentFile)
  }, [])

  useEffect(() => {
    if (refs == null || selected == null || container == null || container.current == null) return
    if (refs[selected.id] == null) return

    const element = refs[selected.id].current
    if (element != null) {
      if (element.getBoundingClientRect().top < container.current.getBoundingClientRect().top) {
        element.scrollIntoView()
      } else if (element.getBoundingClientRect().bottom > container.current.getBoundingClientRect().bottom) {
        element.scrollIntoView(false)
      }
    }
  }, [selected])

  useEffect(() => {
    const up = {
      id: 'files:up',
      key: ['down', 'command+k'],
      description: 'select prev',
      action: (source, codeEditor): boolean => {
        if (files === null) return true
        const currentIndex = files.findIndex(f => f.id === selected?.id)
        if (currentIndex === files.length - 1) return true
        const newSelected = files[currentIndex + 1].id
        setSelected({
          id: newSelected
        })
        dispatch(setCurrentFile({
          id: newSelected
        }))
        return true
      }
    }
    const down = {
      id: 'files:down',
      key: ['up', 'command+j'],
      description: 'select next',
      action: (source, codeEditor): boolean => {
        if (files === null) return true
        const currentIndex = files.findIndex(f => f.id === selected?.id)
        if (currentIndex === 0) return true
        const newSelected = files[currentIndex - 1].id
        setSelected({
          id: newSelected
        })
        dispatch(setCurrentFile({
          id: newSelected
        }))
        return true
      }
    }
    const moveUp = {
      id: 'files:move:up',
      key: 'command+up',
      description: 'move up',
      action: (source, codeEditor): boolean => {
        moveFile(Direction.Up)
        return true
      }
    }
    const moveDown = {
      id: 'files:move:down',
      key: 'command+down',
      description: 'move down',
      action: (source, codeEditor): boolean => {
        moveFile(Direction.Down)
        return true
      }
    }
    const selectNote = {
      id: 'files:move:select',
      key: 'enter',
      description: 'select note',
      action: (source, codeEditor): boolean => {
        if (selected === null) return true
        dispatch(setActivePage('editor'))
        dispatch(setCurrentFile({
          id: selected.id
        }))
        const selectedFileId = (typeof selected === 'string' ? selected : selected.id)
        setLastUsedFile(selectedFileId).then(() => {}, () => {})
        return true
      }
    }
    registerHotkey(up, 'files', null)
    registerHotkey(down, 'files', null)
    registerHotkey(moveUp, 'files', null)
    registerHotkey(moveDown, 'files', null)
    registerHotkey(selectNote, 'files', null)
    return () => {
      unregisterHotkey(up)
      unregisterHotkey(down)
      unregisterHotkey(moveUp)
      unregisterHotkey(moveDown)
      unregisterHotkey(selectNote)
    }
  }, [selected, files])

  const fileSelected = (id: string): void => {
    if (files == null || selected == null) return
    if (selected.id === id) {
      // file already selected
    } else {
      // select that file
      setSelected({ id })
      dispatch(setCurrentFile({ id }))
    }
  }

  const fileSelectedToOpen = (id: string): void => {
    if (files == null || selected == null) return
    if (selected.id === id) {
      // file already selected
    } else {
      // select that file
      setSelected({ id })
      dispatch(setCurrentFile({ id }))
    }
    if (selected === null) return
    dispatch(setActivePage('editor'))
    dispatch(setCurrentFile(selected))

    const selectedFileId = (typeof selected === 'string' ? selected : selected.id)
    setLastUsedFile(selectedFileId).then(() => {}, () => {})
  }

  let previousCluster = ''

  const getCurrentFileId = (stateCurrent: string | CurrentFileWithPosition | null): string | null => {
    if (typeof stateCurrent === 'object' && stateCurrent != null) {
      return stateCurrent?.id
    } else if (typeof stateCurrent === 'string') {
      return stateCurrent
    }

    return null
  }

  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateColumns: '[shell] minmax(0, 1fr)',
          gridTemplateRows: '[header] auto [files] minmax(0, 1fr)'
        }}
      >
        <FilesHeader />
        <div
          ref={container}
          className='overflow-y-auto styled-scrollbars'
        >
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
                const currentFileId = getCurrentFileId(selected)
                if (file.id === currentFileId) {
                  return (
                    <React.Fragment key={index}>
                      {!hideHeader &&
                        <li
                          key={`braindump_files_header_${index}`}
                          className='h-6 flex flex-row items-center font-bold'
                          style={{
                            paddingLeft: '26px',
                            color: colors.files.headerForeground,
                            backgroundColor: colors.files.headerBackground
                          }}
                        >{file.cluster}
                        </li>}
                      <li
                        key={index}
                        ref={refs[file.id]}
                        className='h-6 flex flex-row items-center'
                        style={{
                          paddingLeft: itemPadding,
                          background: colors.files.selectedBackground,
                          color: colors.files.selectedForeground
                        }}
                        onClick={() => fileSelected(file.id)}
                        onDoubleClick={() => fileSelectedToOpen(file.id)}
                      >{file.name}
                      </li>
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={index}>
                      {!hideHeader &&
                        <li
                          key={`braindump_files_header_${index}`}
                          ref={refs[file.id]}
                          className='h-6 flex flex-row items-center font-bold'
                          style={{
                            paddingLeft: '26px',
                            color: colors.files.headerForeground,
                            backgroundColor: colors.files.headerBackground
                          }}
                        >{file.cluster}
                        </li>}
                      <li
                        key={index}
                        className='h-6 flex flex-row items-center'
                        style={{
                          paddingLeft: itemPadding,
                          color: colors.files.foreground
                        }}
                        onClick={() => fileSelected(file.id)}
                      >{file.name}
                      </li>
                    </React.Fragment>
                  )
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default FilesPage
