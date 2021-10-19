
import { app, BrowserWindow, ipcMain, crashReporter, globalShortcut } from 'electron'
import { getAssetURL } from 'electron-snowpack'
import path from 'path'
import log from 'electron-log'
import { Files } from './files'
import { Settings } from './settings'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

crashReporter.start({ uploadToServer: false })

log.transports.console.level = false
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs/main.log')
console.log(`logging to ${path.join(app.getPath('userData'), 'logs/main.log')}`)

log.debug('Paths:')
log.debug(app.getPath('appData'))
log.debug(app.getPath('cache'))
log.debug(app.getPath('crashDumps'))
log.debug(app.getPath('exe'))
log.debug(app.getPath('logs'))
log.debug(app.getPath('module'))
log.debug(app.getPath('userData'))

let mainWindow
const files = new Files()
const settings = new Settings()

function createMainWindow () {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    titleBarStyle: 'hidden'
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

app.whenReady().then(() => {
  // register extensions
  installExtension(REDUX_DEVTOOLS)
  installExtension(REACT_DEVELOPER_TOOLS)
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

ipcMain.on('showMainWindow', (event, args) => {
  mainWindow.show()
})

ipcMain.on('registerShortcuts', (event, args) => {
  globalShortcut.unregisterAll()
  for (const shortcut of args) {
    globalShortcut.register(shortcut.keys, () => {
      log.debug(`shortcut ${shortcut.keys} triggered and mapped to id: ${shortcut.id}`)
      mainWindow.webContents.send('shortcut', shortcut.id)
    })
  }
  log.debug(args)
})

ipcMain.on('log', (event, args) => {
  const msg = args.message
  // if (typeof msg === 'object' && msg != null) msg = JSON.stringify(msg)
  if (args.type === 'debug') log.debug(`[ui] ${msg}`)
  if (args.type === 'info') log.info(`[ui] ${msg}`)
  if (args.type === 'warn') log.warn(`[ui] ${msg}`)
  if (args.type === 'error') log.error(`[ui] ${msg}`)
})

ipcMain.handle('loadSettings', async (event, someArgument) => {
  log.debug('ipcMain.loadSettings')
  const result = await settings.read()
  return result
})

ipcMain.handle('saveSettings', async (event, someArgument) => {
  await settings.write(someArgument)
})

ipcMain.handle('files/lastUsedChanged', async (event, args) => {
  log.debug('files/lastUsedChanged')
  if (args) {
    await files.lastUsedChanged(args)
    return args
  }
})

ipcMain.handle('files/load', async (event, args) => {
  await files.loadFiles()
  const fileList = {
    files: files.files,
    lastUsed: files.lastUsedFile
  }
  return fileList
})

ipcMain.on('file/save', async (event, args) => {
  await files.write(args.id, args.text)
})

ipcMain.handle('file/new', async (event, args) => {
  const file = await files.createNewDump()
  return file.id
})

ipcMain.handle('file/content', async (event, args) => {
  const content = await files.loadFileContent(args)
  return content
})

ipcMain.handle('file/close', async (event, args) => {
  await files.close(args.id)
})
