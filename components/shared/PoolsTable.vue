<template>
  <ui-table
    :page.sync="page"
    :data="data"
    :loading="loading"
    style="width: 100%"
  >
    <template #head>
      <slot name="head" />
    </template>
    <template v-slot="{ startIndex }">
      <el-table-column
        label="#"
        width="84"
        class-name="screen-md"
      >
        <template v-slot="{ $index }">
          <div class="cell-data">
            <span>{{ startIndex + $index + 1 }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="Name"
      >
        <template v-slot="{ row }">
          <logo-pair>
            <logo-token :address="row.token0.id" :symbol="row.token0.symbol" />
            <logo-token :address="row.token1.id" :symbol="row.token1.symbol" />
          </logo-pair>
          <nuxt-link :to="{ name: 'pools-id', params: { id: row.id } }">{{ row.name }}</nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="totalLiquidity"
        label="TVL"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.totalLiquidity) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolumeDay"
        label="Volume 24H"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.tradeVolumeDay) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="tradeVolumeWeek"
        label="Volume 7D"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.tradeVolumeWeek) }}</span>
          </div>
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

<style lang="scss" scoped>
.pair-logo {
  display: flex;
}
</style>
