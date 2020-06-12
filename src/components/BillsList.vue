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
        <v-chip text-color="white" class="fluid">
          6 000.20 руб
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
    computed: {
      
    },
    mounted: function() {
    },
    methods: {
      onClickBill(item) {
        this.$router.push({ name: 'Bill', params: { id: item.id } })
      }
    }
}
</script>
