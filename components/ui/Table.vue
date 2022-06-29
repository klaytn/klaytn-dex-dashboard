<template>
  <ui-card v-loading="loading">
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
      default: () => ([]),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
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
      if (this.page > 1) this.$emit('update:page', this.page - 1);
    },
    handleNext() {
      if (this.page < this.pages) this.$emit('update:page', this.page + 1);
    },
  }
}
</script>

<style lang="scss">
.ui-pagination {
  display: flex;
  align-items: center;
  padding: 8px 0px;
  margin: auto;
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
  @media screen and (max-width: $screen-md) {
    thead {
      display: block;

      th:not(.visible) {
        display: none;
      }
    }

    table, tbody, tr, td {
      display: block;
      width: initial !important;
    }

    tr {
      padding: 16px 0px;

      & + tr {
        border-top: 2px solid $gray3;
      }
    }

    &.el-table {
      th.el-table__cell.is-leaf,
      td.el-table__cell {
        border-bottom: none;
        padding: 6px 0px;
      }
    }

    .screen-md {
      display: none;
    }
  }

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
    display: flex;
    align-items: center;
    min-height: 24px;

    &-data {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media screen and (max-width: $screen-md) {
        flex: 1;
      }

      &:before {
        content: attr(data-label)"";

        display: none;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        color: $gray4;

        @media screen and (max-width: $screen-md) {
          display: inline-block;
        }
      }
    }

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &.el-table {
    .cell,
    th.el-table__cell > .cell {
      padding-left: 24px;
      padding-right: 24px;

      @media screen and (max-width: $screen-md) {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  }
}
</style>
