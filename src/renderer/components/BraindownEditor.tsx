import React, { ReactElement, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { ThemedEditor } from './ThemedEditor'
import { Monaco } from '@monaco-editor/react'
import log from '../log'
import { BraindownLanguage } from '../braindown/braindownLanguage'
import { run as extensionsRun } from '../extensions/extensions'
import { handleKeyDownEvent } from '../hotkeys'
import { setDirtyText } from '../store/storeFiles'
import { setCurrentHeaders, setCursorPosition } from '../store/storeEditor'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { setFileName } from '../services/fileService'

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

  async function textChanged (text: string, changes: monaco.editor.IModelContentChange[]): Promise<void> {
    // check if the first line of the text has changed, in this case
    // the title/name of the file changed, so the file itself has to
    // be updated
    for (const change of changes) {
      if (change.range.startLineNumber === 1) {
        const name = text.split('\n', 1)[0]
        await setFileName(path, name)
        break
      }
    }

    // text changed, flag the text dirty for being saved later
    dispatch(setDirtyText(text))
  }

  function handleCursorPositionChanged (event: monaco.editor.ICursorPositionChangedEvent, textModel: monaco.editor.ITextModel | null): void {
    dispatch(setCursorPosition({ line: event.position.lineNumber, column: event.position.column }))

    if (textModel !== null) {
      let line = event.position.lineNumber
      let headers: string[] | null = null
      while (line > 0) {
        const lineContent = textModel.getLineContent(line)
        if (lineContent.match(/^#{1,6} .*/) !== null) {
          if (headers === null) headers = new Array<string>()
          headers.unshift(lineContent.substr(lineContent.indexOf(' ') + 1))
          if (lineContent.match(/^# .*/) !== null) break
        }
        line--
      }
      dispatch(setCurrentHeaders(headers))
    }
  }

  return (
    <ThemedEditor
      language='braindown'
      path={path}
      initialText={initialText}
      onTextChanged={textChanged}
      onEditorDidMount={handleEditorDidMount}
      onCursorPositionChanged={handleCursorPositionChanged}
      showMinimap={settings['editor.minimap.show']}
      wordWrap={settings['editor.wordwrap']}
      lineNumbers={settings['editor.linenumbers.show']}
    />
  )
}
