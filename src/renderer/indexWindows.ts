// import remote from 'electron'

import { store } from './store'
import { setWindowMaximized } from './store/storeApp'

async function initializeWindowsButtons (): Promise<void> {
  /* Note this is different to the html global `window` variable */
  // const win = remote.getCurrentWindow()

  // When document has loaded, initialise
  document.onreadystatechange = (event) => {
    if (document.readyState === 'complete') {
      handleWindowControls()
    }
  }

  window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    // win.removeAllListeners()
  }

  function handleWindowControls (): void {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    const minButton = document.getElementById('min-button')
    if (minButton !== null) {
      minButton.addEventListener('click', event => {
        // win.minimize()
        window.__preload.send({
          channel: 'windows/control',
          payload: {
            action: 'maximize'
          }
        })
      })
    }

    const maxButton = document.getElementById('max-button')
    if (maxButton !== null) {
      maxButton.addEventListener('click', event => {
        // win.maximize()
        console.log('maximize window')
        window.__preload.send({
          channel: 'windows/control',
          payload: {
            action: 'maximize'
          }
        })
      })
    }

    const restoreButton = document.getElementById('max-button')
    if (restoreButton !== null) {
      restoreButton.addEventListener('click', event => {
        // win.unmaximize()
        window.__preload.send({
          channel: 'windows/control',
          payload: {
            action: 'maximize'
          }
        })
      })
    }

    const closeButton = document.getElementById('max-button')
    if (closeButton !== null) {
      closeButton.addEventListener('click', event => {
        // win.close()
        window.__preload.send({
          channel: 'windows/control',
          payload: {
            action: 'maximize'
          }
        })
      })
    }
  }

  async function toggleMaxRestoreButtons (): Promise<void> {
    console.log('toggleMaxRestoreButtons')
    const isMaximized: boolean = await window.__preload.invoke({
      channel: 'windows/isMaximized'
    })
    store.dispatch(setWindowMaximized(isMaximized))
  }

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  await toggleMaxRestoreButtons()
  window.__preload.receive('windows/maximized-changed', toggleMaxRestoreButtons)
  // win.on('maximize', toggleMaxRestoreButtons)
  // win.on('unmaximize', toggleMaxRestoreButtons)
}

export { initializeWindowsButtons }
