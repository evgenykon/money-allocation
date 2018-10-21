<template lang="html">
    <div class="container-fluid">
      <navigation current="allocation"></navigation>
      <section>
          <div class="row mt-5">
              <div class="col">
                  <form>
                    <div class="form-group row">
                      <label class="col-sm-3 col-form-label">Сумма распределяемого дохода</label>
                      <div class="col-sm-4">
                        <input type="text" class="form-control" v-model.number="incomeAmount">
                      </div>
                      <div class="col-sm-2">
                        <button type="button" class="btn btn-primary" >Внести</button>
                      </div>
                    </div>
                  </form>
              </div>
          </div>
          <div class="row mt-3">
              <div class="col">
                  <p>Указанная сумма автоматически распределится на счета согласно указанным процентам</p>
              </div>
          </div>
          <div class="row mt-3">
              <div class="col">
                  <ul class="list-group">
                      <li class="d-flex list-group-item justify-content-between" v-for="item in this.$store.getters.getBillsWithPercent">
                          {{item.name}}
                          <div class="d-flex justify-content-end">
                              <span class="mr-3 badge badge-secondary">{{Number(item.percent).toFixed(2)}}%</span>
                              <span class="mr-3">{{Number(item.amount).toFixed(2)}} {{currency}}</span>
                              <span class="text-success mr-3">+{{calcIncomeAmountForBill(item)}} {{currency}}</span>
                              <span class="text-primary">= {{calcResultAmountForBill(item)}} {{currency}}</span>
                          </div>
                      </li>
                </ul>
              </div>
          </div>
          <div class="row mt-3">
              <div class="col">
                  <p v-if="totalPercent === 0" class="alert alert-warning">Не указан ни один счет с процентом от дохода</p>
                  <p v-if="totalPercent < 100" class="alert alert-warning">Распределено {{totalPercent}}% дохода</p>
                  <p v-if="totalPercent > 100" class="alert alert-warning">Ошибка в распределении доходов: общий процент больше 100</p>
              </div>
          </div>
      </section>
    </div>
</template>

<script>
import Navigation from './Navigation';
import _ from 'lodash';
export default {
  name: 'Allocation',
  components: {
    Navigation
  },
  data: function() {
    return {
      currency: '',
      incomeAmount: 0,
      totalPercent: 0
    }
  },
  mounted: function() {
    this.$store.dispatch('loadDb').then(() => {
      this.currency = this.$store.getters.getCurrency;
      this.totalPercent = 0;
      for (let i in this.$store.getters.getBillsWithPercent) {
          let item = this.$store.getters.getBillsWithPercent[i];
          this.totalPercent += _.round(item.percent, 2);
      }
    });
  },
  methods: {
      calcIncomeAmountForBill: function(item) {
          return _.round(item.percent * this.incomeAmount / 100, 2);
      },
      calcResultAmountForBill: function(item) {
          return _.round(item.amount + this.calcIncomeAmountForBill(item),2);
      }
  }
}
</script>

<style lang="css">
</style>
