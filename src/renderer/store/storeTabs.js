import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'

const setCurrentTab = createAsyncThunk(
  'tabs/setCurrentTab',
  async (tab, thunkApi) => {
    if (!tab.loaded) {
      const result = await window.__preload.invoke({
        channel: 'loadTab',
        payload: tab
      })
      return result
    } else {
      log.debug('text was loaded before, no need to do this again')
      return { tab }
    }
  }
)

const setSettingsAsCurrentTab = createAsyncThunk(
  'tabs/setSettingsAsCurrentTab',
  async (args, thunkApi) => {
    const result = await window.__preload.loadSettings()
    return result
  }
)

/**
 * tab = {
 *  name,
 *  path,
 *  loaded,
 *  text
 * }
 */

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    initialText: '# Welcome to braindump',
    currentTab: null,
    list: null,
    showSettings: false
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
    updateDump: (state, action) => {

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
      state.showSettings = false
    },
    [setCurrentTab.rejected]: (state, action) => {
      log.debug('setCurrentTab.rejected')
      log.debug(action)
    },
    [setCurrentTab.pending]: (state, action) => {
      log.debug('setCurrentTab.pending')
      log.debug(action)
    },
    [setSettingsAsCurrentTab.fulfilled]: (state, action) => {
      log.debug('setSettingsAsCurrentTab.fulfilled')
      log.debug(action)
      state.currentTab = {
        name: '__settings',
        path: action.payload.path,
        loaded: true,
        text: JSON.stringify(action.payload.settings)
      }
      state.showSettings = true
    },
    [setSettingsAsCurrentTab.rejected]: (state, action) => {
      log.debug('setSettingsAsCurrentTab.rejected')
      log.debug(action)
    },
    [setSettingsAsCurrentTab.pending]: (state, action) => {
      log.debug('setSettingsAsCurrentTab.pending')
      log.debug(action)
    }
  }
})

export const { set, setTabText } = tabsSlice.actions
export { setCurrentTab, setSettingsAsCurrentTab }
export default tabsSlice.reducer
