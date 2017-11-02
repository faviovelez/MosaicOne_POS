const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed',() => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    icon:   'app/assets/img/business.png',
    height: 768,
    width: 1266
  });

  mainWindow.setResizable(false);

  mainWindow.loadURL(`file://${app.getAppPath()}/app/views/initial_install.html`);

  mainWindow.on('closed', () => { mainWindow = null; });
});
