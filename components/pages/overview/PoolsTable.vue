<template>
  <ui-table
    :data="data"
    :page.sync="page"
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
        prop="tvl"
        label="TVL"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.tvl) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="dayVolume"
        label="Volume 24H"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.dayVolume) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="weekVolume"
        label="Volume 7D"
      >
        <template v-slot="{ row }">
          <span>${{ formatAmount(row.weekVolume) }}</span>
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
      required: true,
    }
  },
  data() {
    return {
      page: 1,
      formatAmount
    };
  },
}
</script>
