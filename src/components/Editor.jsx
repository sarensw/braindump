import React, { useState, useEffect } from 'react'
import { CompositeDecorator, Editor as DraftJsEditor, EditorState } from 'draft-js'
import { BlockDateSettings } from './blocks/BlockDate'
//import { BlockLinkSettings } from './blocks/BlockLink'
import useStorage from '../hooks/useStorage'
import useInterval from '../hooks/useInterval'

const Editor = _ => {
  const compositeDecorator = new CompositeDecorator([
    BlockDateSettings.decorator,
    //BlockLinkSettings.decorator
  ])

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(compositeDecorator))
  const db = useStorage()

  /**
   * Called when the editor state changes
   * @param {EditorState} editorState The editor state that changed
   */
  const onChange = editorState => {
    setEditorState(editorState)
  }

  useEffect(async () => {
    if (db) {
      console.log('loading')
      const contentState = await db.load()
      console.log('loaded')
      console.log(contentState)
      setEditorState(EditorState.createWithContent(contentState, compositeDecorator))
    }
  }, [])

  useInterval(_ => {
    db.store(editorState)
  }, 5000)

  return (
    <>
      <div className='border border-gray-300 h-full overflow-y-auto'>
        <DraftJsEditor className='' editorState={editorState} onChange={onChange} />
      </div>
    </>
  )
}

export default Editor
