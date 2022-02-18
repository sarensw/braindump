
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { store } from './store.js'
import { Provider } from 'react-redux'
import CustomThemeProvider from './themes/CustomThemeProvider'

import startupService from './services/startupService'
import { initializeFileService } from './services/fileService'
import registerShortcuts from './services/shortcutService'
import { initializeSnippetsService } from './services/snippetsService'
import { initializeContextMenus } from './services/contextMenuService'
import { initializeWindowsButtons } from './indexWindows'
import { setPlatform } from './store/storeApp'
import { initializeCleanup } from './cleanup'

async function initialize (): Promise<void> {
  await loadPlatform()
  await startupService.startup()
  initializeFileService()
  registerShortcuts()
  await initializeSnippetsService()
  initializeContextMenus()
  initializeCleanup()

  ReactDOM.render(
    <Provider store={store}>
      <CustomThemeProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </CustomThemeProvider>
    </Provider>,
    document.getElementById('root')
  )
}

async function loadPlatform (): Promise<void> {
  const platform = await window.__preload.invoke({
    channel: 'app/platform'
  })
  store.dispatch(setPlatform(platform))
  if (platform === 'win32') {
    await initializeWindowsButtons()
  }
}

void initialize()

// HMR
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
if (import.meta.hot) {
// @ts-expect-error
  import.meta.hot.accept()
}
