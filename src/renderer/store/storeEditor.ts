import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Positionable } from '../common/cursorPosition'

interface EditorState {
  currentCursorPosition: Positionable
  currentHeaders: string[] | null
}

const initialState: EditorState = {
  currentCursorPosition: { line: 0, column: 0 },
  currentHeaders: null
}

export const editorSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setCursorPosition: (state, action: PayloadAction<Positionable>) => {
      state.currentCursorPosition = action.payload
    },
    setCurrentHeaders: (state, action) => {
      state.currentHeaders = action.payload
    }
  }
})

export const { setCursorPosition, setCurrentHeaders } = editorSlice.actions
export default editorSlice.reducer
