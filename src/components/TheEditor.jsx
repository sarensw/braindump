import React, { useState } from 'react'
import { Editor, EditorState } from 'draft-js'

const TheEditor = _ => {
  
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

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
      <div className="bg-gray-100">
        <Editor editorState={editorState} onChange={onChange} />
      </div>
    </>
  )
}

export default TheEditor
