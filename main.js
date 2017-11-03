require('dotenv').config();

const electron = require('electron'),
  app = electron.app,
  {Pool} = require('pg'),
  localPool = new Pool({
    user: process.env.DB_LOCAL_USER,
    host: 'localhost',
    database: process.env.DB_LOCAL_DB,
    password: process.env.DB_LOCAL_PASS,
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
    icon:   'app/assets/img/business.png',
    height: 768,
    width: 1266
  });

  mainWindow.setResizable(false);

  hasUser().then(res => {
    if (res) {
      mainWindow.loadURL(`file://${app.getAppPath()}/app/views/sign_in.html`);
    } else {
      mainWindow.loadURL(`file://${app.getAppPath()}/app/views/initial_install.html`);
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
});
