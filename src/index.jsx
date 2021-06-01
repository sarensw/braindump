import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import store from './store.js'
import { Provider } from 'react-redux'

import PouchDB from 'pouchdb-browser'
import { Provider as PouchDbProvider } from 'use-pouchdb'

const db = new PouchDB('braindump')

ReactDOM.render(
  <Provider store={store}>
    <PouchDbProvider pouchdb={db}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PouchDbProvider>
  </Provider>,
  document.getElementById('root')
)

// HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}
