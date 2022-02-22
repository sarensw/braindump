import React, { ReactElement, useRef, useEffect, useState } from 'react'
import * as monaco from 'monaco-editor'
import { ThemedEditor } from './ThemedEditor'
import { Monaco } from '@monaco-editor/react'
import log from '../log'
import { BraindownLanguage } from '../braindown/braindownLanguage'
import { run as extensionsRun } from '../extensions/extensions'
import { handleKeyDownEvent } from '../hotkeys'
import { setDirtyText, setLastCursorPosition, setViewState } from '../store/storeFiles'
import { setCurrentHeaders, setCursorPosition, setDecorationsSizes } from '../store/storeEditor'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { getViewState, persist } from '../services/fileService'
import { Positionable } from '../common/cursorPosition'

interface BraindownEditorProps {
  path: string
  initialText?: string
  onTextChanged?: (text: string) => void
}

export const BraindownEditor = ({ path, initialText = '', onTextChanged = (text) => {} }: BraindownEditorProps): ReactElement => {
  const dispatch = useDispatch()
  const braindown = useRef<BraindownLanguage | null>(null)
  const settings = useAppSelector(state => state.settings)
  const current = useAppSelector(state => state.files.current)
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    window.addEventListener('beforeunload', persistDuringUnload)
    return () => {
      // store the view state
      const viewState = braindown.current?.editor.saveViewState()
      dispatch(setViewState(JSON.stringify(viewState)))

      if (braindown.current !== null) {
        log.debug('Unmounting the braindown editor')
        braindown.current.clear()
      }
      window.removeEventListener('beforeunload', persistDuringUnload)
    }
  }, [])

  useEffect(() => {
    log.debug('current file has changed from the outside in the braindown editor')
    if (codeEditor === null) return
    resetViewState(codeEditor)
  }, [current])

  const persistDuringUnload = (e): void => {
    log.debug('window is about to be unloaded, request to persist the current state')

    // setting view state first
    const viewState = braindown.current?.editor.saveViewState()
    dispatch(setViewState(JSON.stringify(viewState)))

    // persist the content of the file
    persist()
  }

  function handleEditorDidMount (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco): void {
    log.debug('braindown editor did mount')

    // register the new language handler
    braindown.current = new BraindownLanguage()
    braindown.current.initialize(codeEditor, monaco)

    ;(codeEditor as any).onDidType(function (text: string) {
      extensionsRun(text, codeEditor)
      braindown.current?.handleInput(text)
    })
    codeEditor.onDidChangeModelContent((event) => {
      // for (const change of event.changes) {
      //   extensionsRun(change.text, codeEditor)
      //   if (change.text.length > 0) braindown.current?.handleInput(change.text)
      //   if (change.text.length === 0) braindown.current?.handleDeletion()
      // }
      braindown.current?.calculateDeltaDecorations()
    })
    codeEditor.onDidChangeModel((event) => {
      braindown.current?.calculateDeltaDecorations()
    })
    codeEditor.onKeyDown((event) => {
      handleKeyDownEvent(event.browserEvent, 'monaco', codeEditor)
    })

    // get the initial layout and make sure that we get notified
    // about layout updates
    const layoutInfo = codeEditor.getLayoutInfo()
    dispatch(setDecorationsSizes({
      decorationsLeft: layoutInfo.decorationsLeft,
      decorationsWidth: layoutInfo.decorationsWidth
    }))
    codeEditor.onDidLayoutChange((event) => {
      dispatch(setDecorationsSizes({
        decorationsLeft: event.decorationsLeft,
        decorationsWidth: event.decorationsWidth
      }))
    })
  }

  function resetViewState (codeEditor: monaco.editor.IStandaloneCodeEditor): void {
    const viewStateString = getViewState(current)

    log.debug('setting focus and cursor position')
    if (viewStateString !== null) {
      const viewState = JSON.parse(viewStateString)
      codeEditor.restoreViewState(viewState)
    }
  }

  function handleLoaded (codeEditor: monaco.editor.IStandaloneCodeEditor): void {
    // set the focus once
    if (codeEditor !== null) {
      resetViewState(codeEditor)

      // set the focus to the editor
      codeEditor.focus()
    }

    setCodeEditor(codeEditor)
  }

  async function textChanged (text: string, changes: monaco.editor.IModelContentChange[]): Promise<void> {
    // text changed, flag the text dirty for being saved later
    dispatch(setDirtyText(text))
  }

  function handleCursorPositionChanged (event: monaco.editor.ICursorPositionChangedEvent, textModel: monaco.editor.ITextModel | null): void {
    const position = { line: event.position.lineNumber, column: event.position.column }
    dispatch(setCursorPosition(position as Positionable))
    dispatch(setLastCursorPosition(position as Positionable))

    // detect headers
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
      onLoaded={handleLoaded}
      onCursorPositionChanged={handleCursorPositionChanged}
      showMinimap={settings['editor.minimap.show']}
      wordWrap={settings['editor.wordwrap']}
      lineNumbers={settings['editor.linenumbers.show']}
    />
  )
}
