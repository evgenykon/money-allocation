<template>
  <v-app id="inspire">
    <v-app-bar app dark dense>
      <v-btn icon @click="onClickHome">
        <v-icon>mdi-backspace</v-icon>
      </v-btn>
      <v-toolbar-title>Money Allocation</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid ref="container">
      <form v-if="formId === 'addBill'">
        <h3>Add new bill</h3>
        <v-text-field 
          v-model="addBill.name"
          :error-messages="addBill.errors.name"
          counter="100"
          label="Name"
          required
        ></v-text-field>
        <v-text-field 
          v-model="addBill.initAmount"
          :error-messages="addBill.errors.initAmount"
          label="Initial amount"
          type="number"
          required
        ></v-text-field>
      </form>
      </v-container>
    </v-main>

    <v-footer fixed app class="d-flex flex-row justify-center">
        <v-btn color="secondary" class="mx-3" @click="onClickHome">Cancel</v-btn>
        <v-btn color="primary" class="mx-3" @click="onClickSubmit">Submit</v-btn>
    </v-footer>
    
  </v-app>
</template>

<script>
export default {
    data: () => ({
        formId: null,
        addBill: {
          name: '',
          initAmount: 0,
          errors: {
            name: '',
            initAmount: ''
          }
        }
    }),
    mounted: function() {
        this.formId = this.$router.currentRoute.params.formId;
        if (!this.formId) {
          this.$router.push({ name: 'Home' });
        }
    },
    methods: {
      onClickHome() {
        this.$router.push({ name: 'Home' });
      },
      async onClickSubmit() {
        if (this.formId === 'addBill') {
          await this.$store.dispatch('createBill', this.addBill);
        }
        this.$router.push({ name: 'Home' });
      }
    }
}
</script>
