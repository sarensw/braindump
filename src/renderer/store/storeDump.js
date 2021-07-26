import { createSlice } from '@reduxjs/toolkit'

export const dumpSlice = createSlice({
  name: 'dump',
  initialState: {
    text: '',
    dirty: false
  },
  reducers: {
    set: (state, action) => {
      state.text = action.payload
      state.dirty = true
    },
    clean: (state, action) => {
      state.dirty = false
    }
  }
})

export const { set, clean } = dumpSlice.actions
export default dumpSlice.reducer
