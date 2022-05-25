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
      layout="slot"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
    >
      <icon class="ui-pagination-control ui-pagination-control--prev" name="union" @click.native="handlePrev" />
      <div class="ui-pagination-page">Page {{ page }} of {{ pages }}</div>
      <icon class="ui-pagination-control ui-pagination-control--next" name="union" @click.native="handleNext" />
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
    handlePrev() {
      if (this.page > 1) this.page = this.page - 1;
    },
    handleNext() {
      if (this.page < this.pages) this.page = this.page + 1;
    },
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

  &-page {
    padding: 0 16px;
  }

  &-control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    cursor: pointer;

    &--next {
      transform: rotate(180deg);
    }
  }
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
