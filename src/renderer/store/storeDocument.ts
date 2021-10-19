import { createSlice } from '@reduxjs/toolkit'

export const documentSlice = createSlice({
  name: 'document',
  initialState: {
    text: '# Welcome to braindump'
  },
  reducers: {
    set: (state, action) => {
      state.text = action.payload
    }
  }
})

export const { set } = documentSlice.actions
export default documentSlice.reducer
