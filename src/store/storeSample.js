import { createSlice } from '@reduxjs/toolkit'

export const sampleSlice = createSlice({
  name: 'sample',
  initialState: {
    searchInput: 'test'
  },
  reducers: {
    set: (state, action) => {
      state.searchInput = action.payload
    }
  }
})

export const { set } = sampleSlice.actions
export default sampleSlice.reducer
