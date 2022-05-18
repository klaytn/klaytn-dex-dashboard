<template>
  <div>
    <div class="table-container">
      <ui-title>Top Tokens</ui-title>
      <pages-overview-tokens-table :data="tokensData" />
    </div>
    <div class="table-container">
      <ui-title>Top Pools</ui-title>
      <pages-overview-pools-table :data="poolsData" />
    </div>
  </div>
</template>

<script>
import SubgraphClient from '@/services/subgraph/client';
import { OverviewTokensQuery } from '@/services/subgraph/query/tokens';
import { OverviewPoolsQuery } from '@/services/subgraph/query/pools';

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
  return {
    ...data,
    tradeVolume: Number(data.dayData[0]?.dailyVolumeToken ?? 0),
    totalLiquidity: Number(data.totalLiquidity),
  };
};

const formatPoolData = (data) => {
  const token0price = Number(data.token0Price);
  const token1price = Number(data.token1Price);

  const daily = aggregate(data, 'hourData');
  const weekly= aggregate(data, 'dayData');

  const dayVolume = daily.volumeToken0 * token0price + daily.volumeToken1 * token1price;
  const weekVolume = weekly.volumeToken0 * token0price + weekly.volumeToken1 * token1price;

  const tvl = Number(data.reserve0) * token0price + Number(data.reserve1) * token1price;

  return {
    id: data.id,
    name: data.name,
    tvl,
    dayVolume,
    weekVolume,
  };
};

export default {
  name: "OverviewPage",
  data() {
    return {
      tokensData: [],
      tokensDataLoading: false,
      poolsData: [],
      poolsDataLoading: false,
    }
  },
  mounted() {
    this.updateTokensData();
    this.updatePoolsData();
  },
  methods: {
    async updateTokensData() {
      try {
        this.tokensDataLoading = false;
        const { data: { tokens } } = await SubgraphClient.query(OverviewTokensQuery).toPromise();
        this.tokensData = tokens.map(tokenData => formatTokenData(tokenData));
      } catch (error) {
        console.error(error);
        this.tokensData = [];
      } finally {
        this.tokensDataLoading = false;
      }
    },

    async updatePoolsData() {
      try {
        this.poolsDataLoading = false;
        const { data: { pairs } } = await SubgraphClient.query(OverviewPoolsQuery).toPromise();
        this.poolsData = pairs.map(tokenData => formatPoolData(tokenData));
      } catch (error) {
        console.error(error);
        this.poolsData = [];
      } finally {
        this.poolsDataLoading = false;
      }
    }
  }
}
</script>

