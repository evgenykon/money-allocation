<template>
<div class="container-fluid">
  <navigation current="home"></navigation>
  <section>
    <ul class="nav nav-pills nav-justified w-100">
      <li class="nav-item pr-2" v-for="item in this.$store.getters.getBillCategories">
        <a class="nav-link shadow-sm" :class="{active: item === selectedCategory}" href="#" @click="onClickFilterByCategory(item)">{{item}}</a>
      </li>
      <li class="nav-item pl-2">
        <a class="nav-link bg-warning shadow-sm" :class="{active: addCategoryForm}" href="#" @click="onClickAddCategoryFormShow">Добавить категорию</a>
      </li>
    </ul>
  </section>
  <section v-if="addCategoryForm" class="mt-2">
    <form>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label">Название категории / копилки</label>
        <div class="col-sm-7">
          <input type="text" class="form-control" v-model="categoryName">
        </div>
        <div class="col-sm-2">
          <button type="button" class="btn btn-primary" @click="onClickAddCategory">Добавить</button>
          <button type="button" class="btn btn-secondary" @click="onClickCloseAddCategory">X</button>
        </div>
      </div>
    </form>
  </section>
  <section>
    <div class="row mt-3">
      <div class="col-lg-6" v-if="selectedCategory">
        <div class="list-group mb-3">
          <a href="#" class="list-group-item list-group-item-action flex-column align-items-start" v-for="item in bills" @click="onClickEditBill(item)" :class="{active: item.id === billForm.id}">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{item.name}}</h5>
              <small>{{item.category}}</small>
            </div>
            <div class="d-flex w-100 justify-content-end">
              <div class="col-6">
                <p class="mb-1">{{Number(item.amount).toFixed(2)}} {{currency}}</p>
              </div>
              <div class="col-6">
                <small v-if="item.limit > 0">Limit: <span class="badge badge-light">{{Number(item.limit).toFixed(2)}} {{currency}}</span></small>
              </div>
            </div>
            <div class="progress mt-2" v-if="item.percent > 0">
              <div class="progress-bar bg-info" role="progressbar" :style="{width: item.percent+'%'}" :aria-valuenow="item.percent" aria-valuemin="0" aria-valuemax="100">{{item.percent}}% - доля от дохода</div>
            </div>
            <div class="progress mt-2" v-if="item.limit > 0">
              <div class="progress-bar bg-success" role="progressbar" :style="{width: calcPercent(item)+'%'}" :aria-valuenow="calcPercent(item)" aria-valuemin="0" aria-valuemax="100">{{calcPercent(item)}}% - накоплено</div>
            </div>
            <div class="progress mt-2">
              <div class="progress-bar" role="progressbar" :style="{width: calcPercentOfTotal(item)+'%'}" :aria-valuenow="calcPercentOfTotal(item)" aria-valuemin="0" aria-valuemax="100">
                {{calcPercentOfTotal(item)}}% - доля от всех накоплений
              </div>
            </div>
          </a>
        </div>
        <button type="button" v-if="!addBillForm" name="button" class="btn btn-secondary btn-sm" @click="onClickAddBill">Добавить счет</button>
      </div>
      <div class="col-lg-6">
          <h4>Общая сумма накоплений: <span class="badge badge-secondary">{{Number(this.$store.getters.getTotalAmount).toFixed(2)}} {{currency}}</span></h4>
          <p v-if="selectedCategory">Сумма накоплений в данной категории: <span class="badge badge-secondary">{{Number(getCategoryAmount()).toFixed(2)}} {{currency}}</span></p>
      </div>
    </div>
    <div class="row mt-3" v-if="addBillForm">
      <div class="col-lg-6">
        <form>
          <div class="form-group">
            <label for="billName">Название счета</label>
            <input type="text" class="form-control form-control-sm" id="billName" v-model="billForm.name">
            <small class="form-text text-muted">Банк + 4 цифры номера карты будет достаточно, например: Visa 4444</small>
          </div>
          <div class="form-group">
            <label for="billAmount">Сумма на счете, {{currency}}</label>
            <input type="number" class="form-control form-control-sm" id="billAmount" v-model.number="billForm.amount">
            <small class="form-text text-muted">Если это существующий счет, то впишите имеющуюся сумму, или оставьте 0.00</small>
          </div>
          <div class="form-group">
            <label for="billAmount">Лимит, {{currency}}</label>
            <input type="number" class="form-control form-control-sm" id="billLimit" v-model.number="billForm.limit">
            <small class="form-text text-muted">Пока сумма на счете будет меньше лимита, на него будут зачислятся проценты от поступлений</small>
          </div>
          <div class="form-group">
            <label for="billPercent">Процент от поступлений</label>
            <input type="number" class="form-control form-control-sm" id="billPercent" v-model.number="billForm.percent">
            <small class="form-text text-muted">Такой процент от дохода следует переводить на счет</small>
          </div>
          <button type="button" class="btn btn-primary" v-if="!billForm.isEdit" @click="onClickSubmitBill">Добавить счет</button>
          <button type="button" class="btn btn-primary" v-if="billForm.isEdit" @click="onClickUpdateBill">Обновить счет</button>
          <button type="button" class="btn btn-secondary" @click="onClickCancelEditBill">Отмена</button>
        </form>
      </div>
    </div>
  </section>
