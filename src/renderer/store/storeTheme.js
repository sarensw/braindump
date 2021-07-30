import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: {},
    id: null
  },
  reducers: {
    set: (state, action) => {
      state.theme = action.payload.theme
      state.id = action.payload.id
    }
  }
})

export const { set } = themeSlice.actions
export default themeSlice.reducer
