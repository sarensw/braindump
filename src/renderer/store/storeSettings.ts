import { createSlice } from '@reduxjs/toolkit'
import { Settings } from '../../shared/types'
import SettingsStructure from '../settings/settings.json'

function getDefaultValue<T> (id: string): T | null {
  for (const category of SettingsStructure) {
    for (const setting of category.settings) {
      if (setting.id === id) {
        return setting.default as unknown as T
      }
    }
  }

  return null
}

const initialState: Settings = {
  'app.theme': getDefaultValue<string>('app.theme') ?? '',
  'editor.minimap.show': getDefaultValue<boolean>('editor.minimap.show') ?? false
}

export const configSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload
    },
    update: (state: Settings, action) => {
      state[action.payload.id] = action.payload.value
    }
  }
})

export const { set, update } = configSlice.actions
export default configSlice.reducer
