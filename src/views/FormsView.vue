<template>
  <v-app id="inspire">
    <v-app-bar app dark dense>
      <v-btn icon @click="onClickHome">
        <v-icon>mdi-backspace</v-icon>
      </v-btn>
      <v-toolbar-title>Money Allocation</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid ref="container" class="mb-4">
        
        <form-add-new-bill v-if="formId === 'addBill'"></form-add-new-bill>

        <form-charge-funds v-if="formId === 'chargeFunds'"></form-charge-funds>

        <form-add-revision v-if="formId === 'addRevision'"></form-add-revision>

        <form-transfer v-if="formId === 'transfer'"></form-transfer>
        
        <form-bill-group v-if="formId === 'addBillGroup'"></form-bill-group>

        <form-bill-group v-if="formId === 'editBillGroup'"></form-bill-group>

        <form-autocharge v-if="formId === 'autoCharge'"></form-autocharge>

      </v-container>
    </v-main>

    <v-footer fixed app class="d-flex flex-row justify-center">
        <v-btn color="secondary" class="mx-3" @click="onClickHome">Cancel</v-btn>
        <v-btn color="primary" class="mx-3" @click="onClickSubmit">Submit</v-btn>
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
import { FormEventBus } from '../components/forms/FormEventBus.js';
import FormAddNewBill from '../components/forms/FormAddNewBill.vue';
import FormChargeFunds from '../components/forms/FormChargeFunds.vue';
import FormAddRevision from '../components/forms/FormAddRevision.vue';
import FormTransfer from '../components/forms/FormTransfer.vue';
import FormBillGroup from '../components/forms/FormBillGroup.vue';
import FormAutocharge from '../components/forms/FormAutocharge.vue';

export default {
    components: {
      FormAddNewBill, FormChargeFunds, FormAddRevision, FormTransfer, FormBillGroup, FormAutocharge
    },
    data: () => ({
        formId: null,
        errorMessage: {
          flag: false,
          text: ''
        }
    }),
    mounted: function() {
        this.formId = this.$router.currentRoute.params.formId;
        if (!this.formId) {
          this.onClickHome();
        }
        FormEventBus.$on('submit-complete', this.onClickHome);
        FormEventBus.$on('submit-error', this.showError);
    },
    beforeDestroy() {
        FormEventBus.$off('submit-complete');
        FormEventBus.$off('submit-error');
    },
    methods: {
      onClickHome() {
        this.$router.push({ name: 'Home' });
      },
      showError(e) {
        this.errorMessage.text = e.message;
        this.errorMessage.flag = true;
      },
      async onClickSubmit() {
        FormEventBus.$emit('run-submit');
      }
    }
}
</script>
