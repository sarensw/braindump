
import { app, BrowserWindow, ipcMain, dialog, crashReporter } from 'electron'
import { getAssetURL } from 'electron-snowpack'
import path from 'path'
import log from 'electron-log'
import { Tabs, Tab } from './tabs'
import { Settings } from './settings'
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer'

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
const tabs = new Tabs()
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
  installExtension(REDUX_DEVTOOLS)
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

ipcMain.on('saveDump', async (event, args) => {
  log.debug('ipcMain.saveDumps')
  log.debug(args)
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

ipcMain.handle('loadTab', async (event, someArgument) => {
  log.debug('ipcMain.loadTab')
  log.debug(someArgument)
  if (someArgument === null) {
    const tab = await tabs.newTab()
    return {
      tabs: tabs.tabs,
      tab,
      text: ''
    }
  } else {
    const tab = Tab.fromObject(someArgument)
    log.debug(tab)
    const text = await tab.read()
    log.debug('event.reply')
    log.debug({
      tab,
      text
    })

    return {
      tabs: tabs.tabs,
      tab,
      text
    }
  }
})

ipcMain.handle('loadTabs', async (event, args) => {
  log.debug('main.loadTabs')
  const tabsList = await tabs.loadTabs()
  log.debug('tabsList')
  log.debug(tabsList)
  return tabsList
})
