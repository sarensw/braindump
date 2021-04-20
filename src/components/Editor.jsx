import React, { useState } from 'react'
import { CompositeDecorator, Editor as DraftJsEditor, EditorState } from 'draft-js'
import BlockDate, { BlockDateSettings } from './blocks/BlockDate'

const Editor = _ => {
  const compositeDecorator = new CompositeDecorator([
    BlockDateSettings.decorator
  ])

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(compositeDecorator))

  /**
   * Called when the editor state changes
   * @param {EditorState} editorState The editor state that changed
   */
  const onChange = editorState => {
    console.log(editorState.getCurrentContent())
    console.log(editorState.toJS())
    setEditorState(editorState)
  }

  return (
    <>
      <div>
        <DraftJsEditor editorState={editorState} onChange={onChange} />
      </div>
    </>
  )
}

export default Editor
