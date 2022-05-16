<template>
  <el-table
    v-bind="$attrs"
    v-on="$listeners"
    style="width: 100%"
    class="ui-table"
    border
    stripe
  >
    <template #header="{ column, $index }">
      <slot name="header" v-bind="{ column, $index }"/>
    </template>
    <template #default="{ column, row, $index }">
      <slot v-bind="{ column, row, $index }"/>
    </template>
  </el-table>
</template>

<script>
export default {
  name: "UITable",
  inheritAttrs: false,
}
</script>

<style lang="scss">
.ui-table {
  background: $white;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.05);
  border-radius: 20px;

  th {
    color: $gray4;
    font-weight: 500;
  }

  td {
    color: $dark2;
    font-weight: 600;
  }

  td, th {
    padding: 16px;
    font-size: 16px;
    line-height: 19px;
  }

  .cell {
    min-height: 24px;
  }
}
</style>
