<template>
  <ui-table
    :page.sync="page"
    :data="data"
    :loading="loading"
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
      >
        <template v-slot="{ row }">
          <nuxt-link :to="{ name: 'pools-id', params: { id: row.id } }">{{ row.name }}</nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="totalLiquidity"
        label="TVL"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.totalLiquidity) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolumeDay"
        label="Volume 24H"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tradeVolumeDay) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolumeWeek"
        label="Volume 7D"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tradeVolumeWeek) }}</span>
        </template>
      </el-table-column>
    </template>
  </ui-table>
</template>

<script>
import { formatAmount } from '@/utils/formatters';

export default {
  name: "PoolsTable",
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
      formatAmount
    };
  },
}
</script>
