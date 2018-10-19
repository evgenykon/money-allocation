<template>
<div class="container-fluid">
  <navigation current="home"></navigation>
  <section>
    <ul class="nav nav-pills nav-justified w-100">
      <li class="nav-item" v-for="item in this.$store.getters.getBillCategories">
        <a class="nav-link" href="#">{{item}}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{active: addCategoryForm}" href="#" @click="onClickAddCategoryFormShow">Добавить категорию</a>
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
        </div>
      </div>
    </form>
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
      categoryName: ''
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
    }
  }
}
</script>
