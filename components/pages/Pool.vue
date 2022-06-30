<template>
  <div>
    <ui-breadcrumbs :items="breadcrumbs">
      <template #default="{ name: itemName }">
        <template v-if="itemName === name">
          {{ itemName }}
          <a :href="pairLink" target="_blank" rel="noopener noreferrer">
            ({{ formattedAddress }})
          </a>
        </template>

        <template v-else>{{ itemName }}</template>
      </template>
    </ui-breadcrumbs>

    <ui-container>
      <shared-stats-card>
        <template #title>
          <logo-pair>
            <logo-token :address="token0Id" :symbol="token0Symbol" :size="30" />
            <logo-token :address="token1Id" :symbol="token1Symbol" :size="30" />
          </logo-pair>
          <div>{{ name }}</div>
          <a :href="pairLink" target="_blank" rel="noopener noreferrer">
            <icon name="link" />
          </a>
        </template>
        <template #buttons>
          <nuxt-link class="token-price" :to="{ name: 'tokens-id', params: { id: token0Id } }">
            <logo-token :address="token0Id" :symbol="token0Symbol" class="token-logo" />
            <span>1 {{ token0Symbol }} = {{ token1Price }} {{ token1Symbol }}</span>
          </nuxt-link>
          <nuxt-link class="token-price" :to="{ name: 'tokens-id', params: { id: token1Id } }">
            <logo-token :address="token1Id" :symbol="token1Symbol" class="token-logo" />
            <span>1 {{ token1Symbol }} = {{ token0Price }} {{ token0Symbol }}</span>
          </nuxt-link>
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
                <logo-pair>
                  <logo-token :address="token0Id" :symbol="token0Symbol" class="token-logo" />
                  <span>{{ token0Reserve }}</span>
                </logo-pair>
              </template>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">{{ token1Symbol }} Locked</div>
              <template slot="content">
                <logo-pair>
                  <logo-token :address="token1Id" :symbol="token1Symbol" class="token-logo" />
                  <span>{{ token1Reserve }}</span>
                </logo-pair>
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
          </div>
          <div>
            <shared-stats-block>
              <div slot="title">Volume 24H</div>
              <template slot="content">
                <span>${{ tradeVolumeDay }}</span>
                <shared-value-difference :value="tradeVolumeDayChange" />
              </template>
            </shared-stats-block>
            <shared-stats-block>
              <div slot="title">Volume 7D</div>
              <template slot="content">
                <span>${{ tradeVolumeWeek }}</span>
                <shared-value-difference :value="tradeVolumeWeekChange" />
              </template>
            </shared-stats-block>
          </div>
          <div>
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
      <shared-transactions-table :loading="transactionsLoading" :data="transactions">
        <ui-title slot="head">
          <div>Transactions</div>
        </ui-title>
      </shared-transactions-table>
    </ui-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { TransactionsExplorer, PairsExplorer } from '@/services/subgraph/explorer';

import { PairChartTags } from '@/consts';

import { formatAmount, formatAddress } from '@/utils/formatters';
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
    token0Price() {
      return (this.pair.token0Price ?? 0).toFixed(4);
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
    token1Price() {
      return (this.pair.token1Price ?? 0).toFixed(4);
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
    tradeVolumeDayChange() {
      return this.pair.tradeVolumeDayChange ?? 0;
    },
    tradeVolumeWeek() {
      return formatAmount(this.pair.tradeVolumeWeek ?? 0);
    },
    tradeVolumeWeekChange() {
      return this.pair.tradeVolumeWeekChange ?? 0;
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

    formattedAddress() {
      return formatAddress(this.id, 8);
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

<style lang="scss" scoped>
.token-price {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid $gray5;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  color: $dark2;
}

.token-logo {
  margin-right: 4px;
}
</style>
