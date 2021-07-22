import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import useTabs from '../hooks/useTabs'
import { useSelector } from 'react-redux'
import themes from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'

loader.config({
  paths: {
    vs: 'monaco-editor'
  }
})

const MonacoEditor = _ => {
  const editorRef = useRef(null)
  const monaco = useMonaco()
  const currentTab = useSelector(state => state.tabs.currentTab)
  let dirty = false
  const { saveTab } = useTabs()

  const saveDoc = async _ => {
    if (monaco && dirty) {
      try {
        const text = editorRef.current.getValue()
        log.debug(`intent to save text of length ${text.length}`)
        await saveTab(currentTab, text)
      } finally {
        dirty = false
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(saveDoc, 2000)
    return () => clearTimeout(timer)
  }, [])

  const loadTheme = theme => {
    if (monaco) {
      monaco.editor.defineTheme(theme, themes[theme])
      monaco.editor.setTheme(theme)
    }
  }

  function handleEditorDidMount (editor, monaco) {
    editorRef.current = editor
  }

  const modelChanged = _ => {
    dirty = true
  }

  return (
    <>
      <Editor
        height='400px'
        width='100%'
        language='markdown'
        theme='monokai'
        keepCurrentModel
        path={currentTab && currentTab.path}
        defaultLanguage='braindown'
        defaultValue={currentTab && (currentTab.text ? currentTab.text : 'helloooo')}
        onChange={modelChanged}
        onMount={handleEditorDidMount}
      />
      <button onClick={() => loadTheme('braindown')}>Braindown</button>
      <button onClick={() => loadTheme('monokai')}>Monokai</button>
      <button onClick={() => loadTheme('nightowl')}>Night Owl</button>
    </>
  )
}

export default MonacoEditor
