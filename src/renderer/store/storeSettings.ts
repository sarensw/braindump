import { createSlice } from '@reduxjs/toolkit'

interface SettingsState {
  settings: any
  path: string | null
}

const initialState: SettingsState = {
  settings: {},
  path: null
}

export const configSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    set: (state, action) => {
      state.path = action.payload.path
      state.settings = action.payload.settings
    },
    update: (state: SettingsState, action) => {
      state.settings[action.payload.id] = action.payload.value
    }
  }
})

export const { set, update } = configSlice.actions
export default configSlice.reducer
