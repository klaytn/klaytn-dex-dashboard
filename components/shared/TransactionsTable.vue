<template>
  <ui-table
    :page.sync="page"
    :data="filteredItems"
    :loading="loading"
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

import { TransactionTypes } from '@/consts';
import { formatAmount } from '@/utils/formatters';

export default {
  name: "TransactionsTable",
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      page: 1,
      activeType: TransactionTypes.all,
      // formatters
      formatAmount,
    }
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
      if (this.activeType === TransactionTypes.all) return this.data;

      return this.data.filter(item => item.type === this.activeType);
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
  },
}
</script>
