import { createSlice } from '@reduxjs/toolkit'
import { Snippet } from '../../shared/types'

const initialState: Snippet[] = []

export const snippetSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload
    }
  }
})

export const { set } = snippetSlice.actions
export default snippetSlice.reducer
