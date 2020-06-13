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
        <form v-if="formId === 'addBill'">
          <h3 class="mb-5">Add new bill</h3>
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
        <form v-if="formId === 'chargeFunds'">
          <h3 class="mb-5">Charge funds</h3>
          <v-text-field 
            v-model="chargeFunds.billId"
            label="Bill ID"
            readonly
          ></v-text-field>
          <v-text-field 
            v-model="chargeFunds.chargeAmount"
            :error-messages="chargeFunds.errors.chargeAmount"
            label="Charge amount"
            type="number"
            required
          ></v-text-field>
        </form>
        <form v-if="formId === 'addRevision'">
          <h3 class="mb-5">Add new revision</h3>
          <v-text-field 
            v-model="addRevision.billId"
            label="Bill ID"
            readonly
          ></v-text-field>
          <v-text-field 
            v-model="addRevision.balanceAmount"
            :error-messages="addRevision.errors.balanceAmount"
            label="Bill balance amount"
            type="number"
            required
          ></v-text-field>
        </form>
        <form v-if="formId === 'transfer'">
          <h3 class="mb-5">Transfer funds</h3>
          <v-text-field 
            :value="transfer.sourceBill.name + ' (' + transfer.balance + ')'"
            label="Source bill"
            readonly
          ></v-text-field>
          <v-select
            :items="transfer.bills"
            v-model="transfer.targetBill"
            item-text="label"
            item-value="id"
            label="Target bill"
            :error-messages="transfer.errors.targetBill"
            dense
          ></v-select>
          <v-text-field 
            v-model="transfer.transferAmount"
            :error-messages="transfer.errors.transferAmount"
            label="Transfer amount"
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
        },
        chargeFunds: {
          billId: null,
          balance: null,
          chargeAmount: 0,
          errors: {
            chargeAmount: ''
          }
        },
        addRevision: {
          billId: null,
          balance: null,
          balanceAmount: 0,
          errors: {
            balanceAmount: ''
          }
        },
        transfer: {
          sourceBill: null,
          balance: null,
          targetBill: null,
          bills: [],
          transferAmount: 0,
          errors: {
            targetBill: '',
            transferAmount: ''
          }
        }
    }),
    mounted: function() {
        this.formId = this.$router.currentRoute.params.formId;
        if (!this.formId) {
          this.$router.push({ name: 'Home' });
        }
        if (this.formId === 'addRevision') {
          this.addRevision.billId = this.$router.currentRoute.params.billId;
          this.addRevision.balanceAmount = this.$router.currentRoute.params.balance;
          this.addRevision.balance = this.$router.currentRoute.params.balance;
        }
        if (this.formId === 'chargeFunds') {
          this.chargeFunds.billId = this.$router.currentRoute.params.billId;
          this.chargeFunds.balance = this.$router.currentRoute.params.balance;
        }
        if (this.formId === 'transfer') {
          this.transfer.sourceBill = this.$router.currentRoute.params.sourceBill;
          this.transfer.balance = this.$router.currentRoute.params.balance;
          this.transfer.bills = this.$router.currentRoute.params.bills.map(item => ({
            label: item.name + ' (' + item.id + ')',
            id: item.id
          }));
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
        if (this.formId === 'addRevision') {
          if (this.revisionValidator()) {
            const diff = parseFloat(this.addRevision.balanceAmount) - parseFloat(this.addRevision.balance);
            await this.$store.dispatch('createRevision', {
              billId: this.addRevision.billId,
              chargeAmount: diff.toFixed(2)
            });
          } else {
            return;
          }
        }
        if (this.formId === 'chargeFunds') {
          if (this.chargeValidator()) {
            await this.$store.dispatch('createRevision', {
              billId: this.chargeFunds.billId,
              chargeAmount: this.chargeFunds.chargeAmount
            });
          } else {
            return;
          }
        }
        if (this.formId === 'transfer') {
          if (this.transferValidator()) {
            await this.$store.dispatch('transfer', this.transfer);
          } else {
            return;
          }
        }
        this.$router.push({ name: 'Home' });
      },
      chargeValidator() {
        const amount = parseFloat(this.chargeFunds.chargeAmount);
        this.chargeFunds.errors.chargeAmount = '';
        if (isNaN(amount)) {
          this.chargeFunds.errors.chargeAmount = 'Invalid value';
          return false;
        }
        if (amount < 0 && parseFloat(this.chargeFunds.balance) <= 0) {
          this.chargeFunds.errors.chargeAmount = 'Balance is negative';
          return false;
        }
        if (amount < 0 && Math.abs(amount) > parseFloat(this.chargeFunds.balance)) {
          this.chargeFunds.errors.chargeAmount = 'Balance is less than amount';
          return false;
        }
        return true;
      },
      revisionValidator() {
        const amount = parseFloat(this.addRevision.balanceAmount);
        this.addRevision.errors.balanceAmount = '';
        if (isNaN(amount)) {
          this.addRevision.errors.balanceAmount = 'Invalid value';
          return false;
        }
        if (amount < 0) {
          this.addRevision.errors.balanceAmount = 'Balance could not be negative';
          return false;
        }
        if (parseInt(this.addRevision.balanceAmount * 100) === parseInt(this.addRevision.errors.balance)) {
          this.addRevision.errors.balanceAmount = 'Balance is the same';
          return false;
        }
        return true;
      },
      transferValidator() {
        this.transfer.errors.targetBill = '';
        this.transfer.errors.transferAmount = '';
        if (this.transfer.targetBill === null) {
          this.transfer.errors.targetBill = 'Target bill not selected';
          return false;
        }
        const amount = parseFloat(this.transfer.transferAmount);
        if (isNaN(amount)) {
          this.transfer.errors.transferAmount = 'Invalid value';
          return false;
        }
        if (amount <= 0) {
          this.transfer.errors.transferAmount = 'Value must be greater than zero';
          return false;
        }
        if (amount > parseFloat(this.transfer.balance)) {
          this.transfer.errors.transferAmount = 'insufficient funds';
          return false;
        }
        return true;
      }
    }
}
</script>
