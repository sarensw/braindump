import React, { ReactElement, useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import { useAppSelector } from '../hooks'
import log from '../log'
import { getMonarchTheme } from '../themes'
import { Uri } from 'monaco-editor'
import useAsyncEffect from 'use-async-effect'

interface ThemedEditorProps {
  language: string
  path: string
  initialText?: string
  onTextChanged?: (text: string, changes: monaco.editor.IModelContentChange[]) => void
  onEditorDidMount?: (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => Promise<void>
  showMinimap: boolean
}

export const ThemedEditor = ({ language, path, initialText = '', onTextChanged = () => {}, onEditorDidMount = async () => {}, showMinimap = false }: ThemedEditorProps): ReactElement => {
  const theme = useAppSelector(state => state.theme)
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
  }, [theme])

  useAsyncEffect(async () => {
    await load(path, monaco)
  }, [path])

  function changeTheme (theme, monaco: Monaco): void {
    try {
      const writableTheme = JSON.parse(JSON.stringify({
        type: theme.type,
        colors: theme.colors,
        tokenColors: theme.tokenColors
      }))
      const th = getMonarchTheme(writableTheme)
      monaco.editor.defineTheme(theme.id, th)
      monaco.editor.setTheme(theme.id)
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
    } else {
      log.debug('monaco is not yet initialized')
    }
  }

  async function handleEditorDidMount (codeEditor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco): Promise<void> {
    log.debug('monaco mounted')
    editor.current = codeEditor
    changeTheme(theme, monaco)

    // call parent component
    await onEditorDidMount(codeEditor, monaco)
  }

  const modelChanged = (value: string, ev: monaco.editor.IModelContentChangedEvent): void => {
    onTextChanged(value, ev.changes)
  }

  return (
    <Editor
      options={{
        formatOnType: true,
        wordWrap: 'on',
        automaticLayout: true,
        autoIndent: 'full',
        showFoldingControls: 'always',
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
