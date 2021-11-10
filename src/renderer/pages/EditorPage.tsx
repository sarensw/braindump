import React, { ReactElement, useState } from 'react'
import Page from './Page'
import Dumps from '../components/Dumps'
import { useAppSelector } from '../hooks'
import { readFile } from '../services/fileService'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })
  const colors = useAppSelector(state => state.theme.colors)
  const files = useAppSelector(state => state.files)

  useAsyncEffect(async () => {
    if (files.current !== null) {
      const file = files.files?.find(f => f.id === files.current)

      if (file !== undefined) {
        const fileRaw = await readFile(file.path)

        setEditorProps({
          path: file.path,
          text: fileRaw
        })
      }
    }
  }, [files.current])

  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateRows: '[header] 2.2rem [main] minmax(0, 1fr)'
        }}
      >
        <div
          className='grid'
          style={{
            backgroundColor: colors['editorGroupHeader.tabsBackground'],
            gridTemplateColumns: '1fr 26px'
          }}
        >
          <Dumps />
        </div>

        <BraindownEditor
          path={editorProps.path}
          initialText={editorProps.text}
        />
      </div>
    </Page>
  )
}

export default EditorPage
