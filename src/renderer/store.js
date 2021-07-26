import { configureStore } from '@reduxjs/toolkit'
import storeSample from './store/storeSample'
import storeDocument from './store/storeDocument'
import storeTabs from './store/storeTabs'
import storeSettings from './store/storeSettings'
import storeDump from './store/storeDump'

export default configureStore({
  reducer: {
    sample: storeSample,
    document: storeDocument,
    tabs: storeTabs,
    settings: storeSettings,
    dump: storeDump
  },
  devTools: true
})
