<template>
  <ui-table
    :data="data"
    :default-sort = "{prop: 'totalLiquidity', order: 'descending'}"
    style="width: 100%"
  >
    <el-table-column
      label="#"
      width="64"
    >
      <template v-slot="{ $index }">
        <span>{{ $index + 1 }}</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="name"
      label="Name"
      sortable
    />

    <!-- <el-table-column
      prop="price"
      label="Price"
    >
      <template v-slot="{ row }">
        <span>${{ row.price }}</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="priceChange"
      label="Price Change"
    >
      <template v-slot="{ row }">
        <span>{{ row.priceChange }} %</span>
      </template>
    </el-table-column> -->

    <el-table-column
      prop="tradeVolume"
      label="Volume 24H"
      sortable
    >
      <template v-slot="{ row }">
        <span>{{ formatAmount(row.tradeVolume) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="totalLiquidity"
      label="Total Deposited"
      sortable
    >
      <template v-slot="{ row }">
        <span>{{ formatAmount(row.totalLiquidity) }}</span>
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
