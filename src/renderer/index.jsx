
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import store from './store.js'
import { Provider } from 'react-redux'

import dumpService from './services/dumpService'
dumpService.initializeDumpService()

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

// HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}
