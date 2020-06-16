<template>
    <form>
        <h3 class="mb-5">Transfer funds</h3>
        <v-text-field v-if="sourceBill"
            :value="sourceBill.name + ' (' + balance + ')'"
            label="Source bill"
            readonly
        ></v-text-field>
        <v-select
            :items="bills"
            v-model="targetBill"
            item-text="label"
            item-value="id"
            label="Target bill"
            :error-messages="errors.targetBill"
            dense
        ></v-select>
        <v-text-field 
            v-model="transferAmount"
            :error-messages="errors.transferAmount"
            label="Transfer amount"
            type="number"
            required
        ></v-text-field>
    </form>
</template>

<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        sourceBill: null,
        balance: null,
        targetBill: null,
        bills: [],
        transferAmount: 0,
        errors: {
            targetBill: '',
            transferAmount: ''
        }
    }),
    mounted() {
        this.sourceBill = this.$router.currentRoute.params.sourceBill;
        this.balance = this.$router.currentRoute.params.balance;
        this.bills = this.$router.currentRoute.params.bills.map(item => ({
            label: item.name + ' (' + item.id + ')',
            id: item.id
        }));
        FormEventBus.$on('run-submit', async () => {
            if (this.validate()) {
                this.submit();
            }
        });
    },
    beforeDestroy() {
        FormEventBus.$off('run-submit');
    },
    methods: {
        async submit() {
            try {
                await this.$store.dispatch('transfer', {
                    sourceBillId: this.sourceBill.id,
                    targetBillId: this.targetBill,
                    transferAmount: this.transferAmount
                });
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                console.error('FormTransfer', e);
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            this.errors.targetBill = '';
            this.errors.transferAmount = '';
            if (this.targetBill === null) {
                this.errors.targetBill = 'Target bill not selected';
                return false;
            }
            const amount = parseFloat(this.transferAmount);
            if (isNaN(amount)) {
                this.errors.transferAmount = 'Invalid value';
                return false;
            }
            if (amount <= 0) {
                this.errors.transferAmount = 'Value must be greater than zero';
                return false;
            }
            if (amount > parseFloat(this.balance)) {
                this.errors.transferAmount = 'insufficient funds';
                return false;
            }
            return true;
        }
    }
}
</script>
