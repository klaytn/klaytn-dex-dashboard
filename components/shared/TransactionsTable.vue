<template>
  <ui-table
    v-loading="loading"
    :data="filteredItems"
    :page.sync="page"
    style="width: 100%"
  >
    <el-table-column width="252">
      <template #header>
        <ui-tags v-model="type" :tags="types" />
      </template>
      <template v-slot="{ row }">
        <span>{{ row.type }} {{ row.token0.symbol }} {{ formatType(row.type) }} {{ row.token1.symbol }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Total Value"
      prop="value"
    >
      <template v-slot="{ row }">
        <span>${{ formatAmount(row.value) }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Token Amount"
      prop="amount0"
    >
      <template v-slot="{ row }">
        <span>{{ formatAmount(row.amount0) }} {{ row.token0.symbol }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Token Amount"
      prop="amount1"
    >
      <template v-slot="{ row }">
        <span>{{ formatAmount(row.amount1) }} {{ row.token1.symbol }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Account"
      prop="from"
    >
      <template v-slot="{ row }">
        <span>{{ formatAddress(row.from, 12) }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Time"
      prop="timestamp"
    >
      <template v-slot="{ row }">
        <span>{{ formatTime(row.timestamp) }}</span>
      </template>
    </el-table-column>
  </ui-table>
</template>

<script>
import dayjs from 'dayjs';

import SubgraphClient from '@/services/subgraph/client';

import { OverviewTransactionsQuery, TransactionsByPairsQuery } from '@/services/subgraph/query/transactions';
import { TokenPairsQuery } from '@/services/subgraph/query/tokens';
import { TransactionTypes } from '@/consts';
import { formatAmount } from '@/utils/formatters';

const formatData = (data) => {
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

  if (data.mints.length !== 0 || data.burns.length !== 0) {
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
  }

  return null;
};

const getPairIdsFromTokenData = (data) => {
  return [...data.pairBase, ...data.pairQuote].map(pair => pair.id);
};

export default {
  name: "TransactionsTable",
  props: {
    token: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      items: [],
      loading: false,
      page: 1,
      activeType: TransactionTypes.all,
      // formatters
      formatAmount,
    }
  },
  mounted() {
    this.updateData();
  },
  computed: {
    type: {
      get() {
        return this.activeType;
      },
      set(value) {
        this.activeType = value;
        this.page = 1;
      }
    },
    types() {
      return Object.values(TransactionTypes);
    },
    filteredItems() {
      if (this.activeType === TransactionTypes.all) return this.items;

      return this.items.filter(item => item.type === this.activeType);
    }
  },
  methods: {
    formatTime(timestamp) {
      return dayjs().to(dayjs(timestamp));
    },
    formatAddress(address, length = address.length / 2) {
      return `${address.slice(0, length / 2)}...${address.slice(-length / 2)}`;
    },
    formatType(type) {
      return type === TransactionTypes.swap ? 'for' : 'and';
    },

    async updateData() {
      this.loading = true;

      if (this.token) {
        const { data: { token } } = await SubgraphClient.query(TokenPairsQuery, { id: this.token }).toPromise();
        const pairs = getPairIdsFromTokenData(token);
        this.items = await this.getTransactions(TransactionsByPairsQuery, { pairs });
      } else {
        this.items = await this.getTransactions();
      }

      this.loading = false;
    },

    async getTransactions(query = OverviewTransactionsQuery, vars = {}) {
      try {
        const { data: { transactions } } = await SubgraphClient.query(query, vars).toPromise();
        return transactions.map(data => formatData(data)).filter(item => !!item);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  },
}
</script>
