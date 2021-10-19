import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    text: ''
  },
  reducers: {
    set: (state, action) => {
      state.text = action.payload
    },
    clean: (state, action) => {
      state.text = ''
    }
  }
})

export const { set, clean } = searchSlice.actions
export default searchSlice.reducer
