<template>
  <ui-table
    :page.sync="page"
    :data="filteredItems"
    :loading="loading"
    style="width: 100%"
  >
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <el-table-column width="252" class-name="visible">
        <template #header>
          <ui-tags v-model="type" :tags="types" />
        </template>
        <template v-slot="{ row }">
          <a :href="transactionLink(row.id)" target="_blank" rel="noopener noreferrer">
            {{ row.type }} {{ row.token0.symbol }} {{ formatType(row.type) }} {{ row.token1.symbol }}
          </a>
        </template>
      </el-table-column>

      <el-table-column
        label="Total Value"
        prop="value"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.value) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="Token Amount"
        prop="amount0"
      >
        <template v-slot="{ row,column }">
          <div class="cell-data" :data-label="column.label">
            <span>{{ formatAmount(row.amount0) }} {{ row.token0.symbol }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="Token Amount"
        prop="amount1"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>{{ formatAmount(row.amount1) }} {{ row.token1.symbol }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="Account"
        prop="from"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <a :href="accountLink(row.from)" target="_blank" rel="noopener noreferrer">
              {{ formatAddress(row.from, 12) }}
            </a>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="Time"
        prop="timestamp"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>{{ formatTime(row.timestamp) }}</span>
          </div>
        </template>
      </el-table-column>
    </template>
  </ui-table>
</template>

<script>
import dayjs from 'dayjs';

import { TransactionTypes } from '@/consts';
import { formatAmount, formatAddress } from '@/utils/formatters';
import { NetworkExplorer } from '@/utils/explorer';

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
      formatAddress
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
    formatType(type) {
      return type === TransactionTypes.swap ? 'for' : 'and';
    },
    transactionLink(id) {
      return NetworkExplorer.transactionLink(id);
    },
    accountLink(address) {
      return NetworkExplorer.accountLink(address);
    }
  },
}
</script>
