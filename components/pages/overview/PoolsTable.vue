<template>
  <ui-table
    :data="data"
    :default-sort = "{prop: 'tvl', order: 'descending'}"
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
    <el-table-column
      prop="tvl"
      label="TVL"
      sortable
    >
      <template v-slot="{ row }">
        <span>${{ formatAmount(row.tvl) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dayVolume"
      label="Volume 24H"
      sortable
    >
      <template v-slot="{ row }">
        <span>${{ formatAmount(row.dayVolume) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="weekVolume"
      label="Volume 7D"
      sortable
    >
      <template v-slot="{ row }">
        <span>${{ formatAmount(row.weekVolume) }}</span>
      </template>
    </el-table-column>
  </ui-table>
</template>

<script>
export default {
  name: "PoolsTable",
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
