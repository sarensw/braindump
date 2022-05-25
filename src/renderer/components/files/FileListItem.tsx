import React, { ReactElement } from 'react'
import { useAppSelector } from '../../hooks'
import { SerializableFile } from '../../store/storeFiles'

const FileListItem = (props): ReactElement => {
  const item = props.item as SerializableFile
  const colors = useAppSelector(state => state.themeNew.colors)

  return (
    <div className='flex flex-row gap-4'>
      <div
        className='truncate flex-grow'
        style={{
          color: props.selected === true ? colors.list.selectedForeground : colors.list.foreground
        }}
      >{item.name}
      </div>
    </div>
  )
}

export { FileListItem }
