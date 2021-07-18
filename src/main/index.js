
import { app, BrowserWindow, ipcMain } from 'electron'
import { getAssetURL } from 'electron-snowpack'
import path from 'path'
import Storage from './storage'
import log from 'electron-log'

log.transports.console.level = false
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs/main.log')

log.debug('Paths:')
log.debug(app.getPath('appData'))
log.debug(app.getPath('cache'))
log.debug(app.getPath('crashDumps'))
log.debug(app.getPath('exe'))
log.debug(app.getPath('logs'))
log.debug(app.getPath('module'))
log.debug(app.getPath('userData'))

/* (function () {
  app.setName('braindump')
  app.setPath('userData', path.join(app.getPath('appData'), 'braindump'))
})() */

let mainWindow
const storage = new Storage()

function createMainWindow () {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.MODE !== 'production') {
    window.webContents.openDevTools()
  }

  window.loadURL(getAssetURL('index.html'))

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

ipcMain.on('save', async (event, someArgument) => {
  await storage.saveDocument(someArgument)
})

ipcMain.on('load', async (event, someArgument) => {
  log.debug('loading text')
  const text = await storage.getDocument(someArgument)
  log.debug(text)
  event.reply('loaded', text)
})
