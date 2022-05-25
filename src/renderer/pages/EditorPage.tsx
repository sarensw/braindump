import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import Dumps from '../components/Dumps'
import EditorHeader from '../components/EditorHeader'
import { useAppSelector } from '../hooks'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import OverlayContainer from '../overlays/OverlayContainer'
import { readFile } from '../services/fileService'
import { FocusElementType, setActiveOverlay, setActivePage, setVisiblePopup } from '../store/storeApp'
import { setCurrentFile, setViewState } from '../store/storeFiles'
import Page from './Page'

const EditorPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useDispatch()
  const [editorProps, setEditorProps] = useState<{path: string, text: string}>({ path: '', text: '' })
  const files = useAppSelector(state => state.files.files)
  const currentFile = useAppSelector(state => state.files.current)
  const settings = useAppSelector(state => state.settings)

  const { to } = useKeyboardNavigation(
    'editor', // id,
    FocusElementType.Page,
    {
      Escape: (to) => dispatch(setActivePage('files')),
      CmdCtrl_P: (to) => dispatch(setActiveOverlay('search')),
      CmdCtrl_K: (to) => dispatch(setActiveOverlay('files/quick_change'))
    }
  )

  useAsyncEffect(async () => {
    if (currentFile !== null) {
      const currentFileId = (typeof currentFile === 'string' ? currentFile : currentFile.id)
      const file = files?.find(f => f.id === currentFileId)

      if (file !== undefined) {
        const fileRaw = await readFile(file.path)

        setEditorProps({
          path: file.path,
          text: fileRaw
        })

        if (file.isNew) {
          to('editor/name')
        }
      }
    }
  }, [currentFile])

  useEffect(() => {
    // const escHk = {
    //   id: 'editor:esc',
    //   key: 'esc',
    //   description: 'list notes',
    //   action: (source, codeEditor): boolean => {
    //     dispatch(setActivePage('files'))
    //     return true
    //   }
    // }
    const up = {
      id: 'files:up',
      key: 'command+k',
      description: 'select prev',
      action: (source, codeEditor): boolean => {
        if (codeEditor !== null) {
          // store the view state
          const viewState = codeEditor.saveViewState()
          dispatch(setViewState(JSON.stringify(viewState)))
        }

        // show the popup
        dispatch(setVisiblePopup('fileSelector'))

        // change the file
        if (files === null || files === null || files === undefined || currentFile == null) return true
        const currentFileId = (typeof currentFile === 'string' ? currentFile : currentFile.id)
        const currentIndex = files?.findIndex(f => f.id === currentFileId)
        if (currentIndex === files?.length - 1) return true
        const newSelected = files[currentIndex + 1].id
        dispatch(setCurrentFile(newSelected))

        return true
      },
      release: (source, codeEditor): boolean => {
        console.log('key released')
        dispatch(setVisiblePopup(''))
        return true
      }
    }
    const down = {
      id: 'files:down',
      key: 'command+j',
      description: 'select next',
      action: (source, codeEditor): boolean => {
        if (codeEditor !== null) {
          // store the view state
          const viewState = codeEditor.saveViewState()
          dispatch(setViewState(JSON.stringify(viewState)))
        }

        // show the popup
        dispatch(setVisiblePopup('fileSelector'))

        // change the file
        if (files === null || currentFile == null) return true
        const currentFileId = (typeof currentFile === 'string' ? currentFile : currentFile.id)
        const currentIndex = files?.findIndex(f => f.id === currentFileId)
        if (currentIndex === 0) return true
        const newSelected = files[currentIndex - 1].id
        dispatch(setCurrentFile(newSelected))

        return true
      },
      release: (source, codeEditor): boolean => {
        console.log('key released')
        dispatch(setVisiblePopup(''))
        return true
      }
    }
    // const search = {
    //   id: 'editor:search',
    //   key: 'cmd+p',
    //   description: 'fuzzy search',
    //   action: (source, codeEditor): boolean => {
    //     dispatch(setActiveOverlay('search'))
    //     return true
    //   }
    // }
    // registerHotkey(up, 'editor', null)
    // registerHotkey(down, 'editor', null)
    // registerHotkey(escHk, 'editor', null)
    // registerHotkey(search, 'editor', null)
    return () => {
      // unregisterHotkey(up)
      // unregisterHotkey(down)
      // unregisterHotkey(escHk)
      // unregisterHotkey(search)
    }
  }, [currentFile])

  return (
    <Page>
      <div
        className='grid h-full relative'
        style={{
          gridTemplateRows: '[header] auto [name] auto [main] minmax(0, 1fr)',
          gridTemplateColumns: 'minmax(0, 1fr)'
        }}
      >
        <div>
          {settings['tabs.show'] &&
            <Dumps />}
        </div>

        <EditorHeader path={editorProps.path} />

        <BraindownEditor
          path={editorProps.path}
          initialText={editorProps.text}
        />

        <OverlayContainer />
      </div>
    </Page>
  )
}

export default EditorPage
