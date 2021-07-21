import { configureStore } from '@reduxjs/toolkit'
import storeSample from './store/storeSample'
import storeDocument from './store/storeDocument'
import storeTabs from './store/storeTabs'

export default configureStore({
  reducer: {
    sample: storeSample,
    document: storeDocument,
    tabs: storeTabs
  },
  devTools: true
})
