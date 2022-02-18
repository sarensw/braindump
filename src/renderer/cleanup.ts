import { store } from './store'
import { setStatus } from './store/storeApp'

function initializeCleanup (): void {
  window.__preload.receive('window/close', windowClose)
}

function windowClose (): void {
  store.dispatch(setStatus('window/close'))
}

export { initializeCleanup }
