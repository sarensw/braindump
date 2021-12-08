import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    page: 'editor',
    focusElement: ''
  },
  reducers: {
    set: (state, action) => {
      state.page = action.payload
    },
    setFocusElement: (state, action) => {
      state.focusElement = action.payload
    }
  }
})

export const { set, setFocusElement } = appSlice.actions
export default appSlice.reducer
