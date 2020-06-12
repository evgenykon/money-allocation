<template>
<v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list dense>

        <side-bar-item icon="lock" text="Language" v-on:click="onClickLanguage"></side-bar-item>
        <side-bar-item icon="lock" text="Logout" v-on:click="onClickLogout"></side-bar-item>
        
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Money Allocation</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="start" justify="start">
          <v-col cols="6" class="text-left">
            <v-btn-toggle
              dense
              dark
              multiple
              fluid
            >
              <v-btn title="Add account" @click="onClickAddAccount">
                <v-icon>mdi-account-cash</v-icon>
              </v-btn>
              <v-btn title="Show chart" :disabled="this.$store.getters.getBills.length === 0">
                <v-icon>mdi-chart-areaspline</v-icon>
              </v-btn>
              <v-btn title="Autocharge" :disabled="this.$store.getters.getBills.length === 0">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        
        <v-row align="start" justify="center">
          <v-col cols="12" class="text-left">
            <bill-list :list="this.$store.getters.getBills"></bill-list>
          </v-col>
        </v-row>


        <v-row align="start" justify="center">
          <v-col cols="8" class="text-right pt-4">
            Total
          </v-col>
          <v-col cols="4" class="pr-4">
            <v-chip text-color="white" class="mr-4 fluid">
              <v-icon>mdi-currency-rub</v-icon>
              {{getTotal}}
            </v-chip>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
    <v-footer app>
      <span class="white--text">&copy; effus labs</span>
    </v-footer>

    <v-snackbar
      top
      color="red darken-4"
      v-model="errorMessage.flag"
      :timeout="5000"
    >
      {{ errorMessage.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
  import {mixin as VueTimers} from 'vue-timers';
  import SideBarItem from '../components/SideBarItem.vue';
  import BillList from '../components/BillsList.vue';

  export default {
    components: {
        SideBarItem, BillList
    },
    mixins: [VueTimers],
    timers: {
      onClickLogout: { time: 3000, autostart: false }
    },
    data: () => ({
      drawer: null,
      errorMessage: {
        flag: false,
        text: ''
      }
    }),
    computed: {
      getTotal() {
        let sum = 0;
        this.$store.getters.getBills.forEach((item) => {
          sum += parseFloat(item.lastRevision.balance_amount);
        });
        return sum.toFixed(2);
      }
    },
    mounted: function() {
      this.drawer = null;
      this.$store.dispatch('loadBills').catch(this.onError);
    },
    methods: {
      onError(e) {
        this.errorMessage.flag = true;
        this.errorMessage.text = e.message;
        if (e.message === 'Token expired') {
          this.$timer.start('onClickLogout');
        }
      },
      onClickLanguage() {
        this.$router.push({ name: 'Language' });
      },
      onClickLogout() {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({ name: 'Home' })
        }).catch(console.error);
      },
      onClickAddAccount() {
        this.$router.push({ name: 'Forms', params: { formId: 'addBill' } })
      }
    }
  }
</script>
