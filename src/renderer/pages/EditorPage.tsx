import React, { ReactElement, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAsyncEffect from 'use-async-effect'
import { BraindownEditor } from '../components/BraindownEditor'
import Dumps from '../components/Dumps'
import EditorHeader from '../components/EditorHeader'
import { useAppSelector } from '../hooks'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import OverlayContainer from '../overlays/OverlayContainer'
import { readFile } from '../services/fileService'
import { FocusElementType, setActiveOverlay, setActivePage } from '../store/storeApp'
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
    if (currentFile == null) return

    const file = files?.find(f => f.id === currentFile.id)

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
