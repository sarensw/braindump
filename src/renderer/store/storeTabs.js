import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from '../log'

const setCurrentTab = createAsyncThunk(
  'tabs/setCurrentTab',
  async (tab, thunkApi) => {
    let result = null
    if (tab === null || (tab !== null && !tab.loaded)) {
      result = await window.__preload.invoke({
        channel: 'loadTab',
        payload: tab
      })
    } else {
      log.debug('text was loaded before, no need to do this again')
      result = { tab }
    }

    // update the last used tab
    window.__preload.invoke({
      channel: 'lastUsedTabChanged',
      tab: result.tab
    })

    return result
  }
)

const closeTab = createAsyncThunk(
  'tabs/closeTab',
  async (tab, thunkApi) => {
    if (tab !== null) {
      const result = await window.__preload.invoke({
        channel: 'closeTab',
        payload: tab
      })
      return result
    }
  }
)

const setSettingsAsCurrentTab = createAsyncThunk(
  'tabs/setSettingsAsCurrentTab',
  async (args, thunkApi) => {
    log.debug('setSettingsAsCurrentTab')
    const result = await window.__preload.invoke({ channel: 'loadSettings' })
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
      // set the selected tab
      state.currentTab = {
        ...action.payload.tab,
        loaded: true,
        text: action.payload.text
      }
      // update the list
      if (action.payload.tabs) {
        const newList = action.payload.tabs.map((tab) => ({
          ...tab,
          loaded: false,
          text: null
        }))
        state.list = newList.map((tab) => {
          if (tab.path === action.payload.tab.path) {
            return {
              ...tab,
              loaded: true
            }
          } else {
            return tab
          }
        })
      }
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
    [closeTab.fulfilled]: (state, action) => {
      log.debug('closeTab.fulfilled')
      log.debug(action)
      state.list = state.list.filter(tab => tab.path !== action.payload.path)
    },
    [closeTab.rejected]: (state, action) => {
      log.debug('closeTab.rejected')
      log.debug(action)
    },
    [closeTab.pending]: (state, action) => {
      log.debug('closeTab.pending')
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
export { setCurrentTab, setSettingsAsCurrentTab, closeTab }
export default tabsSlice.reducer
