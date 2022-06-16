<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs" />

    <ui-container>
      <shared-stats-card>
        <template #title>
          <div>{{ name }} ({{ symbol }})</div>
        </template>
        <template #buttons>
          <ui-button icon="plus">Add Liquidity</ui-button>
          <ui-button icon="refresh">Trade</ui-button>
        </template>
        <template #aside>
          <div>
            <shared-stats-block>
              <div slot="title">{{ name }} Price</div>
              <div slot="content">${{ price }}</div>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Liquidity</div>
              <div slot="content">${{ liquidity }}</div>
            </shared-stats-block>
          </div>
          <div>
            <shared-stats-block>
              <div slot="title">Volume 24H</div>
              <div slot="content">${{ tradeVolumeDay }}</div>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Volume 7D</div>
              <div slot="content">${{ tradeVolumeWeek }}</div>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Transactions 24H</div>
              <div slot="content">{{ transactionsDay }}</div>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Transactions 7D</div>
              <div slot="content">{{ transactionsWeek }}</div>
            </shared-stats-block>
          </div>
        </template>
        <template #default>3</template>
      </shared-stats-card>
    </ui-container>

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

import { formatAmount, formatAddress } from '@/utils/formatters';

export default {
  name: "TokenPage",
  data() {
    return {
      token: {},
      ids: [],
      pairs: [],
      pairsLoading: false,
      transactions: [],
      transactionsLoading: false,
      // formatters
      formatAmount,
      formatAddress,
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    name() {
      return this.token.name ?? '';
    },
    symbol() {
      return this.token.symbol ?? '';
    },
    price() {
      return formatAmount(this.token.price ?? 0);
    },
    liquidity() {
      return formatAmount(this.token.totalLiquidity ?? 0);
    },
    tradeVolumeDay() {
      return formatAmount(this.token.tradeVolumeDay ?? 0);
    },
    tradeVolumeWeek() {
      return formatAmount(this.token.tradeVolumeWeek ?? 0);
    },
    transactionsDay() {
      return this.token.transactionsDay ?? 0;
    },
    transactionsWeek() {
      return this.token.transactionsWeek ?? 0;
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
          name: `${this.symbol}(${this.formatAddress(this.id, 8)})`,
          to: { name: 'tokens-id', params: { id: this.id } },
          disabled: true,
        },
      ];
    },
  },
  async mounted() {
    await Promise.all([
      this.updateToken(),
      this.updatePairsIds(),
    ]);

    await Promise.all([
      this.updatePairs(),
      this.updateTransactions(),
    ]);
  },
  methods: {
    async updateToken() {
      this.token = await TokensExplorer.getToken({ id: this.id })
    },

    async updatePairsIds() {
      this.ids = await TokensExplorer.getTokenPairsIds({ id: this.id });
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
