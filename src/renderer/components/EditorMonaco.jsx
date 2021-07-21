import React, { useEffect, useState, useRef } from 'react'
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
  const { loadTabs, saveTab, loadTab } = useTabs()
  const monaco = useMonaco()
  const tabs = useSelector(state => state.tabs.list)
  const currentTab = useSelector(state => state.tabs.currentTab)
  const [tab, setTab] = useState(null)
  let dirty = false

  useEffect(() => {
    log.debug('monaco updated')
    if (monaco) registerBraindownLanguage(monaco)
    log.debug('loading tabs')
    loadTabs()
  }, [monaco])

  useEffect(() => {
    log.debug('tabs changed')
    log.debug({ tabs })
    if (monaco && tabs && tabs.length > 0) {
      log.debug('loading first tab')
      loadTab(tabs[0])
    }
  }, [tabs])

  useEffect(() => {
    if (monaco && tabs && tabs.length > 0 && currentTab > -1 && tabs[currentTab]) {
      setTab(tabs[currentTab])
    }
  }, [currentTab])

  const saveDoc = async _ => {
    if (monaco && dirty /* loading === false && dirty */) {
      try {
        const text = editorRef.current.getValue()
        log.debug(text)
        await saveTab(tabs[0], text)
      } finally {
        dirty = false
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(saveDoc, 2000)
    return () => clearTimeout(timer)
  })

  if (monaco && monaco.editor) {
    log.debug(monaco.editor.getModels().length)
  }

  const loadTheme = theme => {
    if (monaco) {
      // fetch('/themes/Monokai.json')
      //   .then(data => data.json())
      //   .then(data => {
      //     monaco.editor.defineTheme('monokai', data);
      //     monaco.editor.setTheme('monokai');
      //   })
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
        path={tab && tab.path}
        value={tab && tab.text}
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
