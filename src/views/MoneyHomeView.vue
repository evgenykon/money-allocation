<template>
<v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list dense>

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
      
        <v-row align="start" justify="center">
          <v-col cols="12" class="text-left">
            {{this.$store.getters.getBills}}
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
  //import Contacts from "../components/Contacts.vue"; 
  import SideBarItem from '../components/SideBarItem.vue';
  //import Vue from 'vue';
  //import VueTimers from 'vue-timers';
  //Vue.use(VueTimers);

  export default {
    components: {
        SideBarItem
    },
    //mixins: [VueTimers],
    /*timers: {
      onClickLogout: { time: 3000, autostart: false }
    },*/
    props: {
    },
    data: () => ({
      drawer: null,
        errorMessage: {
          flag: false,
          text: ''
        }
    }),
    mounted: function() {
      this.drawer = null;
      //this.$store.dispatch('loadBills').catch(this.onError);
    },
    methods: {
      onError(e) {
        this.errorMessage.flag = true;
        this.errorMessage.text = e.message;
        if (e.message === 'Token expired') {
          //this.$timer.start('onClickLogout');
        }
      },
      onClickLogout() {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({ name: 'Home' })
        }).catch(console.error);
      }
    }
  }
</script>
