const electron = require('electron');
const path = require('path');
const fs = require('fs');

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
