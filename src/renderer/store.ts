import { configureStore } from '@reduxjs/toolkit'
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

export const store = configureStore({
  reducer: {
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
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