</div>
</template>

<script type="text/javascript">
import Navigation from './Navigation';
import Db from '@/helpers/db.js';
import _ from 'lodash';
export default {
  name: 'Home',
  data() {
    return {
      addCategoryForm: false,
      categoryName: '',
      selectedCategory: '',
      bills: [],
      addBillForm: false,
      billForm: {
        id: null,
        name: '',
        amount: 0,
        limit: 0,
        percent: 0,
        isEdit: false
      },
      currency: ''
    }
  },
  mounted: function() {
    if (!Db.check()) {
      this.$router.push('Settings')
    } else {
      this.$store.dispatch('loadDb').then(() => {
        this.currency = this.$store.getters.getCurrency;
      });
    }
  },
  components: {
    Navigation
  },
  methods: {
    onClickAddCategoryFormShow: function() {
      this.bills = [];
      this.addCategoryForm = true;
      this.selectedCategory = '';
    },
    onClickAddCategory: function() {
      this.$store.commit('addCategory', this.categoryName);
      this.addCategoryForm = false;
      this.categoryName = '';
    },
    onClickCloseAddCategory: function() {
      this.addCategoryForm = false;
      this.categoryName = '';
    },
    onClickFilterByCategory: function(name) {
      this.selectedCategory = name;
      this.getBillByCategory();
    },
    onClickAddBill: function() {
      this.addBillForm = true;
    },
    onClickSubmitBill: function() {
      this.$store.commit('addBill', {
        id: Math.floor(Math.random() * 1000 + 1),
        name: this.billForm.name,
        category: this.selectedCategory,
        amount: parseFloat(this.billForm.amount),
        percent: parseFloat(this.billForm.percent),
        limit: parseFloat(this.billForm.limit)
      });
      this.$store.dispatch('saveBills');
      this.getBillByCategory();
      this.addBillForm = false;
      this.resetBillForm();
    },
    onClickEditBill: function(item) {
        this.addBillForm = true;
        this.billForm.id = item.id;
        this.billForm.name = item.name;
        this.billForm.amount = item.amount;
        this.billForm.limit = item.limit;
        this.billForm.percent = item.percent;
        this.billForm.isEdit = true;
        console.debug('onClickEditBill', item);
    },
    onClickUpdateBill: function() {
        this.$store.commit('updateBill', {
          id: this.billForm.id,
          name: this.billForm.name,
          category: this.selectedCategory,
          amount: parseFloat(this.billForm.amount),
          percent: parseFloat(this.billForm.percent),
          limit: parseFloat(this.billForm.limit)
        });
        this.$store.dispatch('saveBills');
        this.getBillByCategory();
        this.addBillForm = false;
        this.resetBillForm();
    },
    onClickCancelEditBill: function() {
        this.addBillForm = false;
        this.resetBillForm();
    },
    resetBillForm: function() {
        this.billForm.id = null;
        this.billForm.name = '';
        this.billForm.amount = 0;
        this.billForm.limit = 0;
        this.billForm.percent = 0;
        this.billForm.isEdit = false;
    },
    getBillByCategory: function() {
      this.bills = [];
      for (let i in this.$store.getters.getBillsItems) {
        if (this.$store.getters.getBillsItems[i].category === this.selectedCategory) {
          this.bills.push(this.$store.getters.getBillsItems[i]);
        }
      }
    },
    getCategoryAmount: function() {
        let amount = 0;
        if (!this.selectedCategory) {
            return amount;
        }
        for (let i in this.$store.getters.getBillsItems) {
          if (this.$store.getters.getBillsItems[i].category === this.selectedCategory) {
            amount += _.round(this.$store.getters.getBillsItems[i].amount, 2);
          }
        }
        return amount;
    },
    calcPercent: function(item) {
      if (item.limit === 0) {
        return 100;
      }
      return _.round(item.amount * 100 / item.limit, 2);
    },
    calcPercentOfTotal: function(item) {
      const total = this.$store.getters.getTotalAmount;
      if (total === 0) {
        return 100;
      }
      return _.round(item.amount * 100 / total, 2);
    }
  }
}
</script>
