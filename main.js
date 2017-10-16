const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

async function hasUser(){
  try {
    const { rows } = await query('SELECT * FROM users');
    return rows.length > 0;
  } catch (err) {
    return false;
  }
}

app.on('window-all-closed',() => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    icon:'app/assets/img/business.png',
    height: 768,
    width: 1024
  });

  hasUser().then(res => {
    if (res) {
      mainWindow.loadURL(`file://${app.getAppPath()}/app/views/sign_in.html`);
    } else {
      mainWindow.loadURL(`file://${app.getAppPath()}/app/views/sign_up.html`);
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
});

