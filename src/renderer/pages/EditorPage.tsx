import React, { ReactElement, useState, useEffect } from 'react'
import Page from './Page'
import Dumps from '../components/Dumps'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppSelector } from '../hooks'
import { readFile, setFileName } from '../services/fileService'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import { set, setFocusElement } from '../store/storeApp'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useDispatch()
  let refFileNameInput: HTMLInputElement | null = null
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })
  const [name, setName] = useState('')
  const files = useAppSelector(state => state.files)
  const focusElement = useAppSelector(state => state.app.focusElement)
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
        setName(file.name)
      }
    }
  }, [files.current])

  useEffect(() => {
    if (focusElement === 'fileName') {
      refFileNameInput?.select()
      refFileNameInput?.focus()
    }
    return () => {
      dispatch(setFocusElement(''))
    }
  }, [focusElement])

  useHotkeys('esc', (event) => {
    event.preventDefault()
    dispatch(set('files'))
  })

  const handleNameChange = async (event): Promise<void> => {
    setName(event.target.value)
    await setFileName(editorProps.path, event.target.value)
  }

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

        <div className='flex flex-row p-4 text-xl font-mono'>
          <input ref={el => { refFileNameInput = el }} className='flex-grow' type='text' value={name} onChange={handleNameChange} />
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
