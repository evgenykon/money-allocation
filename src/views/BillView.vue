<template>
  <v-app id="inspire">
    <v-app-bar app dark dense>
      <v-btn icon @click="onClickHome">
        <v-icon>mdi-backspace</v-icon>
      </v-btn>
      <v-toolbar-title>Money Allocation</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid ref="container" v-if="$store.getters.getCurrentBill">
      
        <v-row align="start" justify="center">
          <v-col cols="12" class="text-left">
            <h3>Bill - {{$store.getters.getCurrentBill.name}}</h3>
          </v-col>
        </v-row>

        <v-row align="start" justify="start">
            <v-col cols="8">
                <v-list class="transparent">
                    <v-list-item>
                        <v-list-item-title>id</v-list-item-title>
                        <v-list-item-title>{{$store.getters.getCurrentBill.id}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Balance</v-list-item-title>
                        <v-list-item-title>0</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Last revision date</v-list-item-title>
                        <v-list-item-title>11.06.2020</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Last revision amount</v-list-item-title>
                        <v-list-item-title>0</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>

      </v-container>
    </v-main>

    <v-footer fixed app class="d-flex flex-row justify-center">
        <v-btn color="secondary" class="mx-3" @click="onClickDeclineLastRevision">Decline last revision</v-btn>
        <v-btn color="primary" class="mx-3" @click="onClickNewRevision">New revision</v-btn>
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
export default {
    data: () => ({
        id: null,
        errorMessage: {
            flag: false,
            text: ''
        }
    }),
    mounted: function() {
        this.id = this.$router.currentRoute.params.id;
        if (!this.id) {
          this.$router.push({ name: 'Home' });
        }
        this.$store.dispatch('setCurrent', {
            id: this.id
        })
        .then(() => {
            if (!this.$store.getters.getCurrentBill) {
                this.$router.push({ name: 'Home' });
            }

        })
        .catch(this.onError);
    },
    methods: {
      onClickHome() {
        this.$router.push({ name: 'Home' });
      },
      onClickNewRevision() {

      },
      onError(e) {
        this.errorMessage.flag = true;
        this.errorMessage.text = e.message;
        if (e.message === 'Token expired') {
          this.$timer.start('onClickLogout');
        }
      }
    }
}
</script>
