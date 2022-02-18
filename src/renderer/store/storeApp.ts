import { createSlice } from '@reduxjs/toolkit'
import log from '../log'

interface AppState {
  page: string
  lastPage: string
  focusElement: string
  windowMaximized: boolean
  platform: string
  status: string
}

const initialState: AppState = {
  page: 'editor',
  lastPage: 'editor',
  focusElement: '',
  windowMaximized: false,
  platform: '',
  status: 'running'
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
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
    },
    setWindowMaximized: (state, action) => {
      state.windowMaximized = action.payload
    },
    setPlatform: (state, action) => {
      state.platform = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
      log.debug(`app status changed to ${String(action.payload)}`)
    }
  }
})

export const { setActivePage, goToLastPage, setFocusElement, setWindowMaximized, setPlatform, setStatus } = appSlice.actions
export default appSlice.reducer
