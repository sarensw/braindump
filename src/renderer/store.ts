import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storeSample from './store/storeSample'
import storeDocument from './store/storeDocument'
import storeFiles from './store/storeFiles'
import storeSettings from './store/storeSettings'
import storeSearch from './store/storeSearch'
import storeApp from './store/storeApp'
import storeSnippets from './store/storeSnippets'
import storeThemeNew from './store/storeThemeNew'
import storeEditor from './store/storeEditor'
import storeHotkeys from './store/storeHotkeys'
import storePresentation from './store/storePresentation'
import log from './log'

const reducers = combineReducers({
  app: storeApp,
  hotkeys: storeHotkeys,
  sample: storeSample,
  document: storeDocument,
  files: storeFiles,
  settings: storeSettings,
  themeNew: storeThemeNew,
  search: storeSearch,
  snippets: storeSnippets,
  editor: storeEditor,
  presentation: storePresentation
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, reducers)

log.debug('configure store now')

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
