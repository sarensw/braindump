
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import store from './store.js'
import { Provider } from 'react-redux'
import CustomThemeProvider from './themes/CustomThemeProvider'

import startupService from './services/startupService'
import dumpService from './services/dumpService'

async function initialize () {
  await startupService.startup()
  dumpService.initializeDumpService()
  await dumpService.initializeDumps()

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

initialize()

// HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}
