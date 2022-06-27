<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs" />

    <ui-container>
      <shared-stats-card>
        <template #title>
          <div>{{ name }}</div>
          <a :href="pairLink" target="_blank" rel="noopener noreferrer">
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
              <div slot="title">{{ token0Symbol }} Locked</div>
              <template slot="content">
                <span>{{ token0Reserve }}</span>
              </template>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">{{ token1Symbol }} Locked</div>
              <template slot="content">
                <span>{{ token1Reserve }}</span>
              </template>
            </shared-stats-block>
          </div>
          <div>
            <shared-stats-block>
              <div slot="title">Liquidity</div>
              <template slot="content">
                <span>${{ liquidity }}</span>
                <shared-value-difference :value="liquidityChange" />
              </template>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Volume 24H</div>
              <template slot="content">
                <span>${{ tradeVolumeDay }}</span>
                <shared-value-difference :value="tradeVolumeChange" />
              </template>
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
        <div>Transactions</div>
      </ui-title>
      <shared-transactions-table :loading="transactionsLoading" :data="transactions" />
    </ui-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { TransactionsExplorer, PairsExplorer } from '@/services/subgraph/explorer';

import { PairChartTags } from '@/consts';

import { formatAmount } from '@/utils/formatters';
import { lineChartSpec, barChartSpec } from '@/utils/chartSpecs';

import { NetworkExplorer, ExchangeExplorer } from '@/utils/explorer';

export default {
  name: "PoolPage",
  data() {
    return {
      // chart tags
      tag: PairChartTags.volume,
      tags: Object.values(PairChartTags),
      // data
      pair: {},
      transactions: [],
      transactionsLoading: false,
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
      return this.pair.name ?? '';
    },
    token0Id() {
      return this.pair.token0?.id ?? '';
    },
    token0Symbol() {
      return this.pair.token0?.symbol ?? '';
    },
    token0Reserve() {
      return formatAmount(this.pair.reserve0 ?? 0);
    },
    token1Id() {
      return this.pair.token1?.id ?? '';
    },
    token1Symbol() {
      return this.pair.token1?.symbol ?? '';
    },
    token1Reserve() {
      return formatAmount(this.pair.reserve1 ?? 0);
    },
    liquidity() {
      return formatAmount(this.pair.totalLiquidity ?? 0);
    },
    liquidityChange() {
      return this.pair.totalLiquidityChange ?? 0;
    },
    tradeVolumeDay() {
      return formatAmount(this.pair.tradeVolumeDay ?? 0);
    },
    tradeVolumeWeek() {
      return formatAmount(this.pair.tradeVolumeWeek ?? 0);
    },
    tradeVolumeChange() {
      return this.pair.tradeVolumeChange ?? 0;
    },
    transactionsDay() {
      return this.pair.transactionsDay ?? 0;
    },
    transactionsWeek() {
      return this.pair.transactionsWeek ?? 0;
    },

    pairLink() {
      return NetworkExplorer.contractLink(this.id);
    },
    addLiquidityLink() {
      return ExchangeExplorer.addLiquidityLink(this.token0Id, this.token1Id);
    },
    swapLink() {
      return ExchangeExplorer.swapLink(this.token0Id, this.token1Id);
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
          name: this.name,
          to: { name: 'pools-id', params: { id: this.id } },
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
      if (!this.pair.dayData) return [];

      const prop = this.activeTag === PairChartTags.tvl
        ? 'totalLiquidity'
        : 'tradeVolume';

      return this.pair.dayData.map(item => ({
        timestamp: item.timestamp,
        value: item[prop]
      })).sort((a, b) => a.timestamp - b.timestamp);
    },
    chartSpec() {
      const formatter = (value) => dayjs(+value).format('DD MMM');

      if (this.activeTag === PairChartTags.volume) return barChartSpec(this.chartData, formatter);

      return lineChartSpec(this.chartData);
    },
  },
  mounted() {
    this.updatePair();
    this.updateTransactions();
  },
  methods: {
    async updatePair() {
      this.pair = await PairsExplorer.getPair({ id: this.id });
    },

    async updateTransactions() {
      this.transactionsLoading = true;
      this.transactions = await TransactionsExplorer.getTransactionsByPairsIds([this.id]);
      this.transactionsLoading = false;
    }
  }
}
</script>
