import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import themes from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'
import { randomString } from '../services/utilitiesService'
import { set as setDump } from '../store/storeDump'

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
  const monaco = useMonaco()
  const tabs = useSelector(state => state.tabs)

  useEffect(() => {
    log.debug(`monaco is now available: ${monaco}`, id)
    if (monaco) {
      registerBraindownLanguage(monaco)
      monaco.editor.defineTheme('braindown', themes.braindown)
      monaco.editor.setTheme('braindown')
    }
  }, [monaco])

  const loadTheme = theme => {
    if (monaco) {
      monaco.editor.defineTheme(theme, themes[theme])
      monaco.editor.setTheme(theme)
    }
  }

  const saveSettings = async _ => {
    await window.__preload.send('saveSettings', editorRef.current.getValue())
  }

  function handleEditorDidMount (editor, monaco) {
    log.debug('editor did mount', id)
    editorRef.current = editor
  }

  const modelChanged = _ => {
    dispatch(setDump(editorRef.current.getValue()))
  }

  return (
    <>
      {tabs && tabs.showSettings && <button className='items-start' onClick={() => saveSettings()}>Save &amp; Restart</button>}
      <Editor
        height='400px'
        width='100%'
        path={tabs && tabs.currentTab && tabs.currentTab.path}
        defaultLanguage='braindown'
        defaultValue={tabs && tabs.currentTab && (tabs.currentTab.text ? tabs.currentTab.text : 'helloooo')}
        onChange={modelChanged}
        onMount={handleEditorDidMount}
      />
      <button onClick={() => loadTheme('braindown')}>Default</button>
      <button onClick={() => loadTheme('monokai')}>Monokai</button>
      <button onClick={() => loadTheme('nightowl')}>Night Owl</button>
    </>
  )
}

export default MonacoEditor
