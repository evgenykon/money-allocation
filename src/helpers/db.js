const {
  dialog
} = window.require('electron').remote;
var fs = window.require('fs');

const localStorageConsts = {
  conf: 'cash.app.conf'
};

const DbStore = {
  bills: [],
  history: {
    incomes: [],
    transfers: [],
    balances: []
  },
  currency: 'RUR',
  updatedAt: null
};

const LocalStorageAppConf = {
  dbJsonSrc: ''
};

const Db = {
  /**
   * check that db inited
   */
  check: () => {
    if (localStorage.getItem(localStorageConsts.conf)) {
      console.debug('conf found');
      return true;
    } else {
      console.debug('conf not found');
      return false;
    }
  },

  /**
   * make a timeout to wait something
   */
  sleep: (timeout) => {
    const stop = new Date().getTime() + timeout;
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (new Date().getTime() > stop) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  },

  /**
   * lock with waiting
   */
  lock: () => {
    const maxTimeout = new Date().getTime() + 10000; // 10 seconds from current time
    /**
     * waiting
     */
    const waitWhileUnlocked = (callback) => {
      if (maxTimeout < new Date().getTime()) {
        throw Error('Waiting aborted during max timeout');
      }
      if (window.Config.lockFlag === true) {
        Db.sleep(1000).then(() => {
          waitWhileUnlocked(callback);
        });

      } else {
        callback();
      }
    }
    return new Promise((resolve, reject) => {
      waitWhileUnlocked(() => {
        window.Config.lockFlag = true;
        resolve();
      });
    });
  },

  /**
   * unlock
   */
  unlock: () => {
    return new Promise((resolve, reject) => {
      window.Config.lockFlag = false;
      resolve();
    });
  },

  /**
   * create new database
   */
  createNew: () => {
    return new Promise((resolve, reject) => {
      const options = {
        'title': 'Создать файл БД',
        'buttonLabel': 'Создать БД',
        'filters': [{
          name: 'JSON',
          extensions: ['json']
        }]
      };
      const dbStr = JSON.stringify({
        bills: [],
        history: {
          incomes: [],
          transfers: [],
          balances: []
        },
        currency: 'RUR',
        updatedAt: new Date()
      });
      dialog.showSaveDialog(options, (fileName) => {
        if (fileName === undefined) {
          reject('file not selected');
          return;
        }
        Db.lock().then(() => {
          fs.writeFile(fileName, dbStr, (err) => {
            if (err) {
              reject(err);
            } else {
              LocalStorageAppConf.dbJsonSrc = fileName;
              localStorage.setItem(localStorageConsts.conf, JSON.stringify(LocalStorageAppConf))
              Db.unlock();
              resolve(fileName);
            }
          });
        });
      });
    });
  },

  /**
   * load existing database
   */
  openExisted: () => {
    return new Promise((resolve, reject) => {
      const options = {
        'title': 'Открыть файл БД',
        'buttonLabel': 'Открыть БД',
        'filters': [{
          name: 'JSON',
          extensions: ['json']
        }],
        properties: ['openFile']
      };
      dialog.showOpenDialog(options, (fileNames) => {
        if (fileNames === undefined) {
          reject("No file selected");
          return;
        }
        fs.readFile(fileNames[0], 'utf-8', (err, data) => {
          if (err) {
            reject("An error ocurred reading the file :" + err.message);
            return;
          }
          let jsDb = JSON.parse(data);
          if (jsDb.bills === undefined) {
            reject("Bad file format");
            return;
          }
          if (jsDb.history === undefined) {
            reject("Bad file format");
            return;
          }
          LocalStorageAppConf.dbJsonSrc = fileNames[0];
          localStorage.setItem(localStorageConsts.conf, JSON.stringify(LocalStorageAppConf))
          resolve({
            db: jsDb,
            filePath: fileNames[0]
          });
        });
      });
    });
  },

  /**
   * parse json
   */
  parseJsonFile: function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject("An error ocurred reading the file :" + err.message);
          return;
        };
        let parsedData = JSON.parse(data);
        console.debug('parseJsonFile', parsedData);
        resolve(parsedData);
      });
    });
  },

  /**
   * get application setup config from localstorage
   */
  getAppConf: function() {
    const json = localStorage.getItem(localStorageConsts.conf);
    if (!json) {
      return Object.assign({}, LocalStorageAppConf);
    }
    return JSON.parse(json);
  },

  /**
   * remove DB file path from conf without deleting a file
   */
  unset: function() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(localStorageConsts.conf);
      resolve();
    });
  },

  /**
   * returns DB data
   */
  loadDb: function() {
    const conf = Db.getAppConf();
    return Db.parseJsonFile(conf.dbJsonSrc);
  },

  /**
   * store bills to file
   */
  saveBills: function(bills) {
    return this.loadDb().then((data) => {
      data.bills = bills;
      data.updatedAt = new Date();
      const dbStr = JSON.stringify(data);
      const conf = Db.getAppConf();
      Db.lock().then(() => {
        fs.writeFile(conf.dbJsonSrc, dbStr, (err) => {
          Db.unlock();
          if (err) {
            console.error('saveBills error', err);
          } else {
            console.debug('saveBills', 'saved');
          }
        });
      });
    }).catch((err) => {
      console.error('saveBills error', err);
    });
  },

  /**
   * store history to file
   */
  saveHistory: function(history) {
    return this.loadDb().then((data) => {
      data.history = history;
      data.updatedAt = new Date();
      const dbStr = JSON.stringify(data);
      const conf = Db.getAppConf();
      Db.lock().then(() => {
        fs.writeFile(conf.dbJsonSrc, dbStr, (err) => {
          Db.unlock();
          if (err) {
            console.error('saveHistory error', err);
          } else {
            console.debug('saveHistory', 'saved');
          }
        });
      });
    }).catch((err) => {
      console.error('saveHistory error', err);
    });
  }
};

export default Db;
