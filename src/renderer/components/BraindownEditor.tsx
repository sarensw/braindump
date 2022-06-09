import { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BraindownLanguage } from '../braindown/braindownLanguage'
import { initVimMode } from '../braindown/vim/vimMode'
import { run as extensionsRun } from '../extensions/extensions'
import { useAppSelector } from '../hooks'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { handleKeyDownEvent } from '../hotkeys'
import log from '../log'
import { getViewState, persist } from '../services/fileService'
import { FocusElementType } from '../store/storeApp'
import { setCurrentHeaders, setDecorationsSizes } from '../store/storeEditor'
import { setDirtyText, setViewState } from '../store/storeFiles'
import { ThemedEditor } from './ThemedEditor'

interface BraindownEditorProps {
  path: string
  initialText?: string
  onTextChanged?: (text: string) => void
}

export const BraindownEditor = ({
  path,
  initialText = '',
  onTextChanged = (text) => {}
}: BraindownEditorProps): ReactElement => {
  const dispatch = useDispatch()
  const braindown = useRef<BraindownLanguage | null>(null)
  const settings = useAppSelector(state => state.settings)
  const current = useAppSelector(state => state.files.current)
  const overlay = useAppSelector(state => state.app.overlay)
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  const { to, handle } = useKeyboardNavigation(
    'editor/editor',
    FocusElementType.Element,
    {
      CmdCtrl_R: (to) => to('editor/header/name')
    },
    undefined,
    () => {
      codeEditor?.focus()
    }
  )

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
    log.debug('current file has changed from the outside')
    if (codeEditor == null) return
    resetViewState(codeEditor)
  }, [current])

  useEffect(() => {
    log.debug('overlay status changed, persisting')
    if (codeEditor == null) return
    if (overlay == null) return
    persistDuringUnload(null)
  }, [overlay])

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
    braindown.current.initialize(codeEditor, monaco, handle)

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

    // enable vim mode if selected by the user
    if (settings['editor.mode'] === 'vim') {
      const statusNode = document.querySelector('.status-node')
      initVimMode(codeEditor, statusNode)
    }
  }

  function resetViewState (codeEditor: monaco.editor.IStandaloneCodeEditor): void {
    if (current == null) return

    if (current.line != null && current.column != null) {
      log.debug('setting focus and cursor position based on input')
      const position = {
        lineNumber: current.line,
        column: current.column
      }
      codeEditor.setPosition(position)
      codeEditor.revealPosition(position)
    } else {
      log.debug('setting focus and cursor position based on view state')

      const viewStateString = getViewState(current.id)
      if (viewStateString !== null) {
        const viewState = JSON.parse(viewStateString)
        codeEditor.restoreViewState(viewState)
      }
    }
    codeEditor.focus()
  }

  function handleLoaded (codeEditor: monaco.editor.IStandaloneCodeEditor): void {
    log.debug('model loaded')

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
    // detect headers
    if (textModel !== null) {
      let line = event.position.lineNumber
      let headers: string[] | null = null
      let currentLevel: number = Number.MAX_VALUE
      while (line > 0) {
        const lineContent = textModel.getLineContent(line)
        const groups = lineContent.match(/^(#{1,6}) (.*)/)
        if (groups !== null) {
          if (headers === null) headers = new Array<string>()
          const level = groups[1].length
          if (level < currentLevel) {
            currentLevel = level
            const header = groups[2]
            headers?.unshift(header)
          }
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
      onDidFocusEditorText={() => to('editor/editor')}
      showMinimap={settings['editor.minimap.show']}
      wordWrap={settings['editor.wordwrap']}
      lineNumbers={settings['editor.linenumbers.show']}
    />
  )
}
