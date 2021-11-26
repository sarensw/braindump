import React, { ReactElement, useRef } from 'react'
import styled from '../themes/themed-styled-component'
import log from '../log'
import Tab from './elements/Tab'
import { File } from '../store/files/file'
import { flushFile, createNewFile, setLastUsedFile } from '../services/fileService'
import { useAppSelector } from '../hooks'

const AddDumpButton = styled.button`
  color: ${props => props.theme.foreground};
`

const Dumps = (): ReactElement => {
  const files = useAppSelector(state => state.files.files)
  const currentFile = useAppSelector(state => state.files.current)
  const scrollContainer = useRef<HTMLUListElement>(null)
  const colors = useAppSelector(state => state.themeNew.colors)

  const loadDump = async (file: File): Promise<void> => {
    log.debug(`loading dump ${file.name} from ${file.path} as per user request`)
    flushFile()
    // dispatch(setCurrentFile(file.id))
    await setLastUsedFile(file.id)
  }

  const addDump = async (): Promise<void> => {
    log.debug('adding new dump')
    flushFile()
    await createNewFile()
  }

  const isCurrentTabActive = (file: File): boolean => {
    if (currentFile === null || currentFile === undefined) return false
    if (file.id === currentFile) return true
    return false
  }

  const onWheel = (evt: any): void => {
    evt.preventDefault()
    if (scrollContainer !== undefined) {
      if (scrollContainer.current !== null) {
        scrollContainer.current.scrollLeft += evt.deltaY as number
      }
    }
  }

  return (
    <>
      <div
        className='grid max-w-full w-full'
        style={{
          backgroundColor: colors.tabs.background,
          gridTemplateColumns: 'minmax(0, 1fr) 26px'
        }}
      >
        <ul ref={scrollContainer} role='tablist' className='flex flex-nowrap  overflow-x-scroll tablist' onWheel={onWheel}>
          {files?.map((file: File, index: number) => {
            return <Tab key={index} onClick={async () => await loadDump(file)} active={isCurrentTabActive(file)} tab={file} fid={file.id}>{file.name}</Tab>
          })}
        </ul>
        <AddDumpButton className='text-xl px-2' onClick={addDump}>+</AddDumpButton>
      </div>
    </>
  )
}

export default Dumps
