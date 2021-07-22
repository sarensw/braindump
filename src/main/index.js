
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { getAssetURL } from 'electron-snowpack'
import path from 'path'
import log from 'electron-log'
import { Tabs, Tab } from './tabs'
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer'

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

/* (function () {
  app.setName('braindump')
  app.setPath('userData', path.join(app.getPath('appData'), 'braindump'))
})() */

let mainWindow
const tabs = new Tabs()

function createMainWindow () {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
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

app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS, true)
})

ipcMain.on('log', async (event, args) => {
  let msg = args.msg
  if (typeof msg === 'object' && msg != null) msg = JSON.stringify(msg)
  if (args.type === 'debug') log.debug(`[ui] ${msg}`)
  if (args.type === 'info') log.info(`[ui] ${msg}`)
  if (args.type === 'warn') log.warn(`[ui] ${msg}`)
  if (args.type === 'error') log.error(`[ui] ${msg}`)
})

ipcMain.on('save', async (event, args) => {
  console.log(args)
  const tab = Tab.fromObject(args.tab)
  await tab.write(args.text)
})

ipcMain.on('showOpenDialog', async (event, someArgument) => {
  log.debug('showOpenDialog')
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  })
  console.log(result)
})

ipcMain.on('loadTab', async (event, someArgument) => {
  log.debug('ipcMain.loadTab')
  log.debug(someArgument)
  const tab = Tab.fromObject(someArgument)
  log.debug(tab)
  const text = await tab.read()
  log.debug('event.reply')
  log.debug({
    tab,
    text
  })
  event.reply('tabLoaded', {
    tab,
    text
  })
})

ipcMain.on('loadTabs', async (event, args) => {
  const tabsList = await tabs.loadTabs()
  event.reply('tabsLoaded', tabsList)
})
