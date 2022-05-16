<template>
  <ui-table
    :data="data"
    style="width: 100%"
    class="ui-table"
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
    />
    <el-table-column
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
    </el-table-column>
    <el-table-column
      prop="volume"
      label="Volume 24H"
    >
      <template v-slot="{ row }">
        <span>${{ row.volume }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="tvl"
      label="TVL"
    >
      <template v-slot="{ row }">
        <span>${{ row.tvl }}</span>
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
  }
}
</script>
