const electron = require('electron'),
  app = electron.app,
  {Pool} = require('pg'),
  localPool = new Pool({
    user: 'faviovelez',
    host: 'localhost',
    database: 'mosaicOnePOS_000',
    password: 'bafio44741',
    port: 5432,
  }),
  BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

async function query (q) {
  const client = await localPool.connect();
  let res;
  try {
    await client.query('BEGIN');
    try {
      res = await client.query(q);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

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
