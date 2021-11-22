import React, { ReactElement, useState } from 'react'
import Page from './Page'
import Dumps from '../components/Dumps'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppSelector } from '../hooks'
import { readFile } from '../services/fileService'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import { set } from '../store/storeApp'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useDispatch()
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })
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

  useHotkeys('esc', (event) => {
    event.preventDefault()
    dispatch(set('files'))
  })

  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateRows: '[header] 2.4rem [main] minmax(0, 1fr)',
          gridTemplateColumns: 'minmax(0, 1fr)'
        }}
      >
        <Dumps />

        <BraindownEditor
          path={editorProps.path}
          initialText={editorProps.text}
        />
      </div>
    </Page>
  )
}

export default EditorPage
