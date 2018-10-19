<template lang="html">
    <div class="container-fluid">
      <navigation current="settings"></navigation>
      <section class="row">
          <div class="col">
              <h4>Настройки</h4>
          </div>
      </section>
      <h5>База данных</h5>
      <section class="row" v-if="!dbFile">
          <div class="col">
              <button type="button" class="btn btn-primary" @click="dbSetup">Установить базу данных</button>
          </div>
          <div class="col">
              <button type="button" class="btn btn-secondary" @click="dbOpen">Открыть существующую</button>
          </div>
      </section>
      <section v-if="dbFile">
          <div class="row mt-2">
              <div class="col">
                  <div class="card">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item bg-secondary">
                            Файл: <pre>{{dbFile}}</pre>
                            <button type="button" class="btn btn-warning btn-sm" @click="dbUnset">Отключить</button>
                        </li>
                        <li class="list-group-item bg-secondary">Счетов: {{billsCount}}</li>
                        <li class="list-group-item bg-secondary">Записей в истории: {{historyRecords}}</li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>
    </div>
</template>

<script>
import Navigation from './Navigation';
import Db from '@/helpers/db.js';

export default {
  name: 'Settings',
  data: () => {
    return {
      dbFile: '',
      billsCount: 0,
      historyRecords: 0
    };
  },
  components: {
    Navigation
  },
  mounted: function() {
    if (Db.check()) {
      const Conf = Db.getAppConf();
      this.dbFile = Conf.dbJsonSrc;
      console.debug('app conf', Conf);
    }
  },
  methods: {
    dbSetup: function() {
      Db.createNew().then((fileName) => {
        console.debug('created', fileName);
        this.dbFile = fileName;
      }).catch((err) => {
        console.debug(err);
      });
    },
    dbOpen: function() {
      Db.openExisted().then((db) => {
        console.debug('loaded', db);
        this.dbFile = db.filePath;
      }).catch((err) => {
        console.debug(err);
      });
    },
    dbUnset: function() {
      Db.unset().then((db) => {
        this.dbFile = '';
      }).catch((err) => {
        console.debug(err);
      });
    }
  }
}
</script>

<style lang="css">
</style>
