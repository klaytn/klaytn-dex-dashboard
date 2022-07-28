<template>
  <div>
    <ui-container>
      <ui-title>
        <div>Dex overview</div>
      </ui-title>
      <div class="charts-items">
        <div class="chart-item">
          <ui-chart
            :data="factoryTotalLiquidityData"
            :spec="tvlSpec"
            :value-formatter="valueFormatter"
            :time-formatter="timeFormatter"
            title="TVL"
            v-loading="factoryTotalLiquidityDataLoading"
          />
        </div>
        <div class="chart-item">
          <ui-chart
            :data="volumeGroups"
            :spec="volumeSpec"
            :value-formatter="valueFormatter"
            :time-formatter="volumeTimeFormatter"
            title="Volume"
            v-loading="factoryVolumeDataLoading"
          >
            <template #controls>
              <ui-tags v-model="activeVolumeTag" :tags="volumeTags" />
            </template>
          </ui-chart>
        </div>
      </div>
    </ui-container>
    <ui-container>
      <shared-tokens-table :loading="tokensLoading" :data="tokens">
        <ui-title slot="head">
          <div>Tokens</div>
          <ui-link :to="{ name: 'tokens' }">All tokens</ui-link>
        </ui-title>
      </shared-tokens-table>
    </ui-container>
    <ui-container>
      <shared-pools-table :loading="pairsLoading" :data="pairs">
        <ui-title slot="head">
          <div>Top Pools</div>
          <ui-link :to="{ name: 'pools' }">All pools</ui-link>
        </ui-title>
      </shared-pools-table>
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

import SubgraphClient from '@/services/subgraph/client';
import { TokensExplorer, PairsExplorer, TransactionsExplorer, FactoryExplorer } from '@/services/subgraph/explorer';

import { PairDayDatas } from '@/services/subgraph/query/factory';
import { DateTags } from '@/consts';

import { lineChartSpec, barChartSpec } from '@/utils/chartSpecs';
import { formatAmount } from '@/utils/formatters';

const formatFactoryTotalLiquidityData = (data) => {
  return {
    timestamp: +data.timestamp * 1000,
    value: +data.totalLiquidityUSD,
  };
};

const groupFactoryDailyData = (data, dateTag) => {
  const isDaily = dateTag === DateTags.daily;
  const isMontly = dateTag === DateTags.monthly;

  const groupsByYear = data.reduce((buffer, item) => {
    const date = dayjs(item.timestamp);
    const year = date.year();
    const prop = isDaily ? date.dayOfYear() : (isMontly ? date.month() : date.week());

    if (!buffer[year]) buffer[year] = {};
    if (!buffer[year][prop]) buffer[year][prop] = 0;

    buffer[year][prop] += item.value;

    return buffer;
  }, {});

  return Object.entries(groupsByYear).reduce((buffer, [year, groups]) => {
    Object.entries(groups).forEach(([prop, value]) => {
      const date = dayjs().year(year);
      const start = isDaily ? date.dayOfYear(prop) : (isMontly ? date.month(prop).date(1) : date.week(prop).day(1));
      const end = isDaily ? start : (isMontly ? start.endOf('month') : start.endOf('week'));

      buffer.push({
        timestamp: start.valueOf(),
        timestamp2: end.valueOf(),
        value,
      });
    });

    return buffer;
  }, []);
};

const groupPairDayDatas = (data) => {
  const timestamps = {};
  const pairs = {};

  data.forEach(item => {
    timestamps[item.timestamp] = {};
    pairs[item.pair.id] = true;
  });

  const timestampsOrderedByDesc = Object.keys(timestamps).sort().reverse();

  Object.keys(pairs).forEach(pair => {
    const snaps = data.filter(item => item.pair.id === pair);

    snaps.forEach(snap => {
      timestampsOrderedByDesc.forEach((timestamp) => {
        if (!timestamps[timestamp][pair] || +timestamp <= +snap.timestamp) {
          timestamps[timestamp][pair] = +snap.reserveUSD;
        }
      });
    });
  });

  return Object.entries(timestamps).map(([key, value]) => ({
    timestamp: key * 1000,
    value: Object.values(value).reduce((acc, v) => acc + v, 0),
  }));
};

export default {
  name: "OverviewPage",
  data() {
    return {
      volumeTag: DateTags.daily,
      volumeTags: Object.values(DateTags),

      tokens: [],
      tokensLoading: false,

      pairs: [],
      pairsLoading: false,

      transactions: [],
      transactionsLoading: false,

      factoryVolumeData: [],
      factoryVolumeDataLoading: true,

      factoryTotalLiquidityData: [],
      factoryTotalLiquidityDataLoading: true,
    }
  },

  computed: {
    activeVolumeTag: {
      get() {
        return this.volumeTag;
      },
      set(value) {
        this.volumeTag = value;
      },
    },

    valueFormatter() {
      return (v) => `$${formatAmount(v.value)}`;
    },
    timeFormatter() {
      return (v) => dayjs(v.timestamp).format('MMM DD, YYYY');
    },

    tvlSpec() {
      return lineChartSpec(this.factoryTotalLiquidityData);
    },

    volumeGroups() {
      return groupFactoryDailyData(this.factoryVolumeData, this.activeVolumeTag);
    },
    volumeSpec() {
      const formatter = this.activeVolumeTag === DateTags.monthly
        ? (value) => dayjs(+value).format('MMM')
        : (value) => dayjs(+value).format('DD MMM');

      return barChartSpec(this.volumeGroups, formatter);
    },
    volumeTimeFormatter() {
      return this.activeVolumeTag === DateTags.daily
        ? (value) => dayjs(value.timestamp).format('MMM DD, YYYY')
        : (value) => `${dayjs(value.timestamp).format('MMM DD')}-${dayjs(value.timestamp2).format('MMM DD, YYYY')}`;
    }
  },

  mounted() {
    this.updateFactoryVolumeData();
    this.updateFactoryTotalLiquidityData();

    this.updateTokens();
    this.updatePairs();
    this.updateTransactions();
  },
  methods: {
    async updateTokens() {
      this.tokensLoading = true;
      this.tokens = await TokensExplorer.getTokens();
      this.tokensLoading = false;
    },

    async updatePairs() {
      // 7 days before
      const timestamp = dayjs().startOf('day').unix() - 7 * 24 * 60 * 60;
      // common vars
      const vars = { timestamp };

      this.pairsLoading = true;
      this.pairs = await PairsExplorer.getPairs(vars);
      this.pairsLoading = false;
    },

    async updateTransactions() {
      this.transactionsLoading = true;
      this.transactions = await TransactionsExplorer.getTransactions();
      this.transactionsLoading = false;
    },

    async updateFactoryVolumeData() {
      this.factoryVolumeDataLoading = true;
      this.factoryVolumeData = await FactoryExplorer.getVolumeDayData();
      this.factoryVolumeDataLoading = false;
    },

    async updateFactoryTotalLiquidityData() {
      try {
        this.factoryTotalLiquidityDataLoading = true;
        const { data: { pairDayDatas } } = await SubgraphClient.query(PairDayDatas).toPromise();
        this.factoryTotalLiquidityData = groupPairDayDatas(pairDayDatas);
      } catch (error) {
        console.error(error);
        this.factoryTotalLiquidityData = [];
      } finally {
        this.factoryTotalLiquidityDataLoading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.charts-items {
  display: flex;
  flex: 1;
  flex-flow: row wrap;
  margin: -10px;

  .chart-item {
    flex: 1;
    width: calc(100% - 10px);
    min-width: 320px;
    padding: 10px;
  }
}
</style>