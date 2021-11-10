import React, { ReactElement, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { ThemedEditor } from './ThemedEditor'
import { Monaco } from '@monaco-editor/react'
import log from '../log'
import { BraindownLanguage } from '../braindown/braindownLanguage'
import { run as extensionsRun } from '../extensions/extensions'
import { handleKeyDownEvent } from '../hotkeys'
import { setDirtyText } from '../store/storeFiles'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'

interface BraindownEditorProps {
  path: string
  initialText?: string
  onTextChanged?: (text: string) => void
}

export const BraindownEditor = ({ path, initialText = '', onTextChanged = (text) => {} }: BraindownEditorProps): ReactElement => {
  const dispatch = useDispatch()
  const braindown = useRef<BraindownLanguage | null>(null)
  const settings = useAppSelector(state => state.settings)

  useEffect(() => {
    return () => {
      if (braindown.current !== null) {
        log.debug('Unmounting the braindown editor')
        braindown.current.clear()
      }
    }
  }, [])

  async function handleEditorDidMount (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco): Promise<void> {
    log.debug('braindown editor did mount')

    // register the new language handler
    braindown.current = new BraindownLanguage()
    braindown.current.initialize(codeEditor, monaco)

    ;(codeEditor as any).onDidType(function (text: string) {
      extensionsRun(text, codeEditor)
      braindown.current?.handleInput(text)
    })
    codeEditor.onKeyDown((event) => {
      handleKeyDownEvent(event.browserEvent, 'monaco')
    })

    // set the focus once
    if (codeEditor !== null) codeEditor.focus()
  }

  function textChanged (text: string): void {
    dispatch(setDirtyText(text))
  }

  return (
    <ThemedEditor
      language='braindown'
      path={path}
      initialText={initialText}
      onTextChanged={textChanged}
      onEditorDidMount={handleEditorDidMount}
      showMinimap={settings['editor.minimap.show']}
    />
  )
}
