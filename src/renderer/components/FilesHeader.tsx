import React, { FunctionComponent, ReactElement } from 'react'
// import useAsyncEffect from 'use-async-effect'
// import { prettyBites } from '../common/prettyBites'
import { useAppSelector } from '../hooks'
// import { calculateOverallFileSizes } from '../services/fileService'

const FilesHeaderField: FunctionComponent<{content: string}> = ({ content }): ReactElement => {
  const colors = useAppSelector(state => state.themeNew.colors)

  return (
    <div
      className='text-sm border p-0.5 px-1.5 rounded'
      style={{
        borderColor: colors.foreground ?? '#06bee1',
        backgroundColor: colors.background ?? '#e1e1e1',
        color: colors.files.foreground
      }}
    >
      {content}
    </div>
  )
}

const FilesHeader: FunctionComponent = (): ReactElement => {
  const count = useAppSelector(state => state.files.files?.length)
  /* const filesSearch = useAppSelector(state => state.files.filesSearch)
  const [filesSize, setFilesSize] = useState('') */

  /* useAsyncEffect(async () => {
    const result = await calculateOverallFileSizes()
    setFilesSize(`Size: ${prettyBites(result)}`)
  }, []) */

  return (
    <>
      <div
        className='flex flex-row px-4 gap-2'
        style={{
          paddingLeft: '26px'
        }}
      >
        <FilesHeaderField content={`Count: ${count ?? ''}`} />
        {/* <FilesHeaderField content={filesSize} />
        {filesSearch.length > 0 && <FilesHeaderField content={filesSearch} />} */}
      </div>
    </>
  )
}

export { FilesHeader }
