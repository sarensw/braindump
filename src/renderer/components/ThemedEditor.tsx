import React, { ReactElement, useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import { useAppSelector } from '../hooks'
import log from '../log'
import { Uri } from 'monaco-editor'
import useAsyncEffect from 'use-async-effect'
import { ITheme } from '../themes/ITheme'

interface ThemedEditorProps {
  language: string
  path: string
  initialText?: string
  onTextChanged?: (text: string, changes: monaco.editor.IModelContentChange[]) => void
  onEditorDidMount?: (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
  onLoaded?: (codeEditor: monaco.editor.IStandaloneCodeEditor) => void
  onCursorPositionChanged?: (event: monaco.editor.ICursorPositionChangedEvent, textModel: monaco.editor.ITextModel | null) => void
  showMinimap: boolean
  wordWrap?: boolean
  lineNumbers?: boolean
}

export const ThemedEditor = ({ language, path, initialText = '', onTextChanged = () => {}, onEditorDidMount = () => {}, onLoaded = () => {}, onCursorPositionChanged = () => {}, showMinimap = false, wordWrap = true, lineNumbers = true }: ThemedEditorProps): ReactElement => {
  const theme = useAppSelector(state => state.themeNew.colors)
  const monaco = useMonaco()
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useAsyncEffect(async () => {
    await load(path, monaco)
  }, [monaco])

  useEffect(() => {
    log.debug('theme changed')
    if (monaco !== undefined && monaco !== null) {
      log.debug('monaco loaded')
      changeTheme(theme, monaco)
    }
  }, [])

  useAsyncEffect(async () => {
    await load(path, monaco)
  }, [path])

  function changeTheme (theme: ITheme, monaco: Monaco): void {
    try {
      // const writableTheme = JSON.parse(JSON.stringify({
      //   type: theme.type,
      //   colors: theme.colors,
      //   tokenColors: theme.tokenColors
      // }))
      // const th = getMonarchTheme(writableTheme)
      const rules = new Array<monaco.editor.ITokenThemeRule>()
      rules.push({ token: 'header', foreground: theme.editorTokens.header.foreground, fontStyle: theme.editorTokens.header.fontStyle })
      rules.push({ token: 'email', foreground: theme.editorTokens.email.foreground, fontStyle: theme.editorTokens.email.fontStyle })
      rules.push({ token: 'link', foreground: theme.editorTokens.link.foreground, fontStyle: theme.editorTokens.link.fontStyle })
      rules.push({ token: 'user', foreground: theme.editorTokens.user.foreground, fontStyle: theme.editorTokens.user.fontStyle })
      rules.push({ token: 'taskOpen', foreground: theme.editorTokens.taskOpen.foreground, fontStyle: theme.editorTokens.taskOpen.fontStyle })
      rules.push({ token: 'taskDone', foreground: theme.editorTokens.taskDone.foreground, fontStyle: theme.editorTokens.taskDone.fontStyle })
      rules.push({ token: 'keyword', foreground: theme.editorTokens.keyword.foreground, fontStyle: theme.editorTokens.keyword.fontStyle })
      rules.push({ token: '', foreground: theme.editor.foreground, background: theme.editor.background })
      const themeData: monaco.editor.IStandaloneThemeData = {
        base: 'vs', // can also be vs-dark or hc-black
        inherit: false, // can also be false to completely replace the builtin rules
        colors: {
          'editor.background': theme.editor.background ?? '#00ff00'
        },
        rules
      }
      monaco.editor.defineTheme('light', themeData)
      monaco.editor.setTheme('light')
    } catch (err: any) {
      log.error(`Could not set the theme because ${String(err.message)}`)
    }
  }

  async function load (path: string, monaco: Monaco | null): Promise<void> {
    log.debug('path ' + String(path))
    if (path === undefined || path === null) return

    log.debug(`path changed for current themed editor to ${path}`)
    if (monaco !== undefined && monaco !== null) {
      const i = monaco.editor.getModels().findIndex(m => {
        if (m.uri.path === undefined) return false
        const matches = m.uri.path.endsWith(path)
        return matches
      })
      if (i === -1) {
        log.debug(`model for ${path} not loaded yet -> load text from path`)
        // const content = await readFile(path)
        const uri = Uri.file(path)
        const model = monaco.editor.createModel(initialText, language, uri)
        editor.current?.setModel(model)
      } else {
        log.debug(`model for ${path} loaded already`)
        editor.current?.setModel(monaco.editor.getModels()[i])
      }

      if (editor.current !== null) onLoaded(editor.current)
    } else {
      log.debug('monaco is not yet initialized')
    }
  }

  function handleEditorDidMount (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco): void {
    log.debug('monaco mounted')
    editor.current = codeEditor
    changeTheme(theme, monaco)

    // report changed cursor position
    codeEditor.onDidChangeCursorPosition(event => onCursorPositionChanged(event, editor.current?.getModel() ?? null))

    // call parent component
    onEditorDidMount(codeEditor, monaco)
  }

  const modelChanged = (value: string, ev: monaco.editor.IModelContentChangedEvent): void => {
    onTextChanged(value, ev.changes)
  }

  return (
    <Editor
      options={{
        formatOnType: true,
        wordWrap: wordWrap ? 'on' : 'off',
        automaticLayout: true,
        autoIndent: 'full',
        showFoldingControls: 'always',
        lineNumbers: lineNumbers ? 'on' : 'off',
        suggest: {
          preview: true
        },
        minimap: {
          enabled: showMinimap
        }
      }}
      onMount={handleEditorDidMount}
      onChange={modelChanged}
    />
  )
}
