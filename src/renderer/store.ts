import { configureStore } from '@reduxjs/toolkit'
import storeSample from './store/storeSample'
import storeDocument from './store/storeDocument'
import storeFiles from './store/storeFiles'
import storeSettings from './store/storeSettings'
import storeTheme from './store/storeTheme'
import storeSearch from './store/storeSearch'
import storeApp from './store/storeApp'

export const store = configureStore({
  reducer: {
    app: storeApp,
    sample: storeSample,
    document: storeDocument,
    files: storeFiles,
    settings: storeSettings,
    theme: storeTheme,
    search: storeSearch
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
