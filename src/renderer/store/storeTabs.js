import { createSlice } from '@reduxjs/toolkit'
import log from '../log'

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    initialText: '# Welcome to braindump',
    currentTab: -1,
    list: null
  },
  reducers: {
    set: (state, action) => {
      log.debug('setting tabs')
      log.debug(action.payload)
      state.list = action.payload
    },
    setTabText: (state, action) => {
      const tab = action.payload.tab
      const text = action.payload.text
      log.debug('setting tab text')
      log.debug(action.payload)
      log.debug(state.list[0].path)
      log.debug(action.payload.path)
      log.debug(state.list.find(t => t.path === tab.path))
      state.list.find(t => t.path === tab.path).text = text
      state.currentTab = 0
    }
  }
})

export const { set, setTabText } = tabsSlice.actions
export default tabsSlice.reducer
