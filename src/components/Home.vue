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
  <section v-if="selectedCategory">
    <div class="row mt-3">
      <div class="col-lg-6">
        <div class="list-group mb-3">
          <a href="#" class="list-group-item list-group-item-action flex-column align-items-start" v-for="item in bills">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{item.name}}</h5>
              <small>{{item.category}}</small>
            </div>
            <p class="mb-1">{{Number(item.amount).toFixed(2)}}</p>
            <div class="d-flex w-100 justify-content-end">
              <small>Limit: <span class="badge badge-light mr-3">{{Number(item.limit).toFixed(2)}}</span></small>
              <small>Percent: <span class="badge badge-light">{{Number(item.percent).toFixed(2)}}%</span></small>
            </div>
            <div class="progress mt-2">
              <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
            </div>
          </a>
        </div>
        <button type="button" v-if="!addBillForm" name="button" class="btn btn-secondary btn-sm" @click="onClickAddBill">Добавить счет</button>
      </div>
    </div>
    <div class="row mt-3" v-if="addBillForm">
      <div class="col-lg-6">
        <form>
          <div class="form-group">
            <label for="billName">Название счета</label>
            <input type="text" class="form-control form-control-sm" id="billName" v-model="billForm.name">
            <small class="form-text text-muted">Банк + 4 цифры номера карты будет достаточно, например: Сбер 4444</small>
          </div>
          <div class="form-group">
            <label for="billAmount">Сумма на счете</label>
            <input type="number" class="form-control form-control-sm" id="billAmount" v-model.number="billForm.amount">
            <small class="form-text text-muted">Если это существующий счет, то впишите имеющуюся сумму, или оставьте 0.00</small>
          </div>
          <div class="form-group">
            <label for="billAmount">Лимит</label>
            <input type="number" class="form-control form-control-sm" id="billLimit" v-model.number="billForm.limit">
            <small class="form-text text-muted">Пока сумма на счете будет меньше лимита, на него будут зачислятся проценты от поступлений</small>
          </div>
          <div class="form-group">
            <label for="billPercent">Процент от поступлений</label>
            <input type="number" class="form-control form-control-sm" id="billPercent" v-model.number="billForm.percent">
            <small class="form-text text-muted">Такой процент от дохода следует переводить на счет</small>
          </div>
          <button type="button" class="btn btn-primary" @click="onClickSubmitBill">Добавить счет</button>
          <button type="button" class="btn btn-secondary">Отмена</button>
        </form>
      </div>
    </div>
  </section>
</div>
</template>

<script type="text/javascript">
import Navigation from './Navigation';
import Db from '@/helpers/db.js';
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
        name: '',
        amount: 0,
        limit: 0,
        percent: 0
      }
    }
  },
  mounted: function() {
    if (!Db.check()) {
      this.$router.push('Settings')
    } else {
      this.$store.dispatch('loadDb');
    }
  },
  components: {
    Navigation
  },
  methods: {
    onClickAddCategoryFormShow: function() {
      this.addCategoryForm = true;
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
      this.getBillByCategory();
    },
    getBillByCategory: function() {
      this.bills = [];
      for (let i in this.$store.getters.getBillsItems) {
        if (this.$store.getters.getBillsItems[i].category === this.selectedCategory) {
          this.bills.push(this.$store.getters.getBillsItems[i]);
        }
      }
    }
  }
}
</script>
