import React, { ReactElement } from 'react'
import { SerializableFile } from '../../store/storeFiles'

const FileListItem = (props): ReactElement => {
  const item = props.item as SerializableFile

  return (
    <div className='flex flex-row gap-4'>
      <div className='truncate flex-grow'>{item.name}</div>
    </div>
  )
}

export { FileListItem }
