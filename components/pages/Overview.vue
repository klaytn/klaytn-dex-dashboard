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
      <ui-title>
        <div>Tokens</div>
        <ui-link :to="{ name: 'tokens' }">All tokens</ui-link>
      </ui-title>
      <pages-overview-tokens-table :data="tokensData" v-loading="tokensDataLoading" />
    </ui-container>
    <ui-container>
      <ui-title>
        <div>Top Pools</div>
        <ui-link :to="{ name: 'pools' }">All pools</ui-link>
      </ui-title>
      <pages-overview-pools-table :data="poolsData" v-loading="poolsDataLoading" />
    </ui-container>
    <ui-container>
      <ui-title>
        <div>Transactions</div>
      </ui-title>
      <pages-overview-transactions-table :data="transactionsData" v-loading="transactionsDataLoading" />
    </ui-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear'

import SubgraphClient from '@/services/subgraph/client';
import { OverviewTokensQuery } from '@/services/subgraph/query/tokens';
import { OverviewPoolsQuery } from '@/services/subgraph/query/pools';
import { OverviewTransactionsQuery } from '@/services/subgraph/query/transactions';
import { OverviewFactoryDailyVolume, OverviewFactoryTotalLiquidity, PairDayDatas } from '@/services/subgraph/query/factory';
import { TransactionTypes, DateTags } from '@/consts';

import { factoryTvlChartSpec, factoryVolumeChartSpec } from '@/utils/chartSpecs';
import { formatAmount } from '@/utils/formatters';

dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);

const aggregate = (data, aggrProperty = 'hourData', volumeA = 'volumeToken0', volumeB = 'volumeToken1') => {
  return data[aggrProperty].reduce((buffer, item) => {
    buffer[volumeA] = buffer[volumeA] + Number(item[volumeA]);
    buffer[volumeB] = buffer[volumeB] + Number(item[volumeB]);
    return buffer;
  }, {
    [volumeA]: 0,
    [volumeB]: 0,
  });
};

const formatTokenData = (data) => {
  const tradeVolume = Number(data.dayData[0]?.dailyVolumeToken ?? 0);
  const totalLiquidity = Number(data.totalLiquidity);
  const price = Number(data.derivedUSD);
  const lastPrice = Number(data.dayData[1]?.priceUSD ?? 0);
  const priceChange = lastPrice !== 0 ? (price - lastPrice) * 100 / lastPrice : 0;

  return {
    ...data,
    price,
    priceChange,
    tradeVolume: tradeVolume * price,
    totalLiquidity: totalLiquidity * price,
  };
};

const formatPoolData = (data) => {
  const token0price = Number(data.token0.derivedUSD);
  const token1price = Number(data.token1.derivedUSD);

  const daily = aggregate(data, 'hourData');
  const weekly= aggregate(data, 'dayData');

  const dayVolume = daily.volumeToken0 * token0price + daily.volumeToken1 * token1price;
  const weekVolume = weekly.volumeToken0 * token0price + weekly.volumeToken1 * token1price;

  const tvl = Number(data.reserveUSD);

  return {
    id: data.id,
    name: data.name,
    tvl,
    dayVolume,
    weekVolume,
  };
};

const formatTransactionData = (data) => {
  let attrs = {
    id: data.id,
    timestamp: +data.timestamp * 1000,
  };

  if (data.swaps.length !== 0) {
    const tx = data.swaps[0];
    const from = tx.from;
    const idxFrom = Number(+tx.amount0In === 0);
    const idxTo = Number(!idxFrom);

    const amount0 = +tx[`amount${idxFrom}In`];
    const amount1 = +tx[`amount${idxTo}Out`];
    const token0 = tx.pair[`token${idxFrom}`];
    const token1 = tx.pair[`token${idxTo}`];

    const value = Math.max(
      amount0 * +token0.derivedUSD,
      amount1 * +token1.derivedUSD,
    );

    return {
      ...attrs,
      from,
      value,
      amount0,
      amount1,
      token0,
      token1,
      type: TransactionTypes.swap,
    }
  }

  const type = data.mints.length !== 0 ? TransactionTypes.add : TransactionTypes.remove;
  const prop = data.mints.length !== 0 ? 'mints' : 'burns';

  const tx = data[prop][0];
  const from = tx.to;
  const amount0 = +tx.amount0;
  const amount1 = +tx.amount1;
  const token0 = tx.pair.token0;
  const token1 = tx.pair.token1;
  const value = amount0 * +tx.pair.token0.derivedUSD + amount1 * +tx.pair.token1.derivedUSD;

  return {
    ...attrs,
    from,
    value,
    amount0,
    amount1,
    token0,
    token1,
    type,
  }
};

