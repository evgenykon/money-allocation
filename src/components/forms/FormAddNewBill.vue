<template>
    <form>
        <h3 class="mb-5">Add new bill</h3>
        <v-text-field 
            v-model="name"
            :error-messages="errors.name"
            counter="100"
            label="Name"
            required
        ></v-text-field>
        <v-text-field 
            v-model="initAmount"
            :error-messages="errors.initAmount"
            label="Initial amount"
            type="number"
            required
        ></v-text-field>
    </form>
</template>

<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        name: '',
        initAmount: 0,
        errors: {
            name: '',
            initAmount: ''
        }
    }),
    mounted() {
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
                await this.$store.dispatch('createBill', {
                    name: this.name,
                    initAmount: this.initAmount
                });
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            this.errors.name = '';
            this.errors.initAmount = '';
            if (!this.name.trim()) {
                this.errors.name = 'Name undefined';
                return false;
            }
            if (isNaN(parseFloat(this.initAmount))) {
                this.errors.initAmount = 'Amount not a number';
                return false;
            }
            return true;
        }
    }
}
</script>
