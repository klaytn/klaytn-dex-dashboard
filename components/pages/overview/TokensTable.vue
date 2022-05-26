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
      />

      <el-table-column
        prop="price"
        label="Price"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.price) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="priceChange"
        label="Price Change"
      >
        <template v-slot="{ row }">
          <span>{{ formatAmount(row.priceChange) }}%</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolume"
        label="Volume 24H"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tradeVolume) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="totalLiquidity"
        label="Total Deposited"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.totalLiquidity) }}</span>
        </template>
      </el-table-column>
    </template>
  </ui-table>
</template>

<script>
import { formatAmount } from '@/utils/formatters';

export default {
  name: "TokensTable",
  props: {
    data: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      formatAmount
    };
  },
}
</script>
