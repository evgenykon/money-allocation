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
        <v-row>
            <v-col>
                <v-text-field 
                    v-model="proportion"
                    :error-messages="errors.proportion"
                    type="number"
                    :max="100-getProportionsOtherGroups"
                    @click="proportion=''"
                    label="Proportion %"
                    required
                ></v-text-field>
            </v-col>
            <v-col style="position: relative;">
                
                <!-- current -->
                <div style="position: absolute; top: 1.6rem; left: 1.6rem;">
                    <v-progress-circular
                        :rotate="getRotateOffset"
                        size="100"
                        width="15"
                        :value="proportion ? proportion : 0"
                        :color="getProportionColor"
                        >
                        {{ proportion ? proportion : 0 }} %
                    </v-progress-circular>
                </div>

                <!-- all -->
                <div style="position: absolute; top: 0rem; left: 0rem;">
                    <v-progress-circular
                        rotate="0"
                        size="150"
                        width="15"
                        :value="getProportionsOtherGroups"
                        color="secondary"
                        >
                    </v-progress-circular>
                </div>
            </v-col> 
        </v-row>
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
        allProportions: {},
        proportion: 0,
        errors: {
            name: '',
            includedBills: '',
            mainBill: '',
            proportion: ''
        }
    }),
    mounted() {
        this.availableBills = this.$router.currentRoute.params.bills.map(item => ({
            label: item.name + ' (' + item.id + ')',
            id: item.id
          })
        );
        if (this.$router.currentRoute.params.group && this.$router.currentRoute.params.group.id) {
            console.debug('this.$router.currentRoute.params', this.$router.currentRoute.params);
            this.id = this.$router.currentRoute.params.group.id;
            this.name = this.$router.currentRoute.params.group.name;
            this.color = this.$router.currentRoute.params.group.color;
            this.includedBills = this.$router.currentRoute.params.group.included_bills;
            this.mainBill = this.$router.currentRoute.params.group.main_bill_id;
        }
        this.allProportions = this.$router.currentRoute.params.proportions;
        if (this.id && this.allProportions && this.allProportions[this.id]) {
            this.proportion = this.allProportions[this.id];
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
      },
      getProportionsOtherGroups() {
          let n = 0;
          for (let i in this.allProportions) {

              
              if (i !== this.id) {
                  n += parseFloat(this.allProportions[i]);
              }
              console.debug('getProportionsOtherGroups', this.id, i, i !== this.id, n);
          }
          return n;
      },
      getRotateOffset() {
          return this.getProportionsOtherGroups / 100 * 360;
      },
      getProportionColor() {
          return this.getProportionSum <= 100 ? 'primary' : 'red';
      },
      getProportionSum() {
          return parseFloat(this.getProportionsOtherGroups) + parseFloat(this.proportion);
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
                        proportion: this.proportion
                    });
                } else {
                    await this.$store.dispatch('createBillGroup', {
                        name: this.name,
                        color: this.color,
                        includedBills: this.includedBills,
                        mainBill: this.mainBill,
                        proportion: this.proportion
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
            if (this.getProportionSum > 100) {
                this.errors.proportion = 'Total proportion greater than 100';
                return false;
            }
            if (this.proportion < 0) {
                this.errors.proportion = 'Proportion less than 100';
                return false;
            }
            if (isNaN(this.proportion)) {
                this.errors.proportion = 'Proportion is not a number';
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
