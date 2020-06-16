<template>
    <form >
        <h3 class="mb-5">Charge funds</h3>
        <v-text-field 
            v-model="billId"
            label="Bill ID"
            readonly
        ></v-text-field>
        <v-text-field 
            v-model="chargeAmount"
            :error-messages="errors.chargeAmount"
            label="Charge amount"
            type="number"
            required
        ></v-text-field>
    </form>
</template>


<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        billId: '',
        balance: 0,
        chargeAmount: 0,
        errors: {
            chargeAmount: ''
        }
    }),
    mounted() {
        this.billId = this.$router.currentRoute.params.billId;
        this.balance = this.$router.currentRoute.params.balance;
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
                await this.$store.dispatch('createRevision', {
                    billId: this.billId,
                    chargeAmount: this.chargeAmount
                });
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            const amount = parseFloat(this.chargeAmount);
            this.errors.chargeAmount = '';
            if (isNaN(amount)) {
                this.errors.chargeAmount = 'Invalid value';
                return false;
            }
            if (parseInt(amount*100) === 0) {
                this.errors.chargeAmount = 'Charging with zero ;)';
                return false;
            }
            if (amount < 0 && parseFloat(this.balance) <= 0) {
                this.errors.chargeAmount = 'Balance is negative';
                return false;
            }
            if (amount < 0 && Math.abs(amount) > parseFloat(this.balance)) {
                this.errors.chargeAmount = 'Balance is less than amount';
                return false;
            }
            return true;
        }
    }
}
</script>
