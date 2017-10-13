const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const remote = require('electron').remote;

let mainWindow = null;

app.on('window-all-closed',() => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    icon:'app/assets/img/business.png',
    height: 768,
    width: 1024
  });

  mainWindow.loadURL(`file://${app.getAppPath()}/app/views/sign_in.html`);

  mainWindow.on('closed', () => { mainWindow = null; });
});

