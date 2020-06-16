<template>
    <form>
        <h3 class="mb-5">Add new bill group</h3>
        <v-text-field 
            v-model="name"
            :error-messages="errors.name"
            counter="100"
            label="Name"
            required
        ></v-text-field>
        <v-row>
            <v-col>
                <v-text-field 
                v-model="color"
                label="Color"
                readonly
                required
                ></v-text-field>
            </v-col>
            <v-col>
                <v-color-picker 
                v-model="color" 
                hide-mode-switch mode="hexa" 
                :swatches="swatches"
                hide-inputs 
                hide-canvas
                show-swatches></v-color-picker>
            </v-col>
        </v-row>
        <v-select
            v-if="availableBills && availableBills.length > 0"
            label="Included bills"
            v-model="includedBills"
            :items="availableBills"
            :error-messages="errors.includedBills"
            item-text="label"
            item-value="id"
            chips
            multiple
        ></v-select>
        <v-select
            v-if="availableBills && availableBills.length > 0"
            label="Main bill"
            :disabled="getAddBillGroupIncludedBills.length === 0"
            v-model="mainBill"
            :error-messages="errors.mainBill"
            :items="getAddBillGroupIncludedBills"
            item-text="label"
            item-value="id"
        ></v-select>
    </form>
</template>

<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        id: null,
        name: '',
        color: '#000000',
        swatches: [
            ['#7E0000', '#686800', '#005500', '#003F3F', '#000053'],
            ['#550000', '#464600', '#003A00', '#004141', '#2B2B55'],
            ['#3F2A2A', '#555500', '#2B442B', '#424949', '#000000'],
        ],
        includedBills: [],
        availableBills: [],
        mainBill: null,
        errors: {
            name: '',
            includedBills: '',
            mainBill: ''
        }
    }),
    mounted() {
        this.availableBills = this.$router.currentRoute.params.bills.map(item => ({
            label: item.name + ' (' + item.id + ')',
            id: item.id
          })
        );
        if (this.$router.currentRoute.params.group && this.$router.currentRoute.params.group.id) {
            console.debug('this.$router.currentRoute.params', this.$router.currentRoute.params.group);
            this.id = this.$router.currentRoute.params.group.id;
            this.name = this.$router.currentRoute.params.group.name;
            this.color = this.$router.currentRoute.params.group.color;
            this.includedBills = this.$router.currentRoute.params.group.included_bills;
            this.mainBill = this.$router.currentRoute.params.group.main_bill_id;
        }
        FormEventBus.$on('run-submit', async () => {
            if (this.validate()) {
                this.submit();
            }
        });
    },
    computed: {
      getAddBillGroupIncludedBills() {
        return this.includedBills ? this.includedBills : [];
      }
    },
    beforeDestroy() {
        FormEventBus.$off('run-submit');
    },
    methods: {
        async submit() {
            try {
                if (this.id) {
                    await this.$store.dispatch('updateBillGroup', {
                        id: this.id,
                        name: this.name,
                        color: this.color,
                        includedBills: this.includedBills,
                        mainBill: this.mainBill,
                    });
                } else {
                    await this.$store.dispatch('createBillGroup', {
                        name: this.name,
                        color: this.color,
                        includedBills: this.includedBills,
                        mainBill: this.mainBill,
                    });
                }
                
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            this.errors.name = '';
            this.errors.includedBills = '';
            this.errors.mainBill = '';
            if (!this.name) {
                this.errors.name = 'Enter name of group';
                return false;
            }
            if (this.includedBills.length === 0) {
                this.errors.includedBills = 'No one bill selected';
                return false;
            }
            if (this.includedBills.length > 0 && !this.mainBill) {
                this.errors.mainBill = 'Main bill not selected';
                return false;
            }
            return true;
        }
    },
    watch: {
      "addBillGroup.includedBills": function(val) {
        if (!Array.isArray(val)) {
          if (val !== this.mainBill) {
            this.mainBill = null;
            return;
          }
        }
        if (val.length === 0) {
          this.mainBill = null;
          return;
        }
        if (this.mainBill && !this.includedBills.includes(this.mainBill)) {
          this.mainBill = null;
          return;
        }
      }
    }
}
</script>
