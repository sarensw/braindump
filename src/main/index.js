
import { app, BrowserWindow, ipcMain, crashReporter, globalShortcut } from 'electron'
import { getAssetURL } from 'electron-snowpack'
import path from 'path'
import log from 'electron-log'
import { SettingsFile } from './settings'
import { FileSystem } from './fs'
import { FileSystem as DemoFileSystem } from './demo/demoFileService'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { Menu } from 'electron/main'

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
const settings = new SettingsFile()
const fileSystem = new FileSystem()
const demoFileSystem = new DemoFileSystem()

function createMainWindow () {
  const windowOptions = {
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    titleBarStyle: 'hidden',
    show: false
  }
  if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
    windowOptions.width = 640
    windowOptions.height = 480
    windowOptions.center = true
  }
  const window = new BrowserWindow(windowOptions)

  window.on('ready-to-show', () => {
    window.webContents.setZoomFactor(1.1)
    window.show()
  })

  if (process.env.MODE !== 'production' && process.env.BRAINDUMP_DEMO_MODE !== 'true') {
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

ipcMain.handle('file/size', async (event, args) => {
  const size = await fileSystem.size(args.path)
  return size
})

ipcMain.handle('file/read', async (event, args) => {
  if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
    const content = await demoFileSystem.read(args.path)
    return content
  } else {
    const content = await fileSystem.read(args.path)
    return content
  }
})

ipcMain.on('file/write', async (event, args) => {
  if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
    await demoFileSystem.write(args.path, args.text)
  } else {
    await fileSystem.write(args.path, args.text)
  }
})

ipcMain.on('menu/context', (event, template) => {
  log.debug(template)
  const clickableTemplate = template.map(item => {
    const clickableItem = {
      ...item
    }

    if (clickableItem.label === '###version###') {
      clickableItem.label = 'Braindump v' + app.getVersion()
    }

    if (clickableItem.submenu) {
      clickableItem.submenu = clickableItem.submenu.map(item => {
        return {
          ...item,
          click: () => { event.sender.send('context-menu-command', item.id) }
        }
      })
    } else {
      clickableItem.click = () => { event.sender.send('context-menu-command', item.id) }
    }
    return clickableItem
  })
  const menu = Menu.buildFromTemplate(clickableTemplate)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})
