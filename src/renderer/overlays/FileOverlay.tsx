import React, { FunctionComponent, ReactElement, useEffect } from 'react'
import { List } from '../components/elements/List'
import { FileListItem } from '../components/files/FileListItem'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { FocusElementType, setActiveOverlay } from '../store/storeApp'
import { SerializableFile, setCurrentFile } from '../store/storeFiles'
import { Overlay } from './Overlay'

const FileOverlay: FunctionComponent = (): ReactElement => {
  const dispatch = useAppDispatch()
  const files = useAppSelector(state => state.files.files)

  const { to } = useKeyboardNavigation(
    'file/quick_change',
    FocusElementType.Page,
    {
      Escape: (to) => {
        dispatch(setActiveOverlay(null))
        to('editor/editor')
      }
    },
    undefined,
    () => {
      to('file/quick_change/list')
    }
  )

  useEffect(() => {
    to('file/quick_change/list')
    return () => {
      to('editor/editor')
    }
  }, [])

  const openFile = (selected: SerializableFile): void => {
    dispatch(setCurrentFile(selected.id))
    dispatch(setActiveOverlay(null))
    to('editor/editor')
  }

  return (
    <Overlay type='box'>
      <div
        style={{
          gridTemplateRows: '1fr'
        }}
        className='grid h-full'
      >
        <List<SerializableFile>
          focusId='file/quick_change/list'
          items={files ?? []}
          onClick={(item) => openFile(item)}
          display={(item, index, selected) => <FileListItem key={index} index={index} item={item} selected={selected} />}
        />
      </div>
    </Overlay>
  )
}

export { FileOverlay }
