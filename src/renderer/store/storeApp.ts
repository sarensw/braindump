import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    page: 'editor',
    lastPage: 'editor',
    focusElement: ''
  },
  reducers: {
    setActivePage: (state, action) => {
      state.lastPage = state.page
      state.page = action.payload
    },
    goToLastPage: (state, action) => {
      console.log(state.page)
      console.log(state.lastPage)
      state.page = state.lastPage
    },
    setFocusElement: (state, action) => {
      state.focusElement = action.payload
    }
  }
})

export const { setActivePage, goToLastPage, setFocusElement } = appSlice.actions
export default appSlice.reducer
