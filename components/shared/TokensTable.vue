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
          <span>{{ startIndex + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="Name"
      >
        <template v-slot="{ row }">
          <logo-token :address="row.id" :symbol="row.symbol" />
          <nuxt-link :to="{ name: 'tokens-id', params: { id: row.id } }">{{ row.name }}</nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="price"
        label="Price"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.price) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="priceChange"
        label="Price Change"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>{{ formatAmount(row.priceChange) }}%</span>
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
        prop="totalLiquidity"
        label="TVL"
      >
        <template v-slot="{ row, column }">
          <div class="cell-data" :data-label="column.label">
            <span>${{ formatAmount(row.totalLiquidity) }}</span>
          </div>
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
