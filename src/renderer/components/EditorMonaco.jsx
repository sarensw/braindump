import React, { useEffect, useRef } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import themes, { getMonarchTheme } from '../themes'
import registerBraindownLanguage from '../braindown'
import log from '../log'
import { randomString } from '../services/utilitiesService'
import { set as setDump } from '../store/storeDump'
import { set as setTheme } from '../store/storeTheme'
import extensions from '../extensions/extensions'
import Button from './elements/Button'

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
  const theme = useSelector(state => state.theme)

  useEffect(() => {
    log.debug(`monaco is now available: ${monaco}`, id)
    if (monaco) {
      registerBraindownLanguage(monaco)
      /* loadTheme('monokai') */
      if (theme) {
        changeTheme(theme)
      }
    }
  }, [monaco])

  useEffect(() => {
    log.debug('theme changed')
    if (monaco) {
      log.debug('monaco loaded')
      changeTheme(theme)
    }
  }, [theme])

  /* useEffect(() => {
    if (editorRef.current) {
      const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
          const cr = entry.contentRect
          console.log('Element:', entry.target)
          console.log(`Element size: ${cr.width}px x ${cr.height}px`)
          console.log(`Element padding: ${cr.top}px ; ${cr.left}px`)
        }
        console.log('Size changed')
      })
      ro.observe(editorRef.current)
      return () => {
        ro.disconnect()
      }
    }
  }, [editorRef.current]) */

  const changeTheme = theme => {
    try {
      const writableTheme = JSON.parse(JSON.stringify(theme.theme))
      log.debug(writableTheme)
      log.debug('trying hello world')
      writableTheme.hello = 'world'
      log.debug(writableTheme.hello)
      const th = getMonarchTheme(writableTheme)
      monaco.editor.defineTheme(theme.id, th)
      monaco.editor.setTheme(theme.id)
    } catch (err) {
      log.error(`Could not set the theme because ${err.message}`)
    }
  }

  const changeThemeByUser = themeId => {
    dispatch(setTheme({
      theme: themes[themeId],
      id: themeId
    }))
  }

  /* const loadTheme = themeId => {
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
  } */

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
      <div className='flex flex-col h-full overflow-hidden'>
        {tabs && tabs.showSettings && <button className='items-start' onClick={() => saveSettings()}>Save &amp; Restart</button>}

        <div className='h-full w-full flex-auto m-auto'>
          <Editor
            height='100%'
            width='100%'
            options={{
              formatOnType: true,
              wordWrap: true,
              automaticLayout: true
            }}
            path={tabs && tabs.currentTab && tabs.currentTab.path}
            defaultLanguage='braindown'
            defaultValue={tabs && tabs.currentTab && (tabs.currentTab.text ? tabs.currentTab.text : 'helloooo')}
            onChange={modelChanged}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className='flex flex-row'>
          <Button onClick={() => changeThemeByUser('monokai')}>Monokai</Button>
          <Button onClick={() => changeThemeByUser('solarizedlight')}>Solarized Light</Button>
          <Button onClick={() => changeThemeByUser('nordlight')}>Nord Light</Button>
        </div>
      </div>
    </>
  )
}

export default MonacoEditor
