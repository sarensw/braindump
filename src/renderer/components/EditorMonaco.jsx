import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import { getMonarchTheme } from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'
import { randomString } from '../services/utilitiesService'
import { setDirtyText } from '../store/storeFiles'
import extensions from '../extensions/extensions'
import { Range, Uri } from 'monaco-editor'
import { handleKeyDownEvent } from '../hotkeys'
import { BraindownLanguage } from '../braindown/braindownLanguage'
import { addListener } from '../events'
import { loadFileContent } from '../services/fileService'

loader.config({
  paths: {
    vs: 'monaco-editor'
  }
})

const MonacoEditor = _ => {
  const id = randomString(4)
  log.debug('rerender MonacoEditor', id)
  const dispatch = useDispatch()

  const editorRef = useRef(null)
  const braindown = useRef(null)

  const monaco = useMonaco()

  const files = useSelector(state => state.files)
  const theme = useSelector(state => state.theme)
  const search = useSelector(state => state.search)

  useEffect(async () => {
    log.debug(`current tab has changed to ${files.current}`)
    if (monaco) {
      const i = monaco.editor.getModels().findIndex(m => {
        if (m.uri.path === undefined) return false
        const matches = m.uri.path.endsWith(files.current)
        return matches
      })
      if (i === -1) {
        log.debug(`model for ${files.current} not loaded yet -> load text from text file`)
        const content = await loadFileContent(files.current)
        const uri = new Uri()
        uri.path = '/' + files.current
        const model = monaco.editor.createModel(content, 'braindown', uri)
        editorRef.current.setModel(model)
      } else {
        log.debug(`model for ${files.current} loaded already`)
        editorRef.current.setModel(monaco.editor.getModels()[i])
      }
    }
  }, [files.current])

  useEffect(() => {
    // register events
    const removeListener = addListener('event.editor.focus', () => { editorRef.current.focus() })
    return () => {
      removeListener()
    }
  }, [editorRef.current])

  useEffect(async () => {
    log.debug(`monaco is now available: ${monaco}`, id)
    if (monaco) {
      registerBraindownLanguage(monaco)
    }
  }, [monaco])

  useEffect(() => {
    log.debug('theme changed')
    if (monaco) {
      log.debug('monaco loaded')
      changeTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    if (!editorRef.current) return

    if (search.text === '') {
      editorRef.current.setHiddenAreas([])
      return
    }

    editorRef.current.setHiddenAreas([])

    const regex = `${search.text}`
    try {
      RegExp(regex, 'g')
    } catch (err) {
      return
    }
    const matches = editorRef.current.getModel().findMatches(new RegExp(regex, 'g'), false, true, false, null, true)
    log.debug(matches)

    const lineCount = editorRef.current.getModel().getLineCount()
    const rangesFound = matches.map(match => match.range)
    const rangesExclude = [new Range(1, 0, lineCount, 0)]
    for (const range of rangesFound) {
      log.debug(rangesExclude)
      rangesExclude.forEach((value, index) => {
        if (range.startLineNumber > value.startLineNumber && range.endLineNumber < value.endLineNumber) {
          rangesExclude.splice(index, 1)
          rangesExclude.push(new Range(value.startLineNumber, 0, range.startLineNumber - 1))
          rangesExclude.push(new Range(range.endLineNumber + 1, 0, value.endLineNumber, 0))
        } else if (range.startLineNumber >= value.startLineNumber && range.endLineNumber < value.endLineNumber) {
          rangesExclude.splice(index, 1)
          rangesExclude.push(new Range(value.startLineNumber + 1, 0, value.endLineNumber, 0))
        } else if (range.startLineNumber >= value.startLineNumber && range.endLineNumber === value.endLineNumber) {
          rangesExclude.splice(index, 1)
        }
      })
    }
    editorRef.current.setHiddenAreas(rangesExclude)
    /* editorRef.current.setHiddenAreas([new Range(1, 0, 10, 0), new Range(20, 0, 30, 0)]) */
  }, [search.text])

  const changeTheme = (theme, monaco) => {
    log.debug('changeTheme ', id)
    try {
      const writableTheme = JSON.parse(JSON.stringify({
        type: theme.type,
        colors: theme.colors,
        tokenColors: theme.tokenColors
      }))
      const th = getMonarchTheme(writableTheme)
      monaco.editor.defineTheme(theme.id, th)
      monaco.editor.setTheme(theme.id)
      log.debug(`Theme set ${theme.id}`)
    } catch (err) {
      log.error(`Could not set the theme because ${err.message}`)
    }
  }

  /**
   *
   * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor the editor
   * @param {import('monaco-editor')} monaco
   */
  async function handleEditorDidMount (editor, monaco) {
    log.debug('editor did mount', id)

    // register the new language handler
    braindown.current = new BraindownLanguage(editor)
    changeTheme(theme, monaco)

    editorRef.current = editor
    editorRef.current.onDidType(function (text) {
      extensions.run(text, editor)
      braindown.current.handleInput(text)
    })
    editorRef.current.onKeyDown((event) => {
      handleKeyDownEvent(event.browserEvent, 'monaco')
      console.log(event.browserEvent)
    })

    // load the files
    const modelLoaded = monaco.editor.getModels().some(m => m.id === files.current)
    if (!modelLoaded) {
      const content = await loadFileContent(files.current)
      const uri = new Uri()
      uri.path = '/' + files.current
      const model = monaco.editor.createModel(content, 'braindown', uri)
      editorRef.current.setModel(model)
    }

    // set the focus once
    if (editorRef.current !== null) editorRef.current.focus()
  }

  const modelChanged = (value, event) => {
    dispatch(setDirtyText(editorRef.current.getValue()))
  }

  return (
    <>
      <Editor
        options={{
          formatOnType: true,
          wordWrap: true,
          automaticLayout: true,
          autoIndent: false,
          showFoldingControls: 'always',
          suggest: {
            preview: true
          }
        }}
        defaultLanguage='braindown'
        onChange={modelChanged}
        onMount={handleEditorDidMount}
      />
    </>
  )
}

export default MonacoEditor
