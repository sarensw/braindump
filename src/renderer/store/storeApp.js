import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    page: 'editor'
  },
  reducers: {
    set: (state, action) => {
      state.page = action.payload
    }
  }
})

export const { set } = appSlice.actions
export default appSlice.reducer
