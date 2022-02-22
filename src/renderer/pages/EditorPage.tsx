import React, { ReactElement, useEffect, useState } from 'react'
import Page from './Page'
import Dumps from '../components/Dumps'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { readFile } from '../services/fileService'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import { setActivePage, setFocusElement } from '../store/storeApp'
import EditorHeader from '../components/EditorHeader'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'
import { setCurrentFile, setViewState } from '../store/storeFiles'

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

  useEffect(() => {
    const escHk = {
      id: 'editor:esc',
      key: 'esc',
      description: 'list notes',
      action: (source, codeEditor): boolean => {
        dispatch(setActivePage('files'))
        return true
      }
    }
    const up = {
      id: 'files:up',
      key: 'command+k',
      description: 'select prev',
      action: (source, codeEditor): boolean => {
        if (codeEditor !== null) {
          // store the view state
          const viewState = codeEditor.saveViewState()
          dispatch(setViewState(JSON.stringify(viewState)))
        }

        // change the file
        if (files.files === null) return true
        const currentIndex = files.files?.findIndex(f => f.id === files.current)
        if (currentIndex === 0) return true
        const newSelected = files.files[currentIndex - 1].id
        dispatch(setCurrentFile(newSelected))

        return true
      }
    }
    const down = {
      id: 'files:down',
      key: 'command+j',
      description: 'select next',
      action: (source, codeEditor): boolean => {
        if (codeEditor !== null) {
          // store the view state
          const viewState = codeEditor.saveViewState()
          dispatch(setViewState(JSON.stringify(viewState)))
        }

        // change the file
        if (files === null || files.files === null || files.files === undefined) return true
        const currentIndex = files.files?.findIndex(f => f.id === files.current)
        if (currentIndex === files.files?.length - 1) return true
        const newSelected = files.files[currentIndex + 1].id
        dispatch(setCurrentFile(newSelected))

        return true
      }
    }
    registerHotkey(up, 'editor', null)
    registerHotkey(down, 'editor', null)
    registerHotkey(escHk, 'editor', null)
    return () => {
      unregisterHotkey(up)
      unregisterHotkey(down)
      unregisterHotkey(escHk)
    }
  }, [files.current])

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
