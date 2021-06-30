import { configureStore } from '@reduxjs/toolkit'
import storeSample from './store/storeSample'
import storeDocument from './store/storeDocument'

export default configureStore({
  reducer: {
    sample: storeSample,
    document: storeDocument
  }
})
