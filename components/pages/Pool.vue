<template>
  <div>
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
