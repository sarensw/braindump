import React, { ReactElement, useState, useEffect } from 'react'
import Page from './Page'
import Button from '../components/elements/Button'
import { ThemedEditor } from '../components/ThemedEditor'
import log from '../log'
import { readSnippets, writeSnippets, PATH_FILE_SNIPPETS, loadSnippets } from '../services/snippetsService'
import useAsyncEffect from 'use-async-effect'
import { Snippet } from '../../shared/types'
import YAML from 'yaml'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'
import { setActivePage } from '../store/storeApp'
import { useDispatch } from 'react-redux'

const SnippetsPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useDispatch()
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })

  let currentText: string = editorProps.text

  useAsyncEffect(async () => {
    log.debug('loading snippets page')

    const snippetsRaw = await readSnippets()
    currentText = snippetsRaw
    setEditorProps({
      path: PATH_FILE_SNIPPETS,
      text: currentText
    })
  }, [])

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
    registerHotkey(escHk, 'editor', null)
    return () => {
      unregisterHotkey(escHk)
    }
  }, [])

  const save = async (): Promise<void> => {
    let snippets: Snippet[] = []
    snippets = YAML.parse(currentText) as Snippet[]
    await writeSnippets(snippets)
    await loadSnippets()
  }

  const onTextChanged = (text: string): void => {
    currentText = text
  }

  return (
    <Page>
      <div
        className='grid h-full'
        style={{
          gridTemplateRows: '[editor] minmax(0, 1fr) [save] 2.8rem',
          gridTemplateColumns: 'minmax(0, 1fr)'
        }}
      >
        <ThemedEditor language='yaml' path={editorProps.path} initialText={editorProps.text} onTextChanged={onTextChanged} showMinimap={false} />
        <div className='p-2 justify-self-end'>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </Page>
  )
}

export default SnippetsPage
