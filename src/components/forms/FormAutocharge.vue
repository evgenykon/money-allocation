<template>
    <form>
        <h3 class="mb-5">Autocharge</h3>
        <v-text-field 
            v-model="chargeAmount"
            :disabled="flagLoading"
            :error-messages="errors.chargeAmount"
            label="Charge amount"
            @click="chargeAmount = ''"
            required
        ></v-text-field>

        

        <v-row>
          <v-col  cols="10">
            <v-list class="transparent">
              <v-subheader>Groups</v-subheader>
              <v-list-item  >
                  <v-list-item-title>Name</v-list-item-title>
                  <v-list-item-title>Main bill</v-list-item-title>
                  <v-list-item-title>Current bill amount</v-list-item-title>
                  <v-list-item-title>Proportion</v-list-item-title>
                  <v-list-item-title>Charge</v-list-item-title>
                  <v-list-item-title>Expected bill amount</v-list-item-title>
                  <v-list-item-title>Expected group amount</v-list-item-title>
              </v-list-item>
              <v-list-item dense v-for="item in this.groups" :key="item.id" >
                  <template v-if="proportions[item.id] && getMainBill(item)">
                    <v-list-item-title>
                        <v-chip :color="item.color">{{item.name}}</v-chip>    
                    </v-list-item-title>
                    <v-list-item-title>
                        {{getMainBill(item).name}}
                    </v-list-item-title>
                    <v-list-item-title>{{getMainBill(item).lastRevision.balance_amount}}</v-list-item-title>
                    <v-list-item-title>
                        <v-chip
                            class="ma-2"
                            color="secondary"
                            text-color="white"
                            >
                            + {{chargeAmount ? chargeAmount : 0}} * {{proportions[item.id]}} %
                        </v-chip>
                    </v-list-item-title>
                    <v-list-item-title>
                        <v-chip color="green">+ {{getBillChargeAmount(item).toFixed(2)}}</v-chip>
                    </v-list-item-title>
                    <v-list-item-title>
                        <v-chip color="secondary">{{getExpectedAmount(item).toFixed(2)}}</v-chip>
                    </v-list-item-title>
                    <v-list-item-title>
                        <v-chip color="secondary">{{getExpectedGroupAmount(item).toFixed(2)}}</v-chip>
                    </v-list-item-title>
                  </template>
              </v-list-item>

              <v-divider ></v-divider>

              <v-list-item v-if="100 - parseFloat(getTotalPercent) > 0">
                    <v-list-item-title>
                        <v-chip>Rest charge</v-chip>    
                    </v-list-item-title>
                    <v-list-item-title>
                        <v-select
                            label="Select bill"
                            v-model="restBill"
                            :error-messages="errors.restBill"
                            :items="allBills"
                            item-text="name"
                            item-value="id"
                        ></v-select>
                    </v-list-item-title>
                    <v-list-item-title>
                        <v-chip
                            class="ma-2"
                            color="secondary"
                            text-color="white"
                            >
                            + {{100 - parseFloat(getTotalPercent)}} %
                        </v-chip>
                    </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <v-overlay :value="flagLoading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </form>
    
</template>

<script>
import { FormEventBus } from './FormEventBus.js';
export default {
    data: () => ({
        chargeAmount: 0,
        groups: null,
        proportions: null,
        allBills: [],
        restBill: null,
        flagLoading: false,
        errors: {
            chargeAmount: '',
            restBill: ''
        }
    }),
    mounted() {
        this.groups = this.$router.currentRoute.params.groups;
        this.proportions = this.$router.currentRoute.params.proportions;
        this.allBills = this.$router.currentRoute.params.allBills;
        FormEventBus.$on('run-submit', async () => {
            if (this.validate()) {
                this.submit();
            }
        });
    },
    beforeDestroy() {
        FormEventBus.$off('run-submit');
    },
    computed: {
        getTotalPercent() {
            let percent = 0;
            for (let i in this.proportions) {
                percent += parseFloat(this.proportions[i]);
            }
            return percent.toFixed(2);
        }
    },
    methods: {
        async submit() {
            try {
                this.flagLoading = true;
                for (let i in this.groups) {
                    let item = this.groups[i];
                    const mainBill = this.getMainBill(item);
                    if (!this.proportions[item.id] || !mainBill) {
                        continue;
                    }
                    let groupPercent = parseFloat(this.proportions[item.id]);
                    if (groupPercent <= 0) {
                        continue;
                    }
                    let chargeSum = this.getBillChargeAmount(item);
                    await this.$store.dispatch('createRevision', {
                        billId: mainBill.id,
                        chargeAmount: chargeSum.toFixed(2)
                    });
                }

                const restAmount = 100 - parseFloat(this.getTotalPercent);
                if (restAmount > 0) {
                    await this.$store.dispatch('createRevision', {
                        billId: this.restBill,
                        chargeAmount: restAmount.toFixed(2)
                    });
                }

                this.flagLoading = false;
                FormEventBus.$emit('submit-complete');
            } catch(e) {
                this.flagLoading = false;
                FormEventBus.$emit('submit-error', e);
            }
        },
        validate() {
            this.errors.chargeAmount = '';
            this.errors.restBill = '';
            if (isNaN(this.chargeAmount)) {
                this.errors.chargeAmount = 'Charge amount not a number';
                return false;
            }
            if (this.chargeAmount <= 0) {
                this.errors.chargeAmount = 'Charge amount must be greater than zero';
                return false;
            }
            if ((100 - parseFloat(this.getTotalPercent)) > 0) {
                if (!this.restBill) {
                    this.errors.restBill = 'Rest charge bill not defined';
                    return false;
                }
            }
            return true;
        },
        getMainBill(group) {
            for(let i in group.bills) {
                if (group.bills[i].id === group.main_bill_id) {
                    return group.bills[i];
                }
            }
        },
        getExpectedAmount(group) {
            let bill = this.getMainBill(group);
            let percentAmount = this.chargeAmount ? parseFloat(this.chargeAmount) : 0;
            let perc = parseFloat(this.proportions[group.id]);
            return parseFloat(bill.lastRevision.balance_amount) + (perc * 0.01 * percentAmount);
        },
        getBillChargeAmount(group) {
            let percentAmount = this.chargeAmount ? parseFloat(this.chargeAmount) : 0;
            let perc = parseFloat(this.proportions[group.id]);
            return (perc * 0.01 * percentAmount);
        },
        getExpectedGroupAmount(group) {
            let groupAmount = 0;
            for (let i in group.bills) {
                let bill = group.bills[i];
                groupAmount += bill.lastRevision ? parseFloat(bill.lastRevision.balance_amount) : 0;
            }
            let percentAmount = this.chargeAmount ? parseFloat(this.chargeAmount) : 0;
            let perc = parseFloat(this.proportions[group.id]);
            return groupAmount + (perc * 0.01 * percentAmount);
        }
    }
}
</script>
