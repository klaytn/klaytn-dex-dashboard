<template>
  <ui-container>
    <ui-title>
      <div>Tokens</div>
    </ui-title>
    <shared-tokens-table :loading="tokensLoading" :data="tokens" />
  </ui-container>
</template>

<script>
import dayjs from 'dayjs';

import { TokensExplorer } from '@/services/subgraph/explorer';

export default {
  name: "TokensPage",
  data() {
    return {
      tokens: [],
      tokensLoading: false,
    }
  },
  mounted() {
    this.updateTokens();
  },
  methods: {
    async updateTokens() {
      const first = 1000;
      // two days before
      const timestamp = dayjs().startOf('hour').unix() - 2 * 24 * 60 * 60;
      const vars = { first, timestamp };

      this.tokensLoading = true;
      this.tokens = await TokensExplorer.getTokens(vars);
      this.tokensLoading = false;
    },
  }
}
</script>

