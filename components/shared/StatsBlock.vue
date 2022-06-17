<template>
  <div class="stats-block">
    <div class="stats-block-title">
      <slot name="title" />
    </div>
    <div class="stats-block-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsBlock',
  props: {
    title: {
      type: String,
      default: ''
    },
  },
};
</script>

<style lang="scss" scoped>
.stats-block {
  &-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    color: $gray4;
  }

  &-content {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;

    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: $dark2;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &-title + &-content {
    margin-top: 8px;
  }

  & + & {
    margin-top: 16px;
  }
}
</style>