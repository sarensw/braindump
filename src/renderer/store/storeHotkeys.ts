import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { Hotkey, SerializableHotkey } from '../braindump'
import log from '../log'

const initialState: SerializableHotkey[] = []

export const hotkeysSlice = createSlice({
  name: 'hotkeys',
  initialState,
  reducers: {
    addHotkeys: (state, action: PayloadAction<Hotkey[]>): void => {
      const hotkeysToBeAdded = action.payload.map(({ action, ...rest }) => rest)
      state.push(...hotkeysToBeAdded)
    },
    removeHotkeys: (state, action: PayloadAction<Hotkey[]>): WritableDraft<SerializableHotkey[]> => {
      return state.filter(hka => action.payload.findIndex(hkb => hka.id === hkb.id) < 0)
    }
  }
})

export const { addHotkeys, removeHotkeys } = hotkeysSlice.actions
export default hotkeysSlice.reducer
