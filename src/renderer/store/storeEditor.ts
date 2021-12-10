import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Positionable } from '../common/cursorPosition'

interface EditorState {
  currentCursorPosition: Positionable
  currentHeaders: string[] | null
  decorationsLeft: number
  decorationsWidth: number
}

const initialState: EditorState = {
  currentCursorPosition: { line: 0, column: 0 },
  currentHeaders: null,
  decorationsLeft: 0,
  decorationsWidth: 0
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
    },
    setDecorationsSizes: (state, action) => {
      state.decorationsLeft = action.payload.decorationsLeft
      state.decorationsWidth = action.payload.decorationsWidth
    }
  }
})

export const { setCursorPosition, setCurrentHeaders, setDecorationsSizes } = editorSlice.actions
export default editorSlice.reducer
