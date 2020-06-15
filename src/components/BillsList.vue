<template>
  <v-list subheader>
    
    <v-subheader>Bills</v-subheader>
    <v-list-item v-for="item in list" :key="item.name"  @click="onClickBill(item)">
        <v-list-item-icon >
          <v-icon>mdi-credit-card-outline </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.name" class="blue-grey--text"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-content v-if="item.lastRevision">
          <v-list-item-title v-text="formatDate(item.lastRevision.inserted_at)" class="blue-grey--text"></v-list-item-title>
        </v-list-item-content>
        <v-chip text-color="white" class="fluid">
          {{item.lastRevision ? item.lastRevision.balance_amount : 0}}
        </v-chip>
    </v-list-item>
    <v-list-item class="blue-grey darken-4">
        <v-list-item-content>
          <v-list-item-title>Total</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
        </v-list-item-content>
        <v-chip text-color="white" class="fluid">
          {{getTotal}}
        </v-chip>
    </v-list-item>

    <v-list-item v-if="list.length === 0">
        <v-list-item-title>No bills</v-list-item-title>
    </v-list-item>
  </v-list>
  
</template>

<script>

export default {
    props: {
        list: {
          type: Array,
          default: () => []
        }
    },
    mounted: function() {
    },
    methods: {
      onClickBill(item) {
        this.$router.push({ name: 'Bill', params: { id: item.id } })
      },
      formatDate(dateStr) {
        let dt = new Date(dateStr);
        return dt.toLocaleString();
      }
    },
    computed: {
      getTotal() {
        let sum = 0;
        this.list.forEach((item) => {
          sum += parseFloat(item.lastRevision.balance_amount);
        });
        return sum.toFixed(2);
      }
    }
}
</script>
