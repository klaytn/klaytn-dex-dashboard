<template>
  <ui-card>
    <el-table
      :data="items"
      size="big"
      v-bind="$attrs"
      v-on="$listeners"
      style="width: 100%"
      class="ui-table"
    >
      <slot v-bind="{ startIndex }" />
    </el-table>
    <el-pagination
      class="ui-pagination"
      layout="prev,slot,next"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @prev-click="handlePage"
      @next-click="handlePage"
    >
      <div>Page {{ page }} of {{ pages }}</div>
    </el-pagination>
  </ui-card>
</template>

<script>
export default {
  name: "UITable",
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      page: 1
    }
  },
  computed: {
    total() {
      return this.data.length;
    },
    pages() {
      return Math.ceil(this.total / this.pageSize);
    },
    startIndex() {
      return (this.page - 1) * this.pageSize;
    },
    lastIndex() {
      return this.page * this.pageSize;
    },
    items() {
      return this.data.slice(this.startIndex, this.lastIndex);
    }
  },
  methods: {
    handlePage(num) {
      this.page = num;
    }
  }
}
</script>

<style lang="scss">
.ui-pagination {
  display: flex;
  align-items: center;
  padding: 8px 0px;
  min-height: 48px;
  font-size: 16px;
  line-height: 19px;
  color: $dark2;
}

.ui-table {
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

  &.el-table {
    .cell,
    th.el-table__cell > .cell {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
}
</style>
