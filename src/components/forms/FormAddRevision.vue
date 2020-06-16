<template>
    <form>
        <h3 class="mb-5">Add new revision</h3>
        <v-text-field 
            v-model="billId"
            label="Bill ID"
            readonly
        ></v-text-field>
        <v-text-field 
            v-model="balanceAmount"
            :error-messages="errors.balanceAmount"
            label="Bill balance amount"
            type="number"
            required
        ></v-text-field>
    </form>
</template>

<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        billId: null,
        balance: null,
        balanceAmount: 0,
        errors: {
            balanceAmount: ''
        }
    }),
    mounted() {
        this.billId = this.$router.currentRoute.params.billId;
        this.balanceAmount = this.$router.currentRoute.params.balance;
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
                const diff = parseFloat(this.balanceAmount) - parseFloat(this.balance);
                await this.$store.dispatch('createRevision', {
                    billId: this.billId,
                    chargeAmount: diff.toFixed(2)
                });
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            const amount = parseFloat(this.balanceAmount);
            this.errors.balanceAmount = '';
            if (isNaN(amount)) {
                this.errors.balanceAmount = 'Invalid value';
                return false;
            }
            if (amount < 0) {
                this.errors.balanceAmount = 'Balance could not be negative';
                return false;
            }
            if (parseInt(this.balanceAmount * 100) === parseInt(this.errors.balance)) {
                this.errors.balanceAmount = 'Balance is the same';
                return false;
            }
            return true;
        }
    }
}
</script>
