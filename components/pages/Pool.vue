<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs" />

    <ui-container>
      <ui-title>
        <div>Transactions</div>
      </ui-title>
      <shared-transactions-table :loading="transactionsLoading" :data="transactions" />
    </ui-container>
  </div>
</template>

<script>
import { TransactionsExplorer } from '@/services/subgraph/explorer';

export default {
  name: "PoolPage",
  data() {
    return {
      transactions: [],
      transactionsLoading: false,
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    breadcrumbs() {
      return [
        {
          name: 'Overview',
          to: { name: 'index' }
        },
        {
          name: 'Pools',
          to: { name: 'pools' }
        },
        {
          name: 'Pool',
          to: { name: 'pools-id', params: { id: this.id } },
          disabled: true,
        },
      ];
    },
  },
  mounted() {
    this.updateTransactions();
  },
  methods: {
    async updateTransactions() {
      this.transactionsLoading = true;
      this.transactions = await TransactionsExplorer.getTransactionsByPairsIds([this.id]);
      this.transactionsLoading = false;
    }
  }
}
</script>
