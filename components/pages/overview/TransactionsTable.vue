<template>
  <ui-table
    :data="data"
    style="width: 100%"
  >
    <el-table-column>
      <template v-slot="{ row }">
        <span>{{ row.type }} {{ row.token0.symbol }} for {{ row.token1.symbol }}</span>
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
        <span>{{ row.from }}</span>
      </template>
    </el-table-column>
  </ui-table>
</template>

<script>
export default {
  name: "TokensTable",
  props: {
    data: {
      type: Array,
      required: true,
    }
  },
  methods: {
    formatAmount(amount) {
      const val = Number(amount);

      if (Math.trunc(val / 1_000_000) > 0) {
        return `${(val / 1_000_000).toFixed(2)}M`;
      } else if (Math.trunc(val / 1_000) > 0) {
        return `${(val / 1_000).toFixed(2)}K`;
      }

      return String(val.toFixed(2));
    },
  },
}
</script>
