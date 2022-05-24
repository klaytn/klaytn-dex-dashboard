<template>
  <ui-table
    :data="data"
    :default-sort = "{prop: 'totalLiquidity', order: 'descending'}"
    style="width: 100%"
  >
    <template v-slot="{ startIndex }">
      <el-table-column
        label="#"
        width="84"
      >
        <template v-slot="{ $index }">
          <span>{{ startIndex + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="Name"
        sortable
      />

      <el-table-column
        prop="price"
        label="Price"
        sortable
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.price) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="priceChange"
        label="Price Change"
        sortable
      >
        <template v-slot="{ row }">
          <span>{{ formatAmount(row.priceChange) }}%</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolume"
        label="Volume 24H"
        sortable
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tradeVolume) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="totalLiquidity"
        label="Total Deposited"
        sortable
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.totalLiquidity) }}</span>
        </template>
      </el-table-column>
    </template>
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
