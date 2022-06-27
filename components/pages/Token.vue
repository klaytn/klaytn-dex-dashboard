<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs" />

    <ui-container>
      <shared-stats-card v-loading="tokenLoading">
        <template #title>
          <logo-token :address="id" :symbol="symbol" />
          <div>{{ name }} ({{ symbol }})</div>
          <a :href="tokenLink" target="_blank" rel="noopener noreferrer">
            <icon name="link" />
          </a>
        </template>
        <template #buttons>
          <a :href="addLiquidityLink" target="_blank" rel="noopener noreferrer">
            <ui-button icon="plus">Add Liquidity</ui-button>
          </a>
          <a :href="swapLink" target="_blank" rel="noopener noreferrer">
            <ui-button icon="refresh">Trade</ui-button>
          </a>
        </template>
        <template #aside>
          <div>
            <shared-stats-block>
              <div slot="title">{{ name }} Price</div>
              <template slot="content">
                <span>${{ price }}</span>
                <shared-value-difference :value="priceChange" />
              </template>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Liquidity</div>
              <template slot="content">
                <span>${{ liquidity }}</span>
                <shared-value-difference :value="liquidityChange" />
              </template>
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
        <template #default>
          <ui-chart
            :data="chartData"
            :spec="chartSpec"
            :value-formatter="valueFormatter"
            :time-formatter="timeFormatter"
            transparent
          >
            <template #controls>
              <ui-tags v-model="activeTag" :tags="tags" />
            </template>
          </ui-chart>
        </template>
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

import { TokenChartTags } from '@/consts';
import { lineChartSpec, barChartSpec } from '@/utils/chartSpecs';

import { NetworkExplorer, ExchangeExplorer } from '@/utils/explorer';

export default {
  name: "TokenPage",
  data() {
    return {
      // chart tags
      tag: TokenChartTags.price,
      tags: Object.values(TokenChartTags),
      // data
      token: {},
      tokenLoading: false,
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
    activeTag: {
      get() {
        return this.tag;
      },
      set(value) {
        this.tag = value;
      },
    },

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
    priceChange() {
      return this.token.priceChange ?? 0;
    },
    liquidity() {
      return formatAmount(this.token.totalLiquidity ?? 0);
    },
    liquidityChange() {
      return this.token.totalLiquidityChange ?? 0;
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

    tokenLink() {
      return NetworkExplorer.contractLink(this.id);
    },
    addLiquidityLink() {
      return ExchangeExplorer.addLiquidityLink(this.id);
    },
    swapLink() {
      return ExchangeExplorer.swapLink(this.id);
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

    valueFormatter() {
      return (v) => `$${formatAmount(v.value)}`;
    },
    timeFormatter() {
      return (v) => dayjs(v.timestamp).format('MMM DD, YYYY');
    },

    chartData() {
      if (!this.token.dayData) return [];

      const prop = this.activeTag === TokenChartTags.tvl
        ? 'totalLiquidity'
        : (this.activeTag === TokenChartTags.volume ? 'tradeVolume' : 'price');

      return this.token.dayData.map(item => ({
        timestamp: item.timestamp,
        value: item[prop]
      })).sort((a, b) => a.timestamp - b.timestamp);
    },

    chartSpec() {
      const formatter = (value) => dayjs(+value).format('DD MMM');

      if (this.activeTag === TokenChartTags.volume) return barChartSpec(this.chartData, formatter);

      return lineChartSpec(this.chartData);
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
      this.tokenLoading = true;
      this.token = await TokensExplorer.getToken({ id: this.id })
      this.tokenLoading = false;
    },

    async updatePairsIds() {
      this.ids = await TokensExplorer.getTokenPairsIds({ id: this.id });
    },

    async updatePairs() {
      const first = 1000;
      // 7 days before
      const timestamp = dayjs().startOf('hour').unix() - 7 * 24 * 60 * 60;
      // where clause
      const where = { id_in: this.ids };
      // common vars
      const vars = { first, timestamp, where };

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
