import React, { ReactElement, useState } from 'react'
import Page from './Page'
import Button from '../components/elements/Button'
import { ThemedEditor } from '../components/ThemedEditor'
import log from '../log'
import { readSnippets, writeSnippets, PATH_FILE_SNIPPETS, loadSnippets } from '../services/snippetsService'
import useAsyncEffect from 'use-async-effect'
import { Snippet } from '../../shared/types'
import YAML from 'yaml'

const SnippetsPage: React.FunctionComponent = (): ReactElement => {
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })

  let currentText: string = editorProps.text

  log.debug('rerender')
  useAsyncEffect(async () => {
    log.debug('loading snippets page')

    const snippetsRaw = await readSnippets()
    currentText = snippetsRaw
    setEditorProps({
      path: PATH_FILE_SNIPPETS,
      text: currentText
    })
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
      <div className='flex flex-col h-full'>
        <ThemedEditor language='yaml' path={editorProps.path} initialText={editorProps.text} onTextChanged={onTextChanged} showMinimap={false} />
        <div className='p-2 self-end'>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </Page>
  )
}

export default SnippetsPage
