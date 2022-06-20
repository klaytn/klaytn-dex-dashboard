<template>
  <ui-container>
    <ui-title>
      <div>Top Pools</div>
    </ui-title>
    <shared-pools-table :data="pairs" :loading="pairsLoading" />
  </ui-container>
</template>

<script>
import dayjs from 'dayjs';

import { PairsExplorer } from '@/services/subgraph/explorer';

export default {
  name: "PoolsPage",
  data() {
    return {
      pairs: [],
      pairsLoading: false,
    }
  },
  mounted() {
    this.updatePairs();
  },
  methods: {
    async updatePairs() {
      const first = 1000;
      // 7 days before
      const timestamp = dayjs().startOf('hour').unix() - 7 * 24 * 60 * 60;
      // common vars
      const vars = { first, timestamp };

      this.pairsLoading = true;
      this.pairs = await PairsExplorer.getPairs(vars);
      this.pairsLoading = false;
    },
  },
};
</script>

