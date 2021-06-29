import { configureStore } from '@reduxjs/toolkit'
import storeSample from './store/storeSample'

export default configureStore({
  reducer: {
    sample: storeSample
  }
})
