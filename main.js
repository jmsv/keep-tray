const electron = require('electron')
const { app, BrowserWindow, ipcMain, Tray } = electron
const path = require('path')

let tray = null
let window = null
let positioner = null

app.dock && app.dock.hide()

// TODO: Make this configurable
const config = {
  width: 500,
  height: 800,
  position: 'bottomRight',
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

  window.loadURL('https://keep.google.com')

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const createTray = () => {
  tray = new Tray(path.join('keep.png'))
  tray.on('click', () => {
    window.isVisible() ? window.hide() : showWindow()
  })
}

const showWindow = () => {
  let { x, y } = positioner.calculate(config.position)

  // TODO: Padding will need to be calculated differently for different `config.position`
  window.setPosition(x - 10, y - 10, false)
  window.show()
}

app.on('ready', () => {
  createTray()
  createWindow()

  var Positioner = require('electron-positioner')
  positioner = new Positioner(window)
})
