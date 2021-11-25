import { createSlice } from '@reduxjs/toolkit'

interface CursorPosition {
  line: number
  column: number
}

interface EditorState {
  currentCursorPosition: CursorPosition
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
    setCursorPosition: (state, action) => {
      state.currentCursorPosition = action.payload
    },
    setCurrentHeaders: (state, action) => {
      state.currentHeaders = action.payload
    }
  }
})

export const { setCursorPosition, setCurrentHeaders } = editorSlice.actions
export default editorSlice.reducer
