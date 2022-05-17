<template>
  <div>
    <PagesOverviewTokensTable :data="tokensData" />
  </div>
</template>

<script>
import SubgraphClient from '@/services/subgraph/client';
import { OverviewTokensQuery } from '@/services/subgraph/query/tokens';

const formatTokenData = (data) => ({
  ...data,
  tradeVolume: Number(data.dayData[0]?.dailyVolumeToken ?? 0),
  totalLiquidity: Number(data.totalLiquidity),
});

export default {
  name: "OverviewPage",
  data() {
    return {
      tokensData: [],
      tokensDataLoading: false,
    }
  },
  mounted() {
    this.updateTokensData();
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
    }
  }
}
</script>

