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
    <div class="table-container">
      <ui-title>Transactions</ui-title>
      <pages-overview-transactions-table :data="transactionsData" />
    </div>
  </div>
</template>

<script>
import SubgraphClient from '@/services/subgraph/client';
import { OverviewTokensQuery } from '@/services/subgraph/query/tokens';
import { OverviewPoolsQuery } from '@/services/subgraph/query/pools';
import { OverviewTransactionsQuery } from '@/services/subgraph/query/transactions';
import { TransactionTypes } from '@/consts';

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
      amount0 * +tx.pair[`token${idxFrom}Price`],
      amount1 * +tx.pair[`token${idxTo}Price`],
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
  const value = amount0 * +tx.pair.token0Price + amount1 * +tx.pair.token1Price;

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

export default {
  name: "OverviewPage",
  data() {
    return {
      tokensData: [],
      tokensDataLoading: false,
      poolsData: [],
      poolsDataLoading: false,
      transactionsData: [],
      transactionsDataLoading: false,
    }
  },
  mounted() {
    this.updateTokensData();
    this.updatePoolsData();
    this.updateTransactionsData();
  },
  methods: {
    async updateTokensData() {
      try {
        this.tokensDataLoading = false;
        const { data: { tokens } } = await SubgraphClient.query(OverviewTokensQuery).toPromise();
        this.tokensData = tokens.map(data => formatTokenData(data));
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
        this.transactionsDataLoading = false;
        const { data: { transactions } } = await SubgraphClient.query(OverviewTransactionsQuery).toPromise();
        this.transactionsData = transactions.map(data => formatTransactionData(data));
      } catch (error) {
        console.error(error);
        this.poolsData = [];
      } finally {
        this.transactionsDataLoading = false;
      }
    }
  }
}
</script>

