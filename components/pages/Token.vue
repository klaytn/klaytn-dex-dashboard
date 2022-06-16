<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs" />

    <ui-container>
      <ui-title>
        <div>Top Pools</div>
      </ui-title>
      <shared-pools-table :loading="pairsLoading" :data="pairs" />
    </ui-container>

    <ui-container>
      <ui-title>
        <div>Transactions</div>
      </ui-title>
      <shared-transactions-table :loading="transactionsLoading" :data="transactions" />
    </ui-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { PairsExplorer, TokensExplorer, TransactionsExplorer } from '@/services/subgraph/explorer';

export default {
  name: "TokenPage",
  data() {
    return {
      ids: [],
      pairs: [],
      pairsLoading: false,
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
          name: 'Tokens',
          to: { name: 'tokens' }
        },
        {
          name: 'Token',
          to: { name: 'tokens-id', params: { id: this.id } },
          disabled: true,
        },
      ];
    },
  },
  async mounted() {
    await this.updatePairsIds();

    await Promise.all([
      this.updatePairs(),
      this.updateTransactions(),
    ]);
  },
  methods: {
    async updatePairsIds() {
      this.ids = await TokensExplorer.getTokenPairsIds(this.id);
    },

    async updatePairs() {
      const first = 1000;
      // 7 days before
      const dayTimestamp = dayjs().startOf('hour').unix() - 7 * 24 * 60 * 60;
      // 1 days before
      const hourTimestamp = dayjs().startOf('hour').unix() - 24 * 60 * 60;
      // where clause
      const where = { id_in: this.ids };
      // common vars
      const vars = { first, dayTimestamp, hourTimestamp, where };

      this.pairsLoading = true;
      this.pairs = await PairsExplorer.getPairs(vars);
      this.pairsLoading = false;
    },

    async updateTransactions() {
      this.transactionsLoading = true;
      this.transactions = await TransactionsExplorer.getTransactionsByPairsIds(this.ids);
      this.transactionsLoading = false;
    }
  },
};
</script>