const formatfactoryVolumeData = (data) => {
  return {
    timestamp: +data.timestamp * 1000,
    value: +data.dailyVolumeUSD,
  };
};

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
        start: start.valueOf(),
        end: end.valueOf(),
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

      tokensData: [],
      tokensDataLoading: true,
      poolsData: [],
      poolsDataLoading: true,
      transactionsData: [],
      transactionsDataLoading: true,
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
      return factoryTvlChartSpec(this.factoryTotalLiquidityData);
    },

    volumeSpec() {
      const formatter = this.activeVolumeTag === DateTags.monthly
        ? (value) => dayjs(+value).format('MMM')
        : (value) => dayjs(+value).format('DD MMM');

      return factoryVolumeChartSpec(this.volumeGroups, formatter);
    },
    volumeGroups() {
      return groupFactoryDailyData(this.factoryVolumeData, this.activeVolumeTag);
    },
    volumeTimeFormatter() {
      return this.activeVolumeTag === DateTags.daily
        ? (value) => dayjs(value.start).format('MMM DD, YYYY')
        : (value) => `${dayjs(value.start).format('MMM DD')}-${dayjs(value.end).format('MMM DD, YYYY')}`;
    }
  },

  mounted() {
    this.updateTokensData();
    this.updatePoolsData();
    this.updateTransactionsData();
    this.updateFactoryVolumeData();
    this.updateFactoryTotalLiquidityData();
  },
  methods: {
    async updateTokensData() {
      // two days before
      const timestamp = dayjs().startOf('hour').unix() - 2 * 24 * 60 * 60;
      const vars = { timestamp };
      try {
        this.tokensDataLoading = true;
        const { data: { tokens } } = await SubgraphClient.query(OverviewTokensQuery, vars).toPromise();
        this.tokensData = tokens.map(data => formatTokenData(data));
      } catch (error) {
        console.error(error);
        this.tokensData = [];
      } finally {
        this.tokensDataLoading = false;
      }
    },

    async updatePoolsData() {
      // 7 days before
      const dayTimestamp = dayjs().startOf('hour').unix() - 7 * 24 * 60 * 60;
      // 1 days before
      const hourTimestamp = dayjs().startOf('hour').unix() - 24 * 60 * 60;
      const vars = { dayTimestamp, hourTimestamp };

      try {
        this.poolsDataLoading = true;
        const { data: { pairs } } = await SubgraphClient.query(OverviewPoolsQuery, vars).toPromise();
        this.poolsData = pairs.map(data => formatPoolData(data));
      } catch (error) {
        console.error(error);
        this.poolsData = [];
      } finally {
        this.poolsDataLoading = false;
      }
    },

    async updateTransactionsData() {
      try {
        this.transactionsDataLoading = true;
        const { data: { transactions } } = await SubgraphClient.query(OverviewTransactionsQuery).toPromise();
        this.transactionsData = transactions.map(data => formatTransactionData(data));
      } catch (error) {
        console.error(error);
        this.transactionsData = [];
      } finally {
        this.transactionsDataLoading = false;
      }
    },

    async updateFactoryVolumeData() {
      try {
        this.factoryVolumeDataLoading = true;
        const { data: { factoryDayDatas } } = await SubgraphClient.query(OverviewFactoryDailyVolume).toPromise();
        this.factoryVolumeData = factoryDayDatas.map(data => formatfactoryVolumeData(data));
      } catch (error) {
        console.error(error);
        this.factoryVolumeData = [];
      } finally {
        this.factoryVolumeDataLoading = false;
      }
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
.basic-container {
  margin-bottom: 24px;
}

.charts-items {
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  margin: -10px;

  .chart-item {
    flex: 1;
    width: calc(100% - 10px);
    padding: 10px;
  }
}
</style>