import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import themes, { getMonarchTheme } from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'
import { randomString } from '../services/utilitiesService'
import { set as setDump } from '../store/storeDump'
import extensions from '../extensions/extensions'

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
  // let currentPath = ''

  useEffect(() => {
    log.debug(`monaco is now available: ${monaco}`, id)
    if (monaco) {
      registerBraindownLanguage(monaco)
      loadTheme('monokai')
    }
  }, [monaco])

  useEffect(() => {
    // if (monaco && monaco.editor) {
    //   log.debug(monaco.editor.getModel())
    // }
    /* if (tabs.currentTab) {
      currentPath = tabs.currentTab.path
    } */
  }, [tabs.currentTab])

  const loadTheme = themeId => {
    if (monaco) {
      let theme = themes[themeId]
      if (themeId === 'monokai' || themeId === 'solarizedlight' || themeId === 'nordlight') {
        theme = getMonarchTheme(theme)
        // theme = {
        //   inherit: true,
        //   base: 'vs-dark',
        //   rules: [
        //     {
        //       fontStyle: 'underline',
        //       foreground: '#A6E22E',
        //       token: 'entity.name.class'
        //     }
        //   ],
        //   colors: {
        //     'editor.foreground': '#F8F8F2',
        //     'editor.background': '#272822',
        //     'editor.selectionBackground': '#49483E',
        //     'editor.lineHighlightBackground': '#3E3D32',
        //     'editorCursor.foreground': '#F8F8F0',
        //     'editorWhitespace.foreground': '#3B3A32',
        //     'editorIndentGuide.activeBackground': '#9D550FB0',
        //     'editor.selectionHighlightBorder': '#222218'
        //   }
        // }
        log.debug(theme)
      }
      monaco.editor.defineTheme(themeId, theme)
      monaco.editor.setTheme(themeId)
    }
  }

  const saveSettings = async _ => {
    await window.__preload.send('saveSettings', editorRef.current.getValue())
  }

  /**
   *
   * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor the editor
   * @param {import('monaco-editor')} monaco
   */
  function handleEditorDidMount (editor, monaco) {
    log.debug('editor did mount', id)
    editorRef.current = editor
    editorRef.current.onDidType(function (text) {
      extensions.run(text, editor)
    })
  }

  const modelChanged = (value, event) => {
    dispatch(setDump(editorRef.current.getValue()))
  }

  return (
    <>
      {tabs && tabs.showSettings && <button className='items-start' onClick={() => saveSettings()}>Save &amp; Restart</button>}
      <Editor
        height='400px'
        width='100%'
        options={{
          formatOnType: true
        }}
        path={tabs && tabs.currentTab && tabs.currentTab.path}
        defaultLanguage='braindown'
        defaultValue={tabs && tabs.currentTab && (tabs.currentTab.text ? tabs.currentTab.text : 'helloooo')}
        onChange={modelChanged}
        onMount={handleEditorDidMount}
      />
      <button onClick={() => loadTheme('monokai')}>Monokai</button>
      <button onClick={() => loadTheme('solarizedlight')}>Solarized Light</button>
      <button onClick={() => loadTheme('nordlight')}>Nord Light</button>
    </>
  )
}

export default MonacoEditor
