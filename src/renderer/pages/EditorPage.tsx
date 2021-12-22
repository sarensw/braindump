import React, { ReactElement, useEffect, useState } from 'react'
import Page from './Page'
import Dumps from '../components/Dumps'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppSelector } from '../hooks'
import { readFile } from '../services/fileService'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import { setActivePage, setFocusElement } from '../store/storeApp'
import EditorHeader from '../components/EditorHeader'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useDispatch()
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })
  const files = useAppSelector(state => state.files)
  const settings = useAppSelector(state => state.settings)

  useAsyncEffect(async () => {
    if (files.current !== null) {
      const file = files.files?.find(f => f.id === files.current)

      if (file !== undefined) {
        const fileRaw = await readFile(file.path)

        setEditorProps({
          path: file.path,
          text: fileRaw
        })

        if (file.isNew) {
          dispatch(setFocusElement('fileName'))
        }
      }
    }
  }, [files.current])

  // useHotkeys('esc', (event) => {
  //   event.preventDefault()
  //   dispatch(setActivePage('files'))
  // },
  // {
  //   enableOnTags: ['INPUT']
  // })

  useEffect(() => {
    const escHk = {
      id: 'editor:esc',
      key: 'esc',
      description: 'Return to files page',
      action: (source, codeEditor): boolean => {
        dispatch(setActivePage('files'))
        return true
      }
    }
    registerHotkey(escHk, 'editor', null)
    return () => {
      unregisterHotkey(escHk)
    }
  }, [])

  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateRows: '[header] auto [name] auto [main] minmax(0, 1fr)',
          gridTemplateColumns: 'minmax(0, 1fr)'
        }}
      >
        <div>
          {settings['tabs.show'] &&
            <Dumps />}
        </div>

        <EditorHeader path={editorProps.path} />

        <BraindownEditor
          path={editorProps.path}
          initialText={editorProps.text}
        />
      </div>
    </Page>
  )
}

export default EditorPage
