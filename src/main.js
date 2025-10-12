const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');

const isDev = false;
const isMac = process.platform === 'darwin';

let win;

const menu = [
    ...(isMac
        ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }]
        : []),
    // { role: 'gistsMenu' }
    {
        label: 'Gists',
        submenu: [
            {
                label: 'Token',
                click: () => setToken(),
                accelerator: 'CmdOrCtrl+O',
            },
            {
                label: 'New',
                click: () => newGist(),
                accelerator: 'CmdOrCtrl+N',
            },
            {
                label: 'Save',
                click: () => saveGist(),
                accelerator: 'CmdOrCtrl+S',
            },
            {
                label: 'Find',
                click: () => findGist(),
                accelerator: 'CmdOrCtrl+F',
            },

            // delete

            isMac ? { role: 'close' } : { role: 'quit' }
        ],
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac
                ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ]
                : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    },
];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    title: "Gists for All",
    width: 1800,
    height: 1000,
    icon: path.join(process.cwd(), 'assets/icons/logo.png'),
    webPreferences: {
    //   nodeIntegration: true,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); 

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  win.on('closed', () => (win = null));
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function setToken() {
    win.webContents.send('token', "token");
}

function newGist() {
    win.webContents.send('create', "create");
}

function saveGist() {
    win.webContents.send('save', "save");
}

function findGist() {
    win.webContents.send('find', "find");
}

ipcMain.on('search-text', (event, text) => {
    win.webContents.findInPage(text, {
        findFirst: true, // Or other options like 'findNext', 'findPrevious'
        caseSensitive: false,
        matchCase: false,
        wholeWord: false
    });
});

ipcMain.on('open-win', (event, url) => {
    shell.openExternal(url);
})

ipcMain.handle('show-alert', async (event, options) => {
  const webContents = event.sender;
  const browserWindow = BrowserWindow.fromWebContents(webContents);
  return await dialog.showMessageBox(browserWindow, options);
});
