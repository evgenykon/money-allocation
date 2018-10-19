<template lang="">
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
  <a class="navbar-brand" href="#">Распределение дохода</a>
  <ul class="navbar-nav">
    <li class="nav-item" :class="{active:current==='home'}">
      <router-link to="home" class="nav-link">Счета</router-link>
    </li>
    <li class="nav-item" :class="{active:current==='allocation'}">
      <router-link to="allocation" class="nav-link">Распределение</router-link>
    </li>
    <li class="nav-item" :class="{active:current==='history'}">
      <router-link to="history" class="nav-link">История</router-link>
    </li>
    <li class="nav-item" :class="{active:current==='generator'}">
      <router-link to="generator" class="nav-link">Генератор</router-link>
    </li>
    <li class="nav-item" :class="{active:current==='settings'}">
      <router-link to="settings" class="nav-link">Настройки</router-link>
    </li>
  </ul>
</nav>
</template>

<script>
export default {
  name: 'navigation',
  props: {
    current: {
      type: String,
      default: 'home'
    }
  }
}
</script>

<style lang="scss">
</style>
