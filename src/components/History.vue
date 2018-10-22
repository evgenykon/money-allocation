<template lang="html">
    <div class="container-fluid">
      <navigation current="history"></navigation>
      <section>
          <div class="row">
            <div class="col-4">
              <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" v-for="(name, i) in tabList"
                  :class="{active: tab===i}"
                  @click="openTab(i)">{{name}}</a>
              </div>
            </div>
            <div class="col-8">
              <h4>{{tabList[tab]}}</h4>
              <div class="row">
                <div class="col">
                  <ul  class="list-group list-group-flush">
                    <li class="list-group-item list-group-item-action flex-column align-items-start" v-for="item in items">
                      <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">{{item.title}}</h5>
                          <small>{{new Date(item.dt).toLocaleString()}}</small>
                          <p class="mb-1">{{item.bill}}</p>
                          <small>{{item.comment}}</small>
                        </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </section>
    </div>
</template>

<script>
import Navigation from './Navigation';
export default {
  name: 'History',
  components: {
    Navigation
  },
  data: () => {
    return {
      tab: '',
      tabList: {
        incomes: 'Внесения',
        transfers: 'Переводы по счету',
        balances: 'Балансы счетов'
      },
      items: []
    }
  },
  mounted: function() {
    this.openTab('incomes');
  },
  methods: {
    openTab: function(tab) {
      this.tab = tab;
      this.items = [];
      if (tab === 'incomes') {
        let items = this.$store.getters.getHistoryIncomes;
        for (let i in items) {
          let bill = this.getBillById();
          this.items.push({
            title: '+'+items[i].amount,
            dt: items[i].dt,
            bill: '',
            comment: '',
          });
        }

      } else if (tab === 'transfers') {
        let items = this.$store.getters.getHistoryTransfers;
        for (let i in items) {
          let bill = this.getBillById(items[i].bill);
          let sign = '';
          let comment = '';
          if (items[i].direction === 'in') {
            sign = '+';
            comment = 'пополнение счета';
          }
          this.items.push({
            title: sign + items[i].amount,
            dt: items[i].dt,
            bill: 'Счет: '+bill.name,
            comment: comment,
          });
        }
      } else if (tab === 'balances') {
        let items = this.$store.getters.getHistoryBalances;
        for (let i in items) {
          let bill = this.getBillById(items[i].bill);
          this.items.push({
            title: items[i].amount,
            dt: items[i].dt,
            bill: 'Счет: '+bill.name,
            comment: '',
          });
        }
      }
    },
    getBillById: function(id) {
      for (let i in this.$store.getters.getBillsItems) {
        let item = this.$store.getters.getBillsItems[i];
        if (item.id === id) {
          return item;
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
