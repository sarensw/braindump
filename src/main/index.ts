
import { app, BrowserWindow, ipcMain, crashReporter, globalShortcut, shell } from 'electron'
import path from 'path'
import log from 'electron-log'
import { FileSystem } from './fs'
import { FileSystem as DemoFileSystem } from './demo/demoFileService'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { dialog, Menu } from 'electron/main'
import { EditorWindow } from './windows/windowEditor'
import { FuzzySearch } from './search/fuzzy'

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

const editorWindows: EditorWindow[] = []

const setupApp = (): void => {
  app.addListener('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
      const editorWindow = new EditorWindow()
      editorWindows.push(editorWindow)
      void editorWindow.show()
    }
  })

  // quit application when all windows are closed
  app.addListener('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // before the app is going to be closed
  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })
}

const setupIpcHandlers = (fileSystem: FileSystem, demoFileSystem: DemoFileSystem): void => {
  ipcMain.handle('app/platform', (event, args) => {
    log.debug('app/platform')
    return process.platform
  })

  ipcMain.handle('app/demoModeActive', (event, args) => {
    log.debug('app/demoModeActive')
    return process.env.BRAINDUMP_DEMO_MODE === 'true'
  })

  ipcMain.on('showMainWindow', (event, args) => {
    mainWindow.show()
  })

  ipcMain.on('registerShortcuts', (event, args) => {
    globalShortcut.unregisterAll()
    for (const shortcut of args) {
      globalShortcut.register(shortcut.keys, () => {
        log.debug(`shortcut ${String(shortcut.keys)} triggered and mapped to id: ${String(shortcut.id)}`)
        mainWindow.webContents.send('shortcut', shortcut.id)
      })
    }
    log.debug(args)
  })

  ipcMain.on('log', (event, args) => {
    const msg = args.message
    // if (typeof msg === 'object' && msg != null) msg = JSON.stringify(msg)
    if (args.type === 'debug') log.debug(`[ui] ${String(msg)}`)
    if (args.type === 'info') log.info(`[ui] ${String(msg)}`)
    if (args.type === 'warn') log.warn(`[ui] ${String(msg)}`)
    if (args.type === 'error') log.error(`[ui] ${String(msg)}`)
  })

  ipcMain.handle('file/size', async (event, args) => {
    const size = await fileSystem.size(args.path)
    return size
  })

  ipcMain.handle('file/read', async (event, args) => {
    log.debug(`file/read requested for ${String(args.path)}`)
    if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
      const content = await demoFileSystem.read(args.path)
      return content
    } else {
      const content = await fileSystem.read(args.path)
      return content
    }
  })

  ipcMain.on('file/write', (event, args) => {
    if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
      void demoFileSystem.write(args.path, args.text)
    } else {
      void fileSystem.write(args.path, args.text)
    }
  })

  ipcMain.handle('file/valid', async (event, args) => {
    const isValid = await fileSystem.exists(args.path)
    return isValid
  })

  ipcMain.on('file/compress', (event, args) => {
    void fileSystem.compress(args.filePaths, args.targetPath)
  })

  ipcMain.handle('file/move', async (event, args) => {
    const result = await fileSystem.move(args.filePaths, args.targetPath)
    return result
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

      if (clickableItem.submenu != null) {
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
    // @ts-expect-error
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  })

  ipcMain.handle('share/saveas', async (event, args) => {
    log.debug('intent to share/saveas with the following args')
    log.debug(args)

    const path = await dialog.showSaveDialog(mainWindow, {
      defaultPath: args.defaultPath
    })
    return path
  })

  ipcMain.on('share/openExternal', (event, args) => {
    log.debug('intent to share via share/openExternal with the following args')
    log.debug(args)

    void shell.openExternal(args.url)
  })

  ipcMain.on('windows/controls', (event, args) => {
    log.debug('windows controls event')
    log.debug(args)

    if (args.action === 'minimize') {
      mainWindow.minimize()
    } else if (args.action === 'maximize') {
      mainWindow.maximize()
    } else if (args.action === 'unmaximize') {
      mainWindow.unmaximize()
    } else if (args.action === 'close') {
      mainWindow.close()
    }
  })

  ipcMain.handle('windows/isMaximized', (event, args) => {
    return mainWindow.isMaximized()
  })

  ipcMain.handle('search/fuzzy', async (event, args) => {
    const result = await new FuzzySearch().search(args.files, args.what)
    return result
  })
}

const start = async (): Promise<void> => {
  // init the main file system
  log.debug('set up file system')
  const fileSystem = new FileSystem()
  await fileSystem.initialize()

  // init the demo file system
  log.debug('setup demo file system')
  const demoFileSystem = new DemoFileSystem(null)

  // set up the ipc handlers
  log.debug('set up all ipc handlers')
  setupIpcHandlers(fileSystem, demoFileSystem)

  log.debug('await app readiness')
  await app.whenReady()

  log.debug('create the window')
  const editorWindow = new EditorWindow()
  editorWindows.push(editorWindow)
  await editorWindow.show()

  log.debug('install dev extensions')
  // register extensions
  void installExtension(REDUX_DEVTOOLS)
  void installExtension(REACT_DEVELOPER_TOOLS)

  log.debug('set up app')
  setupApp()
}

void start()
