const electron = require('electron')
const { app, BrowserWindow, Tray, Menu } = electron
const path = require('path')
const AutoLaunch = require('auto-launch')

// Reload on file changes
try {
  require('electron-reloader')(module)
} catch (_) {}

const url = 'https://keep.google.com'

let tray = null
let window = null
let positioner = null

app.dock && app.dock.hide()

// TODO: Make this configurable
const config = {
  width: 500,
  height: 700,
  position: 'bottomRight',
  startup: true,
}

const createWindow = () => {
  window = new BrowserWindow({
    width: config.width,
    height: config.height,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
  })

  window.loadURL(url)

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'icon.png'))

  tray.on('click', () => {
    window.isVisible() ? window.hide() : showWindow()
  })

  tray.setContextMenu(
    Menu.buildFromTemplate([
      // TODO: Options menu item
      // { label: 'Options', click: () => console.log('todo: open options') },
      { label: 'Exit', click: () => window.close() },
    ])
  )
}

const showWindow = () => {
  let { x, y } = positioner.calculate(config.position)

  // TODO: Padding will need to be calculated differently for different `config.position`
  window.setPosition(x - 10, y - 10, false)
  window.show()
}

const setupAutoLaunch = () => {
  let autoLaunch = new AutoLaunch({
    name: 'keep-tray',
    path: app.getPath('exe'),
  })

  autoLaunch.isEnabled().then(isEnabled => {
    if (!isEnabled && config.startup) {
      autoLaunch.enable()
    } else if (isEnabled && !config.startup) {
      autoLaunch.disable()
    }
  })
}

app.on('ready', () => {
  createTray()
  createWindow()

  var Positioner = require('electron-positioner')
  positioner = new Positioner(window)

  setupAutoLaunch()
})
