// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol} = require('electron')
const fs = require('fs')

// NOTE(ibash) this is not needed as we pass a switch on the command line:
// --service-worker-schemes="filesystem"
// In fact, registerSchemesAsPrivileged does not work for our purposes since it
// doesn't enable service workers for the filesystem scheme for all processes.
//
// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'filesystem',
//     privileges: {
//       allowServiceWorkers: true,
//     }
//   },
// ])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //webSecurity: false
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  // NOTE(ibash) since github has CSP it can't load the service worker file for
  // github.com, but there are mechanisms to change these headers
  //mainWindow.loadURL('https://github.com')
  mainWindow.loadURL('https://example.com')

  const js = fs.readFileSync('./service-worker-loader.js', {encoding: 'utf8'})
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.executeJavaScript(js);
  });


  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('crashed', function(event, killed) {
    console.log('CRASHED!')
    console.log(event)
    console.log(killed)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
