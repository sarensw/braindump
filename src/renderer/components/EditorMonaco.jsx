import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import { getMonarchTheme } from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'
import { randomString } from '../services/utilitiesService'
import { set as setDump } from '../store/storeDump'
import extensions from '../extensions/extensions'
import { Range } from 'monaco-editor'
import { handleKeyDownEvent } from '../hotkeys'
import { BraindownLanguage } from '../braindown/braindownLanguage'

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

  const tabs = useSelector(state => state.tabs)
  const theme = useSelector(state => state.theme)
  const search = useSelector(state => state.search)

  useEffect(() => {
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
  function handleEditorDidMount (editor, monaco) {
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
  }

  const modelChanged = (value, event) => {
    dispatch(setDump(editorRef.current.getValue()))
  }

  return (
    <>
      {/* {tabs && tabs.showSettings && <button className='items-start' onClick={() => saveSettings()}>Save &amp; Restart</button>} */}

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
        path={tabs && tabs.currentTab && tabs.currentTab.path}
        defaultLanguage='braindown'
        defaultValue={tabs && tabs.currentTab && (tabs.currentTab.text ? tabs.currentTab.text : '')}
        onChange={modelChanged}
        onMount={handleEditorDidMount}
      />
    </>
  )
}

export default MonacoEditor
