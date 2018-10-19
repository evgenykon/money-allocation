const {
  dialog
} = window.require('electron').remote;
var fs = window.require('fs');

const localStorageConsts = {
  conf: 'cash.app.conf'
};

const DbStore = {
  bills: [],
  history: []
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
      const dbStr = JSON.stringify(DbStore);
      dialog.showSaveDialog(options, (fileName) => {
        if (fileName === undefined) {
          reject('file not selected');
          return;
        }
        fs.writeFile(fileName, dbStr, (err) => {
          if (err) {
            reject(err);
          } else {
            LocalStorageAppConf.dbJsonSrc = fileName;
            localStorage.setItem(localStorageConsts.conf, JSON.stringify(LocalStorageAppConf))
            resolve(fileName);
          }
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
  }
};

export default Db;
