import { BrowserWindow } from 'electron'
import path from 'path'

class EditorWindow {
  /**
   * The browser window represented by this class in form of an editor
   */
  private mainWindow: BrowserWindow | null

  /**
   * Creates a new editor window
   * @returns void
   */
  public async show (): Promise <BrowserWindow> {
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
        // enableRemoteModule: false
      },
      titleBarStyle: 'hidden',
      show: false,
      icon: path.join(__dirname, '../../assets/logo/logo_48x48.png')
      // icon: path.join(__dirname, '../../assets/logo/logo_48x48.png')
    }
    if (process.env.BRAINDUMP_DEMO_MODE === 'true') {
      windowOptions.width = 640
      windowOptions.height = 480
      windowOptions.center = true
    }
    const window = new BrowserWindow(windowOptions)
    window.removeMenu()

    window.on('ready-to-show', () => {
      window.webContents.setZoomFactor(1.1)
      window.show()
    })

    if (process.env.NODE_ENV === 'development' && process.env.BRAINDUMP_DEMO_MODE !== 'true') {
      window.webContents.openDevTools()
    }

    // window.loadURL(getAssetURL('index.html'))
    if (process.env.NODE_ENV === 'development') {
      await window.loadURL('http://localhost:8089')
    } else {
      await window.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')))
    }

    window.on('close', () => {
      // tell the renderer that the app will quit
      this.mainWindow?.webContents.send('window/close')
    })

    window.on('closed', () => {
      this.mainWindow = null
    })

    window.webContents.on('devtools-opened', () => {
      window.focus()
      setImmediate(() => {
        window.focus()
      })
    })

    window.on('maximize', () => {
      window.webContents.send('windows/maximized-changed')
    })
    window.on('unmaximize', () => {
      window.webContents.send('windows/maximized-changed')
    })

    return window
  }
}

export { EditorWindow }
