import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import log from '../log'

export enum FocusElementType {
  Element = 'ELEMENT',
  Page = 'PAGE'
}
export interface FocusElement {
  type: FocusElementType
  id: string
}

interface AppState {
  page: string
  lastPage: string
  overlay: string | null
  focusElement: FocusElement | null
  focusElements: FocusElement[]
  focusElementHierarchy: FocusElement[]
  focusElementHistory: FocusElement[]
  windowMaximized: boolean
  platform: string
  status: string
  visiblePopup: string
  isPro: boolean
}

const initialState: AppState = {
  page: 'editor',
  lastPage: 'editor',
  overlay: null,
  focusElement: null,
  focusElements: [],
  focusElementHierarchy: [],
  focusElementHistory: [],
  windowMaximized: false,
  platform: '',
  status: 'running',
  visiblePopup: '',
  isPro: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      log.debug(`active page changed to ${String(action.payload)}`)
      state.lastPage = state.page
      state.page = action.payload
    },
    goToLastPage: (state, action) => {
      log.debug(`last page changed to ${String(action.payload)}`)
      state.page = state.lastPage
    },
    setActiveOverlay: (state, action) => {
      log.debug(`active overlay changed to ${String(action.payload)}`)
      state.overlay = action.payload
    },
    setFocusElement: (state, action: PayloadAction<FocusElement>) => {
      const focusElement = { id: action.payload.id, type: action.payload.type }
      log.debug(`focus element changed to ${String(focusElement.id)} of type ${String(focusElement.type)}}`)
      state.focusElement = focusElement
      state.focusElementHistory.push(focusElement)

      // In a hiearchy the top level element is a page. In case the
      // curently focused element does not handle the key, then the
      // page might handle it. Therefore, when the hierarchy is updated,
      // all elements before that page have to be removed.
      const pageIndex = state.focusElementHierarchy.findIndex(se => se.type === FocusElementType.Page)
      const tempHistory = state.focusElementHierarchy.slice(0, pageIndex)
      if (focusElement.type === FocusElementType.Element) {
        // if the new focus element is an element on a page, then
        // just add that element on top of the hiearchy
        tempHistory.push(focusElement)
      } else {
        // ... if it is a page, then replace the current page
        tempHistory.pop()
        tempHistory.push(focusElement)
      }
      state.focusElementHierarchy = tempHistory
    },
    setPreviousFocusElement: (state, action) => {
      const tempHistory = state.focusElementHistory
      const currentElement = tempHistory.pop()
      const lastElement = tempHistory[tempHistory.length]

      const tempHierarchy = state.focusElementHierarchy
      if (currentElement?.type === FocusElementType.Element) {
        tempHierarchy.pop()
        tempHierarchy.push(lastElement)
      } else if (currentElement?.type === FocusElementType.Page) {
        // find the last page in the history???
      }

      state.focusElement = lastElement
      state.focusElementHistory = tempHistory
    },
    addFocusElement: (state, action: PayloadAction<FocusElement>) => {
      state.focusElements.push(action.payload)

      if (action.payload.type === FocusElementType.Page) {
        let tempHierarchy = state.focusElementHierarchy
        tempHierarchy = tempHierarchy.splice(0, tempHierarchy.length)
        tempHierarchy.push(action.payload)
        state.focusElementHierarchy = tempHierarchy
      }
    },
    removeFocusElement: (state, action: PayloadAction<FocusElement>) => {
      const focusElementId = state.focusElements.findIndex(e => e.id === action.payload.id)
      if (focusElementId > -1) {
        state.focusElements.splice(focusElementId, 1)
      }
    },
    setWindowMaximized: (state, action) => {
      state.windowMaximized = action.payload
    },
    setPlatform: (state, action) => {
      state.platform = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
      log.debug(`app status changed to ${String(action.payload)}`)
    },
    setVisiblePopup: (state, action) => {
      if (state.visiblePopup !== action.payload) {
        state.visiblePopup = action.payload

        if (action.payload !== '') {
          log.debug(`showing popup ${String(action.payload)}`)
        }
      }
    },
    setIsPro: (state, action) => {
      state.isPro = action.payload
    }
  }
})

export const { setActivePage, goToLastPage, setActiveOverlay, setFocusElement, setPreviousFocusElement, addFocusElement, removeFocusElement, setWindowMaximized, setPlatform, setStatus, setVisiblePopup, setIsPro } = appSlice.actions
export default appSlice.reducer
