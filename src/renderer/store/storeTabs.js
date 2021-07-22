import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'

const setCurrentTab = createAsyncThunk(
  'tabs/setCurrentTab',
  async (tab, thunkApi) => {
    if (!tab.loaded) {
      const result = await window.__preload.loadTab({
        tab
      })
      return result
    } else {
      log.debug('text was loaded before, no need to do this again')
      return { tab }
    }
  }
)

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    initialText: '# Welcome to braindump',
    currentTab: null,
    list: null
  },
  reducers: {
    set: (state, action) => {
      log.debug('setting tabs')
      log.debug(action.payload)
      state.list = action.payload.map((tab) => ({
        ...tab,
        loaded: false,
        text: null
      }))
    },
    setTabText: (state, action) => {
      const tab = action.payload.tab
      const text = action.payload.text
      log.debug('setting tab text')
      log.debug(action.payload)
      log.debug(state.list[0].path)
      log.debug(action.payload.tab.path)
      state.list = state.list.map((t, index) => {
        if (t.path === tab.path) {
          return {
            ...t,
            text
          }
        } else {
          return t
        }
      })
    }
  },
  extraReducers: {
    [setCurrentTab.fulfilled]: (state, action) => {
      log.debug('setCurrentTab.fulfilled')
      log.debug(action)
      state.currentTab = {
        ...action.payload.tab,
        loaded: true,
        text: action.payload.text
      }
      state.list = state.list.map((tab) => {
        if (tab.path === action.payload.tab.path) {
          return {
            ...tab,
            loaded: true
          }
        } else {
          return tab
        }
      })
    },
    [setCurrentTab.rejected]: (state, action) => {
      log.debug('setCurrentTab.rejected')
      log.debug(action)
    },
    [setCurrentTab.pending]: (state, action) => {
      log.debug('setCurrentTab.pending')
      log.debug(action)
    }
  }
})

export const { set, setTabText } = tabsSlice.actions
export { setCurrentTab }
export default tabsSlice.reducer
