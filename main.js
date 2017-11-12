require('dotenv').config();

const electron = require('electron'),
  app = electron.app,
  path = require('path'),
  fs = require('fs'),
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

class Store {

  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');

    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    if (fs.existsSync(path)) {
      fs.closeSync(fs.openSync(filePath, 'w'));
    }
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

async function initStore(){

  const store = new Store({
    configName: 'user-localStore',
    defaults: {
      windowBounds: { width: 1024, height: 768 }
    }
  });

  return store;
}

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
    //if (res) {
    query('SELECT * FROM stores').then(storeRecord => {
      initStore().then(store => {
        store.set('store', storeRecord.rows[0]);
        mainWindow.loadURL(`file://${app.getAppPath()}/app/views/sign_up.html`);
      });
    });
    //} else {
      //mainWindow.loadURL(`file://${app.getAppPath()}/app/views/initial_install.html`);
    //}
  });

  mainWindow.on('closed', () => { mainWindow = null; });
});
